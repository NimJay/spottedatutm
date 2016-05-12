// Number of posts to retrieve in each GET request to getPosts.php.
numOfPosts = 5;

// Streams.
var FIRE = 0;
var NEW = 1;

var stream = FIRE; // Stream.
var lastID = Infinity; // ID of last post retrieved.
var noMorePosts = false; // No more posts left in stream.
var postsLock = false;


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


/*-------------------------------- P O S T E R -------------------------------*/

function openPoster() {
	$("#header-post").css("color", "rgb(100, 230, 140)");	
	$("#poster").fadeIn(300);
}

function closePoster() {
	$("#header-post").css("color", "rgb(255, 255, 255)");
	$("#poster").fadeOut(300);
}


/*--------------------------------- P O S T S --------------------------------*/

function loadNextPosts (posts) {
	
	if (postsLock) {return false;} // Already trying to load posts.
	
	postsLock = true;
	// Make a GET request to the server to retreive Posts.
	$.ajax({
		type: "GET",
		url: "php/getPosts.php",
		data: {"lastId":lastID, "stream":stream, "numOfPosts":numOfPosts},
		success: function (data) {
			console.log("Nim: Debug: Success. :)");
			if (data.error) {
				return false;
			}
			
			var p;
			for (i in data.posts){
				c = data.posts[i];
				console.log(c); // Nim: Debug.
				p = new Post(c.id, c.post, c.author, c.time, c.likes, c.flags);
				p.appendToElement($("#posts"));
			}
			if (p) {lastID = p.id;} // Update lastID.
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
	
	// Post.
	$("#header-post").click(openPoster);
	
	var bool = false;
	$(".post-actions-like").hover(function (e) {
		$(this).attr("src", "images/like-" + (1 * !bool) + ".png");
	}, function (e) {
		$(this).attr("src", "images/like-" + (1 * bool) + ".png");
	})
	
	$(".post-actions-like").click(function (e) {
		bool = !bool;
		$(this).attr("src", "images/like-" + (1 * bool) + ".png");
		$(this).animate({top:"-10px"}, 300, function () {$(this).animate({top:"0px"}, 300);});
	});
	
	// Scroll.
	$(window).scroll(windowScrolled);
	
	// Poster.
	$("#poster-close").click(closePoster);
	
	
	// Let's go!
	$("#header-fire").click();
});