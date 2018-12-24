/* global $ */

import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cancellingCompose } from "../../core/actions/composes";

class StopBuild extends React.Component {
  constructor() {
    super();
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    $(this.modal).modal("show");
    $(this.modal).on("hidden.bs.modal", this.props.handleHideModal);
  }

  handleCancel() {
    this.props.cancellingCompose(this.props.composeId);
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
                <FormattedMessage defaultMessage="Stop Build" />
              </h4>
            </div>
            <div className="modal-body">
              <p className="lead">
                <FormattedMessage
                  defaultMessage="Are you sure you want to stop the build process for {blueprintName}?"
                  values={{
                    blueprintName: <strong>{this.props.blueprintName}</strong>
                  }}
                />
              </p>
              <FormattedMessage defaultMessage="The build process cannot resume after it stops." tagName="p" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage defaultMessage="Cancel" />
              </button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleCancel}>
                <FormattedMessage defaultMessage="Stop Build" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

StopBuild.propTypes = {
  blueprintName: PropTypes.string,
  composeId: PropTypes.string,
  handleHideModal: PropTypes.func,
  cancellingCompose: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  cancellingCompose: compose => {
    dispatch(cancellingCompose(compose));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(StopBuild);
