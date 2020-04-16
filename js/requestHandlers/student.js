const http = require('http');
const csv = require('csv-parser');
var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * sends status report to server and display html for on client side
 * generate a form to enter student details
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqStudent(request, response){
    console.log("Request handler 'student' was called.");

    fs.readFile('../html/student.html', function (err, student) {
        if (err) {
            throw err; 
        }       

    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(student);
    response.end();
    });
}


/**
 * Check is checking the incoming values using formidable
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqImport(request, response){
    console.log("Request handler 'import' is processing.");
   
    function collectRequestData(request, callback) {
        const FORM_URLENCODED = 'application/x-www-form-urlencoded';
        if(request.headers['content-type'] === FORM_URLENCODED) {
            
            let body = [];

            response.on('error', (err) => {
                console.error(err);
            });

            request.on('data', (chunk) => {
                body += chunk.toString(); //convert buffer to string

            });

            request.on('end', () => {
                callback(parse(body))

                // response.end('ok, You all set!');
                response.on('error', (err) => {
                    console.error(err);
                });
            });
        }
        else{
            callback(null);
            console.log('callback is null...');
        }
    }

    collectRequestData(request, result => {
        console.log(result);
        // data += result;

        // store(request, response, result);

        
    });
}

exports.reqImport = reqImport;
exports.reqStudent = reqStudent;
