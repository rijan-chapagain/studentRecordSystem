const http = require('http');
var formidable = require('formidable');
var fs = require('fs');

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
        
        var fName = file.upload.name;
        var pathName = `../tmp/${fName}`;
        console.log(fName);

        fs.rename(file.upload.path, pathName, (err) => {
            if (err) throw err;
            // fs.stat('/tmp/hello', (err, stats) => {
            //   if (err) throw err;
            //   console.log(`stats: ${JSON.stringify(stats)}`);
            // });
          });
    
        response.writeHead(200, {"Content-Type": "text/html"});    
        response.write("Received image:<br/>");
        // response.end(`<img src= ${pathname} />`);

    // response.writeHead(200, {"Content-Type": "image/jpg"});
    // fs.createReadStream(`../tmp/pkr1.jpg`).pipe(response);
    response.end();
    });
}

//allow access on reqStart & reqUpload to other files
exports.reqUpload = reqUpload;
// exports.reqStore = reqStore;
exports.reqShow = reqShow;