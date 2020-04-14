const http = require('http');
const csv = require('csv-parser');
var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');
var student = require('./student');
var upload = require('./upload');
var view = require('./view');

/**
 * reqStart sends status report to server and display html form on client 
 * generate form with 3 options to choose where to go
 * it will send client to requested page
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqStart(request, response){
    console.log("Request handler 'start' was called.");

    fs.readFile('../html/start.html', function (err, html) {
        if (err) {
            throw err; 
        }               
        response.writeHead( 200, {"Content-Type": "text/html"} );
        response.write(html);
        response.end();
    });
}

/**
 * Check is checking the incoming values using formidable
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqCheck(request, response){
    console.log("Request handler 'check' is processing.");
   
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

            // response.writeHead(200.(content-type text/html))

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
        }
    }

    collectRequestData(request, result => {
        console.log(result);
        // response.end(`Parsed data belonging to ${result.three}`);
        
        if(`${result.one}`=== "student"){
            console.log("student is called");
            student.reqStudent(request, response);
        }
        else if(`${result.two}`=== "view"){
            console.log("view is called");
            view.reqView(request,response);
        }
        else if(`${result.three}`=== "upload"){
            console.log("upload is called");
            upload.reqUpload(request, response);
        }
        else{
            // alert("Nothing has been selected!!");
            console.log("Nothing has been selected!!");
            this.reqStart(request,response);
        }
    });
}

exports.reqStart = reqStart;
exports.reqCheck = reqCheck;