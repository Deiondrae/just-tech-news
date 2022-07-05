const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require('bcrypt');

//create user model
class User extends Model {}

User.init(
    {
        //define id column
        id: {
            //use Sequelize DataTypes object to provide what type of data
            type: DataTypes.INTEGER,
            //can't be null
            allowNull: false,
            //primary key column
            primaryKey: true,
            //turn on autoincrement
            autoIncrement: true
        },
        //define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //dont allow duplicate emails
            unique: true,
            //validate data
            validate: {
                isEmail: true
            }
        },
        //define password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //minimum length
                len: [4]
            }
        } 
    },
    {
        hooks: {
            //set up beforeCreate lifestyle hook
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10)
                    return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10)
                    return updatedUserData;
            }
        },
        //connection to database
        sequelize,
        //dont automatically generate timestamp fields
        timestamps: false,
        //dont pluralize names of tables
        freezeTableName: true,
        // user underscores instead of camel-casing
        underscored: true,
        //keep model as lowercase
        modelName: "user"
    }
);

module.exports = User;