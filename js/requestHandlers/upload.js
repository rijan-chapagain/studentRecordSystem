const http = require('http');
const csv = require('csv-parser');
var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');

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
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;