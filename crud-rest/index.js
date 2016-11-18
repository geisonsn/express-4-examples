var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

app.use(bodyParser.json());
app.use(methodOverride());

var users = [
    {id: 2, name: 'Hurin', age: 330},
    {id: 1, name: 'Moemor', age: 200},
    {id: 3, name: 'Nienor', age: 31}
];

var getLastId = () => users.length ? users[users.length-1].id : 0;
var nextId = () => getLastId() + 1;
var getUser = id => users.find(user => user.id == id); 
var sortedUsers = () => users.length > 0 ? users.sort((a,b) => a.id > b.id ? 1 : -1) : undefined;

var addUser = user => {
    var id = nextId();
    user.id = id;
    users.push(user);
    return user;
};

var updateUser = user => {
    var u = getUser(user.id);
    if (u) {
        users = users.filter(us => us.id != u.id);
        users.push(user);
        return user;
    }
    return undefined; 
};

var removeUser = id => {
    var user = getUser(id);
    if (user)
        users = users.filter(u => u.id != id);
    return user;
};

var getMessage = msg => {return {message: msg}};

app
    .route('/user')
    .get((req, res) => {
        var users = sortedUsers();
        if (users) 
            res.status(200).json(users);
        else res.status(204).end();
    })
    .post((req,res) => {
        var user = addUser(req.body);
        res.status(201).json(user);
    })
    .put((req, res) => {
        var user = updateUser(req.body);
        if (user) 
            res.status(200).json(user);
        else 
            res.status(404).json(getMessage('User not found'));
    });

app
    .route('/user/:id')
    .get((req, res) => {
        var user = getUser(req.params.id);
        if (user) 
            res.status(200).json(user);
        else 
            res.status(404).send(getMessage('User not found'));
    })
    .delete((req, res) => {
        var user = removeUser(req.params.id);
        if (user) { 
            res.status(200).end();
        }
        else 
            res.status(404).send(getMessage('User not found'));
    })
    .put((req, res) => {
        var id = req.params.id;
        var user = req.body;
        user.id = id;
        user = updateUser(req.body);
        if (user) 
            res.status(200).json(user);
        else 
            res.status(404).json(getMessage('User not found'));
    });

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
