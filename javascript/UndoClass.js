// JavaScript Document//helper class to handle the current location in the undo/redo list
class History {
    constructor(){
        this.UndoRedos =[];
        this.index = 0;
    }

    //new UndoRedo, remove everything after the current UndoRedo index
    //and append the new function
    executeAction(cmd){
        this.UndoRedos.length = this.index; //trims length from 0 to index
        this.UndoRedos.push(cmd);
        this.index = this.UndoRedos.length

        //run the UndoRedo and update
        cmd.exec();
        updateUI();
    }


    //undo called. Call the undo functin on the current UndoRedo and move back one
    undoCmd(){
        if(this.index > 0)
        {
            var cmd = this.UndoRedos[this.index-1];
            cmd.undo();
            this.index= this.index - 1;
            updateUI();
        }
    }

    //redo called. Call the execution function on the current UndoRedo and move forward one
    redoCmd(){
        if(this.index < this.UndoRedos.length)
        {
            var cmd = this.UndoRedos[this.index];
            cmd.exec();
            this.index = this.index + 1;
            updateUI();
        }
    }


    //is undo available
    canUndo(){
        return this.index != 0;
    }

    //is redo available
    canRedo(){
        return this.index < this.UndoRedos.length;
    }
}


//concrete UndoRedo class. Since we have undo and redo, we much have
//a "action" (exec) function and an undo
//ideally, this should forward these calls onto the class that does the task
class UndoRedo{
    constructor(letter){
        this.letter = letter //need to store enought information to undo/redo
    }

    //appends the given letter to our result
    exec(){
        var out = document.getElementById("result")
        out.innerHTML += this.letter

    }

    //removes a letter
    undo(){
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

function undo()
{
    hist.undoCmd()
}
function redo()
{
    hist.redoCmd()
}
//attach all functions to html elements
window.onload = function() {
    //button click
    document.getElementById("buttonA").onclick = letterEvent;
    document.getElementById("buttonB").onclick = letterEvent;
    document.getElementById("buttonC").onclick = letterEvent;
    document.getElementById("buttonD").onclick = letterEvent;
    document.getElementById("undo").onclick = und;
    document.getElementById("redo").onclick = redo;

    updateUI();
}