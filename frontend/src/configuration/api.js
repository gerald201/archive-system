export default {
  apiKey: process.env.VUE_APP_API_KEY || '',
  url: (process.env.VUE_APP_API_URL || location.origin).replace(/\/*$/, '')
};
