import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import Tabs from '../../components/Tabs/Tabs';
import Tab from '../../components/Tabs/Tab';
import BlueprintContents from '../../components/ListView/BlueprintContents';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateImage from '../../components/Modal/CreateImage';
import ExportBlueprint from '../../components/Modal/ExportBlueprint';
import EmptyState from '../../components/EmptyState/EmptyState';
import BlueprintToolbar from '../../components/Toolbar/BlueprintToolbar';
import ListView from '../../components/ListView/ListView';
import ListItemImages from '../../components/ListView/ListItemImages';
import ListItemChanges from '../../components/ListView/ListItemChanges';
import { connect } from 'react-redux';
import {
  fetchingBlueprintContents, fetchingImageStatus,
  setBlueprintDescription, startCompose
} from '../../core/actions/blueprints';
import {
  setModalExportBlueprintVisible, setModalCreateImageVisible, setModalCreateImageBlueprintName
} from '../../core/actions/modals';
import {
  setEditDescriptionVisible, setEditDescriptionValue,
  setActiveComponent, setActiveComponentStatus, setActiveComponentParent,
  setActiveTab,
} from '../../core/actions/blueprintPage';
import {
  componentsSortSetKey, componentsSortSetValue, dependenciesSortSetKey, dependenciesSortSetValue,
} from '../../core/actions/sort';
import { componentsFilterAddValue, componentsFilterRemoveValue, componentsFilterClearValues } from '../../core/actions/filter';
import { makeGetBlueprintById, makeGetSortedSelectedComponents, makeGetSortedDependencies,
  makeGetFilteredComponents } from '../../core/selectors';

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
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);

    this.state = {
      changes: [],
      images: []
    };
  }

  componentWillMount() {
    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, '-'));
    }
    this.props.setEditDescriptionVisible(false);
    this.props.setModalExportBlueprintVisible(false);
  }

  componentDidMount() {
    document.title = 'Blueprint';
  }

  setNotifications() {
    this.refs.layout.setNotifications();
  }

  handleTabChanged(e) {
    if (this.props.blueprintPage.activeTab !== e.detail) {
      this.props.setActiveTab(e.detail);
    }
    e.preventDefault();
    e.stopPropagation();
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
    } else if (action === 'commit') {
      this.props.setBlueprintDescription(this.props.blueprint, this.props.blueprintPage.editDescriptionValue);
    } else if (action === 'cancel') {
      // cancel action
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
    this.props.setModalCreateImageVisible(false);
    this.props.setModalCreateImageBlueprintName('');
  }

  handleShowModalCreateImage(e, blueprint) {
    this.props.setModalCreateImageBlueprintName(blueprint.name);
    this.props.setModalCreateImageVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }


  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  render() {
    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, '-'));
      return <div></div>;
    }
    const {
      blueprint, exportModalVisible, createImage, selectedComponents, dependencies, componentsFilters,
    } = this.props;
    const {
      editDescriptionValue, editDescriptionVisible, activeTab,
      activeComponent, activeComponentParent, activeComponentStatus,
    } = this.props.blueprintPage;

    var changes;
    if (this.state.changes.length > 0) {
        changes = (
          <div className="col-sm-6 col-lg-8">
            <div className="cmpsr-summary-listview">
              <p><strong>Changes</strong></p>
              <div className="list-pf cmpsr-list-pf list-pf-stacked cmpsr-list-pf__compacted cmpsr-blueprint__changes">
                {this.state.changes.map((change, i) => (
                  <ListItemChanges
                    listItem={change}
                    number={this.state.changes.length - i}
                    listItemParent="cmpsr-blueprint__changes"
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }

    return (
      <Layout className="container-fluid" ref="layout">
        <header className="cmpsr-header">
          <ol className="breadcrumb">
            <li><Link to="/blueprints">Back to Blueprints</Link></li>
            <li className="active"><strong>{this.props.route.params.blueprint}</strong></li>
          </ol>
          <div className="cmpsr-header__actions">
            <ul className="list-inline">
              <li>
                <Link to={`/edit/${this.props.route.params.blueprint}`} className="btn btn-default">Edit Blueprint</Link>
              </li>
              <li>
                <button
                  className={`btn btn-default ${selectedComponents.length ? '' : 'disabled'}`}
                  id="cmpsr-btn-crt-image"
                  data-toggle="modal"
                  data-target="#cmpsr-modal-crt-image"
                  type="button"
                  onClick={(e) => this.handleShowModalCreateImage(e, blueprint)}
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
                      <li><a href="#" onClick={this.handleShowModalExport}>Export</a></li>
                    ||
                      <li className="disabled"><a>Export</a></li>
                    }
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
        <Tabs key="pf-tabs" ref="pfTabs" tabChanged={this.handleTabChanged}>
          <Tab tabTitle="Details" active={activeTab === 'Details'}>
            <div className="tab-container row">
              <div className="col-sm-6 col-lg-4">
                <dl className="dl-horizontal mt-">
                  <dt>Name</dt>
                  <dd>{blueprint.name}</dd>
                  <dt>Description</dt>
                  {(editDescriptionVisible &&
                    <dd>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={editDescriptionValue}
                          onChange={this.handleChangeDescription}
                        />
                        <span className="input-group-btn">
                          <button className="btn btn-link" type="button" onClick={() => this.handleEditDescription('commit')}>
                            <span className="fa fa-check" />
                          </button>
                          <button className="btn btn-link" type="button" onClick={() => this.handleEditDescription('cancel')}>
                            <span className="pficon pficon-close" />
                          </button>
                        </span>
                      </div>
                    </dd>) ||
                    <dd onClick={() => this.handleEditDescription()}>
                      {blueprint.description}
                      <button className="btn btn-link" type="button">
                        <span className="pficon pficon-edit" />
                      </button>
                    </dd>}
                </dl>
              </div>
              {changes}
            </div>
          </Tab>
          <Tab tabTitle="Selected Components" active={activeTab === 'SelectedComponents'}>
            <div className="row">
              {(activeComponent === '' &&
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
                      title={'Empty Blueprint'}
                      message={'There are no components listed in the blueprint. Edit the blueprint to add components.'}
                    >
                      <Link to={`/edit/${this.props.route.params.blueprint}`}>
                        <button className="btn btn-default btn-primary" type="button">
                          Edit Blueprint
                        </button>
                      </Link>
                    </EmptyState>
                  </BlueprintContents>
                </div>)
                ||
                <div className="col-sm-12 cmpsr-component-details--view">
                  <h3 className="cmpsr-panel__title cmpsr-panel__title--main">Component Details</h3>
                  <ComponentDetailsView
                    parent={this.props.route.params.blueprint}
                    component={activeComponent}
                    componentParent={activeComponentParent}
                    status={activeComponentStatus}
                    handleComponentDetails={this.handleComponentDetails}
                  />
                </div>
              }
            </div>
          </Tab>
          <Tab tabTitle="Images" active={activeTab === 'Images'}>
            <div className="tab-container">
              {(this.props.blueprint.images.length === 0 &&
                <EmptyState title={'No Images'} message={'No images have been created from this blueprint.'}>
                  <button
                    className="btn btn-default"
                    id="cmpsr-btn-crt-image"
                    data-toggle="modal"
                    data-target="#cmpsr-modal-crt-image"
                    type="button"
                    onClick={(e) => this.handleShowModalCreateImage(e, blueprint)}
                  >
                    Create Image
                  </button>
                </EmptyState>) ||
                <ListView className="cmpsr-images" stacked>
                  {this.props.blueprint.images.map((image, i) => (
                    <ListItemImages
                      listItemParent="cmpsr-images"
                      blueprint={this.props.route.params.blueprint}
                      listItem={image}
                      fetchingImageStatus={this.props.fetchingImageStatus}
                      key={i}
                    />
                  ))}
                </ListView>}
            </div>
          </Tab>
        </Tabs>
        {createImage.visible
          ? <CreateImage
            blueprint={blueprint.name}
            imageTypes={createImage.imageTypes}
            setNotifications={this.setNotifications}
            handleStartCompose={this.handleStartCompose}
            handleHideModal={this.handleHideModalCreateImage}
          />
          : null}
        {exportModalVisible
          ? <ExportBlueprint
            blueprint={blueprint.name}
            contents={blueprint.components}
            handleHideModal={this.handleHideModalExport}
          />
          : null}
      </Layout>
    );
  }
}

BlueprintPage.propTypes = {
  route: PropTypes.object,
  fetchingBlueprintContents: PropTypes.func,
  blueprint: PropTypes.object,
  setActiveTab: PropTypes.func,
  setEditDescriptionValue: PropTypes.func,
  setEditDescriptionVisible: PropTypes.func,
  setActiveComponent: PropTypes.func,
  setActiveComponentParent: PropTypes.func,
  setActiveComponentStatus: PropTypes.func,
  setModalExportBlueprintVisible: PropTypes.func,
  blueprintPage: PropTypes.object,
  setBlueprintDescription: PropTypes.func,
  exportModalVisible: PropTypes.bool,
  createImage: PropTypes.array,
  dependenciesSortSetKey: PropTypes.func,
  dependenciesSortSetValue: PropTypes.func,
  componentsSortSetKey: PropTypes.func,
  componentsSortSetValue: PropTypes.func,
  componentsFilters: PropTypes.object,
  componentsFilterAddValue: PropTypes.func,
  componentsFilterRemoveValue: PropTypes.func,
  componentsFilterClearValues: PropTypes.func,
  selectedComponents: PropTypes.array,
  dependencies: PropTypes.array,
  componentsSortKey: PropTypes.string,
  componentsSortValue: PropTypes.string,
  setModalCreateImageVisible: PropTypes.func,
  setModalCreateImageBlueprintName: PropTypes.func,
  startCompose: PropTypes.func,
  fetchingImageStatus: PropTypes.func,
  blueprintContentsError: PropTypes.object,
  blueprintContentsFetching: PropTypes.bool,
};

const makeMapStateToProps = () => {
  const getBlueprintById = makeGetBlueprintById();
  const getSortedSelectedComponents = makeGetSortedSelectedComponents();
  const getSortedDependencies = makeGetSortedDependencies();
  const getFilteredComponents = makeGetFilteredComponents();
  const mapStateToProps = (state, props) => {
    if (getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, '-')) !== undefined) {
      const fetchedBlueprint = getBlueprintById(state, props.route.params.blueprint.replace(/\s/g, '-'));
      return {
        blueprint: fetchedBlueprint.present,
        selectedComponents: getFilteredComponents(state, getSortedSelectedComponents(state, fetchedBlueprint.present)),
        dependencies: getFilteredComponents(state, getSortedDependencies(state, fetchedBlueprint.present)),
        blueprintPage: state.blueprintPage,
        exportModalVisible: state.modals.exportBlueprint.visible,
        createImage: state.modals.createImage,
        componentsSortKey: state.sort.components.key,
        componentsSortValue: state.sort.components.value,
        componentsFilters: state.filter.components,
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
      blueprintPage: state.blueprintPage,
      exportModalVisible: state.modals.exportBlueprint.visible,
      createImage: state.modals.createImage,
      componentsSortKey: state.sort.components.key,
      componentsSortValue: state.sort.components.value,
      componentsFilters: state.filter.components,
      blueprintContentsError: {},
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  fetchingBlueprintContents: blueprintId => {
    dispatch(fetchingBlueprintContents(blueprintId));
  },
  setBlueprintDescription: (blueprint, description) => {
    dispatch(setBlueprintDescription(blueprint, description));
  },
  setEditDescriptionValue: (value) => {
    dispatch(setEditDescriptionValue(value));
  },
  setEditDescriptionVisible: (visible) => {
    dispatch(setEditDescriptionVisible(visible));
  },
  setActiveTab: (activeTab) => {
    dispatch(setActiveTab(activeTab));
  },
  setActiveComponent: (component) => {
    dispatch(setActiveComponent(component));
  },
  setActiveComponentParent: (componentParent) => {
    dispatch(setActiveComponentParent(componentParent));
  },
  setActiveComponentStatus: (componentStatus) => {
    dispatch(setActiveComponentStatus(componentStatus));
  },
  setModalExportBlueprintVisible: (visible) => {
    dispatch(setModalExportBlueprintVisible(visible));
  },
  setModalCreateImageBlueprintName: modalBlueprintName => {
    dispatch(setModalCreateImageBlueprintName(modalBlueprintName));
  },
  setModalCreateImageVisible: modalVisible => {
    dispatch(setModalCreateImageVisible(modalVisible));
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
  },
  fetchingImageStatus: (blueprintName, imageId) => {
    dispatch(fetchingImageStatus(blueprintName, imageId));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(BlueprintPage);
