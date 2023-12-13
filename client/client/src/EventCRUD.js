import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from './Modal';
import './CRUD.css';

class EventCRUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            eventID: '',
            eventVenue: '',
            eventDescription: '',
            eventPresenter: '',
            price: '',
            showCreateModal: false,
            showReadModal: false,
            showUpdateModal: false,
            showDeleteModal: false,
            selectedEventId: null,
            selectedEvent: null,

            events: [ // Dummy event data
                {
                    eventID: '1',
                    eventName: 'Tech Conference',
                    eventVenue: 'V001',
                    eventDescription: 'A conference on the latest in tech.',
                    eventPresenter: 'John Doe',
                    price: '99.99'
                },
                {
                    eventID: '2',
                    eventName: 'Art Workshop',
                    eventVenue: 'V002',
                    eventDescription: 'Hands-on sessions for aspiring artists.',
                    eventPresenter: 'Jane Smith',
                    price: '49.99'
                }]
        };
    }


    toggleModal = (modalKey, eventId = null) => {
        let newState = { [modalKey]: !this.state[modalKey] };


        if (eventId && modalKey === 'showDeleteModal') {
            const event = this.findEventById(eventId);
            this.setState({ selectedEvent: event });

            this.setState((prevState) => ({ [modalKey]: !prevState[modalKey] }));
            return;
        }
        if (eventId && modalKey === 'showUpdateModal') {
            const event = this.findEventById(eventId);
            if (event) {
                newState = {
                    ...newState,
                    selectedEvent: event,
                    eventName: event.eventName,
                    eventID: event.eventID,
                    eventVenue: event.eventVenue,
                    eventDescription: event.eventDescription,
                    eventPresenter: event.eventPresenter,
                    price: event.price,
                };
            }
        } else if (!this.state[modalKey]) {
            // Reset the form if the modal is being closed
            newState = {
                ...newState,
                selectedEvent: null,
                eventName: '',
                eventID: '',
                eventVenue: '',
                eventDescription: '',
                eventPresenter: '',
                price: '',
            };
        }

        this.setState(newState);
    };



    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleDeleteEvent = () => {
        const { selectedEvent, events } = this.state;
        if (selectedEvent) {
            const updatedEvents = events.filter(event => event.eventID !== selectedEvent.eventID);
            this.setState({
                events: updatedEvents,
                selectedEvent: null, // Reset selected event
                showDeleteModal: false // Close the modal
            });
            this.toggleModal('showDeleteModal');
        }
    };

    handleUpdateEvent = (event) => {
        event.preventDefault();
        const updatedEvent = {
            eventName: this.state.eventName,
            eventVenue: this.state.eventVenue,
            eventDescription: this.state.eventDescription,
            eventPresenter: this.state.eventPresenter,
            price: this.state.price,
        };

        this.updateEvent(updatedEvent);
    };

    updateEvent = (updatedEvent) => {

        this.setState(prevState => ({
            events: prevState.events.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        }));

        this.toggleModal('showUpdateModal');
    };


    findEventById(eventId) {
        return this.state.events.find(event => event.eventID === eventId);
    }



    // CRUD operations 

    handleCREATE = async (event) => {
        event.preventDefault();
        const { eventName, eventID, eventVenue, eventDescription, eventPresenter, price } = this.state;
        const data = {
            eventID: eventID,
            title: eventName,
            venueID: eventVenue,
            description: eventDescription,
            presenter: eventPresenter,
            price: price,
        };


        try {
            const response = await fetch('http://localhost:3000/???', {    //please change the url
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                alert(response.data);
            }
            else {
                alert("error" + response);
            }
        }
        catch (error) {
            alert('Error creating event:', error);
        }
    }

    handleREAD = async (event) => {
        event.preventDefault();
        const { eventID } = this.state;
        const data = { eventID: eventID, };


        try {
            const response = await fetch('http://localhost:3000/???', {    //please change the url
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                alert(response.data);
            }
            else {
                alert("error" + response);
            }
        }
        catch (error) {
            alert('Error creating event:', error);
        }

    }

    handleUPDATE = async (event) => {
        event.preventDefault();
        const { eventName, eventVenue, eventDescription, eventPresenter, price } = this.state;
        const data = {
            title: eventName,
            venueID: eventVenue,
            description: eventDescription,
            presenter: eventPresenter,
            price: price,
        };


        try {
            const response = await fetch('http://localhost:3000/???', {    //please change the url
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                alert(response.data);
            }
            else {
                alert("error" + response);
            }
        }
        catch (error) {
            alert('Error creating event:', error);
        }


    }


    handleDELETE = async (event) => {  //please change the url
        event.preventDefault();
        const { eventID } = this.state;
        const data = { eventID: eventID, };


        try {
            const response = await fetch('http://localhost:3000/???', {    //please change the url
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                alert(response.data);
            }
            else if (response.status === 404) {
                alert("Event NOT Found");
            }
            else {
                alert("error" + response);
            }
        }
        catch (error) {
            alert('Error creating event:', error);
        }

    }




    render() {
        const { showCreateModal, showReadModal, showUpdateModal, showDeleteModal, selectedEvent } = this.state;
        const { events } = this.state;

        return (


            <div className="container mt-5" id="crud">



                {/* Button to show Create Event Modal */}




                {/* Create Event Modal */}
                < Modal show={showCreateModal} handleClose={() => this.toggleModal('showCreateModal')}>

                    {/* Create Event */}
                    <div className="container px-4 p-3 border bg-light rounded">
                        <h2>Create Event</h2>
                        <form onSubmit={this.state.handleCREATE}>
                            <fieldset>
                                <div className="form-group">
                                    <label htmlFor="eventName">Event Title:</label>
                                    <input
                                        class="inputC"
                                        type="text"
                                        id="eventName"
                                        name="eventName"
                                        value={this.state.eventName}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="eventID">ID:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="eventID"
                                        name="eventID"
                                        value={this.state.eventID}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="eventVenue">Venue:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="eventVenue"
                                        name="eventVenue"
                                        value={this.state.eventVenue}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="eventDescription">Description:</label>
                                    <textarea
                                        class="inputT"
                                        type="text"
                                        id="eventDescription"
                                        name="eventDescription"
                                        value={this.state.eventDescription}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="eventPresenter">Presenter:</label>
                                    <input class="inputC"
                                        type="text"
                                        id="eventPresenter"
                                        name="eventPresenter"
                                        value={this.state.eventPresenter}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={this.state.price}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <br />
                                <button type="submit" className="btn btn-outline-primary rounded-pill">Create Event</button>
                            </fieldset>
                        </form >

                    </div>
                    <br />



                </Modal >


                {/* readEvents */}
                < div className="container px-4 p-3 border bg-light rounded" id="reader">
                    <form id="check" onSubmit={this.handleREAD}>
                        <fieldset>
                            <div class="wrap-inputC validate-input">
                                <legend>Event ID:</legend>
                                <input
                                    class="inputC"
                                    // className="form-control"
                                    type="number"
                                    id="eventID"
                                    name="eventID"
                                    value={this.state.eventID}
                                    onChange={this.handleInputChange}
                                />
                                <span class="focus-inputC"></span>
                                <span class="symbol-inputC">
                                    <i class="bi bi-search" aria-hidden="true"></i>
                                </span>
                            </div>
                            <button type="submit" className="btn btn-outline-primary rounded-pill">Check</button>
                        </fieldset>
                    </form>
                </div >

                <br />



                < div className="container p-0 border bg rounded" id="reader">
                    <table className="table table-hover">
                        <thead>
                            <tr className='table-info'>
                                <th scope="col">ID</th>
                                <th scope="col">Event Title</th>
                                <th scope="col">Venue</th>
                                <th scope="col">Description</th>
                                <th scope="col">Presenter</th>
                                <th scope="col">Price</th>
                                <th scope="col">Actions</th>
                                <th scope="col"><i class="bi bi-plus-circle h3" onClick={() => this.toggleModal('showCreateModal')
                                } style={{ color: 'blue' }}></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.eventID}>
                                    <td>{event.eventID}</td>
                                    <td>{event.eventName}</td>
                                    <td>{event.eventVenue}</td>
                                    <td>{event.eventDescription}</td>
                                    <td>{event.eventPresenter}</td>
                                    <td>{event.price}</td>
                                    <td>
                                        <button onClick={() => this.toggleModal('showUpdateModal', event.eventID)} className="btn btn-outline-primary btn-circle btn-xl">
                                            <i class="bi bi-pencil-square h5"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => this.toggleModal('showDeleteModal', event.eventID)} className="btn btn-outline-danger btn-circle btn-xl">
                                            <i class="bi bi-trash3-fill h5"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >


                <br />

                <Modal show={this.state.showUpdateModal} handleClose={() => this.toggleModal('showUpdateModal')}>
                    <div className="container px-4 py-3 border bg-light" id="updater">
                        <form onSubmit={this.handleUpdateEvent}>
                            <legend> Update Event</legend>
                            <fieldset>
                                <div className="form-group">
                                    <label htmlFor="eventName">Event Title:</label>
                                    <input
                                        class="inputC"
                                        type="text"
                                        id="eventName"
                                        name="eventName"
                                        value={this.state.eventName}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <fieldset disabled = 'true'>
                                <div className="form-group">
                                    <label htmlFor="eventID">ID:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="eventID"
                                        name="eventID"
                                        value={this.state.eventID}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                </fieldset>
                                <div className="form-group">
                                    <label htmlFor="eventVenue">Venue:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="eventVenue"
                                        name="eventVenue"
                                        value={this.state.eventVenue}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="eventDescription">Description:</label>
                                    <textarea
                                        class="inputT"
                                        type="text"
                                        id="eventDescription"
                                        name="eventDescription"
                                        value={this.state.eventDescription}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="eventPresenter">Presenter:</label>
                                    <input class="inputC"
                                        type="text"
                                        id="eventPresenter"
                                        name="eventPresenter"
                                        value={this.state.eventPresenter}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={this.state.price}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <br />
                                <button type="submit" className="btn btn-outline-primary">Update Event</button>
                            </fieldset>
                        </form>
                    </div>
                </Modal>
                <br />



                <Modal show={showDeleteModal} handleClose={() => this.toggleModal('showDeleteModal')}>
                    <div className="container px-4 py-3 border bg-light">
                        {selectedEvent && (
                            <div>
                                <p>Are you sure you want to delete event ID {selectedEvent.eventID}: {selectedEvent.eventName}?</p>
                                <button type="button" className="btn btn-danger" onClick={this.handleDeleteEvent}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            </div >
        );
    }
}

export default EventCRUD;

