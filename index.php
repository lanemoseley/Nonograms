<html lang="en">
<head lang="en">
    <meta charset="UTF-8">
    <title>Home</title>
    <link rel="stylesheet" type="text/css" href="CSS/style.css">
    <script type="text/javascript"
            src="javascript/undo.js"></script>
</head>
<body onload="drawGrid([5, 5])">
    <?php include "includes/header.html" ?>

    <div class="content">
        <table>
            <tr><td>Color: <input type="color" id="colorPicker" value="#e66465" onchange="setColor()"></td><td><button onClick="drawGrid([5, 5])">5x5</button></td><td><button onClick="drawGrid([10, 10])">10x10</button></td></tr>
            <tr><td><button onClick="save()">Save</button></td><td><button onClick="undo()">Undo</button></td><td><button onClick="redo()">Redo</button></td></tr>
        </table>

        <p>Click the below buttoms to add information and undo and redo</p>
        <table id="nonogram"></table>

        <p><button id="undo">Undo</button><button id="redo">Redo</button></p>
        <p id="result"></p>

    </div>

    <?php include "includes/footer.html" ?>

</body>
</html>
