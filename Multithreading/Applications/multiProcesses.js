const cluster = require('cluster');
const { sleep } = require('deasync');

// This code uses 100% of the CPU
// However this is not enough, the program is not working well
// LOG:
// Writing..        // Reading...       // ECONNRESET
// Writing..        // Reading...       // Writing..
// Writing..        // Reading...       // ECONNRESET
// Writing..        // Reading...       // Writing..
// Reading...       // Writing..        // Reading...
// ECONNRESET       // ECONNRESET       // Writing..
// Reading...       // Writing..        // Reading...

if (cluster.isMaster) {
    // Fork program to processes
    const cpus = require('os').cpus().length;
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
}
else {
    const fs = require('fs');
    const axios = require('axios')

    // Used for bad programming solution, thus it's temporal
    var temp = 0;

    // Data for server
    const web = {
        host: '10.42.128.61',
        port: 3000,
        path: '/'
    };

    // writes data to given file
    // TODO: Insert file parameter. | and then to see how to program 
    //  ---  behaves (with different file names duo to the id).
    function write(data, to) {
        if (data) {
            // Dont write last file
            fs.writeFile(to, data, (err, result) => {
                if(err) console.log("Error: ", err);
            });
            // console.log("Writing..");
        } else {
            console.log("Cant write!");
        }

        // I don't like this solution, time wrapper should be more generic.
        ++temp;
        console.log(temp);
        // not getting even close to 1000 -> multiprocessing
        if (temp === 125)
        {
            var endIn = performance.now();
            console.log('Runtime: ', (endIn - startIn)/1000 + ' seconds');
            // System won't kill program, so i do
            process.exit();
        }
    }

    // Download response data from given website
    // TODO: handle the options param
    async function download2(options) {
        axios.post('http://' + options.host + ':' + options.port + options.path)
        .then(response => {
            // Editing the file -> CPU bound action
            var path = 'Songs/multi'+ cluster.worker.id + '-' + temp + '.txt';
            write(response.data.data.replaceAll('.', '.\n'), path);
            // console.log("Reading...");
        })
        .catch(error => {
            // catch all the weird error that needed to be handled
            console.log(error.code);
        })
    }

    // the original solution for time wrapping 
    // TODO: fix the count
    const timeWrapper = (callback, param) => {
        // const start = performance.now();
        callback(param)
        // const stop = performance.now();
        // console.log('Runtime: ', (stop - start)/1000 + ' seconds');
    }

    // activate the download several times
    const cpus = require('os').cpus().length;
    const getData = (from) => {
        console.log("Start downloading");
        for (let i = 0; i < (5000 / cpus); i++) {
            download2(from);
            sleep(20)
        }
        console.log("Finished downloading");
    }
    
    // Main
    try {
        // Start measuring time
        var startIn = performance.now();
        // call the desired function with it's params
        timeWrapper(getData, web)
        var endIn = performance.now();
        debugger
        console.log(' - Runtime: ', (endIn - startIn)/1000 + ' seconds');

    } catch (error) {
        console.log(error);
    }

}

console.log(require('os').cpus().length);
console.log("------------------- " + 1000 / require('os').cpus().length + " ----------------------");


// On 127.0.0.1 => Error connection refused
// On MyIP => Error connection reset ECONNRESET