/* global welderApiPort:false */

import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import cockpit from "cockpit"; // eslint-disable-line import/no-unresolved
import PropTypes from "prop-types";
import { Tab, Tabs } from "patternfly-react";
import { connect } from "react-redux";
import Link from "../../components/Link";
import Layout from "../../components/Layout";
import BlueprintContents from "../../components/ListView/BlueprintContents";
import ComponentDetailsView from "../../components/ListView/ComponentDetailsView";
import CreateImage from "../../components/Modal/CreateImage";
import ExportBlueprint from "../../components/Modal/ExportBlueprint";
import StopBuild from "../../components/Modal/StopBuild";
import DeleteImage from "../../components/Modal/DeleteImage";
import EmptyState from "../../components/EmptyState/EmptyState";
import BlueprintToolbar from "../../components/Toolbar/BlueprintToolbar";
import ListView from "../../components/ListView/ListView";
import ListItemImages from "../../components/ListView/ListItemImages";
import { fetchingBlueprintContents, setBlueprintDescription } from "../../core/actions/blueprints";
import { fetchingComposes, startCompose } from "../../core/actions/composes";
import {
  setModalExportBlueprintVisible,
  setModalCreateImageVisible,
  setModalCreateImageHidden,
  setModalStopBuildVisible,
  setModalStopBuildState,
  setModalDeleteImageVisible,
  setModalDeleteImageState
} from "../../core/actions/modals";
import {
  setEditDescriptionVisible,
  setEditDescriptionValue,
  setActiveComponent,
  setActiveComponentStatus,
  setActiveComponentParent,
  setActiveTab
} from "../../core/actions/blueprintPage";
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
  makeGetFilteredComponents,
  makeGetBlueprintComposes
} from "../../core/selectors";

const messages = defineMessages({
  blueprint: {
    defaultMessage: "Blueprint"
  },
  emptyBlueprintTitle: {
    defaultMessage: "Empty Blueprint"
  },
  emptyBlueprintMessage: {
    defaultMessage: "There are no components listed in the blueprint. Edit the blueprint to add components."
  },
  imagesTitle: {
    defaultMessage: "Images"
  },
  noImagesTitle: {
    defaultMessage: "No Images"
  },
  noImagesMessage: {
    defaultMessage: "No images have been created from this blueprint."
  },
  selectedComponentsTitle: {
    defaultMessage: "Selected Components"
  }
});

class BlueprintPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleTabChanged = this.handleTabChanged.bind(this);
    this.handleComponentDetails = this.handleComponentDetails.bind(this);
    this.handleHideModalExport = this.handleHideModalExport.bind(this);
    this.handleShowModalExport = this.handleShowModalExport.bind(this);
    this.handleHideModalCreateImage = this.handleHideModalCreateImage.bind(this);
    this.handleShowModalCreateImage = this.handleShowModalCreateImage.bind(this);
    this.handleHideModalStop = this.handleHideModalStop.bind(this);
    this.handleHideModalDeleteImage = this.handleHideModalDeleteImage.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.downloadUrl = this.downloadUrl.bind(this);
  }

  componentWillMount() {
    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, "-"));
    }
    if (this.props.composesLoading === true) {
      this.props.fetchingComposes();
    }
    this.props.setEditDescriptionVisible(false);
    this.props.setModalExportBlueprintVisible(false);
  }

  componentDidMount() {
    document.title = this.props.intl.formatMessage(messages.blueprint);
  }

  setNotifications() {
    this.layout.setNotifications();
  }

  handleTabChanged(key) {
    if (this.props.blueprintPage.activeTab !== key) {
      this.props.setActiveTab(key);
    }
  }

  handleComponentDetails(event, component, parent) {
    // the user selected a component to view more details
    this.props.setActiveComponent(component);
    this.props.setActiveComponentParent(parent);
    event.preventDefault();
    event.stopPropagation();
  }

  handleEditDescription(action) {
    const state = !this.props.blueprintPage.editDescriptionVisible;
    this.props.setEditDescriptionVisible(state);
    if (state) {
      this.props.setEditDescriptionValue(this.props.blueprint.description);
    } else if (action === "commit") {
      this.props.setBlueprintDescription(this.props.blueprint, this.props.blueprintPage.editDescriptionValue);
    } else if (action === "cancel") {
      // cancel action
    }
  }

  handleEnterKey(event, action) {
    if (event.which === 13 || event.keyCode === 13) {
      this.handleEditDescription(action);
    }
  }

  handleChangeDescription(event) {
    this.props.setEditDescriptionValue(event.target.value);
  }

  // handle show/hide of modal dialogs
  handleHideModalExport() {
    this.props.setModalExportBlueprintVisible(false);
  }
  handleShowModalExport(e) {
    this.props.setModalExportBlueprintVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  handleHideModalCreateImage() {
    this.props.setModalCreateImageHidden();
  }

  handleShowModalCreateImage(e, blueprint) {
    this.props.setModalCreateImageVisible(blueprint);
    e.preventDefault();
    e.stopPropagation();
  }

  handleHideModalStop() {
    this.props.setModalStopBuildVisible(false);
    this.props.setModalStopBuildState("", "");
  }

  handleHideModalDeleteImage() {
    this.props.setModalDeleteImageVisible(false);
    this.props.setModalDeleteImageState("", "");
  }

  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  downloadUrl(compose) {
    // NOTE: this only works when welderApiPort is a unix socket
    const query = window.btoa(
      JSON.stringify({
        payload: "http-stream2",
        unix: welderApiPort,
        method: "GET",
        path: `/api/v0/compose/image/${compose.id}`,
        superuser: "try"
      })
    );

    return `/cockpit/channel/${cockpit.transport.csrf_token}?${query}`;
  }

  render() {
    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, "-"));
      return <div />;
    }
    const {
      blueprint,
      exportModalVisible,
      createImage,
      stopBuild,
      deleteImage,
      selectedComponents,
      dependencies,
      componentsFilters,
      composeList
    } = this.props;
    const {
      editDescriptionValue,
      editDescriptionVisible,
      activeComponent,
      activeComponentParent,
      activeComponentStatus
    } = this.props.blueprintPage;
    const { formatMessage } = this.props.intl;

    return (
      <Layout className="container-fluid" ref={c => (this.layout = c)}>
        <header className="cmpsr-header">
          <ol className="breadcrumb">
            <li>
              <Link to="/blueprints">
                <FormattedMessage defaultMessage="Back to Blueprints" />
              </Link>
            </li>
            <li className="active">
              <strong>{this.props.route.params.blueprint}</strong>
            </li>
          </ol>
          <div className="cmpsr-header__actions">
            <ul className="list-inline">
              <li>
                <Link to={`/edit/${this.props.route.params.blueprint}`} className="btn btn-default">
                  <FormattedMessage defaultMessage="Edit Blueprint" />
                </Link>
              </li>
              <li>
                <button
                  className="btn btn-default"
                  id="cmpsr-btn-crt-image"
                  data-toggle="modal"
                  data-target="#cmpsr-modal-crt-image"
                  type="button"
                  onClick={e => this.handleShowModalCreateImage(e, blueprint)}
                >
                  <FormattedMessage defaultMessage="Create Image" />
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
                    {(selectedComponents.length && (
                      <li>
                        <a href="#" onClick={this.handleShowModalExport}>
                          <FormattedMessage defaultMessage="Export" />
                        </a>
                      </li>
                    )) || (
                      <li className="disabled">
                        <a>
                          <FormattedMessage defaultMessage="Export" />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="cmpsr-title">
            <h1 className="cmpsr-title__item">{this.props.route.params.blueprint}</h1>
            <p className="cmpsr-title__item">
              {blueprint.description && <span className="text-muted">{blueprint.description}</span>}
            </p>
          </div>
        </header>
        <Tabs id="blueprint-tabs">
          <Tab eventKey="details" title="Details">
            <div className="tab-container row">
              <div className="col-sm-6 col-lg-4">
                <dl className="dl-horizontal mt-">
                  <dt>
                    <FormattedMessage defaultMessage="Name" />
                  </dt>
                  <dd>{blueprint.name}</dd>
                  <dt>
                    <FormattedMessage defaultMessage="Description" />
                  </dt>
                  {(editDescriptionVisible && (
                    <dd>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={editDescriptionValue}
                          onChange={this.handleChangeDescription}
                          onKeyPress={e => this.handleEnterKey(e, "commit")}
                        />
                        <span className="input-group-btn">
                          <button
                            className="btn btn-link"
                            type="button"
                            onClick={() => this.handleEditDescription("commit")}
                          >
                            <span className="fa fa-check" />
                          </button>
                          <button
                            className="btn btn-link"
                            type="button"
                            onClick={() => this.handleEditDescription("cancel")}
                          >
                            <span className="pficon pficon-close" />
                          </button>
                        </span>
                      </div>
                    </dd>
                  )) || (
                    <dd onClick={() => this.handleEditDescription()} role="presentation">
                      {blueprint.description}
                      <button className="btn btn-link" type="button">
                        <span className="pficon pficon-edit" />
                      </button>
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          </Tab>
          <Tab eventKey="selected-components" title={formatMessage(messages.selectedComponentsTitle)}>
            <div className="row">
              {(activeComponent === "" && (
                <div className="col-sm-12">
                  <BlueprintToolbar
                    emptyState={
                      (selectedComponents === undefined || selectedComponents.length === 0) &&
                      componentsFilters.filterValues.length === 0
                    }
                    filters={componentsFilters}
                    filterRemoveValue={this.props.componentsFilterRemoveValue}
                    filterClearValues={this.props.componentsFilterClearValues}
                    filterAddValue={this.props.componentsFilterAddValue}
                    componentsSortKey={this.props.componentsSortKey}
                    componentsSortValue={this.props.componentsSortValue}
                    componentsSortSetValue={this.props.componentsSortSetValue}
                    dependenciesSortSetValue={this.props.dependenciesSortSetValue}
                  />
                  <BlueprintContents
                    components={selectedComponents}
                    dependencies={dependencies}
                    noEditComponent
                    handleComponentDetails={this.handleComponentDetails}
                    filterClearValues={this.props.componentsFilterClearValues}
                    filterValues={componentsFilters.filterValues}
                    errorState={this.props.blueprintContentsError}
                    fetchingState={this.props.blueprintContentsFetching}
                  >
                    <EmptyState
                      title={formatMessage(messages.emptyBlueprintTitle)}
                      message={formatMessage(messages.emptyBlueprintMessage)}
                    >
                      <Link to={`/edit/${this.props.route.params.blueprint}`}>
                        <button className="btn btn-default btn-primary" type="button">
                          <FormattedMessage defaultMessage="Edit Blueprint" />
                        </button>
                      </Link>
                    </EmptyState>
                  </BlueprintContents>
                </div>
              )) || (
                <div className="col-sm-12 cmpsr-component-details--view">
                  <h3 className="cmpsr-panel__title cmpsr-panel__title--main">
                    <FormattedMessage defaultMessage="Component Details" />
                  </h3>
                  <ComponentDetailsView
                    parent={this.props.route.params.blueprint}
                    component={activeComponent}
                    componentParent={activeComponentParent}
                    status={activeComponentStatus}
                    handleComponentDetails={this.handleComponentDetails}
                  />
                </div>
              )}
            </div>
          </Tab>
          <Tab eventKey="images" title={formatMessage(messages.imagesTitle)}>
            <div className="tab-container">
              {(composeList.length === 0 && (
                <EmptyState
                  title={formatMessage(messages.noImagesTitle)}
                  message={formatMessage(messages.noImagesMessage)}
                >
                  <button
                    className="btn btn-default"
                    id="cmpsr-btn-crt-image"
                    data-toggle="modal"
                    data-target="#cmpsr-modal-crt-image"
                    type="button"
                    onClick={e => this.handleShowModalCreateImage(e, blueprint)}
                  >
                    <FormattedMessage defaultMessage="Create Image" />
                  </button>
                </EmptyState>
              )) || (
                <ListView className="cmpsr-images" stacked>
                  {composeList.map(compose => (
                    <ListItemImages
                      listItemParent="cmpsr-images"
                      blueprint={this.props.route.params.blueprint}
                      listItem={compose}
                      downloadUrl={this.downloadUrl(compose)}
                      key={compose.id}
                    />
                  ))}
                </ListView>
              )}
            </div>
          </Tab>
        </Tabs>
        {createImage.visible ? (
          <CreateImage
            blueprint={blueprint}
            imageTypes={createImage.imageTypes}
            setNotifications={this.setNotifications}
            handleStartCompose={this.handleStartCompose}
            handleHideModal={this.handleHideModalCreateImage}
            warningEmpty={createImage.warningEmpty}
            warningUnsaved={createImage.warningUnsaved}
          />
        ) : null}
        {exportModalVisible ? (
          <ExportBlueprint
            blueprint={blueprint.name}
            contents={blueprint.components}
            handleHideModal={this.handleHideModalExport}
          />
        ) : null}
        {stopBuild.visible ? (
          <StopBuild
            composeId={stopBuild.composeId}
            blueprintName={stopBuild.blueprintName}
            handleHideModal={this.handleHideModalStop}
          />
        ) : null}
        {deleteImage.visible ? (
          <DeleteImage
            composeId={deleteImage.composeId}
            blueprintName={deleteImage.blueprintName}
            handleHideModal={this.handleHideModalDeleteImage}
          />
        ) : null}
      </Layout>
    );
  }
}

BlueprintPage.propTypes = {
  route: PropTypes.shape({
    keys: PropTypes.arrayOf(PropTypes.object),
    load: PropTypes.func,
    page: PropTypes.string,
    params: PropTypes.object,
    path: PropTypes.string,
    pattern: PropTypes.object
  }),
  fetchingBlueprintContents: PropTypes.func,
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
    workspacePendingChanges: PropTypes.object
  }),
  fetchingComposes: PropTypes.func,
  composesLoading: PropTypes.bool,
  composeList: PropTypes.arrayOf(PropTypes.object),
  setActiveTab: PropTypes.func,
  setEditDescriptionValue: PropTypes.func,
  setEditDescriptionVisible: PropTypes.func,
  setActiveComponent: PropTypes.func,
  setActiveComponentParent: PropTypes.func,
  setModalExportBlueprintVisible: PropTypes.func,
  blueprintPage: PropTypes.shape({
    activeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    activeComponentParent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    activeComponentStatus: PropTypes.string,
    activeTab: PropTypes.string,
    editDescriptionVisible: PropTypes.bool
  }),
  setBlueprintDescription: PropTypes.func,
  exportModalVisible: PropTypes.bool,
  stopBuild: PropTypes.shape({
    blueprintName: PropTypes.string,
    composeId: PropTypes.string,
    visible: PropTypes.bool
  }),
  deleteImage: PropTypes.shape({
    blueprintName: PropTypes.string,
    composeId: PropTypes.string,
    visible: PropTypes.bool
  }),
  createImage: PropTypes.shape({
    blueprint: PropTypes.object,
    imageTypes: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool
  }),
  dependenciesSortSetValue: PropTypes.func,
  componentsSortSetValue: PropTypes.func,
  componentsFilters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object)
  }),
  componentsFilterAddValue: PropTypes.func,
  componentsFilterRemoveValue: PropTypes.func,
  componentsFilterClearValues: PropTypes.func,
  selectedComponents: PropTypes.arrayOf(PropTypes.object),
  dependencies: PropTypes.arrayOf(PropTypes.object),
  componentsSortKey: PropTypes.string,
  componentsSortValue: PropTypes.string,
  setModalCreateImageVisible: PropTypes.func,
  setModalCreateImageHidden: PropTypes.func,
  setModalStopBuildVisible: PropTypes.func,
  setModalStopBuildState: PropTypes.func,
  setModalDeleteImageVisible: PropTypes.func,
  setModalDeleteImageState: PropTypes.func,
  startCompose: PropTypes.func,
  blueprintContentsError: PropTypes.shape({
    message: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string
  }),
  blueprintContentsFetching: PropTypes.bool,
  intl: intlShape.isRequired
};

BlueprintPage.defaultProps = {
  route: {},
  fetchingBlueprintContents: function() {},
  blueprint: {},
  fetchingComposes: function() {},
  composesLoading: false,
  composeList: [],
  setActiveTab: function() {},
  setEditDescriptionValue: function() {},
  setEditDescriptionVisible: function() {},
  setActiveComponent: function() {},
  setActiveComponentParent: function() {},
  setModalExportBlueprintVisible: function() {},
  blueprintPage: {},
  setBlueprintDescription: function() {},
  exportModalVisible: false,
  stopBuild: {},
  deleteImage: {},
  createImage: {},
  dependenciesSortSetValue: function() {},
  componentsSortSetValue: function() {},
  componentsFilters: {},
  componentsFilterAddValue: function() {},
  componentsFilterRemoveValue: function() {},
  componentsFilterClearValues: function() {},
  selectedComponents: [],
  dependencies: [],
  componentsSortKey: "",
  componentsSortValue: "",
  setModalCreateImageVisible: function() {},
  setModalCreateImageHidden: function() {},
  setModalStopBuildVisible: function() {},
  setModalStopBuildState: function() {},
  setModalDeleteImageVisible: function() {},
  setModalDeleteImageState: function() {},
  startCompose: function() {},
  blueprintContentsError: {},
  blueprintContentsFetching: false
};

const makeMapStateToProps = () => {
  const getBlueprintById = makeGetBlueprintById();
  const getSortedSelectedComponents = makeGetSortedSelectedComponents();
  const getSortedDependencies = makeGetSortedDependencies();
  const getFilteredComponents = makeGetFilteredComponents();
  const getBlueprintComposes = makeGetBlueprintComposes();
  const mapStateToProps = (state, props) => {
    if (getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, "-")) !== undefined) {
      const fetchedBlueprint = getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, "-"));
      return {
        blueprint: fetchedBlueprint.present,
        selectedComponents: getFilteredComponents(state, getSortedSelectedComponents(state, fetchedBlueprint.present)),
        dependencies: getFilteredComponents(state, getSortedDependencies(state, fetchedBlueprint.present)),
        composeList: getBlueprintComposes(state, fetchedBlueprint.present),
        composesLoading: state.composes.fetchingComposes,
        blueprintPage: state.blueprintPage,
        exportModalVisible: state.modals.exportBlueprint.visible,
        createImage: state.modals.createImage,
        stopBuild: state.modals.stopBuild,
        deleteImage: state.modals.deleteImage,
        componentsSortKey: state.sort.components.key,
        componentsSortValue: state.sort.components.value,
        componentsFilters: state.filter.components,
        blueprintContentsError: fetchedBlueprint.errorState,
        blueprintContentsFetching:
          fetchedBlueprint.present.components === undefined && fetchedBlueprint.errorState === undefined ? true : false
      };
    }
    return {
      blueprint: {},
      selectedComponents: [],
      dependencies: [],
      composeList: [],
      composesLoading: state.composes.fetchingComposes,
      blueprintPage: state.blueprintPage,
      exportModalVisible: state.modals.exportBlueprint.visible,
      createImage: state.modals.createImage,
      stopBuild: state.modals.stopBuild,
      deleteImage: state.modals.deleteImage,
      componentsSortKey: state.sort.components.key,
      componentsSortValue: state.sort.components.value,
      componentsFilters: state.filter.components,
      blueprintContentsError: {}
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  fetchingBlueprintContents: blueprintId => {
    dispatch(fetchingBlueprintContents(blueprintId));
  },
  fetchingComposes: () => {
    dispatch(fetchingComposes());
  },
  setBlueprintDescription: (blueprint, description) => {
    dispatch(setBlueprintDescription(blueprint, description));
  },
  setEditDescriptionValue: value => {
    dispatch(setEditDescriptionValue(value));
  },
  setEditDescriptionVisible: visible => {
    dispatch(setEditDescriptionVisible(visible));
  },
  setActiveTab: activeTab => {
    dispatch(setActiveTab(activeTab));
  },
  setActiveComponent: component => {
    dispatch(setActiveComponent(component));
  },
  setActiveComponentParent: componentParent => {
    dispatch(setActiveComponentParent(componentParent));
  },
  setActiveComponentStatus: componentStatus => {
    dispatch(setActiveComponentStatus(componentStatus));
  },
  setModalExportBlueprintVisible: visible => {
    dispatch(setModalExportBlueprintVisible(visible));
  },
  setModalCreateImageVisible: modalVisible => {
    dispatch(setModalCreateImageVisible(modalVisible));
  },
  setModalCreateImageHidden: () => {
    dispatch(setModalCreateImageHidden());
  },
  setModalStopBuildState: (composeId, blueprintName) => {
    dispatch(setModalStopBuildState(composeId, blueprintName));
  },
  setModalStopBuildVisible: visible => {
    dispatch(setModalStopBuildVisible(visible));
  },
  setModalDeleteImageState: (composeId, blueprintName) => {
    dispatch(setModalDeleteImageState(composeId, blueprintName));
  },
  setModalDeleteImageVisible: visible => {
    dispatch(setModalDeleteImageVisible(visible));
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
  startCompose: (blueprintName, composeType) => {
    dispatch(startCompose(blueprintName, composeType));
  }
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(injectIntl(BlueprintPage));
