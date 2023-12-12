import React from 'react';

class EventCRUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventName: '',
            eventId: '',
            eventQuota: '',
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }
    // CRUD operations 

    handleCREATE = async (event) => {
        event.preventDefault();
        const { eventName, eventId, eventQuota } = this.state;
        const data = {
            eventId: eventId,
            name: eventName,
            quota: eventQuota,
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
                console.log(response.data);
            }
            else {
                console.log("error" + response);
            }
        }
        catch (error) {
            console.error('Error creating event:', error);
        }
    }

    handleREAD = async (event) => {
        event.preventDefault();
        const { eventId } = this.state;
        const data = { eventId: eventId, };


        try {
            const response = await fetch('http://localhost:3000/???', {    //please change the url
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                console.log(response.data);
            }
            else {
                console.log("error" + response);
            }
        }
        catch (error) {
            console.error('Error creating event:', error);
        }

    }

    handleUPDATE = async (event) => {
        event.preventDefault();
        const { eventId, eventName, eventQuota } = this.state;
        const data = {
            eventId: eventId,
            name: eventName,
            quota: eventQuota,
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
                console.log(response.data);
            }
            else {
                console.log("error" + response);
            }
        }
        catch (error) {
            console.error('Error creating event:', error);
        }


    }


    handleDELETE = async (event) => {  //please change the url
        event.preventDefault();
        const { eventId } = this.state;
        const data = { eventId: eventId, };

        try {
            const response = await fetch('http://localhost:3000/???', {    //please change the url
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 200) {
                console.log(response.data);
            }
            else if (response.status === 404) {
                console.log("Event NOT Found");
            }
            else {
                console.log("error" + response);
            }
        }
        catch (error) {
            console.error('Error creating event:', error);
        }

    }




    render() {


        return (

            <div className="container mt-5">
                {/* readEvents */}
                <div className="container px-4 p-3 border bg-light">
                    <h2>Create Event</h2>
                    <form onSubmit={this.handleCREATE}>
                        <fieldset>
                        <div className="form-group">
                            <label htmlFor="eventName">Event Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="eventName"
                                name="eventName"
                                value={this.state.eventName}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventId">ID:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="eventId"
                                name="eventId"
                                value={this.state.eventId}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventQuota">Quota:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="eventQuota"
                                name="eventQuota"
                                value={this.state.eventQuota}
                                onChange={this.handleInputChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Create Event</button>
                        </fieldset>
                    </form >
                    
                </div>
                <br/>

                {/* readEvents */}
                < div className="container px-4 p-3 border bg-light" >
                    <form id="check" onSubmit={this.handleREAD}>
                        <fieldset>
                            <legend> Check Event: </legend>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="eventID">Event ID:</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    id="eventID"
                                    name="eventID"
                                    value={this.state.eventID}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Check</button>
                        </fieldset>
                    </form>
                </div >

                <br />

                {/* Update Event */}
                <div className="container px-4 p-3 border bg-light">
                    <legend> Update Event</legend>
                    <form id="update-event-form" onSubmit={this.handleUPDATE}>
                        <input
                            className="form-control"
                            type="number"
                            id="eventID"
                            name="eventID"
                            placeholder="Event ID"
                            value={this.state.eventID}
                            onChange={this.handleInputChange}
                            required
                        />
                        <br />
                        <input
                            className="form-control"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Event Name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                            required
                        />
                        <br />
                        <input
                            className="form-control"
                            type="number"
                            id="locID"
                            name="locID"
                            placeholder="Location ID"
                            value={this.state.locID}
                            onChange={this.handleInputChange}
                            required
                        />
                        <br />
                        <input
                            className="form-control"
                            type="number"
                            id="quota"
                            name="quota"
                            placeholder="Quota"
                            value={this.state.quota}
                            onChange={this.handleInputChange}
                            required
                        />
                        <br />
                        <button type="submit" className="btn btn-primary">Update Event</button>
                    </form>
                </div>

                <br />

                {/* Delete Event */}
                <div className="container px-4 p-3 border bg-light">
                    <form id="delete-event-form" onSubmit={this.handleDELETE}>
                        <legend>Delete Event: </legend>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="eventID">Event ID:</label>
                            <input
                                className="form-control"
                                type="number"
                                id="eventID"
                                name="eventID"
                                value={this.state.eventID}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Delete</button>
                    </form>
                </div>
            </div >
        );
    }
}

export default EventCRUD;