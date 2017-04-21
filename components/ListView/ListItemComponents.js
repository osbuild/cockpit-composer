import React from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import ComponentSummaryList from '../../components/ListView/ComponentSummaryList';
import MetadataApi from '../../data/MetadataApi';
import constants from '../../core/constants';

class ListItemComponents extends React.Component {

  state = { expanded: false, dependencies: [], showAllDeps: false }

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

  getDependencies(component) {
    const p = new Promise((resolve, reject) => {
      Promise.all([
        MetadataApi.getData(constants.get_modules_info + component.name),
      ]).then((data) => {
        const dependencies = data[0].modules[0].dependencies;
        this.setState({ dependencies });
        resolve();
      }).catch(e => {
        console.log(`getDependencies: Error getting dependencies: ${e}`);
        reject();
      });
    });
    return p;
  }

  handleExpandComponent = (event) => {
    // the user clicked a list item in the recipe contents area to expand or collapse
    if (!$(event.target).is('button, a, input, .fa-ellipsis-v')) {
      const expandState = !this.state.expanded;
      this.setState({ expanded: expandState });
      if (expandState === true && this.state.dependencies.length === 0) {
        this.getDependencies(this.props.listItem);
      }
    }
  }

  render() {
    const { listItem } = this.props;
    return (
      <div data-name={listItem.name} className={`list-group-item ${this.state.expanded ? 'list-view-pf-expand-active' : ''}`}>
        <div className="list-group-item-header" onClick={(e) => this.handleExpandComponent(e)}>
          <div className="list-view-pf-expand">
            <span className={`fa fa-angle-right ${this.state.expanded ? 'fa-angle-down' : 'fa-angle-right'}`}></span>
          </div>
          <div className="list-view-pf-checkbox">
            <input type="checkbox" />
          </div>
          {this.props.noEditComponent !== true &&
            <div className="list-view-pf-actions">
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
                  <li>
                    <a
                      href="#"
                      onClick={(e) => this.props.handleComponentDetails(
                        e, listItem, this.props.componentDetailsParent)}
                    >View</a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => this.props.handleComponentDetails(
                        e, listItem, this.props.componentDetailsParent, 'edit')}
                    >Edit</a>
                  </li>
                  <li role="separator" className="divider"></li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => this.props.handleRemoveComponent(e, listItem)}
                    >Remove</a>
                  </li>
                </ul>
              </div>
            </div>
          }
          <div className="list-view-pf-main-info">
            <div className="list-view-pf-left" data-item="type">
              <ComponentTypeIcons componentType={listItem.ui_type} />
            </div>
            <div className="list-view-pf-body">
              <div className="list-view-pf-description">
                <div className="list-group-item-heading">
                  <a
                    href="#"
                    data-item="name"
                    onClick={(e) => this.props.handleComponentDetails(
                    e, listItem, this.props.componentDetailsParent)}
                  >{listItem.name}</a>
                </div>
                <div className="list-group-item-text">
                  {listItem.summary}
                </div>
                <div className="cmpsr-dependency-flag hidden">
                  <span className="pficon pficon-warning-triangle-o"></span>
                </div>
              </div>
              <div className="list-view-pf-additional-info">
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Version <strong>{listItem.version}</strong>
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Release <strong>{listItem.release}</strong>
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  Dependencies
                  <strong>{`${(this.state.dependencies.length > 0) ? this.state.dependencies.length : '---'}`}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`list-group-item-container container-fluid ${this.state.expanded ? '' : 'hidden'}`}>
          <div className="close hidden">
            <span className="pficon pficon-close"></span>
          </div>
          <div className="row">
            <div className="col-md-6">
              <dl className="dl-horizontal clearfix">
                <dt>Version</dt>
                <dd>{listItem.version ? listItem.version : <span>&nbsp;</span>}</dd>
                <dt>Release</dt>
                <dd>{listItem.release ? listItem.release : <span>&nbsp;</span>}</dd>
                <dt>Architecture</dt>
                <dd>---</dd>
                <dt>Install Size</dt>
                <dd>2 MB (5 MB with Dependencies)</dd>
                <dt>URL</dt>
                {listItem.homepage != null &&
                  <dd><a target="_blank" href={listItem.homepage}>{listItem.homepage}</a></dd>
                  ||
                  <dd>&nbsp;</dd>
                }
                <dt>Packager</dt>
                <dd>Red Hat</dd>
                <dt>Product Family</dt>
                <dd>---</dd>
                <dt>Lifecycle</dt>
                <dd>01/15/2017</dd>
                <dt>Support Level</dt>
                <dd>Standard</dd>
              </dl>
              <strong>Errata</strong>
              <ul>
                <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
              </ul>
            </div>
            <div className="col-md-6">
              {listItem.ui_type !== 'RPM' && <div className="cmpsr-summary-listview hidden">
                <p><strong>Child Components</strong> (4)</p>
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
                          <a href="#" data-item="name">fm-group:hardware-support</a>
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
              </div>}
              {this.props.isDependency && <div className="cmpsr-summary-listview">
                <p><strong>Required By</strong> (1)</p>
                <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                  <div className="list-group-item">
                    <div className="list-view-pf-main-info">
                      <div className="list-view-pf-left" data-item="type">
                      </div>
                      <div className="list-view-pf-body">
                        <div className="list-view-pf-description">
                          <a href="#" data-item="name">---</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
              {this.state.dependencies.length > 0 &&
                <ComponentSummaryList listItems={this.state.dependencies} />
              }
            </div>
          </div>
        </div>
      </div>

    );
  }

}

ListItemComponents.propTypes = {
  listItem: React.PropTypes.object,
  listItemParent: React.PropTypes.string,
  componentDetailsParent: React.PropTypes.object,
  handleComponentDetails: React.PropTypes.func,
  handleRemoveComponent: React.PropTypes.func,
  noEditComponent: React.PropTypes.bool,
  isDependency: React.PropTypes.bool,
};

export default ListItemComponents;
