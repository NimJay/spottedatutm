<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */

$post = $_GET['post'];
$author = $_GET['author'];
$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array( // To be output as JSON.
	"error" => false,
	"invalid" => false);

// Validate post.
if ($post == NULL) {
	$output["invalid"] = true;
	echo json_encode($output);
	return;
}

// Validate author.

/* --------------- C O N N E C T -------------- */

$sql = new SQLite3("spottedatutm.db");
if ($author == NULL) {
	$stmt = $sql->prepare("INSERT INTO posts (post, ip) VALUES ( :post , '" .
						  $ip . "');");
} else {
	$stmt = $sql->prepare("INSERT INTO posts (post, author, ip) VALUES ( :post , :author , '" .
						  $ip . "' );");
	$stmt->bindValue(":author", $author);
}
$stmt->bindValue(":post", $post);
if (!$stmt->execute()) {
	$output["error"] = true;	
}


/* ----------------- C L O S E ---------------- */ 

$stmt->close();
$sql->close();


echo json_encode($output);

?>