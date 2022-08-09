import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TimesIcon } from "@patternfly/react-icons";
import { deletingCompose } from "../../core/actions/composes";

class DeleteImage extends React.Component {
  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    $(this.modal).modal("show");
    $(this.modal).on("hidden.bs.modal", this.props.handleHideModal);
  }

  handleDelete() {
    this.props.deletingCompose(this.props.composeId);
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-delete"
        ref={(c) => {
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
                <TimesIcon />
              </button>
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage defaultMessage="Delete image" />
              </h4>
            </div>
            <div className="modal-body">
              <p className="lead">
                <FormattedMessage
                  defaultMessage="Are you sure you want to delete the image for {blueprintName}?"
                  values={{
                    blueprintName: <strong>{this.props.blueprintName}</strong>,
                  }}
                />
              </p>
              <FormattedMessage defaultMessage="This action cannot be undone." tagName="p" />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage defaultMessage="Cancel" />
              </button>
              <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.handleDelete}>
                <FormattedMessage defaultMessage="Delete image" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DeleteImage.propTypes = {
  blueprintName: PropTypes.string,
  composeId: PropTypes.string,
  handleHideModal: PropTypes.func,
  deletingCompose: PropTypes.func,
};

DeleteImage.defaultProps = {
  blueprintName: "",
  composeId: "",
  handleHideModal() {},
  deletingCompose() {},
};

const mapDispatchToProps = (dispatch) => ({
  deletingCompose: (compose) => {
    dispatch(deletingCompose(compose));
  },
});

export default connect(null, mapDispatchToProps)(DeleteImage);
