import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  backendPort = 3000;
  url = 'http://localhost:' + this.backendPort;

  constructor(private http: HttpClient) {
  }

  /**
   * sends a http POST request to the backend containing a query
   * @param query
   * @returns promise
   */
  async executeQuery(query: string){
    return this.http.post(this.url, {'query': query}).toPromise();
  }


}
