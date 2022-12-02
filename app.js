var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user");
	Song = require("./models/song");

const { get } = require("express/lib/response");


mongoose.connect("mongodb+srv://mosso:mosso2022@cluster0.qicx3.mongodb.net/mossodb?retryWrites=true&w=majority");
var userData;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
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
app.get("/", isLoggedIn, function (req, res) {
	hello= "HELLO MOSSO";
	if (userData){
		hello= "HELLO "+userData.fullname;
	}
	res.json({message: hello});
});


// Showing user details
app.get("/user", isLoggedIn, function (req, res) {
	res.json({userData});
});

// Handling user signup
app.post("/register", function (req, res) {
	
	var username = req.body.username;
	var password = req.body.password;
	var fullname = req.body.fullname;
	
	User.register(new User({ username: username, fullname:fullname }),
			password, function (err, user) {
		if (err) {
			console.log(err);
			return res.json({register:"404"});
		}
			res.json({register:"200"});
		
	});
});


//Showing login form
app.get("/login", function (req, res) {
	res.json({login:"Hello Login"});
});

//Handling user login
app.post("/login", passport.authenticate("local", {
}), function (req, res) {
	res.json({login:"200"});
	
});

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout();
	res.json({logout:"200"});

	
});

function isLoggedIn(req, res, next) {  // check if user is logged in
	if (req.isAuthenticated()) {
		userData = req.user;  // get user details to the global variable user Data
		return next();
	}else{
		return next();
	}
	
}


// Adding song
app.post("/song", isLoggedIn, function (req, res) {
	
	var songid = req.body.songid;
	var artist = req.body.artist;
	var location = req.body.location;
	var userid = userData._id;
	
	new Song({ songid:songid, artist:artist, location:location, userid:userid}).save(function (err, str) {
		if (err) {
			console.log(err);
		}
		res.json({song:"200"});
});

});

app.get("/song",isLoggedIn, function (req, res){

	var userid = userData._id;
	Song.find({userid:userid}, function(err, songs) {   //load user songs from song schema
		if (err)
		  console.log(err);
		res.json({songs})
  });



});

var port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log("MOSSO server has Started at port "+port);
});

