const Sequelize = require('sequelize');
const sequelize = require('./database').sequelize;
const argon = require('argon2');

const User = sequelize.define('User', {
    username: {type: Sequelize.STRING, allowNull: false, unique: true},
    password: {type: Sequelize.STRING, allowNull: false}
});

async function createNewUser(username, password) {

    const hashedPassword = await argon.hash(password);

    let newUser = undefined;

    argon.verify(hashedPassword, password).then(() => {

        newUser = User.build({
            username: username,
            password: hashedPassword
        });

        newUser.save().then(() => {
            console.log("New user added");
        });
    }).catch((err) => {
        console.err(err + ' Invalid password supplied!');
        newUser = undefined;
    });

    return newUser;

}

exports.User = User;
exports.sequelize = sequelize;