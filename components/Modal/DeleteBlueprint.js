import React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";

import { deletingBlueprint } from "../../core/actions/blueprints";

class DeleteBlueprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.handleModalToggle = this.handleModalToggle.bind(this);
  }

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
    }));
  };

  handleDelete(event, blueprint) {
    this.props.deletingBlueprint(blueprint);
    this.handleModalToggle();
  }

  render() {
    return (
      <>
        <Button component="a" variant="plain" onClick={this.handleModalToggle}>
          <FormattedMessage defaultMessage="Delete" />
        </Button>
        <Modal
          id="cmpsr-modal-delete"
          variant={ModalVariant.medium}
          title={<FormattedMessage defaultMessage="Delete blueprint" />}
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalToggle}
          actions={[
            <Button
              key="cancel"
              variant="secondary"
              onClick={this.handleModalToggle}
            >
              <FormattedMessage defaultMessage="Cancel" />
            </Button>,
            <Button
              key="delete"
              variant="danger"
              onClick={(e) => this.handleDelete(e, this.props.blueprint.name)}
            >
              <FormattedMessage defaultMessage="Delete" />
            </Button>,
          ]}
        >
          <p className="lead">
            <FormattedMessage
              defaultMessage="Are you sure you want to delete the blueprint {name}?"
              values={{
                name: <strong>{this.props.blueprint.name}</strong>,
              }}
            />
          </p>
          <FormattedMessage
            defaultMessage="This action cannot be undone."
            tagName="p"
          />
        </Modal>
      </>
    );
  }
}

const makeMapStateToProps = (state) => {
  return state;
};

DeleteBlueprint.propTypes = {
  deletingBlueprint: PropTypes.func,
  blueprint: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

DeleteBlueprint.defaultProps = {
  deletingBlueprint() {},
  blueprint: {},
};

const mapDispatchToProps = (dispatch) => ({
  deletingBlueprint: (blueprint) => {
    dispatch(deletingBlueprint(blueprint));
  },
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(injectIntl(DeleteBlueprint));
