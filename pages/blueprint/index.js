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
import Loading from '../../components/Loading/Loading';
import BlueprintToolbar from '../../components/Toolbar/BlueprintToolbar';
import ListView from '../../components/ListView/ListView';
import ListItemImages from '../../components/ListView/ListItemImages';
import ListItemChanges from '../../components/ListView/ListItemChanges';
import { connect } from 'react-redux';
import { fetchingBlueprintContents, setBlueprintDescription } from '../../core/actions/blueprints';
import { setModalExportBlueprintVisible } from '../../core/actions/modals';
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
    this.handleChangeDescription = this.handleChangeDescription.bind(this);

    this.state = {
      changes: [
        {
          commit: "3eaa3e0f732e37be4629042b8b74a4873ebb9909",
          time: "Thu,  9 Nov 2017 14:50:41 +0000",
          message: "These are comments about the changes that were committed."
        },
        {
          commit: "627a776366f1f89e70d7453e1d7f4c88e9025229",
          time: "Thu,  9 Nov 2017 14:48:49 +0000",
          message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur \
          sagittis ullamcorper commodo. Pellentesque vitae arcu non eros \
          tincidunt malesuada."
        },
        {
          commit: "5fc425a221d207393ae3720eaea5cbb9308657c3",
          time: "Wed, 18 Oct 2017 17:44:50 +0000",
          message: "Etiam aliquet elit sit amet mauris pretium, ut hendrerit mauris lacinia."
        },
        {
          commit: "8feb1e64d7e3f9d8a16ec0476bc76447c67d7f63",
          time: "Wed, 18 Oct 2017 17:41:10 +0000",
          message: "Nullam nisl tellus, finibus et porttitor quis, efficitur ac ante."
        },
        {
          commit: "a41325a28174d53ad5e54d2868a0fd312875468f",
          time: "Thu,  5 Oct 2017 19:54:42 +0000",
          message:
          "Mauris tincidunt, tellus id commodo fermentum, tellus nisi elementum \
          nisi, vitae lacinia augue sem eget turpis."
        },
      ],
      images: [
        {
          date_created: '2/06/17',
          date_exported: '2/06/17',
          user: 'Brian Johnson',
          type: 'iso',
          change: '3',
          size: '2,345 KB',
        },
        {
          date_created: '1/17/17',
          date_exported: '1/17/17',
          user: 'Brian Johnson',
          type: 'iso',
          change: '2',
          size: '1,234 KB',
        },
      ],
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
  render() {
    const {
      blueprint, exportModalVisible, imageTypes, selectedComponents, dependencies, componentsFilters,
    } = this.props;

    const {
      editDescriptionValue, editDescriptionVisible, activeTab,
      activeComponent, activeComponentParent, activeComponentStatus,
    } = this.props.blueprintPage;

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
                  <dt>Install size</dt>
                  <dd>2,678 KB</dd>
                  <dt>Last modified date</dt>
                  <dd>Thu,  9 Nov 2017</dd>
                </dl>
              </div>
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
                  {(blueprint.components === undefined &&
                    <Loading />) ||
                    ((selectedComponents === undefined || selectedComponents.length === 0) &&
                      componentsFilters.filterValues.length === 0) &&
                      <EmptyState
                        title={'Empty Blueprint'}
                        message={'There are no components listed in the blueprint. Edit the blueprint to add components.'}
                      >
                        <Link to={`/edit/${this.props.route.params.blueprint}`}>
                          <button className="btn btn-default btn-primary" type="button">
                            Edit Blueprint
                          </button>
                        </Link>
                      </EmptyState> ||
                    <BlueprintContents
                      components={selectedComponents}
                      dependencies={dependencies}
                      noEditComponent
                      handleComponentDetails={this.handleComponentDetails}
                      filterClearValues={this.props.componentsFilterClearValues}
                    />}
                </div>) ||
                <div className="col-sm-12 cmpsr-component-details--view">
                  <h3 className="cmpsr-panel__title cmpsr-panel__title--main">Component Details</h3>
                  <ComponentDetailsView
                    parent={this.props.route.params.blueprint}
                    component={activeComponent}
                    componentParent={activeComponentParent}
                    status={activeComponentStatus}
                    handleComponentDetails={this.handleComponentDetails}
                  />
                </div>}
            </div>
          </Tab>
          <Tab tabTitle="Images" active={activeTab === 'Images'}>
            <div className="tab-container">
              {(this.state.images.length === 0 &&
                <EmptyState title={'No Images'} message={'No images have been created from this blueprint.'}>
                  <button
                    className="btn btn-default"
                    id="cmpsr-btn-crt-image"
                    data-toggle="modal"
                    data-target="#cmpsr-modal-crt-image"
                    type="button"
                  >
                    Create Image
                  </button>
                </EmptyState>) ||
                <ListView className="cmpsr-blueprint__images cmpsr-list">
                  {this.state.images.map((image, i) => (
                    <ListItemImages
                      listItemParent="cmpsr-blueprint__images"
                      blueprint={this.props.route.params.blueprint}
                      listItem={image}
                      key={i}
                    />
                  ))}
                </ListView>}
            </div>
          </Tab>
        </Tabs>
        <CreateImage blueprint={blueprint.name} imageTypes={imageTypes} setNotifications={this.setNotifications} />
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
  imageTypes: PropTypes.array,
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
        imageTypes: state.modals.createImage.imageTypes,
        componentsSortKey: state.sort.components.key,
        componentsSortValue: state.sort.components.value,
        componentsFilters: state.filter.components,
      };
    }
    return {
      blueprint: {},
      selectedComponents: [],
      dependencies: [],
      blueprintPage: state.blueprintPage,
      exportModalVisible: state.modals.exportBlueprint.visible,
      imageTypes: state.modals.createImage.imageTypes,
      componentsSortKey: state.sort.components.key,
      componentsSortValue: state.sort.components.value,
      componentsFilters: state.filter.components,
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
  }
});

export default connect(makeMapStateToProps, mapDispatchToProps)(BlueprintPage);
