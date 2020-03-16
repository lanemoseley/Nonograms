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


    //undo called. Call the undo functin on the current UndoRedo and move back one
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
function UndoRedo(letter){
    this.letter = letter //need to store enought information to undo/redo

    //appends the given letter to our result
    this.exec = function(){
        var out = document.getElementById("result")
        out.innerHTML += letter

    }

    //removes a letter
    this.undo = function(){
        var out = document.getElementById("result")
        out.innerHTML = out.innerHTML.slice(0,-1)
    }
}


//map UndoRedos onto buttons
function letterEvent(event) {
    if( event.target.id == "buttonA" )
        hist.executeAction(new UndoRedo("A"))
    else if( event.target.id == "buttonB" )
        hist.executeAction(new UndoRedo("B"))
    else if( event.target.id == "buttonC" )
        hist.executeAction(new UndoRedo("C"))
    else if( event.target.id == "buttonD" )
        hist.executeAction(new UndoRedo("D"))

    updateUI();

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
    //button click
    document.getElementById("buttonA").onclick = letterEvent;
    document.getElementById("buttonB").onclick = letterEvent;
    document.getElementById("buttonC").onclick = letterEvent;
    document.getElementById("buttonD").onclick = letterEvent;
    document.getElementById("undo").onclick = hist.undoCmd;
    document.getElementById("redo").onclick = hist.redoCmd;

    updateUI();
}

/**
 * Function to draw the nonogram grid
 * @param shape -> the shape of the table
 */
function drawGrid(shape) {
    var table = document.getElementById( "nonogram" );

    table.innerHTML = "";

    for (var i = 0; i < shape[0]; ++i) {
        newRow = table.insertRow(i);
        for (var j = 0; j < shape[1]; ++j) {
            newCell = newRow.insertCell(j);
            var button = document.createElement('BUTTON');
            button.setAttribute("class", "gridButton");
            button.setAttribute("id", "button" + i*shape[1] + j);
            var text = document.createTextNode("\xa0");
            button.appendChild(text);
            newCell.appendChild(button);
        }
    }

    // set the color
    setColor();
}

/**
 * Set the button color to the colorPicker's value
 */
function setColor() {
    var picker = document.getElementById("colorPicker");

    var buttons = document.getElementsByClassName("gridButton");
    var button;

    for (button of buttons) {
        button.style.backgroundColor = picker.value;
    }
}