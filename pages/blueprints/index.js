import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, EmptyStatePrimary } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import Layout from "../../components/Layout/Layout";
import BlueprintsDataList from "../../components/ListView/BlueprintsDataList";
import CreateBlueprint from "../../components/Modal/CreateBlueprint";
import EmptyState from "../../components/EmptyState/EmptyState";
import EmptyStateInactive from "../../components/EmptyState/EmptyStateInactive";
import Loading from "../../components/Loading/Loading";
import BlueprintsToolbar from "../../components/Toolbar/BlueprintsToolbar";
import { fetchingBlueprints } from "../../core/actions/blueprints";
import { fetchingModalManageSourcesContents } from "../../core/actions/modals";
import { blueprintsSortSetKey, blueprintsSortSetValue } from "../../core/actions/sort";
import {
  blueprintsFilterAddValue,
  blueprintsFilterRemoveValue,
  blueprintsFilterClearValues,
} from "../../core/actions/filter";
import { makeGetSortedBlueprints, makeGetFilteredBlueprints } from "../../core/selectors";

const messages = defineMessages({
  blueprintsTitle: {
    defaultMessage: "Blueprints",
  },
  emptyMessage: {
    defaultMessage:
      "Create a blueprint to define the contents that will be included in the images you create. " +
      "Images can be produced in a variety of output formats.",
  },
  emptyTitle: {
    defaultMessage: "No blueprints",
  },
  errorGenericTitle: {
    defaultMessage: "An error occurred",
  },
  noResultsMessage: {
    defaultMessage: "Modify your filter criteria to get results.",
  },
  noResultsTitle: {
    defaultMessage: "No results match the filter criteria",
  },
});

class BlueprintsPage extends React.Component {
  constructor(props) {
    super(props);
    this.setNotifications = this.setNotifications.bind(this);
  }

  componentDidMount() {
    const { formatMessage } = this.props.intl;
    document.title = formatMessage(messages.blueprintsTitle);

    if (this.props.blueprintsLoading === true) {
      this.props.fetchingBlueprints();
      this.props.fetchingModalManageSourcesContents();
    }
  }

  setNotifications() {
    this.layout.setNotifications();
  }

  render() {
    const {
      blueprints,
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
    } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <Layout className="container-fluid" ref={(c) => (this.layout = c)}>
        <BlueprintsToolbar
          blueprintNames={blueprints.map((blueprint) => blueprint.present.id)}
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
          (blueprintsError === undefined && (
            <EmptyStateInactive fetchingBlueprints={this.props.fetchingBlueprints} />
          )) ||
          (blueprintsError !== null &&
            (((blueprintsError.problem === "access-denied" || blueprintsError.message === "not-found") && (
              <EmptyStateInactive fetchingBlueprints={this.props.fetchingBlueprints} />
            )) || (
              <EmptyState
                title={formatMessage(messages.errorGenericTitle)}
                icon={ExclamationCircleIcon}
                message={blueprintsError.message}
              />
            ))) ||
          (blueprints.length > 0 && (
            <BlueprintsDataList
              blueprints={blueprints.map((blueprint) => blueprint.present)}
              setNotifications={this.setNotifications}
              layout={this.layout}
              ariaLabel={formatMessage(messages.blueprintsTitle)}
            />
          )) ||
          (blueprintFilters.filterValues.length === 0 && (
            <EmptyState title={formatMessage(messages.emptyTitle)} message={formatMessage(messages.emptyMessage)}>
              <EmptyStatePrimary>
                <CreateBlueprint blueprintNames={blueprints.map((blueprint) => blueprint.present.id)} />
              </EmptyStatePrimary>
            </EmptyState>
          )) || (
            <EmptyState
              title={formatMessage(messages.noResultsTitle)}
              message={formatMessage(messages.noResultsMessage)}
            >
              <EmptyStatePrimary>
                <Button variant="link" type="button" onClick={blueprintsFilterClearValues}>
                  <FormattedMessage defaultMessage="Clear all filters" />
                </Button>
              </EmptyStatePrimary>
            </EmptyState>
          )}
      </Layout>
    );
  }
}

BlueprintsPage.propTypes = {
  fetchingModalManageSourcesContents: PropTypes.func,
  fetchingBlueprints: PropTypes.func,
  blueprints: PropTypes.arrayOf(PropTypes.object),
  manageSources: PropTypes.shape({
    fetchingSources: PropTypes.bool,
    sources: PropTypes.objectOf(PropTypes.object),
    error: PropTypes.object,
  }),
  blueprintSortKey: PropTypes.string,
  blueprintSortValue: PropTypes.string,
  blueprintFilters: PropTypes.shape({
    defaultFilterType: PropTypes.string,
    filterTypes: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object),
  }),
  blueprintsSortSetValue: PropTypes.func,
  blueprintsFilterAddValue: PropTypes.func,
  blueprintsFilterRemoveValue: PropTypes.func,
  blueprintsFilterClearValues: PropTypes.func,
  blueprintsError: PropTypes.shape({
    message: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string,
  }),
  blueprintsLoading: PropTypes.bool,
  intl: intlShape.isRequired,
};

BlueprintsPage.defaultProps = {
  fetchingModalManageSourcesContents() {},
  fetchingBlueprints() {},
  blueprints: [],
  manageSources: {},
  blueprintSortKey: "",
  blueprintSortValue: "",
  blueprintFilters: {},
  blueprintsSortSetValue() {},
  blueprintsFilterAddValue() {},
  blueprintsFilterRemoveValue() {},
  blueprintsFilterClearValues() {},
  blueprintsError: {},
  blueprintsLoading: false,
};

const makeMapStateToProps = () => {
  const getSortedBlueprints = makeGetSortedBlueprints();
  const getFilteredBlueprints = makeGetFilteredBlueprints();
  const mapStateToProps = (state) => {
    if (getSortedBlueprints(state) !== undefined) {
      return {
        manageSources: state.modals.manageSources,
        blueprints: getFilteredBlueprints(state, getSortedBlueprints(state)),
        blueprintSortKey: state.sort.blueprints.key,
        blueprintSortValue: state.sort.blueprints.value,
        blueprintFilters: state.filter.blueprints,
        blueprintsError: state.blueprints.errorState,
        blueprintsLoading: state.blueprints.fetchingBlueprints,
      };
    }
    return {
      manageSources: state.modals.manageSources,
      blueprints: state.blueprints.blueprintList,
      blueprintSortKey: state.sort.blueprints.key,
      blueprintSortValue: state.sort.blueprints.value,
      blueprintFilters: state.filter.blueprints,
      blueprintsError: state.blueprints.errorState,
      blueprintsLoading: state.blueprints.fetchingBlueprints,
    };
  };

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  fetchingBlueprints: () => {
    dispatch(fetchingBlueprints());
  },
  fetchingModalManageSourcesContents: () => {
    dispatch(fetchingModalManageSourcesContents());
  },
  blueprintsSortSetKey: (key) => {
    dispatch(blueprintsSortSetKey(key));
  },
  blueprintsSortSetValue: (value) => {
    dispatch(blueprintsSortSetValue(value));
  },
  blueprintsFilterAddValue: (value) => {
    dispatch(blueprintsFilterAddValue(value));
  },
  blueprintsFilterRemoveValue: (value) => {
    dispatch(blueprintsFilterRemoveValue(value));
  },
  blueprintsFilterClearValues: (value) => {
    dispatch(blueprintsFilterClearValues(value));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(injectIntl(BlueprintsPage));
