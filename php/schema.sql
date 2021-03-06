/* ----------------- U S E R S ---------------- */

CREATE TABLE users (
	id INTEGER NOT NULL PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(50),
	birth TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	verified BOOLEAN NOT NULL
);



/* ----------------- P O S T S ---------------- */

CREATE TABLE posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT, 
	post VARCHAR(500) NOT NULL, 
	author VARCHAR(100), 
	user INTEGER NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	likes UNSIGNED BIG INT DEFAULT 0,
	flags INTEGER DEFAULT 0,
	ip VARCHAR(15),
	FOREIGN KEY (user) REFERENCES users(id)
);



/* ----------------- L I K E S ---------------- */

CREATE TABLE likes (
	post INTEGER NOT NULL,
	user INTEGER NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ip VARCHAR(15) NOT NULL,
	PRIMARY KEY(post, user),
	FOREIGN KEY (post) REFERENCES posts(id),
	FOREIGN KEY (user) REFERENCES users(id)
);


/* ----------------- F L A G S ---------------- */

CREATE TABLE flags (
	post INTEGER NOT NULL,
	user INTEGER NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ip VARCHAR(15) NOT NULL,
	PRIMARY KEY(post, user),
	FOREIGN KEY (post) REFERENCES posts(id),
	FOREIGN KEY (user) REFERENCES users(id)
);


/* --------- V E R I F I C A T I O N S -------- */

CREATE TABLE verifications (
	verification VARCHAR(32) NOT NULL,
	user INTEGER NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (user) REFERENCES users(id)
);


/* ---------------- R E S E T S --------------- */

CREATE TABLE resets (
	reset VARCHAR(32) NOT NULL,
	user INTEGER NOT NULL,
	password VARCHAR(50),
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (user) REFERENCES users(id)
);


/* -------------- C O M M E N T S ------------- */

CREATE TABLE comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	comment VARCHAR(500) NOT NULL,
	author VARCHAR(100),
	post INTEGER NOT NULL,
	user INTEGER NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	likes UNSIGNED BIG INT DEFAULT 0,
	ip VARCHAR(15),
	FOREIGN KEY (post) REFERENCES posts(id),
	FOREIGN KEY (user) REFERENCES users(id)
);


/* --------- C O M M E N T   L I K E S -------- */

CREATE TABLE comment_likes (
	comment INTEGER NOT NULL,
	user INTEGER NOT NULL,
	time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
	ip VARCHAR(15) NOT NULL,
	PRIMARY KEY(comment, user),
	FOREIGN KEY (comment) REFERENCES comment(id),
	FOREIGN KEY (user) REFERENCES users(id)
);