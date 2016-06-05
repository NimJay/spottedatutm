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
$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array("error" => false,
			   	"invalid" => false,
			    "liked" => true); // To be output as JSON.
// ID of Post.
if ($_POST['id'] != NULL && is_numeric($_POST['id'])) {
	$id = $_POST['id'];
} else {
	$output["invalid"] = true;
	echo json_encode($output);
	return;
}


/* --------------- C O N N E C T -------------- */

$sql = new SQLite3("spottedatutm.db");


// Check if like exists.
$stmt = $sql->prepare("SELECT * FROM likes WHERE post = :post AND user = " . $user . ";");
$stmt->bindValue(":post", $id);
$result = $stmt->execute();
if ($result) {
	if (!$result->fetchArray()) {
		$output["liked"] = false;
		echo json_encode($output);
		return;	
	}
} else {
	$output["error"] = true;
	echo json_encode($output);
	return;
}
$stmt->close();
$result->finalize();


// Delete like.
$stmt = $sql->prepare("DELETE FROM likes WHERE post = :post AND user = " . $user . ";");
$stmt->bindValue(":post", $id);
if (!$stmt->execute()) {
	$output["error"] = true;
	echo json_encode($output);
	return;
}
$stmt->close();


// Reduce number of likes by 1.
$stmt = $sql->prepare("UPDATE posts SET likes = (likes - 1) WHERE id = :id");
$stmt->bindValue(":id", $id);
if (!$stmt->execute()) {
	$output["error"] = true;
}
$stmt->close();


/* ----------------- C L O S E ---------------- */ 

$sql->close();


echo json_encode($output);

?>