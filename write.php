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

if(isset($_GET["w1"]) && isset($_GET["w2"]))
{
    $_SESSION["w1"] = $_GET["w1"];
    $_SESSION["w2"] = $_GET["w2"];
    writeXML();
}

$data = $_POST['data'] or $_REQUEST['data'];
$data = json_decode($data);
writeXML($data);

//this creates a example xml document from scratch and then walks through the results
function writeXML($data)
{


    //this is how to make a new xml doument with mydoc as teh outtermost tags
    $xmlTest = new SimpleXMLElement('<?xml version="1.0" encoding="utf-8"?><mydoc></mydoc>');

    //this is how to add an attribute
    $xmlTest->addAttribute('attribute', 'value goes here');

    //here is how to make a child
    $child = $xmlTest->addChild('W1');
    $child->addAttribute('Name', $data);

    $child = $xmlTest->addChild('W2');
    $child->addAttribute('Name', $_SESSION["w2"]);

    //another way to add a child
    $grandchild=$child->addChild('Grandchild', 'innermost');
    $grandchild->addAttribute('stuff', 'more stuff');
    $grandchild->addChild('Grandchild', 'innermost');

    $xmlTest->saveXML("uploads/out.xml");

    echo "<script>
             alert('message sent succesfully'); 
             window.history.go(-1);
     </script>";
}

?>