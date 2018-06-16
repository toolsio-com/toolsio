export default `

  type Event {
    id: Int!
    title: String!
    description: String!
    url: String!
    start: Date!
    end: Date!
  }

  type CreateUpdateEventResponse {
    success: Boolean!
    event: Event 
    errors: [Error!]
  }

  type DeleteEventResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getEvent(id: Int!): Event!
    
    getEvents: [Event!]!
  }

  type Mutation {
    createEvent(title: String!, description: String!, url: String!, start: Date!, end: Date!): CreateUpdateEventResponse!

    updateEvent(id: Int!, title: String, description: String, url: String, start: Date, end: Date): CreateUpdateEventResponse!

    deleteEvent(id: Int!): DeleteEventResponse!
  }

`
