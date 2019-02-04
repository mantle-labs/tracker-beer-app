import settingsService from '../services/settingsService';
import restService from '../services/restService';

exports.update = async (req, res) => {
    try {
        if (!req.body.membershipCoinChange){
            throw new Error('No amount to change was provided');
        }

        if (req.body.membershipCoinChange > 0) {
            const http = restService.getOwnerInstance();

            const issueRequest = {
                recipientEmail: settingsService.settings.customerEmail,
                amount: req.body.membershipCoinChange
            };

            try {
                await http.post(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/assets/${settingsService.settings.membershipCoinId}/issue`, issueRequest);
            } catch (e) {
                throw new Error("Couldn't increment the membership");
            }
        } else if (req.body.membershipCoinChange < 0) {
            
            // User management logic is hard coded here
            const http = restService.getCustomerInstance();
            
            const transferRequest = {
                recipientEmail: settingsService.settings.ownerEmail,
                amount: -req.body.membershipCoinChange
            };

            try {
                await http.post(`${settingsService.settings.mantleApiUrl}/tracker/${settingsService.settings.trackerProductId}/assets/${settingsService.settings.membershipCoinId}/transfer`, transferRequest);
            } catch (e) {
                throw new Error("Couldn't decrement the membership");
            }
        }

        res.json();
    } catch(e) {
        res.status(400);
        res.json();
    }
};