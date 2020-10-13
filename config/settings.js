module.exports = {
    settings: {
        port: 3000,
        cookieLifeTime: 24*60*60*100
    },
    session: {
        cookieSecret: "thisIsTheSecret",
        cookieName: "session"
    }
}