//const aws = require('@aws-sdk/client-dynamodb');
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

const deleteUsers = async (event, context) => {
console.log('body', event.body);
    let userId = event.pathParameters.userId;

    let params = {
        TableName: 'usersTable',
        Key:{
          pk : userId
        }
        
    };
    console.log(params);
    try {
        await dynamonDB.delete(params).promise();
        return {
          "statusCode": 200,
          "body": JSON.stringify({ 'user' : userId})
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
    deleteUsers
}