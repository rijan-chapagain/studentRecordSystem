const http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var start = require('./start');
var pathName;
var fName;

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
       
    fs.readFile('./html/upload.html', function (err, html) {
        if (err) {
            throw err; 
        }       

    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(html);
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

    var form = new formidable.IncomingForm();
    form.uploadDir = '../tmp';

    
    form.parse(request, function(err, field, file) {
        console.log("parsing done");
        console.log('fields:', field);
        console.log('files:', file);

        // var receivedImg = form.upload.path;
        // console.log(receivedImg);
        
        fName = file.upload.name;
        pathName = `../tmp/${fName}`;
        console.log(fName);
        console.log(pathName);

        fs.rename(file.upload.path, pathName, (err) => {
            if (err) throw err;
            // fs.stat('/tmp/hello', (err, stats) => {
            //   if (err) throw err;
            //   console.log(`stats: ${JSON.stringify(stats)}`);
            // });
          });
    console.log(pathName);

        var disImage = "<!DOCTYPE html>" + 
            "<html>" + 
            "<head>" + 
            " <style>"+
            "table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}"+
            "td, th { border: 1px solid #dddddd; text-align: left; padding: 8px;}" +
            "tr:nth-child(even) {background-color: #dddddd;}" +
            "</style>"+
            "</head>" + 
            "<body" +
            "<h2>Your selected image:</h2>" +
            `<img src= "/show" alt="your fav Image" height="42" width="42">` +
            "</body" +
            "</html>" + 

        fs.readFile(`../tmp/${fName}`, function (err, data) {
            if (err) {
                throw err; 
            }       
            // response.writeHead(200, {"Content-Type": "text/html"});
            // response.write(disImage);
        
            response.writeHead(200, {"Content-Type": "image/png"}); 
            response.write(data);
                        response.end();

            timeOut(request, response);

                     
        });
    });
}



//allow access on reqStart & reqUpload to other files
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;