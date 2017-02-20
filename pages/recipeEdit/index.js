import React, { PropTypes } from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import RecipeContents from '../../components/ListView/RecipeContents';
import ComponentInputs from '../../components/ListView/ComponentInputs';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateComposition from '../../components/Modal/CreateComposition';
import EmptyState from '../../components/EmptyState/EmptyState';
import Toolbar from '../../components/Toolbar/Toolbar';
import constants from '../../core/constants';

class EditRecipePage extends React.Component {

  state = { recipe: [],
            recipeComponents: [], recipeDependencies: [],
            inputComponents: [], inputFilters: [], filteredComponents: [],
            selectedComponent: "", selectedComponentStatus: "", selectedComponentParent: "",
          };

  componentDidMount() {
    document.title = 'Welder | Recipe';
  }

  componentWillMount() {
      Promise.all([this.getRecipe(this.props.route.params.recipe), this.getInputs()]).then(() => {
          // Recipes and available components both need to be updated before running this
          this.updateInputs();
          let components = this.state.recipeComponents.slice(0);
          let dependencies = this.state.recipeDependencies.slice(0);
          this.getMetadata(components, dependencies);
      }).catch(e => console.log('Error in EditRecipe promise: ' + e));
  }

  // Get the recipe details, and its dependencies
  // Object layout is:
  // {recipes: [{recipe: RECIPE, modules: MODULES}, ...]}
  // Where MODULES is a modules/info/ object {name: "", projects: [{...
  getRecipe(recipeName) {
      let p = new Promise((resolve, reject) => {
          fetch(constants.get_recipes_deps + recipeName)
          .then(r => r.json())
          .then(data => {
              this.setState({recipe : data.recipes[0].recipe});
              this.setState({recipeComponents : constants.setComponentType(data.recipes[0].recipe, true)});
              let dependencies = this.updateDependencyList(data.recipes[0].modules);
              this.setState({recipeDependencies: dependencies});
              resolve();
          })
          .catch(e => {
              console.log("Error fetching recipes: " + e);
              reject();
          });
    });
    return p;
  }

  // TODO Use the original recipe in this.recipe instead of building it from components
  handleSaveRecipe() {
    let components = JSON.parse(JSON.stringify(this.state.recipeComponents));
    // create list of components that are modules
    let modules = [];
    components.map(i => {
      if (i.ui_type == "Module") {
        delete i.inRecipe;
        delete i.ui_type;
        modules.push(i);
      }
    });
    // create list of components that are RPMs
    let rpms = [];
    components.map(i => {
      if (i.ui_type == "RPM") {
        delete i.inRecipe;
        delete i.ui_type;
        rpms.push(i);
      }
    });
    // create recipe and post it
    let recipe = {
      "name": this.props.route.params.recipe,
      "description": this.state.recipe.description,
      "modules": modules,
      "packages": rpms
    };
    fetch(constants.post_recipes_new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    });
  }

  getInputs(){
      let p = new Promise((resolve, reject) => {
          // /modules/list looks like:
          // {"modules":[{"name":"389-ds-base","group_type":"rpm"},{"name":"389-ds-base-libs","group_type":"rpm"}, ...]}
          fetch(constants.get_modules_list)
          .then(r => r.json())
          .then(data => {
              this.setState({inputComponents : constants.setComponentType(data)});
              resolve();
          })
          .catch(e => {
              console.log("Failed to get inputs during recipe edit: " + e);
              reject();
          });
      });
      return p;
  }

  updateInputs() {
    // add a property to the original set of inputs, that indicates whether the input is in the recipe or not
    let inputs = this.state.inputComponents;
    let selected = this.state.recipeComponents;
    selected.map(component => {
      let index = inputs.map(input => {return input.name}).indexOf(component.name);
      if (index >= 0) {
          inputs[index].inRecipe = true;
      }
    });
    this.setState({inputComponents: inputs});
  }

  getMetadata(components, dependencies) {
    let componentNames = "";
    components.map(i => {
      componentNames = componentNames === "" ? i.name : componentNames + "," + i.name;
    });
    let dependencyNames = "";
    dependencies.map(i => {
      dependencyNames = dependencyNames === "" ? i.name : dependencyNames + "," + i.name;
    });
    Promise.all([constants.getMetadata(componentNames), constants.getMetadata(dependencyNames)]).then((data) => {
      data[0].projects.map(i => {
        let index = components.map(component => {return component.name}).indexOf(i.name);
        components[index].version = i.builds[0].source.version;
        components[index].release = i.builds[0].release;
        components[index].arch = i.builds[0].arch;
      });
      data[1].projects.map(i => {
        let index = dependencies.map(dependency => {return dependency.name}).indexOf(i.name);
        dependencies[index].version = i.builds[0].source.version;
        dependencies[index].release = i.builds[0].release;
        dependencies[index].arch = i.builds[0].arch;
      });

      this.setState({recipeComponents: components});
      this.setState({recipeDependencies: dependencies});
    }).catch(e => console.log('Error getting component metadata: ' + e));
  }
  // FILTERING INPUTS IS JUST POC and needs to be refactored and generalized for all filter controls
  // this only allows filtering by name, but will need to be modified when multiple filters can be applied
  // filtering is case-sensitive
  // NEED TO HANDLE CASE where user hits Enter when value = ""
  getFilteredInputs(event) {
    if (event.which == 13 || event.keyCode == 13) {
      let filter = [{
        "field": "name",
        "value": event.target.value
      }];
      fetch(constants.get_modules_list+ "/*" + filter[0].value + "*").then(r => r.json())
        .then(data => {
          this.setState({filteredComponents : constants.setComponentType(data)});
          this.setState({inputFilters : filter});
          // when multiple filters can be applied besides just name, then this
          // value needs to check if a filter for this field is already applied (if we replace the existing filter, anyway);
          // also need to add to array, not replace it
        })
        .catch(e => {
          console.log("Failed to filter inputs during recipe edit: " + e);
          }
        );
      event.preventDefault();
    }
  }
  handleClearFilters() {
    this.setState({filteredComponents : []});
    this.setState({inputFilters : []});
    $('#cmpsr-recipe-input-filter').val("");
  }

  clearInputAlert() {
    $("#cmpsr-recipe-inputs .alert").remove();
  }

  handleAddComponent = (event, component, version) => {
    // the user clicked Add in the sidebar to add the component to the recipe
    let newcomponentName = component.name;
    // get metadata for the component
    Promise.all([constants.getDependencies(newcomponentName), constants.getMetadata(newcomponentName)]).then((data) => {
      let newcomponent = data[1].projects[0];
      newcomponent.projects = data[0].modules[0].projects;
      newcomponent.inRecipe = true;
      newcomponent.ui_type = component.ui_type;
      newcomponent.version = data[1].projects[0].builds[0].source.version;
      newcomponent.release = data[1].projects[0].builds[0].release;
      newcomponent.arch = data[1].projects[0].builds[0].arch;
      // if the user selected a version in the details view
      if (version != "") {
          newcomponent.version = version;
      }
      let recipeComponents = this.state.recipeComponents.slice(0);
      let updatedRecipeComponents = recipeComponents.concat(newcomponent);
      this.setState({recipeComponents: updatedRecipeComponents});
      let dependencies = this.updateDependencyList(data[0].modules);
      this.setState({recipeDependencies: dependencies});

    }).catch(e => console.log('Error adding module to recipe: ' + e));
    // if an input is selected, deselect it
    let inputs = this.removeInputActive();
    // set inRecipe to true for the input component as well
    inputs[inputs.indexOf(component)].inRecipe = true;
    this.setState({inputComponents: inputs});
    this.setState({selectedComponent: ""});
    this.setState({selectedComponentStatus: ""});
    // remove the inline message above the list of inputs
    this.clearInputAlert();
  };

  handleRemoveComponent = (event, component) => {
    // the user clicked Remove for a component in the recipe component list
    // or the component details view
    let inputs = [];
    // if the removed component was visible in the details view:
    if (component == this.state.selectedComponent) {
      inputs = this.removeInputActive();
      this.hideComponentDetails();
    } else {
      inputs = this.state.inputComponents.slice(0);
    }
    // update the list of components to include the Add button for the removed component
    let input = inputs.map(function(e) {return e.name}).indexOf(component.name);
    if (input > -1) {
      inputs[input].inRecipe = false;
      this.setState({inputComponents: inputs});
    }
    // update the list of recipe components to not include the removed component
    let index = this.state.recipeComponents.indexOf(component);
    let count = this.state.recipeComponents.length;
    let updatedRecipeComponents = this.state.recipeComponents.slice(0);
    if (index == 0) {
      updatedRecipeComponents =  this.state.recipeComponents.slice(index + 1, count);
    } else if (index + 1 == count) {
      updatedRecipeComponents = this.state.recipeComponents.slice(0, index);
    } else {
      let slice1 = this.state.recipeComponents.slice(0, index);
      let slice2 = this.state.recipeComponents.slice(index + 1, count);
      updatedRecipeComponents = slice1.concat(slice2);
    }
    this.setState({recipeComponents: updatedRecipeComponents});



  };

  handleComponentDetails = (event, component, parent) => {
    // the user selected a component in the sidebar to view more details on the right
    // remove the active state from the current selected component
    let inputs = this.removeInputActive();
    if (component != this.state.selectedComponent) {
      // if the user did not clicked on the current selected component:
      // set state for selected component
      this.setState({selectedComponent: component});
      this.setState({selectedComponentParent: parent});
      // if the selected component is in the list of inputs
      // then set active to true so that it is highlighted
      let compIndex = inputs.indexOf(component)
      if (compIndex >= 0) {
        inputs[compIndex].active = true;
      }
      this.setState({inputComponents: inputs});

      // set selectedComponentStatus
      // if parent is not defined (i.e. I clicked a component in the input list
      // or component list, or I clicked the first component in the breadcrumb)
      if ( parent == undefined || parent == "" ) {
        // and component is in the recipe, then set state to selected
        if ( component.inRecipe == true ) {
          this.setState({selectedComponentStatus: "selected"});
        // and component is not in the recipe, then set state to available
        } else {
          this.setState({selectedComponentStatus: "available"});
        }
      } else { // if parent is defined (i.e. I clicked a component listed in the details view)
        // and state is selected, then state should be selected-child
        if (this.state.selectedComponentStatus == "selected") {
          this.setState({selectedComponentStatus: "selected-child"});
        // and state is available, then state should be available-child
        } else if (this.state.selectedComponentStatus == "available") {
          this.setState({selectedComponentStatus: "available-child"});
        }
        // if parent is defined
        // and state is selected-child or available-child, then state should be unchanged
      }

    } else {
      // if the user clicked on the current selected component:
      this.hideComponentDetails();
    }
  };

  hideComponentDetails() {
    this.setState({selectedComponent: ""});
    this.setState({selectedComponentStatus: ""});
    this.setState({selectedComponentParent: ""});
  }

  updateDependencyList(data) {
    let dependencies = this.state.recipeDependencies.slice(0);
    data.map(i => {
        // include value for requiredBy for each dependency
        let component = i;
        if (i.projects.length > 0) {
          i.projects.map(i => {
            i.requiredBy = component.name;
            i.inRecipe = true;
            i.ui_type = component.ui_type;
          });
        }
        dependencies = dependencies.concat(i.projects);
    });
    return dependencies;
  }

  removeInputActive() {
    // remove the active state from list of inputs
    let inputs = this.state.inputComponents.slice(0);
    let index = inputs.indexOf(this.state.selectedComponent)
    if (index >= 0) {
      inputs[index].active = false;
    }
    return inputs;
  }

  render() {

    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <div className="cmpsr-edit-actions pull-right">
          <ul className="list-inline">
            <li>
              <button className="btn btn-primary" type="button" onClick={(e) => this.handleSaveRecipe(e)}>Save</button>
            </li>
            <li>
              <button className="btn btn-default" type="button">Discard Changes</button>
            </li>
          </ul>
        </div>
				<ol className="breadcrumb">
					<li><Link to="/recipes">Back to Recipes</Link></li>
					<li><Link to={"/recipe/" + this.props.route.params.recipe }>{this.props.route.params.recipe}</Link></li>
					<li className="active"><strong>Edit Recipe</strong></li>
				</ol>
        <div className="cmpsr-title-summary">
          <h1 className="cmpsr-title-summary__item">{ this.props.route.params.recipe }</h1><p className="cmpsr-title-summary__item">Version 3<span className="text-muted">, Total Disk Space: 1,234 KB</span></p>
        </div>
        <div className="row">

          { this.state.selectedComponent == "" &&
          <div className="col-sm-7 col-md-8 col-sm-push-5 col-md-push-4" id="cmpsr-recipe-list-edit">
						<Toolbar />
            { this.state.recipeComponents.length == 0 &&
            <EmptyState title={"Add Recipe Components"} message={"Browse or search for components, then add them to the recipe."} />
            ||
            <RecipeContents components={ this.state.recipeComponents } dependencies={ this.state.recipeDependencies } handleRemoveComponent={this.handleRemoveComponent.bind(this)} handleComponentDetails={this.handleComponentDetails.bind(this)} />
            }
					</div>
          ||
          <div className="col-sm-7 col-md-8 col-sm-push-5 col-md-push-4" id="cmpsr-recipe-details-edit">
            <ComponentDetailsView
              parent={ this.props.route.params.recipe }
              component={ this.state.selectedComponent }
              componentParent={ this.state.selectedComponentParent }
              status={ this.state.selectedComponentStatus }
              handleComponentDetails={this.handleComponentDetails.bind(this)}
              handleAddComponent={this.handleAddComponent.bind(this)}
              handleRemoveComponent={this.handleRemoveComponent.bind(this)} />
          </div>
          }

          <div className="col-sm-5 col-md-4 col-sm-pull-7 col-md-pull-8 sidebar-pf sidebar-pf-left" id="cmpsr-recipe-inputs">

						<div className="row toolbar-pf">
							<div className="col-sm-12">
								<form className="toolbar-pf-actions">
									<div className="form-group toolbar-pf-filter">
										<label className="sr-only" htmlFor="cmpsr-recipe-input-filter">Name</label>
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
											<input type="text" className="form-control" id="cmpsr-recipe-input-filter" placeholder="Filter By Name..." onKeyPress={(e) => this.getFilteredInputs(e)} />
										</div>
									</div>
									<div className="toolbar-pf-action-right">
										<div className="form-group toolbar-pf-settings">
											<button className="btn btn-link btn-settings" type="button" data-toggle="modal" data-target="#cmpsr-recipe-inputs-settings">
												<span className="pf-icon pficon-settings"></span>
											</button>
										</div>
									</div>
								</form>

								<div className="row toolbar-pf-results" data-results="1">
									<div className="col-sm-12">
										<div className="cmpsr-recipe-inputs-pagination">
                      { this.state.inputFilters.length == 0 &&
                      <span>2,345 Available Components</span>
                      ||
											<span>{ this.state.filteredComponents.length } Results of 2,345 Available Components</span>
                      }
										</div>
                    { this.state.inputFilters.length > 0 &&
                    <ul className="list-inline">
    									<li>
    										<span className="label label-info">
    											Name: { this.state.inputFilters[0].value }
    											<a href="#" onClick={(e) => this.handleClearFilters(e)}><span className="pficon pficon-close"></span></a>
    										</span>
    									</li>
    									<li>
    										<a href="#" onClick={(e) => this.handleClearFilters(e)}>Clear All Filters</a>
    									</li>
    								</ul>
                    }
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

						<ComponentInputs components={ this.state.inputFilters.length == 0 && this.state.inputComponents || this.state.filteredComponents } handleComponentDetails={this.handleComponentDetails.bind(this)} handleAddComponent={this.handleAddComponent.bind(this)} />
					</div>
				</div>
				<CreateComposition />

      </Layout>

    );
  }

}

export default EditRecipePage;
