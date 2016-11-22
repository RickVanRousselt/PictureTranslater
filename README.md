# PictureTranslater

This is part of a bigger application. Check out [TwitStreamReader](../../../../TwitStreamReader) and [DataExtracter](../../../../DataExtracter)

This node JS code in a docker container process items in an Azure Queue. From the Queue it knows what item to get from an Azure Storage Table. The item returned is a picture URL from a twitter profile. It will then call the [Microsoft Cognitive Services](https://www.microsoft.com/cognitive-services/en-us/apis) to get a description from that picture. The returned result will then be placed back into the Azure Storage Table.

The following environment variables are required to have this run correctly.

    "azure_key": <Azure key to the storage account>,
    "table_name": <The name of the table in the Azure Storage account>
    "subscription" : <The subscription id from the Microsoft Cognitive Services>
    
This repo is created to run inside a [docker container](https://hub.docker.com/r/rickvanrousselt/dataextracter). This docker container can then be deployed to the [Azure Container Service](https://azure.microsoft.com/en-us/services/container-service/) to deploy the entire application.

You will need a subscription for the Microsoft Cognitive Services API. This can be obtained for free [here](https://www.microsoft.com/cognitive-services/en-us/sign-up)

To run this inside ACS the following JSON can be used inside Marathon to run the container.

```javascript
{
  "id": "picturetranslater",
  "cmd": null,
  "cpus": 0.5,
  "mem": 128,
  "disk": 0,
  "instances": 1,
  "container": {
    "docker": {
      "image": "rickvanrousselt/picturetranslater",
     "forcePullImage": true,
      "network": "HOST"
    },
    "type": "DOCKER"
  },
  "portDefinitions": [
    {
      "port": 0,
      "protocol": "tcp",
      "name": null,
      "labels": null
    }
  ],
  "env": {
      <Enter here the environment variables described above>
  }
}
```
