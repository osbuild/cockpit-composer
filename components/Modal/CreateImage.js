/* global $ */

import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import NotificationsApi from '../../data/NotificationsApi';
import { Alert } from 'patternfly-react';

const messages = defineMessages({
  warningUnsaved: {
    defaultMessage: "This blueprint has changes that are not committed. " +
                    "These changes will not be included in the image."
  }
});

class CreateImage extends React.Component {
  constructor() {
    super();
    this.state = { imageType: '' };
    this.handleCreateImage = this.handleCreateImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
              <button type="button" className="btn btn-primary" onClick={this.handleCreateImage}>
                <FormattedMessage defaultMessage="Create" />
              </button>
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
  intl: intlShape.isRequired,
};

export default injectIntl(CreateImage);
