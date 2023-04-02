export class UserDataModel {
  name: string;
  country: string;
  city: string;
  latitude: string;
  longitude: string;

  constructor(
    name: string,
    country: string,
    city: string,
    latitude: string,
    longitude: string
  ) {
    this.name = name;
    this.country = country;
    this.city = city;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
