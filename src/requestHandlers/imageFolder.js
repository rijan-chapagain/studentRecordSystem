const fs = require('fs');

/**
 * reqStart sends status report to server and display html form on client 
 * generate form with 3 options to choose where to go
 * it will send client to requested page
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqImages(request, response){
    console.log("Request handler 'images' was called.");

    fs.readdir('../img', function (err, data) {
        if (err) {
            throw err; 
        }               
        response.writeHead( 200, {"Content-Type": "image/png"} );
        response.write(data);
        response.end();
    });
}

exports.reqImages = reqImages;




// setInterval({
//     console.log("2 seconds passed.");
//   }, 2000);