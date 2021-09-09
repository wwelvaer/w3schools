import { Injectable } from '@angular/core';
import { InputField } from './classes';
import { DbConnectionService } from './db-connection.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  /**
   *  Datasets, edit to show different data
   *  @param query (required) Query used to display data
   *
   *  @param id Column name that holds the Primary Key
   *    -> used for editing and deleting data
   *
   *  @param dataset Table name
   *    -> used for deleting data
   *
   *  @param form InputFields of the form
   *    @param InputField.Text
   *    @param InputField.Number
   *    @param InputField.Date
   *    @param InputField.Reference: Requires a query with 2 columns: the primary key and a string value that will be displayed in the dropdown field
   */
  datasets = {
    Customers: {
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
    Orders: {
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
    Orders_WithNames: {
      id: "OrderID",
      dataset: "Orders",
      query: "SELECT OrderID, CustomerName, CONCAT(FirstName, ' ', LastName) as EmployeeName, OrderDate, ShipperName FROM Orders JOIN Shippers USING (ShipperID) JOIN Customers USING (CustomerID) JOIN Employees USING (EmployeeID)",
      form: {
        CustomerID: InputField.Reference("SELECT CustomerID, CustomerName FROM Customers"),
        EmployeeID: InputField.Reference("SELECT EmployeeID, CONCAT(FirstName, ' ', LastName) as name FROM Employees"),
        OrderDate: InputField.Date,
        ShipperID: InputField.Reference("SELECT ShipperID, ShipperName FROM Shippers"),
      }
    },
    Order_details: {
      id: "OrderDetailID",
      dataset: "Order_details",
      query: "SELECT * FROM Order_details",
      form: {
        OrderID: InputField.Reference("SELECT OrderID, CONCAT(OrderID, ' - ' , CustomerName) as name FROM Orders JOIN Customers USING(CustomerID)"),
        ProductID: InputField.Reference("SELECT ProductID, ProductName FROM Products"),
        Quantity: InputField.Number
      }
    },
    Order_details_WithNames: {
      id: "OrderDetailID",
      dataset: "Order_details",
      query: "SELECT OrderDetailID, OrderID, ProductName, Quantity FROM Order_details JOIN Products USING(ProductID) ORDER BY OrderID",
      form: {
        OrderID: InputField.Reference("SELECT OrderID, CONCAT(OrderID, ' - ' , CustomerName) as name FROM Orders JOIN Customers USING(CustomerID)"),
        ProductID: InputField.Reference("SELECT ProductID, ProductName FROM Products"),
        Quantity: InputField.Number
      }
    },
    Products: {
      id: "ProductID",
      dataset: "Products",
      query: "SELECT * FROM Products"
    },
    Suppliers: {
      id: "SupplierID",
      dataset: "Suppliers",
      query: "SELECT * FROM Suppliers"
    },
  }

  constructor(private db: DbConnectionService) { }

  /**
   * executes a delete query
   * @param id primary key
   * @param datasetName table name
   * @param datasetID primary key column name
   * @returns promise with db response
   */
  deleteEntry(id: number, datasetName: string, datasetID: string){
    return this.db.executeQuery(`DELETE FROM ${datasetName} WHERE ${datasetID}=${id}`)
  }

  /**
   * executes a select query
   * @param id primary key
   * @param datasetName table name
   * @param datasetID primary key column name
   * @returns promise with requested data
   */
  getEntry(id: number, datasetName: string, datasetID: string){
    return this.db.executeQuery(`SELECT * FROM ${datasetName} WHERE ${datasetID}=${id}`)
  }

  /**
   * executes an insert query
   * @param datasetName table name
   * @param fields object containing columnnames as keys and data as values
   * @returns promise with db response
   */
  createEntry(datasetName: string, fields: Object){
    return this.db.executeQuery(`INSERT INTO ${datasetName} (${Object.keys(fields).join(", ")}) values (${Object.values(fields).map(x => '"' + x + '"').join(", ")})`);
  }

  /**
   * executes an update query
   * @param datasetName table name
   * @param fields object containing columnnames as keys and data as values
   * @param datasetID primary key column name
   * @param id primary key of entry to be updated
   * @returns promise with db response
   */
  editEntry(datasetName: string, fields: Object, datasetID:string, id: number){
    return this.db.executeQuery(`UPDATE ${datasetName} set ${Object.entries(fields).map(([k, v]) => k + '="' + v + '"').join(", ")} WHERE ${datasetID}=${id}`)
  }
}
