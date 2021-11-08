module.exports = {
  access: {
    file: 'access',
    model: 'AccessToken',
    expiry: 'accessExpiry'
  },
  refresh: {
    file: 'refresh',
    model: 'RefreshToken',
    expiry: 'refreshExpiry'
  }
};
