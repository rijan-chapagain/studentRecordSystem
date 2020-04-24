var formidable = require('formidable');
var fs = require('fs');
var pathName;
var fName;

/**
* sends status report to server 
 * display html for on client side
 * generate a form to upload image
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

        fName = file.upload.name;
        pathName = `../tmp/${fName}`;

        fs.rename(file.upload.path, pathName, (err) => {
            if (err) throw err;
            // dispImage(request, response, fName);
            console.log("before response");
            var body = "<!DOCTYPE html>" + 
                "<html>" + 
                "<head>" + 
                "<style>" + 
                ".back{padding:15px 32px;color:white; background-color:rgb(186,121,0); border-radius:50%;font-size:16px; cursor:pointer;}"+
                "h1{text-align:center;}"+
                "</style>" + 
                "</head>" + 
                "<h1>Your seledted image is: </h1>" +
                "<h3> &#9989; Congrats, your image successfully uploaded.</h3>"+

                '<a href="/start"> <input type="button" class="back" name="back" value="&laquo; Back to home"></a>' +       
                `<h2>Opening up -${fName}- image.</h2>`+
                // `<img src="/home/rijan/Desktop/ICT375/Assignments/as1/studentRecordSystem/tmp/test.png" />` +
                // `<img src="../tmp/test.png" />` +
                // `<img src="/requestHandlers/test.png" />` +
                
                "</body>" +
                "</html>";
                
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(body);
            response.write("<h1>Testetes</h1>");


            response.end();
            console.log("after response");

        });
    });
}

/**
 * Stream the image data on behalf of reqUpload
 * 
 * @param {object} request
 * @param {object} response 
 * @param {object} imagePath 
 */
function dispImage(request, response, imagePath) 
{
    console.log(imagePath);
    console.log("Request handler 'dispImage' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream(`../tmp/${imagePath}`).pipe(response);
}

//allow access on reqStart & reqUpload to other files
exports.reqUpload = reqUpload;
exports.reqShow = reqShow;
exports.dispImage = dispImage;