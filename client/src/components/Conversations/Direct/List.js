import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Label, Button, Modal } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import { GET_USERS_WITH_UNREAD_MESSAGES_COUNT_QUERY } from '../../../graphql/directMessages'

// Localization 
import T from 'i18n-react'

// jQuery
import $ from 'jquery'

// Downshift
import UserDropdownSearchSelection from './Form/UserDropdownSearchSelection'

const AddUserModal = ({ open, onClose }) => (
  <Modal
    className="ui small modal add-user"
    open={open}
    onClose={(e) => {
      onClose(e)
    }}
  >
    <Modal.Header>{T.translate("conversations.messages.add_user")}</Modal.Header>
    <Modal.Content>
      <UserDropdownSearchSelection onClose={onClose} />
    </Modal.Content>
    <Modal.Actions>
      <Button
        onClick={(e) => {
          onClose(e)
        }}
      >
        {T.translate("conversations.form.cancel")}
      </Button>
     </Modal.Actions>
  </Modal>
)

class List extends Component {

  state = {
    openAddUserModal: false
  }

  componentDidMount() {
    $('.ui .item').on('click', function() {
      $('.ui .item').removeClass('active')
      $(this).addClass('active')
    })  
  }

  toggleAddUserModal = (e) => {
    if (e) {
      e.preventDefault()  
    }
    
    this.setState(state => ({ openAddUserModal: !state.openAddUserModal }))
  }

  render() {    
    const { openAddUserModal } = this.state

    const { data: { getDirectMessageUsersWithUnreadMessagesCount }, receiverId } = this.props

    const userList = getDirectMessageUsersWithUnreadMessagesCount && getDirectMessageUsersWithUnreadMessagesCount.usersUnreadDirectMessagesCount.map(item => 
      <Link key={item.sender_id} to={`/conversations/receiver/${item.sender_id}`} 
        className={classnames('item', {active: receiverId && parseInt(receiverId) === item.sender_id})}>

        { item.count !== 0 &&
          <Label className="red">
            {item.count}
          </Label>
        }

        <div>
          <i className="user icon"></i>&nbsp;
          {item.user.firstName}
        </div>
      </Link>
    )

    return [
      <div key="user-list">
        <div className="ui center aligned vertical segment">
          <button id="add-user" className="ui primary button" onClick={this.toggleAddUserModal.bind(this)}>
            <i className="add circle icon"></i>
            {T.translate("conversations.messages.add_user")}
          </button>  
        </div>

        { userList }

      </div>,
      <AddUserModal
        onClose={this.toggleAddUserModal.bind(this)}
        open={openAddUserModal}
        key="add-user-modal"
      />
    ]
  }
}

export default graphql(GET_USERS_WITH_UNREAD_MESSAGES_COUNT_QUERY)(List)



