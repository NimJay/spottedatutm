<?php

/* ---------------- H E L P E R --------------- */

function setAndEcho($output, $key, $value) {
	$output[$key] = $value;
	echo json_encode($output);
	return;
}

?>