<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */

$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array("error" => false,
			   	"invalid" => false); // To be output as JSON.
// ID of Post.
if ($_GET['id'] != NULL && is_numeric($_GET['id'])) {
	$id = $_GET['id'];
} else {
	$output["invalid"] = true;
	echo json_encode($output);
	return;
}


/* --------------- C O N N E C T -------------- */

$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("INSERT INTO flags (id, ip) VALUES ( :id , '" . $ip . "');");
$stmt->bindValue(":id", $id);
if (!$stmt->execute()) { // Would err if Post is already liked.
	$output["error"] = true;
	echo json_encode($output);
	return;
}
$stmt->close();

$stmt = $sql->prepare("UPDATE posts SET flags = (flags + 1) WHERE id = :id");
$stmt->bindValue(":id", $id);
if (!$stmt->execute()) {
	$output["error"] = true;
}
$stmt->close();


/* ----------------- C L O S E ---------------- */ 

$sql->close();


echo json_encode($output);

?>