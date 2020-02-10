'use strict';

const connectToDatabase = require('./db');

function HTTPError (statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'text/json'
};

module.exports.healthCheck = async () => {
  await connectToDatabase();
  console.log('Connection successful.');
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Connection successful.' })
  };
};

module.exports.create = async (event) => {
  try {
    const { Member } = await connectToDatabase();
    const member = await Member.create(JSON.parse(event.body));
    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(`Member not created: ${JSON.stringify(err)}`);
    return {
      statusCode: err.statusCode || 400,
      headers,
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
      headers,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    let errMsg = 'Could not fetch the member.';
    errMsg = (err.message) ? err.message : errMsg;
    return {
      statusCode: err.statusCode || 500,
      headers,
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
      headers,
      body: JSON.stringify(members)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: err.statusCode || 500,
      headers,
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
    if (input.profilePic) member.profilePic = input.profilePic;
    if (input.name) member.name = input.name;
    if (input.dob) member.dob = input.dob;
    if (input.address) member.address = input.address;
    if (input.phone) member.phone = input.phone;
    if (input.occupation) member.occupation = input.occupation;
    if (input.typeOfMembership) member.typeOfMembership = input.typeOfMembership;
    if (input.familyHistory) member.familyHistory = input.familyHistory;
    if (input.maritalStatus) member.maritalStatus = input.maritalStatus;
    if (input.partnerDetail) member.partnerDetail = input.partnerDetail;
    if (input.kidsCount) member.kidsCount = input.kidsCount;
    if (input.kidsDetail) member.kidsDetail = input.kidsDetail;
    await member.save();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    let errMsg = 'Could not update the member.';
    errMsg = (err.message) ? `${errMsg} - ${err.message};` : errMsg;
    return {
      statusCode: err.statusCode || 500,
      headers,
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
      headers,
      body: JSON.stringify(member)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    let errMsg = 'Could not delete the member.';
    errMsg = (err.message) ? `${errMsg} - ${err.message};` : errMsg;
    return {
      statusCode: err.statusCode || 500,
      headers,
      body: JSON.stringify({ errorMessage: errMsg, detail: err })
    };
  }
};
