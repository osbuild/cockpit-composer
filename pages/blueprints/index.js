import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Layout from "../../components/Layout/Layout";
import BlueprintListView from "../../components/ListView/BlueprintListView";
import CreateBlueprint from "../../components/Modal/CreateBlueprint";
import ExportBlueprint from "../../components/Modal/ExportBlueprint";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import BlueprintsToolbar from "../../components/Toolbar/BlueprintsToolbar";
import { fetchingBlueprints } from "../../core/actions/blueprints";
import {
  fetchingModalExportBlueprintContents,
  setModalExportBlueprintName,
  setModalExportBlueprintContents,
  setModalExportBlueprintVisible,
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
  errorGenericTitle: {
    defaultMessage: "An Error Occurred"
  },
  errorInactiveTitle: {
    defaultMessage: "Image Building Service is Not Active"
  },
  errorInactivePrimary: {
    defaultMessage: "Start"
  },
  errorInactiveSecondary: {
    defaultMessage: "Troubleshoot"
  },
  errorInactiveCheckbox: {
    defaultMessage: "Automatically start lorax-composer on boot"
  },
  noResultsMessage: {
    defaultMessage: "Modify your filter criteria to get results."
  },
  noResultsTitle: {
    defaultMessage: "No Results Match the Filter Criteria"
  }
});

class BlueprintsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enableService: true
    };
    this.setNotifications = this.setNotifications.bind(this);
    this.handleHideModalExport = this.handleHideModalExport.bind(this);
    this.handleShowModalExport = this.handleShowModalExport.bind(this);
    this.handleStartCompose = this.handleStartCompose.bind(this);
    this.startService = this.startService.bind(this);
    this.goToServicePage = this.goToServicePage.bind(this);
  }

  componentWillMount() {
    if (this.props.blueprintsLoading === true) {
      this.props.fetchingBlueprints();
      this.props.fetchingModalManageSourcesContents();
    }
  }

  componentDidMount() {
    document.title = this.props.intl.formatMessage(messages.blueprintsTitle);
  }

  setNotifications() {
    this.layout.setNotifications();
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

  startService(e) {
    if (!e || e.button !== 0) return;
    let argv;
    if (this.state.enableService) {
      argv = ["systemctl", "enable", "--now", "lorax-composer.socket"];
    } else {
      argv = ["systemctl", "start", "lorax-composer.socket"];
    }
    cockpit
      .spawn(argv, { superuser: "require", err: "message" })
      .then(() => this.props.fetchingBlueprints())
      .catch(err => console.error("Failed to start lorax-composer.socket:", JSON.stringify(err)));
  }

  goToServicePage(e) {
    if (!e || e.button !== 0) return;
    cockpit.jump("/system/services#/lorax-composer.service");
  }

  render() {
    const {
      blueprints,
      exportBlueprint,
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
          manageSources={manageSources}
        />
        {(blueprintsLoading === true && <Loading />) ||
          ((blueprintsError !== null &&
            ((blueprintsError.message === "not-found" && (
              <EmptyState title={formatMessage(messages.errorInactiveTitle)} icon="fa fa-exclamation-circle">
                <>
                  <div className="checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={this.state.enableService}
                        onChange={e => this.setState({ enableService: e.target.checked })}
                      />
                      {formatMessage(messages.errorInactiveCheckbox)}
                    </label>
                  </div>
                  <div className="blank-slate-pf-main-action">
                    <button className="btn btn-primary btn-lg" type="button" onClick={this.startService}>
                      {formatMessage(messages.errorInactivePrimary)}
                    </button>
                  </div>
                  <div className="blank-slate-pf-secondary-action">
                    <button className="btn btn-default" type="button" onClick={this.goToServicePage}>
                      {formatMessage(messages.errorInactiveSecondary)}
                    </button>
                  </div>
                </>
              </EmptyState>
            )) || (
              <EmptyState
                title={formatMessage(messages.errorGenericTitle)}
                icon="fa fa-exclamation-circle"
                message={blueprintsError.message}
              />
            ))) ||
            ((blueprints.length > 0 && (
              <BlueprintListView
                blueprints={blueprints.map(blueprint => blueprint.present)}
                setNotifications={this.setNotifications}
                handleShowModalExport={this.handleShowModalExport}
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
      </Layout>
    );
  }
}

BlueprintsPage.propTypes = {
  setModalExportBlueprintVisible: PropTypes.func,
  setModalExportBlueprintName: PropTypes.func,
  setModalExportBlueprintContents: PropTypes.func,
  fetchingModalExportBlueprintContents: PropTypes.func,
  fetchingModalManageSourcesContents: PropTypes.func,
  fetchingBlueprints: PropTypes.func,
  blueprints: PropTypes.arrayOf(PropTypes.object),
  exportBlueprint: PropTypes.shape({
    contents: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string,
    visible: PropTypes.bool
  }),
  manageSources: PropTypes.shape({
    fetchingSources: PropTypes.bool,
    sources: PropTypes.objectOf(PropTypes.object),
    error: PropTypes.object
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
  setModalExportBlueprintVisible: function() {},
  setModalExportBlueprintName: function() {},
  setModalExportBlueprintContents: function() {},
  fetchingModalExportBlueprintContents: function() {},
  fetchingModalManageSourcesContents: function() {},
  fetchingBlueprints: function() {},
  blueprints: [],
  exportBlueprint: {},
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
  fetchingModalManageSourcesContents: () => {
    dispatch(fetchingModalManageSourcesContents());
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
