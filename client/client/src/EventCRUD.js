import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from './Modal';
import './CRUD.css';

const port = 7000;


class EventCRUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            eventID: '',
            venueID: '',
            description: '',
            presenter: '',
            price: '',
            showCreateModal: false,
            showReadModal: false,
            showUpdateModal: false,
            showDeleteModal: false,
            selectedEventId: null,
            selectedEvent: null,
            currentPage: 1,
            eventsPerPage: 10,
            animateChange: true,
            venueName: null,
            events: [],
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.fetchEvents();
    }


    fetchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:${port}/event`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.setState({ events: data });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }


    paginate = (pageNumber) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        this.setState({ animateChange: false }, () => {
            setTimeout(() => {
                this.setState({ currentPage: pageNumber, animateChange: true });
            }, 250);
        });
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
                    title: event.title,
                    eventID: event.eventID,
                    venueID: event.venueID,
                    description: event.description,
                    presenter: event.presenter,
                    price: event.price,
                };
            }
        } else if (!this.state[modalKey]) {
            // Reset the form if the modal is being closed
            newState = {
                ...newState,
                selectedEvent: null,
                title: '',
                eventID: '',
                venueID: '',
                description: '',
                presenter: '',
                price: '',
            };
        }

        this.setState(newState);
    };



    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value }, () => {
            if (name === 'venueID') {
                this.fetchVenueData(value);
            }
        });
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
            title: this.state.title,
            venueID: this.state.venueID,
            description: this.state.description,
            presenter: this.state.presenter,
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


    fetchVenueData = async(venueID) => {

        const response = await fetch(`http://localhost:${port}/venue/${venueID}`, {    //please change the url
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            // .then((response) => {
            //     alert(response);
            //     if (!response.ok) {
            //         throw new Error('Network response was not ok');
            //     }
            //     return response.json();
            // })
            // .then((data) => {
            //     this.setState({ venueName: data.venue || 'No location found'+response });
            // })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
                this.setState({ venueName: 'No location found' });
            });
        alert(response);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.venueID !== this.state.venueID) {
            this.fetchVenueData(this.state.venueID);
        }
    }


    // CRUD operations 

    handleCREATE = async (event) => {
        event.preventDefault();
        const { title, eventID, venueID, description, presenter, price } = this.state;
        const data = {
            eventID: eventID,
            title: title,
            venueID: venueID,
            description: description,
            presenter: presenter,
            price: price,
        };


        try {
            const response = await fetch(`http://localhost:${port}/event/${eventID}`, {    //please change the url
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
            const response = await fetch(`http://localhost:${port}/event/${eventID}`, {    //please change the url
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
            alert('Error Reading event:', error);
        }

    }

    handleUPDATE = async (event) => {
        event.preventDefault();
        const { title, venueID, description, presenter, price } = this.state;
        const data = {
            title: title,
            venueID: venueID,
            description: description,
            presenter: presenter,
            price: price,
        };


        try {
            const response = await fetch(`http://localhost:${port}/event/`, {    //please change the url
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
            alert('Error Update event:', error);
        }


    }


    handleDELETE = async (event) => {  //please change the url
        event.preventDefault();
        const { eventID } = this.state;
        const data = { eventID: eventID, };


        try {
            const response = await fetch(`http://localhost:${port}/event/${eventID}`, {    //please change the url
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
            alert('Error Deleting event:', error);
        }

    }




    render() {
        const { showCreateModal, showReadModal, showUpdateModal, showDeleteModal, selectedEvent, currentPage, eventsPerPage, animateChange, events, venueName } = this.state;
        const indexOfLastEvent = currentPage * eventsPerPage;
        const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
        const currentEvents = animateChange ? events.slice(indexOfFirstEvent, indexOfLastEvent) : [];

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(events.length / eventsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (


            <div className="container mt-5" id="crud">



                {/* Button to show Create Event Modal */}




                {/* Create Event Modal */}
                < Modal show={showCreateModal} handleClose={() => this.toggleModal('showCreateModal')}>

                    {/* Create Event */}
                    <div className="container px-4 p-3 border bg-light rounded-5">
                        <h2>Create Event</h2>
                        <form onSubmit={this.state.handleCREATE}>
                            <fieldset>
                                <div className="form-group">
                                    <label htmlFor="title">Event Title:</label>
                                    <input
                                        class="inputC"
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={this.state.title}
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
                                    <label htmlFor="venueID">Venue:</label>
                                    <input class="inputC"
                                        type="number"
                                        id="venueID"
                                        name="venueID"
                                        value={this.state.venueID}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="description">Description:</label>
                                    <textarea
                                        class="inputT"
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="presenter">Presenter:</label>
                                    <input class="inputC"
                                        type="text"
                                        id="presenter"
                                        name="presenter"
                                        value={this.state.presenter}
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
                < div className="container px-4 p-3 border bg-light rounded-5" id="readbar">
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



                < div className="container p-0"  >
                    <table className="table table-hover" id='reader'>
                        <thead>
                            <tr className='table'>
                                <th scope="col">ID</th>
                                <th scope="col">Event Title</th>
                                <th scope="col">Price</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={this.state.animateChange ? 'fade-enter-active' : 'fade-exit'}>
                            {currentEvents.map(event => (
                                <tr key={event.eventID}>
                                    <td>{event.eventID}</td>
                                    <td>{event.title}</td>
                                    <td>{event.price.join(', ')}</td>
                                    <td>
                                        <button onClick={() => this.toggleModal('showUpdateModal', event.eventID)} className="btn btn-outline-primary btn-circle btn-xl">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button onClick={() => this.toggleModal('showDeleteModal', event.eventID)} className="btn btn-outline-danger btn-circle btn-xl">
                                            <i class="bi bi-trash3-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                    <nav aria-label="Page navigation" id='pagenav'>
                        <ul className="pagination">
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <a onClick={() => this.paginate(number)} className="page-link">
                                        {number}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div >


                <br />

                <Modal show={this.state.showUpdateModal} handleClose={() => this.toggleModal('showUpdateModal')}>
                    <div className="container px-4 py-3 border bg-light rounded-5" id="updater">
                        <form onSubmit={this.handleUpdateEvent}>
                            <legend> Event Details</legend>
                            <fieldset>
                                <div className="form-group d-flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                    <fieldset disabled>
                                        <div className="d-flex flex-column" style={{ flexBasis: 'auto', flexGrow: 0 }}>
                                            <label htmlFor="eventID">ID:</label>
                                            <input
                                                className="inputC form-control"
                                                type="number"
                                                id="eventID"
                                                name="eventID"
                                                value={this.state.eventID}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                    </fieldset>
                                    <div className="flex-grow-1 d-flex flex-column">
                                        <label htmlFor="title">Event Title:</label>
                                        <input
                                            className="inputC form-control"
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={this.state.title}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>

                                </div>
                                <div className="form-group d-flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                    <fieldset className="d-flex flex-column" style={{ flexBasis: 'auto', flexGrow: 0 }}>
                                        <label htmlFor="venueID">Venue ID:</label>
                                        <input
                                            className="inputC form-control"
                                            type="number"
                                            id="venueID"
                                            name="venueID"
                                            value={this.state.venueID}
                                            onChange={this.handleInputChange}
                                        />
                                    </fieldset>
                                    <div className="flex-grow-1 d-flex flex-column">
                                        <label htmlFor="venueName">Venue Name:</label>
                                        <input
                                            className="inputC form-control"
                                            type="text"
                                            id="venueName"
                                            name="venueName"
                                            value={this.state.venueName}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="description">Description:</label>
                                    <textarea
                                        class="inputT"
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="presenter">Presenter:</label>
                                    <input class="inputC"
                                        type="text"
                                        id="presenter"
                                        name="presenter"
                                        value={this.state.presenter}
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
                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-outline-primary rounded-pill">Update Event</button>

                                    <button type="button" className="btn btn-danger rounded-pill ms-auto" onClick={this.handleDELETE}>
                                        <i class="bi bi-trash3-fill"></i>
                                    </button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </Modal>
                <br />



                <Modal show={showDeleteModal} handleClose={() => this.toggleModal('showDeleteModal')}>
                    <div className="container px-4 py-3 border bg-light rounded-5">
                        {selectedEvent && (
                            <div>
                                <p><h3><b>ARE YOU SURE</b></h3><br />
                                    you want to delete event ID {selectedEvent.eventID}: <br />{selectedEvent.title}?</p>
                                <button type="button" className="btn btn-danger rounded-cicle" onClick={this.handleDELETE}>
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

