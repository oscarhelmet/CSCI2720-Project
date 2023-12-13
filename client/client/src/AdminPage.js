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

      <div className="container mt-5 bg-light rounded" id="main-cont">
        <div className="rowl">
          <br />
          <h4><b>Admin Dashboard</b></h4>
          <br />
          <button onClick={this.toggleEntity} className="btn btn-warning rounded-pill">
            Switch to {currentEntity === 'Event' ? <i class="bi bi-person-badge-fill h4"></i> : <i class="bi bi-calendar-week h4"></i>}
          </button>
          <br />

        </div>

        <br /><br />

        <div className="rowr">
          <h3>{currentEntity} Dashboard </h3>
          <CRUDComponent />
        </div>

        <br />

      </div>
    );
  }

}

export default AdminPage;