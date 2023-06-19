const {Model, Datatypes} = require('sequelize');
const sequelize = require('../config/connection');

class Post extends Model {}

Post.init({
    id: {
        type: Datatypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Datatypes.STRING,
        allowNull: false,
        validate: {
            len: [1]
        }
    },
    content: {
        type: Datatypes.STRING,
        allowNull: false,
        validate: {
            len: [1]
        }
    },
    user_id: {
        type: Datatypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
});

module.exports = Post;