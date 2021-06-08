var express = require("express"),
	http = require("http"),
	mongoose = require("mongoose"),
	usersController = require("./controllers/users_controller"),
    toDosController = require("./controllers/todos_controller"),
	ToDo = require("./models/todo"),
	app = express();
	mongoose.connect('mongodb://localhost/amazeriffic'); 
	http.createServer(app).listen(3000);/*,
	toDos = [
		// настраиваем список задач копированием
		// содержимого из файла todos.OLD.json
	];*/
	// импортируем библиотеку mongoose
app.use(express.static(__dirname + "/client"));
// Это модель Mongoose для задач
app.get("/todos.json", function (req, res) {
	ToDo.find({}, function (err, toDos) {
        if (err !== null) {
            // объект не был передан
            console.log(err);
            res.json({ "message": "объект не был передан!" });
        } else { res.json(toDos); }
    });
});
// Этот маршрут замещает наш файл
// todos.json в примере из части 5

// командуем Express принять поступающие
// объекты JSON
app.use(express.urlencoded());
// подключаемся к хранилищу данных Amazeriffic в Mongo
app.post("/todos", function (req, res) {
	console.log(req.body);
	var newToDo = new ToDo({"description":req.body.description,
		"tags":req.body.tags});
	newToDo.save(function (err, result) {
		if (err !== null) {
			console.log(err);
			res.send("ERROR");
		} else {
			// клиент ожидает, что будут возвращены все задачи,
			// поэтому для сохранения совместимости сделаем дополнительный запрос
			ToDo.find({}, function (err, result) {
				if (err !== null) {
					// элемент не был сохранен
					res.send("ERROR");
				}
				res.json(result);
			});
		}
	});
});
app.use('/', express.static((__dirname + "/Client")));
app.use('/user/:username', express.static(__dirname + '/client'));

app.get("/users.json", usersController.index);
app.post("/users", usersController.create);
app.get("/users/:username", usersController.show);
app.put("/users/:username", usersController.update);
app.delete("/users/:username", usersController.destroy);

app.get("/user/:username/todos.json", toDosController.index);
app.post("/user/:username/todos", toDosController.create);
app.put("/user/:username/todos/:id", toDosController.update);
app.delete("/user/:username/todos/:id", toDosController.destroy);