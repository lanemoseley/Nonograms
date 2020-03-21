/**
 * Author: Lane Moseley
 * Description: This file contains javascript functions used to implement the nonogram.
 */


/**
 * Generate an hash map with all necessary attribute values.
 * @param id -> the element id
 * @returns {Map<string, object>} -> the map
 */
function attributeMap(id = null) {
    var attrMap = new Map();

    attrMap.set('backgroundColor', '');
    attrMap.set('id', id);
    attrMap.set('innerHTML', '');
    attrMap.set('pickerColor', document.getElementById("colorPicker").value);

    var rows = document.getElementById("nonogram").rows.length;
    attrMap.set('shape', [rows, rows]);

    return attrMap;
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
        success: function (data) {
            // clean up the user array so we can compare it to the solution
            var s = new Option().style;
            curr.forEach(function (val, i) {
                s.color = val;
                curr[i] = (s.color !== val) ? "X" : "1";
            });

            // check if the user's grid matches the solution
            if (JSON.stringify(curr) === JSON.stringify(parseXML(data).get('grid'))) {
                // if we have a match, fill in the blank cells with X's
                curr = nonogramToArray().flat();
                curr.forEach(function (val, i) {
                    if (val === 'none') {
                        curr[i] = "X";
                    }
                });
                drawGrid([rows, rows], curr);
                alert("Congratulations, you solved this nonogram!")
            }
        }
    });
}


/**
 * Function to draw the nonogram grid
 * @param shape -> the shape of the table
 * @param grid -> if given, values to populate grid with
 */
function drawGrid(shape, grid = null) {
    // try to get as much info as possible from session storage
    var storedShape = JSON.parse(sessionStorage.getItem('nonogramShape'));
    if (storedShape !== null) { shape = storedShape; }

    var storedGrid = JSON.parse(sessionStorage.getItem('nonogramArray'));
    if (storedGrid !== null) { grid = storedGrid; }

    var pickerValue = sessionStorage.getItem('colorPickerValue');
    if (pickerValue !== null) { document.getElementById("colorPicker").value = pickerValue; }

    // get the table and reset it
    var table = document.getElementById("nonogram");
    table.innerHTML = "";

    // load the table with values
    for (var i = 0; i < shape[0]; ++i) {
        var row = table.insertRow(i);
        for (var j = 0; j < shape[1]; ++j) {
            var cell = row.insertCell(j);

            var button = document.createElement('BUTTON');
            button.setAttribute("class", "gridButton");
            button.setAttribute("id", "button" + i * shape[1] + j);
            button.onclick = function () { setGridCell(this) };
            var text = document.createTextNode("");
            button.appendChild(text);

            if (grid !== null) {
                if (grid[i * shape[1] + j] === "X") { button.innerHTML = "X"; }
                else if (grid[i * shape[1] + j] !== "none") { button.style.backgroundColor = grid[i * shape[1] + j]; }
            }

            cell.appendChild(button);
        }
    }

    // if a grid was loaded from session storage, check if it is a winner
    if (sessionStorage.getItem('nonogramArray') !== null) {
        checkForWin();
    }

    // if session storage was used, clear it
    sessionStorage.clear();
}


/**
 * Convert the nonogram board to an array
 * @returns {[]} -> the nonogram as an array
 */
function nonogramToArray() {
    var grid = document.getElementById("nonogram");
    var values = [];

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
 * Handle picker color change.
 * @param picker -> the color picker
 */
function onPickerColorChange(picker) {
    // get the default attributes
    var attrMap = attributeMap();
    var oldAttrMap = attributeMap();

    attrMap.set('pickerColor', picker.value);
    oldAttrMap.set('pickerColor', picker.oldvalue);

    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
}


/**
 * Resize the nonogram grid.
 * @param shape -> the shape to make the grid
 */
function resizeNonogram(shape) {
    // get the default attributes
    var attrMap = attributeMap();
    var oldAttrMap = attributeMap();

    var rows = document.getElementById("nonogram").rows.length;
    attrMap.set('shape', shape);
    oldAttrMap.set('shape', [rows, rows]);

    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
    drawGrid(shape);
}


/**
 * Set the nonogram grid cell value.
 * @param obj -> the grid cell
 */
function setGridCell(obj) {
    // get the default attributes
    var attrMap = attributeMap(obj.id);
    var oldAttrMap = attributeMap(obj.id);

    oldAttrMap.set('innerHTML', obj.innerHTML);
    oldAttrMap.set('backgroundColor', obj.style.backgroundColor);

    if (obj.style.backgroundColor !== "" && obj.innerHTML !== "X") {
        attrMap.set('innerHTML', 'X');
        attrMap.set('backgroundColor', '');
    } else if (obj.innerHTML === "X") {
        attrMap.set('innerHTML', '');
        attrMap.set('backgroundColor', '');
    } else {
        attrMap.set('innerHTML', '');
        attrMap.set('backgroundColor', document.getElementById("colorPicker").value);
    }

    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
    updateUI();
}
