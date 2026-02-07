module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
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
    },

  role: {
  type: DataTypes.ENUM('admin', 'manager', 'employee'),
  allowNull: false,
  defaultValue: 'employee'
   }
  },
  
  {
    tableName: 'users',
    freezeTableName: true
  });
   User.associate = (models) => {
   User.hasMany(models.ProjectTeamMember, {
    foreignKey: 'user_id',
    sourceKey: 'id',
    as: 'project_memberships',
  });
};

  return User;
};
