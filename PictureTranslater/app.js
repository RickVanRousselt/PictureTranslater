var Client = require('node-rest-client').Client;
var client = new Client();
// set content-type header and data as json in args parameter 
var args = {
    data: { "url": "https://projectoxfordportal.azureedge.net/vision/Analysis/1-1.jpg" },
    headers: { "Content-Type": "application/json", "Host": "api.projectoxford.ai","Ocp-Apim-Subscription-Key": "839724ebe25a446481a63fd1f0674f4c"},
};

client.post("https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Faces,Description", args, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    // raw response 
    console.log(response);
});

