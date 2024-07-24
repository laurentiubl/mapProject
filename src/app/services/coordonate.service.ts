import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CoordonateService {

  constructor(private http: HttpClient) { }

  async getCountry(coordinates: any): Promise<string> {
    const apiKey = '23c68fdffa75406daae41a86d4826037';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates[1]}+${coordinates[0]}&key=${apiKey}`;

    try {
      const response: any = await this.http.get(url).toPromise();
      if (response && response.results && response.results.length > 0) {
        const components = response.results[0].components;
        let country = components.country;
        if(components.country === undefined){
          country = 'Unknown location';
        }

        if(components.country === undefined){
          country = 'Unknown location';
        }
        const region = components.state || components.region || 'Unknown region';
        return `${region}, ${country}`;
      } else {
        return 'Unknown location';
      }
    } catch (error) {
      console.error('Error fetching location data', error);
      return 'Unknown location';
    }
  }
}
