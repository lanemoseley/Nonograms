<!--
Author: Lane Moseley
Description: This is the landing page for file management.
             This page allows users to upload, download, and load XML files.
-->

<?php
require_once 'upload.php';
require_once 'file_list.php';
?>

<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Grid Files</title>
    <link rel="stylesheet" type="text/css" href="../CSS/style.css">
    <script type="text/javascript" src="../javascript/files.js"></script>
    <script src="../jquery/jquery.js"></script>
</head>
<body>
<?php include "../includes/header.html" ?>
<div class="content">
    <?php
    // if $_GET['up'] is set, upload the file
    if (isset($_GET['up'])) {
        upload();
    }
    ?>

    <table>
        <caption>Select file to upload:</caption>
        <form action="index.php?up=1" method="post" enctype="multipart/form-data">
            <tr>
                <td><input type="file" name="fileToUpload" id="fileToUpload"></td>
            </tr>
            <tr>
                <td><input type="submit" value="Upload" name="submit"></td>
            </tr>
        </form>
    </table>

    <table>
        <caption>Select file to load or download:</caption>
        <?php
            displayFiles();
        ?>
    </table>
</div>
<?php include "../includes/footer.html" ?>
</body>
</html>
