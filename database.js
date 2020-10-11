const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('users', 'admin', '1234', {
    host: 'db',
    dialect: 'postgres'
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


exports.connectToDatabase = connectToDatabase;
exports.sequelize = sequelize;
exports.isUserExist = isUserExist;