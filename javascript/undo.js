/**
 * Author: Lane Moseley
 * Description: This file contains javascript functions used to implement undo and redo. This file contains some code
 *              that has been adapted from sample code provided to the class by Dr. Rebenitsch.
 */

/**
 * helper class to handle the current location in the undo/redo list
 * @constructor
 */
function History() {
    var UndoRedos = [];
    var index = 0;

    // new UndoRedo, remove everything after the current UndoRedo index
    // and append the new function
    this.executeAction = function (cmd) {
        UndoRedos.length = index;
        UndoRedos.push(cmd);
        index = UndoRedos.length;

        // run the UndoRedo and update
        cmd.exec();
        updateUI();
    };

    // call the undo function on the current UndoRedo and move back one
    this.undoCmd = function () {
        if (index > 0) {
            var cmd = UndoRedos[index - 1];
            cmd.undo();
            index = index - 1;
            updateUI();
        }
    };

    // call the execution function on the current UndoRedo and move forward one
    this.redoCmd = function () {
        if (index < UndoRedos.length) {
            var cmd = UndoRedos[index];
            cmd.exec();
            index = index + 1;
            updateUI();
        }
    };


    // see if undo is available
    this.canUndo = function () {
        return index !== 0;
    };

    // see if redo is available
    this.canRedo = function () {
        return index < UndoRedos.length;
    };
}

/**
 * The concrete undo/redo class.
 * @param attrs -> the map of current attributes
 * @param oldAttrs -> the map of old attributes
 * @constructor
 */
function UndoRedo(attrs, oldAttrs) {
    this.old = oldAttrs;
    this.curr = attrs;

    this.exec = function () {
        // if id is not null update the html element associated with it
        if (this.curr.get('id') !== null) {
            var ele = document.getElementById(this.curr.get('id'));

            // update the buttons
            ele.innerHTML = this.curr.get('innerHTML');
            ele.style.backgroundColor = this.curr.get('backgroundColor');

            checkForWin();
        }

        // update the picker
        document.getElementById("colorPicker").value = this.curr.get('pickerColor');

        // if the grid shape has changed, update it
        if (JSON.stringify(this.curr.get('shape')) !== JSON.stringify(this.old.get('shape'))) {
            // save the entire grid
            this.curr.set('grid', nonogramToArray());
            drawGrid(this.curr.get('shape'));
        }
    };

    this.undo = function () {
        // if id is not null revert the html element associated with it
        if (this.curr.get('id') !== null) {
            var ele = document.getElementById(this.curr.get('id'));

            // revert the buttons
            ele.innerHTML = this.old.get('innerHTML');
            ele.style.backgroundColor = this.old.get('backgroundColor');

            checkForWin();
        }

        // revert the picker
        document.getElementById("colorPicker").value = this.old.get('pickerColor');

        // if the shape was changed, revert it
        if (JSON.stringify(this.curr.get('shape')) !== JSON.stringify(this.old.get('shape'))) {
            drawGrid(this.old.get('shape'), this.curr.get('grid').flat());
        }
    };
}

/**
 * Update the UI to indicate whether undo/redo is available.
 */
function updateUI() {
    document.getElementById("undo").disabled = !hist.canUndo();
    document.getElementById("redo").disabled = !hist.canRedo();
}

// instantiate the class
var hist = new History();
