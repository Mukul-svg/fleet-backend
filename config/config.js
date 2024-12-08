module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fleet_management',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRATION: '24h'
  };