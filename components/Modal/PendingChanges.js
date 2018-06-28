/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setBlueprintComment } from '../../core/actions/blueprints';
import { Button, OverlayTrigger, Popover, Icon, Alert } from 'patternfly-react';

class PendingChanges extends React.Component {
  constructor() {
    super();
    this.state = {
      comment: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCommitChanges = this.handleCommitChanges.bind(this);
  }

  componentWillMount() {
    this.setState({comment: this.props.blueprint.comment});
  }

  componentDidMount() {
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }

  handleCommitChanges() {
    $('#cmpsr-modal-pending-changes').modal('hide');
    this.props.handleCommit();
  }

  handleChange(e) {
    this.setState({comment: e.target.value});
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-pending-changes"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
              >
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel">Changes Pending Commit</h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <div className="form-group" hidden>
                  <label
                    className="col-sm-3 control-label"
                  >Blueprint</label>
                  <div className="col-sm-9">
                    <p className="form-control-static">{this.props.blueprint.name}</p>
                  </div>
                </div>
                <div className="form-group" hidden>
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput-modal-markup"
                  >Comment</label>
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
                  Only changes to selected components are shown.
                </Alert>
                <p><strong>Blueprint:</strong> {this.props.blueprint.name}</p>
                {this.props.blueprint.localPendingChanges.length !== 0 &&
                  <div>
                    <strong>Pending Changes</strong><span className="text-muted"> (most recent first)</span>
                    <ul className="list-group">
                      {this.props.blueprint.localPendingChanges.map((componentUpdated, index) => (
                        <li className="list-group-item" key={index}>
                          {componentUpdated.componentNew && componentUpdated.componentOld &&
                            <div className="row">
                              <div className="col-sm-3">Updated</div>
                              <div className="col-sm-9">from <strong>{componentUpdated.componentOld}</strong> to <strong>
                                {componentUpdated.componentNew}</strong></div>
                            </div>
                          } {componentUpdated.componentNew && !componentUpdated.componentOld &&
                            <div className="row">
                              <div className="col-sm-3">Added</div>
                              <div className="col-sm-9"><strong>{componentUpdated.componentNew}</strong></div>
                            </div>
                          } {componentUpdated.componentOld && !componentUpdated.componentNew &&
                            <div className="row">
                              <div className="col-sm-3">Removed</div>
                              <div className="col-sm-9"><strong>{componentUpdated.componentOld}</strong></div>
                            </div>
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                {(this.props.blueprint.workspacePendingChanges.addedChanges.length !== 0 ||
                 this.props.blueprint.workspacePendingChanges.deletedChanges.length !== 0) &&
                  <div>
                    <strong>Changes made in a previous session</strong>
                    <OverlayTrigger
                      overlay={
                        <Popover>
                          Changes made in a previous session are not listed
                          in the order they were made. If you choose to undo these
                          changes, they are undone as a group.
                        </Popover>
                        }
                      placement="right"
                      trigger={["click"]}
                      rootClose
                    >
                      <Button bsStyle="link"><Icon type="pf" name="pficon pficon-help" /></Button>
                    </OverlayTrigger>
                    <ul className="list-group">
                    {this.props.blueprint.workspacePendingChanges.addedChanges.length !== 0 &&
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-sm-3">Added</div>
                          <div className="col-sm-9">
                            <ul className="list-unstyled">
                              {this.props.blueprint.workspacePendingChanges.addedChanges.map((componentUpdated, index) => (
                                <li key={index}>
                                  <strong>{componentUpdated.new.Package.name}-{componentUpdated.new.Package.version}</strong>
                                </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    } {this.props.blueprint.workspacePendingChanges.deletedChanges.length !== 0 &&
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-sm-3">Removed</div>
                          <div className="col-sm-9">
                            <ul className="list-unstyled">
                              {this.props.blueprint.workspacePendingChanges.deletedChanges.map((componentUpdated, index) => (
                                <li key={index}>
                                  <strong>{componentUpdated.old.Package.name}-{componentUpdated.old.Package.version}</strong>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    }
                    </ul>
                  </div>
                }
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >Close</button>
              <button type="button" className="btn btn-primary" onClick={() => this.handleCommitChanges()}>Commit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PendingChanges.propTypes = {
  comment: PropTypes.string,
  blueprint: PropTypes.object,
  contents: PropTypes.array,
  handleHideModal: PropTypes.func,
  setBlueprintComment: PropTypes.func,
  handleCommit: PropTypes.func,
  modals: PropTypes.object,
};
const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = (dispatch) => ({
  setBlueprintComment: (blueprint, comment) => {
    dispatch(setBlueprintComment(blueprint, comment));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PendingChanges);
