const express = require('express');
const router = express.Router({mergeParams: true});

const isLoggedIn = require('../middleware/isLoggedIn');
const { userOwnsList } = require('../middleware/list');
const List = require('../models/list');
const User = require('../models/user');

// 'index' route
router.get('/', isLoggedIn, (req, res) => {
    List.find({users: res.locals.user}, (err, lists) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error rendering lists: ${err.message}`);
            res.redirect('/');
        } else {
            res.render('lists/index', { lists });
        }
    });
});

// 'new' route
router.get('/new', isLoggedIn, (req, res) => {
    const redirectID = req.params.redirectID;
    res.render(`lists/new`, { redirectID });
});

// 'create' route
router.post('/', isLoggedIn, (req, res) => {
    let newList = req.body.list;
    newList.users = [res.locals.user];
    
    List.create(newList, (err, createdList) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error creating list: ${err.message}`);
        } else {
            console.log('Created: ' + createdList);
            req.flash(`success`, `Successfully created list!`);
        }

        // succeed or fail, send them to the same place
        // back to the list index page by default
        // or the show page for a specific restaurant if we have one
        let route = `/lists/`;
        if (req.body.redirectID) {
            route += `/retaurants/${req.body.redirectID}`;
        }
        res.redirect(route);
    });
});

// 'show' route
router.get('/:listID', isLoggedIn, (req, res) => {
    List.findById(req.params.listID).populate('restaurants').exec((err, foundList) => {
        if (err) {
            console.error(`Error: ${err.message}`);
            req.flash(`error`, `Error creating list: ${err.message}`);
        } else {
            const { _id } = (res.locals.user || {});
            User.findById(_id).populate('friends').exec((err, user) => {
                const friends = (user || {}).friends || [];
                res.render('lists/show', { list: foundList, friends });
            });
        }
    });
});

// 'edit' route
router.get('/:listID/edit', userOwnsList, (req, res) => {
    const { list } = res.locals;
    if (list) {
        res.render(`lists/edit`, { list });
    } else {
        req.flash(`error`, `Unknown error editing list`);
        res.redirect(`/lists`);
    }
});

// 'update' route
router.put('/:listID', userOwnsList, (req, res) => {
    // since we already have the list we can update it directly and save
    const { list } = res.locals;
    if (list) {
        Object.assign(list, req.body.list);
        list.save();
    } else {
        req.flash(`error`, `Unknown error editing list`);
    }

    res.redirect(`/lists/${req.params.listID}`);
});

// 'delete' route
router.delete('/:listID', userOwnsList, (req, res) => {
    // since we already have the list we can delete it directly
    const { list } = res.locals;
    if (list) {
        list.remove((err) => {
            if (err) {
                console.error(`Error: ${err.message}`);
                req.flash(`error`, `Failed to remove list: ${err.message}`);
            } else {
                req.flash(`success`, `List deleted`);
            }
        });
    } else {
        req.flash(`error`, `Unknown error deleting list`);
    }

    res.redirect(`/lists`);
});

// 'addOwner'
router.get('/:listID/addOwner/:userID', userOwnsList, (req, res) => {
    const { list } = res.locals;
    if (list && list.users.addToSet(req.params.userID).length) {
        list.save();
        req.flash(`success`, `Added as owner of the list!`);
    }

    // always send them back where they came from
    res.redirect('back');
});

module.exports = router;
