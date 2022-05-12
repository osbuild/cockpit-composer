/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React from "react";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import cockpit from "cockpit"; // eslint-disable-line import/no-unresolved
import PropTypes from "prop-types";
import { Tab, Tabs } from "patternfly-react";
import { Button, Popover } from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import { Table, TableHeader, TableBody, TableVariant } from "@patternfly/react-table";
import { connect } from "react-redux";
import Link from "../../components/Link/Link";
import Layout from "../../components/Layout/Layout";
import BlueprintContents from "../../components/ListView/BlueprintContents";
import ComponentDetailsView from "../../components/ListView/ComponentDetailsView";
import UserAccount from "../../components/Modal/UserAccount";
import EditDescription from "../../components/Modal/EditDescription";
import CreateImageUpload from "../../components/Wizard/CreateImageUpload";
import ExportBlueprint from "../../components/Modal/ExportBlueprint";
import StopBuild from "../../components/Modal/StopBuild";
import DeleteImage from "../../components/Modal/DeleteImage";
import EmptyState from "../../components/EmptyState/EmptyState";
import BlueprintToolbar from "../../components/Toolbar/BlueprintToolbar";
import ListItemImages from "../../components/ListView/ListItemImages";
import ImagesDataList from "../../components/ListView/ImagesDataList";
import TextInlineEdit from "../../components/Form/TextInlineEdit";
import Loading from "../../components/Loading/Loading";
import {
  fetchingBlueprintContents,
  setBlueprintDescription,
  setBlueprintDevice,
  setBlueprintHostname,
  setBlueprintUsers,
  fetchingCompDeps,
} from "../../core/actions/blueprints";
import {
  clearSelectedInput,
  setSelectedInput,
  setSelectedInputDeps,
  setSelectedInputParent,
  fetchingDepDetails,
} from "../../core/actions/inputs";
import { fetchingComposes, fetchingComposeTypes } from "../../core/actions/composes";
import {
  setModalStopBuildVisible,
  setModalStopBuildState,
  setModalDeleteImageVisible,
  setModalDeleteImageState,
} from "../../core/actions/modals";
import {
  setEditDescriptionVisible,
  setEditHostnameVisible,
  setEditHostnameInvalid,
} from "../../core/actions/blueprintPage";
import {
  componentsSortSetKey,
  componentsSortSetValue,
  dependenciesSortSetKey,
  dependenciesSortSetValue,
} from "../../core/actions/sort";
import {
  componentsFilterAddValue,
  componentsFilterRemoveValue,
  componentsFilterClearValues,
} from "../../core/actions/filter";
import {
  makeGetBlueprintById,
  makeGetSortedSelectedComponents,
  makeGetSortedDependencies,
  makeGetFilteredComponents,
  makeGetBlueprintComposes,
  makeGetSelectedDeps,
} from "../../core/selectors";

import "./index.css";

const messages = defineMessages({
  blueprint: {
    defaultMessage: "Blueprint",
  },
  emptyBlueprintTitle: {
    defaultMessage: "Empty blueprint",
  },
  emptyBlueprintMessage: {
    defaultMessage: "There are no components listed in the blueprint. Edit the blueprint to add components.",
  },
  imagesTitle: {
    defaultMessage: "Images",
  },
  noImagesTitle: {
    defaultMessage: "No images",
  },
  noImagesMessage: {
    defaultMessage: "No images have been created from this blueprint.",
  },
  customizationsTitle: {
    defaultMessage: "Customizations",
  },
  packagesTitle: {
    defaultMessage: "Packages",
  },
  descriptionButtonLabel: {
    defaultMessage: "Edit description",
  },
  descriptionInputLabel: {
    defaultMessage: "Description",
  },
  hostnameButtonLabel: {
    defaultMessage: "Edit hostname",
  },
  hostnameInputLabel: {
    defaultMessage: "Hostname",
  },
  hostnameHelp: {
    defaultMessage:
      "Valid characters for hostname are letters from a to z, the digits from 0 to 9, and the hyphen (-). A hostname may not start with a hyphen.",
  },
  hostnameHelpEmpty: {
    defaultMessage: "If no hostname is provided, the hostname will be determined by the OS.",
  },
  deviceHelp: {
    defaultMessage: "Enter valid device node such as /dev/sda1",
  },
  devicePopover: {
    defaultMessage:
      "The installation device is used by the RHEL for Edge Simplified Installer. It specifies which device the image will be installed onto.",
  },
  devicePopoverLabel: {
    defaultMessage: "Installation device help",
  },
  deviceButtonLabel: {
    defaultMessage: "Edit installation device",
  },
  deviceInputLabel: {
    defaultMessage: "Installation device",
  },
  userEdit: {
    defaultMessage: "Edit user account",
  },
  userKebab: {
    defaultMessage: "User account actions",
  },
  userDelete: {
    defaultMessage: "Delete user account",
  },
});

class BlueprintPage extends React.Component {
  constructor() {
    super();
    this.state = {
      device: "",
      editDeviceVisible: false,
    };
    this.handleComponentDetails = this.handleComponentDetails.bind(this);
    this.handleComponentListItem = this.handleComponentListItem.bind(this);
    this.handleDepListItem = this.handleDepListItem.bind(this);
    this.handleHideModalStop = this.handleHideModalStop.bind(this);
    this.handleHideModalDeleteImage = this.handleHideModalDeleteImage.bind(this);
    this.handleEditDescription = this.handleEditDescription.bind(this);
    this.handleEditHostname = this.handleEditHostname.bind(this);
    this.handleEditHostnameValue = this.handleEditHostnameValue.bind(this);
    this.handleEditDeviceVisible = this.handleEditDeviceVisible.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.downloadUrl = this.downloadUrl.bind(this);
  }

  componentDidMount() {
    const { formatMessage } = this.props.intl;
    document.title = formatMessage(messages.blueprint);

    if (this.props.blueprint.components === undefined) {
      this.props.fetchingBlueprintContents(this.props.route.params.blueprint.replace(/\s/g, "-"));
    }
    if (this.props.composesLoading === true) {
      this.props.fetchingComposes();
    }
    this.props.setEditDescriptionVisible(false);
    this.props.setEditHostnameVisible(false);
  }

  componentWillUnmount() {
    this.props.clearSelectedInput();
  }

  handleComponentDetails(event, component) {
    // the user selected a component to view more details
    this.props.setSelectedInput(component);
    this.props.setSelectedInputParent([]);
    event.preventDefault();
    event.stopPropagation();
  }

  handleComponentListItem(component) {
    this.props.fetchingCompDeps(component, this.props.blueprint.id);
  }

  handleDepListItem(component) {
    this.props.fetchingDepDetails(component, this.props.blueprint.id);
  }

  handleEditDescription(value) {
    this.props.setBlueprintDescription(this.props.blueprint, value);
  }

  handleEditHostname(action, value) {
    const state = !this.props.blueprintPage.editHostnameVisible;
    this.props.setEditHostnameVisible(state);
    if (!state && action === "commit") {
      this.props.setBlueprintHostname(this.props.blueprint, value);
    }
  }

  handleEditHostnameValue(value) {
    const validCharacters = value.length === 0 || /^(\d|\w|-|\.){0,252}$/.test(value);
    const validElements = value.split(".").every((element) => element.length < 63);
    const invalid = !!(!validCharacters || !validElements || value.startsWith("-") || value.endsWith("."));
    this.props.setEditHostnameInvalid(invalid);
  }

  handleEditDeviceVisible(action, value) {
    if (action === "commit") {
      this.setState({
        device: value,
        editDeviceVisible: false,
      });
      this.props.setBlueprintDevice(this.props.blueprint, value);
    } else if (action === "cancel") {
      this.setState({
        editDeviceVisible: false,
      });
    } else {
      this.setState({
        editDeviceVisible: true,
      });
    }
  }

  handleDeleteUser(userName, e) {
    const users = this.props.blueprint.customizations.user.filter((user) => user.name !== userName);
    this.props.setBlueprintUsers(this.props.blueprint.id, users);
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

  downloadUrl(compose) {
    const query = window.btoa(
      JSON.stringify({
        payload: "http-stream2",
        unix: "/run/weldr/api.socket",
        method: "GET",
        path: `/api/v0/compose/image/${compose.id}`,
        superuser: "try",
      })
    );

    return `/cockpit/channel/${cockpit.transport.csrf_token}?${query}`;
  }

  render() {
    const {
      blueprint,
      userAccount,
      stopBuild,
      deleteImage,
      selectedComponents,
      dependencies,
      componentsFilters,
      composeList,
      selectedInput,
      selectedInputDeps,
      setSelectedInput,
      setSelectedInputParent,
      clearSelectedInput,
    } = this.props;
    const { editHostnameVisible, editHostnameInvalid } = this.props.blueprintPage;
    const { formatMessage } = this.props.intl;
    let hostname = "";
    if (blueprint.customizations !== undefined && blueprint.customizations.hostname !== undefined) {
      hostname = blueprint.customizations.hostname;
    }
    let users = [];
    if (blueprint.customizations !== undefined && blueprint.customizations.user !== undefined) {
      users = blueprint.customizations.user;
    }
    // Setting the state values from our redux store is tedious.
    // This is a simple way to display the installation device if set in the blueprint customizations.
    let { device } = this.state;
    if (!device && blueprint.customizations && blueprint.customizations.installation_device) {
      device = blueprint.customizations.installation_device;
    }
    const pathSuffix = cockpit.location.path[cockpit.location.path.length - 1];
    const activeKey = ["customizations", "packages", "images"].includes(pathSuffix) ? pathSuffix : undefined;

    const rows = users.map((user) => ({
      props: { "data-tr": user.name },
      cells: [
        user.description,
        user.name,
        { title: user.groups !== undefined && user.groups.includes("wheel") && <span className="fa fa-check" /> },
        { title: user.password && <span className="fa fa-check" /> },
        {
          title: user.key !== undefined && (
            <span>
              <span className="fa fa-check" />
              {` `}
              {user.key.split(" ")[2] || ""}
            </span>
          ),
        },
        {
          title: (
            <div>
              <UserAccount edit users={users} user={user} blueprintID={blueprint.id} />
              <div className="dropdown btn-group dropdown-kebab-pf">
                <button
                  aria-label={`${formatMessage(messages.userKebab)} ${user.name}`}
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  data-btn="more"
                  id="dropdownKebab"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="fa fa-ellipsis-v" />
                </button>
                <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
                  <li>
                    <a href="#" onClick={(e) => this.handleDeleteUser(user.name, e)}>
                      {formatMessage(messages.userDelete)}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ),
        },
      ],
    }));

    return (
      <Layout className="container-fluid" ref={(c) => (this.layout = c)}>
        <header className="cmpsr-header">
          <ol className="breadcrumb">
            <li>
              <Link to="/blueprints">
                <FormattedMessage defaultMessage="Back to blueprints" />
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
                  <FormattedMessage defaultMessage="Edit packages" />
                </Link>
              </li>
              <li>
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
                      <EditDescription
                        description={blueprint.description}
                        handleEditDescription={this.handleEditDescription}
                      />
                    </li>
                    <li>
                      <ExportBlueprint blueprint={blueprint} />
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="cmpsr-title">
            <h1 className="cmpsr-title__item">{this.props.route.params.blueprint}</h1>
            <p className="cmpsr-title__item">
              {blueprint.description && (
                <EditDescription
                  descriptionAsLink
                  description={blueprint.description}
                  handleEditDescription={this.handleEditDescription}
                />
              )}
            </p>
          </div>
        </header>
        <Tabs
          activeKey={activeKey}
          onSelect={(eventId) => cockpit.location.go(["blueprint", this.props.route.params.blueprint, eventId])}
          id="blueprint-tabs"
        >
          <Tab eventKey="customizations" title={formatMessage(messages.customizationsTitle)}>
            <div className="tab-container row">
              <div className="form-customizations col-sm-12 pf-u-ml-md">
                <div className="form-horizontal">
                  <div
                    id="input-hostname"
                    className={`form-group ${editHostnameInvalid ? "has-error" : ""}`}
                    data-form="hostname"
                    onSubmit={() => this.handleEditHostname("commit")}
                  >
                    <label className="col-sm-2 control-label pf-u-text-align-left">
                      {formatMessage(messages.hostnameInputLabel)}
                    </label>
                    <TextInlineEdit
                      className="col-sm-10"
                      editVisible={editHostnameVisible}
                      handleEdit={this.handleEditHostname}
                      validateValue={this.handleEditHostnameValue}
                      buttonLabel={formatMessage(messages.hostnameButtonLabel)}
                      inputLabel={formatMessage(messages.hostnameInputLabel)}
                      value={hostname}
                      invalid={editHostnameInvalid}
                      helpblock={formatMessage(messages.hostnameHelp)}
                      helpblockNoValue={formatMessage(messages.hostnameHelpEmpty)}
                    />
                  </div>
                  <div className="form-group" id="input-device">
                    <label className="col-sm-2 control-label pf-u-text-align-left">
                      <FormattedMessage defaultMessage="Installation Device" />
                      <Popover
                        id="popover-installation-device"
                        bodyContent={formatMessage(messages.devicePopover)}
                        aria-label={formatMessage(messages.devicePopoverLabel)}
                      >
                        <Button variant="plain" aria-label={formatMessage(messages.devicePopoverLabel)}>
                          <OutlinedQuestionCircleIcon />
                        </Button>
                      </Popover>
                    </label>
                    <TextInlineEdit
                      className="col-sm-10"
                      editVisible={this.state.editDeviceVisible}
                      handleEdit={this.handleEditDeviceVisible}
                      buttonLabel={formatMessage(messages.deviceButtonLabel)}
                      inputLabel={formatMessage(messages.deviceInputLabel)}
                      helpblock={formatMessage(messages.deviceHelp)}
                      value={device}
                    />
                  </div>
                  <div className="form-group user-list">
                    <label className="col-sm-2 control-label pf-u-text-align-left">
                      <FormattedMessage defaultMessage="Users" />
                    </label>
                    <div className="col-sm-10">
                      {users.length > 0 && (
                        <div>
                          <Table
                            variant={TableVariant.compact}
                            aria-label="Users List"
                            cells={["Full name", "User name", "Server administrator", "Password", "SSH key", "Actions"]}
                            rows={rows}
                          >
                            <TableHeader />
                            <TableBody />
                          </Table>
                        </div>
                      )}
                      <UserAccount edit={false} blueprintID={blueprint.id} users={users} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="packages" title={formatMessage(messages.packagesTitle)}>
            <div className="row">
              {(!selectedInput.set && (
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
                    showUndoRedo={false}
                  />
                  {(this.props.blueprint.components === undefined && <Loading />) || (
                    <BlueprintContents
                      components={selectedComponents}
                      dependencies={dependencies}
                      noEditComponent
                      handleComponentDetails={this.handleComponentDetails}
                      filterClearValues={this.props.componentsFilterClearValues}
                      filterValues={componentsFilters.filterValues}
                      errorState={this.props.blueprintContentsError}
                      fetchingState={this.props.blueprintContentsFetching}
                      fetchDetails={this.handleComponentListItem}
                    >
                      <EmptyState
                        title={formatMessage(messages.emptyBlueprintTitle)}
                        message={formatMessage(messages.emptyBlueprintMessage)}
                      >
                        <Link to={`/edit/${this.props.route.params.blueprint}`}>
                          <button className="btn btn-default btn-primary" type="button">
                            <FormattedMessage defaultMessage="Edit packages" />
                          </button>
                        </Link>
                      </EmptyState>
                    </BlueprintContents>
                  )}
                </div>
              )) || (
                <div className="col-sm-12 cmpsr-component-details--view">
                  <h3 className="cmpsr-panel__title cmpsr-panel__title--main">
                    <FormattedMessage defaultMessage="Component details" />
                  </h3>
                  <ComponentDetailsView
                    blueprint={this.props.route.params.blueprint}
                    component={selectedInput.component}
                    dependencies={selectedInputDeps}
                    componentParent={selectedInput.parent}
                    setSelectedInput={setSelectedInput}
                    setSelectedInputParent={setSelectedInputParent}
                    clearSelectedInput={clearSelectedInput}
                    handleComponentDetails={this.handleComponentDetails}
                    handleDepListItem={this.handleDepListItem}
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
                  <CreateImageUpload blueprint={blueprint} layout={this.layout} />
                </EmptyState>
              )) || (
                <ImagesDataList ariaLabel={formatMessage(messages.imagesTitle)}>
                  {composeList.map((compose) => (
                    <ListItemImages
                      blueprint={this.props.route.params.blueprint}
                      fetchingComposeTypes={this.props.fetchingComposeTypes}
                      imageTypes={this.props.imageTypes}
                      listItem={compose}
                      downloadUrl={this.downloadUrl(compose)}
                      key={compose.id}
                    />
                  ))}
                </ImagesDataList>
              )}
            </div>
          </Tab>
        </Tabs>
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
    pattern: PropTypes.object,
  }),
  fetchingBlueprintContents: PropTypes.func,
  fetchingCompDeps: PropTypes.func,
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
    workspacePendingChanges: PropTypes.arrayOf(PropTypes.object),
    customizations: PropTypes.shape({
      hostname: PropTypes.string,
      installation_device: PropTypes.string,
      user: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
  fetchingComposes: PropTypes.func,
  fetchingComposeTypes: PropTypes.func,
  composesLoading: PropTypes.bool,
  composeList: PropTypes.arrayOf(PropTypes.object),
  imageTypes: PropTypes.arrayOf(PropTypes.object),
  setEditDescriptionVisible: PropTypes.func,
  setEditHostnameVisible: PropTypes.func,
  setEditHostnameInvalid: PropTypes.func,
  setBlueprintUsers: PropTypes.func,
  blueprintPage: PropTypes.shape({
    editDescriptionVisible: PropTypes.bool,
    editHostnameVisible: PropTypes.bool,
    editHostnameInvalid: PropTypes.bool,
  }),
  setBlueprintDescription: PropTypes.func,
  setBlueprintDevice: PropTypes.func,
  setBlueprintHostname: PropTypes.func,
  selectedInput: PropTypes.shape({
    set: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    parent: PropTypes.arrayOf(PropTypes.object),
  }),
  selectedInputDeps: PropTypes.arrayOf(PropTypes.object),
  setSelectedInput: PropTypes.func,
  clearSelectedInput: PropTypes.func,
  setSelectedInputParent: PropTypes.func,
  fetchingDepDetails: PropTypes.func,
  stopBuild: PropTypes.shape({
    blueprintName: PropTypes.string,
    composeId: PropTypes.string,
    visible: PropTypes.bool,
  }),
  deleteImage: PropTypes.shape({
    blueprintName: PropTypes.string,
    composeId: PropTypes.string,
    visible: PropTypes.bool,
  }),
  CreateImageUpload: PropTypes.shape({
    blueprint: PropTypes.object,
    visible: PropTypes.bool,
  }),
  userAccount: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    password: PropTypes.string,
    key: PropTypes.string,
    groups: PropTypes.arrayOf(PropTypes.string),
    visible: PropTypes.bool,
    editUser: PropTypes.string,
  }),
  dependenciesSortSetValue: PropTypes.func,
  componentsSortSetValue: PropTypes.func,
  componentsFilters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object),
  }),
  componentsFilterAddValue: PropTypes.func,
  componentsFilterRemoveValue: PropTypes.func,
  componentsFilterClearValues: PropTypes.func,
  selectedComponents: PropTypes.arrayOf(PropTypes.object),
  dependencies: PropTypes.arrayOf(PropTypes.object),
  componentsSortKey: PropTypes.string,
  componentsSortValue: PropTypes.string,
  setModalStopBuildVisible: PropTypes.func,
  setModalStopBuildState: PropTypes.func,
  setModalDeleteImageVisible: PropTypes.func,
  setModalDeleteImageState: PropTypes.func,
  blueprintContentsError: PropTypes.shape({
    message: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string,
  }),
  blueprintContentsFetching: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

BlueprintPage.defaultProps = {
  route: {},
  fetchingBlueprintContents() {},
  blueprint: {},
  fetchingComposes() {},
  fetchingComposeTypes() {},
  composesLoading: false,
  composeList: [],
  imageTypes: [],
  setEditDescriptionVisible() {},
  setEditHostnameVisible() {},
  setEditHostnameInvalid() {},
  setBlueprintUsers() {},
  blueprintPage: {},
  setBlueprintDescription() {},
  setBlueprintDevice() {},
  setBlueprintHostname() {},
  stopBuild: {},
  deleteImage: {},
  CreateImageUpload: {},
  userAccount: {},
  dependenciesSortSetValue() {},
  componentsSortSetValue() {},
  componentsFilters: {},
  componentsFilterAddValue() {},
  componentsFilterRemoveValue() {},
  componentsFilterClearValues() {},
  selectedComponents: [],
  dependencies: [],
  componentsSortKey: "",
  componentsSortValue: "",
  fetchingCompDeps() {},
  selectedInput: {},
  selectedInputDeps: undefined,
  setSelectedInput() {},
  clearSelectedInput() {},
  setSelectedInputParent() {},
  fetchingDepDetails() {},
  setModalStopBuildVisible() {},
  setModalStopBuildState() {},
  setModalDeleteImageVisible() {},
  setModalDeleteImageState() {},
  blueprintContentsError: {},
  blueprintContentsFetching: false,
};

const makeMapStateToProps = () => {
  const getBlueprintById = makeGetBlueprintById();
  const getSortedSelectedComponents = makeGetSortedSelectedComponents();
  const getSortedDependencies = makeGetSortedDependencies();
  const getFilteredComponents = makeGetFilteredComponents();
  const getSelectedDeps = makeGetSelectedDeps();
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
        imageTypes: state.composes.composeTypes,
        blueprintPage: state.blueprintPage,
        selectedInput: state.inputs.selectedInput,
        selectedInputDeps: getSelectedDeps(
          state,
          state.inputs.selectedInput.component.dependencies,
          fetchedBlueprint.present.components
        ),
        userAccount: state.modals.userAccount,
        stopBuild: state.modals.stopBuild,
        deleteImage: state.modals.deleteImage,
        componentsSortKey: state.sort.components.key,
        componentsSortValue: state.sort.components.value,
        componentsFilters: state.filter.components,
        blueprintContentsError: fetchedBlueprint.errorState,
        blueprintContentsFetching: !!(
          fetchedBlueprint.present.components === undefined && fetchedBlueprint.errorState === undefined
        ),
      };
    }
    return {
      blueprint: {},
      selectedComponents: [],
      dependencies: [],
      composeList: [],
      composesLoading: state.composes.fetchingComposes,
      imageTypes: state.composes.composeTypes,
      blueprintPage: state.blueprintPage,
      userAccount: state.modals.userAccount,
      stopBuild: state.modals.stopBuild,
      deleteImage: state.modals.deleteImage,
      componentsSortKey: state.sort.components.key,
      componentsSortValue: state.sort.components.value,
      componentsFilters: state.filter.components,
      blueprintContentsError: {},
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  fetchingBlueprintContents: (blueprintId) => {
    dispatch(fetchingBlueprintContents(blueprintId));
  },
  fetchingComposes: () => {
    dispatch(fetchingComposes());
  },
  fetchingComposeTypes: () => {
    dispatch(fetchingComposeTypes());
  },
  setBlueprintDescription: (blueprint, description) => {
    dispatch(setBlueprintDescription(blueprint, description));
  },
  setEditDescriptionVisible: (visible) => {
    dispatch(setEditDescriptionVisible(visible));
  },
  setBlueprintDevice: (blueprint, device) => {
    dispatch(setBlueprintDevice(blueprint, device));
  },
  setBlueprintHostname: (blueprint, hostname) => {
    dispatch(setBlueprintHostname(blueprint, hostname));
  },
  setEditHostnameVisible: (visible) => {
    dispatch(setEditHostnameVisible(visible));
  },
  setEditHostnameInvalid: (invalid) => {
    dispatch(setEditHostnameInvalid(invalid));
  },
  setBlueprintUsers: (blueprintId, users) => {
    dispatch(setBlueprintUsers(blueprintId, users));
  },
  setSelectedInput: (selectedInput) => {
    dispatch(setSelectedInput(selectedInput));
  },
  setSelectedInputDeps: (dependencies) => {
    dispatch(setSelectedInputDeps(dependencies));
  },
  setSelectedInputParent: (selectedInputParent) => {
    dispatch(setSelectedInputParent(selectedInputParent));
  },
  clearSelectedInput: () => {
    dispatch(clearSelectedInput());
  },
  setModalStopBuildState: (composeId, blueprintName) => {
    dispatch(setModalStopBuildState(composeId, blueprintName));
  },
  setModalStopBuildVisible: (visible) => {
    dispatch(setModalStopBuildVisible(visible));
  },
  setModalDeleteImageState: (composeId, blueprintName) => {
    dispatch(setModalDeleteImageState(composeId, blueprintName));
  },
  setModalDeleteImageVisible: (visible) => {
    dispatch(setModalDeleteImageVisible(visible));
  },
  componentsSortSetKey: (key) => {
    dispatch(componentsSortSetKey(key));
  },
  componentsSortSetValue: (value) => {
    dispatch(componentsSortSetValue(value));
  },
  dependenciesSortSetKey: (key) => {
    dispatch(dependenciesSortSetKey(key));
  },
  dependenciesSortSetValue: (value) => {
    dispatch(dependenciesSortSetValue(value));
  },
  componentsFilterAddValue: (value) => {
    dispatch(componentsFilterAddValue(value));
  },
  componentsFilterRemoveValue: (value) => {
    dispatch(componentsFilterRemoveValue(value));
  },
  componentsFilterClearValues: (value) => {
    dispatch(componentsFilterClearValues(value));
  },
  fetchingCompDeps: (component, blueprintId) => {
    dispatch(fetchingCompDeps(component, blueprintId));
  },
  fetchingDepDetails: (component, blueprintId) => {
    dispatch(fetchingDepDetails(component, blueprintId));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(injectIntl(BlueprintPage));
