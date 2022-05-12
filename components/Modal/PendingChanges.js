import React from "react";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, OverlayTrigger, Popover, Icon, Alert } from "patternfly-react";
import { setBlueprintComment } from "../../core/actions/blueprints";

const messages = defineMessages({
  previousSessionInfotip: {
    defaultMessage:
      "Changes made in a previous session are not listed " +
      "in the order they were made. If you choose to undo these " +
      "changes, they are undone as a group.",
  },
  blueprint: {
    defaultMessage: "Blueprint",
  },
  closeButtonLabel: {
    defaultMessage: "Close",
  },
  commitButtonLabel: {
    defaultMessage: "Commit",
  },
  parenthetical: {
    defaultMessage: "(most recent first)",
    description: "Describes the sort order of the pending changes",
  },
});

class PendingChanges extends React.Component {
  constructor() {
    super();
    this.state = {
      comment: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCommitChanges = this.handleCommitChanges.bind(this);
  }

  componentDidMount() {
    this.setState({ comment: this.props.blueprint.comment });
    $(this.modal).modal("show");
    $(this.modal).on("hidden.bs.modal", this.props.handleHideModal);
  }

  handleCommitChanges() {
    $("#cmpsr-modal-pending-changes").modal("hide");
    this.props.handleCommit();
  }

  handleChange(e) {
    this.setState({ comment: e.target.value });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-pending-changes"
        ref={(c) => {
          this.modal = c;
        }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label={formatMessage(messages.closeButtonLabel)}
              >
                <span className="pficon pficon-close" />
              </button>
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage defaultMessage="Changes pending commit" />
              </h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <div className="form-group" hidden>
                  <label className="col-sm-3 control-label">{formatMessage(messages.blueprint)}</label>
                  <div className="col-sm-9">
                    <p className="form-control-static">{this.props.blueprint.name}</p>
                  </div>
                </div>
                <div className="form-group" hidden>
                  <label className="col-sm-3 control-label" htmlFor="textInput-modal-markup">
                    <FormattedMessage defaultMessage="Comment" />
                  </label>
                  <div className="col-sm-9">
                    <textarea
                      id="textInput-modal-markup"
                      className="form-control"
                      rows="1"
                      value={this.state.comment}
                      onChange={(e) => this.handleChange(e)}
                      onBlur={() => this.props.setBlueprintComment(this.props.blueprint, this.state.comment)}
                    />
                  </div>
                </div>
                <Alert type="info">
                  <FormattedMessage defaultMessage="Only changes to selected components are shown." />
                </Alert>
                <p>
                  <strong>{formatMessage(messages.blueprint)}: </strong>
                  {this.props.blueprint.name}
                </p>
                {this.props.blueprint.localPendingChanges.length !== 0 && (
                  <div>
                    <FormattedMessage
                      defaultMessage="{heading} {parenthetical}"
                      values={{
                        heading: <FormattedMessage defaultMessage="Pending changes" tagName="strong" />,
                        parenthetical: <span className="text-muted"> {formatMessage(messages.parenthetical)}</span>,
                      }}
                    />
                    <ul className="list-group">
                      {this.props.blueprint.localPendingChanges.map((componentUpdated) => (
                        <li
                          className="list-group-item"
                          key={
                            !componentUpdated.componentNew
                              ? componentUpdated.componentOld
                              : componentUpdated.componentNew
                          }
                        >
                          {componentUpdated.componentNew && componentUpdated.componentOld && (
                            <div className="row">
                              <div className="col-sm-3">
                                <FormattedMessage
                                  defaultMessage="Updated"
                                  description="Identifies the change as a component that was updated"
                                />
                              </div>
                              <div className="col-sm-9">
                                <strong>
                                  <FormattedMessage
                                    defaultMessage="{from} {oldVersion} {to} {newVersion}"
                                    values={{
                                      from: (
                                        <span className="text-muted">
                                          <FormattedMessage defaultMessage="from" />{" "}
                                        </span>
                                      ),
                                      oldVersion: componentUpdated.componentOld,
                                      to: (
                                        <span className="text-muted">
                                          <FormattedMessage defaultMessage="to" />{" "}
                                        </span>
                                      ),
                                      newVersion: componentUpdated.componentNew,
                                    }}
                                  />
                                </strong>
                              </div>
                            </div>
                          )}
                          {componentUpdated.componentNew && !componentUpdated.componentOld && (
                            <div className="row">
                              <div className="col-sm-3">
                                <FormattedMessage
                                  defaultMessage="Added"
                                  description="Identifies the change as a component that was added"
                                />
                              </div>
                              <div className="col-sm-9">
                                <strong>{componentUpdated.componentNew}</strong>
                              </div>
                            </div>
                          )}
                          {componentUpdated.componentOld && !componentUpdated.componentNew && (
                            <div className="row">
                              <div className="col-sm-3">
                                <FormattedMessage
                                  defaultMessage="Removed"
                                  description="Identifies the change as a component that was removed"
                                />
                              </div>
                              <div className="col-sm-9">
                                <strong>{componentUpdated.componentOld}</strong>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {this.props.blueprint.workspacePendingChanges.length !== 0 && (
                  <div>
                    <FormattedMessage defaultMessage="Changes made in a previous session" tagName="strong" />
                    <OverlayTrigger
                      overlay={
                        <Popover id="previous-session-changes-popover">
                          {formatMessage(messages.previousSessionInfotip)}
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
                    <ul className="list-group">
                      {this.props.blueprint.workspacePendingChanges.map((change) => (
                        <li
                          className="list-group-item"
                          key={!change.componentNew ? change.componentOld.name : change.componentNew.name}
                        >
                          {change.componentNew && change.componentOld && (
                            <div className="row">
                              <div className="col-sm-3">
                                <FormattedMessage
                                  defaultMessage="Updated"
                                  description="Identifies the change as a component that was updated"
                                />
                              </div>
                              <div className="col-sm-9">
                                <strong>
                                  <FormattedMessage
                                    defaultMessage="{from} {oldVersion} {to} {newVersion}"
                                    values={{
                                      from: (
                                        <span className="text-muted">
                                          <FormattedMessage defaultMessage="from" />{" "}
                                        </span>
                                      ),
                                      oldVersion: `${change.componentOld.name}-${change.componentOld.version}`,
                                      to: (
                                        <span className="text-muted">
                                          <FormattedMessage defaultMessage="to" />{" "}
                                        </span>
                                      ),
                                      newVersion: `${change.componentNew.name}-${change.componentNew.version}`,
                                    }}
                                  />
                                </strong>
                              </div>
                            </div>
                          )}
                          {change.componentNew && !change.componentOld && (
                            <div className="row">
                              <div className="col-sm-3">
                                <FormattedMessage
                                  defaultMessage="Added"
                                  description="Identifies the change as a component that was added"
                                />
                              </div>
                              <div className="col-sm-9">
                                <strong>
                                  {change.componentNew.name}-{change.componentNew.version}
                                </strong>
                              </div>
                            </div>
                          )}
                          {change.componentOld && !change.componentNew && (
                            <div className="row">
                              <div className="col-sm-3">
                                <FormattedMessage
                                  defaultMessage="Removed"
                                  description="Identifies the change as a component that was removed"
                                />
                              </div>
                              <div className="col-sm-9">
                                <strong>
                                  {change.componentOld.name}-{change.componentOld.version}
                                </strong>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                {formatMessage(messages.closeButtonLabel)}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleCommitChanges()}>
                {formatMessage(messages.commitButtonLabel)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PendingChanges.propTypes = {
  blueprint: PropTypes.shape({
    components: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.arrayOf(PropTypes.object),
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object),
    comment: PropTypes.string,
  }),
  handleHideModal: PropTypes.func,
  setBlueprintComment: PropTypes.func,
  handleCommit: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

PendingChanges.defaultProps = {
  blueprint: {},
  handleHideModal() {},
  setBlueprintComment() {},
  handleCommit() {},
};

const mapStateToProps = (state) => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  setBlueprintComment: (blueprint, comment) => {
    dispatch(setBlueprintComment(blueprint, comment));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PendingChanges));
