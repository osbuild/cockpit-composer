import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { DataList, Alert } from "@patternfly/react-core";
import { Tabs, Tab } from "patternfly-react";
import ComponentsDataListItem from "./ComponentsDataListItem";
import DependencyListView from "./DependencyListView";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import LabelWithBadge from "./LabelWithBadge";

const messages = defineMessages({
  dependenciesTabTitle: {
    defaultMessage: "Dependencies",
  },
  emptyStateErrorMessage: {
    defaultMessage: "An error occurred while trying to get blueprint contents.",
  },
  emptyStateErrorTitle: {
    defaultMessage: "An Error Occurred",
  },
  emptyStateNoResultsMessage: {
    defaultMessage: "Modify your filter criteria to get results.",
  },
  emptyStateNoResultsTitle: {
    defaultMessage: "No Results Match the Filter Criteria",
  },
  selectedTabTitle: {
    defaultMessage: "Selected Components",
  },
});

const BlueprintContents = (props) => {
  const {
    components,
    dependencies,
    handleComponentDetails,
    handleRemoveComponent,
    noEditComponent,
    filterClearValues,
    filterValues,
    errorState,
    fetchingState,
    fetchDetails,
    pastLength,
    undo,
  } = props;

  const { formatMessage } = props.intl;
  const alertAction =
    pastLength > 0 ? (
      <button className="pf-c-button pf-m-link" type="button" onClick={() => undo()}>
        <FormattedMessage defaultMessage="Undo Last Change" />
      </button>
    ) : null;

  return (
    <div>
      {(fetchingState === true && <Loading />) ||
        (components.length === 0 && filterValues.length === 0 && <div>{props.children}</div>) || (
          <Tabs id="blueprint-tabs">
            <Tab
              eventKey="selected-components"
              title={<LabelWithBadge title={formatMessage(messages.selectedTabTitle)} badge={components.length} />}
            >
              {(components.length === 0 && (
                <EmptyState
                  title={formatMessage(messages.emptyStateNoResultsTitle)}
                  message={formatMessage(messages.emptyStateNoResultsMessage)}
                >
                  <button className="btn btn-link btn-lg" type="button" onClick={() => filterClearValues([])}>
                    <FormattedMessage defaultMessage="Clear All Filters" />
                  </button>
                </EmptyState>
              )) || (
                <>
                  {Object.keys(errorState).length > 0 && (
                    <Alert
                      title={formatMessage(messages.emptyStateErrorTitle)}
                      isInline
                      variant="danger"
                      actionClose={alertAction}
                      className="pf-u-mt-md pf-u-mb-md"
                    >
                      <p>{formatMessage(messages.emptyStateErrorMessage)}</p>
                      <p>{errorState.msg}</p>
                    </Alert>
                  )}
                  <DataList
                    data-list="components"
                    aria-label={formatMessage(messages.selectedTabTitle)}
                    className="cc-m-nowrap-on-xl cc-components"
                  >
                    {components.map((listItem) => (
                      <ComponentsDataListItem
                        listItem={listItem}
                        key={listItem.name}
                        handleRemoveComponent={handleRemoveComponent}
                        handleComponentDetails={handleComponentDetails}
                        noEditComponent={noEditComponent}
                        fetchDetails={fetchDetails}
                      />
                    ))}
                  </DataList>
                </>
              )}
            </Tab>
            <Tab
              eventKey="dependencies"
              disabled={Object.keys(errorState).length > 0}
              title={
                <LabelWithBadge
                  title={formatMessage(messages.dependenciesTabTitle)}
                  badge={dependencies.length}
                  error={Object.keys(errorState).length > 0}
                />
              }
            >
              {(dependencies.length === 0 && (
                <EmptyState
                  title={formatMessage(messages.emptyStateNoResultsTitle)}
                  message={formatMessage(messages.emptyStateNoResultsMessage)}
                >
                  <button className="btn btn-link btn-lg" type="button" onClick={() => filterClearValues([])}>
                    <FormattedMessage defaultMessage="Clear All Filters" />
                  </button>
                </EmptyState>
              )) || (
                <DependencyListView
                  ariaLabel={formatMessage(messages.dependenciesTabTitle)}
                  listItems={dependencies}
                  handleComponentDetails={handleComponentDetails}
                  noEditComponent={noEditComponent}
                  fetchDetails={fetchDetails}
                />
              )}
            </Tab>
          </Tabs>
        )}
    </div>
  );
};

BlueprintContents.propTypes = {
  components: PropTypes.arrayOf(PropTypes.object),
  dependencies: PropTypes.arrayOf(PropTypes.object),
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  intl: intlShape.isRequired,
  noEditComponent: PropTypes.bool,
  filterClearValues: PropTypes.func,
  filterValues: PropTypes.arrayOf(PropTypes.object),
  errorState: PropTypes.shape({
    msg: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string,
  }),
  fetchingState: PropTypes.bool,
  fetchDetails: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  pastLength: PropTypes.number,
  undo: PropTypes.func,
};

BlueprintContents.defaultProps = {
  components: [],
  dependencies: [],
  handleComponentDetails() {},
  handleRemoveComponent() {},
  noEditComponent: false,
  filterClearValues() {},
  filterValues: [],
  errorState: {},
  fetchingState: true,
  fetchDetails() {},
  children: React.createElement("div"),
  pastLength: 0,
  undo() {},
};

export default injectIntl(BlueprintContents);
