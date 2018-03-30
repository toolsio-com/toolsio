export default `

  type Task {
    id: Int!
    name: String!
    hours: String!
    paymentType: String!
    price: Float!
    vat: Int
    projectId: Int!
  }

  type CreateTaskResponse {
    success: Boolean!
    task: Task 
    errors: [Error!]
  }

  type Query {
    getTask(id: Int!): Task!
    getTasks: [Task!]!
  }

  type Mutation {
    createTask(name: String!, hours: String!, paymentType: String!, price: Float!, 
      vat: Int!, projectId: Int!): CreateTaskResponse!
  }

`