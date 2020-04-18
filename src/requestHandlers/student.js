const http = require('http');
var fs = require('fs');
const { parse } = require('querystring');
var start = require('./start');

/**
 * sends status report to server and display html for on client side
 * generate a form to enter student details
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqStudent(request, response){
    console.log("Request handler 'student' was called.");

    fs.readFile('./html/student.html', function (err, student) {
        if (err) {
            throw err; 
        }       

    response.writeHead( 200, {"Content-Type": "text/html"} );
    response.write(student);
    response.end();
    });
}

/**
 * Check is checking the incoming values using formidable
 * 
 * @param {object} request 
 * @param {object} response 
 */
function reqImport(request, response){
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

function store(request, response, result){
     
        var studentCSVHeader ="StudentID,FirstName,LastName,Age,Gender,Degree\n"; 
        var studentCSVData = `${result.stID},${result.fName},${result.lName},${result.age},${result.gender},${result.selectDegree}\n`;

        let fd;

        fd = fs.openSync('../data/studentRecord.csv', 'r');
        fs.readFileSync(fd,'utf8');

        var data = fs.readFileSync('../data/studentRecord.csv');
            console.log(data);
           
            var readData = data.toString();
            console.log(readData);

            if(readData === ""){
                console.log('file is null');
                fs.appendFileSync("../data/studentRecord.csv", studentCSVHeader)
                console.log('Header is successfully added');

            } else{
                console.log('is not empty');
            }

        fd = fs.openSync("../data/studentRecord.csv", 'a');
        fs.appendFileSync(fd, studentCSVData,'utf8');
        console.log('data successfully append');
        start.reqStart;
}

exports.reqImport = reqImport;
exports.reqStudent = reqStudent;
