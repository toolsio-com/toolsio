import React, { Component } from 'react' 
require('babel-polyfill')
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Dropzone from 'react-dropzone'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

import moment from 'moment'

// Modal
$.fn.dimmer = require('semantic-ui-dimmer')

// Country region selector 
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'


// Images
import logoPlaceholderMedium from '../../images/logo-placeholder.svg'

class AccountForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getAccount ? this.props.data.getAccount.id : null,
      subdomain: this.props.data.getAccount ? this.props.data.getAccount.subdomain : '',
      logoUrl: this.props.data.getAccount ? this.props.data.getAccount.logoUrl : '',
      industry: this.props.data.getAccount ? this.props.data.getAccount.industry : '',
      address: {
        street: this.props.data.getAccount ? this.props.data.getAccount.street: '',
        postalCode: this.props.data.getAccount ? this.props.data.getAccount.postalCode : '',
        region: this.props.data.getAccount ? this.props.data.getAccount.region : '',
        country: this.props.data.getAccount ? this.props.data.getAccount.country : ''
      },
      contact: {
        phoneNumber: this.props.data.getAccount ? this.props.data.getAccount.phoneNumber : '',
        email: this.props.data.getAccount ? this.props.data.getAccount.email : ''
      },
      file: null,
      errors: {},
      isLoadingLogo: false,
      isLoadingForm: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getAccount) {
      this.setState({
        id: nextProps.data.getAccount.id,
        subdomain: nextProps.data.getAccount.subdomain,
        logoUrl: !nextProps.data.getAccount.logoUrl ? '' : nextProps.data.getAccount.logoUrl,
        industry: nextProps.data.getAccount.industry,
        address: {
          street: !nextProps.data.getAccount.street ? '' : nextProps.data.getAccount.street,
          postalCode: !nextProps.data.getAccount.postalCode ? '' : nextProps.data.getAccount.postalCode,
          region: !nextProps.data.getAccount.region ? '' : nextProps.data.getAccount.region,
          country: !nextProps.data.getAccount.country ? '' : nextProps.data.getAccount.country
        },
        contact: {
          phoneNumber: !nextProps.data.getAccount.phoneNumber ? '' : nextProps.data.getAccount.phoneNumber,
          email: !nextProps.data.getAccount.email ? '' : nextProps.data.getAccount.email
        }
      })
    }
  }
  
  componentDidMount() {

    $('.ui.card .image').dimmer({
      on: 'hover'
    })
  }

  handleChange = (e) => {
  
    if (!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      if (e.target.name === "email" || e.target.name === "phoneNumber") {

         this.setState({
          contact: { ...this.state.contact, [e.target.name]: e.target.value },
          errors
        })
      } else if (e.target.name === "street" || e.target.name === "postalCode" || e.target.name === "region"
        || e.target.name === "country") {

         this.setState({
          address: { ...this.state.address, [e.target.name]: e.target.value },
          errors
        })
      } else {
        this.setState({
          [e.target.name]: e.target.value,
          errors
        })
      }
    } else {

      if (e.target.name === "email" || e.target.name === "phoneNumber") {

         this.setState({
          contact: { ...this.state.contact, [e.target.name]: e.target.value },
        })
      } else if (e.target.name === "street" || e.target.name === "postalCode" || e.target.name === "region"
        || e.target.name === "country") {
        
         this.setState({
          address: { ...this.state.address, [e.target.name]: e.target.value }
        })
      } else {
        this.setState({
          [e.target.name]: e.target.value
        })
      }

    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateAccountInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
     const { id, name, subdomain, contact: {phoneNumber, email} , logoUrl, address: { street, postalCode, region, country} } = this.state

      this.setState({ isLoading: true })
      
      if (id) {
        this.props.updateAccountMutation({variables: { id, name, subdomain, phoneNumber, email, logoUrl, street, postalCode: parseInt(postalCode), region, country } })
          .then(res => {

            const { success, errors } = res.data.updateAccount
           
            if (success) {
              // this.props.addFlashMessage({
              //   type: 'success',
              //   text: T.translate("account.form.success_update_account")
              // })
              this.setState({ isLoading: false })
            } else {
              let errorsList = {}
              errors.map(error => {
                
                if (error.path === 'phoneNumber' || error.path === 'email') {
                  errorsList['contact'] = {...errorsList['contact'], [error.path]: error.message }
                } else if (error.path === 'street' || error.path === 'postalCode' || error.path === 'region' || error.path === 'country') {
                  errorsList['address'] = {...errorsList['address'], [error.path]: error.message }
                } else {
                  errorsList[error.path] = error.message
                }
              })
              this.setState({ errors: errorsList, isLoading: false })
            }
           
          })
          .catch(err => this.setState({ errors: err, isLoading: false }))
      }   
    }
  }

  selectCountry (val) {
    let updatedAddress = Object.assign({}, this.state.address)
    updatedAddress["country"] = val
    this.setState({ address: updatedAddress })
  }

  selectRegion (val) {
    let updatedAddress = Object.assign({}, this.state.address)
    updatedAddress["region"] = val
    this.setState({ address: updatedAddress })
  }

  // Save File to S3
  uploadLogo = (signedRequest, file, options) => {
    return axios.put(signedRequest, file, options)
  }

  s3SignLogo = (variables) => {
    return axios.post('/accounts/logo', variables)
  }

  uploadToS3 = async (url, file, signedRequest) => {

    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    
    const uploadLogoResponse = await this.props.uploadLogo(signedRequest, file, options)

    if (uploadLogoResponse.status === 200) {
      this.setState({
        logoUrl: url
      })

      const { subdomain, logoUrl } = this.state
      
     this.props.updateAccountMutation({variables: { subdomain, logoUrl } })
      .then(res => {

        const { success, errors } = res.data.updateAccount
       
        if (success) {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("account.form.success_update_account")
          // })
          this.setState({ isLoadingLogo: false })
        } else {
          let errorsList = {}
          errors.map(error => {
            
            if (error.path === 'phoneNumber' || error.path === 'email') {
              errorsList['contact'] = {...errorsList['contact'], [error.path]: error.message }
            } else if (error.path === 'street' || error.path === 'postalCode' || error.path === 'region' || error.path === 'country') {
              errorsList['address'] = {...errorsList['address'], [error.path]: error.message }
            } else {
              errorsList[error.path] = error.message
            }
          })
          this.setState({ errors: errorsList, isLoadingLogo: false })
        }
       
      })
      .catch(err => this.setState({ errors: err, isLoadingLogo: false }))
    }
  }

  formatFileName = filename => {
    const date = moment().format("DDMMYYYY")
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const newFileName = `logos/${date}-${randomString}-${cleanFileName}`
    return newFileName.substring(0, 60)
  }

  handleOnDrop = async files => {

    this.setState({
      'file': files[0]
    })
  }

  handleSubmitImage = async () => {
    const { subdomain, file } = this.state
    const response = await this.props.s3SignLogo({
      variables: {
        filename: this.formatFileName(file.name),
        filetype: file.type
      }
    })

    const { signedRequest, url } = response.data.result
    await this.uploadToS3(url, file, signedRequest)
  }

  render() {
    const { id, subdomain, industry, logoUrl, contact, address, errors, isLoadingLogo, isLoadingForm } = this.state

    return ( 

      <div className="twelve wide column"> 
        <div className="ui items segment account">
          <div className="ui item">    
            <div className="image">
              <div className={classnames("ui card form", { loading: isLoadingLogo })}>
                <div className="blurring dimmable image">
                  <div className="ui dimmer">
                    <div className="content">
                      <div className="center">
                        <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui inverted button">
                          {T.translate("account.page.select_logo")}
                        </Dropzone>
                      </div>
                    </div>
                  </div>
                  <img className="ui rounded image" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
                </div>
              </div>

              <button disabled={isLoadingLogo} className="fluid ui primary button" onClick={this.handleSubmitImage.bind(this)}><i className="upload icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.upload")}</button>
            </div>
            <div className="content">
              <h1 className="ui header mt-2 mb-3">{T.translate("account.page.account")}</h1>
              
              <form className={classnames("ui form", { loading: isLoadingForm })} onSubmit={this.handleSubmit.bind(this)}>

                { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

                <InputField
                  label={T.translate("account.page.subdomain")}
                  name="subdomain" 
                  value={subdomain} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder="Name"
                  error={errors && errors.subdomain}
                  formClass="field"
                />
                <SelectField
                  type="select"
                  name="industry"
                  value={industry ? industry : '-'} 
                  label={T.translate("account.page.industry")}
                  onChange={this.handleChange.bind(this)} 
                  error={errors && errors.industry}
                  formClass="field"

                  options={[
                    <option key="default" value="" disabled>{T.translate("account.page.select_industry")}</option>,
                    <option key="human resource" value="human resource">Human resource</option>,
                    <option key="fashion" value="fashion">Fashion</option>,
                    <option key="import/export" value="import/export">Import/Export</option>,
                    <option key="store" value="store">Store</option>,
                    <option key="technology" value="technology">Technology</option>
                    ]
                  }
                />
                 <fieldset className="custom-fieldset">
                  <legend className="custom-legend">{T.translate("account.page.contact.header")}</legend>
                  <InputField
                    label={T.translate("account.page.contact.phone_number")}
                    name="phoneNumber" 
                    value={contact.phoneNumber} 
                    onChange={this.handleChange.bind(this)} 
                    placeholder="Phone number"
                    error={errors.contact && errors.contact.phoneNumber}
                    formClass="field"
                  />
                  <InputField
                    label={T.translate("account.page.contact.email")}
                    name="email" 
                    value={contact.email} 
                    onChange={this.handleChange.bind(this)} 
                    placeholder="Email"
                     error={errors.contact && errors.contact.email}
                    formClass="field"
                  />
                </fieldset>
                <fieldset className="custom-fieldset">
                  <legend className="custom-legend">{T.translate("account.page.address.header")}</legend>
                  <InputField
                    label={T.translate("account.page.address.street")}
                    name="street" 
                    value={address.street} 
                    onChange={this.handleChange.bind(this)} 
                    placeholder="Street"
                    error={errors.address && errors.address.street}
                    formClass="field"
                  />
                <InputField
                  label={T.translate("account.page.address.postal_code")}
                  name="postalCode" 
                  value={address.postalCode} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder="Postal code"
                  error={errors.address && errors.address.postalCode}
                  formClass="field"
                />
                <div className={classnames("field", {error: errors['address.country']})}>              
                  <label>{T.translate("account.page.address.country")}</label>
                  <CountryDropdown
                    defaultOptionLabel={T.translate("account.page.address.select_country")}
                    value={address.country}
                    onChange={(val) => this.selectCountry(val)} 
                    error={errors.address && errors.address.country} />
                  
                  <span className={classnames({red: errors.address && errors.address.country})}>{errors.address && errors.address.country}</span>  
                </div> 
                <div className={classnames("field", {error: address.country !== '' && errors['address.region']})}>              
                  <label>{T.translate("account.page.address.region")}</label> 
                  <RegionDropdown
                    defaultOptionLabel={T.translate("account.page.address.select_region")}
                    disabled={address.country === ''}
                    country={address.country}
                    value={address.region}
                    onChange={(val) => this.selectRegion(val)} 
                     error={errors.address && errors.address.region} />
                  
                  <span className={classnames({red: address.region !== '' && errors.address && errors.address.region})}>{errors.address && errors.address.region}</span>  
                </div>
                
              </fieldset>

              <div className="field">  
                <Link className="ui primary outline button" to="/dashboard">
                  <i className="minus circle icon"></i>
                  {T.translate("account.page.cancel")}
                </Link>  
                <button disabled={isLoadingForm} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.edit")}</button>
              </div>  
            </form>   
          </div>

        </div> 
      </div>   
    </div>

    )
  }
}

const getAccountQuery = gql`
  query getAccount($subdomain: String!) {
    getAccount(subdomain: $subdomain) {
      id
      subdomain
      industry
      email
      phoneNumber
      street
      postalCode
      region
      country
      logoUrl
    }
  }
`

const updateAccountMutation = gql`
  mutation updateAccount($id: Int!, $subdomain: String!, $industry: String, $email: String!, $phoneNumber: String!, $logoUrl: String, $street: String, $postalCode: String, $region: String, $country: String) {
    updateAccount(id: $id, name: $subdomain, subdomain: $industry, industry: $email, phoneNumber: $phoneNumber, logoUrl: $logoUrl, street: $street, postalCode: $postalCode, region: $region, country: $country) {
      success
      account {
        id
        subdomain
      }
      errors {
        path
        message
      }
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(updateAccountMutation, {
    name : 'updateAccountMutation',
    options: (props) => ({
      variables: {
        subdomain: props.subdomain
      },
    })
  }),
  graphql(getAccountQuery, {
    options: (props) => ({
      variables: {
        subdomain: props.subdomain
      },
    })
  })
)(AccountForm)

export default MutationsAndQuery


