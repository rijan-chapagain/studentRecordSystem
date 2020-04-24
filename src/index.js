// import our exported modules
var server = require("./server");
var router = require("./router");
var start = require("./requestHandlers/start");
var student = require("./requestHandlers/student");
var view = require("./requestHandlers/view");
var upload = require("./requestHandlers/upload");
var imageFolder = require("./requestHandlers/imageFolder");

// create ‘handle’ object literal
var handle = {};
// using the associative array notation, each array index is an
// object property which points to an appropriate request handler

handle["/css"] = start.reqCss;
handle["/"] = start.reqStart;
handle["/start"] = start.reqStart;
handle["/check"] = start.reqCheck;

handle["/student"] = student.reqStudent;
handle["/import"] = student.reqImport;

handle["/view"] = view.reqView;
handle["/selectDegree"] = view.reqSelectDegree;
handle["/display"] = view.reqDisplay;

handle["/upload"] = upload.reqUpload;
handle["/show"] = upload.reqShow;
handle["/dispImage"] = upload.dispImage;

handle["/images"] = imageFolder.reqImages;

// ***JSON format***
// handle = {
//     "/" : requestHandlers.reqStart,
//     "/start" : requestHandlers.reqStart,
//     "/upload" : requestHandlers.reqUpload,
//     ""
// };

server.startServer(router.route, handle)