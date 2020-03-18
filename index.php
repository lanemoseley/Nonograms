<html lang="en">
<head lang="en">
    <meta charset="UTF-8">
    <title>Home</title>
    <link rel="stylesheet" type="text/css" href="CSS/style.css">
    <script type="text/javascript"
            src="javascript/undo.js"></script>
    <script src="jquery/jquery.js"></script>
</head>
<body>
    <?php include "includes/header.html" ?>

    <div class="content">
        <p id="status"></p>
        <table>
            <tr><td>Color: <input type="color" id="colorPicker"></td><td><button id="resize5x5">5x5</button></td><td><button id="resize10x10">10x10</button></td></tr>
            <tr><td><button type="button" id="save">Save</button></td><td><button id="undo">Undo</button></td><td><button id="redo">Redo</button></td></tr>
        </table>

        <table id="nonogram"></table>

        <p id="result"></p>

    </div>

    <?php include "includes/footer.html" ?>

</body>
</html>
