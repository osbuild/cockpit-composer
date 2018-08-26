/* global $ */

import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import NotificationsApi from '../../data/NotificationsApi';
import { Alert } from 'patternfly-react';
import BlueprintApi from '../../data/BlueprintApi';
import { connect } from 'react-redux';
import { setBlueprint } from '../../core/actions/blueprints';

const messages = defineMessages({
  warningUnsaved: {
    defaultMessage: "This blueprint has changes that are not committed. " +
      "These changes will be committed before the image is created."
  }
});

class CreateImage extends React.Component {
  constructor() {
    super();
    this.state = { imageType: '' };
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  componentWillMount() {
    this.setState({ imageType: this.props.imageTypes[0].name });
  }

  componentDidMount() {
    $(this.modal).modal('show');
    if (this.props.handleHideModal)
      $(this.modal).on('hidden.bs.modal', this.props.handleHideModal);
  }

  handleCreateImage() {
    NotificationsApi.displayNotification(this.props.blueprint.name, 'imageWaiting');
    if (this.props.setNotifications)
      this.props.setNotifications();
    if (this.props.handleStartCompose)
      this.props.handleStartCompose(this.props.blueprint.name, this.state.imageType);
    $('#cmpsr-modal-crt-image').modal('hide');
  }

  handleChange(event) {
    this.setState({imageType: event.target.value});
  }

  handleCommit() {
    // clear existing notifications
    NotificationsApi.closeNotification(undefined, 'committed');
    NotificationsApi.closeNotification(undefined, 'committing');
    // display the committing notification
    NotificationsApi.displayNotification(this.props.blueprint.name, 'committing');
    this.props.setNotifications();
    // post blueprint (includes 'committed' notification)
    Promise.all([BlueprintApi.handleCommitBlueprint(this.props.blueprint)])
      .then(() => {
        // then after blueprint is posted, reload blueprint details
        // to get details that were updated during commit (i.e. version)
        // and call create image     
        Promise.all([BlueprintApi.reloadBlueprintDetails(this.props.blueprint)])
          .then(data => {
            const blueprintToSet = this.props.blueprint;
            blueprintToSet.name = data[0].name;
            blueprintToSet.description = data[0].description;
            blueprintToSet.version = data[0].version;
            this.props.setBlueprint(blueprintToSet);
            this.handleCreateImage();
          })
          .catch(e => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch(e => console.log(`Error in blueprint commit: ${e}`));
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-crt-image"
        ref={(c) => { this.modal = c; }}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                <span className="pficon pficon-close"></span>
              </button>
              <h4 className="modal-title" id="myModalLabel"><FormattedMessage defaultMessage="Create Image" /></h4>
            </div>
            <div className="modal-body">
              {this.props.warningEmpty === true &&
                <Alert type="warning">
                  <FormattedMessage defaultMessage="This blueprint is empty." />
                </Alert>
              }
              {this.props.warningUnsaved === true &&
                <Alert type="warning">
                  {formatMessage(messages.warningUnsaved)}
                </Alert>
              }
              <form className="form-horizontal">
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                  ><FormattedMessage defaultMessage="Blueprint" /></label>
                  <div className="col-sm-9">
                    <p className="form-control-static">{this.props.blueprint.name}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput-modal-markup"
                  ><FormattedMessage defaultMessage="Image Type" /></label>
                  <div className="col-sm-9">
                    <select className="form-control" value={this.state.imageType} onChange={this.handleChange}>
                      {this.props.imageTypes !== undefined && this.props.imageTypes.map((type, i) =>
                        <option key={i} value={type.name} disabled={!type.enabled}>{type.name}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput2-modal-markup"
                  ><FormattedMessage defaultMessage="Architecture" /></label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <FormattedMessage defaultMessage="x86_64" tagName="option" />
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage defaultMessage="Cancel" />
              </button>
              {this.props.warningUnsaved === true &&
                <button type="button" className="btn btn-primary" onClick={this.handleCommit}>
                  <FormattedMessage defaultMessage="Commit and Create" />
                </button>
              ||
                <button type="button" className="btn btn-primary" onClick={this.handleCreateImage}>
                  <FormattedMessage defaultMessage="Create" />
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateImage.propTypes = {
  blueprint: PropTypes.object,
  handleStartCompose: PropTypes.func,
  handleHideModal: PropTypes.func,
  setNotifications: PropTypes.func,
  imageTypes: PropTypes.array,
  warningEmpty: PropTypes.bool,
  warningUnsaved: PropTypes.bool,
  setBlueprint: PropTypes.func,
  intl: intlShape.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  setBlueprint: blueprint => {
    dispatch(setBlueprint(blueprint));
  },
});

export default connect(null, mapDispatchToProps)(injectIntl(CreateImage));
