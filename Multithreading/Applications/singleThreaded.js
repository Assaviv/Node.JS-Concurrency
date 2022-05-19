const fs = require('fs');
const http = require('http')
const axios = require('axios');
const { sleep } = require('deasync');

// npm config set proxy null

var temp = 0;
var errors = 0;

const web = {
    host: 'localhost',
    port: 3000,
    path: '/'
  };
  
function write(data, to) {
    fs.writeFileSync(to, data);
    // console.log("Writing..");
    // I don't like this solution, time wrapper should be more generic.
    ++temp;
    // console.log(temp);
    process.stdout.write('.');
    if (temp === 1000)
    {
        var endIn = performance.now();
        console.log('Runtime: ', (endIn - startIn)/1000 + ' seconds with ERRORS: ' + errors);
    }
}

async function download2(options) {
    await axios.get('http://10.42.128.61:3000/')
    .then(response => {
        // console.log("Reading...");
        const path = 'Songs/single' + temp + '.txt';
        write(response.data.replaceAll('.', '.\n'), path);
    })
    .catch(error => {
        console.log("ERROR: " + error.code);
        ++temp;
        ++errors;
    })
}

// Don't work well, often collapse
function download(options)
{
    var data = '';
    callback = (response) => {
        response.on('data', function (chunk) {
            data += chunk;   
        });
      
        response.on('end', function () {
            write(data)
            console.log("end");
        });
    }
      
    var req = http.request(options, callback).end();
}

const timeWrapper = (callback, param) => {
    const start = performance.now();
    callback(param)
    const stop = performance.now();
    console.log('Runtime: ', (stop - start)/1000 + ' seconds');
}

const getData = (from) => {
    console.log("Start downloading");
    for (let i = 0; i < 5000; i++) {
        download2(from);  // wait for this to finish
        sleep(20)  // Sometimes work with sleep sometimes dont
    }
    console.log("Finished downloading");
}

// Main
try {
    var startIn = performance.now();
    timeWrapper(getData, web)
} catch (error) {
    console.log("ERROR: " + error);
}
