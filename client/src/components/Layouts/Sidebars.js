import React from 'react'
import { Route, Link } from 'react-router-dom'
import decode from 'jwt-decode'
import { Sidebar, Menu } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

// Images
import logoPlaceholderMedium from '../../images/logo-placeholder.svg'

const ActiveLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>
      <i className={icon}></i>
      <span>{label}</span>
    </Link>
  )} />
)

export function InnerSidebar({ visibleInnerSidebar }) {

  let currentUser

  try {
    const authToken = localStorage.getItem('authToken')
    const { account, user } = decode(authToken)

    currentUser = { account, user } 
  } catch(err) {
    console.log('err: ', err)
  }

  return (
    <Sidebar as={Menu} animation='slide along' visible={visibleInnerSidebar} vertical inverted>
        <div className="ui center aligned vertical segment account">
        <Link to="/settings">
          <img className="ui centered tiny rounded image mt-3" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
        </Link>
        <h4 className="capitalize mt-3 mb-0">{currentUser.account}</h4>
        <p className="capitalize mb-2">{currentUser.user.firstName} {currentUser.user.isAdmin ? '(Admin)' : ''}</p>
      </div>
      <ActiveLink activeOnlyWhenExact to="/dashboard" icon="dashboard icon" label={T.translate("dashboard.header")} />
      <ActiveLink activeOnlyWhenExact to="/projects" icon="suitcase icon" label={T.translate("projects.page.header")} />
      <ActiveLink activeOnlyWhenExact to="/sales" icon="cart icon" label={T.translate("sales.page.header")} />
      <ActiveLink activeOnlyWhenExact to="/customers" icon="users icon" label={T.translate("customers.page.header")}/>
      <ActiveLink activeOnlyWhenExact to="/invoices" icon="file text outline icon" label={T.translate("invoices.page.header")}/>
      <ActiveLink activeOnlyWhenExact to="/users" icon="user icon" label={T.translate("users.page.header")}/>
      <ActiveLink activeOnlyWhenExact to="/events" icon="calendar alternate icon" label={T.translate("events.page.header")}/>
    </Sidebar>)
}


export function OuterSidebarScrollableHeader({ visibleOuterSidebar }) {
  return [
    <Sidebar key="sidebar" as={Menu} animation='overlay' width='thin' visible={visibleOuterSidebar} vertical inverted>
      <ActiveLink activeOnlyWhenExact className="active item" to="#home" label={T.translate("landing.home.header")} />
      <ActiveLink activeOnlyWhenExact className="item" to="#features" label={T.translate("landing.features.header")} />
      <ActiveLink activeOnlyWhenExact className="item" to="#clients" label={T.translate("landing.clients.header")} />
      <ActiveLink activeOnlyWhenExact className="item" to="#testimonial" label={T.translate("landing.testimonial.header")} />
      <ActiveLink activeOnlyWhenExact className="item" to="#pricing" label={T.translate("landing.pricing.header")} />
      <ActiveLink activeOnlyWhenExact className="item" to="#contacts" label={T.translate("landing.contacts.header")} />
      <Link className="item" to="/subdomain">{T.translate("log_in.log_in")}</Link>    
      <Link className="item" to="/signup">{T.translate("sign_up.sign_up")}</Link>    
    </Sidebar>,
    <div key="scroll-header-nav" className="ui large top fixed pointing menu hidden">
      <div className="ui container">
        <div className="left menu">
          <ActiveLink activeOnlyWhenExact to="#home" label={T.translate("landing.home.header")} />
          <ActiveLink activeOnlyWhenExact to="#features" label={T.translate("landing.features.header")} />
          <ActiveLink activeOnlyWhenExact to="#clients" label={T.translate("landing.clients.header")} />
          <ActiveLink activeOnlyWhenExact to="#testimonial" label={T.translate("landing.testimonial.header")} />
          <ActiveLink activeOnlyWhenExact to="#pricing" label={T.translate("landing.pricing.header")} />
          <ActiveLink activeOnlyWhenExact to="#contacts" label={T.translate("landing.contacts.header")} />
        </div>
     
        <div className="right menu">
          <div className="item">                     
            <Link className="ui primary outline button"  to="/subdomain">{T.translate("log_in.log_in")}</Link>     
          </div>
          <div className="item">   
            <a href={`${process.env.CLIENT_PROTOCOL}${process.env.CLIENT_URL}/signup`} className="ui primary outline button">{T.translate("sign_up.sign_up")}</a>    
          </div>
        </div>  
      </div>
    </div>]
}
