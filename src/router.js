/**
 * Route function check the types of pathname and response based on that.
 * 
 * @param {Function} pathname 
 * @param {object} handle 
 * @param {object} request 
 * @param {object} response 
 */
function route(pathname, handle, request, response){
    //check if the pathname is function or not.
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response); // call the appropriate function && pass response argument
    } 
    else {
        console.log("No handler found for: " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("<h3>Sorry, Resource not found! please check your URL and try again.</h3> <br> Cheers!!");
        response.end();
    }
}
//allow access to other files
exports.route = route;
