import React from 'react';
import Modal from './Modal';
import './CRUD.css';

const port = 8000;


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
            eventIDSearch: '',
            showCreateModal: false,
            showReadModal: false,
            showUpdateModal: false,
            showDeleteModal: false,
            selectedEventId: null,
            selectedEvent: null,
            currentPage: 1,
            eventsPerPage: 10,
            animateChange: true,
            venueName: '',
            events: [],
            venues: [],
            totalPages: 0,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.fetchEvents();
        this.fetchVenueData();
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

    getPaginationWindow = (currentPage, pageCount, windowSize = 10) => {
        let start = Math.max(currentPage - Math.floor(windowSize / 2), 1);
        let end = start + windowSize - 1;

        if (end > pageCount) {
            end = pageCount;
            start = Math.max(end - windowSize + 1, 1);
        }

        return Array.from({ length: (end - start + 1) }, (_, index) => start + index);
    };

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


    toggleModal = async (modalKey, eventId = null) => {
        let newState = { [modalKey]: !this.state[modalKey] };
        

        if (eventId && modalKey === 'showDeleteModal') {
           try{ const event = await this.handleREAD(eventId);
                if (event !== 404) {
                    this.setState({ 
                        showDeleteModal: true,
                        selectedEvent: event });

                    this.setState((prevState) => ({ modalKey: !prevState[modalKey] }));
                    return;
                } else {
                    alert('Event Not Found');
                    this.setState({
                        showDeleteModal: false,
                        modalKey: !this.state[modalKey]
                    });
                    return;
                }}catch (error) {
                    console.error('Failed to show update modal:', error);
                }

        }
        else if (eventId && modalKey === 'showUpdateModal') {
            try {
                const event = await this.handleREAD(eventId);
                if (event !== 404) {
                    this.setState({
                        showUpdateModal: true,
                        selectedEvent: event,
                        title: event.title,
                        eventID: event.eventID,
                        venueID: event.venueID,
                        description: event.description,
                        presenter: event.presenter,
                        price: event.price,
                    });
                } else {
                    alert('Event Not Found');
                    this.setState({
                        showUpdateModal: false,
                        modalKey: !this.state[modalKey]
                    });
                    return;
                }
            } catch (error) {
                console.error('Failed to show update modal:', error);
            }
        } else if (eventId === null) {
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

        this.setState(newState, () => {
            console.log(this.state);
        });
    };

    handleVenueChange = (event) => {
        const selectedVenueName = event.target.value;
        const selectedVenue = this.state.venues.find(venue => venue.venue === selectedVenueName);
      
        if (selectedVenue) {
          this.setState({
            venueName: selectedVenueName,
            venueID: selectedVenue.venueID
          });
        } else {
          this.setState({
            venueName: '',
            venueID: ''
          });
        }
      };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value }, () => {
            if (name === 'venueID') {
                this.fetchVenueData(value);
            }
        });
    }

   
    findEventById(eventId) {
        return this.state.events.find(event => event.eventID === eventId);
    }


    fetchVenueData = async () => {
        try {
            const response = await fetch(`http://localhost:${port}/venue`, { // Make sure this URL is correct
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const venues = await response.json();
            // this.setState({ venues: data });

            if (Array.isArray(venues) && venues.length > 0) {
                this.setState({ venues });
            } else {
                throw new Error('No venues found');
            }
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            this.setState({ venues: [] });
        }
    };


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
            const response = await fetch(`http://localhost:${port}/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (response.status === 201) {
                alert("Successfully Created");
            } else {
                const errorMessage = await response.text();
                alert(errorMessage || "An error occurred, please try again.");
            }
        } catch (error) {
            console.error('Error creating event:', error.message);
        }
    }

    handleREAD = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:${port}/event/${eventId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
                // No body needed for a GET request
            });

            if (response.status === 200) {
                const eventData = await response.json();
                return eventData;
            } else if (response.status === 404) {
                return 404;
            }
            else {
                throw new Error(`Error fetching event: ${response.status}`);
            }
        } catch (error) {
            console.error('Error Reading event:', error);
            throw error;
        }
    };

    handleUPDATE = async (event) => {
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
            const response = await fetch(`http://localhost:${port}/event`, {    //please change the url
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 202) {
                alert("Successfully Updated");
                window.location.reload();
            }
            else {
                alert("error" + response.status);
                return response;
            }
        }
        catch (error) {
            alert('Error creating event:', error);
        }
    }



    handleDELETE = async (eventID) => {  //please change the url

        const data = { eventID: eventID, };

        try {
            const response = await fetch(`http://localhost:${port}/event`, {    //please change the url
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 202) {
                alert("Event Deleted");
                window.location.reload();
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
        const { showCreateModal, showReadModal, showUpdateModal, showDeleteModal, selectedEvent, currentPage, eventsPerPage, animateChange, events, eventIDSearch, venue } = this.state;
        const indexOfLastEvent = currentPage * eventsPerPage;
        const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
        const currentEvents = animateChange ? events.slice(indexOfFirstEvent, indexOfLastEvent) : [];
        const totalPages = Math.ceil(events.length / eventsPerPage);
        const pageNumbersWindow = this.getPaginationWindow(currentPage, totalPages, 20); // windowSize is 10


        return (


            <div className="container mt-5" id="crud">



                {/* Button to show Create Event Modal */}




                {/* Create Event Modal */}
                < Modal show={showCreateModal} handleClose={() => this.toggleModal('showCreateModal')}>

                    {/* Create Event */}
                    <div className="container px-4 p-3 border bg-light rounded-5">
                        <form onSubmit={this.handleCREATE}>
                            <legend> Event Details</legend>
                            <fieldset>
                                <div className="form-group d-flex" style={{ alignItems: 'center', gap: '1rem' }}>

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
                                            disabled
                                        />
                                    </fieldset>
                                    <div className="flex-grow-1 d-flex flex-column">
                                        <label htmlFor="venueName">Venue Name:</label>
                                        <select
                                            className="inputC form-control"
                                            id="venueName"
                                            name="venueName"
                                            value={this.state.venueName}
                                            onChange={this.handleVenueChange}
                                            disabled={this.state.venues.length === 0}
                                        >
                                            <option value="">Select a Venue</option>
                                            {this.state.venues.map(venue => (
                                                <option key={venue.venueID} value={venue.venue}>
                                                    {venue.venue}
                                                </option>
                                            ))}
                                        </select>
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
                                    <button type="submit" className="btn btn-outline-primary rounded-pill">Create Event</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </Modal>


                {/* readEvents */}
                <div className="container px-4 p-3 border bg-light rounded-5" id="readbar">
                    <form id="check" onSubmit={async (e) => { e.preventDefault(); this.state.eventIDSearch ? await this.toggleModal('showUpdateModal', this.state.eventIDSearch) : alert("Please Enter ID"); }}>
                        <fieldset>
                            <div className="d-flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                <div className="wrap-inputC validate-input d-flex-column " >
                                    <legend>Event ID:</legend>
                                    <input
                                        className="inputC"
                                        type="number"
                                        id="eventIDSearch"
                                        name="eventIDSearch"
                                        value={this.state.eventIDSearch}
                                        onChange={this.handleInputChange}
                                    />
                                    <span className="focus-inputC"></span>
                                    <span className="symbol-inputC">
                                        <i className="bi bi-search" aria-hidden="true"></i>
                                    </span>
                                </div>
                                <button type="submit" className="btn btn-outline-primary rounded-pill d-flex-column">Check</button>
                            </div>
                        </fieldset>
                    </form>
                </div>

                <br />

                <div className="d-flex justify-content-end">

                    <button type="button" className="btn btn-outline-success rounded-pill ms-auto" onClick={() => this.toggleModal('showCreateModal')}>
                        <i class="bi bi-plus"></i> Add Event
                    </button>
                </div>

                < div className="container">
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

                </div >

                <nav aria-label="Page navigation" id='pagenav'>
                    <ul className="pagination">
                        {pageNumbersWindow.map(number => (
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                <a onClick={() => this.paginate(number)} className="page-link">
                                    {number}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <br />

                <Modal show={this.state.showUpdateModal} handleClose={() => this.toggleModal('showUpdateModal')}>
                    <div className="container px-4 py-3 border bg-light rounded-5" id="updater">
                        <form onSubmit={this.handleUPDATE}>
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
                                            readOnly // This makes the field not editable, but still focusable
                                        />
                                    </fieldset>
                                    <div className="flex-grow-1 d-flex flex-column">
                                        <label htmlFor="venueName">Venue Name:</label>
                                        <select
                                            className="inputC form-control"
                                            id="venueName"
                                            name="venueName"
                                            value={this.state.venueName}
                                            onChange={this.handleVenueChange}
                                            disabled={this.state.venues.length === 0}
                                        >
                                            {this.state.venues.map(venue => (
                                                <option key={venue.venueID} value={venue.venue}>
                                                    {venue.venue}
                                                </option>
                                            ))}
                                        </select>
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

                                    <button type="button" className="btn btn-danger rounded-pill ms-auto" onClick={() => this.handleDELETE(this.state.eventID)}>
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
                                <button type="button" className="btn btn-danger rounded-cicle" onClick={() => this.handleDELETE(selectedEvent.eventID)}>
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

