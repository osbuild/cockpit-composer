import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Tabs, Tab } from "patternfly-react";
import ListView from "../../components/ListView/ListView";
import ListItemComponents from "../../components/ListView/ListItemComponents";
import DependencyListView from "../../components/ListView/DependencyListView";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
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

class BlueprintContents extends React.Component {
  constructor() {
    super();
    this.state = { activeTab: "Components" };
  }

  render() {
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
    } = this.props;

    const { formatMessage } = this.props.intl;

    return (
      <div>
        {(fetchingState === true && <Loading />) ||
          ((errorState !== undefined && (
            <EmptyState
              title={formatMessage(messages.emptyStateErrorTitle)}
              message={formatMessage(messages.emptyStateErrorMessage)}
            />
          )) ||
            ((components.length === 0 && filterValues.length === 0 && <div>{this.props.children}</div>) || (
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
                      {components.map((listItem, i) => (
                        <ListItemComponents
                          listItemParent="cmpsr-blueprint__components"
                          listItem={listItem}
                          key={i}
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
  }
}

BlueprintContents.propTypes = {
  components: PropTypes.array,
  dependencies: PropTypes.array,
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  intl: intlShape.isRequired,
  noEditComponent: PropTypes.bool,
  filterClearValues: PropTypes.func,
  filterValues: PropTypes.array,
  errorState: PropTypes.object,
  fetchingState: PropTypes.bool,
  children: PropTypes.node
};

export default injectIntl(BlueprintContents);
