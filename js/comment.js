/*------------------------------- C O M M E N T ------------------------------*/

function Comment (id, post, comment, author, time, likes) {
	this.id = id;
	this.post = post;
	this.comment = comment;
	this.author = author;
	this.time = time;
	this.likes = likes;
	this.liked = (likedComments.indexOf(id) != -1);
}

Comment.prototype.toHTML = function () {
	if (this.author == null || this.author == "") {this.author = "Anonymous"}
	return '<div id="comment-' + this.id + '" class="comment">' +
			'<span class="comment-author">' + this.author + ' </span> <br/>' + 
			'<span class="comment-comment">' + this.comment + ' </span> <br/>' +
			'<span class="comment-time">' + timePhrase(this.time) + ' </span> <br/>' + 
			'<span class="comment-likes">' + this.likes + '</span>' + 
			'<img class="comment-like" src="images/like-comment-' + (this.liked * 1)+ '.png">' +
		'</div>';
}

Comment.prototype.appendToElement = function (element) {
	
	element.append(this.toHTML());
	var comment = this;
	console.log("Nim: Debug: Making Comment buttons functional.");
	
	// Make [like] button functional.
	$("#comment-" + this.id + " .comment-like").click(function () {
		
		// Must be logged in.
		if (!getUserID()) {
			$("#login-status").html("You must be logged in to like comments.");
			return openLogin();
		}
		
		if (comment.liked) {
			comment.unlike(comment.id);
			comment.likes--;
		} else {
			comment.like(comment.id);
			comment.likes++;
		}
		
		$("#comment-" + comment.id + " .comment-likes").html(comment.likes); // Update likes.
		comment.liked = !comment.liked;
		$(this).attr("src", "images/like-comment-" + (1 * comment.liked) + ".png");
		$(this).animate({top:"-10px"}, 300, function () {$(this).animate({top:"0px"}, 300);});
	});
	
	
	$("#comment-" + this.id + " .comment-like").hover(function (e) {
		$(this).attr("src", "images/like-comment-" + (1 * !comment.liked) + ".png");
	}, function (e) {
		$(this).attr("src", "images/like-comment-" + (1 * comment.liked) + ".png");
	});
}


/*-------------------------- L I K E   C O M M E N T -------------------------*/

Comment.prototype.like = function () {
	var id = this.id;
	// Add id to likedComments if not already added.
	if (likedComments.indexOf(id) == -1) {likedComments.push(id);}
	
	$.ajax({
		type: "POST",
		url: "php/likeComment.php",
		data: {"id":id},
		success: function (data) {
			console.log("POST php/likeComment.php");
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

Comment.prototype.unlike = function () {
	var id = this.id;
	
	// Remove from likedComments if exists.
	var i = likedComments.indexOf(id);
	if (i != -1) {likedComments.splice(i, 1);}
	
	$.ajax({
		type: "POST",
		url: "php/unlikeComment.php",
		data: {"id":id},
		success: function (data) {
			console.log("POST php/unlikeComment.php");
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


/*-------------------------------- O N L O A D -------------------------------*/

$(function () {	

});