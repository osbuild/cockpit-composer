import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import Tabs from '../../components/Tabs/Tabs'
import Tab from '../../components/Tabs/Tab';
import DependencyListView from '../../components/ListView/DependencyListView';
import constants from '../../core/constants';




class ComponentDetailsView extends React.Component {

  state = { selectedVersion: "", activeTab: "Details", parents: [], dependencies: [], componentData: {}}

  componentWillMount() {
    this.getMetadata(this.props.component);

  }

  componentDidMount() {
    this.initializeBootstrapElements();
  }

  componentDidUpdate() {
    this.initializeBootstrapElements();
  }

  componentWillReceiveProps(newProps) {
    this.updateBreadcrumb(newProps);
    this.getMetadata(newProps.component);
    this.setState({activeTab: "Details"});
   }

  initializeBootstrapElements() {
    // Initialize Boostrap-select
    $('.selectpicker').selectpicker();
    // Initialize Boostrap-tooltip
    $('[data-toggle="tooltip"]').tooltip()
  }

  getMetadata(component) {
    // get component metadata and list of dependencies
    Promise.all([constants.getDependencies(component.name), constants.getMetadata(component.name)]).then((data) => {
      let metadata = data[1].projects[0];
      metadata.ui_type = component.ui_type;
      metadata.version = data[1].projects[0].builds[0].source.version;
      metadata.release = data[1].projects[0].builds[0].release;
      metadata.arch = data[1].projects[0].builds[0].arch;
      this.setState({componentData: metadata});
      let dependencies = data[0].modules[0].projects;
      // for each dependency, set the requiredBy value to the parent component
      // and set the ui_type to match the parent component
      // NOTE: requiredBy should ultimately show any component that requires
      // the dependency, not just the current one; and ui_type cannot be assumed
      // to be the same as the parent component, so this is temporary
      dependencies.map(i => {
        i.requiredBy = component.name;
        i.ui_type = component.ui_type;
      });
      let dependencyNames = "";
      dependencies.map(i => {
        dependencyNames = dependencyNames === "" ? i.name : dependencyNames + "," + i.name;
      });
      // get metadata for each dependency
      Promise.all([constants.getMetadata(dependencyNames)]).then((data) => {
        data[0].projects.map(i => {
          let index = dependencies.map(dependency => {return dependency.name}).indexOf(i.name);
          dependencies[index].version = i.builds[0].source.version;
          dependencies[index].release = i.builds[0].release;
          dependencies[index].arch = i.builds[0].arch;
        });
        this.setState({dependencies : dependencies});
      }).catch(e => console.log('Error getting dependency metadata: ' + e));
    }).catch(e => console.log('Error getting dependencies and metadata: ' + e));
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
    const { component } = this.props;

    return (


      <div className="cmpsr-compon-details">
        { this.state.parents.length > 0 &&
        <ol className="breadcrumb">
          <li><a href="#" onClick={(e) => this.props.handleComponentDetails(e, "")}>Back to {this.props.parent}</a></li>
          {this.state.parents.map((parent,i) =>
          <li key={i}><a href="#" onClick={(e) => this.props.handleComponentDetails(e, parent, this.state.parents[i-1])}>{parent.name}</a></li>
          )}
          <li></li>
        </ol>
        ||
        <ol className="breadcrumb">
          <li><a href="#" onClick={(e) => this.props.handleComponentDetails(e, "")}>Back to {this.props.parent}</a></li>
        </ol>
        }
    		<h3>
    			<span data-item="name"><ComponentTypeIcons componentType={ component.ui_type } /> {component.name} </span>
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
    		</h3>

        { this.props.status == "available" &&
    		<div className="blank-slate-pf">
    			<form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 col-md-2 control-label" htmlFor="cmpsr-compon-details-version-select">Version</label>
              <div className="col-sm-8 col-md-9">
                <select id="cmpsr-compon-details-version-select" className="selectpicker form-control" onChange={(e) => this.handleVersionSelect(e)} value={this.state.selectedVersion == "" && this.state.componentData.version || this.state.selectedVersion}>
                  <option>{this.state.componentData.version}</option>
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
            <h3 data-item="summary">{this.state.componentData.summary}</h3>
            <p>{this.state.componentData.description}</p>
            <dl className="dl-horizontal">
              <dt>Type</dt>
              <dd>{component.ui_type}</dd>
              <dt>Version</dt>
              <dd>{this.state.selectedVersion == "" && this.state.componentData.version || this.state.selectedVersion} { this.props.status == "selected" && <a href="#">Update</a>}</dd>
              <dt>Release</dt>
              <dd>{ this.state.componentData.release ? this.state.componentData.release : <span>&nbsp;</span> }</dd>
              <dt>Architecture</dt>
              <dd>{ this.state.componentData.arch }</dd>
              <dt>Install Size</dt>
              <dd>2 MB (5 MB with Dependencies)</dd>
              <dt>URL</dt>
              {this.state.componentData.homepage != null &&
              <dd><a target="_blank" href={this.state.componentData.homepage}>{this.state.componentData.homepage}</a></dd>
              ||
              <dd>&nbsp;</dd>
              }
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
          <Tab tabTitle="Components" active={this.state.activeTab == 'Components'}>
            <p>Components</p>
          </Tab>
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
