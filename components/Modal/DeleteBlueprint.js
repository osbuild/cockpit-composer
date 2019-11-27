import React from "react";
import { Modal } from "patternfly-react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from "prop-types";

import { deletingBlueprint } from "../../core/actions/blueprints";

class DeleteBlueprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  handleDelete(event, blueprint) {
    this.props.deletingBlueprint(blueprint);
    this.close();
  }

  render() {
    return (
      <React.Fragment>
        <a href="#" onClick={this.open}>
          <FormattedMessage defaultMessage="Delete" />
        </a>
        <Modal show={this.state.showModal} onHide={this.close} id="cmpsr-modal-delete">
          <Modal.Header>
            <Modal.CloseButton onClick={this.close} />
            <Modal.Title>
              <FormattedMessage defaultMessage="Delete Blueprint" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="lead">
              <FormattedMessage
                defaultMessage="Are you sure you want to delete the blueprint {name}?"
                values={{
                  name: <strong>{this.props.blueprint.name}</strong>
                }}
              />
            </p>
            <FormattedMessage defaultMessage="This action cannot be undone." tagName="p" />
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-default" onClick={this.close}>
              <FormattedMessage defaultMessage="Cancel" />
            </button>
            <button
              type="button"
              className="btn btn-danger"
              data-dismiss="modal"
              onClick={e => this.handleDelete(e, this.props.blueprint.id)}
            >
              <FormattedMessage defaultMessage="Delete" />
            </button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

const makeMapStateToProps = state => {
  return state;
};

DeleteBlueprint.propTypes = {
  deletingBlueprint: PropTypes.func,
  blueprint: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
};

DeleteBlueprint.defaultProps = {
  deletingBlueprint: function() {},
  blueprint: {}
};

const mapDispatchToProps = dispatch => ({
  deletingBlueprint: blueprint => {
    dispatch(deletingBlueprint(blueprint));
  }
});

export default connect(makeMapStateToProps, mapDispatchToProps)(injectIntl(DeleteBlueprint));
