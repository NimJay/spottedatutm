<?php

/* ----------------- E R R O R ---------------- */

ini_set('display_errors', 1);
error_reporting(~0);


/* ---------------- G L O B A L S ------------- */

// To be output as JSON.
$output = array("error" => false,
			   	"invalid" => false);

session_save_path('../sessions');
ini_set('session.gc_probability', 1);
session_start();
session_unset();
session_destroy();

echo json_encode($output);

?>