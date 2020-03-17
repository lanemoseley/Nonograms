<?php
require_once 'upload.php';
?>

<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Grid Files</title>
    <link rel="stylesheet" type="text/css" href="../CSS/style.css">
</head>
<body>

<body>
    <?php include "../includes/header.html" ?>

    <div class="content">
        <!--basic structure for a file upload-->
        <?php
        //determine what to do based on GET variables
        if (isset($_GET['up'])) {
            upload();
        }
        ?>

        <table>
            <caption>Select file to upload:</caption>
            <form action="index.php?up=1" method="post" enctype="multipart/form-data">
                <tr><td><input type="file" name="fileToUpload" id="fileToUpload"></td></tr>
                <tr><td><input type="submit" value="Upload" name="submit"></td></tr>
            </form>
        </table>

        <table>
            <caption>Select file to load or download:</caption>
            <!-- TODO: this should be in a php file -->
            <?php
                $path = '../uploads/';
                $files = scandir($path);
                $files = array_diff($files, array('.', '..'));
                foreach($files as $file) {
                    echo "<tr>";
                    echo "<td>$file</td>";
                    echo "<td><button onClick=\"load()\">Load</button></td><td><button onClick=\"niceDownload()\">Download</button><br></td>";
                    echo "</tr>";
                }
            ?>
        </table>

        <!-- refresh the page, and build in a link to the file -->
        <script>
            //Script is local to make is easy to see

            //make a link
            function niceDownload() {
                window.location.href = "index.php?link=1"
            }
        </script>

        <p id="fileLink">
            <?php
            if (isset($_GET['link'])) {
                echo '<a href="../uploads/test.txt">Download file if it exists</a>';
            }
            ?>
        </p>

    </div>

    <?php include "../includes/footer.html" ?>

</body>

</body>
</html>
