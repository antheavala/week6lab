let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let db;
let viewsPath = __dirname +"/views";

let mongoose = require('mongoose');

let Task = require('./models/tasks');
let Developer = require('./models/developers');

let url = 'mongodb://localhost:27017/taskDB';

mongoose.connect(url, {useNewUrlParser: true}, function (err) {
    if (err) {
        console.log('Error', err);
    } 
    else {
        console.log("Connected successfully to server");
    }
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('images'));
app.use(express.static('css'));

//GET REQUESTS

app.get('/', function(req, res){
    res.sendFile(viewsPath + '/home.html');
});

app.get('/addNewTask', function(req, res){
    res.sendFile(viewsPath + '/addTask.html')
});

app.get('/addNewDev', function(req, res){
    res.sendFile(viewsPath + '/addDev.html')
});

app.get('/deleteTask', function(req, res){
    res.sendFile(viewsPath + '/deleteTask.html')
});

app.get('/updateTask', function(req, res){
    res.sendFile(viewsPath + '/updateTask.html')
});

app.get('/deleteCompleted', function(req, res){
    Task.deleteMany({'status' : 'Complete'}, function(err, doc){
        res.redirect('/listAllTasks');        
    });
});

app.get('/listAllTasks', function(req,res){
    Task.find().populate('assign').exec(function(err,docs){
        console.log(docs);
        res.render('listTasks.html', {data: docs});
    });
    // Task.find({}, function (err,docs){
    //     console.log(docs);
    //     res.render('listTasks.html', {data: docs});
    // });
});

app.get('/listAllDevs', function(req,res){
    Developer.find({}, function (err,docs){
        console.log(docs);
        res.render('listDevs.html', {data: docs});
    });
});

//POST REQUESTS

app.post('/taskAdded', function(req,res){
    let newTask = new Task({
        name: req.body.taskName, 
        assign: new mongoose.Types.ObjectId(req.body.taskAssign),
        due: new Date (req.body.taskDue),
        status: req.body.taskStatus,
        desc: req.body.taskDesc
    });

    newTask.save(function (err){
        if (err) throw err;
        console.log('Added task to DB');
    });

    res.redirect('/listAllTasks');
});

app.post('/devAdded', function(req, res){
    let newDev = new Developer({
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.devLevel,
        address: {
            unit: req.body.addrUnit,
            street: req.body.addrStreet,
            suburb: req.body.addrSuburb,
            state: req.body.addrState
        }
    });

    newDev.save(function (err){
        if (err) throw err;
        console.log('Added dev to DB');
    });
    
    res.redirect('/listAllDevs');
});

app.post('/taskDeleted', function(req,res){
    Task.deleteOne({'_id': new mongoose.Types.ObjectId(req.body.taskID)}, function(err, doc){
        res.redirect('/listAllTasks');
});
    })

app.post('/updatedTask', function (req,res) {
    Task.updateOne({"_id" : new mongoose.Types.ObjectId(req.body.taskID)}, {$set: {'status' : req.body.taskStatus}}, function(err,doc){
        res.redirect('/listAllTasks');
    });
});


app.listen(8080);