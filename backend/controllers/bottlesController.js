import settingsService from '../services/settingsService';
import restService from '../services/restService';
import beerSpecsController from './beerSpecsController';
import beerSpecTypes from '../enums/beerSpecTypes';

exports.create = async (req, res) => {
    try {
        const http = restService.getOwnerInstance();
    
        // Get all type assets
        const beerSpecs = await beerSpecsController.getBeerSpecs();
        if (!req.body.specs || !req.body.bottleIds) {
            throw new Error("No bottles or beer specifications were provided"); // Throw if no spec or bottle was provided
        }
    
        // Find which provided spec already exists and which doesn't
        let newSpecNames = [];
        let existingSpecIds = [];
        req.body.specs.forEach(spec => {
            const assetName = `${spec.name}|${beerSpecTypes.types[spec.type]}`;
            if (beerSpecs[spec.type] && beerSpecs[spec.type].some(x => x.name === spec.name)) {
                existingSpecIds.push(beerSpecs[spec.type].find(x => x.name === spec.name).id);
            } else {
                newSpecNames.push(assetName);
            }
        });
    
        // Create all specs that don't exist and store their id
        let newSpecIds =  [];

        for (let name of newSpecNames) {
                const newAsset = await http.post(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/assets`, { name });
                newSpecIds.push(newAsset.data.id);
        }

        const assetIds = newSpecIds.concat(existingSpecIds);
    
        // Foreach provided bottleids, create a multiasset with the bottle asset as a new child asset (to make them unique)
        for (let bottleId of req.body.bottleIds) {
            const multiAssetRequest = {
                name: bottleId,
                assetIds,
                assetDisplayNames: [bottleId + "|bottle"]
            }
            try {
                await http.post(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/multiassets`, multiAssetRequest);
            } catch (e) {
                throw new Error("Couldn't create bottle");
            }
        }
    
        res.json();
    }
    catch(e) {
        res.status(400);
        res.json();
    }
};

exports.validate = async (req, res) => {
    try {
        const http = restService.getOwnerInstance();

        if (!req.body.bottleIds) {
            throw new Error("No bottles were provided");
        }
        
        const bottleAssets = await http.get(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/multiassets?limit=1000`);

        let bottles = [];

        for (let bottleId of req.body.bottleIds) {
            const bottle = bottleAssets.data.find(x => x.name === bottleId);
            if (bottle) {
                let specs = {};
                bottle.assets.forEach(asset => {
                    const validBeerSpecId = beerSpecTypes.beerSpecIds.find(x => asset.displayName.endsWith(x));
                    if (validBeerSpecId) {
                        const newAsset = { id: asset.id, name: asset.displayName.replace(`|${validBeerSpecId}`, '') };
                        const beerSpecLabel = beerSpecTypes.beerSpecLabelsById[validBeerSpecId];
                        specs[beerSpecLabel] = specs[beerSpecLabel] ? specs[beerSpecLabel].concat(newAsset) : [newAsset];
                    }
                });

                bottles.push({ name: bottle.name, specs })
            } else {
                bottles.push({ name: null, specs: {}})
            }
        }

        res.json(bottles);
    }
    catch (e) {
        res.status(400);
        res.json();
    }
}

exports.customerOwnership = async (req, res) => {
    try {
        res.json(await getCustomerOwnership());
    }
    catch (e) {
        res.status(400);
        res.json();
    }
};

exports.detailedCustomerOwnership = async (req, res) => {
    try {
        
        // User management logic is hard coded here
        const ownership = await getCustomerOwnership();
        const http = restService.getCustomerInstance();
        const bottleAssets = await http.get(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/multiassets?limit=1000`);

        const validBottles = ownership.ownerships.map(x => bottleAssets.data.find(b => b.name === x.name));
        let bottles = [];

        for (let bottle of validBottles) {
            let specs = {};
            bottle.assets.forEach(asset => {
                const validBeerSpecId = beerSpecTypes.beerSpecIds.find(x => asset.displayName.endsWith(x));
                if (validBeerSpecId) {
                    const newAsset = { id: asset.id, name: asset.displayName.replace(`|${validBeerSpecId}`, '') };
                    const beerSpecLabel = beerSpecTypes.beerSpecLabelsById[validBeerSpecId];
                    specs[beerSpecLabel] = (specs[beerSpecLabel] || []).concat(newAsset);
                }
            });

            bottles.push({ name: bottle.name, specs })
        }

        res.json({ ownerships: bottles, membershipLimit: ownership.membershipLimit });
    }
    catch (e) {
        res.status(400);
        res.json();
    }
};

exports.sell = async (req, res, next) => {
    try {
        const http = restService.getOwnerInstance();
        const bottleIds = req.body.bottleIds;
        const bottleAssets = await http.get(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/multiassets?limit=1000`);
        const validBottleAssets = bottleAssets.data.filter(x => bottleIds.some(y => y === x.name));
        const bottleAssetIds = validBottleAssets.map(x => x.name);

        if (!bottleIds.every(b => bottleAssetIds.some(x => x === b))){
            throw new Error("One or more bottles don't exist");
        }

        // User management logic is hard coded here
        const userOwnership = await getCustomerOwnership();

        if (userOwnership.membershipLimit - bottleIds.length - userOwnership.ownerships.length < 0){
            throw new Error(`User already possesses ${userOwnership.ownerships.length} bottles on their ${userOwnership.membershipLimit} membership limit.`); // throw if the user cannot buy that many bottles
        }

        // Issue one asset per bottle to the customer
        const issueRequest = validBottleAssets.map(x => {
            return {
                assetId: x.id,
                recipientEmail: settingsService.settings.customerEmail,
                amount: 1
            };
        });

        try {
            await http.post(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/multiassets/issue/bulk`, issueRequest);
        } catch (e) {
            throw new Error(`Couldn't sell bottles to user.`);
        }
    
        res.json();
    } catch (e) {
        res.status(400);
        res.json();
    }
};

exports.return = async (req, res) => {
    try {
        // User management logic is hard coded here
        const http = restService.getCustomerInstance();
        const bottleIds = req.body.bottleIds;
        const userOwnership = await getCustomerOwnership();
        const userBottleIdOwnerships = userOwnership.ownerships;
    
        if (!bottleIds.every(x => userBottleIdOwnerships.some(b => b.name == x))) {
            throw new Error('One of the bottles is not owned by the customer'); // throw if one bottleId doesn't exist in the customer's wallet
        }

        const transferRequest = userBottleIdOwnerships
            .filter(x => bottleIds.some(b => b === x.name))
            .map(x => {
                return {
                    assetId: x.id,
                    recipientEmail: settingsService.settings.ownerEmail,
                    amount: 1
                };
            });
    
        await http.post(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/assets/transfer/bulk`, transferRequest);
        res.json();
    }
    catch (e) {
        res.status(400);
        res.json();
    }
};


const getCustomerOwnership = async () => {
    // User management logic is hard coded here
    const http = restService.getCustomerInstance();
    const response = await http.get(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/balances`);
    const membershipCoinBalance = response.data.filter(x => x.id === settingsService.settings.membershipCoinId);

    return {
        ownerships: response.data
            .filter(x => x.id !== settingsService.settings.membershipCoinId && x.amount > 0)
            .map(x => { return { id: x.id, name: x.displayName }; }),
        membershipLimit: membershipCoinBalance.length > 0 ? membershipCoinBalance[0].amount : 0
    };
}