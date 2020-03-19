function initDownload(btn) {
    window.location.href = "download.php?file=" + encodeURI(btn.id);
}

function loadGrid(btn) {
    // var $grid = values;
    // var $pickerValue = pickerValue;
    var path = "../uploads/"
    path += btn.id;
    $.ajax({
        url: path,
        success: function(data) {
            var picker = data.getElementsByTagName("root")[0].getAttribute("pickerValue");

            var cells = data.getElementsByTagName("value");
            var grid = [ ];
            for (var val in cells) {
                if (cells[val].hasChildNodes) {
                    grid.push(cells[val].childNodes[0].nodeValue);
                }
            }

            var width = (grid.length === 25) ? 5 : 10;
            // var $grid2D = [ ];
            // while (grid.length) {
            //     $grid2D.push(grid.splice(0, width));
            // }

            sessionStorage.setItem('grid', JSON.stringify(grid));
            sessionStorage.setItem('colorPicker', picker);
            window.location.href = "../index.php";
        },
        error: function() {
            document.getElementById("status").innerHTML = "Error loading nonogram!";
        }
    });
}