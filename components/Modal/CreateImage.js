/* global $ */

import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import NotificationsApi from "../../data/NotificationsApi";
import BlueprintApi from "../../data/BlueprintApi";
import { Button, OverlayTrigger, Popover, Icon, Alert } from "patternfly-react";
import { connect } from "react-redux";
import { setBlueprint } from "../../core/actions/blueprints";
import { fetchingQueue, clearQueue } from "../../core/actions/composes";

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

class CreateImage extends React.Component {
  constructor() {
    super();
    this.state = { imageType: "" };
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  componentWillMount() {
    if (this.props.composeQueueFetched === false) {
      this.props.fetchingQueue();
    }
  }

  componentDidMount() {
    $(this.modal).modal("show");
    if (this.props.handleHideModal) $(this.modal).on("hidden.bs.modal", this.props.handleHideModal);
  }

  componentWillUnmount() {
    this.props.clearQueue();
  }

  handleCreateImage() {
    NotificationsApi.displayNotification(this.props.blueprint.name, "imageWaiting");
    if (this.props.setNotifications) this.props.setNotifications();
    if (this.props.handleStartCompose) this.props.handleStartCompose(this.props.blueprint.name, this.state.imageType);
    $("#cmpsr-modal-crt-image").modal("hide");
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
    this.props.setNotifications();
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
    // const running = 1;
    // const waiting = 2;
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-crt-image"
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
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                <span className="pficon pficon-close" />
              </button>
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage defaultMessage="Create Image" />
              </h4>
            </div>
            <div className="modal-body">
              {this.props.warningEmpty === true && (
                <Alert type="warning">
                  <FormattedMessage defaultMessage="This blueprint is empty." />
                </Alert>
              )}
              {this.props.warningUnsaved === true && (
                <Alert type="warning">{formatMessage(messages.warningUnsaved)}</Alert>
              )}
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label">
                    <FormattedMessage defaultMessage="Blueprint" />
                  </label>
                  <div className="col-sm-9">
                    <p className="form-control-static">{this.props.blueprint.name}</p>
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
                        this.props.imageTypes.map((type, i) => (
                          <option key={i} value={type.name} disabled={!type.enabled}>
                            {type.label}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
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
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage defaultMessage="Cancel" />
              </button>
              {(this.props.warningUnsaved === true && this.state.imageType !== "" && (
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
                  {(this.props.warningUnsaved === true && <FormattedMessage defaultMessage="Commit and Create" />) || (
                    <FormattedMessage defaultMessage="Create" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateImage.propTypes = {
  blueprint: PropTypes.object,
  composeQueue: PropTypes.array,
  composeQueueFetched: PropTypes.bool,
  handleStartCompose: PropTypes.func,
  fetchingQueue: PropTypes.func,
  clearQueue: PropTypes.func,
  handleHideModal: PropTypes.func,
  setNotifications: PropTypes.func,
  imageTypes: PropTypes.array,
  warningEmpty: PropTypes.bool,
  warningUnsaved: PropTypes.bool,
  setBlueprint: PropTypes.func,
  intl: intlShape.isRequired
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CreateImage));
