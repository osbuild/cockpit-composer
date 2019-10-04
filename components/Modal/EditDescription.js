import React from "react";
import { Modal } from "patternfly-react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class EditDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <React.Fragment>
        <a href="#" onClick={this.open} className={this.props.descriptionAsLink ? "text-muted" : ""}>
          {(this.props.descriptionAsLink && this.props.description) || (
            <FormattedMessage defaultMessage="Edit description" />
          )}
        </a>
        {this.state.showModal && (
          <EditDescriptionModal
            description={this.props.description}
            handleEditDescription={this.props.handleEditDescription}
            close={this.close}
          />
        )}
      </React.Fragment>
    );
  }
}

class EditDescriptionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ description: this.props.description });
  }

  handleChange(e, prop) {
    this.setState({ [prop]: e.target.value });
  }

  handleSubmit(e) {
    this.props.close();
    this.props.handleEditDescription(this.state.description);
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return (
      <Modal show onHide={this.props.close} id="cmpsr-modal-edit-description">
        <Modal.Header>
          <Modal.CloseButton onClick={this.props.close} />
          <Modal.Title>
            <FormattedMessage defaultMessage="Edit Description" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-horizontal" data-form="description" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="col-sm-3 control-label required-pf" htmlFor="textInput-modal-markup">
                <FormattedMessage defaultMessage="Description" />
              </label>
              <div className="col-sm-9">
                <input
                  autoFocus
                  type="text"
                  id="textInput-modal-markup"
                  className="form-control"
                  value={this.state.description}
                  onChange={e => this.handleChange(e, "description")}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.close}>
            <FormattedMessage defaultMessage="Cancel" />
          </button>
          <button
            id="edit-description-modal-submit-button"
            type="button"
            className="btn btn-primary"
            onClick={this.handleSubmit}
          >
            <FormattedMessage defaultMessage="Save" />
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

EditDescription.propTypes = {
  handleEditDescription: PropTypes.func.isRequired,
  description: PropTypes.string,
  descriptionAsLink: PropTypes.bool
};

EditDescription.defaultProps = {
  description: "",
  descriptionAsLink: false
};

EditDescriptionModal.propTypes = {
  close: PropTypes.func.isRequired,
  handleEditDescription: PropTypes.func,
  description: PropTypes.string
};

EditDescriptionModal.defaultProps = {
  handleEditDescription: function() {},
  description: ""
};

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  null
)(EditDescription);
