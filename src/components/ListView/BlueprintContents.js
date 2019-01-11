import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Tabs, Tab } from "patternfly-react";
import ListView from "./ListView";
import ListItemComponents from "./ListItemComponents";
import DependencyListView from "./DependencyListView";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import LabelWithBadge from "./LabelWithBadge";

const messages = defineMessages({
  dependenciesTabTitle: {
    defaultMessage: "Dependencies"
  },
  emptyStateErrorMessage: {
    defaultMessage: "An error occurred while trying to get blueprint contents."
  },
  emptyStateErrorTitle: {
    defaultMessage: "An Error Occurred"
  },
  emptyStateNoResultsMessage: {
    defaultMessage: "Modify your filter criteria to get results."
  },
  emptyStateNoResultsTitle: {
    defaultMessage: "No Results Match the Filter Criteria"
  },
  selectedTabTitle: {
    defaultMessage: "Selected Components"
  }
});

const BlueprintContents = props => {
  const {
    components,
    dependencies,
    handleComponentDetails,
    handleRemoveComponent,
    noEditComponent,
    filterClearValues,
    filterValues,
    errorState,
    fetchingState
  } = props;

  const { formatMessage } = props.intl;

  return (
    <div>
      {(fetchingState === true && <Loading />) ||
        ((Object.keys(errorState).length && (
          <EmptyState
            title={formatMessage(messages.emptyStateErrorTitle)}
            message={formatMessage(messages.emptyStateErrorMessage)}
          />
        )) ||
          ((components.length === 0 && filterValues.length === 0 && <div>{props.children}</div>) || (
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
                  <ListView className="cmpsr-blueprint__components" stacked>
                    {components.map(listItem => (
                      <ListItemComponents
                        listItemParent="cmpsr-blueprint__components"
                        listItem={listItem}
                        key={listItem.name}
                        handleRemoveComponent={handleRemoveComponent}
                        handleComponentDetails={handleComponentDetails}
                        noEditComponent={noEditComponent}
                      />
                    ))}
                  </ListView>
                )}
              </Tab>
              <Tab
                eventKey="dependencies"
                title={
                  <LabelWithBadge title={formatMessage(messages.dependenciesTabTitle)} badge={dependencies.length} />
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
                    className="cmpsr-blueprint__dependencies"
                    listItems={dependencies}
                    handleRemoveComponent={handleRemoveComponent}
                    handleComponentDetails={handleComponentDetails}
                    noEditComponent={noEditComponent}
                  />
                )}
              </Tab>
            </Tabs>
          )))}
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
    message: PropTypes.string,
    options: PropTypes.object,
    problem: PropTypes.string,
    url: PropTypes.string
  }),
  fetchingState: PropTypes.bool,
  children: PropTypes.node
};

BlueprintContents.defaultProps = {
  components: [],
  dependencies: [],
  handleComponentDetails: function() {},
  handleRemoveComponent: function() {},
  noEditComponent: false,
  filterClearValues: function() {},
  filterValues: [],
  errorState: {},
  fetchingState: false,
  children: React.createElement("div")
};

export default injectIntl(BlueprintContents);
