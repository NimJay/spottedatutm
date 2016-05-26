<?php

// Error reporting ON.
ini_set('display_errors', 1);
error_reporting(~0);

if ($_GET["password"] != "framenumber") {
	echo "Unauthorized.";
	return false;
}

$to = $_GET["to"];
if ($to == NULL) {
	echo "Please specify the recipient.";
	return false;
}


// The message
$message = "Line 1\r\nLine 2\r\nLine 3";

// In case any of our lines are larger than 70 characters, we should use wordwrap().
$message = wordwrap($message, 70, "\r\n");

// Send
$sent = mail($to, 'Yes, it works.', $message);

if ($sent) {
	echo 'Y';
} else {
	echo 'Nope.';
}
?>