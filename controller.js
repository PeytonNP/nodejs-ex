module.exports = function(app) {

    var firebase = require("firebase");
    var bodyParser = require("body-parser"); //Import bodyParser so we can read request body data

    var mongoose = require('mongoose');
  
    //mongoose.connect('mongodb://abah:abah@ds247619.mlab.com:47619/lswpmap');

    //mongoose.connect(keys.mongodb.dbURI);

    var userSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        events: {
            date: String,
            time: String,
            room: String
        }
    });

    var roomSchema = new mongoose.Schema({
        events: {
            title: String,
            start: String,
            end: String,
            editable: Boolean,
        },
        owner: String
    });


    ///var db_users = mongoose.model('User', userSchema);

    //var db_users = mongoose.model('User', userSchema);
    //var db_users = mongoose.model('User', userSchema);


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    var config = {
        apiKey: "AIzaSyAvL3fwqb_PqPxNUy3mW3x94LtQG5zMRY8",
        authDomain: "lwsnmaps.firebaseapp.com",
        databaseURL: "https://lwsnmaps.firebaseio.com",
        projectId: "lwsnmaps",
        storageBucket: "",
        messagingSenderId: "662081766321"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    function isAdmin(req, res, next) {

        var user = req.body;
        console.log("Fetched user : ", user);
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                // ...
                //allow next route to run
                next();
            } else {
                // User is signed out.
                // ...
                res.status(401).send("Permission denied. Admin Only");
            }
        });
    }

    function loginUser(email, password) {

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                // Success
                console.log("Success ");
                //window.location = "../html/main.html"; // Redirecting to other page.
            })
            .catch(function(error) {
                // Error Handling
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('signIn error', error);
            });
    }

    function logoutUser() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful");
        }).catch(function(error) {
            // An error happened.
            console.log(error.message);
            res.status(401).send(error.message);
        });
    }

    function authUser() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                console.log("Currently logged in");
                next();
            } else {
                // No user is signed in.
                console.log("Currently Not logged in");
                res.json({
                    message: "Currently Not logged in"
                })
            }
        });
    }

    function registarUser(firstname, lastname, email, password, cpassword) {

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                // Success
                console.log("Successful signUp");
            })
            .catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('signUp error', error);
            });
    }



    app.get('/', function(req, res) {
        console.log("Am in get /")
        res.render('index.html');
        //res.render('index.ejs');
    });
    

    app.get('/signin', function(req, res) {
        console.log("Am in get /signin")
        res.render('signin.ejs');
    });

    app.get('/signup', function(req, res) {
        console.log("Am in get /signup")
        res.render('signup.ejs');
    });

    app.get('/profile', function(req, res) {
        console.log("Am in get /profile")
            //res.render('profile.ejs');
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                console.log("Currently logged in");
                res.render('profile.ejs');
            } else {
                // No user is signed in.
                console.log("Currently Not logged in");
                res.render('signin.ejs');
            }
        });
    });


    app.get('/calendar', function(req, res) {
        console.log("Am in get /calendar")
        res.render('calendar.ejs');
    });

    app.get('/feedback', function(req, res) {
        console.log("Am in get /feedback")
        res.render('feedback.ejs');
    });

    app.post('/signin', function(req, res) {
        console.log("Am in Post /signin")

        var email = req.body.si_email;
        var password = req.body.si_password;

        //loginUser(email, password)
        //res.render('signin.ejs');
        /*res.json({
            message: "Sucessful Sign In"
        });*/

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                // Success
                console.log("Success ");
                res.render('profile.ejs');
            })
            .catch(function(error) {
                // Error Handling
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('signIn error', errorMessage);
                res.json({
                    message: errorMessage
                });
            });
    });

    app.post('/signup', function(req, res) {
        console.log("Am in Post /signup")

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.su_email;
        var password = req.body.su_password;
        var cpassword = req.body.su_cpassword;

        registarUser(firstname, lastname, email, password, cpassword)
            //res.render('signin.ejs');
        res.json({
            message: "Sucessful Sign In"
        });;
    });

    app.post('/profile', function(req, res) {
        console.log("Am in Post /profile")
    });


    app.post('/signout', function(req, res) {
        console.log("Am in Post /signout")

        //loginUser(email, password)
        //res.render('signin.ejs');
        /*res.json({
            message: "Sucessful Sign out"
        });*/
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("Sign-out successful");
            res.render('signin.ejs');
        }).catch(function(error) {
            // An error happened.
            console.log(error.message);
            res.status(401).send(error.message);
        });
    });
    /*db_users.find({ username: 'abah', password: 'abah' }, function(err, data) {
        if (err) throw err;
    });
    
    var newPost = db_posts({
            username: "abah",
            password: "abah",
            address: "mememe",
            phone: "9090933020",
            dod: "06/06/06"
        }).save(function(err, data) {
            if (err) throw err;
            console.log("save success");
            res.json(data);
        });
    */

}