import React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class EditDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      isModalOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({ description: this.props.description });
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

  handleChange(e, prop) {
    this.setState({ [prop]: e.target.value });
  }

  handleSubmit(e) {
    this.handleModalToggle();
    this.props.handleEditDescription(this.state.description);
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return (
      <>
        <Button component="a" variant="plain" onClick={this.handleModalToggle}>
          {(this.props.descriptionAsLink && this.props.description) || (
            <FormattedMessage defaultMessage="Edit description" />
          )}
        </Button>
        <Modal
          id="cmpsr-modal-edit-description"
          variant={ModalVariant.medium}
          title={<FormattedMessage defaultMessage="Edit description" />}
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalToggle}
          actions={[
            <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
              <FormattedMessage defaultMessage="Cancel" />
            </Button>,
            <Button key="save" variant="primary" onClick={this.handleSubmit}>
              <FormattedMessage defaultMessage="Save" />
            </Button>,
          ]}
        >
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
                  onChange={(e) => this.handleChange(e, "description")}
                />
              </div>
            </div>
          </form>
        </Modal>
      </>
    );
  }
}

EditDescription.propTypes = {
  handleEditDescription: PropTypes.func.isRequired,
  description: PropTypes.string,
  descriptionAsLink: PropTypes.bool,
};

EditDescription.defaultProps = {
  description: "",
  descriptionAsLink: false,
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(EditDescription);
