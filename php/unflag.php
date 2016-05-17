<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

/* --------------- G L O B A L S -------------- */

$ip = $_SERVER['REMOTE_ADDR']; // Client's IP address.
$output = array("error" => false,
			   	"invalid" => false,
			    "flagged" => true); // To be output as JSON.
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


// Check if like exists.
$stmt = $sql->prepare("SELECT * FROM flags WHERE id = :id AND ip = '" . $ip . "';");
$stmt->bindValue(":id", $id);
$result = $stmt->execute();
if ($result) {
	if (!$result->fetchArray()) {
		$output["flagged"] = false;
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
$stmt = $sql->prepare("DELETE FROM flags WHERE id = :id AND ip = '" . $ip . "';");
$stmt->bindValue(":id", $id);
if (!$stmt->execute()) {
	$output["error"] = true;
	echo json_encode($output);
	return;
}
$stmt->close();


// Reduce number of likes by 1.
$stmt = $sql->prepare("UPDATE posts SET flags = (flags - 1) WHERE id = :id");
$stmt->bindValue(":id", $id);
if (!$stmt->execute()) {
	$output["error"] = true;
}
$stmt->close();


/* ----------------- C L O S E ---------------- */ 

$sql->close();


echo json_encode($output);

?>