const dynamoose = require('dynamoose');
const uuid = require('uuid');

const ddb = new dynamoose.aws.sdk.DynamoDB({
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
    "region": "us-east-1"
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

// dynamoose.local();
const validationSchema = new dynamoose.Schema(
	{
		id: {
			type: String,
			hashKey: true,
			default: uuid.v1,
		},
		arquivo: {
			type: String,
		},
		codigo: {
			type: String,
		},
		motivacao:{
			type: String,
		},
		validacao: {
			type: String,	
		}
	},
	{
	timestamps: true,
	}
);
module.exports = dynamoose.model('validation', validationSchema);