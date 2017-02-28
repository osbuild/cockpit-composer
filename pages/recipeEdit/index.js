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
import RecipeApi from '../../data/RecipeApi';
import MetadataApi from '../../data/MetadataApi';


class EditRecipePage extends React.Component {

  state = { recipe: {},
            recipeComponents: [], recipeDependencies: [],
            inputComponents: [], inputFilters: [], filteredComponents: [],
            selectedComponent: "", selectedComponentStatus: "", selectedComponentParent: "",
          };

  componentDidMount() {
    document.title = 'Welder | Recipe';
  }

  componentWillMount() {
    // get recipe, get inputs; then update inputs
      let recipeName = this.props.route.params.recipe.replace(/\s/g , "-");
      Promise.all([RecipeApi.getRecipe(recipeName), this.getInputs()]).then((data) => {
          let recipe = {
            "name": data[0].name,
            "description" : data[0].description
          };
          this.setState({recipe: recipe});
          this.setState({recipeComponents: data[0].components});
          this.setState({recipeDependencies: data[0].dependencies});
          // Recipes and available components both need to be updated before running this
          this.updateInputs(data[1]);
      }).catch(e => console.log('Error in EditRecipe promise: ' + e));
  }

  getInputs(filter){
    // for now, this gets full metadata and dependencies of list that's returned
    // but ideally the returned list would provide only what's needed to display
    // in the list and the popover, then the remaining data would be fetched on
    // Add or View Details
    filter = (filter === undefined) ? "" : filter;
      let p = new Promise((resolve, reject) => {
          // /modules/list looks like:
          // {"modules":[{"name":"389-ds-base","group_type":"rpm"},{"name":"389-ds-base-libs","group_type":"rpm"}, ...]}
          fetch(constants.get_modules_list + filter)
          .then(r => r.json())
          .then(data => {
              let components = data.modules
              let componentNames = MetadataApi.getNames(components);
              Promise.all([
                  MetadataApi.getData(constants.get_module_info + componentNames),
                  MetadataApi.getData(constants.get_dependencies_list + componentNames)
              ]).then((data) => {
                components = MetadataApi.updateComponentMetadata(components, data[0], true);
                components = MetadataApi.updateComponentDependencies(components, data[1]);
                components.map(i => {i.ui_type = "RPM"}) // this is being set arbitrarily for now
                resolve(components);
              }).catch(e => console.log('Error getting recipe metadata: ' + e));
          })
          .catch(e => {
              console.log("Failed to get inputs during recipe edit: " + e);
              reject();
          });
      });
      return p;
  };

  updateInputs(inputs) {
    // add a property to the original set of inputs, that indicates whether the
    // input is in the recipe or not
    let selected = this.state.recipeComponents;
    selected.map(component => {
      let index = inputs.map(input => {return input.name}).indexOf(component.name);
      if (index >= 0) {
          inputs[index].inRecipe = true;
      }
    });
    this.setState({inputComponents: inputs});
  };

  getFilteredInputs(event) {
    if (event.which == 13 || event.keyCode == 13) {
      let filter = [{
        "field": "name",
        "value": event.target.value
      }];
      Promise.all([this.getInputs("/*" + filter[0].value + "*")]).then((data) => {
        this.setState({filteredComponents : data[0]});
        this.setState({inputFilters : filter});
        // this.updateInputs(data[0]); TODO this should be used and refactored to work with any state value
      }).catch(e => console.log('Failed to filter inputs during recipe edit: ' + e));
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

    // get metadata and dependencies for the component
    Promise.all([
        MetadataApi.getMetadataComponent(component, version)
    ]).then((data) => {
      let recipeComponents = this.state.recipeComponents.slice(0);
      let updatedRecipeComponents = recipeComponents.concat(data[0][0]);
      this.setState({recipeComponents: updatedRecipeComponents});
      let recipeDependencies = this.state.recipeDependencies;
      this.setState({recipeDependencies: recipeDependencies.concat(data[0][1])});
      RecipeApi.updateRecipe(data[0][0], "add");
    }).catch(e => console.log('Error getting component metadata: ' + e));

    // if an input is selected, deselect it
    let inputs = this.removeInputActive();
    // set inRecipe to true for the input component as well
    // TODO this does not work for filtered inputs
    inputs[inputs.indexOf(component)].inRecipe = true;
    // TODO if inputs also lists dependencies, should these be indicated as included?
    this.setState({inputComponents: inputs});
    this.setState({selectedComponent: ""});
    this.setState({selectedComponentStatus: ""});
    // remove the inline message above the list of inputs
    this.clearInputAlert();
  };

  handleRemoveComponent = (event, component) => {
    // the user clicked Remove for a component in the recipe component list
    // or the component details view

    // update the recipe object (the one that's used during save)
    RecipeApi.updateRecipe(component, "remove");
    // if the removed component was visible in the details view then close the
    // details view and deselect it in the list of inputs
    let inputs = [];
    if (component == this.state.selectedComponent) {
      inputs = this.removeInputActive();
      this.hideComponentDetails();
    } else {
      inputs = this.state.inputComponents.slice(0);
    }
    // update the list of available components to include the Add button for the
    // removed component
    let inputIndex = inputs.map(i => i.name).indexOf(component.name);
    if (inputIndex > -1) {
      inputs[inputIndex].inRecipe = false;
      this.setState({inputComponents: inputs});
    }
    // update the list of recipe components to not include the removed component
    let updatedRecipeComponents = this.state.recipeComponents.slice(0);
    updatedRecipeComponents = updatedRecipeComponents.filter(obj => (obj !== component));
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
    const recipeDisplayName = this.props.route.params.recipe;

    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <div className="cmpsr-edit-actions pull-right">
          <ul className="list-inline">
            <li>
              <button className="btn btn-primary" type="button" onClick={(e) => RecipeApi.handleSaveRecipe()}>Save</button>
            </li>
            <li>
              <button className="btn btn-default" type="button">Discard Changes</button>
            </li>
          </ul>
        </div>
				<ol className="breadcrumb">
					<li><Link to="/recipes">Back to Recipes</Link></li>
					<li><Link to={"/recipe/" + recipeDisplayName }>{recipeDisplayName}</Link></li>
					<li className="active"><strong>Edit Recipe</strong></li>
				</ol>
        <div className="cmpsr-title-summary">
          <h1 className="cmpsr-title-summary__item">{ recipeDisplayName }</h1><p className="cmpsr-title-summary__item">Revision 3<span className="text-muted">, Total Disk Space: 1,234 KB</span></p>
        </div>
        <div className="row">

          { this.state.selectedComponent == "" &&
          <div className="col-sm-7 col-md-8 col-sm-push-5 col-md-push-4" id="cmpsr-recipe-list-edit">
						<Toolbar />
            { this.state.recipeComponents.length == 0 &&
            <EmptyState title={"Add Recipe Components"} message={"Browse or search for components, then add them to the recipe."} >
            </EmptyState>
            ||
            <RecipeContents components={ this.state.recipeComponents }
              dependencies={ this.state.recipeDependencies }
              handleRemoveComponent={this.handleRemoveComponent.bind(this)} handleComponentDetails={this.handleComponentDetails.bind(this)} />
            }
					</div>
          ||
          <div className="col-sm-7 col-md-8 col-sm-push-5 col-md-push-4" id="cmpsr-recipe-details-edit">
            <ComponentDetailsView
              parent={ recipeDisplayName }
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
