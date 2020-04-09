/**
 * Route function check the types of pathname and response based on that.
 * 
 * @param {Function} pathname 
 * @param {object} handle 
 * @param {object} request 
 * @param {object} response 
 * @param {object} postData 
 */
function route(pathname, handle, request, response, postData){
    //check if the pathname is function or not.
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response, postData); // call the appropriate function && pass response argument
    } 
    else {
        console.log("No handler found for: " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("Resource not found!");
        response.end();
    }
}
//allow access to other files
exports.route = route;
