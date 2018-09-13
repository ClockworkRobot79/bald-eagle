const express = require('express');
const router = express.Router({mergeParams: true});

const { canEditRestaurant } = require('../middleware/restaurant');
const { userOwnsRating } = require('../middleware/rating');
const Rating = require('../models/rating');

// 'index' route
// no reason to view all ratings on their own, redirect to restaurant index page
router.get('/', (req, res) => {
    res.redirect('/restaurants');
});

// 'new' route
router.get('/new', canEditRestaurant, (req, res) => {
    const { restaurant } = res.locals;
    if (restaurant) {
        res.render(`ratings/new`, {restaurant});
    }
});

// 'show' route
// no reason to view a single rating, redirect to restaurant index page
router.get('/:ratingID', (req, res) => {
    res.redirect('/restaurants');
});

// 'create' route
router.post('/', canEditRestaurant, (req, res) => {
    const newRating = {
        rating: req.body.rating,
        comment: req.body.comment,
        date: Date.now(),
        user: res.locals.user,
    };
    
    Rating.create(newRating, (err, createdRating) => {
        const { restaurant } = res.locals;
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error creating rating: ${err.message}`);
        } else if (restaurant) {
            restaurant.ratings.push(createdRating);
            restaurant.save();

            console.log('Created: ' + createdRating);
            req.flash(`success`, `Successfully created rating!`);
            res.redirect(`/restaurants/${restaurant._id}`);
        } else {
            req.flash(`error`, `Unknown error creating rating`);
            res.redirect('back');
        }
    });
});

// 'edit' route
router.get('/:ratingID/edit', canEditRestaurant, userOwnsRating, (req, res) => {
    const { restaurant, rating } = res.locals;
    if (restaurant && rating) {
        res.render(`ratings/edit`, {restaurant, rating});
    } else {
        req.flash(`error`, `Unknown error editing rating`);
        res.redirect(`/restaurants`);
    }
});

// 'update' route
router.put('/:ratingID', canEditRestaurant, userOwnsRating, (req, res) => {
    // since we already have the rating we can update it directly and save
    const { restaurant, rating } = res.locals;
    if (restaurant && rating) {
        Object.assign(rating, req.body.rating);
        rating.save();
        res.redirect(`/restaurants/${restaurant._id}`);
    } else {
        req.flash(`error`, `Unknown error editing rating`);
        res.redirect(`/restaurants`);
    }
});

// 'delete' route
router.delete('/:ratingID', canEditRestaurant, userOwnsRating, (req, res) => {
    // since we already have the rating we can delete it directly
    const { restaurant, rating } = res.locals;
    if (restaurant && rating) {
        rating.remove((err) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                req.flash(`error`, `Failed to remove rating: ${err.message}`);
            } else {
                req.flash(`success`, `Rating deleted`);
            }
    
            res.redirect(`/restaurants/${restaurant._id}`);
        });
    } else {
        req.flash(`error`, `Unknown error deleting rating`);
        res.redirect(`/restaurants`);
    }
});

module.exports = router;
