var http = require("http"); // import http core modules
var url = require("url"); // import url core modules

/**
 * starts the server 
 * 
 * @param {Function} route 
 * @param {object} handle 
 */
function startServer(route, handle, request)
{
      /**
       * use url module to get pathname of requested resource 
       * send status report to server
       * set encodign to utf8
       * accumulating incoming data using action listener
       * 
       * @param {obj} request 
       * @param {obj} response 
       */
      function onRequest(request, response) 
      {
            var pathname = url.parse(request.url).pathname;

            console.log(`${request.method} request for ${pathname}  received.`);
            
            route(pathname, handle, request, response);
      }
      http.createServer(onRequest).listen(40310,'localhost');
            console.log("Server has started.");
}
//allow access to other files
exports.startServer = startServer;

