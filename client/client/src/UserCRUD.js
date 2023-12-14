import React from 'react';




class UserCRUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            username: '',
            password: '',
            Admin: '',
            pinned: [],
            showCreateUserModal: false,
            showReadUserModal: false,
            showUpdateUserModal: false,
            showDeleteUserModal: false,
            selectedUserId: null,
            selectedUser: null,
            currentPage: 1,
            usersPerPage: 10,
            animateChange: true,
            users: [],
            totalPages: 0,
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleCREATEUser = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        const data = {
            username: username,
            password: password,
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

    handleREADUser = async (event) => {
        event.preventDefault();
        const { username } = this.state;
        const data = { username: username, };


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

    handleUPDATEUser = async (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        const data = {
            username: username,
            password: password,
            
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


    handleDELETEUser = async (event) => {  //please change the url
        event.preventDefault();
        const { username } = this.state;
        const data = { username: username, };

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
            <div className="container mt-5" id='CRUD'>


                <div className="container px-4 p-3 border bg-light">
                    <h2>Create User</h2>
                    <form onSubmit={this.handleCREATE}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <br/>
                        <button type="submit" className="btn btn-primary"><i class="bi bi-person-plus-fill"></i></button>
                    </form>
                </div>

                <br />

                <div className="container px-4 p-3 border bg-light">
                    <h2>Look Up User</h2>
                    <form onSubmit={this.handleREAD}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <br/> 
                        <button type="submit" className="btn btn-primary"><i class="bi bi-search"></i></button>
                    </form>
                </div>

                <br />

                <div className="container px-4 p-3 border bg-light">
                    <h2>Update User Infomation</h2>
                    <form onSubmit={this.handleUPDATE}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <br/>
                        <button type="submit" className="btn btn-primary"><i class="bi bi-arrow-up-circle"></i></button>
                    </form>
                </div>

                <br />

                <div className="container px-4 p-3 border bg-light">
                    <h2>Delete User</h2>
                    <form onSubmit={this.handleDELETE}>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <br/>
                        <button type="submit" className="btn btn-primary"><i class="bi bi-trash3"></i></button>
                    </form>
                </div>

            </div>
        );
    }
}

export default UserCRUD;