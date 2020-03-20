<?php
/**
 * Author: Lane Moseley
 * Description: This file contains functionality to display a whitelisting of files for the user.
 *              The user can then download or load each file.
 */

/**
 * Function to display the whitelisting of files.
 */
function displayFiles() {
    // get the list of files in the uploads directory
    $path = '../uploads/';
    $files = scandir($path);

    // ignore the . and .. directories
    $files = array_diff($files, array('.', '..'));

    // display the files and a load and download option
    foreach ($files as $file) {
        // replace spaces with %20 for html
        $fname = str_replace(' ', '%20', $file);

        echo "<tr>";
        echo "<td>$file</td>";
        echo "<td><button id=$fname onClick=\"importNonogramFromXML(this.id)\">Load</button></td><td><button id=$fname onClick=\"initDownload(this)\">Download</button><br></td>";
        echo "</tr>";
    }

    return;
}