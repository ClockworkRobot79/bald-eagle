const MenuItem = require(`./models/menuItem`);
const Rating = require('./models/rating');
const Restaurant = require(`./models/restaurant`);

// Static dummy data used to populate the DB if it is empty
const defaultRestaurants = [
    {
        name: `The Bread Company`,
        description: `Swiss bread making at its finest`,
        location: {
            address: `123 Whatever St`,
        },
    },
    {
        name: `Bob's Burger Barn`,
        description: `Greasy spoon doesn't begin to describe it`,
        location: {
            address: `654 Sumpfin Ln`,
        },
    },
    {
        name: `Mama's Fishhouse`,
        description: `the best ever`,
        location: {
            address: `999 Niner Dr`,
        },
    },
];

const defaultMenuItems = [
    {
        name: `This is the first menuItem!`,
        description: `Eat if fast`,
    },
    {
        name: `It is getting to be the witching hour`,
        description: `Regret it tomorrow`,
    },
    {
        name: `I want to sleep`,
        description: `It won't kill you`,
    },
];

const defaultRatings = [
    {
        rating: 1,
        comment: `Tasted like old shoes`,
    },
    {
        rating: 5,
        comment: `Best I've ever had`,
    },
    {
        rating: 2,
        comment: `Gave me the runs`,
    },
];

async function createRestaurant(restaurant, menuItem, rating) {
    Restaurant.create(restaurant, (err, newRestaurant) => {
        if (err) {
            console.error(`Error: ${err}`);
        } else {
            const promises = [
                new Promise((resolve, reject) => {
                    MenuItem.create(menuItem, (err, menuItem) => {
                        if (err) {
                            console.error(err);
                            reject();
                        } else {
                            newRestaurant.menuItems.push(menuItem);
                            resolve();
                        }
                    });
                }),
                new Promise((resolve, reject) => {
                    Rating.create(rating, (err, rating) => {
                        if (err) {
                            console.error(err);
                            reject();
                        } else {
                            newRestaurant.ratings.push(rating);
                            resolve();
                        }
                    });
                }),
            ];

            Promise.all(promises).then(() => {
                newRestaurant.save();
                console.error(`Created: ${newRestaurant}`);
            });
        }
    });
}

function wipeDBs() {
    Restaurant.remove({}, (err) => {
        console.log(`All restaurants have been removed`);
    });

    MenuItem.remove({}, (err) => {
        console.log(`All menu items have been removed`);
    });
}

// if there is nothing in the DB, populate it with a couple enrties
module.exports = () => {
    // uncomment this if you want to clear the DB first
    // wipeDBs();

    Restaurant.find({}, (err, restaurants) => {
        if (err) {
            console.error(`Error: ${err}`);
        } else if (restaurants.length === 0) {
            console.log(`Createing default restaurants`);
            defaultRestaurants.forEach((restaurant, idx) => {
                const menuItem = defaultMenuItems[idx];
                const rating = defaultRatings[idx];
                createRestaurant(restaurant, menuItem, rating);
            });
        } else {
            console.log(`There is already restaurant data`);
        }
    });
};
