export interface Ref {
  name: string;
  url: string;
}

export interface Customer {
  id: number,
  name: string,
  contact: string,
  address: string,
  city: string,
  postalcode: string,
  country: string
}

export interface EntryHeader {
  name: string;
  width: number;
}

/**
 *  name (required)
 *  query (required)
 *  url     -> used for editing data
 *  id      -> used for editing and deleting data
 *  dataset -> used for deleting data
 */
export const dataset = {
  customers: {
    name: "Customers",
    url: "/customer",
    id: "CustomerID",
    dataset: "Customers",
    query: "SELECT * FROM Customers"
  },
  orders: {
    name: "Orders",
    url: "/order",
    id: "OrderID",
    dataset: "Customers",
    query: "SELECT * FROM Orders"
  },
  products: {
    name: "Products",
    url: "/product",
    id: "ProductID",
    dataset: "Customers",
    query: "SELECT * FROM Products"
  },
  /* suppliers: {
    name: "Suppliers",
    url: "/supplier",
    id: "SupplierID",
    dataset: "Suppliers",
    query: "SELECT * FROM Suppliers"
  }, */
  /* test: {
    name: "test",
    query: "SELECT ProductID, ProductName FROM Products"
  } */
}
