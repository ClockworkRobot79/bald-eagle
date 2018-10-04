const express = require('express');
const router = express.Router({mergeParams: true});

const isLoggedIn = require('../middleware/isLoggedIn');
const { cacheRestaurant } = require('../middleware/restaurant');
const { canEditMenuItem } = require('../middleware/menuItem');
const { filterUserOwned, limitText } = require('../utils/misc');

const MenuItem = require('../models/menuItem');

// 'index' route
// no reason to view all menuItems on their own, redirect to restaurant index page
router.get('/', (req, res) => {
    res.redirect('/restaurants');
});

// 'new' route
router.get('/new', isLoggedIn, cacheRestaurant, (req, res) => {
    const { restaurant } = res.locals;
    if (restaurant) {
        res.render('menuItems/new', { restaurant });
    } else {
        res.redirect('back');
    }
});

// 'create' route
router.post('/', isLoggedIn, cacheRestaurant, (req, res) => {
    const newMenuItem = {
        name: req.body.name,
        description: req.body.description,
    };
    
    MenuItem.create(newMenuItem, (err, createdMenuItem) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error creating menuItem: ${err.message}`);
            return res.redirect('back');
        } else {
            console.log('Created: ' + createdMenuItem);
            req.flash(`success`, `Successfully created menu item!`);
            const { restaurant } = res.locals;
            if (restaurant) {
                restaurant.menuItems.push(createdMenuItem);
                restaurant.save();
                return res.redirect(`/restaurants/${restaurant._id}`);
            }
        }

        res.redirect('/restaurants');
    });
});

// 'show' route
router.get('/:menuItemID', cacheRestaurant, (req, res) => {
    MenuItem.findById(req.params.menuItemID).populate({path: 'ratings', options: {sort: {'createdAt': -1}}}).exec((err, menuItem) => {
        if (err) {
            console.error(`Error: ${err.message}`);
        } else {
            const { restaurant } = res.locals;
            res.render('menuItems/show', { menuItem, restaurant, filterUserOwned, limitText });
        }
    });
});

// 'edit' route
router.get('/:menuItemID/edit', canEditMenuItem, cacheRestaurant, (req, res) => {
    const { menuItem, restaurant } = res.locals;
    if (menuItem) {
        res.render('menuItems/edit', { menuItem, restaurant });
    }
});

// 'update' route
router.put('/:menuItemID', canEditMenuItem, cacheRestaurant, (req, res) => {
    const { menuItem, restaurant } = res.locals;
    if (menuItem && restaurant) {
        Object.assign(menuItem, req.body.menuItem);
        menuItem.save();
        if (restaurant) {
            return res.redirect(`/restaurants/${restaurant._id}`);
        }
    }

    res.redirect(`/restaurants`);
});

// 'delete' route
router.delete('/:menuItemID', canEditMenuItem, cacheRestaurant, (req, res) => {
    const { menuItem } = res.locals;
    if (menuItem) {
        menuItem.remove((err) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                req.flash(`error`, `Failed to remove menuItem: ${err.message}`);
            } else {
                req.flash(`success`, `Menu item deleted`);
            }

            const { restaurant } = res.locals;
            if (restaurant) {
                res.redirect(`/restaurants/${restaurant._id}`);
            } else {
                res.redirect(`/restaurants`);
            }
        });
    }
});

module.exports = router;
