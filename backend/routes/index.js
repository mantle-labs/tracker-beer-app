import beerSpecs from '../controllers/beerSpecsController';
import bottles from '../controllers/bottlesController';
import memberships from '../controllers/membershipsController';

export default (app) => {
    app.route('/beerspecs')
        .get(beerSpecs.getAll);

    app.route('/bottles')
        .post(bottles.create);

    app.route('/bottles/ownership')
        .get(bottles.customerOwnership);
        
    app.route('/bottles/ownership/detailed')
        .get(bottles.detailedCustomerOwnership);

    app.route('/bottles/sell')
        .post(bottles.sell);
        
    app.route('/bottles/validate')
        .post(bottles.validate);

    app.route('/bottles/return')
        .post(bottles.return);

    app.route('/memberships')
        .put(memberships.update);
};