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
	this.comments = [];	
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
			'<div class="comments" id="comments-' + this.id + '">' +
				'<div class="comments-show">show comments</div>' +
			'</div>' +
			'<div class="commenter" id="commenter-' + this.id + '">' +
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
	});
	
	$("#post-" + this.id + " .post-actions-flag").hover(function (e) {
		$(this).attr("src", "images/flag-" + (1 * !post.flagged) + ".png");
	}, function (e) {
		$(this).attr("src", "images/flag-" + (1 * post.flagged) + ".png");
	});

	// Make [show comments] buttons functional.
	$("#comments-" + this.id + " .comments-show").click(
		function () {
			$(this).hide();
			post.loadComments();
		}
	);
	
	// Make [comment] button functional.
	$("#commenter-" + this.id + " .commenter-comment").click(
		function () {
			comment(post);
		}
	);
}


/*------------------------------- C O M M E N T ------------------------------*/

var commentLock = false; // To be acquired before commenting.

function comment (post) {
	
	// Must be logged in.
	if (!getUserID()) {
		$("#login-status").html("You must be logged in to comment.");
		return openLogin();
	}
	
	// Variables.
	var id = post.id;
	var comment = $("#commenter-" + id + " .commenter-text").val();
	var author = $("#commenter-" + id + " .commenter-author").val();
	if (comment == "") {return false;}
	
	// Lock.
	if (commentLock) {return false;}
	commentLock = true;	
	$("#commenter-" + id + " .commenter-comment").css("backgroundColor", "rgba(20, 20, 20, 0.1)");
	
	$.ajax({
		type: "POST",
		url: "php/comment.php",
		data: {"post":id, "comment":comment, "author":author},
		success: function (data) {
			console.log("POST php/comment.php");
			console.log(data);
			
			if (data.error) {
				// Error.
				
			} else if (data.invalid) {
				// Invalid.
				
			} else if (!data.verified) {
				// Not verified.
				
			} else {
				// Success!
				post.loadComments();
				$("#commenter-" + id + " .commenter-text").val("");
			}
		},
		complete: function () {
			$("#commenter-" + id + " .commenter-comment").css("backgroundColor", "rgba(20, 20, 20, 0.93)");
		},
		dataType: "json"
	});	
}


/*-------------------------- G E T   C O M M E N T S -------------------------*/

Post.prototype.loadComments = function () {
	var post = this;
	$.ajax({
		type: "GET",
		url: "php/getComments.php",
		data: {"post":this.id},
		success: function (data) {
			console.log("POST php/comments.php");
			console.log(data);
			
			if (data.error) {
				// Error.
			} else if (data.invalid) {
				// Invalid.
			} else {
				post.comments = []; // Empty comments.
				var c; // Current comment.
				for (i in data.comments) {
					c = data.comments[i];
					post.comments.push(new Comment (c.id, post.id, c.comment, c.author, c.time, c.likes));
				}
				post.showComments();
			}
		},
		error: function (error) {console.log(error);},
		dataType: "json"
	});	
}


Post.prototype.showComments = function () {
	$("#comments-" + this.id).html(""); // Clear.
	for (i in this.comments) {
		this.comments[i].appendToElement($("#comments-" + this.id));
	}
	
	// Show commenter.
	$("#commenter-" + this.id).show();
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


/*------------------------------ S E T   U S E R -----------------------------*/

var liked = []; // IDs of liked Posts.
var flagged = []; // IDs of Flagged Posts.
var user; // User currently logged in.
var likedComments = []; // IDs of liked Comments.

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
				likedComments = data.likedComments;
				user = data.user;
			}
		},
		complete: callback,
		dataType: "json"
	});
}

function unsetLikedAndFlagged () {
	liked = []; // IDs of liked Posts.
	flagged = []; // IDs of flagged Posts.
	likedComments = []; // IDs of liked Comments.
}

$(function () {	

});