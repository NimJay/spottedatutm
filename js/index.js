// Streams.
var FIRE = 0;
var NEW = 1;

var stream = FIRE; // Stream.
var lastID = Infinity; // ID of last post retrieved.
var noMorePosts = false; // No more posts left in stream.


/*-------------------------------- S C R O L L -------------------------------*/

function isNearBottom() {
	return $(document).height() -
		($(window).height() + $(document).scrollTop()) < 1000;
}

function windowScrolled () {
	if (isNearBottom()) {
		loadNextPosts(10);
	}
}

function loadNextPosts (posts) {
	// Placeholder.
	for (var i = 0; i < posts; i++) {
		var p = new Post();
		$("#posts").append(p.toHTML());
	}
}

function refresh() {
	
}


$(function () {
	
	$("#header-fire").click(function (e) {
		$("#header-new").css("color", "rgb(255, 255, 255)");
		$("#header-post").css("color", "rgb(255, 255, 255)");
		$(this).css("color", "rgb(255, 100, 80)");
	});
		
	$("#header-new").click(function (e) {
		$("#header-fire").css("color", "rgb(255, 255, 255)");
		$("#header-post").css("color", "rgb(255, 255, 255)");
		$(this).css("color", "rgb(50, 150, 255)");
	});
	
	$("#header-post").click(function (e) {
		$("#header-fire").css("color", "rgb(255, 255, 255)");
		$("#header-new").css("color", "rgb(255, 255, 255)");
		$(this).css("color", "rgb(100, 230, 140)");
	});
	
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
});