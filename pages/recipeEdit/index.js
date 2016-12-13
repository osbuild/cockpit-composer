import React, { PropTypes } from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import ComponentListView from '../../components/ListView/ComponentListView';
import ComponentInputs from '../../components/ListView/ComponentInputs';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateComposition from '../../components/Modal/CreateComposition';
import EmptyState from '../../components/EmptyState/EmptyState';
import constants from '../../core/constants';

class EditRecipePage extends React.Component {

  state = { selectedComponent: "", recipecomponents: [], inputcomponents: [] };

  componentDidMount() {
    document.title = 'Composer | Recipe';
  }

  componentWillMount() {
    Promise.all([this.getRecipe(), this.getInputs()]).then((data) => {
      this.setState({recipecomponents : data[0]});
      this.setState({inputcomponents : data[1]});
      this.updateInputs();

    }).catch(console.log('Boo'));
    // this.getRecipe();

  }

  componentDidUpdate() {
    this.showEmptyState();
    this.showComponentDetails();
  }

  getRecipe() {
    let p = new Promise((resolve, reject) => {
      fetch(constants.get_recipe_url).then(r => r.json())
        .then(data => {
          this.setState({recipecomponents : data.recipe});
          resolve(data);
        })
        .catch(e => {
          console.log("Failed to fetch recipe during edit: " + e);
          reject();
          }
        );
    });
    return p;
  }


  getInputs(){
    let p = new Promise((resolve, reject) => {
      fetch(constants.get_components_url).then(r => r.json())
        .then(data => {
          // add type: module to each one, save the list
          this.setState({inputcomponents : data.modules.map(m => {
                                              m.type = "module";
                                              return m;
                                           })
                        })
                        resolve(data);
        })
        .catch(e => {
          console.log("Failed to get inputs during recipe edit: " + e);
          reject();
          }
        );
    });
    return p;
  }

  updateInputs() {
    // this adds a property to the original data set of inputs, that indicates whether the input is in the recipe or not
    // for each object in recipecomponents, get indexOf value in inputcomponents, add a property to the matching inputcomponent "inRecipe = true"
    // this should run once on did mount, and then individually per added/removed component
    let inputs = this.state.inputcomponents;
    let recipeLength = this.state.recipecomponents.length;
    for (var i = 0; i < recipeLength; i++) {
      let component = this.state.recipecomponents[i];
      let index = inputs.map(function(e) {return e.name}).indexOf(component.name);
      if (index >= 0) {
          inputs[index].inRecipe = true;
      }
    }
    this.setState({inputcomponents: inputs});

  }

  showEmptyState() {
    if (this.state.recipecomponents.length == 0) {
      $(".blank-slate-pf").removeClass("hidden");
      $("#cmpsr-recipe-list").addClass("hidden");
    } else {
      $("#cmpsr-recipe-list").removeClass("hidden");
      $(".blank-slate-pf").addClass("hidden");
    }
  }

  showComponentDetails() {
    if (this.state.selectedComponent != "") {
      $("#cmpsr-recipe-details").removeClass("hidden");
      $("#cmpsr-recipe-list").addClass("hidden");
    } else {
      $("#cmpsr-recipe-list").removeClass("hidden");
      $("#cmpsr-recipe-details").addClass("hidden");
    }
  }

  clearInputAlert() {
    $("#cmpsr-recipe-inputs .alert").remove();
  }

  handleAddComponent = (event, component) => {
    // the user clicked Add in the sidebar to add the component to the recipe
    component.inRecipe = true;
    this.setState({
      recipecomponents: this.state.recipecomponents.concat([component])
    });
    this.clearInputAlert();
  };

  handleRemoveComponent = (event, component) => {
    // the user clicked Remove for a component in the recipe component list
    // update the list of components
    let inputs = this.state.inputcomponents;
    let input = inputs.map(function(e) {return e.name}).indexOf(component.name);
    inputs[input].inRecipe = false;
    this.setState({inputcomponents: inputs});
    // update the list of recipe components
    let index = this.state.recipecomponents.indexOf(component);
    let count = this.state.recipecomponents.length;
    if (index == 0) {
      this.setState({
        recipecomponents: this.state.recipecomponents.slice(index + 1, count)
      });
    } else if (index + 1 == count) {
      this.setState({
        recipecomponents: this.state.recipecomponents.slice(0, index)
      });
    } else {
      let slice1 = this.state.recipecomponents.slice(0, index);
      let slice2 = this.state.recipecomponents.slice(index + 1, count);
      this.setState({
        recipecomponents: slice1.concat(slice2)
      });
    }
  };

  handleComponentDetails = (event, component) => {
    // the user selected a component in the sidebar to view more details on the right
    this.setState({selectedComponent: component});
  };

  closeComponentDetails = (event) => {
    // the user clicked Close while viewing component details, to return to the list of components in the recipe
    this.setState({selectedComponent: ""});
  }

  render() {

    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">

				<ol className="breadcrumb">
					<li><Link to="/recipes">Back to Recipes</Link></li>
					<li><Link to="/recipe">Low Latency</Link></li>
					<li className="active"><strong>Edit Recipe</strong></li>
				</ol>

				<div className="row">
					<div className="col-sm-7 col-md-8 col-sm-push-5 col-md-push-4" id="cmpsr-recipe-list">

						<div className="row toolbar-pf">
		          <div className="col-sm-12">
		            <form className="toolbar-pf-actions">
		              <div className="form-group toolbar-pf-filter">
		                <label className="sr-only" htmlFor="filter">Name</label>
		                <div className="input-group">
		                  <div className="input-group-btn">
		                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Name<span className="caret"></span></button>
		                    <ul className="dropdown-menu">
		                      <li><a href="#">Name</a></li>
		                      <li><a href="#">Version</a></li>
		                    </ul>
		                  </div>
		                  <input type="text" className="form-control" id="filter" placeholder="Filter By Name..." />
		                </div>
		              </div>
		              <div className="form-group">
		                <div className="dropdown btn-group">
		                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Name<span className="caret"></span></button>
		                  <ul className="dropdown-menu">
		                    <li><a href="#">Name</a></li>
		                    <li><a href="#">Version</a></li>
		                  </ul>
		                </div>
		                <button className="btn btn-link" type="button"><span className="fa fa-sort-alpha-asc"></span></button>
		              </div>
		              <div className="form-group">
										<button className="btn btn-default" id="cmpsr-btn-crt-compos" data-toggle="modal" data-target="#cmpsr-modal-crt-compos" type="button">Create Composition</button>
		                <div className="dropdown btn-group  dropdown-kebab-pf">
		                  <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebab" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="fa fa-ellipsis-v"></span></button>
		                  <ul className="dropdown-menu " aria-labelledby="dropdownKebab">
		                    <li><a href="#">Export Recipe</a></li>
												<li role="separator" className="divider"></li>
												<li><a href="#">Update Selected Components</a></li>
												<li><a href="#">Remove Selected Components</a></li>
		                  </ul>
		                </div>
		              </div>
		              <div className="toolbar-pf-action-right">
		                <div className="form-group toolbar-pf-find">
		                  <button className="btn btn-link btn-find" type="button"><span className="fa fa-search"></span></button>
		                  <div className="find-pf-dropdown-container"><input type="text" className="form-control" id="find" placeholder="Find By Keyword..." />
		                    <div className="find-pf-buttons">
		                      <span className="find-pf-nums">1 of 3</span>
		                      <button className="btn btn-link" type="button"><span className="fa fa-angle-up"></span></button>
		                      <button className="btn btn-link" type="button"><span className="fa fa-angle-down"></span></button>
		                      <button className="btn btn-link btn-find-close" type="button"><span className="pficon pficon-close"></span></button>
		                    </div>
		                  </div>
		                </div>
		                <div className="form-group toolbar-pf-view-selector">
		                  <button className="btn btn-link" title="Table View"><i className="fa fa-th"></i></button>
		                  <button className="btn btn-link " title="Tree View"><i className="pficon pficon-topology"></i></button>
		                  <button className="btn btn-link active" title="List View"><i className="fa fa-th-list"></i></button>
		                </div>
		              </div>
		            </form>
		            <div className="row toolbar-pf-results toolbar-pf-results-none">
		              <div className="col-sm-12">
		                <h5>40 Results</h5>
		                <p>Active filters: </p>
		                <ul className="list-inline">
		                  <li><span className="label label-info">Name: nameofthething<a href="#"><span className="pficon pficon-close"></span></a></span></li>
		                  <li><span className="label label-info">Version: 3<a href="#"><span className="pficon pficon-close"></span></a></span></li>
		                  <li><span className="label label-info">Lifecycle: 5<a href="#"><span className="pficon pficon-close"></span></a></span></li>
		                </ul>
		                <p><a href="#">Clear All Filters</a></p>
		              </div>
		            </div>
		          </div>
		        </div>
            <EmptyState title={"Add Recipe Components"} message={"Browse or search for components, then add them to the recipe."} />
		        <ComponentListView components={ this.state.recipecomponents } handleRemoveComponent={this.handleRemoveComponent.bind(this)} />
					</div>
          <div className="col-sm-7 col-md-8 col-sm-push-5 col-md-push-4 hidden" id="cmpsr-recipe-details">
            <ComponentDetailsView component={ this.state.selectedComponent } closeComponentDetails={this.closeComponentDetails.bind(this)} />
          </div>
					<div className="col-sm-5 col-md-4 col-sm-pull-7 col-md-pull-8 sidebar-pf sidebar-pf-left" id="cmpsr-recipe-inputs">

						<div className="row toolbar-pf">
							<div className="col-sm-12">
								<form className="toolbar-pf-actions">
									<div className="form-group toolbar-pf-filter">
										<label className="sr-only" htmlFor="filter">Name</label>
										<div className="input-group">
											<div className="input-group-btn">
												<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Name <span className="caret"></span></button>
												<ul className="dropdown-menu">
													<li><a href="#">Type</a></li>
													<li><a href="#">Name</a></li>
													<li><a href="#">Version</a></li>
													<li><a href="#">Release</a></li>
													<li><a href="#">Lifecycle</a></li>
													<li><a href="#">Support Level</a></li>
												</ul>
											</div>
											<input type="text" className="form-control" id="filter" placeholder="Filter By Name..." />
										</div>
									</div>
									<div className="toolbar-pf-action-right">
										<div className="form-group toolbar-pf-find">
											<button className="btn btn-link btn-find" type="button">
												<span className="fa fa-search"></span>
											</button>
											<button className="btn btn-link btn-settings" type="button" data-toggle="modal" data-target="#cmpsr-recipe-inputs-settings">
												<span className="pf-icon pficon-settings"></span>
											</button>
											<div className="find-pf-dropdown-container">
												<input type="text" className="form-control" id="find" placeholder="Find By Keyword..." />
												<div className="find-pf-buttons">
													<span className="find-pf-nums">1 of 3</span>
													<button className="btn btn-link" type="button">
														<span className="fa fa-angle-up"></span>
													</button>
													<button className="btn btn-link" type="button">
														<span className="fa fa-angle-down"></span>
													</button>
													<button className="btn btn-link btn-find-close" type="button">
														<span className="pficon pficon-close"></span>
													</button>
												</div>
											</div>
										</div>
									</div>
								</form>

								<div className="row toolbar-pf-results" data-results="1">
									<div className="col-sm-12">
										<div className="cmpsr-recipe-inputs-pagination">
											<strong>1 - 50</strong> of 1000+ Results
											<ul className="pagination">
												<li className="disabled">
													<a href="#">
														<span className="i fa fa-angle-double-left"></span>
													</a>
												</li>
												<li className="disabled">
													<a href="#">
														<span className="i fa fa-angle-left"></span>
													</a>
												</li>
												<li>
													<a href="#">
														<span className="i fa fa-angle-right"></span>
													</a>
												</li>
												<li>
													<a href="#">
														<span className="i fa fa-angle-double-right"></span>
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="alert alert-info alert-dismissable">
						  <button type="button" className="close" data-dismiss="alert" aria-hidden="true">
						    <span className="pficon pficon-close"></span>
						  </button>
						  <span className="pficon pficon-info"></span>
						  <strong>Select components</strong> in this list to add to the recipe.
						</div>

						<ComponentInputs components={ this.state.inputcomponents } recipecomponents={this.state.recipecomponents} handleComponentDetails={this.handleComponentDetails.bind(this)} handleAddComponent={this.handleAddComponent.bind(this)} />
					</div>
				</div>
				<CreateComposition />

      </Layout>

    );
  }

}

export default EditRecipePage;
