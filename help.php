<!--
Author: Lane Moseley
Description: This is the help page for the nonogram application.
-->

<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Help Page</title>
    <link rel="stylesheet" type="text/css" href="CSS/style.css">
</head>

<body>
<?php include "includes/header.html" ?>
<div class="content">
    <h1>Description</h1>
    <h3>Name: Lane Moseley</h3>
    <h3>Last Tier Completed: All Four Tiers Complete</h3>
    <h3>Graded Extensions (15pts Total):</h3>
    <dl>
        <dt>1B: 5pt Add a colored/image header and/or footer area</dt>
        <dd><span class="howto">How to test:</span> All pages contain a styled header and footer area</dd>
        <dt>4C: 5pt Adding an indicator for when the game is complete</dt>
        <dd><span class="howto">How to test:</span> An alert will display once the game has been
            completed (solutions are on this page)</dd>
        <dt>4D: 5pt Add an “unused” option to the color list that marks a cell,
            but does not count as being colored</dt>
        <dd><span class="howto">How to test:</span> Click a cell once to color it, then click it a second time to mark it with a red "X" to
            <br>indicate that the cell is unused (clicking the cell a third time will clear the cell entirely)</dd>
    </dl>
    <h3>Ungraded Extensions (listed for informational purposes only):</h3>
    <dl>
        <dt>2A: 5pt Add 4+ more colors</dt>
        <dd><span class="howto">How to test:</span> An HTML color picker is used to select from a wide range of colors</dd>
        <dt>3C: 5pt Allow more than 1 file (XML format)</dt>
        <dd><span class="howto">How to test:</span> The user is allowed to upload multiple files keeping in mind
            that same-name files are overwritten</dd>
        <dt>3E: 5pt Enable and disable the undo and redo button when applicable</dt>
        <dd><span class="howto">How to test:</span> Undo and redo are greyed out when a new nonogram file is loaded or the page
              is refreshed</dd>
        <dd><span class="howto">How to test:</span> Redo is greyed out if the user clicks undo and then makes a change</dd>
        <dd><span class="howto">How to test:</span> Undo is greyed out when the oldest change is reached</dd>
        <dt>4A: 5pt Display the number of consecutive colored cells in each row/column</dt>
        <dd><span class="howto">How to test:</span> These numbers are displayed above and to the left of the nonogram grid</dd>
    </dl>
    <h1>CSS & Javascript Modifications</h1>
    <dl>
        <dt>- footer.css and header.css contain CSS that styles the header and the footer areas</dt>
        <dt>- style.css is the main style sheet for the application</dt>
        <dt>- no CSS templates were used</dt>
        <dt>- all styling was done in the CSS files except when the nonogram cell background<br>color
            needed to be changed (this was done in JavaScript)</dt>
        <dt>- jQuery was used to help facilitate the use of AJAX to import and export nonogram grids
            to XML files</dt>
    </dl>
    <h1>Usage</h1>
    <dl>
        <dt>Solving the Puzzles:</dt>
        <dd>- two different nonogram puzzles can be solved (a 5x5 puzzle and a 10x10 puzzle)</dd>
        <dd>- the solution for the puzzle is determined by the grid size</dd>
        <dd>- an alert is displayed once a puzzle has been completed</dd>
        <dd>- <span class="howto">although many solutions may exist, this application only checks for the following two possible solutions:</span></dd>
        <dd>
            <br>
            <table class="images">
                <tr>
                    <th>5x5 Puzzle Solution</th>
                    <th>10x10 Puzzle Solution</th>
                </tr>
                <tr>
                    <td><img src="res/solution5x5.PNG" alt="5x5 Puzzle Solution"/></td>
                    <td><img src="res/solution10x10.PNG" alt="10x10 Solution"/></td>
                </tr>
            </table>
        </dd>
        <dt>Uploading, Downloading, Saving, and Restoring Nonograms:</dt>
        <dd>- files must be XML format</dd>
        <dd>- each user can upload multiple files</dd>
        <dd>- same-name files are overwritten</dd>
        <dd>- two files containing the solutions to each puzzle are available by default</dd>
        <dd>- files are saved with a default name of <span class="howto">grid_&lt;timestamp&gt;.xml</span></dd>
        <dt>Nonogram Cell Behavior:</dt>
        <dd>- cells are implemented with buttons which are cycled through three states</dd>
        <dd>- on the first click the cell color is changed to match the user-selected color (black is default)</dd>
        <dd>- on the second click a red "X" is displayed to indicated that the cell is unused</dd>
        <dd>- on the third click the cell contents are cleared</dd>
    </dl>

</div>
<?php include "includes/footer.html" ?>
</body>
</html>
