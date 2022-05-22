const { workerData, parentPort } = require('worker_threads')
const fs = require('fs');
const axios = require('axios');
const { sleep } = require('deasync');

var temp = 0;

function write(data, to) {
    if (data) {
        fs.writeFile(to, data, (err, result) => {
            if(err) console.log("Error: ", err);
        });
    } else {
        console.log("Cant write!");
    }    
    ++temp;
    process.stdout.write('.');
}

async function download2(options, id) {
    axios.post('http://' + options.host + ':' + options.port + options.path)
    .then(response => {
        var path = 'Songs/multi'+ id + '-' + temp + '.txt';
        write(response.data.data.replaceAll('.', '.\n'), path);
    })
    .catch(error => {
        console.log("ERROR: " + error.code);
        ++temp;
    })
}

const web = {
    host: 'localhost',
    port: 3000,
    path: '/'
  };
  

const getData = (from, workerData) => {
    for (let i = 0; i < workerData[0]; i++) {
        download2(from, workerData[1]);  // wait for this to finish
        sleep(20)  // Sometimes work with sleep sometimes dont
    }
}

// Main
try {
    console.log(workerData[1]);
    getData(web, workerData)
    parentPort.postMessage({Working: workerData[1]})
} catch (error) {
    console.log("ERROR: " + error);
}