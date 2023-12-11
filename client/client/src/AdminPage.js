import React from 'react';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      users: [],
      currentEntity: 'Event',
    };
    
    // Binding methods to `this`
    this.toggleEntity = this.toggleEntity.bind(this);
    this.createEvent = this.createEvent.bind(this);
    // ... bind the rest of your CRUD methods similarly

    this.logOut = this.logOut.bind(this);
  }

  // Method should be bound in the constructor or defined as an arrow function
  toggleEntity() {
    this.setState(prevState => ({
      currentEntity: prevState.currentEntity === 'Event' ? 'User' : 'Event',
    }));
  }

  // CRUD operations would go here. For now, these are just placeholders.
  createEvent() { /* ... */ }
  readEvents() { /* ... */ }
  updateEvent() { /* ... */ }
  deleteEvent() { /* ... */ }

  createUser() { /* ... */ }
  readUsers() { /* ... */ }
  updateUser() { /* ... */ }
  deleteUser() { /* ... */ }

  logOut() {
    // Handle logout logic, such as clearing the session
    this.props.history.push('/login');
  }
  
  // You might need to define this method if used in your form
  loadEventData() {
    // Logic to load event data
  }

  render() {
    const { currentEntity } = this.state;
      return (
        <div className="container mt-5">
          <h2>Admin Dashboard</h2>
          <br />
          <br />

          <button onClick={this.toggleEntity} className="btn btn-danger">
            Switch to {currentEntity === 'Event' ? 'User' : 'Event'}
          </button>
          <br />
          <h3>Now Editing: {currentEntity}</h3>
          <br />
          {/* Event and User CRUD interfaces */}

          <br />
          <br />
          {/* createEvent */}
          <div class="container px-4 p-3 border bg-light">

            <form id="myForm">
              <fieldset>
                <legend> Create </legend>
                <p>Click the submit button to send a request to the server</p>
                <div class="mb-3">
                  <label class="form-label" for="EventName">Event Name:</label>
                  <input class="form-control" type="text" id="EventName" name="EventName" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="locationID">Location ID:</label>
                  <input class="form-control" type="number" id="locationID" name="locationID" />
                </div>
                <div class="mb-3">
                  <label class="form-label" for="eventQuota">Event Quota:</label>
                  <input class="form-control" type="number" id="eventQuota" name="eventQuote" />
                  <button type="submit" class="btn btn-primary">Create</button>
                </div>
              </fieldset>
            </form>

          </div>
          <br />
          <br />

          {/* readEvents */}
          <div class="container px-4 p-3 border bg-light">
            <form id="check">
              <fieldset>
                <legend> Check Event: </legend>
                <p>Click the submit button to send a request to the server</p>
                <div class="mb-3">
                  <label class="form-label" for="EventID">Event ID:</label>
                  <input class="form-control" type="number" id="EventID" name="EventID" />
                </div>
                <button type="submit" class="btn btn-primary">Check</button>
              </fieldset>
            </form>
          </div>
          <br />
          <br />

          {/* Update Event */}

          <div class="container px-4 p-3 border bg-light">
            <legend> Update Event</legend>
            <form id="update-event-form">
              <input class="form-control" type="number" id="eventID" name="eventID" placeholder="Event ID" required />
              <br />
              <button type="button" onclick="loadEventData()" class="btn btn-primary">Load Event Data</button>
              <br />
              <br />
              <input class="form-control" type="text" id="name" name="name" placeholder="Event Name" required />
              <br />
              <input class="form-control" type="number" id="locID" name="locID" placeholder="Location ID" required />
              <br />
              <input class="form-control" type="number" id="quota" name="quota" placeholder="Quota" required />
              <br />
              <button class="form-control" type="submit" class="btn btn-primary">Update Event</button>
            </form>
          </div>

          <br />
          <br />
          {/* Delete Event */}
          <div class="container px-4 p-3 border bg-light">
            <form id="delete-event-form">
              <legend>Problem 4) Delete Event: </legend>
              <div class="mb-3">
                <label class="form-label" for="event-id">Event ID:</label>
                <input class="form-control" type="number" id="event-id" name="event-id" required />
              </div>
              <button type="submit" class="btn btn-primary">DELETE </button>
            </form>
          </div>

          <br />
          <br />

          <button onClick={this.logOut} className="btn btn-danger">Log Out</button>

        </div>
      );
    }

  }

export default AdminPage;