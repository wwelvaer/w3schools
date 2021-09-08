import { Injectable } from '@angular/core';
import { InputField } from './classes';
import { DbConnectionService } from './db-connection.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  /**
   *  query (required)
   *  url     -> used for editing data
   *  id      -> used for editing and deleting data
   *  dataset -> used for deleting data
   */
  datasets = {
    customers: {
      id: "CustomerID",
      dataset: "Customers",
      query: "SELECT * FROM Customers",
      form: {
        CustomerName: InputField.Text,
        ContactName: InputField.Text,
        Address: InputField.Text,
        City: InputField.Text,
        PostalCode: InputField.Text,
        Country: InputField.Text,
      }

    },
    orders: {
      id: "OrderID",
      dataset: "Orders",
      query: "SELECT * FROM Orders",
      form: {
        CustomerID: InputField.Reference("SELECT CustomerID, CustomerName FROM Customers"),
        EmployeeID: InputField.Reference("SELECT EmployeeID, CONCAT(FirstName, ' ', LastName) as name FROM Employees"),
        OrderDate: InputField.Date,
        ShipperID: InputField.Reference("SELECT ShipperID, ShipperName FROM Shippers"),
      }
    },
    ordersWithNames: {
      id: "OrderID",
      dataset: "Orders",
      query: "SELECT OrderID, CustomerName, CONCAT(FirstName, ' ', LastName) as EmployeeName, OrderDate, ShipperName  FROM Orders JOIN Shippers USING (ShipperID) JOIN Customers USING (CustomerID) JOIN Employees USING (EmployeeID)",
      form: {
        CustomerID: InputField.Reference("SELECT CustomerID, CustomerName FROM Customers"),
        EmployeeID: InputField.Reference("SELECT EmployeeID, CONCAT(FirstName, ' ', LastName) as name FROM Employees"),
        OrderDate: InputField.Date,
        ShipperID: InputField.Reference("SELECT ShipperID, ShipperName FROM Shippers"),
      }
    },
    products: {
      id: "ProductID",
      dataset: "Products",
      query: "SELECT * FROM Products"
    },
    suppliers: {
      id: "SupplierID",
      dataset: "Suppliers",
      query: "SELECT * FROM Suppliers"
    },

  }

  constructor(private db: DbConnectionService) { }

  getCustomer(id: number){
    return this.db.executeQuery(`SELECT * FROM Customers WHERE CustomerID = ${id}`);
  }

  createCustomer(CustomerName: string, ContactName: string, Address: string, City: string, PostalCode: string, Country: string){
    return this.db.executeQuery(
      `INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country)
        values ('${CustomerName}', '${ContactName}', '${Address}', '${City}', '${PostalCode}', '${Country}')`);
  }

  editCustomer(CustomerId: number, CustomerName: string, ContactName: string, Address: string, City: string, PostalCode: string, Country: string){
    return this.db.executeQuery(
      `UPDATE Customers set
          CustomerName='${CustomerName}',
          ContactName='${ContactName}',
          Address='${Address}',
          City='${City}',
          PostalCode='${PostalCode}',
          Country='${Country}'
        WHERE CustomerId=${CustomerId}`);
  }

  deleteEntry(id: number, datasetName: string, datasetID: string){
    return this.db.executeQuery(`DELETE FROM ${datasetName} WHERE ${datasetID}=${id}`)
  }

  getEntry(id: number, datasetName: string, datasetID: string){
    return this.db.executeQuery(`SELECT * FROM ${datasetName} WHERE ${datasetID}=${id}`)
  }

  createEntry(datasetName: string, fields: Object){
    return this.db.executeQuery(`INSERT INTO ${datasetName} (${Object.keys(fields).join(", ")}) values (${Object.values(fields).map(x => '"' + x + '"').join(", ")})`);
  }

  editEntry(datasetName: string, fields: Object, datasetID:string, id: number){
    return this.db.executeQuery(`UPDATE ${datasetName} set ${Object.entries(fields).map(([k, v]) => k + '="' + v + '"').join(", ")} WHERE ${datasetID}=${id}`)
  }
}
