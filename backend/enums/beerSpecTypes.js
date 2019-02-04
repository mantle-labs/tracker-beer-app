exports.types = {
    INGREDIENT: '3878-41d9-921e',
    LOCATION: '7b0d-4370-9c35',
    BEER_TYPE: 'e83d-40da-84bb',
    DESCRIPTION: '2492-48ec-9d2d',
    BOTTLE_SIZE: '4f6c-4a59-9032'
};

exports.beerSpecIds = Object.keys(exports.types).map(x => exports.types[x]);

exports.beerSpecLabelsById = Object.keys(exports.types)
    .reduce(function(obj,key){
        obj[exports.types[key]] = key;
        return obj;
    }, {});