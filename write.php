<?php
//this file is just generic phptester of how to walk/create the xml tree in php

//this should walk the entire XML tree
function walkTheTree($xml, $level)
{
    $indent = str_repeat('&nbsp;', $level *4 );
    $indentAttrib = $indent . str_repeat('&nbsp;', 4 );;
    //echo $indent."-----------------------<br>";
    //check each child of a node
    foreach($xml->children() as $child)
    {
        //print out the tags name and all its attributes and then its contents (inner text)
        echo $indent."Name:" . $child->getName();
        foreach($child->attributes() as $key => $var) {
            echo "<br>";
            echo $indentAttrib."key:". $key . "&nbsp;&nbsp;&nbsp;value: " . $var ;
        }
        echo "<br>".$indentAttrib."Contents: " . $child . "<br><br>";

        //redo the above with each child
        walkTheTree($child, $level + 1);

    }
}

if($_POST !== null or $_REQUEST !== null) {
    writeXML();
}

function writeXML($data) {
    //this is how to make a new xml doument with mydoc as teh outtermost tags
    $xml = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8"?><root></root>');

    // save the color picker value
    $xml->addAttribute('pickerValue', $_POST['pickerValue']);

    // save the cell values
    foreach($_POST['grid'] as $key=>$value) {
        $xml->addChild("cell" . $key, $value);
    }

    // save the xml file
    $xml->saveXML("uploads/out.xml");
}

?>