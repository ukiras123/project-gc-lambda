
module.exports = (sequelize, type) => {
  return sequelize.define('member', {
    memberId: {
      type: type.STRING,
      primaryKey: true,
      allowNull: false,
      unique: {
        args: 'memberId',
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
      type: type.INTEGER
    },
    dob: type.STRING,
    profilePic: type.STRING
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  }
  );
};
