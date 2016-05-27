<?php

require("util/helper.php");

/* ----------------- E R R O R ---------------- */

ini_set('display_errors', 1);
error_reporting(~0);


/* ---------------- G L O B A L S ------------- */

// To be output as JSON.
$output = array("error" => false,
				"authenticated" => true,
				"verified" => true,
			   	"invalid" => false);

// GET Variables.
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

/* ------------- A U   R E V O I R ------------ */

// Check if like exists.
$sql = new SQLite3("spottedatutm.db");
$stmt = $sql->prepare("SELECT * FROM users WHERE email = :email AND password = :password ;");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":password", $password);
$result = $stmt->execute();
if ($result) {
	$user = $result->fetchArray();
	if (!$user) { // Invalid combination.
			return setAndEcho($output, "authenticated", false);
	} else {
		$output["authenticated"] = true;
		$output["verified"] = !!$user["verified"];
		$output["id"] = $user["id"];
		
		// Start SESSION!
		session_save_path('../sessions');
		ini_set('session.gc_probability', 1);
		if (!session_start()) {
			return setAndEcho($output, "error", true);
		}
		$_SESSION['id'] = $user["id"];
	}
} else {return setAndEcho($output, "error", true);}


/* ------------- A U   R E V O I R ------------ */

$stmt->close();
$sql->close();
echo json_encode($output);

?>