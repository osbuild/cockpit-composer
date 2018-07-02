/* global $ */

import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import BlueprintContents from '../../components/ListView/BlueprintContents';
import ComponentInputs from '../../components/ListView/ComponentInputs';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateImage from '../../components/Modal/CreateImage';
import ExportBlueprint from '../../components/Modal/ExportBlueprint';
import PendingChanges from '../../components/Modal/PendingChanges';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import Loading from '../../components/Loading/Loading';
import BlueprintToolbar from '../../components/Toolbar/BlueprintToolbar';
import BlueprintApi from '../../data/BlueprintApi';
import NotificationsApi from '../../data/NotificationsApi';
import { connect } from 'react-redux';
import {
  fetchingBlueprintContents, setBlueprint, addBlueprintComponent, committingBlueprint,
  removeBlueprintComponent, undo, redo, commitToWorkspace, deleteHistory, startCompose,
} from '../../core/actions/blueprints';
import {
  fetchingInputs, setInputComponents, setSelectedInputPage,
  setSelectedInput, setSelectedInputStatus, setSelectedInputParent, deleteFilter,
} from '../../core/actions/inputs';
import { setModalActive } from '../../core/actions/modals';
import {
  componentsSortSetKey, componentsSortSetValue, dependenciesSortSetKey, dependenciesSortSetValue,
} from '../../core/actions/sort';
import { componentsFilterAddValue, componentsFilterRemoveValue, componentsFilterClearValues } from '../../core/actions/filter';
import {
  makeGetBlueprintById, makeGetSortedSelectedComponents, makeGetSortedDependencies,
  makeGetFutureLength, makeGetPastLength, makeGetFilteredComponents
} from '../../core/selectors';

class EditBlueprintPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleAddComponent = this.handleAddComponent.bind(this);
    this.handleUpdateComponent = this.handleUpdateComponent.bind(this);
    this.handleRemoveComponent = this.handleRemoveComponent.bind(this);
    this.handleComponentDetails = this.handleComponentDetails.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHistory = this.handleHistory.bind(this);
    this.handleDiscardChanges = this.handleDiscardChanges.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
  }

  componentWillMount() {
    // get blueprint, get inputs; then update inputs
    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, '-'));
      this.props.fetchingInputs(this.props.inputs.inputFilters, 0, 50, undefined);
    } else {
      this.props.fetchingInputs(this.props.inputs.inputFilters, 0, 50, this.props.blueprint.components);
    }
    this.props.setSelectedInputPage(0);
    this.props.setSelectedInput('');
    this.props.setSelectedInputParent('');
    this.props.setSelectedInputStatus('');
  }

  componentDidMount() {
    document.title = 'Blueprint';
  }

  componentWillUnmount() {
    this.props.deleteFilter();
  }

  setNotifications() {
    this.layout.setNotifications();
  }

  getFilteredInputs(event) {
    if (event.which === 13 || event.keyCode === 13) {
      const filter = {
        field: 'name',
        value: event.target.value,
      };
      this.props.fetchingInputs(filter, 0, this.props.inputs.pageSize, this.props.selectedComponents);
      this.props.setSelectedInputPage(0);
      // TODO handle the case where no results are returned
      $('#cmpsr-blueprint-input-filter').blur();
      event.preventDefault();
    }
  }


  updateInputComponentData(inputs, page, componentData) {
    // updates the input component data to match the blueprint component data
    // where componentData represents either a single blueprint component
    // or the entire set of blueprint components
    if (componentData === undefined) {
      componentData = this.props.selectedComponents; // eslint-disable-line no-param-reassign
    }
    let updatedInputs = inputs;
    if (componentData.length > 0) {
      updatedInputs = componentData.map(component => {
        const index = inputs[page].map(input => input.name).indexOf(component.name);
        if (index >= 0) {
          inputs[page][index].inBlueprint = true; // eslint-disable-line no-param-reassign
          inputs[page][index].userSelected = true; // eslint-disable-line no-param-reassign
          inputs[page][index].versionSelected = component.version; // eslint-disable-line no-param-reassign
          inputs[page][index].releaseSelected = component.release; // eslint-disable-line no-param-reassign
        }
        return inputs;
      });
      updatedInputs = updatedInputs[0];
    }
    return updatedInputs;
  }

  handleClearFilters(event) {
    const filter = {
      field: 'name',
      value: '',
    };
    this.props.deleteFilter();
    this.props.fetchingInputs(filter, 0, this.props.inputs.pageSize, this.props.blueprint.components);
    $('#cmpsr-blueprint-input-filter').val('');
    event.preventDefault();
    event.stopPropagation();
  }

  handlePagination(event) {
    // the event target knows what page to get
    // the event target can either be the paging buttons on the page input
    let page;

    if (event.currentTarget.localName === 'a') {
      page = parseFloat(event.currentTarget.getAttribute('data-page'));
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
    this.props.setSelectedInputPage(page);
    const filter = this.props.inputs.inputFilters;
    // check if filters are set to determine current input set
    if (this.props.inputs.inputComponents.slice(0)[page].length === 0) {
      this.props.fetchingInputs(filter, page, this.props.inputs.pageSize, this.props.selectedComponents);
    }
  }

  clearInputAlert() {
    $('#cmpsr-blueprint-inputs .alert').remove();
  }

  handleCommit () {
    // clear existing notifications
    NotificationsApi.closeNotification(undefined, 'committed');
    NotificationsApi.closeNotification(undefined, 'committing');
    // display the committing notification
    NotificationsApi.displayNotification(this.props.blueprint.name, 'committing');
    this.setNotifications();
    // post blueprint (includes 'committed' notification)
    Promise.all([BlueprintApi.handleCommitBlueprint(this.props.blueprint)])
      .then(() => {
        // then after blueprint is posted, reload blueprint details
        // to get details that were updated during commit (i.e. version)
        Promise.all([BlueprintApi.reloadBlueprintDetails(this.props.blueprint)])
          .then(data => {
            const blueprintToSet = this.props.blueprint;
            blueprintToSet.name = data[0].name;
            blueprintToSet.description = data[0].description;
            blueprintToSet.version = data[0].version;
            this.props.setBlueprint(blueprintToSet);
          })
          .catch(e => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch(e => console.log(`Error in blueprint commit: ${e}`));
  }

  handleAddComponent(event, source, component) {
    // the user clicked Add in the sidebar, e.g. source === "input"
    // or the user clicked Add in the details view
    component.inBlueprint = true; // eslint-disable-line no-param-reassign
    component.userSelected = true; // eslint-disable-line no-param-reassign
    if (component !== undefined) {
      if (source === 'input') {
        $(event.currentTarget).tooltip('hide');
      }
      // if source is the details view, then metadata is already known and passed with component
      this.props.addBlueprintComponent(this.props.blueprint, component);
    }
    BlueprintApi.updateBlueprint(component, 'add');
    // update input component data to match the blueprint component data
    this.updateInputComponentsOnChange(component);
    // TODO if inputs also lists dependencies, should these be indicated as included in the list of available components?
    this.props.setSelectedInput('');
    this.props.setSelectedInputStatus('');
    // remove the inline message above the list of inputs
    this.clearInputAlert();
    event.preventDefault();
    event.stopPropagation();
  }

  handleUpdateComponent(event, component) {
    // the user clicked Edit in the details view and saved updates to the component version
    // find component in blueprint components
    // update blueprint component with saved updates
    this.hideComponentDetails();
    // update input component with committed Updates
    this.updateInputComponentsOnChange(component);
    // update the blueprint object that's used during commit
    event.preventDefault();
    event.stopPropagation();

    this.props.commitToWorkspace(this.props.blueprint.id);
  }

  handleRemoveComponent(event, component) {
    // the user clicked Remove for a component in the blueprint component list
    // or the component details view
    // update the blueprint object that's used during commit
    BlueprintApi.updateBlueprint(component, 'remove');
    // hide the details view
    this.hideComponentDetails();
    // update input component data
    this.updateInputComponentsOnChange(component, 'remove');
    // update the list of blueprint components to not include the removed component
    this.props.removeBlueprintComponent(this.props.blueprint, component);
    event.preventDefault();
    event.stopPropagation();
  }

  updateInputComponentsOnChange(component, remove) {
    let inputs = this.props.inputs.inputComponents.slice(0);
    inputs = this.removeInputActive(inputs);
    if (remove === 'remove') {
      // set inBlueprint to false for the selected component
      // in the list of available inputs
      inputs = this.removeBlueprintComponent(component, inputs);
      this.props.setInputComponents(inputs);
    } else {
      // set inBlueprint to true for the selected component
      // in the list of available inputs
      const input = this.findInput(component, inputs);
      const page = input[0];
      const index = input[1];
      if (index >= 0) {
        // the page where the component is listed might not be defined (e.g.
        // the user filtered to find a component)
        inputs = this.updateInputComponentData(inputs, page, [component]);
        this.props.setInputComponents(inputs);
      }
    }
  }

  removeBlueprintComponent(component, inputs) {
    const [page, index] = this.findInput(component, inputs);
    // get page and index of component; if component is included in the array
    // of inputs, then update metadata for the input component
    if (index >= 0) {
      inputs[page][index].inBlueprint = false; // eslint-disable-line no-param-reassign
      inputs[page][index].userSelected = false; // eslint-disable-line no-param-reassign
      delete inputs[page][index].versionSelected; // eslint-disable-line no-param-reassign
      delete inputs[page][index].releaseSelected; // eslint-disable-line no-param-reassign
    }

    return inputs;
  }

  handleComponentDetails (event, component, parent, mode) {
    // the user selected a component in the sidebar to view more details on the right
    // remove the active state from the current selected component
    let inputs = this.props.inputs.inputComponents.slice(0);
    inputs = this.removeInputActive(inputs);
    if (component !== this.props.selectedInput.component) {
      // if the user did not click on the current selected component:
      // set state for selected component
      this.props.setSelectedInput(component);
      this.props.setSelectedInputParent(parent);
      // if the selected component is in the list of inputs
      // then set active to true so that it is highlighted
      const [page, index] = this.findInput(component, inputs);
      if (index >= 0) {
        inputs[page][index].active = true;
      }
      this.props.setInputComponents(inputs);
      // set activeComponentStatus
      if (mode === 'edit') {
        // if I clicked Edit in list item kebab
        this.props.setSelectedInputStatus('editSelected');
      } else if (parent === undefined || parent === '') {
        // if parent is not defined (i.e. I clicked a component in the input list
        // or component list, or I clicked the first component in the breadcrumb)
        if (component.userSelected === true) {
          // and component is selected by the user to be in the blueprint,
          // then set state to selected
          this.props.setSelectedInputStatus('selected');
        } else if (component.inBlueprint === true) {
          // and component is automatically pulled into the blueprint as a dependency,
          // then set state to selected-child
          this.props.setSelectedInputStatus('selected-child');
        } else {
          // and component is not in the blueprint, then set state to available
          this.props.setSelectedInputStatus('available');
        }
      } else {
        // if parent is defined (i.e. I clicked a component listed in the details view)
        if (this.props.selectedInput.status === 'selected') {
          // and state is selected, then state should be selected-child
          this.props.setSelectedInputStatus('selected-child');
        } else if (this.props.selectedInput.status === 'available') {
          // and state is available, then state should be available-child
          this.props.setSelectedInputStatus('available-child');
        }
        // if parent is defined
        // and state is selected-child or available-child, then state should be unchanged
      }
    } else {
      // if the user clicked on the current selected component:
      this.props.setInputComponents(inputs);
      this.hideComponentDetails();
    }
    event.preventDefault();
    event.stopPropagation();
  }

  hideComponentDetails() {
    this.props.setSelectedInput('');
    this.props.setSelectedInputParent('');
    this.props.setSelectedInputStatus('');
  }

  removeInputActive(inputs) {
    if (this.props.selectedInput.component !== '') {
      // remove the active state from list of inputs
      const [page, index] = this.findInput(this.props.selectedInput.component, inputs);
      if (index >= 0) {
        inputs[page][index].active = false; // eslint-disable-line no-param-reassign
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

  // handle show/hide of modal dialogs
  handleHideModal() {
    this.props.setModalActive(null);
  }
  handleShowModal(e, modalType) {
    switch (modalType) {
      case 'modalPendingChanges':
        // this.getComponentUpdates();
        this.props.setModalActive('modalPendingChanges');
        break;
      case 'modalExportBlueprint':
        this.props.setModalActive('modalExportBlueprint');
        break;
      case 'modalCreateImage':
        this.props.setModalActive('modalCreateImage');
        break;
      default:
        this.props.setModalActive(null);
        break;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  handleHistory() {
    setTimeout(() => {
      this.props.fetchingInputs(
        this.props.inputs.inputFilters,
        this.props.inputs.selectedInputPage,
        this.props.inputs.pageSize,
        this.props.selectedComponents,
      );
    }, 50);
  }

  handleDiscardChanges() {
    this.props.deleteHistory(this.props.blueprint.id);
    this.handleHistory();
    this.props.commitToWorkspace(this.props.blueprint.id);
  }

  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  render() {
    if (this.props.blueprint.id === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, '-'));
      return <div></div>;
    }
    const blueprintDisplayName = this.props.route.params.blueprint;
    const {
      blueprint, selectedComponents, dependencies,
      inputs, createImage, modalActive, componentsSortKey, componentsSortValue,
      componentsFilters, pastLength, futureLength,
    } = this.props;

    const numPendingChanges = blueprint.localPendingChanges.length
      + blueprint.workspacePendingChanges.addedChanges.length
      + blueprint.workspacePendingChanges.deletedChanges.length;

    return (
      <Layout
        className="cmpsr-grid__wrapper"
        ref={c => {
          this.layout = c;
        }}
      >
        <header className="cmpsr-header">
          <ol className="breadcrumb">
            <li><Link to="/blueprints">Back to Blueprints</Link></li>
            <li><Link to={`/blueprint/${blueprintDisplayName}`}>{blueprintDisplayName}</Link></li>
            <li className="active"><strong>Edit Blueprint</strong></li>
          </ol>
          <div className="cmpsr-header__actions">
            <ul className="list-inline">
              {numPendingChanges > 0 &&
                <li>
                  <a href="#" onClick={e => this.handleShowModal(e, 'modalPendingChanges')}>
                    {numPendingChanges !== 1 &&
                      <span>{numPendingChanges} Pending Changes</span>
                    ||
                      <span>1 Pending Change</span>
                    }
                  </a>
                </li>
              }
              {numPendingChanges > 0 &&
                <li>
                  <button className="btn btn-primary" onClick={e => this.handleShowModal(e, 'modalPendingChanges')}>
                    Commit
                  </button>
                </li>
              ||
                <li>
                  <button className="btn btn-primary disabled" type="button">Commit</button>
                </li>
              }
              {numPendingChanges > 0 &&
                <li>
                  <button className="btn btn-default" type="button" onClick={this.handleDiscardChanges}>
                    Discard Changes
                  </button>
                </li>
              ||
                <li>
                  <button className="btn btn-default disabled" type="button">
                    Discard Changes
                  </button>
                </li>
              }
              <li className="list__subgroup-item--first">
                <button
                  className={`btn btn-default ${selectedComponents.length ? '' : 'disabled'}`}
                  id="cmpsr-btn-crt-image"
                  data-toggle="modal"
                  data-target="#cmpsr-modal-crt-image"
                  type="button"
                  onClick={e => this.handleShowModal(e, 'modalCreateImage')}
                >
                  Create Image
                </button>
              </li>
              <li>
                <div className="dropdown dropdown-kebab-pf">
                  <button
                    className="btn btn-link dropdown-toggle"
                    type="button"
                    id="dropdownKebab"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="fa fa-ellipsis-v" />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
                    {selectedComponents.length &&
                      <li><a href="#" onClick={e => this.handleShowModal(e, 'modalExportBlueprint')}>Export</a></li>
                    ||
                      <li className="disabled"><a>Export</a></li>
                    }
                  </ul>
                </div>
              </li>
            </ul>


          </div>
          <div className="cmpsr-title">
            <h1 className="cmpsr-title__item">{blueprintDisplayName}</h1>
          </div>
        </header>
        {(inputs.selectedInput !== undefined && inputs.selectedInput.component === '' &&
          <h3 className="cmpsr-panel__title cmpsr-panel__title--main">Blueprint Components</h3>) ||
          <h3 className="cmpsr-panel__title cmpsr-panel__title--main">Component Details</h3>}
        {(inputs.selectedInput !== undefined && inputs.selectedInput.component === '' &&
          <div className="cmpsr-panel__body cmpsr-panel__body--main">
          {componentsSortKey !== undefined && componentsSortValue !== undefined &&
            <BlueprintToolbar
              emptyState={
                (selectedComponents === undefined || selectedComponents.length === 0) &&
                componentsFilters.filterValues.length === 0
              }
              blueprintId={blueprint.id}
              filters={componentsFilters}
              filterRemoveValue={this.props.componentsFilterRemoveValue}
              filterClearValues={this.props.componentsFilterClearValues}
              filterAddValue={this.props.componentsFilterAddValue}
              componentsSortKey={componentsSortKey}
              componentsSortValue={componentsSortValue}
              componentsSortSetValue={this.props.componentsSortSetValue}
              dependenciesSortSetValue={this.props.dependenciesSortSetValue}
              undo={this.props.undo}
              redo={this.props.redo}
              handleHistory={this.handleHistory}
              pastLength={pastLength}
              futureLength={futureLength}
            />
          }
            <BlueprintContents
              components={selectedComponents}
              dependencies={dependencies}
              handleRemoveComponent={this.handleRemoveComponent}
              handleComponentDetails={this.handleComponentDetails}
              filterClearValues={this.props.componentsFilterClearValues}
              filterValues={componentsFilters.filterValues}
              errorState={this.props.blueprintContentsError}
              fetchingState={this.props.blueprintContentsFetching}
            >
              <EmptyState
                title={'Add Blueprint Components'}
                message={'Browse or search for components, then add them to the blueprint.'}
              />
            </BlueprintContents>
          </div>
          )
        ||
        inputs.selectedInput !== undefined &&
          <ComponentDetailsView
            parent={blueprintDisplayName}
            component={inputs.selectedInput.component}
            componentParent={inputs.selectedInput.parent}
            status={inputs.selectedInput.status}
            handleComponentDetails={this.handleComponentDetails}
            handleAddComponent={this.handleAddComponent}
            handleUpdateComponent={this.handleUpdateComponent}
            handleRemoveComponent={this.handleRemoveComponent}
          />
        }
        <h3 className="cmpsr-panel__title cmpsr-panel__title--sidebar">Available Components</h3>
        {inputs.inputComponents !== undefined &&
          <div className="cmpsr-panel__body cmpsr-panel__body--sidebar">
            <div className="toolbar-pf">
              <form className="toolbar-pf-actions" >
                <div className="form-group toolbar-pf-filter">
                  <input
                    type="text"
                    className="form-control"
                    id="cmpsr-blueprint-input-filter"
                    aria-label="Filter Available Components by Name"
                    placeholder="Filter By Name..."
                    onKeyPress={(e) => this.getFilteredInputs(e)}
                  />
                </div>
              </form>
              <div className="toolbar-pf-results">
                {inputs.inputFilters !== undefined && inputs.inputFilters.value.length > 0 &&
                  <ul className="list-inline">
                    <li>
                      <span className="label label-info">
                        Name: {inputs.inputFilters.value}
                        <a href="#" onClick={e => this.handleClearFilters(e)}>
                          <span className="pficon pficon-close" />
                        </a>
                      </span>
                    </li>
                    <li>
                      <a href="#" onClick={e => this.handleClearFilters(e)}>Clear All Filters</a>
                    </li>
                  </ul>
                }
                <Pagination
                  cssClass="cmpsr-blueprint__inputs__pagination"
                  currentPage={inputs.selectedInputPage}
                  totalItems={inputs.totalInputs}
                  pageSize={inputs.pageSize}
                  handlePagination={this.handlePagination}
                />
              </div>
            </div>
            {(blueprint.components.length === 0 || blueprint.components === undefined ) &&
              <div className="alert alert-info alert-dismissable">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true" aria-label="Dismiss Message">
                  <span className="pficon pficon-close" />
                </button>
                <span className="pficon pficon-info" />
                <strong>Select components</strong> in this list to add to the blueprint.
              </div>
            }
            <ComponentInputs
              components={inputs.inputComponents[inputs.selectedInputPage]}
              handleComponentDetails={this.handleComponentDetails}
              handleAddComponent={this.handleAddComponent}
              handleRemoveComponent={this.handleRemoveComponent}
            />
          </div>
          ||
          <div className="cmpsr-panel__body cmpsr-panel__body--sidebar">
            <div className="toolbar-pf">
              <form className="toolbar-pf-actions" >
                <div className="form-group toolbar-pf-filter">
                  <input
                    type="text"
                    className="form-control"
                    id="cmpsr-blueprint-input-filter"
                    aria-label="Filter Available Components by Name"
                    placeholder="Filter By Name..."
                    disabled="disabled"
                  />
                </div>
              </form>
            </div>
            <Loading />
          </div>
        }
        {modalActive === 'modalCreateImage'
          ? <CreateImage
            blueprint={blueprint.name}
            setNotifications={this.setNotifications}
            handleStartCompose={this.handleStartCompose}
            imageTypes={createImage.imageTypes}
            handleHideModal={this.handleHideModal}
          />
          : null}
        {modalActive === 'modalExportBlueprint'
          ? <ExportBlueprint
            blueprint={blueprint.name}
            contents={blueprint.components}
            handleHideModal={this.handleHideModal}
          />
          : null}
        {modalActive === 'modalPendingChanges'
          ? <PendingChanges
            handleCommit={this.handleCommit}
            blueprint={blueprint}
            contents={dependencies}
            handleHideModal={this.handleHideModal}
          />
          : null}
      </Layout>
    );
  }
}

EditBlueprintPage.propTypes = {
  route: PropTypes.object,
  blueprint: PropTypes.object,
  createImage: PropTypes.object,
  inputs: PropTypes.object,
  modalActive: PropTypes.string,
  selectedInput: PropTypes.object,
  fetchingBlueprintContents: PropTypes.func,
  setBlueprint: PropTypes.func,
  committingBlueprint: PropTypes.func,
  removeBlueprintComponent: PropTypes.func,
  fetchingInputs: PropTypes.func,
  setInputComponents: PropTypes.func,
  setSelectedInputPage: PropTypes.func,
  setSelectedInput: PropTypes.func,
  setSelectedInputStatus: PropTypes.func,
  setSelectedInputParent: PropTypes.func,
  deleteFilter: PropTypes.func,
  addBlueprintComponent: PropTypes.func,
  setModalActive: PropTypes.func,
  dependenciesSortSetValue: PropTypes.func,
  componentsSortSetValue: PropTypes.func,
  selectedComponents: PropTypes.array,
  dependencies: PropTypes.array,
  componentsSortKey: PropTypes.string,
  componentsSortValue: PropTypes.string,
  componentsFilters: PropTypes.object,
  componentsFilterAddValue: PropTypes.func,
  componentsFilterRemoveValue: PropTypes.func,
  componentsFilterClearValues: PropTypes.func,
  pastLength: PropTypes.number,
  futureLength: PropTypes.number,
  undo: PropTypes.func,
  redo: PropTypes.func,
  commitToWorkspace: PropTypes.func,
  deleteHistory: PropTypes.func,
  startCompose: PropTypes.func,
  blueprintContentsError: PropTypes.object,
  blueprintContentsFetching: PropTypes.bool,
};

const makeMapStateToProps = () => {
  const getBlueprintById = makeGetBlueprintById();
  const getSortedSelectedComponents = makeGetSortedSelectedComponents();
  const getSortedDependencies = makeGetSortedDependencies();
  const getFilteredComponents = makeGetFilteredComponents();
  const getPastLength = makeGetPastLength();
  const getFutureLength = makeGetFutureLength();
  const mapStateToProps = (state, props) => {
    if (getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, '-')) !== undefined) {
      const fetchedBlueprint = getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, '-'));
      return {
        blueprint: fetchedBlueprint.present,
        selectedComponents: getFilteredComponents(state, getSortedSelectedComponents(state, fetchedBlueprint.present)),
        dependencies: getFilteredComponents(state, getSortedDependencies(state, fetchedBlueprint.present)),
        componentsSortKey: state.sort.components.key,
        componentsSortValue: state.sort.components.value,
        componentsFilters: state.filter.components,
        createImage: state.modals.createImage,
        inputs: state.inputs,
        selectedInput: state.inputs.selectedInput,
        modalActive: state.modals.modalActive,
        pastLength: getPastLength(fetchedBlueprint),
        futureLength: getFutureLength(fetchedBlueprint),
        blueprintContentsError: fetchedBlueprint.errorState,
        blueprintContentsFetching:
          fetchedBlueprint.present.components === undefined &&
          fetchedBlueprint.errorState === undefined ? true : false,
      };
    }
    return {
      blueprint: {},
      selectedComponents: [],
      dependencies: [],
      componentsSortKey: state.sort.components.key,
      componentsSortValue: state.sort.components.value,
      componentsFilters: state.filter.components,
      createImage: state.modals.createImage,
      inputs: state.inputs,
      selectedInput: state.inputs.selectedInput,
      modalActive: state.modals.modalActive,
      pastLength: 0,
      futureLength: 0,
      blueprintContentsError: {},
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  fetchingBlueprintContents: blueprintId => {
    dispatch(fetchingBlueprintContents(blueprintId));
  },
  fetchingInputs: (filter, selectedInputPage, pageSize, componentData) => {
    dispatch(fetchingInputs(filter, selectedInputPage, pageSize, componentData));
  },
  setInputComponents: (inputComponents) => {
    dispatch(setInputComponents(inputComponents));
  },
  setSelectedInputPage: (selectedInputPage) => {
    dispatch(setSelectedInputPage(selectedInputPage));
  },
  setBlueprint: blueprint => {
    dispatch(setBlueprint(blueprint));
  },
  addBlueprintComponent: (blueprint, component) => {
    dispatch(addBlueprintComponent(blueprint, component));
  },
  removeBlueprintComponent: (blueprint, component) => {
    dispatch(removeBlueprintComponent(blueprint, component));
  },
  setSelectedInput: (selectedInput) => {
    dispatch(setSelectedInput(selectedInput));
  },
  setSelectedInputStatus: (selectedInputStatus) => {
    dispatch(setSelectedInputStatus(selectedInputStatus));
  },
  setSelectedInputParent: (selectedInputParent) => {
    dispatch(setSelectedInputParent(selectedInputParent));
  },
  deleteFilter: () => {
    dispatch(deleteFilter());
  },
  committingBlueprint: (blueprint) => {
    dispatch(committingBlueprint(blueprint));
  },
  setModalActive: (modalActive) => {
    dispatch(setModalActive(modalActive));
  },
  componentsSortSetKey: key => {
    dispatch(componentsSortSetKey(key));
  },
  componentsSortSetValue: value => {
    dispatch(componentsSortSetValue(value));
  },
  dependenciesSortSetKey: key => {
    dispatch(dependenciesSortSetKey(key));
  },
  dependenciesSortSetValue: value => {
    dispatch(dependenciesSortSetValue(value));
  },
  componentsFilterAddValue: value => {
    dispatch(componentsFilterAddValue(value));
  },
  componentsFilterRemoveValue: value => {
    dispatch(componentsFilterRemoveValue(value));
  },
  componentsFilterClearValues: value => {
    dispatch(componentsFilterClearValues(value));
  },
  undo: (blueprintId) => {
    dispatch(undo(blueprintId));
  },
  redo: (blueprintId) => {
    dispatch(redo(blueprintId));
  },
  deleteHistory: (blueprintId) => {
    dispatch(deleteHistory(blueprintId));
  },
  commitToWorkspace: (blueprintId) => {
    dispatch(commitToWorkspace(blueprintId));
  },
  startCompose: (blueprintName, composeType) => {
    dispatch(startCompose(blueprintName, composeType));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(EditBlueprintPage);
