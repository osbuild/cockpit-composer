import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import ListItemLabel from '../../components/ListView/ListItemLabel';

class ListItemExpand extends React.Component {

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
    const { key } = this.props; // is this correct?

    return (

            <div data-name={ listItem.name } className={"list-group-item " + (this.state.expanded ? 'list-view-pf-expand-active' : '')} key={key}>
              <div className="list-group-item-header" onClick={(e) => this.handleExpandComponent(e)}>
                <div className="list-view-pf-expand">
                  <span className={"fa fa-angle-right " + (this.state.expanded ? 'fa-angle-down' : 'fa-angle-right')}></span>
                </div>
                <div className="list-view-pf-checkbox">
                  <input type="checkbox" />
                </div>
                <div className="list-view-pf-actions">
                  <div className="dropdown pull-right dropdown-kebab-pf">
                    <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight9" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span className="fa fa-ellipsis-v"></span></button>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight9">
                      <li><a href="#">View</a></li>
                      <li><a href="#">Update</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#" onClick={(e) => this.props.handleRemoveComponent(e, listItem)}>Remove</a></li>
                    </ul>
                  </div>
                </div>
                <div className="list-view-pf-main-info">
                  <div className="list-view-pf-left" data-item="type">
                    <ComponentTypeIcons componentType={ listItem.group_type } />
                  </div>
                  <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                      <div className="list-group-item-heading">
                        { listItem.name }
                      </div>
                      <div className="list-group-item-text">
                        { listItem.summary }
                      </div>
                      <div className="cmpsr-dependency-flag">
                        <span className="pficon pficon-warning-triangle-o"></span>
                      </div>
                    </div>
                    <div className="list-view-pf-additional-info">
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Version <strong>{ listItem.version }</strong>
                      </div>
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Release <strong>{ listItem.release }</strong>
                      </div>
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Lifecycle<strong>01/15/2017</strong>
                      </div>
                      <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                        Dependencies <strong>3</strong>
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
                    <dl className="dl-horizontal">
                      <dt>Version</dt>
                      <dd>{ listItem.version }</dd>
                      <dt>Release</dt>
                      <dd>{ listItem.release }</dd>
                      <dt>Lifecycle</dt>
                      <dd>01/15/2017</dd>
                      <dt>Support Level</dt>
                      <dd>Basic</dd>
                      <dt>Dependencies</dt>
                      <dd>2</dd>
                    </dl>
                    <strong>Errata</strong>
                    <ul>
                      <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                      <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                      <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                      <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                      <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                    </ul>
                  </div>
                  <div className="col-md-6 cmpsr-summary-listview">
                    { listItem.group_type != "rpm" && <div>
                      <strong>Child Components (4)</strong>
                      <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-left" data-item="type">
                              <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
                            </div>
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#" data-item="name">fm-group:rpm-development-tools</a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-left" data-item="type">
                              <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
                            </div>
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#" data-item="name">fm-group:rpm-development-tools</a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#">View More</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> }
                    {this.props.isDependency && <div>
                      <strong>Required By (1)</strong>
                      <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                        <div className="list-group-item">
                          <div className="list-view-pf-main-info">
                            <div className="list-view-pf-left" data-item="type">
                              <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
                            </div>
                            <div className="list-view-pf-body">
                              <div className="list-view-pf-description">
                                <a href="#" data-item="name">fm-group:rpm-development-tools</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> }
                    <strong>Dependencies (2)</strong>
                    <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                      <div className="list-group-item">
                        <div className="list-view-pf-main-info">
                          <div className="list-view-pf-left" data-item="type">
                            <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
                          </div>
                          <div className="list-view-pf-body">
                            <div className="list-view-pf-description">
                              <a href="#" data-item="name">fm-group:rpm-development-tools</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item">
                        <div className="list-view-pf-main-info">
                          <div className="list-view-pf-left" data-item="type">
                            <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
                          </div>
                          <div className="list-view-pf-body">
                            <div className="list-view-pf-description">
                              <a href="#" data-item="name">fm-group:rpm-development-tools</a>
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

}

export default ListItemExpand;
