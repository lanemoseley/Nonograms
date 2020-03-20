/**
 * Author: Lane Moseley
 * Description: This file contains javascript setup code.
 */


function start() {
    // set up the color picker
    document.getElementById("colorPicker").onchange = function() { setPickerColor(this) };
    document.getElementById("colorPicker").onclick= function() {this.oldvalue = this.value; };
    document.getElementById("colorPicker").value = "#000000";

    // set up buttons
    document.getElementById("resize5x5").onclick = function() {
        var rows = document.getElementById("nonogram").rows.length;
        this.oldshape = [rows, rows];
        this.newshape = [5, 5];

        var id = -1;
        var attrs = [ ];
        var color = document.getElementById("colorPicker").value;

        hist.executeAction(new UndoRedo(id, attrs, attrs, color, color, this.newshape, this.oldshape));

        drawGrid(this.newshape);
    };

    document.getElementById("resize10x10").onclick = function() {
        var rows = document.getElementById("nonogram").rows.length;
        this.oldshape = [rows, rows];
        this.newshape = [10, 10];

        var id = -1;
        var attrs = [ ];
        var color = document.getElementById("colorPicker").value;

        hist.executeAction(new UndoRedo(id, attrs, attrs, color, color, this.newshape, this.oldshape));

        drawGrid(this.newshape);
    };

    document.getElementById("undo").onclick = hist.undoCmd;
    document.getElementById("redo").onclick = hist.redoCmd;

    document.getElementById("save").onclick = function() {
        $grid = nonogramToArray();
        $pickerValue = document.getElementById("colorPicker").value;
        nonogramToXML($grid, $pickerValue);
    };

    // draw the grid
    drawGrid([5, 5]);

    updateUI();
}

window.onload = start;
