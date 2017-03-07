import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import { Tab, Tabs } from 'react-patternfly-shims';
import DependencyListView from '../../components/ListView/DependencyListView';
import constants from '../../core/constants';
import MetadataApi from '../../data/MetadataApi';





class ComponentDetailsView extends React.Component {

  state = { selectedBuildIndex:0, availableBuilds: [], activeTab: "Details", parents: [], dependencies: [], componentData: {}, editSelected: false}

  componentWillMount() {
    this.getMetadata(this.props.component, this.props.status);
  }

  componentDidMount() {
    this.initializeBootstrapElements();
  }

  componentDidUpdate() {
    this.initializeBootstrapElements();
  }

  componentWillReceiveProps(newProps) {
    this.updateBreadcrumb(newProps);
    this.getMetadata(newProps.component, newProps.status);
    this.setState({activeTab: "Details"});
    // this needs to be updated when Edit in the li is enabled, in that case, status can be "editSelected"
    this.setState({editSelected: false});
   }

  initializeBootstrapElements() {
    // Initialize Boostrap-select
    $('.selectpicker').selectpicker();
    // Initialize Boostrap-tooltip
    $('[data-toggle="tooltip"]').tooltip()
  }

  getMetadata(component, status) {
    // when getting metadata, get all builds if component is from list of available inputs
    let build = (status === "available") ? "all" : "";
    // if the user clicks a component listed in the inputs and it's in the recipe,
    // then use the version and release that's selected for the recipe component
    let selectedComponent = Object.assign({}, component);
    if (selectedComponent.active === true && selectedComponent.inRecipe === true) {
      selectedComponent.version = component.version_selected;
      selectedComponent.release = component.release_selected;
    }
    Promise.all([
        MetadataApi.getMetadataComponent(selectedComponent, build)
    ]).then((data) => {
      this.setState({componentData: data[0][0]});
      this.setState({dependencies : data[0][1]});
      if (status === "available") {
        // when status === "available" a form displays with a menu for selecting a specific version
        // availableBuilds is an array listing each option
        // TODO - include other metadata that's defined in builds
        let availableBuilds = data[0][2].map(i => ({"version":i.source.version, "release":i.release}));
        this.setState({availableBuilds: availableBuilds});
      } else {
        this.setState({availableBuilds: []});
      }
      this.setState({ selectedBuildIndex:0 });
    }).catch(e => console.log('Error getting component metadata: ' + e));
  }

  handleEdit = (event) => {
    // user clicked Edit for the selected component
    let component = this.state.componentData;
    // get available builds and set default value
    Promise.all([
      MetadataApi.getAvailableBuilds(component)
    ]).then((data) => {
      let availableBuilds = data[0].map(i => ({"version":i.source.version, "release":i.release}));
      this.setState({availableBuilds: availableBuilds});
      // filter available builds by component data to find object in array, then get index of that object
      let selectedBuild = availableBuilds.filter((obj) => (obj.version === component.version && obj.release === component.release))[0];
      let index = availableBuilds.indexOf(selectedBuild);
      this.setState({ selectedBuildIndex:index });
    }).catch(e => console.log('Error getting component metadata: ' + e));
    // display the form
    this.setState({editSelected: true});
  }

  handleVersionSelect = (event) => {
    this.setState({selectedBuildIndex: event.target.value});
    let builds = this.state.availableBuilds;
    let componentData = this.state.componentData;
    componentData.version = builds[event.target.value].version;
    componentData.release = builds[event.target.value].release;
    // TODO any data that we display that's defined in builds should be added here
    this.setState({componentData: componentData});
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
              { this.props.status === "available" &&
    					<li>
    						<button className="btn btn-primary add" type="button" onClick={(e) => this.props.handleAddComponent(e, "details", this.state.componentData, this.state.dependencies)}>Add</button>
    					</li>
              }
              { (this.props.status === "selected" && this.state.editSelected === false) &&
              <li>
    						<button className="btn btn-primary" type="button" onClick={(e) => this.handleEdit(e)}>Edit</button>
    					</li>
              }
              { (this.props.status === "selected" && this.state.editSelected === true) &&
              <li>
    						<button className="btn btn-primary" type="button" onClick={(e) => this.props.handleUpdateComponent(e, this.state.componentData)}>Save Updates</button>
    					</li>
              }
              { this.props.status === "selected" &&
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

        { (this.props.status === "available" || this.state.editSelected === true ) &&
    		<div className="blank-slate-pf">
    			<form className="form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 col-md-2 control-label" htmlFor="cmpsr-compon-details-version-select">Version Release</label>
              <div className="col-sm-8 col-md-9">
                <select id="cmpsr-compon-details-version-select" className="form-control" value={this.state.selectedBuildIndex} onChange={(e) => this.handleVersionSelect(e)}>
                  { this.state.availableBuilds.map((build, i) =>
                    <option key={i} value={i}>{build.version}-{build.release}</option>
                  )}
                </select>
              </div>
    				</div>
            <div className="form-group hidden">
              <label className="col-sm-3 col-md-2 control-label" htmlFor="cmpsr-compon-details-instprof-select">Install Profile</label>
              <div className="col-sm-8 col-md-9">
                <select id="cmpsr-compon-details-instprof-select" className="form-control">
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
              <dd>{this.state.componentData.version } { (this.props.status === "selected" && this.state.editSelected === false) && <a href="#" onClick={(e) => this.handleEdit(e)}>Update</a>}</dd>
              <dt>Release</dt>
              <dd>{ this.state.componentData.release }</dd>
              <dt>Architecture</dt>
              <dd>{ this.state.componentData.arch }</dd>
              <dt>Install Size</dt>
              <dd>2 MB (5 MB with Dependencies)</dd>
              <dt>URL</dt>
              {this.state.componentData.homepage !== null &&
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
          <Tab tabTitle="Components" active={this.state.activeTab === 'Components'}>
            <p>Components</p>
          </Tab>
          <Tab tabTitle="Dependencies" active={this.state.activeTab === 'Dependencies'}>
            <DependencyListView id="cmpsr-component-dependencies"
              listItems= { this.state.dependencies }
              noEditComponent
              handleComponentDetails={ this.props.handleComponentDetails }
              componentDetailsParent={ component } />
          </Tab>
          <Tab tabTitle="Errata" active={this.state.activeTab === 'Errata'}>
            <p>Errata</p>
          </Tab>
        </Tabs>


    	</div>

    )
  }
}

export default ComponentDetailsView;
