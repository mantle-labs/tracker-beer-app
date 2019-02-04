const axios = require('axios');
import settingsService from '../services/settingsService';

exports.getOwnerInstance = () => {
    return axios.create({
        headers: {
            common: {
                'x-api-key': settingsService.settings.ownerApiKey
            }
        }
    });
}

exports.getCustomerInstance = () => {
    // User management logic is hard coded here
    return axios.create({
        headers: {
            common: {
                'x-api-key': settingsService.settings.customerApiKey
            }
        }
    });
}