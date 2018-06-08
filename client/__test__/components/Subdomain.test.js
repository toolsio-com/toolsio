import 'raf/polyfill'

import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Configure Adapter
configure({ adapter: new Adapter() })

// Components 
import Subdomain from '../../components/Login/Subdomain'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, props, component, wrapper

describe("components", function() { 
   
  describe("<Subdomain />", function() {  

    beforeEach(() => {
      const storeStateMock = {}

      store = mockStore(storeStateMock)

      props = {
        isSubdomainExist: jest.fn(),
        addFlashMessage: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Subdomain {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Subdomain).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Subdomain).prop('isSubdomainExist')).toEqual(props.isSubdomainExist)
      expect(wrapper.find(Subdomain).prop('addFlashMessage')).toEqual(props.addFlashMessage)
    })

  })


})
