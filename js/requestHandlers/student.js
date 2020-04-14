const http = require('http');
const csv = require('csv-parser');
var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');

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

// function reqImport(request, response){
//     console.log("Request handler 'import' was called.");


//     csv.
//         write([
            
//         ])

// }

exports.reqStudent = reqStudent;
