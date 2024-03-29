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
   *    -> must contain primary key(s) to edit or delete data
   *
   *  @param PK Column name that holds the Primary Key(s)
   *    -> used for editing and deleting data
   *    -> single primary key stored as string e.g. "key"
   *    -> multiple primary keys stored as array e.g. ["key1", "key2"]
   *
   *  @param tableName Table name
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
      PK: "CustomerID",
      tableName: "Customers",
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
      PK: "OrderID",
      tableName: "Orders",
      query: "SELECT * FROM Orders",
      form: {
        CustomerID: InputField.Reference("SELECT CustomerID, CustomerName FROM Customers"),
        EmployeeID: InputField.Reference("SELECT EmployeeID, CONCAT(FirstName, ' ', LastName) as name FROM Employees"),
        OrderDate: InputField.Date,
        ShipperID: InputField.Reference("SELECT ShipperID, ShipperName FROM Shippers"),
      }
    },
    Orders_WithNames: {
      PK: "OrderID",
      tableName: "Orders",
      query: "SELECT OrderID, CustomerName, CONCAT(FirstName, ' ', LastName) as EmployeeName, OrderDate, ShipperName FROM Orders JOIN Shippers USING (ShipperID) JOIN Customers USING (CustomerID) JOIN Employees USING (EmployeeID)",
      form: {
        CustomerID: InputField.Reference("SELECT CustomerID, CustomerName FROM Customers"),
        EmployeeID: InputField.Reference("SELECT EmployeeID, CONCAT(FirstName, ' ', LastName) as name FROM Employees"),
        OrderDate: InputField.Date,
        ShipperID: InputField.Reference("SELECT ShipperID, ShipperName FROM Shippers"),
      }
    },
    Order_details: {
      PK: "OrderDetailID",
      tableName: "Order_details",
      query: "SELECT * FROM Order_details",
      form: {
        OrderID: InputField.Reference("SELECT OrderID, CONCAT(OrderID, ' - ' , CustomerName) as name FROM Orders JOIN Customers USING(CustomerID)"),
        ProductID: InputField.Reference("SELECT ProductID, ProductName FROM Products"),
        Quantity: InputField.Number
      }
    },
    Order_details_WithNames: {
      PK: "OrderDetailID",
      tableName: "Order_details",
      query: "SELECT OrderDetailID, OrderID, ProductName, Quantity FROM Order_details JOIN Products USING(ProductID) ORDER BY OrderID",
      form: {
        OrderID: InputField.Reference("SELECT OrderID, CONCAT(OrderID, ' - ' , CustomerName) as name FROM Orders JOIN Customers USING(CustomerID)"),
        ProductID: InputField.Reference("SELECT ProductID, ProductName FROM Products"),
        Quantity: InputField.Number
      }
    },
    Products: {
      PK: "ProductID",
      tableName: "Products",
      query: "SELECT * FROM Products"
    },
    test: {
      PK: "ProductID",
      tableName: "Products",
      query: "SELECT * FROM Products"
    },
    Suppliers: {
      PK: "SupplierID",
      tableName: "Suppliers",
      query: "SELECT * FROM Suppliers"
    },
    Ships: {​
      PK:"imoID",
      tableName:"Ships",
      query:"select * from Ships",
      form: {​
      imoID:InputField.Text,
      shipType:InputField.Text
      }​
    }​,
    Shippers: {​
      PK:"ShipperID",
      tableName:"Shippers",
      query:"select * from Shippers",
      form: {​
      ShipperName:InputField.Text,
      Phone:InputField.Text
      }​
    }​,
    Trips: {​
      PK:["ShipperID", "imoID"],
      tableName:"Trips",
      query:"select Shippers.ShipperID, Shippers.ShipperName, Ships.imoID, Ships.shipType, Trips.trip_time from Trips INNER JOIN Ships ON Ships.imoID = Trips.imoID INNER JOIN Shippers ON Shippers.ShipperID = Trips.ShipperID",
      form: {​
      ShipperID:InputField.Reference("select ShipperID, ShipperName from Shippers"),
      imoID:InputField.Text,
      trip_time:InputField.Number
      }​,
    }​,
  }

  constructor(private db: DbConnectionService) { }

  /**
   * executes a delete query
   * @param PK Object {primary key: value}
   * @param datasetName table name
   * @param datasetID primary key column name
   * @returns promise with db response
   */
  deleteEntry(PK: object, datasetName: string){
    return this.db.executeQuery(`DELETE FROM ${datasetName} WHERE ${Object.entries(PK).map(([k,v]) => `${k}="${v}"`).join(" AND ")}`)
  }

  /**
   * executes a select query
   * @param PK Object {primary key: value}
   * @param datasetName table name
   * @param datasetID primary key column name
   * @returns promise with requested data
   */
  getEntry(PK: object, datasetName: string){
    return this.db.executeQuery(`SELECT * FROM ${datasetName} WHERE ${Object.entries(PK).map(([k,v]) => `${k}="${v}"`).join(" AND ")}`)
  }

  /**
   * executes an insert query
   * @param datasetName table name
   * @param fields object containing columnnames as keys and data as values
   * @returns promise with db response
   */
  createEntry(datasetName: string, fields: Object){
    return this.db.executeQuery(`INSERT INTO ${datasetName} (${Object.keys(fields).join(", ")}) values (${Object.values(fields).map(x => `"${x}"`).join(", ")})`);
  }

  /**
   * executes an update query
   * @param datasetName table name
   * @param fields object containing columnnames as keys and data as values
   * @param datasetID primary key column name
   * @param PK Object {primary key: value}
   * @returns promise with db response
   */
  editEntry(datasetName: string, fields: Object, PK: object){
    return this.db.executeQuery(`UPDATE ${datasetName} set ${Object.entries(fields).map(([k, v]) => `${k}='${v}'`).join(", ")} WHERE ${Object.entries(PK).map(([k,v]) => `${k}="${v}"`).join(" AND ")}`)
  }
}
