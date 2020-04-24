var fs = require('fs');
const { parse } = require('querystring');
var start = require('./start');

/**
 * sends status report to server 
 * display html for on client side
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
 * checking the incoming data using formidable
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
        }
    }

    collectRequestData(request, result => {
        storeToCsv(request, response, result);
    });
}

/**
 * If the file exist doesnot exist, will create one
 * If the file is null then write header
 * Then store the form data to the file
 * 
 * @param {object} request 
 * @param {object} response 
 * @param {object} result 
 */
function storeToCsv(request, response, result){
     
    var studentCSVHeader ="StudentID,FirstName,LastName,Age,Gender,Degree\n"; 
    var studentCSVData = `${result.stID},${result.fName},${result.lName},${result.age},${result.gender},${result.selectDegree}\n`;
    let fd;

    fd = fs.openSync('../data/studentRecord.csv', 'a+');
    var data = fs.readFileSync(fd,'utf8');
    var readData = data.toString();

        if(readData === ""){
            fs.appendFileSync("../data/studentRecord.csv", studentCSVHeader)
        } 
    fs.appendFileSync(fd, studentCSVData,'utf8');
    console.log('data successfully appended to csv file');
    start.reqStart(request, response);
}

exports.reqImport = reqImport;
exports.reqStudent = reqStudent;
