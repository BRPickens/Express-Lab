var express = require ('express');
var bp = require ('body-parser')
var app = express ();
let path = require('path');
let bodyParser = require('body-parser');
let fs = require('fs');
const base = '/api/chirps'
let pathVar = path.join(__dirname, 'data.json')
const randID = function(req, res, next) {
    return shortid_1.generate();
    next();
}

app
.disable('x-powered-by')
.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, UPDATE, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.route(base)
    .get(function(req,res) {
        res.sendFile(pathVar)
    }
);
app.get(base + '/:id', function(req,res) {
    fs.readFile(pathVar, 'utf-8', function (err, f) {
        var fp = JSON.parse(f);
        var found = fp.filter(function (chirp) { return chirp.id === req.params.id });
        if (found.length !== 1) {
            res.status(404).end();
            return;
        }
        var chirp = JSON.stringify(found[0]);
        res.send(chirp).end();
    })
});
app.post(base, function (req, res) {
    fs.readFile(pathVar, 'utf-8', function(err, f) {
        var fp = JSON.parse(f);
        var c = req.body;
        var id = randID();
        c.id = id;
        fp.push(c);
        fs.writeFile(pathVar, JSON.stringify(fp), function (err) {
            if (err)
                throw err;
            res.status(201).send(id).end();
        });
    });
});
app.delete(base + "/:id", function (req, res) {
    fs.readFile(pathVar, 'utf-8', function (err, f) {
        var fp = JSON.parse(f);
        var foundIndex = -1;
        fp.map(function (chirp, i) {
            if (chirp.id === req.params.id) {
                foundIndex = i;
            }
        });
        if (foundIndex === -1) {
            res.status(404).end();
            return;
        }
        fp.splice(foundIndex, 1);
        fs.writeFile(dataPath, JSON.stringify(fp), 'utf-8', function (err) {
            if (err)
                throw err;
            console.error(err);
            res.status(202).end();
        });
    });
});



app.listen(3000, function () {
    console.log('Server listening on port 3000!')
});