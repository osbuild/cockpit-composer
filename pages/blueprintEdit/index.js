/* global $ */

import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Link from "../../components/Link/Link";
import Layout from "../../components/Layout/Layout";
import BlueprintContents from "../../components/ListView/BlueprintContents";
import ComponentInputs from "../../components/ListView/ComponentInputs";
import ComponentDetailsView from "../../components/ListView/ComponentDetailsView";
import CreateImageUpload from "../../components/Modal/CreateImageUpload";
import ExportBlueprint from "../../components/Modal/ExportBlueprint";
import PendingChanges from "../../components/Modal/PendingChanges";
import EmptyState from "../../components/EmptyState/EmptyState";
import Pagination from "../../components/Pagination/Pagination";
import Loading from "../../components/Loading/Loading";
import BlueprintToolbar from "../../components/Toolbar/BlueprintToolbar";
import BlueprintApi from "../../data/BlueprintApi";
import NotificationsApi from "../../data/NotificationsApi";
import {
  fetchingBlueprintContents,
  setBlueprint,
  updateBlueprintComponents,
  undo,
  redo,
  deleteHistory,
  fetchingCompDeps
} from "../../core/actions/blueprints";
import {
  fetchingInputs,
  setSelectedInputPage,
  clearSelectedInput,
  setSelectedInput,
  setSelectedInputDeps,
  setSelectedInputParent,
  deleteFilter,
  fetchingDepDetails
} from "../../core/actions/inputs";
import { setModalActive } from "../../core/actions/modals";
import {
  componentsSortSetKey,
  componentsSortSetValue,
  dependenciesSortSetKey,
  dependenciesSortSetValue
} from "../../core/actions/sort";
import {
  componentsFilterAddValue,
  componentsFilterRemoveValue,
  componentsFilterClearValues
} from "../../core/actions/filter";
import {
  makeGetBlueprintById,
  makeGetSortedSelectedComponents,
  makeGetSortedDependencies,
  makeGetFutureLength,
  makeGetPastLength,
  makeGetFilteredComponents,
  makeGetSelectedInputs,
  makeGetSelectedDeps
} from "../../core/selectors";

const messages = defineMessages({
  listTitleAvailableComps: {
    defaultMessage: "Available Components"
  },
  addComponentTitle: {
    defaultMessage: "Add Blueprint Components"
  },
  addComponentMessageOne: {
    defaultMessage: "Browse or search for components, then add them to the blueprint. Or leave the blueprint empty to create a minimal image."
  },
  addComponentMessageTwo: {
    defaultMessage: "The packages needed to support the selected image type are automatically included when creating an image."
  },
  blueprintTitle: {
    defaultMessage: "Blueprint"
  },
  filterByLabel: {
    defaultMessage: "Filter Available Components by Name"
  },
  filterByPlaceholder: {
    defaultMessage: "Filter By Name..."
  },
  emptyStateNoResultsMessage: {
    defaultMessage: "Modify your filter criteria to get results."
  },
  emptyStateNoResultsTitle: {
    defaultMessage: "No Results Match the Filter Criteria"
  }
});

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
    this.handleComponentListItem = this.handleComponentListItem.bind(this);
    this.handleDepListItem = this.handleDepListItem.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleDiscardChanges = this.handleDiscardChanges.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
  }

  componentDidMount() {
    const { formatMessage } = this.props.intl;
    document.title = formatMessage(messages.blueprintTitle);
    // get blueprint, get inputs; then update inputs
    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, "-"));
      this.props.fetchingInputs(this.props.inputs.inputFilters, 0, 50);
    } else {
      this.props.fetchingInputs(this.props.inputs.inputFilters, 0, 50);
    }
  }

  componentWillUnmount() {
    this.props.deleteFilter();
    this.props.clearSelectedInput();
  }

  setNotifications() {
    this.layout.setNotifications();
  }

  getFilteredInputs(event) {
    if (event.which === 13 || event.keyCode === 13) {
      const filter = {
        field: "name",
        value: event.target.value
      };
      this.props.fetchingInputs(filter, 0, this.props.inputs.pageSize);
      this.props.setSelectedInputPage(0);
      $("#cmpsr-blueprint-input-filter").blur();
      event.preventDefault();
    }
  }

  handleClearFilters(event) {
    const filter = {
      field: "name",
      value: ""
    };
    this.props.deleteFilter();
    this.props.fetchingInputs(filter, 0, this.props.inputs.pageSize);
    $("#cmpsr-blueprint-input-filter").val("");
    event.preventDefault();
    event.stopPropagation();
  }

  handlePagination(event) {
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
    this.props.setSelectedInputPage(page);
    const filter = this.props.inputs.inputFilters;
    // check if filters are set to determine current input set
    if (this.props.inputComponents.slice(0)[page].length === 0) {
      this.props.fetchingInputs(filter, page, this.props.inputs.pageSize);
    }
  }

  handleCommit() {
    // clear existing notifications
    NotificationsApi.closeNotification(undefined, "committed");
    NotificationsApi.closeNotification(undefined, "committing");
    // display the committing notification
    NotificationsApi.displayNotification(this.props.blueprint.name, "committing");
    this.setNotifications();
    // post blueprint (includes 'committed' notification)
    Promise.all([BlueprintApi.handleCommitBlueprint(this.props.blueprint)])
      .then(() => {
        // then after blueprint is posted, reload blueprint details
        // to get details that were updated during commit (i.e. version)
        Promise.all([BlueprintApi.reloadBlueprintDetails(this.props.blueprint)])
          .then(data => {
            const blueprintToSet = Object.assign({}, this.props.blueprint, {
              version: data[0].version
            });
            this.props.setBlueprint(blueprintToSet);
          })
          .catch(e => console.log(`Error in reload blueprint details: ${e}`));
      })
      .catch(e => console.log(`Error in blueprint commit: ${e}`));
  }

  handleAddComponent(event, component, version) {
    this.props.clearSelectedInput();
    const addedPackage = {
      name: component.name,
      version: version
    };
    const pendingChange = {
      componentOld: null,
      componentNew: component.name + "-" + version
    };
    let pendingChanges = this.props.blueprint.localPendingChanges;
    const prevChange = pendingChanges.find(change => change.componentOld === pendingChange.componentNew);
    // removing then adding a component of the same version results in no change listed
    // if a different version of this component was removed, that change and this change will
    // still be listed as separate changes
    // but if a previous change exists where the same component version was removed...
    if (prevChange !== undefined) {
      // then filter that previous change, and don't add this change
      pendingChanges = pendingChanges.filter(component => component !== prevChange);
    } else {
      pendingChanges = [pendingChange].concat(pendingChanges);
    }
    const packages = this.props.blueprint.packages.concat(addedPackage);
    const modules = this.props.blueprint.modules;
    const addedComponent = Object.assign({}, component, {
      version: version,
      userSelected: true,
      inBlueprint: true
    });
    // for now, just adding the component to the state
    // component info will load after committing the change to the workspace and reloading the blueprint
    const components = this.props.blueprint.components.concat(addedComponent);
    this.props.updateBlueprintComponents(this.props.blueprint.id, components, packages, modules, pendingChanges);
    event.preventDefault();
    event.stopPropagation();
  }

  handleUpdateComponent(event, name, version) {
    this.props.clearSelectedInput();
    const selectedComponents = this.props.blueprint.packages.concat(this.props.blueprint.modules);
    const oldVersion = selectedComponents.find(component => component.name === name).version;
    const updatedComponent = {
      name: name,
      version: version
    };
    let pendingChange = {
      componentOld: name + "-" + oldVersion,
      componentNew: name + "-" + version
    };
    let pendingChanges = this.props.blueprint.localPendingChanges;
    const prevChange = pendingChanges.find(change => change.componentNew === pendingChange.componentOld);
    // if this component was added or updated in this session...
    if (prevChange !== undefined) {
      // then only list this component once in the list of changes,
      // where the change shows the old version of the previous change
      pendingChange.componentOld = prevChange.componentOld;
      pendingChanges = pendingChanges.filter(component => component !== prevChange);
    }
    if (prevChange === undefined || pendingChange.componentOld !== pendingChange.componentNew) {
      pendingChanges = [pendingChange].concat(pendingChanges);
    }
    let packages = this.props.blueprint.packages;
    let modules = this.props.blueprint.modules;
    if (modules.some(component => component.name === name)) {
      modules = modules.filter(item => item.name !== updatedComponent.name).concat(updatedComponent);
    } else {
      packages = packages.filter(item => item.name !== updatedComponent.name).concat(updatedComponent);
    }
    const components = this.props.blueprint.components.map(component => {
      if (component.name === name) {
        const componentData = Object.assign({}, component, {
          name: name,
          version: version,
          userSelected: true,
          inBlueprint: true
        });
        return componentData;
      } else {
        return component;
      }
    });
    this.props.updateBlueprintComponents(this.props.blueprint.id, components, packages, modules, pendingChanges);
    event.preventDefault();
    event.stopPropagation();
  }

  handleRemoveComponent(event, name) {
    this.props.clearSelectedInput();
    const selectedComponents = this.props.blueprint.packages.concat(this.props.blueprint.modules);
    const version = selectedComponents.find(component => component.name === name).version;

    let pendingChange = {
      componentOld: name + "-" + version,
      componentNew: null
    };
    let pendingChanges = this.props.blueprint.localPendingChanges;
    const prevChange = pendingChanges.find(change => change.componentNew === pendingChange.componentOld);
    // if this component was updated in this session...
    if (prevChange !== undefined) {
      // then only list this component once in the list of changes,
      // where the change shows the old version of the previous change
      pendingChange.componentOld = prevChange.componentOld;
      pendingChanges = pendingChanges.filter(component => component !== prevChange);
      // but if this component was added in this session (i.e. componentOld === null)
      // then neither change should be listed
    }
    if (prevChange === undefined || prevChange.componentOld !== null) {
      pendingChanges = [pendingChange].concat(pendingChanges);
    }
    const packages = this.props.blueprint.packages.filter(pack => pack.name !== name);
    const modules = this.props.blueprint.modules.filter(module => module.name !== name);
    const components = this.props.blueprint.components.filter(component => component.name !== name);
    this.props.updateBlueprintComponents(this.props.blueprint.id, components, packages, modules, pendingChanges);
    event.preventDefault();
    event.stopPropagation();
  }

  handleComponentDetails(event, component) {
    // the user selected a component to view more details on the right
    if (component.name !== this.props.selectedInput.component.name) {
      // if the user did not click on the current selected component:
      this.props.setSelectedInput(component);
      this.props.setSelectedInputParent([]);
    } else {
      // if the user clicked on the current selected component:
      this.props.clearSelectedInput();
    }
    event.preventDefault();
    event.stopPropagation();
  }

  handleComponentListItem(component) {
    this.props.fetchingCompDeps(component, this.props.blueprint.id);
  }
  handleDepListItem(component) {
    this.props.fetchingDepDetails(component, this.props.blueprint.id);
  }

  // handle show/hide of modal dialogs
  handleHideModal() {
    this.props.setModalActive(null);
  }

  handleShowModal(e, modalType) {
    switch (modalType) {
      case "modalPendingChanges":
        // this.getComponentUpdates();
        this.props.setModalActive("modalPendingChanges");
        break;
      default:
        this.props.setModalActive(null);
        break;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  handleDiscardChanges() {
    const workspaceChanges = this.props.blueprint.workspacePendingChanges.length;
    const reload = workspaceChanges > 0 ? true : false;
    this.props.deleteHistory(this.props.blueprint.id, reload);
    // only fetch blueprint contents if workspace changes existed
    // when this blueprint originally loaded
  }

  handleUndo() {
    const workspaceChanges = this.props.blueprint.workspacePendingChanges.length;
    if (this.props.pastLength === 1) {
      const reload = workspaceChanges > 0 ? true : false;
      this.props.deleteHistory(this.props.blueprint.id, reload);
    } else {
      this.props.undo(this.props.blueprint.id, false);
    }
  }

  render() {
    if (this.props.blueprint.id === undefined) {
      return <Loading />;
    }
    const blueprintDisplayName = this.props.route.params.blueprint;
    const {
      blueprint,
      selectedComponents,
      dependencies,
      inputComponents,
      inputs,
      modalActive,
      componentsSortKey,
      componentsSortValue,
      componentsFilters,
      pastLength,
      futureLength,
      selectedInputDeps,
      setSelectedInput,
      setSelectedInputParent,
      clearSelectedInput
    } = this.props;
    const numPendingChanges = blueprint.localPendingChanges.length + blueprint.workspacePendingChanges.length;
    const { formatMessage } = this.props.intl;

    return (
      <Layout
        className="cmpsr-grid__wrapper"
        ref={c => {
          this.layout = c;
        }}
      >
        <header className="cmpsr-header">
          <ol className="breadcrumb">
            <li>
              <Link to="/blueprints">
                <FormattedMessage defaultMessage="Back to Blueprints" />
              </Link>
            </li>
            <li>
              <Link to={`/blueprint/${blueprintDisplayName}`}>{blueprintDisplayName}</Link>
            </li>
            <li className="active">
              <strong>
                <FormattedMessage defaultMessage="Edit Packages" />
              </strong>
            </li>
          </ol>
          <div className="cmpsr-header__actions">
            <ul className="list-inline">
              {numPendingChanges > 0 && (
                <li>
                  <a href="#" onClick={e => this.handleShowModal(e, "modalPendingChanges")}>
                    <FormattedMessage
                      defaultMessage="{pendingChanges, plural,
                        one {# Pending Change}
                        other {# Pending Changes}
                        }"
                      values={{
                        pendingChanges: numPendingChanges
                      }}
                    />
                  </a>
                </li>
              )}
              {(numPendingChanges > 0 && (
                <li>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={e => this.handleShowModal(e, "modalPendingChanges")}
                  >
                    <FormattedMessage defaultMessage="Commit" />
                  </button>
                </li>
              )) || (
                <li>
                  <button className="btn btn-primary disabled" type="button">
                    <FormattedMessage defaultMessage="Commit" />
                  </button>
                </li>
              )}
              {(numPendingChanges > 0 && (
                <li>
                  <button className="btn btn-default" type="button" onClick={this.handleDiscardChanges}>
                    <FormattedMessage defaultMessage="Discard Changes" />
                  </button>
                </li>
              )) || (
                <li>
                  <button className="btn btn-default disabled" type="button">
                    <FormattedMessage defaultMessage="Discard Changes" />
                  </button>
                </li>
              )}
              <li className="list__subgroup-item--first">
                <CreateImageUpload blueprint={blueprint} layout={this.layout} />
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
                    <li>
                      <ExportBlueprint blueprint={blueprint} />
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="cmpsr-title">
            <h1 className="cmpsr-title__item">{blueprintDisplayName}</h1>
          </div>
        </header>
        {(inputs.selectedInput.set === false && (
          <h3 className="cmpsr-panel__title cmpsr-panel__title--main">
            <FormattedMessage defaultMessage="Blueprint Components" />
          </h3>
        )) || (
          <h3 className="cmpsr-panel__title cmpsr-panel__title--main">
            <FormattedMessage defaultMessage="Component Details" />
          </h3>
        )}
        {(inputs.selectedInput.set === false && (
          <div className="cmpsr-panel__body cmpsr-panel__body--main">
            {componentsSortKey !== undefined && componentsSortValue !== undefined && (
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
                undo={this.handleUndo}
                redo={this.props.redo}
                pastLength={pastLength}
                futureLength={futureLength}
              />
            )}
            <BlueprintContents
              components={selectedComponents}
              dependencies={dependencies}
              handleRemoveComponent={this.handleRemoveComponent}
              handleComponentDetails={this.handleComponentDetails}
              filterClearValues={this.props.componentsFilterClearValues}
              filterValues={componentsFilters.filterValues}
              errorState={this.props.blueprintContentsError}
              fetchingState={this.props.blueprintContentsFetching}
              fetchDetails={this.handleComponentListItem}
              undo={this.handleUndo}
              pastLength={pastLength}
            >
              <EmptyState
                title={formatMessage(messages.addComponentTitle)}
                message={`${formatMessage(messages.addComponentMessageOne)} ${formatMessage(messages.addComponentMessageTwo)}`}
              />
            </BlueprintContents>
          </div>
        )) ||
          (inputs.selectedInput.set === true && (
            <ComponentDetailsView
              blueprint={blueprintDisplayName}
              selectedComponents={blueprint.packages.concat(blueprint.modules)}
              component={inputs.selectedInput.component}
              dependencies={selectedInputDeps}
              componentParent={inputs.selectedInput.parent}
              setSelectedInput={setSelectedInput}
              setSelectedInputParent={setSelectedInputParent}
              clearSelectedInput={clearSelectedInput}
              handleComponentDetails={this.handleComponentDetails}
              handleDepListItem={this.handleDepListItem}
              handleAddComponent={this.handleAddComponent}
              handleUpdateComponent={this.handleUpdateComponent}
              handleRemoveComponent={this.handleRemoveComponent}
            />
          ))}
        <h3 className="cmpsr-panel__title cmpsr-panel__title--sidebar">
          {formatMessage(messages.listTitleAvailableComps)}
        </h3>
        {((inputComponents !== undefined && blueprint.components !== undefined && blueprint.packages !== undefined) && (
          <div className="cmpsr-panel__body cmpsr-panel__body--sidebar">
            <div className="toolbar-pf">
              <form className="toolbar-pf-actions">
                <div className="form-group toolbar-pf-filter">
                  <input
                    type="text"
                    className="form-control"
                    id="cmpsr-blueprint-input-filter"
                    aria-label={formatMessage(messages.filterByLabel)}
                    placeholder={formatMessage(messages.filterByPlaceholder)}
                    onKeyPress={e => this.getFilteredInputs(e)}
                  />
                </div>
              </form>
              <div className="toolbar-pf-results">
                {inputs.inputFilters !== undefined && inputs.inputFilters.value.length > 0 && (
                  <ul className="list-inline">
                    <li>
                      <span className="label label-info">
                        <FormattedMessage
                          defaultMessage="Name: {name}"
                          values={{
                            name: inputs.inputFilters.value
                          }}
                        />
                        <a href="#" onClick={e => this.handleClearFilters(e)}>
                          <span className="pficon pficon-close" />
                        </a>
                      </span>
                    </li>
                    <li>
                      <a href="#" onClick={e => this.handleClearFilters(e)}>
                        <FormattedMessage defaultMessage="Clear All Filters" />
                      </a>
                    </li>
                  </ul>
                )}
                {inputs.totalInputs > 0 && (
                  <Pagination
                    cssClass="cmpsr-blueprint__inputs__pagination"
                    currentPage={inputs.selectedInputPage}
                    totalItems={inputs.totalInputs}
                    pageSize={inputs.pageSize}
                    handlePagination={this.handlePagination}
                  />
                )}
              </div>
            </div>
            {blueprint.components.length === 0 &&
              Object.keys(this.props.blueprintContentsError).length === 0 &&
              componentsFilters.filterValues.length === 0 && (
                <div className="alert alert-info alert-dismissable">
                  <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-hidden="true"
                    aria-label="Dismiss Message"
                  >
                    <span className="pficon pficon-close" />
                  </button>
                  <span className="pficon pficon-info" />
                  <FormattedMessage
                    defaultMessage="{selectComponents} in this list to add to the blueprint."
                    values={{
                      selectComponents: (
                        <strong>
                          <FormattedMessage defaultMessage="Select components" />
                        </strong>
                      )
                    }}
                  />
                </div>
              )}
            {inputs.inputFilters !== undefined && 
              inputs.inputFilters.value.length > 0 && 
              inputComponents[inputs.selectedInputPage].length === 0 && (
                <EmptyState
                  title={formatMessage(messages.emptyStateNoResultsTitle)}
                  message={formatMessage(messages.emptyStateNoResultsMessage)}
                >
                  <button className="btn btn-link" type="button" onClick={e => this.handleClearFilters(e)}>
                    <FormattedMessage defaultMessage="Clear All Filters" />
                  </button>
                </EmptyState>
            ) || (
              <ComponentInputs
                label={formatMessage(messages.listTitleAvailableComps)}
                components={inputComponents[inputs.selectedInputPage]}
                handleComponentDetails={this.handleComponentDetails}
                handleAddComponent={this.handleAddComponent}
                handleRemoveComponent={this.handleRemoveComponent}
              />
            )}
          </div>
        )) || (
          <div className="cmpsr-panel__body cmpsr-panel__body--sidebar">
            <div className="toolbar-pf">
              <form className="toolbar-pf-actions">
                <div className="form-group toolbar-pf-filter">
                  <input
                    type="text"
                    className="form-control"
                    id="cmpsr-blueprint-input-filter"
                    aria-label={formatMessage(messages.filterByLabel)}
                    placeholder={formatMessage(messages.filterByPlaceholder)}
                    disabled="disabled"
                  />
                </div>
              </form>
            </div>
            <Loading />
          </div>
        )}
        {modalActive === "modalPendingChanges" ? (
          <PendingChanges
            handleCommit={this.handleCommit}
            blueprint={blueprint}
            contents={dependencies}
            handleHideModal={this.handleHideModal}
          />
        ) : null}
      </Layout>
    );
  }
}

EditBlueprintPage.propTypes = {
  route: PropTypes.shape({
    keys: PropTypes.arrayOf(PropTypes.object),
    load: PropTypes.func,
    page: PropTypes.string,
    params: PropTypes.object,
    path: PropTypes.string,
    pattern: PropTypes.object
  }),
  blueprint: PropTypes.shape({
    components: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    groups: PropTypes.array,
    id: PropTypes.string,
    localPendingChanges: PropTypes.arrayOf(PropTypes.object),
    modules: PropTypes.array,
    name: PropTypes.string,
    packages: PropTypes.arrayOf(PropTypes.object),
    version: PropTypes.string,
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object)
  }),
  inputs: PropTypes.shape({
    inputComponents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
    inputFilters: PropTypes.object,
    pageSize: PropTypes.number,
    selectedInput: PropTypes.object,
    selectedInputPage: PropTypes.number,
    totalInputs: PropTypes.number
  }),
  inputComponents: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  modalActive: PropTypes.string,
  selectedInput: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    parent: PropTypes.arrayOf(PropTypes.object)
  }),
  selectedInputDeps: PropTypes.arrayOf(PropTypes.object),
  fetchingBlueprintContents: PropTypes.func,
  fetchingCompDeps: PropTypes.func,
  setBlueprint: PropTypes.func,
  updateBlueprintComponents: PropTypes.func,
  fetchingInputs: PropTypes.func,
  fetchingDepDetails: PropTypes.func,
  setSelectedInputPage: PropTypes.func,
  setSelectedInput: PropTypes.func,
  clearSelectedInput: PropTypes.func,
  setSelectedInputParent: PropTypes.func,
  deleteFilter: PropTypes.func,
  setModalActive: PropTypes.func,
  dependenciesSortSetValue: PropTypes.func,
  componentsSortSetValue: PropTypes.func,
  selectedComponents: PropTypes.arrayOf(PropTypes.object),
  dependencies: PropTypes.arrayOf(PropTypes.object),
  componentsSortKey: PropTypes.string,
  componentsSortValue: PropTypes.string,
  componentsFilters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object)
  }),
  componentsFilterAddValue: PropTypes.func,
  componentsFilterRemoveValue: PropTypes.func,
  componentsFilterClearValues: PropTypes.func,
  pastLength: PropTypes.number,
  futureLength: PropTypes.number,
  undo: PropTypes.func,
  redo: PropTypes.func,
  deleteHistory: PropTypes.func,
  blueprintContentsError: PropTypes.shape({
    message: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string
  }),
  blueprintContentsFetching: PropTypes.bool,
  intl: intlShape.isRequired
};

EditBlueprintPage.defaultProps = {
  route: {},
  blueprint: {},
  inputs: {},
  inputComponents: undefined,
  modalActive: "",
  selectedInput: {},
  fetchingBlueprintContents: function() {},
  setBlueprint: function() {},
  fetchingCompDeps: function() {},
  updateBlueprintComponents: function() {},
  fetchingInputs: function() {},
  fetchingDepDetails: function() {},
  setSelectedInputPage: function() {},
  setSelectedInput: function() {},
  clearSelectedInput: function() {},
  setSelectedInputParent: function() {},
  selectedInputDeps: undefined,
  deleteFilter: function() {},
  setModalActive: function() {},
  dependenciesSortSetValue: function() {},
  componentsSortSetValue: function() {},
  selectedComponents: [],
  dependencies: [],
  componentsSortKey: "",
  componentsSortValue: "",
  componentsFilters: {},
  componentsFilterAddValue: function() {},
  componentsFilterRemoveValue: function() {},
  componentsFilterClearValues: function() {},
  pastLength: 0,
  futureLength: 0,
  undo: function() {},
  redo: function() {},
  deleteHistory: function() {},
  blueprintContentsError: {},
  blueprintContentsFetching: true
};

const makeMapStateToProps = () => {
  const getBlueprintById = makeGetBlueprintById();
  const getSortedSelectedComponents = makeGetSortedSelectedComponents();
  const getSortedDependencies = makeGetSortedDependencies();
  const getFilteredComponents = makeGetFilteredComponents();
  const getPastLength = makeGetPastLength();
  const getFutureLength = makeGetFutureLength();
  const getSelectedInputs = makeGetSelectedInputs();
  const getSelectedDeps = makeGetSelectedDeps();
  const mapStateToProps = (state, props) => {
    if (getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, "-")) !== undefined) {
      const fetchedBlueprint = getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, "-"));
      return {
        blueprint: fetchedBlueprint.present,
        selectedComponents: getFilteredComponents(state, getSortedSelectedComponents(state, fetchedBlueprint.present)),
        dependencies: getFilteredComponents(state, getSortedDependencies(state, fetchedBlueprint.present)),
        componentsSortKey: state.sort.components.key,
        componentsSortValue: state.sort.components.value,
        componentsFilters: state.filter.components,
        inputs: state.inputs,
        inputComponents: getSelectedInputs(state, fetchedBlueprint.present.components),
        selectedInput: state.inputs.selectedInput,
        selectedInputDeps: getSelectedDeps(
          state,
          state.inputs.selectedInput.component.dependencies,
          fetchedBlueprint.present.components
        ),
        modalActive: state.modals.modalActive,
        pastLength: getPastLength(fetchedBlueprint),
        futureLength: getFutureLength(fetchedBlueprint),
        blueprintContentsError: fetchedBlueprint.present.errorState,
        blueprintContentsFetching:
          fetchedBlueprint.present.components === undefined && fetchedBlueprint.present.errorState === undefined
            ? true
            : false
      };
    }
    return {
      blueprint: {},
      selectedComponents: [],
      dependencies: [],
      componentsSortKey: state.sort.components.key,
      componentsSortValue: state.sort.components.value,
      componentsFilters: state.filter.components,
      inputs: state.inputs,
      inputComponents: state.inputs.inputComponents,
      selectedInput: state.inputs.selectedInput,
      modalActive: state.modals.modalActive,
      pastLength: 0,
      futureLength: 0,
      blueprintContentsError: {}
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  fetchingBlueprintContents: blueprintId => {
    dispatch(fetchingBlueprintContents(blueprintId));
  },
  fetchingInputs: (filter, selectedInputPage, pageSize) => {
    dispatch(fetchingInputs(filter, selectedInputPage, pageSize));
  },
  setSelectedInputPage: selectedInputPage => {
    dispatch(setSelectedInputPage(selectedInputPage));
  },
  setBlueprint: blueprint => {
    dispatch(setBlueprint(blueprint));
  },
  updateBlueprintComponents: (blueprintId, components, packages, modules, pendingChange) => {
    dispatch(updateBlueprintComponents(blueprintId, components, packages, modules, pendingChange));
  },
  setSelectedInput: selectedInput => {
    dispatch(setSelectedInput(selectedInput));
  },
  setSelectedInputDeps: dependencies => {
    dispatch(setSelectedInputDeps(dependencies));
  },
  setSelectedInputParent: selectedInputParent => {
    dispatch(setSelectedInputParent(selectedInputParent));
  },
  clearSelectedInput: () => {
    dispatch(clearSelectedInput());
  },
  deleteFilter: () => {
    dispatch(deleteFilter());
  },
  setModalActive: modalActive => {
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
  undo: (blueprintId, reload) => {
    dispatch(undo(blueprintId, reload));
  },
  redo: (blueprintId, reload) => {
    dispatch(redo(blueprintId, reload));
  },
  deleteHistory: (blueprintId, reload) => {
    dispatch(deleteHistory(blueprintId, reload));
  },
  fetchingCompDeps: (component, blueprintId) => {
    dispatch(fetchingCompDeps(component, blueprintId));
  },
  fetchingDepDetails: (component, blueprintId) => {
    dispatch(fetchingDepDetails(component, blueprintId));
  }
});

export default connect(makeMapStateToProps, mapDispatchToProps)(injectIntl(EditBlueprintPage));
