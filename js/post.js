/*---------------------------------- P O S T ---------------------------------*/


function Post (id, post, author, time, likes, flags) {
	this.id = id;
	this.post = post;
	this.author = author;
	this.time = time;
	this.likes = likes;
	this.flags = flags;
	this.flagged = 0;
	this.liked = 1;
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
}

/*---------------------------------- T I M E ---------------------------------*/


function timePhrase (time) {
	return "2 hours ago"
}