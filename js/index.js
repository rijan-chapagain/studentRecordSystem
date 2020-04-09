// import our exported modules
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

// create ‘handle’ object literal
var handle = {};
// using the associative array notation, each array index is an
// object property which points to an appropriate request handler
handle["/"] = requestHandlers.reqStart;
handle["/start"] = requestHandlers.reqStart;
handle["/upload"] = requestHandlers.reqUpload;
handle["/show"] = requestHandlers.reqShow;


//***JSON format***
// handle = {
//     "/" : requestHandlers.reqStart,
//     "/start" : requestHandlers.reqStart,
//     "/upload" : requestHandlers.reqUpload,
//};

// call the startServer() function associated with the server object
// pass the route() function associated with the router object as its parameter
// pass handle object to server
server.startServer(router.route, handle)

