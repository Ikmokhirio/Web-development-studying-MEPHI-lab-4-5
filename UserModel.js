const Sequelize = require('sequelize');
const sequelize = require('./database').sequelize;
const argon = require('argon2');

const User = sequelize.define('User', {
    username: {type: Sequelize.STRING, allowNull: false, unique: true},
    password: {type: Sequelize.STRING, allowNull: false},
    phone_number: {type: Sequelize.STRING, allowNull: false},
    gender: {type: Sequelize.STRING, allowNull: false},
    description: {type: Sequelize.STRING, allowNull: false}
});

async function createNewUser(username, password, phone, gender, desc) {

    const hashedPassword = await argon.hash(password);

    let res = await argon.verify(hashedPassword, password);

    if (res) {
        let newUser = User.build({
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

exports.User = User;
exports.sequelize = sequelize;
exports.createNewUser = createNewUser;