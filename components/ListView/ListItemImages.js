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
              <span className="pf pficon-builder-image list-pf-icon-small" aria-hidden="true" />
            </div>
            <div className="list-pf-content-wrapper">
              <div className="list-pf-main-content">
                <div className="list-pf-title text-overflow-pf">
                  <a href="#">{this.props.blueprint}-ver{listItem.version}-{listItem.compose_type}</a>
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
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Install Size <strong>{listItem.image_size}</strong>
                </div>
              </div>
            </div>
            {listItem.queue_status === 'READY' &&
              <div className="list-pf-actions">
                <button className="btn btn-default" type="button" onClick={() => this.fetchImage(listItem.id)}>Download</button>
                <div className="dropdown pull-right dropdown-kebab-pf">
                  <button
                    className="btn btn-link dropdown-toggle"
                    type="button"
                    id="dropdownKebabRight9"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    <span className="fa fa-ellipsis-v" />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight9">
                    <li><a>View Blueprint Components</a></li>
                    <li><a>View Blueprint Manifest</a></li>
                    <li><a>Export</a></li>
                    <li role="separator" className="divider" />
                    <li><a>Archive</a></li>
                  </ul>
                </div>
              </div>
            ||
              <div><strong>{this.props.listItem.queue_status}</strong></div>
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
