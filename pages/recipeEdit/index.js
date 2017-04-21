import React, { PropTypes } from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import RecipeContents from '../../components/ListView/RecipeContents';
import ComponentInputs from '../../components/ListView/ComponentInputs';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateComposition from '../../components/Modal/CreateComposition';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import Toolbar from '../../components/Toolbar/Toolbar';
import constants from '../../core/constants';
import RecipeApi from '../../data/RecipeApi';
import MetadataApi from '../../data/MetadataApi';
import utils from '../../core/utils';

class EditRecipePage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  state = {
    recipe: {},
    recipeComponents: [], recipeDependencies: [],
    inputComponents: [[]], inputFilters: [], filteredComponents: [[]],
    selectedComponent: '', selectedComponentStatus: '', selectedComponentParent: '',
    selectedInputPage: 0, inputPageSize: 50, totalInputs: 0, totalFilteredInputs: 0,
  };

  componentWillMount() {
    // get recipe, get inputs; then update inputs
    const recipeName = this.props.route.params.recipe.replace(/\s/g, '-');
    Promise.all([RecipeApi.getRecipe(recipeName), this.getInputs('', 0)]).then((data) => {
        const recipe = {
          'name': data[0].name,
          'description': data[0].description,
          'version': data[0].version
        };
        this.setState({recipe: recipe});
        this.setState({recipeComponents: data[0].components});
        this.setState({recipeDependencies: data[0].dependencies});
        // Recipes and available components both need to be updated before running this
        this.setState({totalInputs: data[1][1]});
        let inputs = [this.updateInputComponentData(data[1][0])];
        let totalPages = Math.ceil((this.state.totalInputs / this.state.inputPageSize) - 1)
        for (let i = 1; i <= totalPages; i++) {
          inputs.push([]);
        }
        this.setState({inputComponents: inputs});

    }).catch(e => console.log('Error in EditRecipe promise: ' + e));
  }

  componentDidMount() {
    document.title = 'Recipe';
  }

  setNotifications = () => {
    this.refs.layout.setNotifications();
  }

  getInputs(filter, page){
    // for now, this gets full metadata and dependencies of list that's returned
    // but ideally the returned list would provide only what's needed to display
    // in the list and the popover, then the remaining data would be fetched on
    // Add or View Details
    filter = (filter === undefined) ? '' : filter;
    page = page * this.state.inputPageSize;
      let p = new Promise((resolve, reject) => {
          // /modules/list looks like:
          // {"modules":[{"name":"389-ds-base","group_type":"rpm"},{"name":"389-ds-base-libs","group_type":"rpm"}, ...]}
          utils.apiFetch(constants.get_modules_list + filter + "?limit=" + this.state.inputPageSize + "&offset=" + page)
          .then(data => {
              let total = data.total;
              let components = data.modules;
              let componentNames = MetadataApi.getNames(components);
              Promise.all([
                  MetadataApi.getData(constants.get_projects_info + componentNames)
              ]).then((data) => {
                components = MetadataApi.updateInputMetadata(components, data[0], true);
                components.map(i => {i.ui_type = "RPM"}) // this is being set arbitrarily for now
                resolve([components, total]);
              }).catch(e => console.log('Error getting recipe metadata: ' + e));
          })
          .catch(e => {
              console.log("Failed to get inputs during recipe edit: " + e);
              reject();
          });
      });
      return p;
  }

  updateInputComponentData(inputs, componentData) {
    // updates the input component data to match the recipe component data
    // where componentData represents either a single recipe component
    // or the entire set of recipe components
    if (componentData === undefined) {
      componentData = this.state.recipeComponents;
    }
    componentData.map(component => {
      let index = inputs.map(input => input.name).indexOf(component.name);
      if (index >= 0) {
          inputs[index].inRecipe = true;
          inputs[index].user_selected = true;
          inputs[index].version_selected = component.version;
          inputs[index].release_selected = component.release;
      }
    });
    return inputs;
  }

  getFilteredInputs(event) {
    if (event.which === 13 || event.keyCode === 13) {
      let filter = [{
        "field": "name",
        "value": event.target.value
      }];
      Promise.all([this.getInputs("/*" + filter[0].value + "*", 0)]).then((data) => {
        let inputs = [this.updateInputComponentData(data[0][0])];
        let totalPages = Math.ceil((data[0][1] / this.state.inputPageSize) - 1);
        for (let i = 1; i <= totalPages; i++) {
          inputs.push([]);
        }
        this.setState({selectedInputPage: 0});
        this.setState({totalFilteredInputs: data[0][1]});
        this.setState({filteredComponents: inputs});
        this.setState({inputFilters: filter});
      }).catch(e => console.log('Failed to filter inputs during recipe edit: ' + e));
      // TODO handle the case where no results are returned
      $('#cmpsr-recipe-input-filter').blur();
      event.preventDefault();
    }
  }

  handleClearFilters(event) {
    this.setState({selectedInputPage: 0});
    this.setState({totalFilteredInputs: 0});
    this.setState({filteredComponents: []});
    this.setState({inputFilters: []});
    $('#cmpsr-recipe-input-filter').val('');
    event.preventDefault();
    event.stopPropagation();
  }

  handlePagination = (event) => {
    // the event target knows what page to get
    // the event target can either be the paging buttons on the page input
    let page;

    if (event.currentTarget.localName === "a") {
      page = parseFloat(event.currentTarget.getAttribute("data-page"));
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (event.which === 13 || event.keyCode === 13) {
        page = parseFloat(event.currentTarget.value) - 1;
        event.preventDefault();
        event.stopPropagation();
      } else {
        return; // don't continue if keypress was not the Enter key
      }
    }
    // if the data already exists, just update the selected page number and
    // the DOM will automatically reload
    this.setState({selectedInputPage: page});
    let currentInputs = []
    let filter = ''
    // check if filters are set to determine current input set
    if (this.state.inputFilters.length === 0) {
      currentInputs = [this.state.inputComponents.slice(0), "inputComponents"]
    } else {
      currentInputs = [this.state.filteredComponents.slice(0), "filteredComponents"]
      filter = "/*" + this.state.inputFilters[0].value + "*";
    }
    // then check if the current input set has the requested page
    if (currentInputs[0][page].length === 0) {
      Promise.all([this.getInputs(filter, page)]).then((data) => {
        let inputs = this.updateInputComponentData(data[0][0]);
        currentInputs[0][page] = inputs;
        switch (currentInputs[1]) {
          case 'inputComponents':
            this.setState({inputComponents: currentInputs[0]});
            break;
          case 'filteredComponents':
            this.setState({filteredComponents: currentInputs[0]});
            break;
        }
      }).catch(e => console.log('Failed to load requested page of available components: ' + e));
    }
  }

  clearInputAlert() {
    $("#cmpsr-recipe-inputs .alert").remove();
  }

  handleSave = () => {
    // first post recipe
    Promise.all([RecipeApi.handleSaveRecipe()]).then(() => {
      // then after recipe is posted, reload recipe details
      // to get details that were updated during save (i.e. version)
      Promise.all([RecipeApi.reloadRecipeDetails()]).then((data) => {
        const recipe = {
          name: data[0].name,
          description: data[0].description,
          version: data[0].version,
        };
        this.setState({ recipe });
      }).catch(e => console.log(`Error in reload recipe details: ${e}`));
    }).catch(e => console.log(`Error in recipe save: ${e}`));
  }

  addRecipeComponent(componentData) {
    // component data is [[{component}, [{dependency},{}]]]
    let recipeComponents = this.state.recipeComponents.slice(0);
    let updatedRecipeComponents = recipeComponents.concat(componentData[0][0]);
    this.setState({recipeComponents: updatedRecipeComponents});
    let recipeDependencies = this.state.recipeDependencies;
    this.setState({recipeDependencies: recipeDependencies.concat(componentData[0][0].dependencies)});
    RecipeApi.updateRecipe(componentData[0][0], "add");
  }

  handleAddComponent = (event, source, component, dependencies) => {
    // the user clicked Add in the sidebar, e.g. source === "input"
    // or the user clicked Add in the details view
    component.inRecipe = true;
    component.user_selected = true;
    if (source === "input") {
      $(event.currentTarget).tooltip('hide');
      //get metadata for default build
      Promise.all([
          MetadataApi.getMetadataComponent(component, "")
      ]).then((data) => {
        this.addRecipeComponent(data);
      }).catch(e => console.log('handleAddComponent: Error getting component metadata: ' + e));
    } else {
      // if source is the details view, then metadata is already known and passed with component
      let data = [[component, dependencies]];
      this.addRecipeComponent(data);
    }
    // update input component data to match the recipe component data
    this.updateInputComponentsOnChange(component);
    // TODO if inputs also lists dependencies, should these be indicated as included in the list of available components?
    this.setState({selectedComponent: ""});
    this.setState({selectedComponentStatus: ""});
    // remove the inline message above the list of inputs
    this.clearInputAlert();
    event.preventDefault();
    event.stopPropagation();
  }

  handleUpdateComponent = (event, component) => {
    // the user clicked Edit in the details view and saved updates to the component version
    let recipe = this.state.recipeComponents;
    // find component in recipe components
    let selectedComponent = recipe.filter((obj) => (obj.name === component.name))[0];
    // update recipe component with saved updates
    selectedComponent = Object.assign(selectedComponent, component);
    this.setState({recipeComponents: recipe});
    this.hideComponentDetails();
    // update input component with saved Updates
    this.updateInputComponentsOnChange(component);
    // update the recipe object that's used during save
    RecipeApi.updateRecipe(selectedComponent, "edit");
    event.preventDefault();
    event.stopPropagation();
  }

  handleRemoveComponent = (event, component) => {
    // the user clicked Remove for a component in the recipe component list
    // or the component details view
    // update the recipe object that's used during save
    RecipeApi.updateRecipe(component, 'remove');
    // hide the details view
    this.hideComponentDetails();
    // update input component data
    this.updateInputComponentsOnChange(component, 'remove');
    // update the list of recipe components to not include the removed component
    let updatedRecipeComponents = this.state.recipeComponents.slice(0);
    updatedRecipeComponents = updatedRecipeComponents.filter(obj => (obj !== component));
    this.setState({recipeComponents: updatedRecipeComponents});
    event.preventDefault();
    event.stopPropagation();
  }

  updateInputComponentsOnChange(component, remove) {
    let inputs = this.state.inputComponents.slice(0);
    inputs = this.removeInputActive(inputs);
    let filteredComponents = this.state.filteredComponents.slice(0);
    if (this.state.inputFilters.length > 0) {
      filteredComponents  = this.removeInputActive(filteredComponents);
    }
    if (remove === 'remove') {
      // set inRecipe to false for the selected component
      // in the list of available inputs
      inputs = this.removeRecipeComponent(component, inputs);
      this.setState({inputComponents: inputs});
      // and also the list of filtered inputs
      if (this.state.inputFilters.length > 0) {
        filteredComponents = this.removeRecipeComponent(component, filteredComponents);
        this.setState({filteredComponents: filteredComponents});
      }
    } else {
      // set inRecipe to true for the selected component
      // in the list of available inputs
      let [page, index] = this.findInput(component, inputs);
      if (index >= 0) {
        // the page where the component is listed might not be defined (e.g.
        // the user filtered to find a component)
        inputs[page] = this.updateInputComponentData(inputs[page], [component]);
        this.setState({inputComponents: inputs});
      }
      // and also the list of filtered inputs
      if (this.state.inputFilters.length > 0) {
        let page = this.findInput(component, filteredComponents)[0];
        filteredComponents[page] = this.updateInputComponentData(filteredComponents[page], [component]);
        this.setState({filteredComponents: filteredComponents});
      }
    }
  }

  removeRecipeComponent(component, inputs){
    let [page, index] = this.findInput(component, inputs);
    // get page and index of component; if component is included in the array
    // of inputs, then update metadata for the input component
    if (index >= 0) {
        inputs[page][index].inRecipe = false;
        inputs[page][index].user_selected = false;
        delete inputs[page][index].version_selected;
        delete inputs[page][index].release_selected;
    }
    return inputs;
  }

  handleComponentDetails = (event, component, parent, mode) => {
    // the user selected a component in the sidebar to view more details on the right
    // remove the active state from the current selected component
    let inputs = this.state.inputComponents.slice(0);
    inputs = this.removeInputActive(inputs);
    // and from the filtered components
    let filteredComponents = [];
    if (this.state.inputFilters.length > 0) {
      filteredComponents = this.state.filteredComponents;
      filteredComponents  = this.removeInputActive(filteredComponents);
    }

    if (component !== this.state.selectedComponent) {
      // if the user did not click on the current selected component:
      // set state for selected component
      this.setState({selectedComponent: component});
      this.setState({selectedComponentParent: parent});
      // if the selected component is in the list of inputs
      // then set active to true so that it is highlighted
      let [page, index] = this.findInput(component, inputs);
      if (index >= 0) {
        inputs[page][index].active = true;
      }
      this.setState({inputComponents: inputs});
      if (this.state.inputFilters.length > 0) {
        let [page, index] = this.findInput(component, filteredComponents);
        if (index >= 0) {
          filteredComponents[page][index].active = true;
        }
        this.setState({filteredComponents: filteredComponents});
      }
      // set selectedComponentStatus
      if (mode === 'edit') {
        // if I clicked Edit in list item kebab
        this.setState({selectedComponentStatus: 'editSelected'});
      } else if ( parent == undefined || parent == '' ) {
        // if parent is not defined (i.e. I clicked a component in the input list
        // or component list, or I clicked the first component in the breadcrumb)
        if ( component.user_selected == true ) {
          // and component is selected by the user to be in the recipe,
          // then set state to selected
          this.setState({selectedComponentStatus: 'selected'});
        } else if ( component.inRecipe == true ) {
          // and component is automatically pulled into the recipe as a dependency,
          // then set state to selected-child
          this.setState({selectedComponentStatus: 'selected-child'});
        } else {
          // and component is not in the recipe, then set state to available
          this.setState({selectedComponentStatus: 'available'});
        }
      } else {
        // if parent is defined (i.e. I clicked a component listed in the details view)
        if (this.state.selectedComponentStatus == 'selected') {
          // and state is selected, then state should be selected-child
          this.setState({selectedComponentStatus: 'selected-child'});
        } else if (this.state.selectedComponentStatus == 'available') {
          // and state is available, then state should be available-child
          this.setState({selectedComponentStatus: 'available-child'});
        }
        // if parent is defined
        // and state is selected-child or available-child, then state should be unchanged
      }

    } else {
      // if the user clicked on the current selected component:
      this.setState({inputComponents: inputs});
      this.setState({filteredComponents: filteredComponents});
      this.hideComponentDetails();
    }
    event.preventDefault();
    event.stopPropagation();
  };

  hideComponentDetails() {
    this.setState({selectedComponent: ""});
    this.setState({selectedComponentStatus: ""});
    this.setState({selectedComponentParent: ""});
  }

  removeInputActive(inputs) {
    if (this.state.selectedComponent !== "") {
      // remove the active state from list of inputs
      let [page, index] = this.findInput(this.state.selectedComponent, inputs);
      if (index >= 0) {
        inputs[page][index].active = false;
      }
    }
    return inputs;
  }

  findInput(component, inputs) {
    let page;
    let index = -1;
    for (page = 0; page < inputs.length; page ++) {
      // get the index of the component, and the index of the page
      index = inputs[page].map(input => input.name).indexOf(component.name);
      if (index >= 0) {
        break;
      }
    }
    return ([page, index]);
  }

  render() {
    const recipeDisplayName = this.props.route.params.recipe;

    return (
      <Layout
        className="container-fluid container-pf-nav-pf-vertical"
        ref="layout"
      >
        <div className="cmpsr-edit-actions pull-right">
          <ul className="list-inline">
            <li>
              <button className="btn btn-primary" type="button" onClick={(e) => this.handleSave(e)}>Save</button>
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
          <h1 className="cmpsr-title-summary__item">{recipeDisplayName}</h1>
          <p className="cmpsr-title-summary__item">
            Revision {this.state.recipe.version}
            <span className="text-muted">, Total Disk Space: 1,234 KB</span>
          </p>
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
              handleUpdateComponent={this.handleUpdateComponent.bind(this)}
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
								<div className="row toolbar-pf-results">
									<div className="col-sm-12">
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
                    <Pagination cssClass="cmpsr-recipe-inputs-pagination"
                      currentPage={this.state.selectedInputPage}
                      totalItems={this.state.inputFilters.length === 0 && this.state.totalInputs || this.state.totalFilteredInputs}
                      pageSize={this.state.inputPageSize}
                      handlePagination={this.handlePagination.bind(this)} />

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
            <ComponentInputs components={this.state.inputFilters.length === 0 && this.state.inputComponents[this.state.selectedInputPage] || this.state.filteredComponents[this.state.selectedInputPage]} handleComponentDetails={this.handleComponentDetails.bind(this)} handleAddComponent={this.handleAddComponent.bind(this)} />
					</div>
				</div>
        <CreateComposition
          recipe={this.state.recipe.name}
          setNotifications={this.setNotifications}
        />

      </Layout>

    );
  }

}

export default EditRecipePage;
