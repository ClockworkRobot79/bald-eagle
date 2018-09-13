const express = require('express');
const router = express.Router({mergeParams: true});

const isLoggedIn = require('../middleware/isLoggedIn');
const { canEditMenuItem } = require('../middleware/menuItem');

const MenuItem = require('../models/menuItem');

module.exports = router;
