<?php

require("util/helper.php");

/* ----------------- E R R O R ---------------- */

ini_set('display_errors', 1);
error_reporting(~0);


/* ---------------- G L O B A L S ------------- */

// To be output as JSON.
$output = array("error" => false,
				"exists" => true,
			   	"invalid" => false);

// POST Variables.
if (!isset($_POST["email"]) || !isset($_POST["password"])) {
	return setAndEcho($output, "invalid", true);
}
$email = $_POST["email"];
$password = $_POST["password"];

// Use when debugging.
/*
$email = $_GET['email'];
$password = $_GET['password'];
*/


/* ---------------- E X I S T S --------------- */

// Check if email unregistered.
$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM users WHERE email = :email ;");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();
if ($result) {
	$user = $result->fetchArray();
	if (!$user) { // Invalid combination.
		return setAndEcho($output, "exists", false);
	}
} else {return setAndEcho($output, "error", true);}


/* ---------------- F O R G O T --------------- */

// Generate "forgot" code.
$reset = md5(uniqid(rand(), true));
$stmt = $sql->prepare("INSERT INTO resets (reset, user, password) VALUES ( \"" . $reset . "\", (SELECT id FROM users WHERE email = :email ), :password );");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":password", $password);
$result = $stmt->execute();


/* ----------------- E M A I L ---------------- */
/* Nim: Debug: To be uncommented. And email is to be refined.
$message = "We, SpottedAtUTM, have received a request to reset your password to " . $password . ". To finalize this reset, please go here: " . "http://cslinux.utm.utoronto.ca/~jayawar9/spottedatutm/php/finalizeReset.php?reset=" . $reset . "&email=" . $email;
if (!mail($email, 'SpottedAtUTM Password Reset', $message)) {
	return setAndEcho($output, "error", true);
}
*/

/* ------------- A U   R E V O I R ------------ */

$stmt->close();
$sql->close();
echo json_encode($output);

?>