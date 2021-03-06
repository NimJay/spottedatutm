<?php

require("util/helper.php");

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */
session_save_path('../sessions');
ini_set('session.gc_probability', 1);
session_start();
// Not logged in.
if (!isset($_SESSION["id"])) {
	return setAndEcho($output, "invalid", true);
}
$user = $_SESSION["id"];
$post = $_POST['post'];
$author = $_POST['author'];
$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array( // To be output as JSON.
	"error" => false,
	"invalid" => false);

// Validate post.
if ($post == NULL) {
	return setAndEcho($output, "invalid", true);
}

// Validate author.

/* --------------- C O N N E C T -------------- */

$sql = new SQLite3("spottedatutm.db");

/* ------------------ U S E R ----------------- */

$stmt = $sql->prepare("SELECT * FROM users WHERE id = " . $user);
$result = $stmt->execute();
if ($result) {
	$u = $result->fetchArray();
	if ($u) { // Invalid combination.
		if (!$u["verified"]) {
			$output["verified"] = false;
		}
	} else {
		return setAndEcho($output, "error", true);
	}
} else {return setAndEcho($output, "error", true);}


/* ------------------ P O S T ----------------- */

if ($author == NULL) {
	$stmt = $sql->prepare("INSERT INTO posts (post, user, ip) VALUES ( :post , " . $user . ", '" . $ip . "');");
} else {
	$stmt = $sql->prepare("INSERT INTO posts (post, author, user, ip) VALUES ( :post , :author , " . $user . ", '" . $ip . "' );");
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