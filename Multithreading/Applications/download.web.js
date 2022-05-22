const cluster = require('cluster')
const bodyParser = require('body-parser');
const fs = require('fs');

if (cluster.isMaster) {
    const cpus = require('os').cpus().length;
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
}
else {
    var urlencodedParser = bodyParser.urlencoded({ extended: false })
    var num = 0;
    const express = require('express')
    const app = express()
    app.listen(3000)
    
    app.use(express.static('Public'))
    
    app.use((req, res, next) => {
        console.log("New entry, " + ++num);
        next();
    })
    
    app.get('/', (req, res) => {
        res.sendFile('./Public/Song.txt', {root: __dirname});
    })

    app.post('/', urlencodedParser, (req, res) => {
        res.json({
            data: fs.readFileSync('./Public/Song.txt').toString()
        })
    })
    
    app.use((req, res) => {
        res.status(404).send("Only '/' is available.");
    })
}
