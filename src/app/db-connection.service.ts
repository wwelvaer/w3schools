import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Customer } from './classes';

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

  async getCustomers(): Promise<Customer[]>{
    let d = await this.executeQuery('SELECT * FROM Customers'),
        r: Customer[] = [];
    if (d['data'])
      d['data'].forEach(x => {
        r.push({
          id: x['CustomerID'],
          name: x['CustomerName'],
          contact: x['ContactName'],
          address: x['Address'],
          city: x['City'],
          postalcode: x['PostalCode'],
          country: x['Country']
        })
      });
    return r;
  }
}
