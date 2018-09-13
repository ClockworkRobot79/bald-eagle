const Rating = require('../models/rating');
const isLoggedIn = require('./isLoggedIn');
const { isOwner } = require('../utils/misc');

module.exports = {
    /**
     * Passes if the rating referenced in req is found
     */
    cacheRating: (req, res, next) => {
        Rating.findById(req.params.ratingID, (err, rating) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                req.flash(`error`, `Rating not found: ${err.message}`);
                return res.redirect(`back`);
            }

            // pass the rating through to the next route
            res.locals.rating = rating;
            return next();
        });
    },

    /**
     * Passes if there is a valid user,
     * the rating referenced in req is found,
     * and the current user is the creator
     */
    userOwnsRating: (req, res, next) => {
        isLoggedIn(req, res, () => {
            module.exports.cacheRating(req, res, () => {
                const { rating } = res.locals;
                if (isOwner(req.user, rating, 'user')) {
                    return next();
                }

                req.flash(`error`, `You don't have permission for that`);

                // clear out the rating so it isn't used by accident
                delete res.locals.rating;

                // if they are logged in but anything else goes wrong,
                // just send them back where they came from
                res.redirect('back');
            });
        });
    },
}
