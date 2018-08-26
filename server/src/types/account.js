export default `

  type Account {
    id: Int!
    owner: User!
    subdomain: String!
    industry: String!
    currencyCode: String!
    companyId: String
    phoneNumber: String
    email: String
    street: String
    postalCode: String
    region: String
    country: String
    logoUrl: String
  }

  type UpdateAccountResponse {
    success: Boolean!
    account: Account
    errors: [Error!]
  }

  type DeleteAccountResponse {
    success: Boolean!
    errors: [Error!]
  }

  type S3SignLogoResponse {
    signedRequest: String!
    url: String!
    errors: [Error!]
  }

  type Query {
    getAccount(subdomain: String!): Account
    
    getAccounts: [Account!]!
  }

  type Mutation {
    updateAccount(subdomain: String! industry: String, currencyCode: String, companyId: String, phoneNumber: String, email: String, street: String, postalCode: 
    String, region: String, country: String, logoUrl: String): UpdateAccountResponse!

    deleteAccount(subdomain: String!): DeleteAccountResponse!

    s3SignLogo(fileName: String!, fileType: String!): S3SignLogoResponse!
  }

`