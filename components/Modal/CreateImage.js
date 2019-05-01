import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { Button, OverlayTrigger, Popover, Icon, Alert, Modal } from "patternfly-react";
import { connect } from "react-redux";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue, startCompose } from "../../core/actions/composes";

const messages = defineMessages({
  infotip: {
    defaultMessage: "This process can take a while. " + "Images are built in the order they are started."
  },
  warningUnsaved: {
    defaultMessage:
      "This blueprint has changes that are not committed. " +
      "These changes will be committed before the image is created."
  },
  selectOne: {
    defaultMessage: "Select one"
  }
});

class CreateImageModal extends React.Component {
  constructor() {
    super();
    this.state = { imageType: "" };
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.setNotifications = this.setNotifications.bind(this);
  }

  componentWillMount() {
    if (this.props.composeQueueFetched === false) {
      this.props.fetchingQueue();
    }
  }

  componentWillUnmount() {
    this.props.clearQueue();
  }

  setNotifications() {
    this.props.layout.setNotifications();
  }

  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  handleCreateImage() {
    NotificationsApi.displayNotification(this.props.blueprint.name, "imageWaiting");
    if (this.setNotifications) this.setNotifications();
    if (this.handleStartCompose) this.handleStartCompose(this.props.blueprint.name, this.state.imageType);
    this.props.close();
  }

  handleChange(event) {
    this.setState({ imageType: event.target.value });
  }

  handleCommit() {
    // clear existing notifications
    NotificationsApi.closeNotification(undefined, "committed");
    NotificationsApi.closeNotification(undefined, "committing");
    // display the committing notification
    NotificationsApi.displayNotification(this.props.blueprint.name, "committing");
    this.setNotifications();
    // post blueprint (includes 'committed' notification)
    Promise.all([BlueprintApi.handleCommitBlueprint(this.props.blueprint)])
      .then(() => {
        // then after blueprint is posted, reload blueprint details
        // to get details that were updated during commit (i.e. version)
        // and call create image
        Promise.all([BlueprintApi.reloadBlueprintDetails(this.props.blueprint)])
          .then(data => {
            const blueprintToSet = Object.assign({}, this.props.blueprint, {
              version: data[0].version
            });
            this.props.setBlueprint(blueprintToSet);
            this.handleCreateImage();
          })
          .catch(e => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch(e => console.log(`Error in blueprint commit: ${e}`));
  }

  render() {
    const { formatMessage } = this.props.intl;
    const running = this.props.composeQueue.filter(compose => compose.queue_status === "RUNNING").length;
    const waiting = this.props.composeQueue.filter(compose => compose.queue_status === "WAITING").length;
    const modalBody = (
      <React.Fragment>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-3 control-label" htmlFor="blueprint-name">
              <FormattedMessage defaultMessage="Blueprint" />
            </label>
            <div className="col-sm-9">
              <p className="form-control-static" id="blueprint-name">
                {this.props.blueprint.name}
              </p>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label required-pf" htmlFor="textInput-modal-markup">
              <FormattedMessage defaultMessage="Image Type" />
            </label>
            <div className="col-sm-9">
              <select
                id="textInput-modal-markup"
                className="form-control"
                required
                value={this.state.imageType}
                onChange={this.handleChange}
              >
                <option value="" disabled hidden>
                  {formatMessage(messages.selectOne)}
                </option>
                {this.props.imageTypes !== undefined &&
                  this.props.imageTypes.map(type => (
                    <option key={type.name} value={type.name} disabled={!type.enabled}>
                      {type.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </form>
      </React.Fragment>
    );

    const warningEmpty = this.props.blueprint.packages.length === 0 && this.props.blueprint.modules.length === 0;
    const warningUnsaved =
      this.props.blueprint.workspacePendingChanges.length > 0 || this.props.blueprint.localPendingChanges.length > 0;
    const warnings = (
      <React.Fragment>
        {warningEmpty && (
          <Alert type="warning">
            <FormattedMessage defaultMessage="This blueprint is empty." />
          </Alert>
        )}
        {warningUnsaved && <Alert type="warning">{formatMessage(messages.warningUnsaved)}</Alert>}
      </React.Fragment>
    );

    // const running = 1;
    // const waiting = 2;
    return (
      <Modal show onHide={this.props.close} id="cmpsr-modal-crt-image">
        <Modal.Header>
          <Modal.CloseButton onClick={this.props.close} />
          <Modal.Title>
            {" "}
            <FormattedMessage defaultMessage="Create Image" />{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {warnings}
          {modalBody}
        </Modal.Body>
        <Modal.Footer>
          <div className="pull-left">
            <OverlayTrigger
              overlay={
                <Popover id="CreateImageInfotip">
                  <p>{formatMessage(messages.infotip)}</p>
                  {running >= 1 && <FormattedMessage defaultMessage="1 build is in progress" tagName="p" />}
                  {waiting >= 1 && (
                    <FormattedMessage
                      defaultMessage="{builds, plural,
                            one   {# build is waiting}
                            other {# builds are waiting}
                          }"
                      tagName="p"
                      values={{
                        builds: waiting
                      }}
                    />
                  )}
                </Popover>
              }
              placement="right"
              trigger={["click"]}
              rootClose
            >
              <Button bsStyle="link">
                <Icon type="pf" name="pficon pficon-help" />
              </Button>
            </OverlayTrigger>
          </div>
          <button type="button" className="btn btn-default" onClick={this.props.close}>
            <FormattedMessage defaultMessage="Cancel" />
          </button>
          {(warningUnsaved && this.state.imageType !== "" && (
            <button type="button" className="btn btn-primary" onClick={this.handleCommit}>
              <FormattedMessage defaultMessage="Commit and Create" />
            </button>
          )) ||
            (this.state.imageType !== "" && (
              <button type="button" className="btn btn-primary" onClick={this.handleCreateImage}>
                <FormattedMessage defaultMessage="Create" />
              </button>
            ))}
          {this.state.imageType === "" && (
            <button type="button" className="btn btn-primary" disabled>
              {(warningUnsaved && <FormattedMessage defaultMessage="Commit and Create" />) || (
                <FormattedMessage defaultMessage="Create" />
              )}
            </button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

CreateImageModal.propTypes = {
  blueprint: PropTypes.shape({
    changed: PropTypes.bool,
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.array,
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  composeQueue: PropTypes.arrayOf(PropTypes.object).isRequired,
  composeQueueFetched: PropTypes.bool.isRequired,
  fetchingQueue: PropTypes.func.isRequired,
  clearQueue: PropTypes.func.isRequired,
  imageTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  setBlueprint: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  startCompose: PropTypes.func.isRequired,
  layout: PropTypes.shape({
    setNotifications: PropTypes.func
  }).isRequired,
  close: PropTypes.func.isRequired
};

class CreateImage extends React.Component {
  constructor() {
    super();
    this.state = { showModal: false };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-default" id="cmpsr-btn-crt-image" type="button" onClick={this.open}>
          <FormattedMessage defaultMessage="Create Image" />
        </button>
        {this.state.showModal && (
          <CreateImageModal
            blueprint={this.props.blueprint}
            composeQueue={this.props.composeQueue}
            composeQueueFetched={this.props.composeQueueFetched}
            fetchingQueue={this.props.fetchingQueue}
            clearQueue={this.props.clearQueue}
            imageTypes={this.props.imageTypes}
            setBlueprint={this.props.setBlueprint}
            intl={this.props.intl}
            startCompose={this.props.startCompose}
            layout={this.props.layout}
            close={this.close}
          />
        )}
      </React.Fragment>
    );
  }
}

CreateImage.propTypes = {
  blueprint: PropTypes.shape({
    changed: PropTypes.bool,
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.array,
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object)
  }),
  composeQueue: PropTypes.arrayOf(PropTypes.object),
  composeQueueFetched: PropTypes.bool,
  fetchingQueue: PropTypes.func,
  clearQueue: PropTypes.func,
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  setBlueprint: PropTypes.func,
  intl: intlShape.isRequired,
  startCompose: PropTypes.func,
  layout: PropTypes.shape({
    setNotifications: PropTypes.func
  })
};

CreateImage.defaultProps = {
  blueprint: {},
  composeQueue: [],
  composeQueueFetched: true,
  fetchingQueue: function() {},
  clearQueue: function() {},
  imageTypes: [],
  setBlueprint: function() {},
  startCompose: function() {},
  layout: {}
};

const mapStateToProps = state => ({
  composeQueue: state.composes.queue,
  composeQueueFetched: state.composes.queueFetched
});

const mapDispatchToProps = dispatch => ({
  setBlueprint: blueprint => {
    dispatch(setBlueprint(blueprint));
  },
  fetchingQueue: () => {
    dispatch(fetchingQueue());
  },
  clearQueue: () => {
    dispatch(clearQueue());
  },
  startCompose: (blueprintName, composeType) => {
    dispatch(startCompose(blueprintName, composeType));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CreateImage));
