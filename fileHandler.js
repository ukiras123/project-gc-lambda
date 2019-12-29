const S3 = require('aws-sdk/clients/s3');
const uniqid = require('uniqid');
const mime = require('mime');

const BUCKET_NAME = 'gautam-chaulagain-asset';
const S3_URL = 'https://s3.amazonaws.com';

function HTTPError (statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
/**
 * Use AWS SDK to create pre-signed POST data.
 * We also put a file size limit (100B - 10MB).
 * @param key
 * @param contentType
 * @returns {Promise<object>}
 */
const createPresignedPost = ({ key, contentType }) => {
  const s3 = new S3();
  const params = {
    Expires: 60,
    Bucket: BUCKET_NAME,
    Conditions: [['content-length-range', 100, 10000000]], // 100Byte - 10MB
    Fields: {
      'Content-Type': contentType,
      key
    }
  };

  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

/**
 * We need to respond with adequate CORS headers.
 * @type {{"Access-Control-Allow-Origin": string, "Access-Control-Allow-Credentials": boolean}}
 */
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
};

module.exports.getPresignedPostData = async ({ body }) => {
  try {
    const { name, folder } = JSON.parse(body);
    const folderName = folder || 'member-profile';
    const type = mime.getType(name);
    const key = `${folderName}/${uniqid()}_${name}`;

    const supportedType = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!supportedType.includes(type)) {
      throw new HTTPError(404, `Please upload valid file. Only jpeg or png supported. Current File Type: ${type}`);
    }
    const presignedPostData = await createPresignedPost({
      key: key,
      contentType: type
    });
    presignedPostData.fileUrl = `${S3_URL}/${BUCKET_NAME}/${key}`;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(presignedPostData)
    };
  } catch (e) {
    return {
      statusCode: e.statusCode || 500,
      headers,
      body: JSON.stringify({
        message: e.message
      })
    };
  }
};
