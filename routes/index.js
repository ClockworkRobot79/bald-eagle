const express = require('express');
const router = express.Router({mergeParams: true});

// index route
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/bald-eagle', (req, res) => {
    const facts = [
        {
            img: "size",
            text: [
                "Bald eagles can grow as large as 10 feet from head to foot with a wingspan of 13 feet.",
                "Bald eagles can grow as large as 43 inches from head to foot with a wingspan of 8 feet.",
            ],
        },
        {
            img: "babies",
            text: [
                "They lay 10-15 eggs at a time.  They hatch in around 5-10 days.",
                "They lay 1-3 eggs at a time.  They hatch in around 34-36 days.",
            ],
        },
        {
            img: "nest",
            text: [
                "The largest bald eagle nest is 15 ft wide and 40 ft high.",
                "The largest bald eagle nest is 8.2 ft wide and 13 ft high.",
            ],
        },
        {
            img: "nest2",
            text: [
                "A bald eagle nest can weigh up to 10,000 pounds.",
                "A bald eagle nest can weigh up to 2,000 pounds.",
            ],
        },
        {
            img: "old",
            text: [
                "They lay live up to 8 years in the wild, 62 years in captivity.",
                "They lay live up to 28 years in the wild, 36 years in captivity.",
            ],
        },
        {
            img: "carry",
            text: [
                "A mature bald eagle can lift 10-15 pounds.",
                "A mature bald eagle can lift 3-4 pounds.",
            ],
        },
        {
            img: "eating",
            text: [
                "Bald eagles only vegetables.",
                "Bald eagles only meat.",
            ],
        },
        {
            img: "hospital",
            text: [
                "The bald eagle got its name because the featheres on its head fall out after 5 years.",
                "The bald eagle is not really bald, it just had white feathers on its head.",
            ],
        },
        {
            img: "truth",
            text: [
                "They are found in North America and Atlantis",
                "They are found only in North America",
            ],
        },
    ];
    
    const tellTheTruth = Object.keys(req.query).length;
    res.render('bald-eagle', {facts, tellTheTruth});
});

router.get('/falcon', (req, res) => {
    res.render('falcon');
});

router.get('/dodo', (req, res) => {
    res.render('dodo');
});

module.exports = router;