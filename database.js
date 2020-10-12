const {Sequelize} = require('sequelize');
const settings = require('./config/config').databaseSettings;

const sequelize = new Sequelize(settings.databaseName, settings.databaseLogin, settings.databasePassword, {
    host: settings.databaseHost,
    dialect: settings.databaseDialect
});

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function findUser(username) {
    const User = require('./UserModel').User

    return await User.findOne({
        where: {
            username: username
        }
    });
}

async function isUserExist(username) {
    let user = await findUser(username);
    return (user !== undefined && user !== null);
}

async function getUserPassword(username) {
    let user = await findUser(username);
    console.log("Password : " + user.password);
    return user.password;
}


exports.connectToDatabase = connectToDatabase;
exports.sequelize = sequelize;
exports.findUser = findUser;
exports.getUserPassword = getUserPassword;
exports.isUserExist = isUserExist;