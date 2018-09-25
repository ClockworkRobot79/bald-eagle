const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');

// 'index' route
router.get('/', isLoggedIn, (req, res) => {
    User.findById(res.locals.user._id).populate('friends').exec((err, user) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            res.redirect(`/users/${res.locals.user._id}/friends`);
        } else {
            const friends = user.friends;
            res.render('friends/index', { friends });
        }
    });
});

// 'new' route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('friends/new');
});

function clean(obj) {
    for (var propName in obj) { 
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
            delete obj[propName];
        }
    }

    return obj;
}

// 'create' route
router.post('/', isLoggedIn, (req, res) => {
    User.find(clean(req.body.friend), (err, foundUsers) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error adding friend: ${err.message}`);
        } else if (foundUsers.length === 1) {
            const foundUser = foundUsers[0];
            res.locals.user.friends.push(foundUser);
            res.locals.user.save();

            // add the current user to the friend's list as well
            foundUser.friends.push(res.locals.user);
            foundUser.save();

            console.log('Added: ' + foundUser);
            req.flash(`success`, `Successfully added friend!`);
        } else {
            req.flash(`error`, `Found more than one user with those details, please be more specific`);
        }

        // succeed or fail, send them back to the friend index page
        res.redirect(`/users/${res.locals.user._id}/friends`);
    });
});

// 'show' route
router.get('/:friendID', isLoggedIn, (req, res) => {
    User.findById(req.params.friendID, (err, friend) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            res.redirect(`/users/${res.locals.user._id}/friends`);
        } else {
            const restaurantRatings = {
                path: 'ratings',
                match: {
                    user: req.params.friendID
                }
            };
            const menuItemRatings = {
                path: 'menuItems',
                populate: {
                    path: 'ratings',
                    match: {
                        user: req.params.friendID
                    }
                }
            };
            Restaurant.find({}).populate(restaurantRatings).populate(menuItemRatings).exec((err, restaurants) => {
                if (err) {
                    console.error(`Error: ${err.message}`);
                    res.redirect(`/users/${res.locals.user._id}/friends`);
                } else {
                    // pull all the ratings from restaurants and menu items for this friend
                    // we can't just pull the ratings directly because they don't have a link back to what they are rating
                    // and we need that so we can direct link to it
                    let recent = [];
                    restaurants.forEach((restaurant) => {
                        restaurant.ratings.forEach((rating) => {
                            recent.push({
                                rating,
                                restaurant,
                            });
                        });

                        restaurant.menuItems.forEach((menuItem) => {
                            menuItem.ratings.forEach((rating) => {
                                recent.push({
                                    rating,
                                    restaurant,
                                    menuItem,
                                });
                            });
                        });
                    });

                    // show most recent first
                    recent.sort((a, b) => {
                        return (a.rating.date < b.rating.date);
                    });

                    // show them a couple at a time
                    const pageSize = (req.query.pageSize || 5);
                    const page = (req.query.p || 0);
                    const start = page * pageSize;
                    const end = start + pageSize;
                    const urlBase = `/users/${res.locals.user._id}/friends/${req.params.friendID}?p=`;
                    const prevPage = (page > 0 ? urlBase + (page - 1) : undefined);
                    const nextPage = (end < recent.length ? urlBase + (page + 1) : undefined);
                    recent = recent.slice(start, end);

                    const friendName = (friend.firstName || friend.username);
                    res.render('friends/show', { friendName, recent, prevPage, nextPage });
                }
            });
        }
    });
});

// 'edit' route
router.get('/:friendID/edit', isLoggedIn, (req, res) => {
    // doesn't make sense to edit your friends at this point
    res.redirect(`/users/${res.locals.user._id}/friends`);
});

// 'update' route
router.put('/:friendID', isLoggedIn, (req, res) => {
    // doesn't make sense to edit your friends at this point
    res.redirect(`/users/${res.locals.user._id}/friends`);
});

// 'delete' route
router.delete('/:friendID', isLoggedIn, (req, res) => {
    const { user } = res.locals;
    user.friends = user.friends.filter((friend) => { return !friend._id.equals(req.params.friendID); });
    user.save();
});

module.exports = router;
