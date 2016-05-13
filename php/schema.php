<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

// Open database (create if non-existent).
$db = new SQLite3('spottedatutm.db');


// Create table.
/*
$db->exec("DROP TABLE posts;");
$db->exec("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, post VARCHAR(500) NOT NULL, author VARCHAR(100), time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, likes UNSIGNED BIG INT DEFAULT 0, flags INTEGER DEFAULT 0, ip VARCHAR(15));");
*/

// Insert the initial posts.
/*
$db->exec("DELETE FROM posts WHERE 1=1");
$db->exec("INSERT INTO posts (post, author) VALUES (\"The first post is born.\", \"Nim\");");
$db->exec("INSERT INTO posts (post, author) VALUES (\"The second post is born.\", \"Nim\");");
$db->exec("INSERT INTO posts (post, author) VALUES (\"The third post is born.\", \"Nim\");");
$db->exec("INSERT INTO posts (post, author) VALUES (\"The fourth post is born.\", \"Nim\");");
$db->exec("INSERT INTO posts (post, author) VALUES (\"The fifth post is born.\", \"Nim\");");
$db->exec("INSERT INTO posts (post, author) VALUES (\"aNyOnE kNoW hOw To FiX a KeYbOaRd?\", \"ZAYN\");");
$db->exec("INSERT INTO posts (post, author) VALUES (\"I got guns in my head and they won't go.\", \"Cage The Elephants\");");

*/


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

?>
