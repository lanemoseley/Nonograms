<?php

function upload()
{
    // TODO: is this actually sanitizing the string?
// sanitize
    $fname = $_FILES["fileToUpload"]["name"];
    $path_parts = pathinfo($fname);
    $fname = $path_parts['basename'];


    //keep uploads separate for security. uploads MUST allow public write, which is VERY unsafe if allowed in general
    $target_dir = "../uploads/";
    $message = '';

    $file = $_FILES["fileToUpload"];
    $target_file = $target_dir . $fname;

    //how to check for file type
    $imageFileType =
        strtolower(pathinfo($file["name"],PATHINFO_EXTENSION));

    if($imageFileType != "xml") {
        echo  "Only xml file types are supported. Please, try a different file.<br>";
        return;
    }

    // Check if file already exists, and delete it if it does so we can overwrite it
    if (file_exists($target_file)) {
        unlink($target_file);
    }

    // Check file size which should be MUCH smaller than the server limit
    if ($_FILES["fileToUpload"]["size"] > 5000) {
        $message = "Sorry, your file is too large.";
    }

    //check other errors
    $message .= 'Error uploading file';
    switch ($_FILES['fileToUpload']['error']) {
        case UPLOAD_ERR_OK:
            $message = false;;
            break;
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            $message .= ' - file too large.';
            break;
        case UPLOAD_ERR_PARTIAL:
            $message .= ' - file upload was not completed.';
            break;
        case UPLOAD_ERR_NO_FILE:
            $message .= ' - zero-length file uploaded.';
            break;
        default:
            $message .= ' - internal error #' . $_FILES['fileToUpload']['error'];
            break;
    }

    //if OK thus far, try to save
    if (!$message) {
        if (!is_uploaded_file($file['tmp_name'])) {
            $message = 'Error uploading file - unknown error.';
        } else {
            // Let's see if we can move the file.
            if (!move_uploaded_file($file["tmp_name"], $target_file)) { // No error suppression so we can see the underlying error.
                $message = 'Error uploading file - could not save upload 
                (this will probably be a permissions problem in ' . $target_dir . ')';
            }
        }
    }

    //final check, and copy and force download for confirmation
    if ($message != '') {
        echo $message;
    }
}

?>


