const express = require('express');
const router = express.Router({mergeParams: true});

const isLoggedIn = require('../middleware/isLoggedIn');
const { canEditRestaurant } = require('../middleware/restaurant');
const { filterUserOwned, limitText } = require('../utils/misc');
const List = require('../models/list');
const Recommendation = require('../models/recommendation');
const Note = require('../models/note');
const Restaurant = require('../models/restaurant');

// 'index' route
router.get('/', (req, res) => {
    Restaurant.find({}).sort('name').exec((err, restaurants) => {
        if (err) {
            console.error(`Error getting restaurants: ${err.message}`);
            res.redirect('/');
        } else {
            Recommendation.find({ for: req.user, menuItem: undefined }).populate('restaurant').exec((err, recommendations) => {
                if (err) {
                    console.error(`Error getting restaurants: ${err.message}`);
                    res.redirect('/');
                } else {
                    res.render('restaurants/index', { restaurants, recommendations });
                }
            });
        }
    });
});

// 'new' route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('restaurants/new');
});

// 'create' route
router.post('/', isLoggedIn, (req, res) => {
    const newRestaurant = {
        name: req.body.name,
        description: req.body.description,
        website: req.body.website,
        phone: req.body.phone,
        location: {
            address: req.body.address,
            lat: req.body.lat,
            long: req.body.long,
        },
    };
    
    Restaurant.create(newRestaurant, (err, createdRestaurant) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error creating restaurant: ${err.message}`);
        } else {
            console.log('Created: ' + createdRestaurant);
            req.flash(`success`, `Successfully created restaurant!`);
            res.redirect(`/restaurants/${createdRestaurant._id}`);
        }
    });
});

function averageRating(ratings, user) {
    let count = 0;
    let total = 0;
    if (user) {
        for (let r of ratings) {
            if (r.user && r.user._id.equals(user._id)) {
                count++;
                total += r.rating;
            }
        }
    }

    return (count ? Math.round(total / count * 10) / 10 : '+');
}

// 'show' route
router.get('/:restaurantID', (req, res) => {
    Restaurant.findById(req.params.restaurantID).populate({path: 'menuItems', options: {sort: 'name'}, populate: {path: 'ratings', options: {sort: {'createdAt': -1}}}}).populate({path: 'ratings', options: {sort: {'createdAt': -1}}}).exec((err, restaurant) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            return res.redirect(`/restaurants`);
        } else {
            List.find({ users: res.locals.user }, (err, lists) => {
                if (err) {
                    console.error(`Error fetching lists: ${err.message}`);
                    return res.redirect(`/restaurants`);
                } else {
                    Recommendation.find({ for: req.user, restaurant: req.params.restaurantID }).where('menuItem').ne(null).populate('menuItem').exec((err, recommendations) => {
                        if (err) {
                            console.error(`Error fetching recommendations: ${err.message}`);
                            return res.redirect(`/restaurants`);
                        } else {
                            Note.findOne({ about: restaurant, user: res.locals.user }, (err, note) => {
                                if (err) {
                                    console.error(`Error fetching note: ${err.message}`);
                                    return res.redirect(`/restaurants`);
                                } else {
                                    res.render('restaurants/show', { restaurant, averageRating, filterUserOwned, lists, recommendations, note, limitText });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

// 'edit' route
router.get('/:restaurantID/edit', canEditRestaurant, (req, res) => {
    const { restaurant } = res.locals;
    if (restaurant) {
        res.render('restaurants/edit', { restaurant });
    }
});

// 'update' route
router.put('/:restaurantID', canEditRestaurant, (req, res) => {
    // since we already have the restaurant we can update it directly and save
    // othwerwise we would need to do the following:
    //   Restaurant.findByIdAndUpdate(req.params.restaurantID, req.body.restaurant, (err, updatedCampground) => {
    const { restaurant } = res.locals;
    if (restaurant) {
        req.body.restaurant.location = {
            address: req.body.restaurant.address,
            lat: req.body.restaurant.lat,
            long: req.body.restaurant.long,
        };
        delete req.body.restaurant.address;
        Object.assign(restaurant, req.body.restaurant);
        restaurant.save();
        res.redirect(`/restaurants/${restaurant._id}`);
    }
});

// 'delete' route
router.delete('/:restaurantID', canEditRestaurant, (req, res) => {
    // since we already have the restaurant we can delete it directly
    // othwerwise we would need to do the following:
    //   Restaurant.findByIdAndRemove(req.params.restaurantID, (err) => {
    const { restaurant } = res.locals;
    if (restaurant) {
        restaurant.remove((err) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                req.flash(`error`, `Failed to remove restaurant: ${err.message}`);
            } else {
                req.flash(`success`, `Restaurant deleted`);
            }
    
            res.redirect('/restaurants');
        });
    }
});

module.exports = router;
