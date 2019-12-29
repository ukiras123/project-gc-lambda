'use strict';

const connectToDatabase = require('./db');
function HTTPError (statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports.healthCheck = async () => {
  await connectToDatabase();
  console.log('Connection successful.');
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' })
  };
};

module.exports.create = async (event) => {
  try {
    const { Member } = await connectToDatabase();
    const member = await Member.create(JSON.parse(event.body));
    return {
      statusCode: 201,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(`Member not created: ${JSON.stringify(err)}`);
    return {
      statusCode: err.statusCode || 400,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not create the member. Make sure memberId and email is unique.', detail: err })
    };
  }
};

module.exports.getOne = async (event) => {
  try {
    const { Member } = await connectToDatabase();
    const member = await Member.findById(event.pathParameters.memberId);
    if (!member) throw new HTTPError(404, `Member with id: ${event.pathParameters.memberId} was not found`);
    return {
      statusCode: 200,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    let errMsg = 'Could not fetch the member.';
    errMsg = (err.message) ? err.message : errMsg;
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: errMsg, detail: err })
    };
  }
};

module.exports.getAll = async () => {
  try {
    const { Member } = await connectToDatabase();
    const members = await Member.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(members)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not fetch the members.', detail: err })
    };
  }
};

module.exports.update = async (event) => {
  try {
    const input = JSON.parse(event.body);
    const { Member } = await connectToDatabase();
    const member = await Member.findById(event.pathParameters.memberId);
    if (!member) throw new HTTPError(404, `Member with id: ${event.pathParameters.memberId} was not found`);

    if (input.firstName) member.firstName = input.firstName;
    if (input.lastName) member.lastName = input.lastName;
    if (input.email) member.email = input.email;
    if (input.phone) member.phone = input.phone;
    if (input.dob) member.dob = input.dob;
    if (input.profilePic) member.profilePic = input.profilePic;
    await member.save();
    return {
      statusCode: 200,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    let errMsg = 'Could not update the member.';
    errMsg = (err.message) ? `${errMsg} - ${err.message};` : errMsg;
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: errMsg, detail: err })
    };
  }
};

module.exports.destroy = async (event) => {
  try {
    const { Member } = await connectToDatabase();
    const member = await Member.findById(event.pathParameters.memberId);
    if (!member) throw new HTTPError(404, `Member with id: ${event.pathParameters.memberId} was not found`);
    await member.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    let errMsg = 'Could not delete the member.';
    errMsg = (err.message) ? `${errMsg} - ${err.message};` : errMsg;
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: errMsg, detail: err })
    };
  }
};
