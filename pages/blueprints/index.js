import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "../../components/Layout/Layout";
import BlueprintListView from "../../components/ListView/BlueprintListView";
import CreateBlueprint from "../../components/Modal/CreateBlueprint";
import ExportBlueprint from "../../components/Modal/ExportBlueprint";
import DeleteBlueprint from "../../components/Modal/DeleteBlueprint";
import ManageSources from "../../components/Modal/ManageSources";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import BlueprintsToolbar from "../../components/Toolbar/BlueprintsToolbar";
import { deletingBlueprint, fetchingBlueprints } from "../../core/actions/blueprints";
import {
  fetchingModalExportBlueprintContents,
  setModalExportBlueprintName,
  setModalExportBlueprintContents,
  setModalExportBlueprintVisible,
  setModalDeleteBlueprintName,
  setModalDeleteBlueprintId,
  setModalDeleteBlueprintVisible,
  setModalManageSourcesVisible,
  fetchingModalManageSourcesContents
} from "../../core/actions/modals";
import { blueprintsSortSetKey, blueprintsSortSetValue } from "../../core/actions/sort";
import {
  blueprintsFilterAddValue,
  blueprintsFilterRemoveValue,
  blueprintsFilterClearValues
} from "../../core/actions/filter";
import { startCompose } from "../../core/actions/composes";
import { makeGetSortedBlueprints, makeGetFilteredBlueprints } from "../../core/selectors";

const messages = defineMessages({
  blueprintsTitle: {
    defaultMessage: "Blueprints"
  },
  emptyMessage: {
    defaultMessage:
      "Create a blueprint to define the contents that will be included in the images you create. " +
      "Images can be produced in a variety of output formats."
  },
  emptyTitle: {
    defaultMessage: "No Blueprints"
  },
  errorTitle: {
    defaultMessage: "An Error Occurred"
  },
  noResultsMessage: {
    defaultMessage: "Modify your filter criteria to get results."
  },
  noResultsTitle: {
    defaultMessage: "No Results Match the Filter Criteria"
  }
});

class BlueprintsPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHideModalDelete = this.handleHideModalDelete.bind(this);
    this.handleShowModalDelete = this.handleShowModalDelete.bind(this);
    this.handleHideModalExport = this.handleHideModalExport.bind(this);
    this.handleShowModalExport = this.handleShowModalExport.bind(this);
    this.handleHideModalManageSources = this.handleHideModalManageSources.bind(this);
    this.handleShowModalManageSources = this.handleShowModalManageSources.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
  }

  componentWillMount() {
    if (this.props.blueprintsLoading === true) {
      this.props.fetchingBlueprints();
    }
  }

  componentDidMount() {
    document.title = this.props.intl.formatMessage(messages.blueprintsTitle);
  }

  setNotifications() {
    this.layout.setNotifications();
  }

  handleDelete(event, blueprint) {
    event.preventDefault();
    event.stopPropagation();
    this.props.deletingBlueprint(blueprint);
  }

  handleStartCompose(blueprintName, composeType) {
    this.props.startCompose(blueprintName, composeType);
  }

  // handle show/hide of modal dialogs
  handleHideModalExport() {
    this.props.setModalExportBlueprintVisible(false);
    this.props.setModalExportBlueprintName("");
    this.props.setModalExportBlueprintContents([]);
  }

  handleShowModalExport(e, blueprint) {
    // This implementation of the dialog only provides a text option, and it's
    // automatically selected. Eventually, the following code should move to a
    // separate function that is called when the user selects the text option

    // display the dialog, a spinner will display while contents are undefined
    this.props.setModalExportBlueprintName(blueprint);
    this.props.setModalExportBlueprintContents(undefined);
    const blueprintName = blueprint.replace(/\s/g, "-");
    // run depsolving against blueprint to get contents for dialog
    this.props.fetchingModalExportBlueprintContents(blueprintName);
    this.props.setModalExportBlueprintVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  handleHideModalDelete() {
    this.props.setModalDeleteBlueprintVisible(false);
    this.props.setModalDeleteBlueprintId("");
    this.props.setModalDeleteBlueprintName("");
  }

  handleShowModalDelete(e, blueprint) {
    this.props.setModalDeleteBlueprintId(blueprint.id);
    this.props.setModalDeleteBlueprintName(blueprint.name);
    this.props.setModalDeleteBlueprintVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  handleHideModalManageSources() {
    this.props.setModalManageSourcesVisible(false);
  }

  handleShowModalManageSources(e) {
    this.props.fetchingModalManageSourcesContents();
    this.props.setModalManageSourcesVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {
      blueprints,
      exportBlueprint,
      deleteBlueprint,
      manageSources,
      blueprintSortKey,
      blueprintSortValue,
      blueprintsSortSetValue,
      blueprintFilters,
      blueprintsFilterAddValue,
      blueprintsFilterRemoveValue,
      blueprintsFilterClearValues,
      blueprintsError,
      blueprintsLoading,
      imageTypes
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Layout className="container-fluid" ref={c => (this.layout = c)}>
        <BlueprintsToolbar
          blueprintNames={blueprints.map(blueprint => blueprint.present.id)}
          emptyState={blueprints.length === 0 && blueprintFilters.filterValues.length === 0}
          errorState={blueprintsError !== null}
          filters={blueprintFilters}
          filterRemoveValue={blueprintsFilterRemoveValue}
          filterClearValues={blueprintsFilterClearValues}
          filterAddValue={blueprintsFilterAddValue}
          sortKey={blueprintSortKey}
          sortValue={blueprintSortValue}
          sortSetValue={blueprintsSortSetValue}
          handleShowModalManageSources={this.handleShowModalManageSources}
        />
        {(blueprintsLoading === true && <Loading />) ||
          ((blueprintsError !== null && (
            <EmptyState title={formatMessage(messages.errorTitle)} message={blueprintsError.message} />
          )) ||
            ((blueprints.length > 0 && (
              <BlueprintListView
                blueprints={blueprints.map(blueprint => blueprint.present)}
                setNotifications={this.setNotifications}
                handleShowModalExport={this.handleShowModalExport}
                handleShowModalDelete={this.handleShowModalDelete}
                imageTypes={imageTypes}
                layout={this.layout}
              />
            )) ||
              ((blueprintFilters.filterValues.length === 0 && (
                <EmptyState title={formatMessage(messages.emptyTitle)} message={formatMessage(messages.emptyMessage)}>
                  <CreateBlueprint blueprintNames={blueprints.map(blueprint => blueprint.present.id)} />
                </EmptyState>
              )) || (
                <EmptyState
                  title={formatMessage(messages.noResultsTitle)}
                  message={formatMessage(messages.noResultsMessage)}
                >
                  <button className="btn btn-link btn-lg" type="button" onClick={blueprintsFilterClearValues}>
                    <FormattedMessage defaultMessage="Clear All Filters" />
                  </button>
                </EmptyState>
              ))))}
        {exportBlueprint !== undefined && exportBlueprint.visible ? (
          <ExportBlueprint
            blueprint={exportBlueprint.name}
            contents={exportBlueprint.contents}
            handleHideModal={this.handleHideModalExport}
          />
        ) : null}
        {deleteBlueprint !== undefined && deleteBlueprint.visible ? (
          <DeleteBlueprint
            blueprint={deleteBlueprint}
            handleDelete={this.handleDelete}
            handleHideModal={this.handleHideModalDelete}
          />
        ) : null}
        {manageSources !== undefined && manageSources.visible ? (
          <ManageSources handleHideModal={this.handleHideModalManageSources} sources={manageSources.sources} />
        ) : null}
      </Layout>
    );
  }
}

BlueprintsPage.propTypes = {
  deletingBlueprint: PropTypes.func,
  setModalDeleteBlueprintVisible: PropTypes.func,
  setModalDeleteBlueprintName: PropTypes.func,
  setModalDeleteBlueprintId: PropTypes.func,
  setModalExportBlueprintVisible: PropTypes.func,
  setModalExportBlueprintName: PropTypes.func,
  setModalExportBlueprintContents: PropTypes.func,
  fetchingModalExportBlueprintContents: PropTypes.func,
  setModalManageSourcesVisible: PropTypes.func,
  fetchingModalManageSourcesContents: PropTypes.func,
  fetchingBlueprints: PropTypes.func,
  blueprints: PropTypes.arrayOf(PropTypes.object),
  exportBlueprint: PropTypes.shape({
    contents: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    visible: PropTypes.bool
  }),
  deleteBlueprint: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    visible: PropTypes.bool
  }),
  manageSources: PropTypes.shape({
    sources: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool
  }),
  blueprintSortKey: PropTypes.string,
  blueprintSortValue: PropTypes.string,
  blueprintFilters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object)
  }),
  blueprintsSortSetValue: PropTypes.func,
  blueprintsFilterAddValue: PropTypes.func,
  blueprintsFilterRemoveValue: PropTypes.func,
  blueprintsFilterClearValues: PropTypes.func,
  blueprintsError: PropTypes.shape({
    message: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string
  }),
  blueprintsLoading: PropTypes.bool,
  startCompose: PropTypes.func,
  intl: intlShape.isRequired,
  imageTypes: PropTypes.arrayOf(PropTypes.object)
};

BlueprintsPage.defaultProps = {
  deletingBlueprint: function() {},
  setModalDeleteBlueprintVisible: function() {},
  setModalDeleteBlueprintName: function() {},
  setModalDeleteBlueprintId: function() {},
  setModalExportBlueprintVisible: function() {},
  setModalExportBlueprintName: function() {},
  setModalExportBlueprintContents: function() {},
  fetchingModalExportBlueprintContents: function() {},
  setModalManageSourcesVisible: function() {},
  fetchingModalManageSourcesContents: function() {},
  fetchingBlueprints: function() {},
  blueprints: [],
  exportBlueprint: {},
  deleteBlueprint: {},
  manageSources: {},
  blueprintSortKey: "",
  blueprintSortValue: "",
  blueprintFilters: {},
  blueprintsSortSetValue: function() {},
  blueprintsFilterAddValue: function() {},
  blueprintsFilterRemoveValue: function() {},
  blueprintsFilterClearValues: function() {},
  blueprintsError: {},
  blueprintsLoading: false,
  startCompose: function() {},
  imageTypes: []
};

const makeMapStateToProps = () => {
  const getSortedBlueprints = makeGetSortedBlueprints();
  const getFilteredBlueprints = makeGetFilteredBlueprints();
  const mapStateToProps = state => {
    if (getSortedBlueprints(state) !== undefined) {
      return {
        exportBlueprint: state.modals.exportBlueprint,
        deleteBlueprint: state.modals.deleteBlueprint,
        imageTypes: state.composes.composeTypes,
        manageSources: state.modals.manageSources,
        blueprints: getFilteredBlueprints(state, getSortedBlueprints(state)),
        blueprintSortKey: state.sort.blueprints.key,
        blueprintSortValue: state.sort.blueprints.value,
        blueprintFilters: state.filter.blueprints,
        blueprintsError: state.blueprints.errorState,
        blueprintsLoading: state.blueprints.fetchingBlueprints
      };
    }
    return {
      exportBlueprint: state.modals.exportBlueprint,
      deleteBlueprint: state.modals.deleteBlueprint,
      imageTypes: state.composes.composeTypes,
      manageSources: state.modals.manageSources,
      blueprints: state.blueprints.blueprintList,
      blueprintSortKey: state.sort.blueprints.key,
      blueprintSortValue: state.sort.blueprints.value,
      blueprintFilters: state.filter.blueprints,
      blueprintsError: state.blueprints.errorState,
      blueprintsLoading: state.blueprints.fetchingBlueprints
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  fetchingModalExportBlueprintContents: modalBlueprintName => {
    dispatch(fetchingModalExportBlueprintContents(modalBlueprintName));
  },
  fetchingBlueprints: () => {
    dispatch(fetchingBlueprints());
  },
  setModalExportBlueprintName: modalBlueprintName => {
    dispatch(setModalExportBlueprintName(modalBlueprintName));
  },
  setModalExportBlueprintContents: modalBlueprintContents => {
    dispatch(setModalExportBlueprintContents(modalBlueprintContents));
  },
  setModalExportBlueprintVisible: modalVisible => {
    dispatch(setModalExportBlueprintVisible(modalVisible));
  },
  setModalDeleteBlueprintName: modalBlueprintName => {
    dispatch(setModalDeleteBlueprintName(modalBlueprintName));
  },
  setModalDeleteBlueprintId: modalBlueprintId => {
    dispatch(setModalDeleteBlueprintId(modalBlueprintId));
  },
  setModalDeleteBlueprintVisible: modalVisible => {
    dispatch(setModalDeleteBlueprintVisible(modalVisible));
  },
  fetchingModalManageSourcesContents: () => {
    dispatch(fetchingModalManageSourcesContents());
  },
  setModalManageSourcesVisible: modalVisible => {
    dispatch(setModalManageSourcesVisible(modalVisible));
  },
  deletingBlueprint: blueprint => {
    dispatch(deletingBlueprint(blueprint));
  },
  blueprintsSortSetKey: key => {
    dispatch(blueprintsSortSetKey(key));
  },
  blueprintsSortSetValue: value => {
    dispatch(blueprintsSortSetValue(value));
  },
  blueprintsFilterAddValue: value => {
    dispatch(blueprintsFilterAddValue(value));
  },
  blueprintsFilterRemoveValue: value => {
    dispatch(blueprintsFilterRemoveValue(value));
  },
  blueprintsFilterClearValues: value => {
    dispatch(blueprintsFilterClearValues(value));
  },
  startCompose: (blueprintName, composeType) => {
    dispatch(startCompose(blueprintName, composeType));
  }
});

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(injectIntl(BlueprintsPage));
