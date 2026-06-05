export const environment = {
  production: false,
  envName: 'dev',
  apiUrl: 'http://localhost:5000/api',
  alertApiUrl: 'http://localhost:5001/api',
  searchApiUrl: 'http://localhost:5002/api',
  analyticsApiUrl: 'http://localhost:5003/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'vehicle-detection',
    clientId: 'vehicle-detection-web'
  }
};
