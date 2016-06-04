<?php

require("util/helper.php");

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */

$output = array( // To be output as JSON.
	"error" => false,
	"invalid" => false,
	"comments" => NULL);
if (!isset($_GET["post"])) {
	return setAndEcho($output, "invalid", true);
}
$post = $_GET["post"];


/* ----- P R E P A R E   &   E X E C U T E ---- */

$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM comments WHERE post = :post ORDER BY time");
$stmt->bindValue(":post", $post);
$result = $stmt->execute();
if ($result) {

	// Construct an array for each comment.
	$comments = array();
	while ($row = $result->fetchArray()) {
		$comments[] = array(
			"id" => $row['id'],
			"comment" => htmlspecialchars($row['comment']),
			"author" => htmlspecialchars($row['author']),
			"time" => htmlspecialchars($row['time']),
			"likes" => $row['likes']);
	}
	$output["comments"] = $comments;

} else {
	$output["error"] = true;
}


/* ----------------- C L O S E ---------------- */ 

$result->finalize();
$stmt->close();
$sql->close();

echo json_encode($output);

?>