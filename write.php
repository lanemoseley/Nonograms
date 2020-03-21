<?php
/**
 * Author: Lane Moseley
 * Description: This file contains php code that writes a nonogram grid to an xml file. This file is adapted from sample
 *              code provided to the class by Dr. Rebenitsch.
 */

// check to see if there is anything to write
if ($_POST !== null or $_REQUEST !== null) {
    writeXML();
}

/**
 * Write the nonogram grid to an XML file.
 */
function writeXML() {
    $xml = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8"?><root></root>');

    // save the color picker value
    $xml->addAttribute('pickerValue', $_POST['pickerValue']);

    // save the cell values
    foreach ($_POST['grid'] as $key => $value) {
        $child = $xml->addChild("cell");
        $child->addChild('index', $key);
        $child->addChild('value', $value);
    }

    // save the xml file
    $fname = "uploads/" . $_POST['filename'] . ".xml";

    // if there is an error saving the file, report it to the client
    if (!$xml->saveXML($fname)) {
        header('HTTP Error 500 - Internal Server Error');
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'ERROR', 'code' => 1337)));
    }
}
