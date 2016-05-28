<?php

require("util/helper.php");

/* ----------------- E R R O R ---------------- */

ini_set('display_errors', 1);
error_reporting(~0);


/* ---------------- G L O B A L S ------------- */

// To be output as JSON.
$output = array("error" => false,
				"exists" => false,
			   	"invalid" => false);

// POST Variables.
if (!isset($_POST['email']) || !isset($_POST['password'])) {
	return setAndEcho($output, "invalid", true);
}
$email = $_POST['email'];
$password = $_POST['password']; 

// Use when debugging.
/*
$email = $_GET['email'];
$password = $_GET['password'];
*/

// Validate email.
if (!preg_match("/^(.)+@(mail\.)?utoronto\.ca$|^(.)+@utmsu\.ca$/i", $email)) {
	return setAndEcho($output, "invalid", true);
}
	
// Validate password.
if (strlen($password) < 6) {
	return setAndEcho($output, "invalid", true);
}


/* ---------------- E X I S T S --------------- */

// Check if email already registered.
$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM users WHERE email = :email ;");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();
if ($result) {
	$user = $result->fetchArray();
	if ($user) { // Invalid combination.
			return setAndEcho($output, "exists", true);
	}
} else {return setAndEcho($output, "error", true);}


/* ----------------- B I R T H ---------------- */

$stmt = $sql->prepare("INSERT INTO users (email, password, verified) VALUES ( :email , :password , 0);");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":password", $password);
$result = $stmt->execute();

/* ----------------- E M A I L ---------------- */

// Generate verifcation code.
$verification = md5(uniqid(rand(), true));
$output["debug"] = $verification;
$stmt = $sql->prepare("INSERT INTO verifications (verification, user) VALUES ( \"" . $verification . "\", (SELECT id FROM users WHERE email = :email ));");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();
$email = "To verify your account for SpottedAtUTM, please go here:" . "http://localhost/spottedatutm2/verify.html?verification=" . $verification . "email=" . $email;
if (!mail($email, 'SpottedAtUTM Verification.', $email)) {
	return setAndEcho($output, "error", true);
}

	
/* ------------- A U   R E V O I R ------------ */

$stmt->close();
$sql->close();
echo json_encode($output);

?>