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

export const dataset = {
  customers: {
    name: "Customers",
    url: "/customers",
    query: "SELECT * FROM Customers"
  },
  orders: {
    name: "Orders",
    url: "/orders",
    query: "SELECT * FROM Orders"
  },
  products: {
    name: "Products",
    url: "/products",
    query: "SELECT * FROM Products"
  },
  test: {
    name: "test",
    url: "/products",
    query: "SELECT ProductID, ProductName FROM Products"
  }
}
