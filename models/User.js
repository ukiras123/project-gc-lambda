
module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    membershipId: {
      type: type.STRING,
      allowNull: false,
      unique: {
        args: 'membershipId',
        msg: 'The membershipId is already taken!'
     }
    },
    firstName: type.STRING,
    lastName: type.STRING,
    email: {
      type: type.STRING,
      validate: {
        isEmail: true
      },
      unique: {
        args: 'email',
        msg: 'The email is already taken!'
     }
    },
    phone: { 
      type: type.INTEGER,
    },
    dob: type.STRING,
    profilePic: type.STRING
  })
}
