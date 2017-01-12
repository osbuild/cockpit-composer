import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';


class ComponentDetailsView extends React.Component {

  state = { selectedVersion: ""}

  componentDidMount() {
    this.initializeBootstrapElements();
  }
  
  componentDidUpdate() {
    this.initializeBootstrapElements();
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

  unbind() {
    $("#cmpsr-compon-details-version-select").off('click');
  }

  render() {
    const { component } = this.props; // eslint-disable-line no-use-before-define

    return (
      <div className="cmpsr-compon-details">
    		<h1>
    			<span data-item="name"><ComponentTypeIcons componentType={ component.group_type } /> {component.name}</span>
    			<div className="pull-right">
    				<ul className="list-inline">
              { this.props.status == "available" &&
    					<li>
    						<button className="btn btn-primary add" type="button" onClick={(e) => this.props.handleAddComponent(e, component, this.state.selectedVersion)}>Add</button>
    					</li>
              ||
              <li>
    						<button className="btn btn-primary add" type="button">Edit</button>
    					</li>
              }
    					<li>
    						<button type="button" className="close" data-toggle="tooltip" data-placement="top" title="" data-original-title="Hide Details" onClick={(e) => this.props.handleComponentDetails(e, "", "")}>
    		          <span className="pficon pficon-close"></span>
    		        </button>
    					</li>
    				</ul>
    			</div>
    		</h1>

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

        <ul className="nav nav-tabs">
    		  <li className="active"><a href="#">Details</a></li>
    		  <li><a href="#">Dependencies</a></li>
    		  <li><a href="#">Components</a></li>
    		  <li><a href="#">Errata</a></li>
    		</ul>
    		<h3 data-item="summary">This group contains all of Red Hats custom server configuration tools.</h3>
    		<dl className="dl-horizontal">
    			<dt>Version</dt>
    			<dd data-item="version">{this.state.selectedVersion == "" && component.version || this.state.selectedVersion} { this.props.status == "selected" && <a href="#">Update</a>}</dd>
    			<dt>Release</dt>
    			<dd data-item="release">{component.release}</dd>
    			<dt>Lifecycle</dt>
    			<dd>???</dd>
    			<dt>Support Level</dt>
    			<dd>???</dd>
    		</dl>
    	</div>
    )
  }
}

export default ComponentDetailsView;
