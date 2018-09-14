const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const { canEditRestaurant } = require('../middleware/restaurant');
const { filterUserOwned } = require('../utils/misc');
const Restaurant = require('../models/restaurant');

// 'index' route
router.get('/', (req, res) => {
    Restaurant.find({}, (err, restaurants) => {
        if (err) {
            console.error(`Error: ${err.message}`);
        } else {
            res.render('restaurants/index', {restaurants});
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
        location: {
            address: req.body.address,
            // lat: Number,  //* TODO: figure out how to pull info from phone/browser
            // long: Number, //*       or look it up from address
        },
    };
    
    Restaurant.create(newRestaurant, (err, createdRestaurant) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error creating restaurant: ${err.message}`);
        } else {
            console.log('Created: ' + createdRestaurant);
            req.flash(`success`, `Successfully created restaurant!`);
            res.redirect('/restaurants');
        }
    });
});

function averageRating(ratings, user) {
    let count = 0;
    let total = 0;
    for (let r of ratings) {
        if (r.user._id.equals(user._id)) {
            count++;
            total += r.rating;
        }
    }

    return (count ? total / count : '--');
}

// 'show' route
router.get('/:restaurantID', (req, res) => {
    Restaurant.findById(req.params.restaurantID).populate('menuItems').populate('ratings').exec((err, restaurant) => {
        if (err) {
            console.error(`Error: ${err.message}`);
        } else {
            res.render('restaurants/show', {restaurant, averageRating, filterUserOwned});
        }
    });
});

// 'edit' route
router.get('/:restaurantID/edit', canEditRestaurant, (req, res) => {
    const { restaurant } = res.locals;
    if (restaurant) {
        res.render('restaurants/edit', {restaurant});
    }
});

// 'update' route
router.put('/:restaurantID', canEditRestaurant, (req, res) => {
    // since we already have the restaurant we can update it directly and save
    // othwerwise we would need to do the following:
    //   Restaurant.findByIdAndUpdate(req.params.restaurantID, req.body.restaurant, (err, updatedCampground) => {
    const { restaurant } = res.locals;
    if (restaurant) {
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
