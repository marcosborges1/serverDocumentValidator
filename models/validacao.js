const { Gstore, instances } = require('gstore-node');
const { Datastore } = require('@google-cloud/datastore')

let gstore = new Gstore();
const datastore = new Datastore({
    projectId: process.env.GCLOUD_PROJECT,
});
gstore.connect(datastore);
// Save the gstore instance
instances.set('unique-id', gstore);

// Retrieve the gstore instance
gstore = instances.get('unique-id');

const { Schema } = gstore;

const validationSchema = new Schema({
	// company: { type: Schema.Types.Key, ref: 'Company' },
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
	},
	createdAt: { type: Date, default: gstore.defaultValues.NOW }
})

module.exports = gstore.model('validation', validationSchema);



// const { Model, schema, field } = require('firestore-schema-validator')
// // const uuid = require('uuid');

// // const ddb = new dynamoose.aws.sdk.DynamoDB({
// //     "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
// //     "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
// //     "region": "us-east-1"
// // });

// // // Set DynamoDB instance to the Dynamoose DDB instance
// // dynamoose.aws.ddb.set(ddb);

// // dynamoose.local();
// const validationSchema = schema(
// 	{
// 		arquivo: field('id').string(),
// 		codigo: field('id').string(),
// 		motivacao:field('id').string(),
// 		validacao: field('id').string()
// 	}
// );

// class ValidationModel extends Model {
// 	// Path to Cloud Firestore collection.
// 	static get _collectionPath() {
// 	  return 'validation'
// 	}
   
// 	// Model Schema.
// 	static get _schema() {
// 	  return validationSchema
// 	}
//   }
// module.exports = ValidationModel