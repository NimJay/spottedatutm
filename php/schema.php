<?php

// Authorization.
if ($_GET['password'] != "framenumber") {
	echo "<h3>Unauthorized; hence, database was not reset.</h3>";
	showTables();
	return;
}

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

// Open database (create if non-existent).
$db = new SQLite3('spottedatutm.db');


// Create tables for Users, Posts, Likes, and Flags.
$db->exec("DROP TABLE users;");
$db->exec("DROP TABLE posts;");
$db->exec("DROP TABLE likes;");
$db->exec("DROP TABLE flags;");
$db->exec("DROP TABLE verifications;");
$db->exec("DROP TABLE resets;");
$db->exec("DROP TABLE comments;");
$db->exec("DROP TABLE comment_likes;");
$db->exec("CREATE TABLE users ( id INTEGER NOT NULL PRIMARY KEY, email VARCHAR(255) NOT NULL, password VARCHAR(50), birth TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, verified BOOLEAN NOT NULL );");
$db->exec("CREATE TABLE posts ( id INTEGER PRIMARY KEY AUTOINCREMENT, post VARCHAR(500) NOT NULL, author VARCHAR(100), user INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, likes UNSIGNED BIG INT DEFAULT 0, flags INTEGER DEFAULT 0, ip VARCHAR(15), FOREIGN KEY (user) REFERENCES users(id) );");
$db->exec("CREATE TABLE likes ( post INTEGER NOT NULL, user INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, ip VARCHAR(15) NOT NULL, PRIMARY KEY(post, user), FOREIGN KEY (post) REFERENCES posts(id), FOREIGN KEY (user) REFERENCES users(id) );");
$db->exec("CREATE TABLE flags ( post INTEGER NOT NULL, user INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, ip VARCHAR(15) NOT NULL, PRIMARY KEY(post, user), FOREIGN KEY (post) REFERENCES posts(id), FOREIGN KEY (user) REFERENCES users(id) );");
$db->exec("CREATE TABLE verifications ( verification VARCHAR(32) NOT NULL, user INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (user) REFERENCES users(id) );");
$db->exec("CREATE TABLE resets ( reset VARCHAR(32) NOT NULL, user INTEGER NOT NULL, password VARCHAR(50), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (user) REFERENCES users(id) );");
$db->exec("CREATE TABLE comments ( id INTEGER PRIMARY KEY AUTOINCREMENT, comment VARCHAR(500) NOT NULL, author VARCHAR(100), post INTEGER NOT NULL, user INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, likes UNSIGNED BIG INT DEFAULT 0, ip VARCHAR(15), FOREIGN KEY (post) REFERENCES posts(id), FOREIGN KEY (user) REFERENCES users(id) );");
$db->exec("CREATE TABLE comment_likes ( comment INTEGER NOT NULL, user INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, ip VARCHAR(15) NOT NULL, PRIMARY KEY(comment, user), FOREIGN KEY (comment) REFERENCES comment(id), FOREIGN KEY (user) REFERENCES users(id) );");

// Insert the initial user, and posts.
$db->exec("DELETE FROM users WHERE 1=1");
$db->exec("INSERT INTO users (email, password, birth, verified) VALUES (\"nathashi.jayawardena@mail.utoronto.ca\", \"framenumber\", \"2016-05-14 19:42:51\", 1);");
$db->exec("DELETE FROM posts WHERE 1=1");
$db->exec("INSERT INTO posts (post, author, user, time) VALUES (\"The first post is born.\", \"Nim\", 1, \"2016-05-14 19:42:51\");");
$db->exec("INSERT INTO posts (post, author, user, time) VALUES (\"The second post is born.\", \"Nim\", 1, \"2016-05-14 19:42:51\");");
$db->exec("INSERT INTO posts (post, user, time) VALUES (\"To the guy in MGM101 who actually stood up to greet people, you the real MVP.\", 1, \"2016-05-18 15:59:57\");");
$db->exec("INSERT INTO posts (post, author, user, time) VALUES (\"Shout-outs to the second-floor janitors at DH for keeping it real.\", \"CSC Student\", 1, \"2016-05-18 16:02:11\");");
$db->exec("INSERT INTO posts (post, author, user, time) VALUES (\"Shout-out to the deer I saw yesterday.\", \"Fourth Year\", 1, \"2016-05-19 16:16:18\");");

showTables();

function showTables() {
	
	// Style tables.
	echo "<style> td {background-color: #f0f0f0; padding: 10px;} table {margin-bottom: 20px;}</style>";
	echo "<table cellspacing=5>";
	
	$db = new SQLite3('spottedatutm.db');
	// Display Users.
	$results = $db->query('SELECT * FROM users');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["id"] . "</td><td>"
		. $row["email"] . "</td><td>"
		. $row["password"] . "</td><td>"
		. $row["birth"] . "</td><td>"
		. $row["verified"] . "</td></tr>");
	}
	echo "</table>";


	// Display Posts.
	$results = $db->query('SELECT * FROM posts');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["id"] . "</td><td>"
		. $row["post"] . "</td><td>"
		. $row["author"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["time"] . "</td><td>"
		. $row["likes"] . "</td><td>"
		. $row["flags"] . "</td><td>"
		. $row["ip"] . "</td></tr>");
	}
	echo "</table>";


	// Display Likes.
	$results = $db->query('SELECT * FROM likes');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["post"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["time"] . "</td><td>"
		. $row["ip"] . "</td></tr>");
	}
	echo "</table>";


	// Display Flags.
	$results = $db->query('SELECT * FROM flags');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["post"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["time"] . "</td><td>"
		. $row["ip"] . "</td></tr>");
	}
	echo "</table>";
	
	// Display Verifcations.
	$results = $db->query('SELECT * FROM verifications');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["verification"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["time"] . "</td></tr>");
	}
	echo "</table>";
	
		
	// Display Resets.
	$results = $db->query('SELECT * FROM resets');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["reset"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["password"] . "</td><td>"
		. $row["time"] . "</td></tr>");
	}
	echo "</table>";
	
	
	// Display Comments.
	$results = $db->query('SELECT * FROM comments');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["id"] . "</td><td>"
		. $row["comment"] . "</td><td>"
		. $row["author"] . "</td><td>"
		. $row["post"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["likes"] . "</td><td>"
		. $row["ip"] . "</td><td>"
		. $row["time"] . "</td></tr>");
	}
	echo "</table>";
	
	
	// Display Comment Likes.
	$results = $db->query('SELECT * FROM comment_likes');
	echo "<table>";
	while ($row = $results->fetchArray()) {
		echo("<tr><td>"
		. $row["comment"] . "</td><td>"
		. $row["user"] . "</td><td>"
		. $row["time"] . "</td><td>"
		. $row["ip"] . "</td></tr>");
	}
	echo "</table>";
}
?>
