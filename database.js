const {Sequelize} = require('sequelize');
const settings = require('./config/config.json').development;
const argon = require('argon2');

const sequelize = new Sequelize(settings.database, settings.username, settings.password, {
    host: settings.host,
    dialect: settings.dialect,
    logging: false
});

const userModel = require('./models/user')(sequelize, Sequelize);

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function findUser(username) {
    return await userModel.findOne({
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
    return user.password;
}

async function createNewUser(username, password, phone, gender, desc) {
    const hashedPassword = await argon.hash(password);

    let res = await argon.verify(hashedPassword, password);

    if (res) {
        let newUser = userModel.build({
            username: username,
            password: hashedPassword,
            phone_number: phone,
            gender: gender,
            description: desc
        });


        newUser.save().then(() => {
            console.log("New user added");
        });

        return newUser;
    }

    return undefined;


}

exports.connectToDatabase = connectToDatabase;
exports.sequelize = sequelize;
exports.findUser = findUser;
exports.getUserPassword = getUserPassword;
exports.isUserExist = isUserExist;
exports.User = userModel;
exports.createNewUser = createNewUser;