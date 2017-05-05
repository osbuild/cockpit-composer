import React from 'react';

class ListItemCompositions extends React.PureComponent {

  render() {
    const { listItem } = this.props;

    return (
      <div className="list-group-item">
        <div className="list-group-item-header">
          <div className="list-view-pf-actions">
            <button className="btn btn-default" type="button">Download</button>
            <div className="dropdown pull-right dropdown-kebab-pf">
              <button
                className="btn btn-link dropdown-toggle"
                type="button"
                id="dropdownKebabRight9"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              ><span className="fa fa-ellipsis-v"></span></button>
              <ul
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="dropdownKebabRight9"
              >
                <li><a >View Recipe Components</a></li>
                <li><a >View Recipe Manifest</a></li>
                <li><a >Export</a></li>
                <li role="separator" className="divider"></li>
                <li><a >Archive</a></li>
              </ul>
            </div>
          </div>

          <div className="list-view-pf-main-info">
            <div className="list-view-pf-body">
              <div className="list-view-pf-description">
                <div className="list-group-item-heading">
                  <a data-item="name">
                    {this.props.recipe}-rev{listItem.revision}-{listItem.type}
                  </a>
                </div>
                <div className="list-group-item-text">
                  Based on revision {listItem.revision}
                </div>
              </div>
              <div className="list-view-pf-additional-info">
                <div
                  className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"
                >
                  Type <strong>{listItem.type}</strong>
                </div>
                <div
                  className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"
                >
                  Date Created <strong>{listItem.date_created}</strong>
                </div>
                <div
                  className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"
                >
                  Install Size <strong>{listItem.size}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    );
  }
}

ListItemCompositions.propTypes = {
  listItem: React.PropTypes.object,
};

export default ListItemCompositions;
