<?php
function connect() {
	mysql_connect("database.db","username","password") or die ("Can't connect to SQL");
	mysql_select_db("grocer") or die("Unable to select database 'grocer'");
	mysql_query("create table if not exists items (id int primary key auto_increment, foodId int, purchasedDate bigint, organic tinyint, userId int)");
	mysql_query("create table if not exists foods (id int primary key auto_increment, points int, name text, description text)");
	mysql_query("create table if not exists misc (id int primary key auto_increment, param text, data text)");
	mysql_query("create table if not exists users (id int primary key auto_increment, facebook text, score int)");
}
function disconnect() {
	mysql_close();
}
?>