<?php

require("util/helper.php");


/* ----------------- E R R O R ---------------- */

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
$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array("error" => false,
			   	"invalid" => false); // To be output as JSON.
// ID of Comment.
if (isset($_POST['id']) && is_numeric($_POST['id'])) {
	$id = $_POST['id'];
} else {
	return setAndEcho($output, "invalid", true);
}


/* --------------- C O N N E C T -------------- */

$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("INSERT INTO comment_likes (comment, user, ip) VALUES ( :comment , " . $user. ", '" . $ip . "');");
$stmt->bindValue(":comment", $id);
if (!$stmt->execute()) { // Would err if Comment is already liked.
	return setAndEcho($output, "error", true);
}
$stmt->close();

$stmt = $sql->prepare("UPDATE comments SET likes = (likes + 1) WHERE id = :id");
$stmt->bindValue(":id", $id);
if (!$stmt->execute()) {
	$output["error"] = true;
}
$stmt->close();


/* ----------------- C L O S E ---------------- */ 

$sql->close();
echo json_encode($output);

?>