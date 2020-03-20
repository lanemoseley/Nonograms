/**
 * Author: Lane Moseley
 * Description: This file contains javascript setup code.
 */

/**
 * The start-up function.
 */
function start() {
    let defaultSize = [5, 5];

    // set up the color picker
    document.getElementById("colorPicker").onchange = function() { setPickerColor(this) };
    document.getElementById("colorPicker").onclick= function() { this.oldvalue = this.value; };
    document.getElementById("colorPicker").value = "#000000";

    // set up the buttons
    document.getElementById("resize5x5").onclick = function() { initResize( [5, 5] ); };
    document.getElementById("resize10x10").onclick = function() { initResize( [10, 10] ); };
    document.getElementById("undo").onclick = hist.undoCmd;
    document.getElementById("redo").onclick = hist.redoCmd;

    document.getElementById("save").onclick = function() {
        $grid = nonogramToArray();
        $pickerValue = document.getElementById("colorPicker").value;
        nonogramToXML($grid, $pickerValue);
    };

    // draw the grid
    drawGrid(defaultSize);
    updateUI();
}

window.onload = start;
