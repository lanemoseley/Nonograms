/**
 * Author: Lane Moseley
 * Description: This file contains javascript functions used to implement the nonogram.
 */

/**
 * Convert the nonogram board to an array
 * @returns {[]} -> the nonogram as an array
 */
function nonogramToArray() {
    var grid = document.getElementById("nonogram");
    var values = [ ];

    for (var i = 0; i < grid.rows.length; i++) {
        for (var j = 0; j < grid.rows[i].cells.length; j++) {
            if (grid.rows[i].cells.item(j).firstChild.style.backgroundColor !== "") {
                var cellColor = grid.rows[i].cells.item(j).firstChild.style.backgroundColor;
                values.push(cellColor);
            } else if (grid.rows[i].cells.item(j).firstChild.innerText === "X") {
                values.push("X");
            } else {
                values.push("none");
            }
        }
    }

    return values;
}

/**
 * Check whether the current nonogram board is a winner.
 */
function checkForWin() {
    var curr = nonogramToArray().flat();
    var rows = document.getElementById("nonogram").rows.length;

    // get the path to the solution file
    var path = (rows === 5) ? "res/puzzle1.xml" : "res/puzzle2.xml";

    // load the solution file and check the difference
    $.ajax({
        url: path,
        success: function(data) {
            // clean up the user array so we can compare it to the solution
            var s = new Option().style;
            curr.forEach(function(val, i) {
                s.color = val;
                curr[i] = (s.color !== val) ? "X" : "1";
            });

            // check if the user's grid matches the solution
            if (JSON.stringify(curr) === JSON.stringify(parseXML(data).get('grid'))) {
                // if we have a match, fill in the blank cells with X's
                curr = nonogramToArray().flat();
                curr.forEach(function(val, i) { if (val === 'none') { curr[i] = "X"; } });
                drawGrid([rows, rows], curr);
                alert("Congratulations, you solved this nonogram!")
            }
        }
    });
}

/**
 * Set the nonogram grid cell value.
 * @param obj -> the grid cell
 */
function setGridCell(obj) {
    var picker = document.getElementById("colorPicker");
    var attrMap = new Map();
    var oldAttrMap = new Map();

    attrMap.set('id', obj.id);
    oldAttrMap.set('id', obj.id);

    var rows = document.getElementById("nonogram").rows.length;
    attrMap.set('shape', [rows, rows]);
    oldAttrMap.set('shape', [rows, rows]);

    attrMap.set('color', picker.value);
    oldAttrMap.set('color', picker.value);

    oldAttrMap.set('innerHTML', obj.innerHTML);
    oldAttrMap.set('backgroundColor', obj.style.backgroundColor);


    if (obj.style.backgroundColor != "" && obj.innerHTML != "X") {
        attrMap.set('innerHTML', 'X');
        attrMap.set('backgroundColor', '');
    } else if (obj.innerHTML == "X") {
        attrMap.set('innerHTML', '');
        attrMap.set('backgroundColor', '');
    } else {
        attrMap.set('innerHTML', '');
        attrMap.set('backgroundColor', picker.value);
    }

    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
    updateUI();
    checkForWin();
}

function setPickerColor(picker) {
    var attrMap = new Map();
    var oldAttrMap = new Map();

    attrMap.set('id', null);
    oldAttrMap.set('id', null);
    var rows = document.getElementById("nonogram").rows.length;
    attrMap.set('backgroundColor', '');
    attrMap.set('innerHTML', '');
    oldAttrMap.set('backgroundColor', '');
    oldAttrMap.set('innerHTML', '');

    attrMap.set('shape', [rows, rows]);
    oldAttrMap.set('shape', [rows, rows]);

    attrMap.set('color', picker.value);
    oldAttrMap.set('color', picker.oldvalue);

    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
}

/**
 * Resize the nonogram grid.
 * @param shape -> the shape to make the grid
 */
function resizeNonogram(shape) {
    var attrMap = new Map();
    var oldAttrMap = new Map();
    var picker = document.getElementById("colorPicker");
    attrMap.set('id', null);
    oldAttrMap.set('id', null);
    var rows = document.getElementById("nonogram").rows.length;
    attrMap.set('backgroundColor', '');
    attrMap.set('innerHTML', '');
    oldAttrMap.set('backgroundColor', '');
    oldAttrMap.set('innerHTML', '');

    attrMap.set('shape', shape);
    oldAttrMap.set('shape', [rows, rows]);

    attrMap.set('color', picker.value);
    oldAttrMap.set('color', picker.value);

    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
    drawGrid(shape);
}

/**
 * Function to draw the nonogram grid
 * @param shape -> the shape of the table
 * @param values -> if given, values to populate grid with
 */
function drawGrid(shape, gridArr=null) {
    var oldShape = JSON.parse(sessionStorage.getItem('nonogramShape'));
    if (oldShape !== null) {
        shape = oldShape;
    }

    var values = JSON.parse(sessionStorage.getItem('nonogramArray'));

    if (values === null && gridArr !== null) {
        // TODO: should only be using 1 or 2 d arrays not a mix of both!!!!
        values = gridArr;
    }

    var picker = sessionStorage.getItem('colorPickerValue');
    if (picker !== null) {
        document.getElementById("colorPicker").value = picker;
    }

    var table = document.getElementById( "nonogram" );
    table.innerHTML = "";

    for (var i = 0; i < shape[0]; ++i) {
        newRow = table.insertRow(i);

        for (var j = 0; j < shape[1]; ++j) {
            newCell = newRow.insertCell(j);

            var button = document.createElement('BUTTON');
            button.setAttribute("class", "gridButton");
            button.setAttribute("id", "button" + i*shape[1] + j);
            button.onclick = function() { setGridCell(this) };

            var text = document.createTextNode("");
            button.appendChild(text);

            if(values !== null) {
                if (values[i*shape[1] + j] === "X") {
                    button.innerHTML = "X";
                } else if (values[i*shape[1] + j] !== "none") {
                    button.style.backgroundColor = values[i*shape[1] + j];
                }
            }

            newCell.appendChild(button);
        }
    }

    var vals = JSON.parse(sessionStorage.getItem('nonogramArray'));
    if (vals !== null) {
        checkForWin();
    }

    sessionStorage.clear();
}