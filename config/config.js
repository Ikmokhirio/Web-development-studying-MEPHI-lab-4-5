module.exports = {
    settings: {
        port: 3000,
        cookieLifeTime: 14400
    },
    session: {
        cookieSecret: "thisIsTheSecret"
    },
    databaseSettings: {
        databaseName: "users",
        databaseLogin: "admin",
        databasePassword: "1234",
        databaseHost: "db",
        databaseDialect: "postgres"
    }
}