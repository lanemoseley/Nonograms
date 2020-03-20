/**
 * Author: Lane Moseley
 * Description: This file contains javascript functions used for manipulating files.
 */

/**
 * Initialize a forced download.
 * @param obj -> the object that triggered the download event
 */
function initDownload(obj) {
    window.location.href = "force_download.php?file=" + encodeURI(obj.id);
}

/**
 * Import a nonogram from an xml file and store it in session storage.
 * @param file -> the file to import
 */
function importNonogramFromXML(file) {
    // make the file path
    let path = "../uploads/" + file;

    $.ajax({
        url: path,
        success: function (data) {
            var result = parseXML(data);
            sessionStorage.setItem('colorPickerValue', result.get('pickerValue'));
            sessionStorage.setItem('nonogramArray', JSON.stringify(result.get('grid')));
            sessionStorage.setItem('nonogramShape', JSON.stringify(result.get('shape')));
            window.location.href = "../index.php";
        },
        error: function () {
            alert("Error loading nonogram!");
        }
    });
}

/**
 * Export the nonogram grid to an XML file.
 * @param $grid -> the nonogram as an array
 * @param $pickerValue -> the color picker value
 */
function nonogramToXML($grid, $pickerValue) {
    // generate a timestamp for the file
    let $timeStamp = new Date().toISOString().substr(0, 19).replace('T', '_').replace(/:/g, '-');
    let $filename = "grid_" + $timeStamp;

    $.ajax({
        type: 'POST',
        url: 'write.php',
        data: {filename: $filename, pickerValue: $pickerValue, grid: $grid},
        success: function () {
            document.getElementById("status").innerHTML = "Last Saved: " + $timeStamp;
        },
        error: function () {
            document.getElementById("status").innerHTML = "Error saving nonogram!";
        }
    });
}

/**
 * Parse the nonogram from an XML file.
 * @param data -> the xml document
 */
function parseXML(data) {
    var result = new Map();
    result.set('pickerValue', data.getElementsByTagName("root")[0].getAttribute("pickerValue"));

    // get the nonogram array
    var cells = data.getElementsByTagName("value");
    var grid = [];

    for (var val in cells) {
        if (cells[val].hasChildNodes) {
            grid.push(cells[val].childNodes[0].nodeValue);
        }
    }

    result.set('grid', grid);

    // get the size of the nonogram grid
    let width = (grid.length === 25) ? 5 : 10;
    result.set('shape', [width, width]);

    return result;
}
