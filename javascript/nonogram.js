/**
 * Author: Lane Moseley
 * Description: This file contains javascript functions used to implement the nonogram.
 */


/**
 * Generate an hash map with all necessary attributes set to their default value.
 * @param id -> the element id
 * @returns {Map<string, object>} -> the map
 */
function attributeMap(id = null) {
    var attrMap = new Map();

    attrMap.set('backgroundColor', '');
    attrMap.set('id', id);
    attrMap.set('innerHTML', '');
    attrMap.set('pickerColor', document.getElementById("colorPicker").value);

    attrMap.set('shape', [ ]);

    return attrMap;
}


/**
 * Check whether the current nonogram board is a winner.
 */
function checkForWin() {
    var curr = nonogramToArray().flat();

    // get the path to the solution file
    var path = (numRows() === 5) ? "res/puzzle1.xml" : "res/puzzle2.xml";

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
            var id = i * shape[1] + j;
            button.setAttribute("id", "button" + id);
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


    // table.insertRow(0);
    // var th = document.createElement('th');
    // th.innerHTML = "test";
    // row.appe
    // row.appendChild(th);


    // if a grid was loaded from session storage, check if it is a winner
    if (sessionStorage.getItem('nonogramArray') !== null) {
        checkForWin();
    }

    // if session storage was used, clear it
    sessionStorage.clear();
}


/**
 * Get the number of cols in the nonogram.
 * @returns {number} -> number of cols
 */
function numCols() {
    return Math.floor(document.getElementById("nonogram").getElementsByTagName('td').length / numRows() );
}


/**
 * Get the number of rows in the nonogram.
 * @returns {number} -> number of rows
 */
function numRows() {
    return document.getElementById("nonogram").getElementsByTagName('tr').length;
}


/**
 * Convert the nonogram board to an array
 * @returns {[]} -> the nonogram as an array
 */
function nonogramToArray() {
    var grid = document.getElementById("nonogram");
    var values = [];

    for (var i = 0; i < numRows(); i++) {
        for (var j = 0; j < numCols(); j++) {
            var id = i * numCols() + j;
            id = "button" + id;
            var cell = document.getElementById(id);

            if (cell.style.backgroundColor !== "") {
                values.push(cell.style.backgroundColor);
            } else if (cell.innerText === "X") {
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

    // GRADING: ACTION
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

    attrMap.set('shape', shape);
    oldAttrMap.set('shape', [numRows(), numRows()]);

    // GRADING: ACTION
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

    // GRADING: ACTION
    hist.executeAction(new UndoRedo(attrMap, oldAttrMap));
    updateUI();
}
