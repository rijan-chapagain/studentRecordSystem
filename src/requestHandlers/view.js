const http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const { parse } = require('querystring');
var start = require('./start');

/**
 * sends status report to server and display html for on client side
 * ask user to enter degree to view details about it
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqView(request, response){
    console.log("Request handler 'View' was called.");

    fs.readFile('./html/view.html', function (err, view) {
        if (err) {
            throw err; 
        }       

    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(view);
    response.end();
    });
}


/**
 * Check is checking the incoming values using formidable
 * 
 * @param {object} request 
 * @param {object} response 
 */
function req(request, response){
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
                callback(parse(body));
              
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
        store(request, response, result);
    });
}

/**
 * It will display the csv file using fs and csv
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqDisplay(request, response){
    console.log("Request handler 'display' was called."); 
    
    const fd = fs.openSync('../data/studentRecord.csv', 'r');
    fs.readFileSync(fd,'utf8');

    var read = fs.readFileSync('../data/studentRecord.csv');
    var readData = read.toString();

    var str = readData;
    var delimiter = ',';
    const row = str.split('\n') ;
    var title = row[0].split(delimiter);
    var studentTableData = [];

    for(var i=1; i<row.length - 1; i++){
        var data = studentTableData[i-1] = row[i].split(delimiter);
        // console.log(data);
        var dataArr = data[5].split(delimiter);
    }
    console.log("here is data Array outside for: ");
    console.log(dataArr);

    var count = 0;
    require('fs').createReadStream("../data/studentRecord.csv")
      .on('data', function(chunk) {
        for (var i=0; i < chunk.length; ++i)
          if (chunk[i] == 10) count++;
      })
      .on('end', function() {
        var rowsNumber = count;
   
    var table = "<!DOCTYPE html>" + 
                "<html>" + 
                "<head>" + 
               " <style>"+
               "table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}"+
               "td, th { border: 1px solid #dddddd; text-align: left; padding: 8px;}" +
                "tr:nth-child(even) {background-color: #dddddd;}" +
                "</style>"+
                "<title>Students' details</title>" +
                "<head>" + 
                "<body>" +
                "<h2>Details About Student </h2>";

                table +=`<h3>Number of rows are: ${rowsNumber}</h3>`+
                "<table>" + 
                "<tr>";
               
                for(var titleIndex = 0; titleIndex < title.length; titleIndex++){
                    table += `<th>${title[titleIndex]}</th>`;
                }

                table += "</tr>";    

                for(var rowIndex = 0; rowIndex < studentTableData.length; rowIndex++){
                    table += "<tr>";
                        
                    for (var colIndex = 0; colIndex < title.length; colIndex++){
                        table += `<td>${studentTableData[rowIndex][colIndex]} </td>`;
                    }//end of col loop
                    table += "</tr>";
                }//end of row loop

                table += "</tr>" + 
                '<a href="/start"> <input type="button" class="back" name="back" value="Back to home"> </a>' +             
                "</body>" +
                "</html>"
         
    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(table);
    // timeOut(request, response);
    response.end();

    function timeOut(request, response){
        setTimeout(function (){
            start.reqStart(request, response);
        }, 3000);
    }  
});
}

//allow access on reqStart & reqUpload to other files
exports.reqView = reqView;
exports.reqDisplay = reqDisplay;