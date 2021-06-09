var User = require("../models/user.js"),
ToDo = require("../models/todo.js"),
    mongoose = require("mongoose");

// проверка, не существует ли уже пользователь
/*User.find({}, function (err, result) {
    if (err !== null) {
        console.log("Что-то идет не так");
        console.log(err);
    } else if (result.length === 0) {
        console.log("Создание тестового пользователя...");
        var exampleUser = new User({ "username": "usertest" });
        exampleUser.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Тестовый пользователь сохранен");
            }
        });
    }
});*/

var UsersController = {};
UsersController.index = function (req, res) {
    console.log("вызвано действие: индекс");
    User.find(function (err, users) {
        if (err !== null) {
          res.json(500, err);
        } else {
            res.status(200).json(users);
        }
    });
};
// Отобразить пользователя
UsersController.show = function (req, res) {
    console.log('Вызвано действие: отобразить пользователя');
	User.find({'username': req.params.username}, function(err, result) {
	if (err) {
		console.log(err);
	} else if (result.length !== 0) {
		res.sendfile('./client/list.html');
	} else {
	  res.send(404);
	}
	});
};
// Создать нового пользователя
UsersController.create = function (req, res) {
    console.log('Вызвано действие: создать пользователя');
	var username = req.body.username; 
	// console.log(username);
	User.find({"username": username}, function (err, result) {
	    if (err) {
	        console.log(err);
	        res.send(500, err);
	    } else if (result.length !== 0) {
	        res.status(501).send("Пользователь уже существует");
	        console.log(err);   
	        console.log("Пользователь уже существует"); 
	    } else {
	        var newUser = new User({
	            "username": username
	        });
	        newUser.save(function(err, result) {
	            console.log(err); 
	            if (err !== null) {
	                res.json(500, err); 
	            } else {
	                res.json(200, result);
	                console.log(result); 
	            }
	        });
	    }
	}); 
};
// Обновить существующего пользователя
UsersController.update = function (req, res) {
    console.log("Вызвано действие: обновить пользователя");
	var username = req.params.username;
	console.log("Старое имя пользователя: " + username);
	var newUsername = {$set: {username: req.body.username}};
    console.log("Новое имя пользователя: " + req.body.username);
	User.updateOne({"username": username}, newUsername, function (err,user) {
		if (err !== null) {
			res.status(500).json(err);
		} else {
			if (user.n === 1 && user.nModified === 1 && user.ok === 1) {
				console.log('Изменен');
				res.status(200).json(user);
			} else {
				res.status(404);
			}
		}
	});
};
// Удалить существующего пользователя
UsersController.destroy = function (req, res) {
    console.log("Вызвано действие: удалить пользователя");
    var id = req.params.id;
    User.deleteOne({ "_id": id }, function (err, user) {
        if (err !== null) {
            res.status(500).json(err);
        } else {
            if (user.n === 1 && user.ok === 1 && user.deletedCount === 1) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ "status": 404 });
            }
        }
    
	});
};
module.exports = UsersController;