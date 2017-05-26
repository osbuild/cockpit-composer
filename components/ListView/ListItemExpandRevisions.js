import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link';


class ListItemExpandRevisions extends React.Component {

  state = { expanded: false }

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

  handleExpandComponent = (event) => {
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
      <div className={`list-group-item ${this.state.expanded ? 'list-view-pf-expand-active' : ''}`}>
        <div className="list-group-item-header" onClick={(e) => this.handleExpandComponent(e)}>
          <div className="list-view-pf-expand">
            <span
              className={`fa ${this.state.expanded ? 'fa-angle-right fa-angle-down' : 'fa-angle-right'}`}
            ></span>
          </div>

          <div className="list-view-pf-actions">
            {listItem.active === true &&
              <Link to={`/edit/${this.props.recipe}`} className="btn btn-default">Edit Recipe</Link>
              ||
              <button className="btn btn-default" type="button">Restore and Edit</button>
            }
            <button
              className="btn btn-default"
              id="cmpsr-btn-crt-compos"
              data-toggle="modal"
              data-target="#cmpsr-modal-crt-compos"
              type="button"
            >Create Composition</button>
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
                <li><a >View Recipe</a></li>
                <li><a href="#" onClick={(e) => this.props.handleShowModalExport(e)}>Export</a></li>
                <li role="separator" className="divider"></li>
                {listItem.active === true &&
                  <li><a >Clone Revision</a></li>
                  ||
                  <li><a >Restore Revision</a></li>
                }
                <li><a >Save Revision as New Recipe</a></li>
                <li role="separator" className="divider"></li>
                <li><a >Archive</a></li>
              </ul>
            </div>
          </div>

          <div className="list-view-pf-main-info">
            <div className="list-view-pf-body">
              <div className="list-view-pf-description">
                <div className="list-group-item-heading">
                  <a data-item="name">Revision {listItem.number}</a>
                </div>
                <div className="list-group-item-text">
                  Based on {listItem.basedOn}
                </div>
              </div>
              <div className="list-view-pf-additional-info">
                <div
                  className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"
                >
                  Compositions <strong>{listItem.compositions}</strong>
                </div>
                <div
                  className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked"
                >
                  Components <strong>{listItem.components}</strong>
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

        <div
          className={
            `list-group-item-container container-fluid
            ${this.state.expanded ? '' : 'hidden'}`
          }
        >
          <div className="close hidden">
            <span className="pficon pficon-close"></span>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="cmpsr-summary-listview">
                <p><strong>Compositions</strong> ({listItem.compositions})</p>
                <div
                  className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny"
                >
                  {compositions.map((composition, i) =>
                    <div className="list-group-item" key={i}>
                      <div className="list-view-pf-main-info">
                        <div className="list-view-pf-left" data-item="type">
                          <span className="pf pficon-image list-view-pf-icon-sm" aria-hidden="true">
                          </span>
                        </div>
                        <div className="list-view-pf-body">
                          <div className="list-view-pf-description">
                            <a >
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
                  )}
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
                <div
                  className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny"
                >
                  {comments.map((comment, i) =>
                    <div className="list-group-item" key={i}>
                      <div className="list-view-pf-main-info">
                        <div className="list-view-pf-left" data-item="type">
                          <span className="fa fa-comment-o list-view-pf-icon-sm" aria-hidden="true">
                          </span>
                        </div>
                        <div className="list-view-pf-body">
                          <div className="list-view-pf-description">
                            <p className="text-muted pull-right">{comment.user}, {comment.date}</p>
                            <p>{comment.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="cmpsr-summary-listview">
                <p><strong>Change Log</strong></p>
                <div
                  className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny"
                >
                  {changelog.map((change, i) =>
                    <div className="list-group-item" key={i}>
                      <div className="list-view-pf-main-info">
                        <div className="list-view-pf-body">
                          <div className="list-view-pf-description">
                            <a >{change.action}</a>
                            <span
                              className="text-muted pull-right"
                            >{change.date} by {change.user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    );
  }
}

ListItemExpandRevisions.propTypes = {
  listItem: PropTypes.object,
  listItemParent: PropTypes.string,
  comments: PropTypes.array,
  changelog: PropTypes.array,
  compositions: PropTypes.array,
  recipe: PropTypes.string,
  handleShowModalExport: PropTypes.func,
};

export default ListItemExpandRevisions;
