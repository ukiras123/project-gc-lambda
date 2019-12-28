const Sequelize = require("sequelize");

module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    membershipId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: 'membershipId',
        msg: 'The membershipId is already taken!'
     }
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      },
      unique: {
        args: 'email',
        msg: 'The email is already taken!'
     }
    },
    phone: { 
      type: Sequelize.INTEGER,
    },
    dob: Sequelize.STRING,
    profilePic: Sequelize.STRING
  })
}
