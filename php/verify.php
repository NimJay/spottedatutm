<?php

require("util/helper.php");

/* ----------------- E R R O R ---------------- */

ini_set('display_errors', 1);
error_reporting(~0);


/* ---------------- G L O B A L S ------------- */

// To be output as JSON.
$output = array("error" => false,
			   	"invalid" => false,
			   	"alreadyVerified" => false,
			   	"noMatch" => false);

// POST Variables.
if (!isset($_GET["email"]) || !isset($_GET["verification"])) {
	return setAndEcho($output, "invalid", true);
}
$email = $_GET["email"];
$verification = $_GET["verification"];


/* ------------------ U S E R ----------------- */

// Check if user exists, and is not verified.
$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM users WHERE email = :email ;");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();
if ($result) {
	$user = $result->fetchArray();
	if ($user["verified"]) { // Already verified.
			return setAndEcho($output, "alreadyVerified", true);
	}
} else {return setAndEcho($output, "error", true);}


/* ---------- V E R I F I C A T I O N --------- */

$stmt = $sql->prepare("SELECT * FROM verifications WHERE user = (SELECT id FROM users WHERE email = :email ) AND verification = :verification");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":verification", $verification);
$result = $stmt->execute();
if ($result) {
	if (!$result->fetchArray()) { // No match found.
			return setAndEcho($output, "noMatch", true);
	}
} else {return setAndEcho($output, "error", true);}

// DELETE all rows from verifications for user.
$stmt = $sql->prepare("DELETE FROM verifications WHERE user = (SELECT id FROM users WHERE email = :email )");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();

// UPDATE verified to true (1).
$stmt = $sql->prepare("UPDATE users SET verified = 1 WHERE id = (SELECT id FROM users WHERE email = :email )");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();


/* ------------- A U   R E V O I R ------------ */

$stmt->close();
$sql->close();
header('Location: ../index.html#verified');
echo json_encode($output);

?>