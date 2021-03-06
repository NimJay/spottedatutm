<?php

require("util/helper.php");

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */
$output = array( // To be output as JSON.
	"error" => false,
	"flagged" => NULL,
	"liked" => NULL,
	"likedComments" => NULL,
	"user" => NULL);

session_save_path('../sessions');
ini_set('session.gc_probability', 1);
session_start();
// Not logged in.
if (!isset($_SESSION["id"])) {
	return setAndEcho($output, "invalid", true);
}
$user = $_SESSION["id"];


$sql = new SQLite3("spottedatutm.db");


/* ----------------- L I K E D ---------------- */

$stmt = $sql->prepare("SELECT post FROM likes WHERE user = " . $user);
$result = $stmt->execute();

if ($result) {
	$liked = array();
	while ($row = $result->fetchArray()) {
		$liked[] = $row['post'];
	}
	$output["liked"] = $liked;
} else {
	$output["error"] = true;
}

$result->finalize();
$stmt->close();


/* --------------- F L A G G E D -------------- */

$stmt = $sql->prepare("SELECT post FROM flags WHERE user = " . $user);
$result = $stmt->execute();

if ($result) {
	// Flagged posts.
	$flagged = array();
	while ($row = $result->fetchArray()) {
		$flagged[] = $row['post'];
	}
	$output["flagged"] = $flagged;
} else {
	$output["error"] = true;
}

$result->finalize();
$stmt->close();


/* -------- L I K E D   C O M M E N T S ------- */

$stmt = $sql->prepare("SELECT comment FROM comment_likes WHERE user = " . $user);
$result = $stmt->execute();

if ($result) {
	// Liked comments.
	$likedComments = array();
	while ($row = $result->fetchArray()) {
		$likedComments[] = $row['comment'];
	}
	$output["likedComments"] = $likedComments;
} else {
	$output["error"] = true;
}

$result->finalize();
$stmt->close();


/* ------------------ U S E R ----------------- */

$stmt = $sql->prepare("SELECT * FROM users WHERE id = " . $user);
$result = $stmt->execute();
if ($result) {
	$u = $result->fetchArray();
	if ($u) { // Invalid combination.
		$output["user"] = $u;
	} else {
		return setAndEcho($output, "error", true);
	}
} else {return setAndEcho($output, "error", true);}


/* ----------------- C L O S E ---------------- */ 

$sql->close();

echo json_encode($output);

?>