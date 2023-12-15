< div className="container p-0 border bg rounded" id="reader">
                    <table className="table table-hover">
                        <thead>
                            <tr className='table'>
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
                        <tbody className={this.state.animateChange ? 'fade-enter-active' : 'fade-exit'}>
                            {currentEvents.map(event => (
                                <tr key={event.eventID}>
                                    <td>{event.title}</td>
                                    <td>{event.eventName}</td>
                                    <td>{event.eventVenue}</td>
                                    <td>{event.eventDescription}</td>
                                    <td>{event.eventPresenter}</td>
                                    <td>{event.price.join(', ')}</td>
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
                        <nav aria-label="Page navigation">
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
                    </table>
                    </div>