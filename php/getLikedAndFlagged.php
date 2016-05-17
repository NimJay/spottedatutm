<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */

$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.

$output = array( // To be output as JSON.
	"error" => false,
	"flagged" => NULL,
	"liked" => NULL);


/* ----- P R E P A R E   &   E X E C U T E ---- */

$sql = new SQLite3("spottedatutm.db");

echo $ip;
// Liked Posts.
$stmt = $sql->prepare("SELECT id FROM likes WHERE ip = '" . $ip . "'");
$result = $stmt->execute();

if ($result) {
	$liked = array();
	while ($row = $result->fetchArray()) {
		$liked[] = $row['id'];
	}
	$output["liked"] = $liked;
} else {
	$output["error"] = true;
}

$result->finalize();
$stmt->close();


// Flagged Posts. 
$stmt = $sql->prepare("SELECT id FROM flags WHERE ip = '" . $ip . "'");
$result = $stmt->execute();

if ($result) {
	// Liked posts.
	$flagged = array();
	while ($row = $result->fetchArray()) {
		$flagged[] = $row['id'];
	}
	$output["flagged"] = $flagged;
} else {
	$output["error"] = true;
}

$result->finalize();
$stmt->close();


/* ----------------- C L O S E ---------------- */ 

$sql->close();

echo json_encode($output);

?>