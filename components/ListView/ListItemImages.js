import React from 'react';
import PropTypes from 'prop-types';

class ListItemImages extends React.PureComponent {

  render() {
    const { listItem } = this.props;
    const timestamp = new Date(listItem.timestamp * 1000);
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
                <div className="list-pf-description">Based on Version {listItem.version}</div>
              </div>
              <div className="list-pf-additional-content">
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Type <strong>{listItem.compose_type}</strong>
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Date Created <strong>{formattedTime}</strong>
                </div>
              </div>
            </div>
            {listItem.queue_status === 'WAITING' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-pending" aria-hidden="true" />
                Pending
              </div>
            } {listItem.queue_status === 'RUNNING' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-in-progress" aria-hidden="true" />
                In Progress
              </div>
            } {listItem.queue_status === 'FINISHED' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-ok" aria-hidden="true" />
                Complete
              </div>
            } {listItem.queue_status === 'FAILED' &&
              <div className="list-view-pf-additional-info-item cmpsr-images__status">
                <span className="pficon pficon-error-circle-o" aria-hidden="true" />
                Failed
              </div>
            }
            {listItem.queue_status === 'READY' &&
              <div className="list-pf-actions">
                <button className="btn btn-default" type="button" onClick={() => this.fetchImage(listItem.id)}>Download</button>
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
  blueprint: PropTypes.object,
};

export default ListItemImages;
