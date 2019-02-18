# tracker-beer-app template
This is a template of a project using [Tracker](https://www.mantleblockchain.com/tracker) to build a simple platform 
where microbreweries can create their beer bottles and track the bottles to encourage customers 
to return their empty bottles after consumption.
Buying new bottles is a marginal expense for microbreweries and putting in place a membership program where both 
the owner and the customers are winning is an interesting solution.

With that implementation, customers would rent their bottles and return them. 
That way, customers would only pay for the beer and brewers wouldn't need to buy new glass bottles as often.

## Before you start
You might find it easier to implement this project after reading our [documentation](https://developer.mantleblockchain.com/docs).

## Functionalities
- [x] Create Beer bottles with detailed specifications
- [x] Use NFC tags to Create, Sell and Return bottles
- [x] Sell beer bottles to customers and track which customer owns which bottle
- [x] Accept bottle returns to deduct them from a customer's bottle wallet
- [x] View customer wallets to see which bottle they own at any time
- [x] Adjust a customer's membership to increase or reduce their bottle renting limit
- [ ] Handle multiple users
- [ ] User creation procedure
- [ ] User identification with NFC tags

## Prerequisites
### Backend
You will need the update the following values in `services/settingsService.js` to run the backend project:

``` javascript
settings = {
    // The Mantle API you are using
    mantleApiUrl: 'http://api.mantleblockchain.com',
    // The URL of the front end 
    webAppUrl: 'http://localhost:8100',
    // The product Id of your Mantle Tracker instance
    trackerProductId: 'YOUR-TRACKER-PRODUCT-ID',
    // The email of the user in Mantle that acts as the owner
    ownerEmail: 'EMAIL-OF-THE-BREWERY-OWNER',
    // The API Key of the user that acts as the owner in Mantle
    ownerApiKey: 'OWNER-API-KEY',
    // The email of the user in Mantle that acts as a customer
    customerEmail: 'EMAIL-OF-ONE-OF-THE-CUSTOMERS',
    // The API Key of the user that acts as a customer in Mantle
    customerApiKey: 'CUSTOMER-API-KEY',
    // The Id of the asset in your Tracker instance that will act as the limit of bottles a customer can own
    membershipCoinId: 'ID-OF-THE-MEMBERSHIP-COIN-IN-TRACKER',
    // Serial Port where your NFC reader will publish new NFC tags
    nfcReaderSerialPort: "COM3",
    // Baud rate of your NFC reader's serial port
    nfcReaderBaudRate: 115200
}
```

### Frontend
You will need the update the following values in `src/providers/providers-settings.js` to run the front end project:

``` javascript
{
    // The URL of the node backend
    public backendUrl: string = 'http://localhost:3000';
    // The email of the user in Mantle that acts as a customer
    public customerEmail: string = 'EMAIL-OF-ONE-OF-THE-CUSTOMERS';
}
```
## Getting started
### Install dependencies:
- [Node.js](https://nodejs.org/en/)
- [Ionic Framework](https://ionicframework.com/getting-started#cli)

After the installations, run the following commands in your terminal at both the roots of the frontend and backend directory: `npm install`
### Run the application:
##### Frontend:
1. Go in the frontend directory
2. Run the following command: `ionic serve`

##### Backend:
1. Go in the backend directory
2. Run the following command: `npm start`

## Mantle API calls
In this section, we will explain how we used [Tracker](https://www.mantleblockchain.com/tracker) in our application.

**BOTTLE CREATION**

Create new bottle specifications
`POST /tracker/{product-id}/assets`

Create one multi-asset per scanned bottle
`POST /tracker/{product-id}/multiassets`


**PRE-SALE VALIDATION**

Find bottle ownership & membership limit
`GET /tracker/{product-id}/balances`

Find existing bottles in the system
`GET /tracker/{product-id}/multiassets`


**BOTTLE SALES**

Find existing bottles
`GET /tracker/{product-id}/multiassets`

Issue one multi-asset for all scanned bottles
`POST /tracker/{product-id}/multiassets/issue/bulk`


**MEMBERSHIP ADJUSTMENT**

Issue an amount of membership coin
`POST /tracker/{product-id}/assets/{asset-id}/issue`

OR

Transfer an amount of membership coin
`POST /tracker/{product-id}/assets/{asset-id}/transfer`


**PRE-RETURN VALIDATION**

Find bottle ownership & membership limit
`GET /tracker/{product-id}/balances`

Find existing bottles & match with bottle ownership
`GET /tracker/{product-id}/multiassets`


**BOTTLE RETURNS**

Find bottle ownership & membership limit
`GET /tracker/{product-id}/balances`

Transfer one multi-asset for all scanned bottles
`POST /tracker/{product-id}/assets/transfer/bulk`


## More docs
- [Mantle knowledge base](https://developer.mantleblockchain.com/docs)
- [Mantle API documentation](https://api.mantleblockchain.com/documentation)
