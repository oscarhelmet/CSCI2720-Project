import React from 'react';
import EventCRUD from './EventCRUD';
import UserCRUD from './UserCRUD';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      users: [],
      currentEntity: 'Event',
    };
    this.toggleEntity = this.toggleEntity.bind(this);
  }

  // Method should be bound in the constructor or defined as an arrow function
  toggleEntity() {
    this.setState(prevState => ({
      currentEntity: prevState.currentEntity === 'Event' ? 'User' : 'Event',
    }));
  }


  render() {
    const { currentEntity } = this.state;
    const CRUDComponent = currentEntity === 'Event' ? EventCRUD : UserCRUD;
    return (
      <div className="container mt-5">
        <h2>Admin Dashboard</h2>
        <br />


        <button onClick={this.toggleEntity} className="btn btn-warning">
          Switch to {currentEntity === 'Event' ? 'User' : 'Event'}
        </button>
        <br /><br />
        <h3>Now Editing: {currentEntity}</h3>
        <CRUDComponent />


        <br/>

      </div>
    );
  }

}

export default AdminPage;