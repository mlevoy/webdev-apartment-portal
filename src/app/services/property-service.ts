import {Injectable} from '@angular/core';


@Injectable()
export class PropertyServiceClient {
  url = 'https://househuntersapi.herokuapp.com/api/';

  findAllProperties = () =>
    fetch(`${this.url}/properties`)
      .then(response => response.json());

  findPropertyById = (pId) =>
    fetch(`${this.url}/properties/${pId}`)
      .then(response => response.json());

  favouriteProperty = (userName, propertyId) =>
    fetch(`${this.url}/users/${userName}/properties/${propertyId}`, {
      method: 'POST'
    }).then(response => response.json());

  unfavouriteProperty = (userName, propertyId) =>
    fetch(`${this.url}/users/${userName}/properties/${propertyId}`, {
      method: 'DELETE'
    }).then(response => response.json());


  contactSeller = (email) =>
    fetch(`${this.url}/sendemail`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(email)

    }).then(response => response);

  getAmenities = () =>
    fetch(`https://househuntersapi.herokuapp.com/api/properties/amenities`, {
      method: 'GET'
    }).then(response => response.json());

  getListingFromLocal = (zipcode, city) =>
    fetch(`${this.url}/search/properties/${zipcode}/${city}`)
      .then(response => response.json());

}
