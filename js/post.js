/*---------------------------------- P O S T ---------------------------------*/


function Post (id, post, author, time, likes, flags) {
	this.id = id;
	this.post = post;
	this.author = author;
	this.time = time;
	this.likes = likes;
	this.flags = flags;
	this.flagged = (flagged.indexOf(id) != -1);
	this.liked = (liked.indexOf(id) != -1);
}

function commentToHTML (id, post, comment, author, likes, time) {
	if (author == null || author == "") {author = "Anonymous"}
	return '<div id="comment-"' + id + ' class="comment">' +
			'<span class="comment-comment">' + comment + ' </span> <br/>' +
			'<span class="comment-author">' + author + ' </span> <br/>' + 
			'<span class="comment-time">' + timePhrase(time) + ' </span> <br/>' + 
			'<span class="comment-likes">' + likes + '</span>' +
			'<img class="comment-like" src="images/like-comment-0.png">' +
		'</div>';
}

Post.prototype.toHTML = function () {
	return '<div id="post-' + this.id + '" class="post">' +
				'<div class="post-post">' + this.post + '</div>' +
				'<div class="post-author">' + this.author + '</div>' +
				'<div class="post-time">' + timePhrase(this.time) + '</div>' +
				'<div class="post-likes">' + this.likes + ' likes </div>' +
				'<div class="post-flags">' + this.flags + ' flags </div>' +
				'<div class="post-actions">' +
					'<img class="post-actions-flag" src="images/flag-' + 
						(this.flagged * 1) + 
					'.png" title="flag">' +
					'<img class="post-actions-like" src="images/like-' +
						(this.liked * 1) +
					'.png" title="like">' +
				'</div>' + 
			'</div>' +
			'<div class="comments">' +
				commentToHTML(1, this.id, "Who even posted this?", "Gerald", 1, "2016-05-18 15:59:57") +
				commentToHTML(2, this.id, "lol.", "", 3, "2016-05-18 15:59:57") +
				commentToHTML(3, this.id, "Why do I feel like I know the OP?", "Kadri", 3, "2016-05-18 15:59:57") +
				commentToHTML(4, this.id, "Anyone selling a UPass?", "jasmit", 0, "2016-05-18 15:59:57") +
				commentToHTML(5, this.id, "lmao", "Anonymous", 0, "2016-05-18 15:59:57") +
			'</div>' +
			'<div class="commenter">' +
				'<textarea class="commenter-text"></textarea>' +
				'<input type="text" class="commenter-author" placeholder="author (optional)">' +
				'<div class="commenter-comment button">comment</div>' +
			'</div>';
			$(".comments").fadeOut();
}

Post.prototype.appendToElement = function (element) {
	
	element.append(this.toHTML());
	var post = this;
	console.log("Nim: Debug: Making Post buttons functional.");
	
	// Make [like] buttons functional.
	$("#post-" + this.id + " .post-actions-like").click(function () {
		
		// Must be logged in.
		if (!getUserID()) {
			$("#login-status").html("You must be logged in to like posts.");
			return openLogin();
		}
		
		if (post.liked) {
			unlike(post.id);
			post.likes--;
		} else {
			like(post.id);
			post.likes++;
		}
		
		$("#post-" + post.id + " .post-likes").html(post.likes + " likes");
		post.liked = !post.liked;
		$(this).attr("src", "images/like-" + (1 * post.liked) + ".png");
		$(this).animate({top:"-10px"}, 300, function () {$(this).animate({top:"0px"}, 300);});
	});
	
	// Make [flag] buttons functional.
	$("#post-" + this.id + " .post-actions-flag").click(function () {
		
		// Must be logged in.
		if (!getUserID()) {
			$("#login-status").html("You must be logged in to flag posts.");
			return openLogin();
		}
		
		if (post.flagged) {
			unflag(post.id);
			post.flags--;
		} else {
			flag(post.id);
			post.flags++;
		}

		$("#post-" + post.id + " .post-flags").html(post.flags + " flags");
		post.flagged = !post.flagged;
		$(this).attr("src", "images/flag-" + (1 * post.flagged) + ".png");
		$(this).animate({top:"-10px"}, 300, function () {$(this).animate({top:"0px"}, 300);});
	});
	
	$("#post-" + this.id + " .post-actions-like").hover(function (e) {
		$(this).attr("src", "images/like-" + (1 * !post.liked) + ".png");
	}, function (e) {
		$(this).attr("src", "images/like-" + (1 * post.liked) + ".png");
	})
	
	$("#post-" + this.id + " .post-actions-flag").hover(function (e) {
		$(this).attr("src", "images/flag-" + (1 * !post.flagged) + ".png");
	}, function (e) {
		$(this).attr("src", "images/flag-" + (1 * post.flagged) + ".png");
	})
}



/*---------------------------------- T I M E ---------------------------------*/


function timePhrase (time) {
	var now = Date.now();
	var posted = Date.UTC(time.substring(0, 4), parseInt(time.substring(5, 7)) - 1, 
						 time.substring(8, 10), time.substring(11, 13),
						 time.substring(14, 16), time.substring(17, 19));
	
	var sec = (now - posted) / 1000; // Difference in seconds.
	console.log(sec);
	if (sec < 10) {return "a few seconds ago"}
	
	var min = sec / 60; // Difference in minutes.
	if (min < 2) {return "a minute ago"}
	if (min < 10) {return "a few minutes ago"}
	if (min < 50) {return "some minutes ago"}
	
	var hour = min / 60; // Difference in hour.
	if (hour < 2) {return "an hour ago"}
	if (hour < 10) {return "a few hours ago"}
	if (hour < 23) {return "some hours ago"}
	
	var day = hour / 24; // Difference in days.
	console.log(day);
	if (day < 2) {return "yesterday"}
	if (day < 6) {return "a few days ago"}
	if (day < 12) {return "about a week ago"}
	if (day < 24) {return "a few weeks ago"}
	
	var month = day / 7; // Difference in months.
	if (month < 5) {return "a few months ago"}
	if (month < 11) {return "months ago"}
	
	var year = month / 30; // Difference in years.
	if (year < 2) {return "about a year ago"}
	if (year < 5) {return "a few years ago"}
	console.log(min);console.log(hour);
	return "old-ass post";
}


/*---------------------------------- L I K E ---------------------------------*/


function like (id) {
	
	// Add id to liked if not already added.
	if (liked.indexOf(id) == -1) {liked.push(id);}
	
	$.ajax({
		type: "POST",
		url: "php/like.php",
		data: {"id":id},
		success: function (data) {
			console.log("POST php/like.php");
			console.log(data);
			
			if (data.error) {
				// Error.
			} else if (data.invalid) {
				// Invalid.
			} else {
	
			}
		},
		error: function (error) {console.log(error);},
		dataType: "json"
	});	
}

function unlike (id) {
	// Remove from liked if exists.
	var i = liked.indexOf(id);
	if (i != -1) {liked.splice(i, 1);}
	
	$.ajax({
		type: "POST",
		url: "php/unlike.php",
		data: {"id":id},
		success: function (data) {
			console.log("POST php/unlike.php");
			console.log(data);
			
			if (data.error) {
				// Error.
			} else if (data.invalid) {
				// Invalid.
			} else {
	
			}
		},
		error: function (error) {console.log(error);},
		dataType: "json"
	});	
}

/*---------------------------------- F L A G ---------------------------------*/

function flag (id) {
	
	// Add id to flagged if not already added.
	if (flagged.indexOf(id) == -1) {flagged.push(id);}
	
	$.ajax({
		type: "POST",
		url: "php/flag.php",
		data: {"id":id},
		success: function (data) {
			console.log("Nim: Debug: like.php");
			console.log(data);
			
			if (data.error) {
				// Error.
			} else if (data.invalid) {
				// Invalid.
			} else {
				
			}
		},
		error: function (error) {console.log(error);},
		dataType: "json"
	});	
}

function unflag (id) {
	
	// Remove from flagged if exists.
	var i = flagged.indexOf(id);
	if (i != -1) {flagged.splice(i, 1);}
	
	$.ajax({
		type: "POST",
		url: "php/unflag.php",
		data: {"id":id},
		success: function (data) {
			console.log("Nim: Debug: like.php");
			console.log(data);
			
			if (data.error) {
				// Error.
			} else if (data.invalid) {
				// Invalid.
			} else {
	
			}
		},
		error: function (error) {console.log(error);},
		dataType: "json"
	});	
}


var liked = []; // IDs of liked Posts.
var flagged = []; // IDs of Flagged Posts.
var user; // User currently logged in.

function setLikedAndFlagged (callback) {
	$.ajax({
		type: "GET",
		url: "php/getLikedAndFlagged.php",
		success: function (data) {
			console.log("GET php/getLikedAndFlagged.php");
			console.log(data);
			
			if (data.error) {
			
			} else {
				liked = data.liked;
				flagged = data.flagged;
				user = data.user;
			}
		},
		complete: callback,
		dataType: "json"
	});
}

function unsetLikedAndFlagged () {
	liked = []; // IDs of liked Posts.
	flagged = []; // IDs of Flagged Posts.
}

$(function () {	

});