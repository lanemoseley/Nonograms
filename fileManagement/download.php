<?php

if(isset($_REQUEST["file"])) {
    // Get parameters
    $file = urldecode($_REQUEST["file"]); // Decode URL-encoded string
}

// TODO: is this actually sanitizing the string?
// sanitize
$target_dir = "../uploads/";
$path_parts = pathinfo($file);
$target_file = $path_parts['basename'];
$path = $target_dir . $target_file;
// $target_file = $target_dir . $_POST['filename'];

if (file_exists($path)) {
    header("Content-disposition: attachment; filename=\"$target_file\"");
    readfile($path);
} else {
    header('HTTP Error 500 - Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(array('message' => 'ERROR', 'code' => 1337)));
}