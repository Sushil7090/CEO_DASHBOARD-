// be_server/database/models/user.js

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {

     id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // ✅ this generates UUID automatically
      primaryKey: true
    },
    
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    tableName: 'users',
    freezeTableName: true
  });

  return User;
};
