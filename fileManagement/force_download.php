<?php
/**
 * Author: Lane Moseley
 * Description: This file contains php code that force downloads a given file.
 */

if (isset($_REQUEST["file"])) {
    // Decode the URL-encoded string
    $file = urldecode($_REQUEST["file"]);
}

// build the file path
$dir = "../uploads/";
$path_parts = pathinfo($file);
$extension = $path_parts['extension'];
$basename = $path_parts['basename'];
$path = $dir . $basename;

// download the file if it exists and is an XML file
if (file_exists($path) && $extension === "xml") {
    header("Content-disposition: attachment; filename=\"$basename\"");
    readfile($path);
} else {
    header('HTTP Error 500 - Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(array('message' => 'ERROR', 'code' => 1337)));
}