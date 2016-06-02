/*------------------------------- C O M M E N T ------------------------------*/

function Comment (id, post, comment, author, time, likes) {
	this.id = id;
	this.comment = comment;
	this.author = author;
	this.time = time;
	this.likes = likes;
	this.liked = (likedComments.indexOf(id) != -1);
}

Comment.prototype.toHTML = function () {
	if (this.author == null || this.author == "") {this.author = "Anonymous"}
	return '<div id="comment-' + this.id + '" class="comment">' +
			'<span class="comment-comment">' + this.comment + ' </span> <br/>' +
			'<span class="comment-author">' + this.author + ' </span> <br/>' + 
			'<span class="comment-time">' + timePhrase(this.time) + ' </span> <br/>' + 
			'<span class="comment-likes">' + this.likes + '</span>' +
			'<img class="comment-like" src="images/like-comment-0.png">' +
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
			unlikeComment(comment.id);
			comment.likes--;
		} else {
			likeComment(comment.id);
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
	})
}


/*-------------------------- L I K E   C O M M E N T -------------------------*/

function likeComment (id) {
	
}

function unlikeComment (id) {
	
}


/*-------------------------------- O N L O A D -------------------------------*/

$(function () {	

});