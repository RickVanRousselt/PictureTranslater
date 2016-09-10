﻿var Client = require('node-rest-client').Client;
var client = new Client();

var azure = require('azure-storage');

var queueSvc = azure.createQueueService('twitstream', process.env.azure_key);

var tableSvc = azure.createTableService('twitstream', process.env.azure_key);


function main() {
	queueSvc.getMessages('processedstreamids',
        function (error, result, response) {
		if (!error) {
			var message = result[0];
			if (message != null) {
				var queryArray = message.messageText.split('|');
				var imageUrl = queryArray[1].replace("_normal", "");
				var messageArray = queryArray[0].split(";");
				
				tableSvc.retrieveEntity('incomingstreamcontents', messageArray[0], messageArray[1], function (error, result, response) {
					if (!error) {
						// set content-type header and data as json in args parameter  
						var args = {
							data: { "url": imageUrl },
							headers: { "Content-Type": "application/json", "Host": "api.projectoxford.ai", "Ocp-Apim-Subscription-Key": "839724ebe25a446481a63fd1f0674f4c" },
						};
						
						client.post("https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description", args, function (data, response) {
							
							console.log(data);
							var entGen = azure.TableUtilities.entityGenerator;
							var task = {
								PartitionKey: entGen.String(messageArray[0]),
								RowKey: entGen.String(messageArray[1]),
								profileImageDescription: entGen.String(data.description.captions[0].text),
								profileImageConfidence: entGen.String(data.description.captions[0].confidence)
							}
							tableSvc.insertOrMergeEntity('incomingstreamcontents', task, function (error, result, response) {
								if (!error) {
									queueSvc.deleteMessage('processedstreamids', message.messageId, message.popReceipt, function (error, response) {
										if (!error) {
											setTimeout(main(), 3000);
										}
									});
								} else {
									console.log(error);								
									setTimeout(main(), 3000);								
								}

							});						
						});
					}
				});
			}
		}
	});
};
function starter() {
	main();
    //while (true) {
    //    setTimeout(main, 10000);
    //}
};

starter();




