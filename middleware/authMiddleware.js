function requireAuth(req, res, next) {
    if (req.session.user) {
        return next();
    }

    req.session.returnTo = req.originalUrl;
    return req.session.save(() => res.redirect('/login?required=checkout'));
}

module.exports = { requireAuth };
