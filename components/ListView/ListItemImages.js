import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deletingCompose, cancellingCompose } from '../../core/actions/composes';
import { 
  setModalStopBuildVisible, setModalStopBuildState, 
  setModalDeleteImageVisible, setModalDeleteImageState, 
} from '../../core/actions/modals';

class ListItemImages extends React.Component {

  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleShowModalStop = this.handleShowModalStop.bind(this);
    this.handleShowModalDeleteImage = this.handleShowModalDeleteImage.bind(this);
  }

  // maps to Remove button for FAILED
  handleDelete() {
    this.props.deletingCompose(this.props.listItem.id);
  }

  // maps to Stop button for WAITING
  handleCancel() {
    this.props.cancellingCompose(this.props.listItem.id);
  }

  // maps to Stop button for RUNNING
  handleShowModalStop() {
    this.props.setModalStopBuildState(this.props.listItem.id, this.props.blueprint);
    this.props.setModalStopBuildVisible(true);
  }

  // maps to Delete button for FINISHED
  handleShowModalDeleteImage(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.setModalDeleteImageState(this.props.listItem.id, this.props.blueprint);
    this.props.setModalDeleteImageVisible(true);
  }

  render() {
    const { listItem } = this.props;
    const timestamp = new Date(listItem.job_created * 1000);
    const formattedTime = timestamp.toDateString();
    return (
      <div className="list-pf-item">
        <div className="list-pf-container">
          <div className="list-pf-content list-pf-content-flex">
            <div className="list-pf-left">
              <span className="pficon pficon-builder-image list-pf-icon-small" aria-hidden="true" />
            </div>
            <div className="list-pf-content-wrapper">
              <div className="list-pf-main-content">
                <div className="list-pf-title text-overflow-pf">
                  {this.props.blueprint}-ver{listItem.version}-{listItem.compose_type}
                </div>
                <div className="list-pf-description">
                  <FormattedMessage
                    defaultMessage="Based on Version {version}"
                    values={{
                      version: listItem.version
                    }}
                  />
                </div>
              </div>
              <div className="list-pf-additional-content">
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked i18n">
                  <FormattedMessage
                    defaultMessage="Date Created {date}"
                    values={{
                      date: <strong>{formattedTime}</strong>
                    }}
                  />
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked i18n">
                  <FormattedMessage
                    defaultMessage="Type {type}"
                    values={{
                      type: <strong>{listItem.compose_type}</strong>
                    }}
                  />
                </div>
              </div>
            </div>
            {listItem.queue_status === 'WAITING' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-pending" aria-hidden="true" />
                <FormattedMessage defaultMessage="Pending" />
              </div>
            } {listItem.queue_status === 'RUNNING' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-in-progress" aria-hidden="true" />
                <FormattedMessage defaultMessage="In Progress" />
              </div>
            } {listItem.queue_status === 'FINISHED' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-ok" aria-hidden="true" />
                <FormattedMessage defaultMessage="Complete" />
              </div>
            } {listItem.queue_status === 'FAILED' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-error-circle-o" aria-hidden="true" />
                <FormattedMessage defaultMessage="Failed" />
              </div>
            }
            {listItem.queue_status === 'FINISHED' &&
              <div className="list-pf-actions">
                <a className="btn btn-default" role="button" download href={this.props.downloadUrl}>
                  <FormattedMessage defaultMessage="Download" />
                </a>
                <div className="dropdown pull-right dropdown-kebab-pf">
                  <button
                    className="btn btn-link dropdown-toggle"
                    type="button"
                    id="dropdownKebabRight"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                  ><span className="fa fa-ellipsis-v"></span></button>
                  <ul
                    className="dropdown-menu dropdown-menu-right"
                    aria-labelledby="dropdownKebabRight"
                  >
                    <li>
                      <a href="#" onClick={(e) => this.handleShowModalDeleteImage(e)}>
                        <FormattedMessage defaultMessage="Delete" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            } {listItem.queue_status === 'WAITING' &&
              <div className="list-pf-actions">
                <button className="btn btn-default" onClick={this.handleCancel}>
                  <FormattedMessage defaultMessage="Stop" />
                </button>
              </div>
            } {listItem.queue_status === 'RUNNING' &&
              <div className="list-pf-actions">
                <button className="btn btn-default" onClick={this.handleShowModalStop}>
                  <FormattedMessage defaultMessage="Stop" />
                </button>
              </div>
            } {listItem.queue_status === 'STOPPING' &&
              <div className="list-pf-actions">
                <em className="text-muted"><FormattedMessage defaultMessage="Stopping" /></em>
              </div>
            } {listItem.queue_status === 'FAILED' &&
              <div className="list-pf-actions">
                <button className="btn btn-default" onClick={this.handleDelete}>
                  <FormattedMessage defaultMessage="Remove" />
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

ListItemImages.propTypes = {
  listItem: PropTypes.object,
  blueprint: PropTypes.string,
  deletingCompose: PropTypes.func,
  cancellingCompose: PropTypes.func,
  setModalStopBuildState: PropTypes.func,
  setModalStopBuildVisible: PropTypes.func,
  setModalDeleteImageState: PropTypes.func,
  setModalDeleteImageVisible: PropTypes.func,
  downloadUrl: PropTypes.string,
};

const mapDispatchToProps = (dispatch) => ({
  deletingCompose: (compose) => {
    dispatch(deletingCompose(compose));
  },
  cancellingCompose: (compose) => {
    dispatch(cancellingCompose(compose));
  },
  setModalStopBuildState: (composeId, blueprintName) => {
    dispatch(setModalStopBuildState(composeId, blueprintName));
  },
  setModalStopBuildVisible: (visible) => {
    dispatch(setModalStopBuildVisible(visible));
  },
  setModalDeleteImageState: (composeId, blueprintName) => {
    dispatch(setModalDeleteImageState(composeId, blueprintName));
  },
  setModalDeleteImageVisible: (visible) => {
    dispatch(setModalDeleteImageVisible(visible));
  },
});

export default connect(null, mapDispatchToProps)(ListItemImages);
