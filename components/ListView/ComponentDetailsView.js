import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import Tabs from '../../components/Tabs/Tabs'
import Tab from '../../components/Tabs/Tab';
import DependencyListView from '../../components/ListView/DependencyListView';



class ComponentDetailsView extends React.Component {

  state = { selectedVersion: "", activeTab: "Details", parents: [],
    dependencies: [
      {
        "summary": "This group is a collection of tools for various hardware specific utilities.",
        "version": "24",
        "release": "2",
        "url": "up-@hardware-support",
        "requires": {
          "fm-group:core": "None"
        },
        "group_type": "rpm",
        "name": "fm-group:hardware-support"
      },
      {
        "summary": "Common set of utilities that extend the minimal installation.",
        "version": "24",
        "release": "1",
        "url": "@standard",
        "requires": {
          "fm-group:core": "None"
        },
        "group_type": "rpm",
        "name": "fm-group:standard"
      }
    ]
  }

  componentDidMount() {
    this.initializeBootstrapElements();
  }

  componentDidUpdate() {
    this.initializeBootstrapElements();

  }

  componentWillReceiveProps(newProps) {
    this.updateBreadcrumb(newProps);
   }

  initializeBootstrapElements() {
    // Initialize Boostrap-select
    $('.selectpicker').selectpicker();
    // Initialize Boostrap-tooltip
    $('[data-toggle="tooltip"]').tooltip()
  }

  handleVersionSelect = (event) => {
    this.setState({selectedVersion: event.target.value});
  }

  handleTabChanged(e){
    if(this.state.activeTab != e.detail){
      this.setState({activeTab: e.detail});
    }
  }

  updateBreadcrumb(newProps) {
    // update the breadcrumb
    let parents = this.state.parents.slice(0);
    let updatedParents = [];
    let breadcrumbIndex = parents.indexOf(newProps.component);
    //check if the selected component is a breadcrumb node
    // if it is in the breadcrumb, then the breadcrumb path should be updated
    if ( breadcrumbIndex == 0) {
      // if the user clicks the first node in the breadcrumb, it is removed.
      updatedParents = [];
    } else if ( breadcrumbIndex >= 1) {
      // if the user clicks any other node in the breadcrumb, then the array
      // is truncated to show only the parents of the selected component
      updatedParents = parents.slice(0, breadcrumbIndex);
    } else if (newProps.componentParent != undefined) {
    // otherwise, update the list of parents if a parent is provided
      updatedParents = parents.concat(newProps.componentParent);
    }
    this.setState({parents: updatedParents});
  }

  render() {
    const { component } = this.props; // eslint-disable-line no-use-before-define

    return (
      <div className="cmpsr-compon-details">
        { this.state.parents.length > 0 &&
        <ol className="breadcrumb">
          {this.state.parents.map((parent,i) =>
            <li key={i} className={i}><a href="#" onClick={(e) => this.props.handleComponentDetails(e, parent, this.state.parents[i-1])}>{parent.name}</a></li>
          )}
          <li></li>
        </ol>
        }
    		<h2>
    			<span data-item="name"><ComponentTypeIcons componentType={ component.type } /> {component.name} </span>
    			<div className="pull-right">
    				<ul className="list-inline">
              { this.props.status == "available" &&
    					<li>
    						<button className="btn btn-primary add" type="button" onClick={(e) => this.props.handleAddComponent(e, component, this.state.selectedVersion)}>Add</button>
    					</li>
              }
              { component.inRecipe == true &&
              <li>
    						<button className="btn btn-primary" type="button">Edit</button>
    					</li>
              }
              { component.inRecipe == true &&
              <li>
    						<button className="btn btn-default" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Remove from Recipe"  onClick={(e) => this.props.handleRemoveComponent(e, component)}>Remove</button>
    					</li>
              }
    					<li>
    						<button type="button" className="close" data-toggle="tooltip" data-placement="top" title="" data-original-title="Hide Details" onClick={(e) => this.props.handleComponentDetails(e, "")}>
    		          <span className="pficon pficon-close"></span>
    		        </button>
    					</li>
    				</ul>
    			</div>
    		</h2>

        { this.props.status == "available" &&
    		<div className="blank-slate-pf">
    			<form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 col-md-2 control-label" htmlFor="cmpsr-compon-details-version-select">Version</label>
              <div className="col-sm-8 col-md-9">
                <select id="cmpsr-compon-details-version-select" className="selectpicker form-control" onChange={(e) => this.handleVersionSelect(e)} value={this.state.selectedVersion == "" && component.version || this.state.selectedVersion}>
                  <option>{component.version}</option>
                  <option>3.0</option>
                  <option>2.5</option>
                  <option>2.0</option>
                  <option>1.0</option>
                </select>
              </div>
    				</div>
            <div className="form-group">
              <label className="col-sm-3 col-md-2 control-label" htmlFor="cmpsr-compon-details-instprof-select">Install Profile</label>
              <div className="col-sm-8 col-md-9">
                <select id="cmpsr-compon-details-instprof-select" className="selectpicker form-control">
                  <option>Default</option>
                  <option>Debug</option>
                </select>
              </div>
            </div>
    			</form>
    		</div>
        }

        <Tabs key="pf-tabs" ref="pfTabs" tabChanged={this.handleTabChanged.bind(this)}>
          <Tab tabTitle="Details" active={this.state.activeTab == 'Details'}>
            <h3 data-item="summary">{component.summary}</h3>
            <p>{component.description}</p>
            <dl className="dl-horizontal">
              <dt>Type</dt>
              <dd>{component.type}</dd>
              <dt>Version</dt>
              <dd>{this.state.selectedVersion == "" && component.version || this.state.selectedVersion} { this.props.status == "selected" && <a href="#">Update</a>}</dd>
              <dt>Release</dt>
              <dd>{component.release}</dd>
              <dt>Architecture</dt>
              <dd>x86_64</dd>
              <dt>Install Size</dt>
              <dd>2 MB (5 MB with Dependencies)</dd>
              <dt>URL</dt>
              <dd>http:&#47;&#47;www.{component.name}.com</dd>
              <dt>Packager</dt>
              <dd>Red Hat</dd>
              <dt>Product Family</dt>
              <dd>???</dd>
              <dt>Lifecycle</dt>
              <dd>01/15/2017</dd>
              <dt>Support Level</dt>
              <dd>Standard</dd>
            </dl>
          </Tab>
          { component.type == "Module" &&
          <Tab tabTitle="Components" active={this.state.activeTab == 'Components'}>
            <p>Components</p>
          </Tab>
          }
          <Tab tabTitle="Dependencies" active={this.state.activeTab == 'Dependencies'}>
            <DependencyListView id="cmpsr-component-dependencies"
              listItems= { this.state.dependencies }
              noEditComponent
              handleComponentDetails={ this.props.handleComponentDetails }
              componentDetailsParent={ component } />
          </Tab>
          <Tab tabTitle="Errata" active={this.state.activeTab == 'Errata'}>
            <p>Errata</p>
          </Tab>
        </Tabs>


    	</div>
    )
  }
}

export default ComponentDetailsView;
