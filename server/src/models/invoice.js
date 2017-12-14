import mongoose from 'mongoose'

import Customer from'./customer'
import Project from'./project'
import Sale from'./sale'
import Task from'./task'
import Item from'./item'

let invoiceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "customer", required: [true, "Customer is required."] },
  deadline: { type: Date, validate: { validator: deadlinePaymentTermValidator, message: 'Select either Deadline or Payment term.'} },
  paymentTerm: { type: Number, validate: { validator: deadlinePaymentTermValidator, message: 'Select either Deadline or Payment term.'} },
  interestInArrears: { type: Number, required: [true, "Interset in arrears is required."] },
  status: { type: String, required: [true, "Status is required."] },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: "project", validate: { validator: saleProjectValidator, message: 'Select either Sale or Project.'} },
  sale: { type: mongoose.Schema.Types.ObjectId, required: false, default: null, ref: "sale", validate: { validator: saleProjectValidator, message: 'Select either Sale or Project.'} },
  referenceNumber: { type: String, required: true },

  createdAt: { type: Date },
  updatedAt: {type: Date }
})

invoiceSchema.pre('save', function(next) {
  let now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }

  next()
})

invoiceSchema.pre('validate', async function(next) {

  if (this.sale) {
    let sale = await getSaleById(this.sale)

    this.customer = sale.customer
    this.referenceNumber = this.sale +'-'+ this.customer 
  } 

  if (this.project) {    
    let project = await getProjectById(this.project)

    this.customer = project.customer
    this.referenceNumber = this.project +'-'+ this.customer
  }

  // Set initial value
  this.status = "pending"
  
  next()
})

invoiceSchema.post('save', function(doc, next) {
  
  // Push invoice to related Customer object
  Customer.findByIdAndUpdate(this.customer, { $push: { invoices: this._id }}, { new: true }, function(err, customer) {
    if (err) {
      errors: {
        cantUpdateCustomer: {
          message: err
        } 
      }
    }
  })

  // Push Invoice to related Sale object
  Sale.findByIdAndUpdate(this.sale, { invoice: this._id }, { new: true }, function(err, sale) {
    if (err) {
      errors: {
        cantUpdateSale: {
          message: err
        } 
      }
    }
  })

  // Push Invoice to related Projectr object
  Project.findByIdAndUpdate(this.project, { invoice: this._id }, { new: true }, function(err, project) {
    if (err) {
      errors: {
        cantUpdateProject: {
          message: err
        } 
      }
    }
  })

  next()
})

function getSaleById(id) {
  return Sale.findById(id)
}

function getProjectById(id) {
  return Project.findById(id)
}

function saleProjectValidator() {
  if (this.sale && this.project) {
    return false
  } else if (this.sale && !this.project) {
    this.project = null
    return true
  } else if (!this.sale && this.project) {
    this.sale = null
    return true
  } else {
    return true
  }
}

function deadlinePaymentTermValidator() {
  if (this.deadline && this.paymentTerm) {
    return false
  } else if (!this.deadline && !this.paymentTerm) {
    return false
  } else {
    return true
  }
}

invoiceSchema.methods.allUnpaidInvoicesByStatus = function() {

}

invoiceSchema.methods.unpaidInvoicesByInvitedUsers = function() {

}

let Invoice = module.exports = mongoose.model('invoice', invoiceSchema)
