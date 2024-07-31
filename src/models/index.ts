import sequelize from "../config/database";
import UserModel from "./user";
import CommentModel from "./comment";
import PostModel from "./post";
import RoleModel from "./role";

const models = {
  User: UserModel(sequelize),
  Comment: CommentModel(sequelize),
  Post: PostModel(sequelize),
  Role: RoleModel(sequelize),
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, models };
export default models;
