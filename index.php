<html lang="en">
<head lang="en">
    <meta charset="UTF-8">
    <title>Home</title>
    <link rel="stylesheet" type="text/css" href="CSS/style.css">
    <script type="text/javascript"
            src="javascript/undo.js"></script>
</head>
<body>
    <?php include "includes/header.html" ?>

    <div class="content">
        <table>
            <tr><td>Color: <input type="color"/></td><td><button onClick="resize()">5x5</button></td><td><button onClick="resize()">10x10</button></td></tr>
            <tr><td><button onClick="save()">Save</button></td><td><button onClick="undo()">Undo</button></td><td><button onClick="redo()">Redo</button></td></tr>
        </table>

        <p>Click the below buttoms to add information and undo and redo</p>
        <table class="nonogram">
            <tr><td><button id="buttonA">A</button></td><td><button id="buttonB">B</button></td><td><button id="buttonC">C</button></td><td><button id="buttonD">D</button></td><td><button id="buttonA">E</button></td></tr>
            <tr><td><button id="buttonA">A</button></td><td><button id="buttonB">B</button></td><td><button id="buttonC">C</button></td><td><button id="buttonD">D</button></td><td><button id="buttonA">E</button></td></tr>
            <tr><td><button id="buttonA">A</button></td><td><button id="buttonB">B</button></td><td><button id="buttonC">C</button></td><td><button id="buttonD">D</button></td><td><button id="buttonA">E</button></td></tr>
            <tr><td><button id="buttonA">A</button></td><td><button id="buttonB">B</button></td><td><button id="buttonC">C</button></td><td><button id="buttonD">D</button></td><td><button id="buttonA">E</button></td></tr>
            <tr><td><button id="buttonA">A</button></td><td><button id="buttonB">B</button></td><td><button id="buttonC">C</button></td><td><button id="buttonD">D</button></td><td><button id="buttonA">E</button></td></tr>
        </table>

        <p><button id="undo">Undo</button><button id="redo">Redo</button></p>
        <p id="result"></p>

    </div>

    <?php include "includes/footer.html" ?>

</body>
</html>
