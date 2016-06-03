<?php

require("util/helper.php");

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);


/* --------------- S E S S I O N -------------- */

session_save_path('../sessions');
ini_set('session.gc_probability', 1);
session_start();
// Not logged in.
if (!isset($_SESSION["id"])) {
	return setAndEcho($output, "invalid", true);
}
$user = $_SESSION["id"];


/* --------------- G L O B A L S -------------- */

$comment = $_POST['comment'];
$author = $_POST['author'];
$post = $_POST['post'];

/* Used when debugging.
$comment = $_GET['comment'];
$author = $_GET['author'];
$post = $_GET['post'];
*/

$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array( // To be output as JSON.
	"error" => false,
	"verified" => true,
	"invalid" => false);

// Validate post.

if (!isset($_POST['comment']) || !isset($_POST['post'])) {
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


/* ---------------- I N S E R T --------------- */

if ($author == NULL) {
	$stmt = $sql->prepare("INSERT INTO comments (comment, post, user, ip) VALUES ( :comment , :post, " . $user . ", '" . $ip . "' );");
} else {
	$stmt = $sql->prepare("INSERT INTO comments (comment, author, post, user, ip) VALUES ( :comment , :author , :post, " . $user . ", '" . $ip . "' );");
	$stmt->bindValue(":author", $author);
}
$stmt->bindValue(":comment", $comment);
$stmt->bindValue(":post", $post);
if (!$stmt->execute()) {
	$output["error"] = true;
}


/* ----------------- C L O S E ---------------- */ 

$stmt->close();
$sql->close();


echo json_encode($output);

?>