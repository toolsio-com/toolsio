import gql from 'graphql-tag'

// const fragments = gql`
//   fragment ProjectsPageProject on Project {
//     id
//     name 
//     deadline
//     status
//     progress
//     description
//     customer {
//       id
//       name
//     }
//   }
// `

export const GET_PROJECTS_QUERY = gql`
  query {
    getProjects {
      id
      name 
      deadline
      status
      progress
      description
      customer {
        id
        name
      }       
      user {
        firstName
      }
    }
  }
`

export const GET_PROJECT_QUERY = gql`
  query getProject($id: Int!) {
    getProject(id: $id) {
      id
      name 
      deadline
      status
      progress
      description
      customer {
        id
        name
      } 
      tasks {
        id
        name
        hours
        paymentType
        price
        vat
        projectId
      }
      user {
        firstName
      }
    }
  }
`

export const GET_CUSTOMERS_PROJECTS_QUERY = gql`
  query {
    getCustomers {
      id
      name
    }
    getProjects {
      id
      name 
      deadline
      status
      progress
      description
      customer {
        id
        name
      } 
    }
  }
`

export const CREATE_PROJECT_MUTATION = gql`
  mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $customerId: Int!) {
    createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, customerId: $customerId) {
      success
      id
      name 
      deadline
      status
      progress
      description
      customer {
        id
        name
      } 
      errors {
        path
        message
      }
    }
  }
`

export const UPDATE_PROJECT_MUTATION = gql`
  mutation updateProject($id: Int!, $status: String, $progress: Int) {
    updateProject(id: $id, status: $status, progress: $progress) {
      success
      id
      name 
      deadline
      status
      progress
      description
      customer {
        id
        name
      } 
      errors {
        path
        message
      }
    }
  }
`

export const DELETE_PROJECT_MUTATION = gql`
  mutation deleteProject($id: Int!) {
    deleteProject(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`
