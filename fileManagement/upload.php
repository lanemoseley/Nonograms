<?php
/**
 * Author: Lane Moseley
 * Description: This file contains php code that allows the user to upload files. This file is adapted from sample
 *              code provided to the class by Dr. Rebenitsch.
 */

/**
 * The function used for uploading files to the server.
 */
function upload() {
    // if no file is selected
    if ($_FILES["fileToUpload"]["name"] === "") {
        setHeader();
        return;
    }

    // build the file path
    $target_dir = "../uploads/";
    $fname = $_FILES["fileToUpload"]["name"];
    $path_parts = pathinfo($fname);
    $extension = $path_parts['extension'];
    $basename = $path_parts['basename'];

    $file = $_FILES["fileToUpload"];
    $target_file = $target_dir . $basename;
    $message = '';

    // only allow uploading of XML files
    if($extension != "xml") {
        // if the extension is incorrect, display an alert and exit
        ?>
        <script type="text/javascript">
            alert("Only xml file types are supported. Please try a different file.");
            window.location.href = "index.php";
        </script>
        <?php

        return;
    }

    // overwrite the file if it already exists
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

    // if OK thus far, try to save
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

    // final check, and copy and force download for confirmation
    if ($message != '') {
        echo $message;
    }

    setHeader();
    return;
}

/**
 * This function will redirect the user to the file management page.
 * This prevents form resubmission if they attempt to refresh the page.
 */
function setHeader() {
    header("Location: index.php");
    return;
}
