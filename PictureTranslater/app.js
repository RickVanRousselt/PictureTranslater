var Client = require('node-rest-client').Client;
var client = new Client();
// set content-type header and data as json in args parameter 
//ADD ARGS

client.post("https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Faces,Description", args, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
    console.log(response);
});

