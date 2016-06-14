<?php

require("util/helper.php");

/* ----------------- E R R O R ---------------- */

ini_set('display_errors', 1);
error_reporting(~0);


/* ---------------- G L O B A L S ------------- */

// To be output as JSON.
$output = array("error" => false,
				"exists" => true,
				"alreadyVerified" => false,
			   	"invalid" => false);

// POST Variables.
if (!isset($_GET['email'])) {
	return setAndEcho($output, "invalid", true);
}
$email = $_GET['email'];


/* ------------------ U S E R ----------------- */

// Check if user exists, and is not already verified.
$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM users WHERE email = :email ;");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();
if ($result) {
	$user = $result->fetchArray();
	if (!$user) {
		return setAndEcho($output, "exists", false);
	}
	if ($user["verified"]) { // Already verified.
		return setAndEcho($output, "alreadyVerified", true);
	}
} else {return setAndEcho($output, "error", true);}


/* ----------------- E M A I L ---------------- */

// Generate verifcation code.
$verification = md5(uniqid(rand(), true));
$message = "To verify your account for SpottedAtUTM, please go here: " . "http://spottedatutm.com/~jayawar9/spottedatutm/php/verify.php?verification=" . $verification . "&email=" . $email;
if (!mail($email, 'SpottedAtUTM Verification.', $message)) {
	//return setAndEcho($output, "email", false);
}
$stmt = $sql->prepare("INSERT INTO verifications (verification, user) VALUES ( \"" . $verification . "\", (SELECT id FROM users WHERE email = :email ));");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();

	
/* ------------- A U   R E V O I R ------------ */

$stmt->close();
$sql->close();
echo "Verification email resent to " . $email . ". <br/> Sorry, I was got a bit lazy with this page. - Nim";

?>