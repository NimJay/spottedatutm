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
			'</div>';
}

Post.prototype.appendToElement = function (element) {
	
	element.append(this.toHTML());
	var post = this;
	console.log("Nim: Debug: Making Post buttons functional.");
	
	// Make [like] buttons functional.
	$("#post-" + this.id + " .post-actions-like").click(function () {
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
	console.log("ID: " + id + "<--");
	// Add id to liked if not already added.
	if (liked.indexOf(id) == -1) {liked.push(id);}
	
	$.ajax({
		type: "GET",
		url: "php/like.php",
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
		dataType: "json"
	});	
}

function unlike (id) {
	// Remove from liked if exists.
	var i = liked.indexOf(id);
	if (i != -1) {liked.splice(i, 1);}
	
	$.ajax({
		type: "GET",
		url: "php/unlike.php",
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
		dataType: "json"
	});	
}

/*---------------------------------- F L A G ---------------------------------*/

function flag (id) {
	// Add id to flagged if not already added.
	if (flagged.indexOf(id) == -1) {flagged.push(id);}
	
	$.ajax({
		type: "GET",
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
		dataType: "json"
	});	
}

function unflag (id) {
	// Remove from flagged if exists.
	var i = flagged.indexOf(id);
	if (i != -1) {flagged.splice(i, 1);}
	
	$.ajax({
		type: "GET",
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
		dataType: "json"
	});	
}


var liked = []; // IDs of liked Posts.
var flagged = []; // IDs of Flagged Posts.

$(function () {	
	$.ajax({
		type: "GET",
		url: "php/getLikedAndFlagged.php",
		success: function (data) {
			console.log("Nim: Debug: getLikedAndFlagged.php");
			console.log(data);
			
			if (data.error) {
			
			} else {
				liked = data.liked;
				flagged = data.flagged;
			}
		},
		dataType: "json"
	});
});