
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
    profilePic: type.STRING,
    name: type.STRING,
    dob: type.STRING,
    address: type.JSON,
    phone: type.JSON,
    occupation: type.STRING,
    typeOfMembership: type.STRING,
    familyHistory: type.JSON,
    maritalStatus: type.String,
    partnerDetail: type.JSON,
    kidsCount: type.JSON,
    kidsDetail: type.JSON
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  }
  );
};
