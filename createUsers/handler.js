const aws = require('aws-sdk');
const ramdon = require('crypto')
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

const createUsers = async (event, context) => {

    const id = ramdon.randomUUID();
    let userBody = JSON.parse(event.body);
    userBody.pk = id;

    let params = {
        TableName: 'usersTable',
        Item : userBody
    };
    console.log(params.Item);
    try {
        await dynamonDB.put(params).promise();
        return {
          "statusCode": 200,
          "body": JSON.stringify({ 'user' : params.Item})
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
    createUsers
}