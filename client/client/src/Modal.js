import React from 'react';

class Modal extends React.Component {
  render() {
    // If the `show` prop is false, don't display the modal
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal-backdrop" style={styles.backdrop}>
        <div className="modal-content rounded" style={styles.modal}>
          <div className="modal-header">
            <button type="button" onClick={this.props.handleClose} style={styles.closeButton}>
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
const styles = {
  backdrop: {
    position: 'fixed',
    top: 3,
    bottom:3,
    left: 3,
    right: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '0px',
    zIndex: 1000, // Ensure it's on top of other elements
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '5px',
    maxWidth: '500px',
    minHeight: '300px',
    margin: '0 auto',
    padding: '30px',
    position: 'relative',
    zIndex: 1001, // Even higher to be on top of the backdrop
  },
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '20px',
    fontSize: '1.5em',
    border: 'none',
    background: 'none',
  }
};

export default Modal;