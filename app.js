var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user");
const { get } = require("express/lib/response");



mongoose.connect("mongodb+srv://mosso:mosso2022@cluster0.qicx3.mongodb.net/mossodb?retryWrites=true&w=majority");
var userData;

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
	secret: "MOSSO",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//=====================
// ROUTES
//=====================

// Showing start page
app.get("/", function (req, res) {
	res.render("start");
});




// Showing register form
app.get("/register", function (req, res) {
	res.render("register");
});

// Handling user signup
app.post("/register", function (req, res) {
	
	var email = req.body.email;
	var username = email;
	var password = req.body.password;
	var fullname = req.body.fullname;
	User.register(new User({ username: username, fullname:fullname }),
			password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}
			res.render("login");
		
	});
});





//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
	successRedirect: "/homepage",
	failureRedirect: "/login"
}), function (req, res) {
	if (err){
		console.log(err);
	}
});

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next) {  // check if user is logged in
	if (req.isAuthenticated()) {
		userData = req.user;  // get user details to the global variable user Data
		return next();
	}
	res.redirect("/login");
}

var port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log("MOSSO server has Started at port "+port);
});

