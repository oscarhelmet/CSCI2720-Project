import React from 'react';

class Modal extends React.Component {
  
  handleBackdropClick = (event) => {
    if (event.target.id === 'backdrop') {
      this.props.handleClose();
    }
  }
  
  render() {

    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal-backdrop" id='backdrop' onClick={this.handleBackdropClick}>
        <div className="modal-content rounded-5" id='modal'>
          <div className="modal-header">
            <button type="button" onClick={this.props.handleClose} id="closeButton">
              &times;
            </button>
          </div>
          <div className="modal-body rounded-5">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

// You can define the styles for the modal here or in your CSS file


export default Modal;