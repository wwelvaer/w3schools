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

  async getCustomer(id: number){
    return await this.executeQuery(`SELECT * FROM Customers WHERE CustomerID = ${id}`);
  }

  async createCustomer(CustomerName: string, ContactName: string, Address: string, City: string, PostalCode: string, Country: string){
    return await this.executeQuery(
      `INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
        values ('${CustomerName}', '${ContactName}', '${Address}', '${City}', '${PostalCode}', '${Country}')`);
  }

  async editCustomer(CustomerId: number, CustomerName: string, ContactName: string, Address: string, City: string, PostalCode: string, Country: string){
    return await this.executeQuery(
      `UPDATE Customers set
          CustomerName='${CustomerName}',
          ContactName='${ContactName}',
          Address='${Address}',
          City='${City}',
          PostalCode='${PostalCode}',
          Country='${Country}'
        WHERE CustomerId=${CustomerId}`);
  }
}
