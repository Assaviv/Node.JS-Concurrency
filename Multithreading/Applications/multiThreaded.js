const cluster = require('cluster')

if (cluster.isMaster) {
    const cpus = require('os').cpus().length;
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
}
else {
    const fs = require('fs');
    const axios = require('axios')

    var temp = 0;

    const web = {
        host: 'localhost',
        port: 3000,
        path: '/'
    };

    function write(data) {
        if (data) {
            fs.writeFile('Songs/single.txt', data, (err, result) => {
                if(err) console.log("Error: ", err);
            });
            console.log("Writing..");
        } else {
            console.log("Cant write!");
        }

        // I don't like this soulution, time wrapper should be more generic.
        ++temp;
        if (temp === 1000)
        {
            var endIn = performance.now();
            console.log('Runtime: ', (endIn - startIn)/1000 + ' seconds');
        }
    }

    async function download2(options) {
        axios.get('http://10.42.128.61:3000/')
        .then(response => {
            write(response.data.replaceAll('.', '.\n'));
            console.log("Reading...");
        })
        .catch(error => {
            console.log(error.code);
        })
    }

    const timeWrapper = (callback, param) => {
        // const start = performance.now();
        callback(param)
        // const stop = performance.now();
        // console.log('Runtime: ', (stop - start)/1000 + ' seconds');
    }

    const getData = (from) => {
        console.log("Start downloading");
        for (let i = 0; i < 300; i++) {
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

}