export default `
  
  type Sale {
    id: Int!
    name: String!
    deadline: Date!
    status:  String!
    description:  String!
    tax: Float!
    items: [Item!]
    isInvoiced: Boolean!
    customerId: Int!
    customer: Customer!
    user: User!
    total: Float!
  }

  type GetSalesResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    isInvoiced: Boolean!
    customer: Customer!
    user: User!
  }

  type GetSalesWithoutInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    total: Float
    customer_id: Int!
    customer_name: String!
  }

  type GetSalesWithInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    customer: Customer!
    total: Float
  }

  type CreateUpdateSaleResponse {
    success: Boolean!
    sale: Sale
    errors: [Error!]
  }

  type DeleteSaleResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getSale(id: Int!): Sale
    
    getSales(offset: Int!, limit: Int!, order: String!, name: String): [GetSalesResponse!]!

    getSalesWithoutInvoice(name: String!): [GetSalesWithoutInvoiceResponse!]!

    getSalesWithInvoice: [GetSalesWithInvoiceResponse!]!
  }

  type Mutation {
    createSale(name: String!, deadline: Date!, status: String!, description: String,
      customerId: Int!): CreateUpdateSaleResponse!
    
    updateSale(id: Int!, name: String, deadline: Date, status: String, description: String, 
      ,customerId: Int): CreateUpdateSaleResponse!

    deleteSale(id: Int!): DeleteSaleResponse!
  }

`
