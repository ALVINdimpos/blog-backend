import { Model, DataTypes, Sequelize } from "sequelize";

class Comment extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "post",
    });
  }
}

export default (sequelize: Sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
    },
    {
      sequelize,
        modelName: "Comment",
      tableName: "Comments",  
    }
  );

  return Comment;
};