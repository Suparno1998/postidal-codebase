module.exports = {
    userAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        // res.redirect('/login');
        return next();
    },
    adminAuthenticated: function(req, res, next){
        req.session.redirectUrl = req.originalUrl
        if(req.session.isAdmin){
            console.log("in if",req.session.isAdmin)
            return next();
        }
        res.redirect('/admin-account');
        // return next();
    }
};