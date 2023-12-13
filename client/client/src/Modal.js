import React from 'react';

class Modal extends React.Component {
  render() {
    // If the `show` prop is false, don't display the modal
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal-backdrop" id='backdrop'>
        <div className="modal-content rounded" id='modal'>
          <div className="modal-header">
            <button type="button" onClick={this.props.handleClose} id="closeButton">
              &times;
            </button>
          </div>
          <div className="modal-body rounded">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

// You can define the styles for the modal here or in your CSS file


export default Modal;