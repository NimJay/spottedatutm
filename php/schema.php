<?php

// Authorization.
if ($_GET['password'] != "framenumber") {
	echo "Unauthorized.";
	return;
}

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

// Open database (create if non-existent).
$db = new SQLite3('spottedatutm.db');

// Create table for Posts.

$db->exec("DROP TABLE posts;");
$db->exec("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, post VARCHAR(500) NOT NULL, author VARCHAR(100), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, likes UNSIGNED BIG INT DEFAULT 0, flags INTEGER DEFAULT 0, ip VARCHAR(15));");


// Insert the initial posts.

$db->exec("DELETE FROM posts WHERE 1=1");
$db->exec("INSERT INTO posts (post, author, time) VALUES (\"The first post is born.\", \"Nim\", \"2016-05-14 19:42:51\");");
$db->exec("INSERT INTO posts (post, author, time) VALUES (\"The second post is born.\", \"Nim\", \"2016-05-14 19:42:51\");");
$db->exec("INSERT INTO posts (post, time) VALUES (\"To the guy in MGM101 who actually stood up to greet people, you the real MVP.\", \"2016-05-18 15:59:57\");");
$db->exec("INSERT INTO posts (post, author, time) VALUES (\"Shout-outs to the second-floor janitors at DH for keeping it real.\", \"CSC Student\", \"2016-05-18 16:02:11\");");
$db->exec("INSERT INTO posts (post, author, time) VALUES (\"Shout-out to the deer I saw yesterday.\", \"Fourth Year\", \"2016-05-19 16:16:18\");");



// Display posts.
$results = $db->query('SELECT * FROM posts');
echo "<table>";
while ($row = $results->fetchArray()) {
    echo("<tr><td>"
	. $row["id"] . "</td><td>"
	. $row["post"] . "</td><td>"
	. $row["author"] . "</td><td>"
	. $row["time"] . "</td><td>"
	. $row["likes"] . "</td><td>"
	. $row["flags"] . "</td><td>"
	. $row["ip"] . "</td></tr>");
}
echo "</table>";

// Create tables for Likes and Flags.

$db->exec("DROP TABLE likes;");
$db->exec("CREATE TABLE likes (id INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, ip VARCHAR(15) NOT NULL, PRIMARY KEY(id, ip), FOREIGN KEY (id) REFERENCES posts(id));");
$db->exec("DROP TABLE flags;");
$db->exec("CREATE TABLE flags (id INTEGER NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, ip VARCHAR(15) NOT NULL, PRIMARY KEY(id, ip), FOREIGN KEY (id) REFERENCES posts(id));");


?>
