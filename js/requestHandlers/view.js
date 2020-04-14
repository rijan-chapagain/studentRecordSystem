const http = require('http');
const csv = require('csv-parser');
var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');

/**
 * sends status report to server and display html for on client side
 * ask user to enter degree to view details about it
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqView(request, response){
    console.log("Request handler 'View' was called.");

    fs.readFile('../html/view.html', function (err, view) {
        if (err) {
            throw err; 
        }       

    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(view);
    response.end();
    });
}

/**
 * It will display the csv file using fs and csv
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqDisplay(request, response){
    console.log("Request handler 'View' was called.");

    fs.createReadStream('../data/stInfo.csv')
        .pipe(csv())
        .on('data', (row) => {
        

            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify(row));
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
    });

    // response.writeHead(200, { 'content-type': 'application/json' });
    // response.end(JSON.stringify(MyData));
}

//allow access on reqStart & reqUpload to other files
exports.reqView = reqView;
exports.reqDisplay = reqDisplay;