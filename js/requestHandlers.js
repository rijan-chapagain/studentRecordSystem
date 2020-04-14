// var exec = require("child_process").exec;
const http = require('http');
// var csv = require('csv');
const csv = require('csv-parser');

var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');
// const obj = csv(); 
// gets the csv module to access the required functionality

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

            //     response.on('error', (err) => {
            //     console.error(err);
            // });
    
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
            reqStudent(request, response);
        }
        else if(`${result.two}`=== "view"){
            console.log("view is called");
            reqView(request,response);
        }
        else if(`${result.three}`=== "upload"){
            console.log("upload is called");
            reqUpload(request, response);
        }
        else{
            // alert("Nothing has been selected!!");
            console.log("Nothing has been selected!!");
            reqStart(request,response);
        }
    });
}

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
 * It will display the requested details of degree
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


/**
 * reqUpload sends a status report as a response to the client and server
 * formidable is use to parse form data (file uploads)
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function reqUpload(request, response) {
    console.log("Request handler 'upload' was called.");
    
    var form = new formidable.IncomingForm();
   
    fs.readFile('../html/upload.html', function (err, html) {
        if (err) {
            throw err; 
        }       

    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(html);
    response.end();
    });

    form.uploadDir = '../tmp'; // must include this line    

    form.parse(request, function(err, fields, files) {
        console.log("parsing done");
        console.log('fields:', fields);
        console.log('files:', files);

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

/**
 * Stream the image data on behalf of reqUpload
 * 
 * @param {object} request
 * @param {object} response 
 * @param {object} postData 
 */
function reqShow(request, response) 
{
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("../img/fun.png").pipe(response);
}

//allow access on reqStart & reqUpload to other files
exports.reqStart = reqStart;
exports.reqCheck = reqCheck;

exports.reqStudent = reqStudent;
 
exports.reqView = reqView;
exports.reqDisplay = reqDisplay;

exports.reqUpload = reqUpload;
exports.reqShow = reqShow;