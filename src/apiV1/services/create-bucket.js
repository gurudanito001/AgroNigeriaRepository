const AWS = require('aws-sdk');

// Enter copied or downloaded access ID and secret key here
const ID = 'AKIAX3EWKBAGBYHEPENW';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'agro-nigeria-bucket';


const s3 = new AWS.S3({
    accessKeyId: ID,  
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "eu-west-1"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});