const fs = require('fs');
const http = require('http')
const axios = require('axios');

// npm config set proxy null

var temp = 0;

const web = {
    host: 'localhost',
    port: 3000,
    path: '/'
  };
  
function write(data) {
    fs.writeFileSync('Songs/single.txt', data);
    console.log("Writing..");
    // I don't like this soulution, time wrapper should be more generic.
    ++temp;
    if (temp === 1000)
    {
        var endIn = performance.now();
        console.log('Runtime: ', (endIn - startIn)/1000 + ' seconds');
    }
}

async function download2(options) {
    await axios.get('http://10.42.128.61:3000/')
    .then(response => {
        console.log("Reading...");
        write(response.data.replaceAll('.', '.\n'));
    })
    .catch(error => {
        console.log(error.code);
    })
}

// Don't work well, often colapse
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
    for (let i = 0; i < 1000; i++) {
        download2(from);  // wait for this to finish
    }
    console.log("Finished downloading");
}

// Main
try {
    var startIn = performance.now();
    timeWrapper(getData, web)

} catch (error) {
    console.log(error);
}
