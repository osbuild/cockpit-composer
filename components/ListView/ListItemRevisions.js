/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link';

class ListItemRevisions extends React.Component {
  constructor() {
    super();
    this.state = { expanded: false };
    this.handleExpandComponent = this.handleExpandComponent.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // compare old value to new value, and if this component is getting new data,
    // then get the current expand state of the new value as it is in the old dom
    // and apply that expand state to this component
    const olditem = this.props.listItem;
    const newitem = newProps.listItem;
    const parent = this.props.listItemParent;
    if (olditem !== newitem) {
      if ($(`#${parent} [data-name='${newitem.name}']`).hasClass('list-view-pf-expand-active')) {
        this.setState({ expanded: true });
      } else {
        this.setState({ expanded: false });
      }
    }
  }

  handleExpandComponent(event) {
    // the user clicked a list item in the recipe contents area to expand or collapse
    if (!$(event.target).is('button, a, input, .fa-ellipsis-v')) {
      const expandState = !this.state.expanded;
      this.setState({ expanded: expandState });
    }
  }

  render() {
    const { listItem } = this.props;
    const comments = this.props.comments.filter(obj => obj.revision === listItem.number);
    const changelog = this.props.changelog.filter(obj => obj.revision === listItem.number);
    const compositions = this.props.compositions.filter(obj => obj.revision === listItem.number);

    return (
      <div className={`list-pf-item ${this.state.expanded ? 'active' : ''}`}>

        <div className="list-pf-container" onClick={this.handleExpandComponent}>
          <div className="list-pf-chevron">
            <span className={`fa ${this.state.expanded ? 'fa-angle-down' : 'fa-angle-right'}`} />
          </div>

          <div className="list-pf-content list-pf-content-flex ">
            <div className="list-pf-content-wrapper">
              <div className="list-pf-main-content">
                <div className="list-pf-title text-overflow-pf">
                  <a>Revision {listItem.number}</a>
                </div>
                <div className="list-pf-description">Based on {listItem.basedOn}</div>
              </div>
              <div className="list-pf-additional-content">
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Compositions <strong>{listItem.compositions}</strong>
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Components <strong>{listItem.components}</strong>
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Install Size <strong>{listItem.size}</strong>
                </div>
              </div>
            </div>
            <div className="list-pf-actions">
              {(listItem.active === true &&
                <Link to={`/edit/${this.props.recipe}`} className="btn btn-default">Edit Recipe</Link>) ||
                <button className="btn btn-default" type="button">Restore and Edit</button>}
              <button
                className="btn btn-default"
                id="cmpsr-btn-crt-compos"
                data-toggle="modal"
                data-target="#cmpsr-modal-crt-compos"
                type="button"
              >
                Create Composition
              </button>
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
                  <li><a>View Recipe</a></li>
                  <li><a href="#" onClick={e => this.props.handleShowModalExport(e)}>Export</a></li>
                  <li role="separator" className="divider" />
                  {(listItem.active === true && <li><a>Clone Revision</a></li>) || <li><a>Restore Revision</a></li>}
                  <li><a>Save Revision as New Recipe</a></li>
                  <li role="separator" className="divider" />
                  <li><a>Archive</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={`list-pf-expansion collapse ${this.state.expanded ? 'in' : ''}`}>
          <div className="list-pf-container" tabIndex="0">
            <div className="list-pf-content">
              <div className="container-fluid ">
                <div className="row">
                  <div className="col-md-6">
                    <div className="cmpsr-summary-listview">
                      <p><strong>Compositions</strong> ({listItem.compositions})</p>
                      <div className="list-pf cmpsr-list-pf__compacted">
                        {compositions.map((composition, i) => (
                          <div className="list-pf-item" key={i}>
                            <div className="list-pf-container">
                              <div className="list-pf-content list-pf-content-flex ">
                                <div className="list-pf-left">
                                  <span className="pf pficon-image list-pf-icon-small" aria-hidden="true" />
                                </div>
                                <div className="list-pf-content-wrapper">
                                  <div className="list-pf-main-content">
                                    <div className="list-pf-description ">
                                      <a>
                                        {this.props.recipe}-rev{composition.revision}-{composition.type}
                                      </a>
                                      <span className="text-muted pull-right">
                                        Last Exported {composition.date_exported},
                                        Created {composition.date_created}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="cmpsr-summary-listview hidden">
                      <p><strong>Comments</strong></p>
                      <div className="input-group">
                        <input type="text" className="form-control" />
                        <span className="input-group-btn">
                          <button className="btn btn-default" type="button">Post Comment</button>
                        </span>
                      </div>
                      <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                        {comments.map((comment, i) => (
                          <div className="list-group-item" key={i}>
                            <div className="list-view-pf-main-info">
                              <div className="list-view-pf-left" data-item="type">
                                <span className="fa fa-comment-o list-view-pf-icon-sm" aria-hidden="true" />
                              </div>
                              <div className="list-view-pf-body">
                                <div className="list-view-pf-description">
                                  <p className="text-muted pull-right">{comment.user}, {comment.date}</p>
                                  <p>{comment.comment}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="cmpsr-summary-listview">
                      <p><strong>Change Log</strong></p>
                      <div className="list-pf cmpsr-list-pf__compacted">
                        {changelog.map((change, i) => (
                          <div className="list-pf-item" key={i}>
                            <div className="list-pf-container">
                              <div className="list-pf-content list-pf-content-flex ">
                                <div className="list-pf-content-wrapper">
                                  <div className="list-pf-main-content">
                                    <div className="list-pf-description">
                                      <a>{change.action}</a>
                                      <span className="text-muted pull-right">{change.date} by {change.user}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListItemRevisions.propTypes = {
  listItem: PropTypes.object,
  listItemParent: PropTypes.string,
  comments: PropTypes.array,
  changelog: PropTypes.array,
  compositions: PropTypes.array,
  recipe: PropTypes.string,
  handleShowModalExport: PropTypes.func,
};

export default ListItemRevisions;
