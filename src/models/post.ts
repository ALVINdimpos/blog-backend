import { Model, DataTypes, Sequelize } from "sequelize";

class Post extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments",
    });
  }
}

export default (sequelize: Sequelize) => {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
        modelName: "Post",
      tableName: "Posts",
    }
  );

  return Post;
};