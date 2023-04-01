const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCPZtqmdO-ib1KmWkVeOO-ihikANcy21aE'
  });
  
  googleMapsClient.geocode({
    address: ''
  }, (err, response) => {
    if (err) {
      console.error('Error retrieving location information:', err);
      return;
    }
  
    console.log(response.json.results);
  });
  