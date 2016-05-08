/*---------------------------------- P O S T ---------------------------------*/


function Post () {
	this.id = 300;
	this.post = "To the girls with bindis, stop.";
	this.author = "Nerd";
	this.time = "2016-05-05 22:39:27";
	this.likes = 222;
	this.flags = 15;
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



/*---------------------------------- T I M E ---------------------------------*/


function timePhrase (time) {
	return "2 hours ago"
}