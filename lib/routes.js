module.exports = function(app, passport, db) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    // Done AUTO because of static view serve

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form

    app.get('/', isLoggedIn, function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('index.html'); 
    });


    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html'); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.html');
    });

    // process the signup form
    app.post('/signup', function(req, res){
        var username = req.body.username;
        var password = req.body.password;


        db.User.findOne({ where: {username: username} }).then(function(userExists) {
            if (!userExists) {
                console.log("USER DOES NOT EXIST --- CREATING USER");
                db.User.create({
                    username: username,
                    password: password
                })
            } else {
                console.log("USER EXISTS");
            }
        });


    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.html');
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log(req.url);
    console.log(req.isAuthenticated())
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
