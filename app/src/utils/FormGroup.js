import React, { Component } from 'react' 
import classnames from 'classnames'

const FormGroup = ({ type, field, value, label, error, placeholder, onChange, checkUserExists}) => {
  return (
    <div className={classnames("form-group", { 'has-error': error })}>
      <label className="control-label">{label}</label>
      <input 
        className="form-control" 
        type={type}
        name={field} 
        value={value} 
        onChange={onChange} 
        onBlur={checkUserExists}
        placeholder={placeholder} 
      />
      { error && <span className="help-block">{error}</span>}
    </div>
  )
}

FormGroup.propTypes = {  
  type: React.PropTypes.string.isRequired, 
  field: React.PropTypes.string.isRequired, 
  value: React.PropTypes.string.isRequired, 
  label: React.PropTypes.string.isRequired, 
  error: React.PropTypes.string, 
  placeholder: React.PropTypes.string.isRequired, 
  onChange: React.PropTypes.func.isRequired,
  checkUserExists: React.PropTypes.func
}

FormGroup.defaultProps = {
  type: 'text'
}

export default FormGroup