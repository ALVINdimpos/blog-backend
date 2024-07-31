import { Model, DataTypes, Sequelize } from "sequelize";

class Role extends Model {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Role.hasMany(models.User, {
      foreignKey: "roleId",
      as: "users",
    });
  }
}

export default (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "Roles", 
    }
  );

  return Role;
};