<?php

session_start();
echo "<style> td {background-color: #f0f0f0; padding: 10px;}</style>";
echo "<table cellspacing=5>";
echo "<tr><td> id </td><td>" . $_SESSION["id"] . "</td></tr>";
echo "</table>";

?>