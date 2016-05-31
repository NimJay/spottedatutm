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
if (!isset($_GET["email"]) || !isset($_GET["reset"])) {
	return setAndEcho($output, "invalid", true);
}
$email = $_GET["email"];
$reset = $_GET["reset"];


/* ----------------- R E S E T ---------------- */

$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM resets WHERE user = (SELECT id FROM users WHERE email = :email ) AND reset = \"" . $reset . "\"");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();
if ($result) {
	$reset = $result->fetchArray();
	if (!$reset) { // No match found.
			return setAndEcho($output, "noMatch", true);
	}
	$password = $reset["password"];
} else {return setAndEcho($output, "error", true);}

// DELETE all rows from resets for user.
$stmt = $sql->prepare("DELETE FROM resets WHERE user = (SELECT id FROM users WHERE email = :email )");
$stmt->bindValue(":email", $email);
$result = $stmt->execute();

// UPDATE verified to true (1).
$stmt = $sql->prepare("UPDATE users SET password = :password WHERE id = (SELECT id FROM users WHERE email = :email )");
$stmt->bindValue(":password", $password);
$stmt->bindValue(":email", $email);
$result = $stmt->execute();


/* ------------- A U   R E V O I R ------------ */

$stmt->close();
$sql->close();
header('Location: ../index.html#reset');
echo json_encode($output);

?>