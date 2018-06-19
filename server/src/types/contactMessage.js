export default `

  type ContactMessage {
    name: String!
    email: String!
    messageBody: String! 
  }

  type CreateContactResponse {
    success: Boolean
    error: String
  }

  type Mutation {
    createContactMessage(name: String, email: String!, messageBody: String!): CreateContactResponse!
  }

`
