const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
module.exports = (...roles) => {
// ['Customer', 'Manager', 'SalesClerk', 'Cashier', 'Supplier', 'Admin'
    return (req, res, next) => {
        if (!roles.includes(req.CurrentUser.role)) {
            const error = appError.create('the role is not Authorized ', 401, httpStatusText.FAIL);
            return next(error);
        }
        next();
    }

}