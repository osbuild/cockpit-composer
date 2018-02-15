/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import NotificationsApi from '../../data/NotificationsApi';

class CreateImage extends React.Component {
  constructor() {
    super();
    this.handleCreateImage = this.handleCreateImage.bind(this);
  }

  handleCreateImage() {
    $('#cmpsr-modal-crt-image').modal('hide');
    NotificationsApi.displayNotification(this.props.blueprint, 'creating');
    this.props.setNotifications();
  }

  render() {
    return (
      <div
        className="modal fade"
        id="cmpsr-modal-crt-image"
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
              <h4 className="modal-title" id="myModalLabel">Create Image</h4>
            </div>
            <div className="modal-body">
              <form className="form-horizontal">
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                  >Blueprint</label>
                  <div className="col-sm-9">
                    <p className="form-control-static">{this.props.blueprint}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput-modal-markup"
                  >Image Type</label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      {this.props.imageTypes !== undefined && this.props.imageTypes.map((type, i) =>
                        <option key={i} disabled={!type.enabled}>{type.name}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    className="col-sm-3 control-label"
                    htmlFor="textInput2-modal-markup"
                  >Architecture</label>
                  <div className="col-sm-9">
                    <select className="form-control">
                      <option>x86_64</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={this.handleCreateImage}>Create</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateImage.propTypes = {
  blueprint: PropTypes.string,
  setNotifications: PropTypes.func,
  imageTypes: PropTypes.array,
};

export default CreateImage;
