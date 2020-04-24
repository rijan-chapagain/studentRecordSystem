var fs = require('fs');
const { parse } = require('querystring');

/**
* sends status report to server 
 * display html for on client side
 * generate a form to enter Degree
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
 * read the incoming data
 * convert buffer to string 
 * parse the string
 * call display function
 * 
 * @param {object} request            
 * @param {object} response 
 */
function reqSelectDegree(request, response){
    console.log("Request handler 'selectDegree' is processing.");
   
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
        reqDisplay(request, response, result);
    });
}

/**
 * Display the csv file using fs and csv
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} result
 */
function reqDisplay(request, response, result){
    console.log("Request handler 'display' was called."); 
    var delimiter = ',';
    var count = 0;
    var tableData;
    
    const fd = fs.openSync('../data/studentRecord.csv', 'r');
    fs.readFileSync(fd,'utf8');

    var readData = (fs.readFileSync('../data/studentRecord.csv')).toString();
    const row = readData.split('\n') ;
    var title = row[0].split(delimiter);
    var matchedData = myTableData();

    for (var i=0; i < matchedData.length; ++i)
    if (matchedData[i]) count++;
    count;

    tableData = "<!DOCTYPE html>" + 
            "<html>" + 
            "<head>" + 
            " <style>"+
            "table {font-family: arial, sans-serif; border-collapse: collapse; width: 100%;}"+
            "td, th { border: 1px solid #dddddd; text-align: left; padding: 8px;}" +
            "tr:nth-child(even) {background-color: #dddddd;}" +
            ".back{padding:15px 32px;color:white; background-color:rgb(186,121,0); border-radius:50%;font-size:16px; cursor:pointer;}"+
            "h1{text-align:center;}"+
            "</style>"+
            "<title>Students' details</title>" +
            "<head>" + 
            "<body>" +
            "<h1>Details of Students</h1>";
            tableData +=`<h2 style="color:blue;text-align:center;">Number of row count: ${count}</h2>`+
            "<table>" + 
            "<tr>";
           
            for(var titleIndex = 0; titleIndex < title.length; titleIndex++){
                tableData += `<th>${title[titleIndex]}</th>`;
            }

            tableData += "</tr>";    

            for(var rowIndex = 0; rowIndex < matchedData.length; rowIndex++){
                tableData += "<tr>";
                for (var colIndex = 0; colIndex < title.length; colIndex++){
                    tableData += `<td>${matchedData[rowIndex][colIndex]} </td>`;
                }//end of col loop
                tableData += "</tr>";
            }//end of row loop
            tableData += "</tr>" + 
            '<a href="/start"> <input type="button" class="back" name="back" value="&laquo; Back to home"></a>' +             
            "</body>" +
            "</html>";

            response.writeHead( 200, {"Content-Type": "text/html"} );
            response.write(tableData);
            response.end();

    function myTableData()
    {
        var studentTableData = [];
        var tableArray = []; 
        for(var i=1; i<row.length - 1; i++){
            var data = studentTableData[i-1] = row[i].split(delimiter);
            var dataArr = data[5].split(delimiter);
            for(var interval=0; interval<row.length; interval += 6 ){
                var intervalData = dataArr[interval];
                if(`${result.selectDegree}` === intervalData){
                    tableArray.push(data);
                }  
            }
        }
        return tableArray; 
    } 
}

//allow access on reqStart & reqUpload to other files
exports.reqView = reqView;
exports.reqSelectDegree = reqSelectDegree;
exports.reqDisplay = reqDisplay;