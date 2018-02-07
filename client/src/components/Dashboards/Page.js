import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Localization 
import T from 'i18n-react'

// React-vis style 
import 'react-vis/dist/styles/plot.scss'
import 'react-vis/dist/styles/legends.scss'

import Breadcrumb from '../Layouts/Breadcrumb'

import TotalIncomeCard from './TotalIncomeCard'
import IncomesCard from './IncomesCard'
import ProjectsCard from './ProjectsCard'
import SalesCard from './SalesCard'
import CustomersCard from './CustomersCard'
import InvoicesCard from './InvoicesCard'
import ProjectTasks from './ProjectTasks' 
import SaleTasks from './SaleTasks' 
import InvoiceTasks from './InvoiceTasks' 

class Page extends Component {

  render() {
    
    const { totalIncome, projectTasks, saleTasks, invoiceTasks } = this.props

    return ( 
      <div className="row column">  

        <Breadcrumb />

        <div className="ui four column grid">
          <div className="column dashboards">
            <TotalIncomeCard />
          </div>
          <div className="column dashboards">
            <IncomesCard />
          </div>
          <div className="column dashboards">
            <ProjectsCard />
          </div>
          <div className="column dashboards">  
            <SalesCard />
          </div>
        </div>

        <div className="ui two column grid">
          <div className="four wide column dashboards">
            <CustomersCard />
          </div>
          <div className="twelve wide column dashboards">
            <InvoicesCard /> 
          </div>
        </div>

        <div className="ui three column grid">
          <div className="column">
            <ProjectTasks />
          </div>
          <div className="column">
            <SaleTasks />
          </div>
          <div className="column">
            <InvoiceTasks />
          </div>
        </div>

      </div>  
    )
  }  
}

export default Page

