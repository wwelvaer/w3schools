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

  async executeQuery(query: string){
    return await this.http.post(this.url, {'query': query}).toPromise();
  }


}
