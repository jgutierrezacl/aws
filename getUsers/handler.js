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

const getUsers = async (event, context) => {

    let params = {
        TableName: 'usersTable'
    };

    try {
        const data = await dynamonDB.scan(params).promise();
            return {
                "statusCode": 200,
                "body": JSON.stringify({'users': data})
            };
      } catch (error) {
            return {
                "statusCode" : 500,
                "body" : JSON.stringify(error)
            };
      }

/*     return dynamonDB.query(params).promise().then(res =>{
        console.log(res);
        return {
            "statusCode" : 200,
            "body": JSON.stringify({'user': res})
        }
    }) */
}

const getUser = async (event, context) => {
    let userId = event.pathParameters.userId;

    let params = {
        TableName: 'usersTable',
        Key: {
            pk: event.pathParameters.userId
        } 
    };

    try {
        const data = await dynamonDB.get(params).promise();
        console.log("data:", data);
        return {
          "statusCode": 200,
          "body": JSON.stringify({ 'user' : data.Item})
        };
      } catch (error) {
        return {
          "statusCode": 500,
          "body": JSON.stringify(error)
        };
      }
}

module.exports = {
    getUsers,
    getUser
}