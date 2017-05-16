import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { createSale, fetchSale, updateSale } from '../../actions/saleActions'
import FormField from '../../utils/FormField'

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

// JS semantic
//import { Dropdown, Input } from 'semantic-ui-react'

class SaleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.sale ? this.props.sale._id : null,
      name: this.props.sale ? this.props.sale.name : '',
      date: this.props.sale ? moment(this.props.sale.date) : moment(),
      status: this.props.sale ? this.props.sale.status : '',
      description: this.props.sale ? this.props.sale.description : '',
      errors: {},
      isLoading: false,
      done: false 
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.sale._id,
      name: nextProps.sale.name,
      date: moment(nextProps.sale.date),
      status: nextProps.sale.status,
      description: nextProps.sale.description
    })
  }

  componentDidMount = () => {
    if (this.props.match.params._id) {
      this.props.fetchSale(this.props.match.params._id)
    } else {}
  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form states to local varibale
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateSaleInput(this.state)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid) { 
      this.setState({ isLoading: true })

      if (this.state._id) {
        this.props.updateSale(this.state).then(
          () => { this.setState({ done: true }) },
          ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) )   
      } else {        
        this.props.createSale(this.state).then(
          () => { this.setState({ done: true }) },
          ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) )   
      }
    }
  }

  handleChangeDate(date) {
    this.setState({
      date: date
    });
  } 

  render() {
    const { name, date, status, description, errors, isLoading, done } = this.state
    
    //const statusOptions = [ { key: 'new', value: 'new', text: 'NEW' },
    //    { key: 'in progress', value: 'in progress', text: 'IN PROGRESS' },
    //    { key: 'ready', value: 'ready', text: 'READY' } ,
    //    { key: 'delivered', value: 'delivered', text: 'DELIVERED' } ]
    
    const form = (
      <div>
        <h1 className="ui header">Create new Sale</h1>
        <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

          { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }

          <FormField
            label="Name"
            name="name" 
            value={name} 
            onChange={this.handleChange.bind(this)} 
            placeholder="Name"
            error={errors.name}
          />
          <div  className={classnames("field", { error: !!errors.date })}>
            <label className="" htmlFor="date">Date:</label>
            <DatePicker
              dateFormat="DD/MM/YYYY"
              selected={date}
              onChange={this.handleChangeDate.bind(this)}
            />
            <span>{errors.password}</span>
          </div>
          
          <FormField
            formType="select"
            label="status"
            name="status"
            type="select"
            value={status} 
            onChange={this.handleChange.bind(this)} 
            error={errors.status}

            options={[
              <option key="default" value="" disabled>Set Status</option>,
              <option key="new" value="new">NEW</option>,
              <option key="in progress" value="in progress">IN PROGRESS</option>,
              <option key="ready" value="ready">READY</option>,
              <option key="delivered" value="delivered">DELIVERED</option>
              ]
            }
          />

          {/*
          <div className={classnames("field", { error: !!error.status })}>
            <label htmlFor="status">Status</label>
            <Dropdown 
              placeholder='Status' 
              search selection options={statusOptions}   
              value={status} 
              onChange={this.handleChange.bind(this)} 
              error={errors.status} />
          </div>      
          */}
          <FormField
            formType="textarea"
            label="Description"
            name="description" 
            value={description} 
            onChange={this.handleChange.bind(this)} 
            placeholder="Description"
          />

          <div className="filed">    
            <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;Add Sale</button>
          </div>  
        </form> 
      </div>
    )

    return (  
      <div>            
        { done ? <Redirect to="/sales" /> : form }  
      </div>  
    )
  }
}

SaleForm.propTypes = {
  createSale: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params._id) {
    return {
      sale: state.sales.find(item => item._id === match.params._id)
    }
  } 
  return { sale: null }
}

export default connect(mapStateToProps, { createSale, fetchSale, updateSale })(SaleForm)

