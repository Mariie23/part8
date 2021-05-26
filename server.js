var express = require("express"),
	http = require("http"),
	mongoose = require("mongoose"),
	app = express();
	
app.use(express.static(__dirname + "/client"));
app.use(express.urlencoded());
// подключаемся к хранилищу данных Amazeriffic в Mongo
mongoose.connect('mongodb://localhost/amazeriffic');
