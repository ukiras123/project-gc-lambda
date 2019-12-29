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
    const { User } = await connectToDatabase();
    const user = await User.create(JSON.parse(event.body));
    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  } catch (err) {
    console.log(`User not created: ${JSON.stringify(err)}`);
    return {
      statusCode: err.statusCode || 400,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not create the user.', detail: err })
    };
  }
};

module.exports.getOne = async (event) => {
  try {
    const { User } = await connectToDatabase();
    const user = await User.findById(event.pathParameters.id);
    if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`);
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not fetch the user.' , detail: err })
    };
  }
};

module.exports.getAll = async () => {
  try {
    const { User } = await connectToDatabase();
    const users = await User.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not fetch the user.', detail: err })
    };
  }
};

module.exports.update = async (event) => {
  try {
    const input = JSON.parse(event.body);
    const { User } = await connectToDatabase();
    const user = await User.findById(event.pathParameters.id);
    if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`);

    if (input.membershipId) user.membershipId = input.membershipId;
    if (input.firstName) user.firstName = input.firstName;
    if (input.lastName) user.lastName = input.lastName;
    if (input.email) user.email = input.email;
    if (input.phone) user.phone = input.phone;
    if (input.dob) user.dob = input.dob;
    if (input.profilePic) user.profilePic = input.profilePic;
    await user.save();
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not update the user.' , detail: err })
    };
  }
};

module.exports.destroy = async (event) => {
  try {
    const { User } = await connectToDatabase();
    const user = await User.findById(event.pathParameters.id);
    if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`);
    await user.destroy();
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    console.log(JSON.stringify(err));
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/json' },
      body: JSON.stringify({ errorMessage: 'Could not delete the user.', detail: err  })
    };
  }
};
