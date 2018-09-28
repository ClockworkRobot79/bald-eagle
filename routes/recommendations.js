const express = require('express');
const router = express.Router({mergeParams: true});

const isLoggedIn = require('../middleware/isLoggedIn');
const Recommendation = require('../models/recommendation');

// 'add' recommendation
router.get('/', isLoggedIn, (req, res) => {
    const recommendation = {
        for: req.params.friendID,
        restaurant: req.query.restaurant,
        menuItem: req.query.menuItem,
    };
    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
    };

    Recommendation.findOneAndUpdate(recommendation, recommendation, options, (err, createdRecommendation) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error rendering lists: ${err.message}`);
        } else {
            if (createdRecommendation.from.addToSet(res.locals.user).length) {
                createdRecommendation.save();
                req.flash(`success`, `Recommendation created!`);
            } else {
                req.flash(`warning`, `You already recommended that to them... be patient`);
            }
        }

        // always send them back where they came from
        res.redirect('back');
    });
});

// 'remove' a recommendation
router.delete('/:recommendationID', isLoggedIn, (req, res) => {
    Recommendation.findByIdAndRemove(req.params.recommendationID, (err, recommendation) => {
      if (err) {
            req.flash('error', 'Failed to delete recommendation');
        } else {
            req.flash('success', 'Recommendation deleted');
        }

        res.redirect('back');
    });
});

module.exports = router;
