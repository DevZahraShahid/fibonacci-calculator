module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  pgUser: process.env.PGUSER, // PG User that we are going to login as
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE, //Name of the db that we're going to connect to inside of PG
  pgPassword: process.env.PGPASSWORD, // Password to the DB
  pgPort: process.env.PGPORT,
};
