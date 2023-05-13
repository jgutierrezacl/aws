const aws = require('aws-sdk');
let dynamonDBClientParams ={};

if (process.env.IS_OFFLINE){
    dynamonDBClientParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamonDB = new aws.DynamoDB.DocumentClient(dynamonDBClientParams);

const updateUsers = async (event, context) => {
console.log('body', event.body);
    let userBody = JSON.parse(event.body);
    let userId = event.pathParameters.userId;

    let params = {
        TableName: 'usersTable',
        Key: { pk : userId },
        UpdateExpression: 'set #nombre = :nombre',
        ExpressionAttributeNames: { '#nombre' : 'nombre'},
        ExpressionAttributeValues: { ':nombre' : userBody.nombre},
        ReturnValues: 'ALL_NEW'
        
    };
    console.log(params);
    try {
        const data = await dynamonDB.update(params).promise();
        console.log(data);
        return {
          "statusCode": 200,
          "body": JSON.stringify({ 'user' : data.Attributes})
        };
      } catch (error) {
        console.log(error);
        return {
          "statusCode": 500,
          "body": JSON.stringify(error)
        };
      }
}

module.exports = {
    updateUsers
}