module.exports = {
  access: {
    file: 'access',
    model: 'AccessToken',
    destroy: 'destroyAllAccessTokens',
    revoke: 'revokeAllAccessTokens',
    expiry: 'accessExpiry'
  },
  refresh: {
    file: 'refresh',
    model: 'RefreshToken',
    destroy: 'destroyAllRefreshTokens',
    revoke: 'revokeAllRefreshTokens',
    expiry: 'refreshExpiry'
  }
};