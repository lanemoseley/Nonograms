<?php
require_once 'upload.php';
?>

<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>TODO: File Stuff Page</title>
    <link rel="stylesheet" type="text/css" href="../CSS/style.css">
</head>
<body>

<body>
    <?php include "../includes/header.html" ?>

    <div class="content">
        <h1>File Stuff Page Header</h1>
        <h3>Uploading</h3>
        <!--basic structure for a file upload-->
        <?php
        //determine what to do based on GET variables
        if (isset($_GET['up'])) {
            upload();
        }
        ?>
        <form action="index.php?up=1" method="post" enctype="multipart/form-data">
            Select file to upload:

            <!--name and id are used as identifiers of the file on the php side-->
            <input type="file" name="fileToUpload" id="fileToUpload">
            <input type="submit" value="Upload" name="submit">
        </form>
    </div>

    <?php include "../includes/footer.html" ?>

</body>

</body>
</html>
