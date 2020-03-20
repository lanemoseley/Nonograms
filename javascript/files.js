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
            // get the color picker value
            let pickerValue = data.getElementsByTagName("root")[0].getAttribute("pickerValue");

            // get the nonogram array
            var cells = data.getElementsByTagName("value");
            var grid = [];

            for (var val in cells) {
                if (cells[val].hasChildNodes) {
                    grid.push(cells[val].childNodes[0].nodeValue);
                }
            }

            // get the size of the nonogram grid
            let width = (grid.length === 25) ? 5 : 10;

            sessionStorage.setItem('colorPickerValue', pickerValue);
            sessionStorage.setItem('nonogramArray', JSON.stringify(grid));
            sessionStorage.setItem('nonogramShape', JSON.stringify([width, width]));
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
    var $timeStamp = new Date().toISOString().substr(0, 19).replace('T', '_').replace(/:/g, '-');

    $.ajax({
        type: 'POST',
        url: 'write.php',
        data: {timeStamp: $timeStamp, pickerValue: $pickerValue, grid: $grid},
        success: function () {
            document.getElementById("status").innerHTML = "Last Saved: " + $timeStamp;
        },
        error: function () {
            document.getElementById("status").innerHTML = "Error saving nonogram!";
        }
    });
}