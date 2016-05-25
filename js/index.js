// Number of posts to retrieve in each GET request to getPosts.php.
numOfPosts = 5;

// Streams.
var FIRE = 0;
var NEW = 1;

var stream = FIRE; // Stream.
var lastID = Infinity; // ID of last post retrieved.
var noMorePosts = false; // No more posts left in stream.
var postsLock = false; // To be acquired before Post retrieval.
var postingLock = false; // To be acquired before posting.
var posts = []; // List of loaded Posts.

var loginLock = false; // To be acquired before logging in.

/*-------------------------------- S C R O L L -------------------------------*/

function isNearBottom() {
	return $(document).height() -
		($(window).height() + $(document).scrollTop()) < 1000;
}

function windowScrolled () {
	if (isNearBottom() && !noMorePosts) {
		loadNextPosts(10);
	}
}


/*--------------------------------- L O G I N --------------------------------*/

function openLogin () {
	$("#header-login").css("color", "rgb(100, 230, 140)");
	closePoster();
	$("#login").fadeIn(300);
	$("#login-email").focus();
}

function closeLogin () {
	$("#header-login").css("color", "rgb(255, 255, 255)");
	$("#login").fadeOut(300);
	$("#login-status").html("");
}

function login () {
	
	if (loginLock) {return false;}
	loginLock = true;
	$("#login-login").css("backgroundColor", "rgba(20, 20, 20, 0.1)");
	$("#login-status").html("Authenticating...");
	
	var email = $("#login-email").val(); // Email.
	var password = $("#login-password").val(); // Password.
	
	$.ajax({
		type: "POST",
		url: "php/login.php",
		data: {"email":email, "password":password},
		success: function (data) {
			console.log("POST php/login.php");
			console.log(data);
			if (data.error || data.invalid) {
				$("#login-status").html("Whoops, something went wrong. We're sorry.");
			} else if (!data.authenticated) {
				$("#login-status").html("Invalid combination.");
			} else {
				$("#header-login").fadeOut(300, function () {$("#header-logout").fadeIn(300);});
				$("#login-status").html("Logged in.");
				Cookies.set("id", data.id, {path:"/"});
				closeLogin();
			}
		},
		error: function (error) {
			console.log(error);
			$("#login-status").html("Whoops, something went wrong at our server. We're sorry.");
		},
		complete: function () {
			// Enable posting.
			loginLock = false;
			$("#login-login").css("backgroundColor", "rgba(20, 20, 20, 0.9)");
		},
		dataType: "json"
	});
}

function logout () {
	
	Cookies.remove("id", {path:"/"});
	
	$.ajax({
		type: "POST",
		url: "php/logout.php",
		success: function (data) {
			console.log("POST php/logout.php");
			console.log(data);
			$("#header-logout").fadeOut(300, function () {$("#header-login").fadeIn(300);});
		},
		error: function (error) {
			console.log(error);
		},
		dataType: "json"
	});
}

/*-------------------------------- P O S T E R -------------------------------*/

function openPoster() {
	$("#header-post").css("color", "rgb(100, 230, 140)");
	closeLogin();
	$("#poster").fadeIn(300);
	$("#poster-status").html("");
	$("#poster-text").focus();
}

function closePoster() {
	$("#header-post").css("color", "rgb(255, 255, 255)");
	$("#poster").fadeOut(300);
}

/* To be called when [post] is clicked. */
function post () {
	
	if (postingLock) {return false;}
	postingLock = true;
	$("#poster-post").css("backgroundColor", "rgba(20, 20, 20, 0.1)");
	$("#poster-status").html("Posting...");
	
	var post = $("#poster-text").val(); // Post.
	var author = $("#poster-author").val(); // Text.
	
	
	$.ajax({
		type: "GET",
		url: "php/post.php",
		data: {"post":post, "author":author},
		success: function (data) {
			console.log(data);
			if (data.error) {
				$("#poster-status").html("Whoops, something went wrong at our server. We're sorry.");
			} else if (data.invalid) {
				$("#poster-status").html("Your input seems to be invalid.");
			} else {
				$("#poster-status").html("Posted.");
				$("#header-new").click();
			}
		},
		error: function (error) {
			console.log(error);
			$("#poster-status").html("Whoops, something went wrong at our server. We're sorry.");
		},
		complete: function () {
			// Enable posting.
			postingLock = false;
			$("#poster-post").css("backgroundColor", "rgba(20, 20, 20, 0.9)");
		},
		dataType: "json"
	});
}


/*--------------------------------- P O S T S --------------------------------*/

function loadNextPosts (numOfPosts) {
	
	if (postsLock) {return false;} // Already trying to load posts.
	
	postsLock = true;
	// Make a GET request to the server to retreive Posts.
	$.ajax({
		type: "GET",
		url: "php/getPosts.php",
		data: {"lastId":lastID, "stream":stream, "numOfPosts":numOfPosts},
		success: function (data) {
			console.log("Nim: Debug: Success. :)");
			console.log(data);
			if (data.error) {
				return false;
			}
			
			for (i in data.posts){
				c = data.posts[i];
				console.log(c); // Nim: Debug.
				posts.push(new Post(c.id, c.post, c.author, c.time, c.likes, c.flags));
				posts[posts.length - 1].appendToElement($("#posts"));
			}
			if (posts.length) {
				lastID = posts[posts.length - 1].id; // Update lastID.
			}
			if (data.posts.length < numOfPosts) {noMorePosts = true;} // No more posts.
		},
		error: function (data) {
			console.log("Nim: Debug: Error. :(");
		},
		complete: function () {postsLock = false;},
		dataType: "json"
	});
}

function refreshStream() {
	lastID = Infinity;
	noMorePosts = false;
	$("#posts").html("");
	posts = [];
	loadNextPosts(10);
}


$(function () {
	
	// Fire.
	$("#header-fire").click(function (e) {
		$("#header-new").css("color", "rgb(255, 255, 255)");
		$("#header-post").css("color", "rgb(255, 255, 255)");
		$(this).css("color", "rgb(255, 100, 80)");
		closePoster();
		stream = FIRE;
		refreshStream();
	});
	
	// New.
	$("#header-new").click(function (e) {
		$("#header-fire").css("color", "rgb(255, 255, 255)");
		$("#header-post").css("color", "rgb(255, 255, 255)");
		$(this).css("color", "rgb(50, 150, 255)");
		closePoster();
		stream = NEW;
		refreshStream();
	});
	
	// Login.
	$("#header-login").click(openLogin);
	$("#login-close").click(closeLogin);
	$("#login-login").click(login);
	$("#header-logout").click(logout);
	
	// Poster.
	$("#header-post").click(openPoster);
	$("#poster-close").click(closePoster);
	$("#poster-post").click(post);
	
	// Scroll.
	$(window).scroll(windowScrolled);
	
	// Let's go!
	if (Cookies.get("id", {path:'/'})) {$("#header-logout").fadeIn(300);}
	else {$("#header-login").fadeIn(300);}
	if (window.location.hash.substr(1) == "new") {
		$("#header-new").click();
	} else {
		$("#header-fire").click();
	}
});