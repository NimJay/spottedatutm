<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

$MAX_ID = 1000000;		// Highest post id in database.

// Categories.
$FIRE = 0;
$NEW = 1;

// error_reporting(0);


/* --------------- G L O B A L S -------------- */


$stream = $_GET['stream']; // FIRE, NEW, etc.
$numOfPosts = $_GET['numOfPosts']; // Number of posts to retrieve.
// $lastId is NULL on the very first query.
if ($_GET['lastId'] != NULL && is_numeric($_GET['lastId'])) {
	$lastId = $_GET['lastId'];
} else {
	$lastId = $MAX_ID;
}

$output = array( // To be output as JSON.
	"error" => false,
	"posts" => NULL);

if ($stream == NULL || $numOfPosts == NULL) {
	$output["error"] = true;
	echo json_encode($output);
	return;
}

/* ----- P R E P A R E   &   E X E C U T E ---- */

$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM posts WHERE id < :lastId ORDER BY id DESC LIMIT :numOfPosts");
$stmt->bindValue(":lastId", $lastId);
$stmt->bindValue(":numOfPosts", $numOfPosts);
$result = $stmt->execute();

if ($result) {

	// Construct an array for each post.
	$posts = array();
	while ($row = $result->fetchArray()) {
		$posts[] = array(
			"id" => $row['id'],
			"post" => htmlspecialchars($row['post']),
			"author" => htmlspecialchars($row['author']),
			"time" => htmlspecialchars($row['time']),
			"likes" => $row['likes'],
			"flags" => $row['flags']);
	}
	$output["posts"] = $posts;

} else {
	$output["error"] = true;
}


/* ----------------- C L O S E ---------------- */ 

$result->finalize();
$stmt->close();
$sql->close();

echo json_encode($output);

?>