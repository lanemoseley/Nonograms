/**
 * Author: Lane Moseley
 * Description: This file contains javascript functions used to implement the nonogram.
 */

function nonogramToArray() {
    var grid = document.getElementById("nonogram")
    var values = [ ]

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

function checkForWin() {
    var userArr = nonogramToArray().flat();

    var rows = document.getElementById("nonogram").rows.length;
    var path = (rows === 5) ? "res/puzzle1.xml" : "res/puzzle2.xml";

    $.ajax({
        url: path,
        success: function(data) {
            var cells = data.getElementsByTagName("value");
            var grid = [ ];
            for (var val in cells) {
                if (cells[val].hasChildNodes) {
                    grid.push(cells[val].childNodes[0].nodeValue);
                }
            }

            // clean up the user array so we can compare it to the solution
            var clr = new Option().style;
            userArr.forEach(function(val, i) {
                clr.color = val;

                // check if not a valid color
                if (clr.color !== val) {
                    userArr[i] = "X";
                } else {
                    userArr[i] = "1";
                }
            });

            if (JSON.stringify(userArr) == JSON.stringify(grid)) {
                var final = nonogramToArray().flat();
                final.forEach(function(val, i) {
                    if (val === 'none') { final[i] = "X"; }
                });

                drawGrid([rows, rows], final);

                alert("Congratulations, you solved this nonogram!")
            }
        }
    });
}

/**
 * Set the button color to the colorPicker's value
 */
// TODO: this is not a good name
function setColor(btn) {
    var picker = document.getElementById("colorPicker");
    var innerhtml, background, newAttrs, oldAttrs;
    oldAttrs = [btn.innerHTML, btn.style.backgroundColor];
    var rows = document.getElementById("nonogram").rows.length;
    var shape = [rows, rows];
    var color = picker.value;

    if (btn.style.backgroundColor != "" && btn.innerHTML != "X") {
        innerhtml = "X";
        background = "";
        newAttrs = [innerhtml, background];

        hist.executeAction(new UndoRedo(btn.id, newAttrs, oldAttrs, color, color, shape, shape));
    } else if (btn.innerHTML == "X") {
        innerhtml = "";
        background = "";
        newAttrs = [innerhtml, background];

        hist.executeAction(new UndoRedo(btn.id, newAttrs, oldAttrs, color, color, shape, shape));
    } else {
        innerhtml = "";
        background = picker.value;
        newAttrs = [innerhtml, background];

        hist.executeAction(new UndoRedo(btn.id, newAttrs, oldAttrs, color, color, shape, shape));
    }

    updateUI();
    checkForWin();
}

function setPickerColor(picker) {
    var id = -1;
    var attrs = [ ];
    var oldAttrs = [ ];

    var oldColor = picker.oldvalue;
    var newColor = picker.value;

    var rows = document.getElementById("nonogram").rows.length;
    var shape = [rows, rows];


    hist.executeAction(new UndoRedo(id, attrs, oldAttrs, newColor, oldColor, shape, shape));
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
        values = gridArr.flat();
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
            button.onclick = function() { setColor(this) };

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