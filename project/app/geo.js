const { createClient } = require('@google/maps');

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCPZtqmdO-ib1KmWkVeOO-ihikANcy21aE'
  });

  async function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: address
      }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          const results = response.json.results;
          if (results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            resolve({ latitude: lat, longitude: lng });
          } else {
            reject(new Error('No results found'));
          }
        }
      });
    });
  }

  module.exports = geocodeAddress;