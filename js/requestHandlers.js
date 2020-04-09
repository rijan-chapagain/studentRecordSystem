// var exec = require("child_process").exec;
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

/**
 * reqStart sends status report to server and display html form on client 
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function reqStart(request, response, postData){
    console.log("Request handler 'start' was called.");
   
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="#" method="POST">' +
        'Student Form: <input type="radio" name="degree" ><br>'+
        'View Details: <input type="radio" name="degree" ><br>'+
        'Upload Image: <input type="radio" name="degree" ><br>'+
        '<input type="submit" name="submit" value="Submit">'+
        '<input type="reset" name="reset" value="Reset">'+          
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead( 200, {"Content-Type": "text/plain"} );
    response.write(body);
    response.end();
}

function afterParse(params) {
    
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
    console.log("... about to parse ...");
   
    var form = new formidable.IncomingForm();
   
    form.uploadDir = './tmp'; // must include this line    
    

    form.parse(request, function(err, field, file) {
        console.log("parsing done");
        console.log('fields:', field);
        console.log('files:', file);

        // tried to rename to an already existing file
        fs.rename(file.upload.path, "./test.png",function(err){
            if (err)
            {
                fs.unlink("./test.png");
                fs.rename(file.upload.path,"./test.png");
            }

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("Received image:<br/>");
            response.write("<img src='/show' />");
            response.end();
        });
    });
}

/**
 * Stream the image data on behalf of reqUpload
 * 
 * @param {object} request
 * @param {object} response 
 * @param {object} postData 
 */
function reqShow(request, response, postData) 
{
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("./test.png").pipe(response);
}

/**
// alternative code for the show function
function reqShow(response, postData) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    // open file for a readable stream
    var readStream = fs.createReadStream("./test.png");
    // wait until we know the readable stream is valid
    readStream.on('open', function() {
    // pipe read stream to response object (goes to client)
    readStream.pipe(response);
    });
    // catches errors (if any)
    readStream.on('error', function(err) {
    readStream.end(err);
    });
}
*/

//allow access on reqStart & reqUpload to other files
exports.reqStart = reqStart;
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;