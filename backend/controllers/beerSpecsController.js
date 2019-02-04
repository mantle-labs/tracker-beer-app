import settingsService from '../services/settingsService';
import restService from '../services/restService';
import beerSpecTypes from '../enums/beerSpecTypes';

exports.getBeerSpecs = async() => {
    const http = restService.getOwnerInstance();
    const assets = await http.get(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/assets?limit=1000`);
    
    let specs = {};
    assets.data.forEach(asset => {
        const validBeerSpecId = beerSpecTypes.beerSpecIds.find(x => asset.name.endsWith(x));
        if (validBeerSpecId) {
            const newAsset = { id: asset.id, name: asset.name.replace(`|${validBeerSpecId}`, '') };
            const beerSpecLabel = beerSpecTypes.beerSpecLabelsById[validBeerSpecId];
            specs[beerSpecLabel] = specs[beerSpecLabel] ? specs[beerSpecLabel].concat(newAsset) : [newAsset];
        }
    });

    return specs;
}

exports.getAll = async (req, res) => {
    try {
        res.json(await exports.getBeerSpecs());
    } catch (e) {
        res.status(400);
        res.json();
    }
};