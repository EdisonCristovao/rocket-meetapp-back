module.exports = {
  dialect: 'postgres',
  host: process.env.DC_DB_HOST || 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  port: 5432,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
