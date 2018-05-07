import gql from 'graphql-tag'

export const CREATE_ITEM_MUTATION = gql`
  mutation createItem($name: String!, $unit: String!, $quantity: Int!, $price: Float!, $vat: Int!, $saleId: Int!) {
    createItem(name: $name, unit: $unit, quantity: $quantity, price: $price, vat: $vat, saleId: $saleId) {
      success
      item {
        id
        name
        unit
        quantity
        price
        vat
        saleId
      }
      errors {
        path
        message
      }
    }
  }
`
export const UPDATE_ITEM_MUTATION = gql`
  mutation updateItem($id: Int!, $name: String!, $unit: String!, $quantity: Int!, $price: Float!, $vat: Int!, $saleId: Int!) {
    updateItem(id: $id, name: $name, unit: $unit, quantity: $quantity, price: $price, vat: $vat, saleId: $saleId) {
      success
      item {
        id
        name
        unit
        quantity
        price
        vat
        saleId
      }
      errors {
        path
        message
      }
    }
  }
`

export const DELETE_ITEM_MUTATION = gql`
  mutation deleteItem($id: Int!) {
    deleteItem(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`