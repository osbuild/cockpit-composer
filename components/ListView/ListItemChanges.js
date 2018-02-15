/* global $ */

import React from 'react';
import PropTypes from 'prop-types';

class ListItemChanges extends React.Component {
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
    // the user clicked a list item in the blueprint contents area to expand or collapse
    if (!$(event.target).is('button, a, input, .fa-ellipsis-v')) {
      const expandState = !this.state.expanded;
      this.setState({ expanded: expandState });
    }
  }

  render() {
    const { listItem } = this.props;

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
                  Commit {this.props.number}
                  <span className="cmpsr-list-item__text--muted text-muted pull-right">
                    {listItem.time}
                  </span>
                </div>
                <div className="list-pf-description">{listItem.message}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={`list-pf-expansion collapse ${this.state.expanded ? 'in' : ''}`}>
          <div className="list-pf-container" tabIndex="0">
            <div className="list-pf-content">
              <div className="container-fluid ">
                <div className="row">
                  <div className="col-xs-12">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-sm-3">Added</div>
                          <div className="col-sm-9">
                            <div className="row">
                              <div className="col-xs-12">
                                <strong>389-ds-base-1.3.6.1-16.el7</strong>
                              </div>
                              <div className="col-xs-12">
                                <strong>abattis-cantarell-fonts-0.0.25-1.el7</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row">
                          <div className="col-sm-3">Removed</div>
                          <div className="col-sm-9">
                            <div className="row">
                              <div className="col-xs-12">
                                <strong>color-filesystem-1-13.el7</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
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

ListItemChanges.propTypes = {
  listItem: PropTypes.object,
  listItemParent: PropTypes.string,
  number: PropTypes.number,
};

export default ListItemChanges;
