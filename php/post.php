<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */

$post = $_GET['post'];
$author = $_GET['author'];
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
	$stmt = $sql->prepare("INSERT INTO posts (post) VALUES ( :post );");
} else {
	$stmt = $sql->prepare("INSERT INTO posts (post, author) VALUES ( :post , :author );");
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