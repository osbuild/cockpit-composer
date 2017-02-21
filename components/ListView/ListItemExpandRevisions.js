import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import ComponentSummaryList from '../../components/ListView/ComponentSummaryList';
import ListItemLabel from '../../components/ListView/ListItemLabel';

class ListItemExpandRevisions extends React.Component {

  state = { expanded: false }

  componentWillReceiveProps(newProps) {
    // compare old value to new value, and if this component is getting new data,
    // then get the current expand state of the new value as it is in the old dom
    // and apply that expand state to this component
      let olditem = this.props.listItem;
      let newitem = newProps.listItem;
      let parent = this.props.listItemParent;
      if (olditem != newitem) {
          if ($("#" + parent + " [data-name='" + newitem.name + "']").hasClass("list-view-pf-expand-active")) {
            this.setState({expanded: true});
          } else {
            this.setState({expanded: false});
          }
      }
   }

  handleExpandComponent = (event) => {
    // the user clicked a list item in the recipe contents area to expand or collapse
    if(!$(event.target).is("button, a, input, .fa-ellipsis-v")){
      let expandState = this.state.expanded ? false : true;
      this.setState({expanded: expandState});
    }
  }

  render() {
    const { listItem } = this.props;
    let dependencyCount = 0;
    if (listItem.projects !== undefined) {
      dependencyCount = listItem.projects.length;
    }
    return (

            <div className={"list-group-item " + (this.state.expanded ? 'list-view-pf-expand-active' : '')}>
              <div className="list-group-item-header" onClick={(e) => this.handleExpandComponent(e)}>
                <div className="list-view-pf-expand">
                  <span className={"fa fa-angle-right " + (this.state.expanded ? 'fa-angle-down' : 'fa-angle-right')}></span>
                </div>

                <div className="list-view-pf-actions">
                  <div className="dropdown pull-right dropdown-kebab-pf">
                    <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight9" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span className="fa fa-ellipsis-v"></span></button>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight9">
                      <li><a href="#">View Recipe</a></li>
                      { listItem.active === "true" &&
                      <li><a href="#">Edit Recipe</a></li>
                      ||
                      <li><a href="#">Restore and Edit</a></li>
                      }
                      { listItem.active === "true" &&
                      <li><a href="#">Preserve Revision</a></li>
                      ||
                      <li><a href="#">Restore Revision</a></li>
                      }
                      <li><a href="#">Save Revision as New Recipe</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#">Create Composition</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#">Archive</a></li>
                    </ul>
                  </div>
                </div>

                <div className="list-view-pf-main-info">
                  <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                      <div className="list-group-item-heading">
                        <a href="#" data-item="name">Revision { listItem.number }{ listItem.active === "true" && <span>, Current Revision</span>}</a>
                      </div>
                      <div className="list-group-item-text">
                        Based on { listItem.basedOn }
                      </div>
                    </div>
                    <div className="list-view-pf-additional-info">
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Compositions <strong>{ listItem.compositions }</strong>
                      </div>
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Components <strong>{ listItem.components }</strong>
                      </div>
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Install Size <strong>{ listItem.size }</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={"list-group-item-container container-fluid " + (this.state.expanded ? '' : 'hidden')}>
                <div className="close hidden">
                  <span className="pficon pficon-close"></span>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="cmpsr-summary-listview">
                      <p><strong>Compositions</strong> ({listItem.compositions})</p>
                      { listItem.compositions !== "0" &&
                      <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-left" data-item="type">
                              <span className="pf pficon-image list-view-pf-icon-sm" aria-hidden="true"></span>
                            </div>
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#">Composition 1 (iso)</a> <span className="text-muted">created 1/15/17, last exported 2/15/17</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                      }
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="cmpsr-summary-listview">
                      <p><strong>Change Log</strong></p>
                      <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                        { listItem.compositions !== "0" &&
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#">Composition exported</a> <span className="text-muted">2/15/17 by Brian Johnson</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        }
                        { listItem.compositions !== "0" &&
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#">Composition created</a> <span className="text-muted">1/15/17 by Brian Johnson</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        }
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#">Recipe modified</a> <span className="text-muted">12/15/16 by Brian Johnson</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#">Revision created</a> <span className="text-muted">12/15/16 by Brian Johnson</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-group-item hidden">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#" data-item="name">1 component added, 2 components removed by Brian Johnson</a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-group-item hidden">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#" data-item="name">4 components added by swilliams</a>
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

    )
  }
// "Exported 2 times" and creation date, last export date in list item for Compositions
// change log could just be actions, dates, and people for now
}

export default ListItemExpandRevisions;
