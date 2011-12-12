<?php
require("database.php");

function add($action) {
	$table = $action["table"];
	
	$counter = 0;
	$columnsString = "";
	$valuesString = "";
	foreach ($action["attributes"] as $attr => $value) {
		$columnsString .= "$attr";
		$valuesString .= "\"$value\"";
		if ($counter+1 < count($action["attributes"])) {
			$columnsString .= ", ";
			$valuesString .= ", ";
		}
		$counter++;
	}
	$query = "insert into $table ($columnsString) values ($valuesString)";
	mysql_query($query);
	return Array("insertId" => mysql_insert_id());
}
function update($action) {
	$table = $action["table"];
	$id = $action["id"];
	$valuesString = "";
	$valuesArray = array();
	
	$counter = 0;
	foreach ($action["attributes"] as $attr => $value) {
		$valuesString .= "$attr=\"$value\"";
		if ($counter+1 < count($action["attributes"]))
			$valuesString .= ", ";
		$counter++;
	}
	
	$query = "update $table set $valuesString where id=$id";
	mysql_query($query);
}
function delete($action){
	$table = $action["table"];
	$id = $action["id"];
	$query = "delete from $table where id=$id";
	mysql_query($query);
}
function fetch($action) {
	$table = $action["table"];
	$id = $action["id"];
	$results = mysql_query("select * from $table where id=$id order by id asc");
	return mysql_fetch_array($results);
}
function fetchAll($action) {
	$table = $action["table"];
	$query = "select * from $table order by id asc";
	$results = mysql_query($query);
	$resultsArray = array();
	for($a=0; $row=mysql_fetch_array($results) ;$a++)
		$resultsArray[$row["id"]] = $row;
	return $resultsArray;
}

connect();
$action = json_decode(stripslashes($_POST["action"]), true);
$reply = array();

switch ($action["command"]) {
	case "add":
		$reply = add($action);
		break;
	case "update":
		$reply = update($action);
		break;
	case "delete":
		$reply = delete($action);
		break;
	case "fetch":
		$reply = fetch($action);
		break;
	case "fetchAll":
		$reply = fetchAll($action);
		break;
}

echo json_encode($reply);
disconnect();

