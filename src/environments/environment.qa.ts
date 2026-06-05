export const environment = {
  production: false,
  envName: 'qa',
  apiUrl: 'https://qa-api.vehicledetection.azure.example.com/api',
  alertApiUrl: 'https://qa-api.vehicledetection.azure.example.com/api',
  searchApiUrl: 'https://qa-api.vehicledetection.azure.example.com/api',
  analyticsApiUrl: 'https://qa-api.vehicledetection.azure.example.com/api',
  keycloak: {
    url: 'https://qa-auth.vehicledetection.azure.example.com',
    realm: 'vehicle-detection',
    clientId: 'vehicle-detection-web'
  }
};
