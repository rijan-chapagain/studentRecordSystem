var fs = require('fs');

/**
 * send status report to server
 * display html form on client 
 * generate form with 3 options to choose where to go
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqCss(request, response){
    // console.log("Request handler 'css' was called.");

    fs.readFile('css/styles.css', function (err, style) {
        if (err) {
            throw err; 
        }   
        response.writeHead( 200, {"Content-Type": "text/css"} );
        response.write(style);
        response.end();
    });
}

exports.reqCss = reqCss;