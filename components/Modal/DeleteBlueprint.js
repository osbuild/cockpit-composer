/* global $ */

import React from 'react';
import PropTypes from 'prop-types';

class DeleteBlueprint extends React.Component {

  componentDidMount() {
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-delete"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
              >
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Delete Blueprint</h4>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the blueprint <strong>{this.props.blueprint.name}</strong>?</p>
            </div>
            <div className="modal-footer">
              <p className="pull-left">This action cannot be undone.</p>
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={(e) => this.props.handleDelete(e, this.props.blueprint.id)}
              >Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DeleteBlueprint.propTypes = {
  blueprint: PropTypes.object,
  handleHideModal: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default DeleteBlueprint;
