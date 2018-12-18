/* global $ */

import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

class DeleteBlueprint extends React.Component {
  componentDidMount() {
    $(this.modal).modal("show");
    $(this.modal).on("hidden.bs.modal", this.props.handleHideModal);
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-delete"
        ref={c => {
          this.modal = c;
        }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                <span className="pficon pficon-close" />
              </button>
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage defaultMessage="Delete Blueprint" />
              </h4>
            </div>
            <div className="modal-body">
              <p className="lead">
                <FormattedMessage
                  defaultMessage="Are you sure you want to delete the blueprint {name}?"
                  values={{
                    name: <strong>{this.props.blueprint.name}</strong>
                  }}
                />
              </p>
              <FormattedMessage defaultMessage="This action cannot be undone." tagName="p" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage defaultMessage="Cancel" />
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={e => this.props.handleDelete(e, this.props.blueprint.id)}
              >
                <FormattedMessage defaultMessage="Delete" />
              </button>
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
  handleDelete: PropTypes.func
};

export default DeleteBlueprint;
