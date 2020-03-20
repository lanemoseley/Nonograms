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
function UndoRedo(btn, attrs){
    this.old = [btn.innerHTML, btn.style.backgroundColor];
    this.curr = attrs;
    this.btn = btn;

    //appends the given letter to our result
    this.exec = function() {
        this.btn.innerHTML = this.curr[0];
        this.btn.style.backgroundColor = this.curr[1];
    };

    //removes a letter
    this.undo = function() {
        this.btn.innerHTML = this.old[0];
        this.btn.style.backgroundColor = this.old[1];
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
    document.getElementById("colorPicker").onchange = setColor;
    document.getElementById("colorPicker").value = "#000000";

    // set up buttons
    document.getElementById("resize5x5").onclick = function() { drawGrid([5, 5]) };
    document.getElementById("resize10x10").onclick = function() { drawGrid([10, 10]) };
    document.getElementById("undo").onclick = hist.undoCmd;
    document.getElementById("redo").onclick = hist.redoCmd;
    document.getElementById("save").onclick = xmlTest;

    // draw the grid
    drawGrid([5, 5]);

    updateUI();
}

/**
 * Function to draw the nonogram grid
 * @param shape -> the shape of the table
 * @param values -> if given, values to populate grid with
 */
function drawGrid(shape) {
    var oldShape = JSON.parse(sessionStorage.getItem('shape'));
    if (oldShape !== null) {
        shape = oldShape;
    }

    var values = JSON.parse(sessionStorage.getItem('grid'));

    var picker = sessionStorage.getItem('colorPicker');

    if (picker === null) {
        picker = "#000000";
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

    document.getElementById("colorPicker").value = picker;

    sessionStorage.clear();
}

/**
 * Set the button color to the colorPicker's value
 */
// TODO: this is not a good name
function setColor(btn) {
    var picker = document.getElementById("colorPicker");
    var innerhtml, background, attrs;

    if (btn.style.backgroundColor != "" && btn.innerHTML != "X") {
        innerhtml = "X";
        background = "";
        attrs = [innerhtml, background];

        hist.executeAction(new UndoRedo(btn, attrs));
    } else if (btn.innerHTML == "X") {
        innerhtml = "";
        background = "";
        attrs = [innerhtml, background];

        hist.executeAction(new UndoRedo(btn, attrs));
    } else {
        innerhtml = "";
        background = picker.value;
        attrs = [innerhtml, background];

        hist.executeAction(new UndoRedo(btn, attrs));
    }

    updateUI();
}

function xmlTest() {
    var grid = document.getElementById("nonogram")
    var values = [ ]
    var pickerValue = document.getElementById("colorPicker").value;

    for (var i = 0; i < grid.rows.length; i++) {
        for (var j = 0; j < grid.rows[i].cells.length; j++) {
            //console.log(grid.rows[i].cells.item(j).style.backgroundColor);
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