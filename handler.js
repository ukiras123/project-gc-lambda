'use strict'

const connectToDatabase = require('./db')
function HTTPError (statusCode, message) {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

module.exports.healthCheck = async () => {
  await connectToDatabase()
  console.log('Connection successful.')
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Connection successful.' })
  }
}

module.exports.create = async (event) => {
  try {
    const { User } = await connectToDatabase()
    const user = await User.create(JSON.parse(event.body))
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not create the user.'
    }
  }
}

module.exports.getOne = async (event) => {
  try {
    const { User } = await connectToDatabase()
    const user = await User.findById(event.pathParameters.id)
    if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not fetch the User.'
    }
  }
}

module.exports.getAll = async () => {
  try {
    const { User } = await connectToDatabase()
    const users = await User.findAll()
    return {
      statusCode: 200,
      body: JSON.stringify(users)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Could not fetch the users.'
    }
  }
}

module.exports.update = async (event) => {
  try {
    const input = JSON.parse(event.body)
    const { User } = await connectToDatabase()
    const user = await User.findById(event.pathParameters.id)
    if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
   
    if (input.membershipId) user.membershipId = input.membershipId
    if (input.firstName) user.firstName = input.firstName
    if (input.lastName) user.lastName = input.lastName
    if (input.email) user.email = input.email
    if (input.phone) user.phone = input.phone
    if (input.dob) user.dob = input.dob
    if (input.profilePic) user.profilePic = input.profilePic

    await user.save()
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could not update the User.'
    }
  }
}

module.exports.destroy = async (event) => {
  try {
    const { User } = await connectToDatabase()
    const user = await User.findById(event.pathParameters.id)
    if (!user) throw new HTTPError(404, `User with id: ${event.pathParameters.id} was not found`)
    await user.destroy()
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message || 'Could destroy fetch the User.'
    }
  }
}
