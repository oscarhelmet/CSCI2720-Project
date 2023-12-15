import React from 'react';
import Modal from './Modal';


const port = 8000;

class UserCRUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserId: '',
            UserName: '',
            UserPwHash: '',
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

    fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:${port}/user`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            this.setState({ users: data });
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

    toggleUserModal = async (modalKey, UserId = null) => {
        let newState = { [modalKey]: !this.state[modalKey] };


        if (UserId && modalKey === 'showDeleteUserModal') {
            try {
                const User = await this.handleREADUser(UserId);
                if (User !== 404) {
                    this.setState({
                        showDeleteUserModal: true,
                        selectedUser: User
                    });

                    this.setState((prevState) => ({ modalKey: !prevState[modalKey] }));
                    return;
                } else {
                    alert('User Not Found');
                    this.setState({
                        showDeleteUserModal: false,
                        modalKey: !this.state[modalKey]
                    });
                    return;
                }
            } catch (error) {
                console.error('Failed to show update modal:', error);
            }

        }
        else if (UserId && modalKey === 'showUpdateUserModal') {
            try {
                const User = await this.handleREADUser(UserId);
                if (User !== 404) {
                    this.setState({
                        showUpdateUserModal: true,
                        selectedUser: User,
                        UserId: User.UserId,
                        UserName: User.UserName,
                        UserPwHash: User.UserPwHash,
                        Admin: User.Admin,
                    });
                } else {
                    alert('User Not Found');
                    this.setState({
                        showUpdateUserModal: false,
                        modalKey: !this.state[modalKey]
                    });
                    return;
                }
            } catch (error) {
                console.error('Failed to show update modal:', error);
            }
        } else if (UserId === null) {
            newState = {
                ...newState,
                selectedUser: null,
                UserId: '',
                UserName: '',
                UserPwHash: '',
                Admin: '',
            };
        }

        this.setState(newState, () => {
            console.log(this.state);
        });
    };

    handleInputChange = (event) => {
        const { name, value, type } = event.target;
        const finalValue = type === 'radio' ? (value === 'true') : value;
        this.setState({ [name]: finalValue });
    };


    // CRUD Operations

    handleCREATEUser = async (event) => {
        event.preventDefault();
        const { UserId, UserName, UserPwHash, Admin } = this.state;
        const data = {
            UserId: UserId,
            UserName: UserName,
            UserPwHash: UserPwHash,
            Admin: Admin,
        };


        try {
            const response = await fetch(`http://localhost:${port}/user`, {    //please change the url
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.status === 201) {
                alert("Successfully Created");
            } else {
                const errorMessage = await response.text();
                alert(response.status + errorMessage || "An error occurred, please try again.");
            }
        } catch (error) {
            console.error('Error creating User:', error.message);
        }
    }

    handleREADUser = async (UserId) => {
        try {
            const response = await fetch(`http://localhost:${port}/user/${UserId}`, {
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
                throw new Error(`Error fetching user: ${response.status}`);
            }
        } catch (error) {
            console.error('Error Reading user:', error);
            throw error;
        }

    }

    handleUPDATEUser = async (event) => {
        event.preventDefault();
        const { UserId, UserName, UserPwHash, Admin } = this.state;
        const data = {
            UserId: UserId,
            UserName: UserName,
            UserPwHash: UserPwHash,
            Admin: Admin,
        };


        try {
            const response = await fetch(`http://localhost:${port}/user/`+this.state.UserId, {    //please change the url
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
            alert('Error:', error);
        }
    }


    handleDELETEUser = async (UserId) => {  //please change the url
        const data = { UserId: UserId, };

        try {
            const response = await fetch(`http://localhost:${port}/user`, {    //please change the url
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.status === 202) {
                alert("user Deleted");
                window.location.reload();
            }
            else if (response.status === 404) {
                alert("User NOT Found");
            }
            else {
                alert("error" + response);
            }
        }
        catch (error) {
            alert('Error Deleting user:', error);
        }


    }


    render() {
        const { showCreateUserModal, showReadUserModal, showUpdateUserModal, showDeleteUserModal, selectedUser, currentPage, usersPerPage, animateChange, users, userIDSearch } = this.state;
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = animateChange ? users.slice(indexOfFirstUser, indexOfLastUser) : [];
        const totalPages = Math.ceil(users.length / usersPerPage);
        const pageNumbersWindow = this.getPaginationWindow(currentPage, totalPages, 20); // windowSize is 10


        return (
            <div className="container mt-5" id="crud">
                < Modal show={showCreateUserModal} handleClose={() => this.toggleUserModal('showCreateUserModal')}>

                    {/* Create User  */}
                    <div className="container px-4 p-3 border bg-light rounded-5">
                        <form onSubmit={this.handleCREATEUser}>
                            <legend> User Details</legend>
                            <fieldset>
                                <div className="form-group d-flex" style={{ alignItems: 'center', gap: '1rem' }}>

                                    <div className="d-flex flex-column" style={{ flexBasis: 'auto', flexGrow: 0 }}>
                                        <label htmlFor="UserId">ID:</label>
                                        <input
                                            className="inputC form-control"
                                            type="number"
                                            id="UserId"
                                            name="UserId"
                                            value={this.state.UserId}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>

                                    <div className="flex-grow-1 d-flex flex-column">
                                        <label htmlFor="UserName">User Name:</label>
                                        <input
                                            className="inputC form-control"
                                            type="text"
                                            id="UserName"
                                            name="UserName"
                                            value={this.state.UserName}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>

                                </div>

                                <div className='form-group'>
                                    <label htmlFor="UserPwHash">Password</label>
                                    <input
                                        class="inputT"
                                        type="text"
                                        id="UserPwHash"
                                        name="UserPwHash"
                                        value={this.state.UserPwHash}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Admin:</label>
                                    <div className="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            id="adminYes"
                                            name="Admin"
                                            value="true"
                                            checked={this.state.Admin === true}
                                            onChange={this.handleInputChange}
                                        />
                                        <label class="form-check-label" htmlFor="adminYes">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            id="adminNo"
                                            name="Admin"
                                            value="false"
                                            checked={this.state.Admin === false}
                                            onChange={this.handleInputChange}
                                        />
                                        <label class="form-check-label" htmlFor="adminNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-outline-primary rounded-pill">Create User</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </Modal>

                {/* readEvents */}
                <div className="container px-4 p-3 border bg-light rounded-5" id="readbar">
                    <form id="check" onSubmit={async (e) => { e.preventDefault(); this.state.userIDSearch ? await this.toggleUserModal('showUpdateUserModal', this.state.userIDSearch) : alert("Please Enter ID"); }}>
                        <fieldset>
                            <div className="d-flex" style={{ alignItems: 'center', gap: '1rem' }}>
                                <div className="wrap-inputC validate-input d-flex-column " >
                                    <legend>User ID:</legend>
                                    <input
                                        className="inputC"
                                        type="number"
                                        id="userIDSearch"
                                        name="userIDSearch"
                                        value={this.state.userIDSearch}
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

                    <button type="button" className="btn btn-outline-success rounded-pill ms-auto" onClick={() => this.toggleUserModal('showCreateUserModal')}>
                        <i class="bi bi-plus"></i> Add User
                    </button>
                </div>

                < div className="container">
                    <table className="table table-hover" id='reader'>
                        <thead>
                            <tr className='table'>
                                <th scope="col">ID</th>
                                <th scope="col">User Name</th>
                                <th scope="col">Admin Right</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={this.state.animateChange ? 'fade-enter-active' : 'fade-exit'}>
                            {currentUsers.map(event => (
                                <tr key={event.UserId}>
                                    <td>{event.UserName}</td>
                                    <td>{event.Admin}</td>
                                    <td>
                                        <button onClick={() => this.toggleUserModal('showUpdateUserModal', event.UserId)} className="btn btn-outline-primary btn-circle btn-xl">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button onClick={() => this.toggleUserModal('showDeleteUserModal', event.UserId)} className="btn btn-outline-danger btn-circle btn-xl">
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

                <Modal show={this.state.showUpdateUserModal} handleClose={() => this.toggleUserModal('showUpdateUserModal')}>
                    <div className="container px-4 py-3 border bg-light rounded-5" id="updater">
                        <form onSubmit={this.handleUPDATEUser}>
                            <legend> User Details</legend>
                            <fieldset>
                                <div className="form-group d-flex" style={{ alignItems: 'center', gap: '1rem' }}>

                                    <div className="d-flex flex-column" style={{ flexBasis: 'auto', flexGrow: 0 }}>
                                        <label htmlFor="UserId">ID:</label>
                                        <input
                                            className="inputC form-control"
                                            type="number"
                                            id="UserId"
                                            name="UserId"
                                            value={this.state.UserId}
                                            onChange={this.handleInputChange}
                                            readOnly
                                        />
                                    </div>

                                    <div className="flex-grow-1 d-flex flex-column">
                                        <label htmlFor="UserName">User Name:</label>
                                        <input
                                            className="inputC form-control"
                                            type="text"
                                            id="UserName"
                                            name="UserName"
                                            value={this.state.UserName}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>

                                </div>

                                <div className='form-group'>
                                    <label htmlFor="UserPwHash">Password</label>
                                    <input
                                        class="inputT"
                                        type="text"
                                        id="UserPwHash"
                                        name="UserPwHash"
                                        value={this.state.UserPwHash}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Admin:</label>
                                    <div className="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            id="adminYes"
                                            name="Admin"
                                            value="true"
                                            checked={this.state.Admin === true}
                                            onChange={this.handleInputChange}
                                        />
                                        <label class="form-check-label" htmlFor="adminYes">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            class="form-check-input"
                                            type="radio"
                                            id="adminNo"
                                            name="Admin"
                                            value="false"
                                            checked={this.state.Admin === false}
                                            onChange={this.handleInputChange}
                                        />
                                        <label class="form-check-label" htmlFor="adminNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                                <br />
                                <div className="d-flex justify-content-between">
                                    <button type="submit" className="btn btn-outline-primary rounded-pill">Update Event</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </Modal>
                <br />

                <Modal show={showDeleteUserModal} handleClose={() => this.toggleUserModal('showDeleteUserModal')}>
                    <div className="container px-4 py-3 border bg-light rounded-5">
                        {selectedUser && (
                            <div>
                                <p><h3><b>ARE YOU SURE</b></h3><br />
                                    you want to delete event ID {selectedUser.UserId}: <br />{selectedUser.UserName}?</p>
                                <button type="button" className="btn btn-danger rounded-cicle" onClick={() => this.handleDELETEUser(selectedUser.UserId)}>
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

export default UserCRUD;