const MenuItem = require('../models/menuItem');
const isLoggedIn = require('./isLoggedIn');
const { isOwner } = require('../utils/misc');

module.exports = {
    /**
     * Passes if the menu item referenced in req is found
     */
    cacheMenuItem: (req, res, next) => {
        MenuItem.findById(req.params.menuItemID, (err, menuItem) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                req.flash(`error`, ` not found: ${err.message}`);
                return res.redirect(`back`);
            }

            // pass the menu item through to the next route
            res.locals.menuItem = menuItem;
            return next();
        });
    },

    /**
     * Passes if there is a valid user,
     * the menu item referenced in req is found,
     * and the current user is the creator
     */
    userOwnsMenuItem: (req, res, next) => {
        isLoggedIn(req, res, () => {
            module.exports.cacheMenuItem(req, res, () => {
                const { menuItem } = res.locals;
                if (isOwner(req.user, menuItem, 'user')) {
                    return next();
                }

                req.flash(`error`, `You don't have permission for that`);

                // clear out the menu item so it isn't used by accident
                delete res.locals.menuItem;

                // if they are logged in but anything else goes wrong,
                // just send them back where they came from
                res.redirect('back');
            });
        });
    },
}
