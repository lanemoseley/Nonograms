//helper class to handle the current location in the undo/redo list
function History() {
    var UndoRedos =[];
    var index = 0

    //new UndoRedo, remove everything after the current UndoRedo index
    //and append the new function
    this.executeAction = function(cmd){
        UndoRedos.length = index; //trims length from 0 to index
        UndoRedos.push(cmd);
        index = UndoRedos.length

        //run the UndoRedo and update
        cmd.exec();
        updateUI();
    }


    //undo called. Call the undo function on the current UndoRedo and move back one
    this.undoCmd = function(){
        if(index > 0)
        {
            var cmd = UndoRedos[index-1];
            cmd.undo();
            index= index - 1;
            updateUI();
        }
    }

    //redo called. Call the execution function on the current UndoRedo and move forward one
    this.redoCmd = function(){
        if(index < UndoRedos.length)
        {
            var cmd = UndoRedos[index];
            cmd.exec();
            index = index + 1;
            updateUI();
        }
    }


    //is undo available
    this.canUndo = function(){
        return index != 0;
    }

    //is redo available
    this.canRedo = function(){
        return index < UndoRedos.length;
    }
}


//concrete UndoRedo class. Since we have undo and redo, we much have
//a "action" (exec) function and an undo
//ideally, this should forward these calls onto the class that does the task
function UndoRedo(id, attrs, oldAttrs, color, oldColor, shape, oldShape){
    this.old = oldAttrs;
    this.curr = attrs;
    this.id = id;
    this.color = color;
    this.shape = shape;
    this.oldColor = oldColor;
    this.oldShape = oldShape;
    this.currGrid = [ ];
    this.oldGrid;

    this.exec = function() {
        if (this.id !== -1) {
            var ele = document.getElementById(this.id);
            // update the buttons
            ele.innerHTML = this.curr[0];
            ele.style.backgroundColor = this.curr[1];
        }

        var picker = document.getElementById("colorPicker");

        // update the picker
        picker.value = this.color;

        // update the shape
        if (this.shape !== this.oldShape) {
            // save the grid
            this.currGrid = gridToArray();
            drawGrid(this.shape);
        }
    };

    this.undo = function() {
        if (this.id !== -1) {
            var ele = document.getElementById(this.id);

            // revert the buttons
            ele.innerHTML = this.old[0];
            ele.style.backgroundColor = this.old[1];
        }

        var picker = document.getElementById("colorPicker");

        // revert the picker
        picker.value = this.oldColor;

        // revert the shape
        if (this.shape !== this.oldShape) {
            drawGrid(this.oldShape, this.currGrid);
        }
    };
}

//toy version of the observer pattern
function updateUI()
{
    document.getElementById("undo").disabled = !hist.canUndo();
    document.getElementById("redo").disabled = !hist.canRedo();
}

//our undo/redo helper class
var hist = new History();


//attach all functions to html elements
window.onload = function() {
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
    document.getElementById("save").onclick = xmlTest;

    // draw the grid
    drawGrid([5, 5]);

    updateUI();
};

/**
 * Function to draw the nonogram grid
 * @param shape -> the shape of the table
 * @param values -> if given, values to populate grid with
 */
function drawGrid(shape, gridArr=null) {
    var oldShape = JSON.parse(sessionStorage.getItem('shape'));
    if (oldShape !== null) {
        shape = oldShape;
    }

    var values = JSON.parse(sessionStorage.getItem('grid'));

    if (values === null && gridArr !== null) {
        // TODO: should only be using 1 or 2 d arrays not a mix of both!!!!
        values = gridArr.flat();
    }

    var picker = sessionStorage.getItem('colorPicker');
    if (picker !== null) {
        document.getElementById("colorPicker").value = picker.value;
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

//    document.getElementById("colorPicker").value = color;

    sessionStorage.clear();
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

function checkForWin() {
    var userArr = gridToArray().flat();

    var path = "res/puzzle1.xml";
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

            var width = 5; // TODO: (grid.length === 25) ? 5 : 10;

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
                var final = gridToArray().flat();
                final.forEach(function(val, i) {
                    if (val === 'none') { final[i] = "X"; }
                });

                drawGrid([5, 5], final);

                alert("Congratulations, you solved this nonogram!")
            }
        }
    });
}

function gridToArray() {
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

function xmlTest() {
    var values = gridToArray();
    var pickerValue = document.getElementById("colorPicker").value;

    // TODO: these function wrappers can probably be removed
    $(document).ready(function() {
        var $timeStamp = new Date().toISOString().substr(0, 19).replace('T', '_').replace(/:/g, '-');
        var $grid = values;
        var $pickerValue = pickerValue;

        $('#save').on('click', function() {
            $.ajax({
                type: 'POST',
                url: 'write.php',
                data: { timeStamp: $timeStamp, pickerValue: $pickerValue, grid: $grid },
                success: function() {
                    document.getElementById("status").innerHTML = "Last Saved: " + $timeStamp;
                },
                error: function() {
                    document.getElementById("status").innerHTML = "Error saving nonogram!";
                }
            });
        });
    });
}