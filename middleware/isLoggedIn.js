module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash(`error`, `Please log in first`);
    res.cookie('loginRedirect', req.originalUrl, {maxAge: 5*60*1000, httpOnly: true});
    res.redirect('/login');
}
