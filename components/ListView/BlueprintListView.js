/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link';

class BlueprintListView extends React.PureComponent {
  constructor() {
    super();
  }

  handleCreateImage(blueprint) {
    this.setState({ blueprint });
    $('#cmpsr-modal-crt-image').modal('show');
  }

  render() {
    const { blueprints } = this.props; // eslint-disable-line no-use-before-define
    return (
      <div className="list-group list-view-pf list-view-pf-view">
        {blueprints.map((blueprint, i) =>
          <div className="list-group-item" key={i}>
            <div className="list-group-item-header">
              <div className="list-view-pf-expand hidden">
                <span className="fa fa-angle-right"></span>
              </div>
              <div className="list-view-pf-checkbox">
                <input type="checkbox" />
              </div>
              <div className="list-view-pf-actions">
                <Link to={`/edit/${blueprint.name}`} className="btn btn-default">
                  Edit Blueprint
                </Link>
                {(blueprint.modules.length === 0 && blueprint.packages.length === 0) &&
                  <button type="button" className="btn btn-default" disabled="disabled">
                    Create Image
                  </button>
                ||
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => this.handleCreateImage(blueprint.name)}
                  >
                    Create Image
                  </button>
                }
                <div className="dropdown pull-right dropdown-kebab-pf">
                  <button
                    className="btn btn-default"
                    onClick={(e) => this.props.handleShowModalCreateImage(e, blueprint)}
                  >
                    {(blueprint.modules.length === 0 && blueprint.packages.length === 0) &&
                      <li className="disabled"><a aria-disabled="true">Export</a></li>
                      ||
                      <li><a href="#" onClick={(e) => this.props.handleShowModalExport(e, blueprint.name)}>Export</a></li>
                    }
                    <li><a href="#" onClick={(e) => this.props.handleShowModalDelete(e, blueprint)}>Delete</a></li>
                  </ul>
                </div>
              </div>
              <div className="list-view-pf-main-info">
                <span className="pficon pficon-template list-pf-icon-small"></span>
                <div className="list-view-pf-body">
                  <div className="list-view-pf-description">
                    <div className="list-group-item-heading">
                      <Link to={`/blueprint/${blueprint.name}`}>{blueprint.name}</Link>
                    </div>
                    <div className="list-group-item-text">
                      {blueprint.description}
                    </div>
                  </div>
                  <div className="list-view-pf-additional-info hidden">
                    <div
                      className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked hidden"
                    >
                      <li><a href="#" onClick={(e) => this.props.handleShowModalExport(e, blueprint.name)}>Export</a></li>
                      <li><a href="#" onClick={(e) => this.props.handleShowModalDelete(e, blueprint)}>Delete</a></li>
                    </ul>
                  </div>
                </div>
                <div className="list-view-pf-main-info">
                  <span className="pficon pficon-template list-pf-icon-small"></span>
                  <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                      <div className="list-group-item-heading">
                        <Link to={`/blueprint/${blueprint.name}`}>{blueprint.name}</Link>
                      </div>
                      <div className="list-group-item-text">
                        {blueprint.description}
                      </div>
                    </div>
                    <div className="list-view-pf-additional-info hidden">
                      <div
                        className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked hidden"
                      >
                        Test<strong>2</strong></div>
                      <div
                        className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked hidden"
                      >
                        Development<strong>0</strong>
                      </div>
                      <div
                        className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked hidden"
                      >
                        Production<strong>1</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="list-group-item-container container-fluid hidden">
                <div className="close hidden">
                  <span className="pficon pficon-close"></span>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="list-group list-view-pf list-view-pf-view">
                      <div className="list-group-item">
                        <div className="list-view-pf-checkbox">
                          <input type="checkbox" />
                        </div>
                        <div className="list-view-pf-actions">
                          <button className="btn btn-default">View Blueprint</button>
                          <button className="btn btn-default">Download</button>
                          <div className="dropdown pull-right dropdown-kebab-pf">
                            <button
                              className="btn btn-link dropdown-toggle"
                              type="button"
                              id="dropdownKebabRight12"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="true"
                            >
                              <span className="fa fa-ellipsis-v"></span>
                            </button>
                            <ul
                              className="dropdown-menu dropdown-menu-right"
                              aria-labelledby="dropdownKebabRight12"
                            >
                              <li><a >Action</a></li>
                              <li><a >Another action</a></li>
                              <li><a >Something else here</a></li>
                              <li role="separator" className="divider"></li>
                              <li><a >Separated link</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="list-view-pf-main-info">
                          <div className="list-view-pf-left">
                            <span className="fa fa-linux list-view-pf-icon-sm"></span>
                          </div>
                          <div className="list-view-pf-body">
                            <div className="list-view-pf-description">
                              <div className="list-group-item-heading">
                                Image 1
                              </div>
                              <div className="list-group-item-text">
                                Created from Version 1
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

BlueprintListView.propTypes = {
  handleShowModalDelete: PropTypes.func,
  blueprints: PropTypes.array,
  setNotifications: PropTypes.func,
  handleShowModalExport: PropTypes.func,
  handleShowModalCreateImage: PropTypes.func,
};

export default BlueprintListView;
