import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  url = 'https://public.opendatasoft.com/api/records/1.0/';
  radius = '5000';

  constructor() {
  }

  public getZipCode(latitude: number, longitude: number) {
    return fetch(`${this.url}search/?dataset=us-zip-code-latitude-and-longitude&geofilter.distance=${latitude},${longitude},${this.radius}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }).then(response => response.json());
  }

  public getLocation(latitude: number, longitude: number) {
    return fetch(`${this.url}search/?dataset=zillow-neighborhoods&rows=10&facet=state&facet=county&facet=city&facet=name&geofilter.distance=${latitude},${longitude},${this.radius}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }).then(response => response.json());
  }

  public getCities(stateCode: string) {
    return fetch(`${this.url}search/?dataset=zillow-neighborhoods&rows=0&facet=city&refine.state=${stateCode}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }).then(response => response.json());
  }

  public getNeighbourhood(stateCode: string, cityName: string) {
    return fetch(`${this.url}search/?dataset=zillow-neighborhoods&rows=100&facet=state&facet=city&facet=name&refine.state=${stateCode}&refine.city=${cityName}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }).then(response => response.json());
  }
}
