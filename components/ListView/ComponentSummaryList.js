import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import {
  Split,
  SplitItem,
  Button,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListItemCells
} from "@patternfly/react-core";
import ComponentTypeIcons from "./ComponentTypeIcons";

const messages = defineMessages({
  dependencies: {
    defaultMessage: "Dependencies"
  }
});

class ComponentSummaryList extends React.Component {
  constructor() {
    super();
    this.state = { showAll: false };
  }

  handleShowAll(event) {
    // the user clicked a list item in the blueprint contents area to expand or collapse
    this.setState(prevState => ({ showAll: !prevState.showAll }));
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const listItems = this.state.showAll ? this.props.listItems : this.props.listItems.slice(0, 5);
    const { formatMessage } = this.props.intl;
    return (
      <div className="cc-component-summary__deps pf-l-flex pf-m-column">
        <Split gutter="md" className="pf-m-spacer-sm">
          <SplitItem isFilled>
            <strong>
              <FormattedMessage defaultMessage="Dependencies" />
            </strong>
            <span className="badge">{this.props.listItems.length}</span>
          </SplitItem>
          <SplitItem>
            <Button variant="link" isInline onClick={e => this.handleShowAll(e)}>
              {this.state.showAll ? (
                <FormattedMessage defaultMessage="Show Less" />
              ) : (
                <FormattedMessage defaultMessage="Show All" />
              )}
            </Button>
          </SplitItem>
        </Split>
        <DataList aria-label={formatMessage(messages.dependencies)} className="cc-m-compact">
          {listItems.map(listItem => (
            <DataListItem key={listItem.name} aria-labelledby={`${this.props.parent}-${listItem.name}`}>
              <DataListItemRow>
                <div className="cc-c-data-list__item-icon">
                  <ComponentTypeIcons
                    componentType={listItem.ui_type}
                    componentInBlueprint={listItem.inBlueprint}
                    isSelected={listItem.userSelected}
                  />
                </div>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="primary" id={`${this.props.parent}-${listItem.name}`}>
                      {listItem.name}
                    </DataListCell>
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </div>
    );
  }
}

ComponentSummaryList.propTypes = {
  listItems: PropTypes.arrayOf(PropTypes.object),
  parent: PropTypes.string,
  intl: intlShape.isRequired
};

ComponentSummaryList.defaultProps = {
  listItems: [],
  parent: ""
};

export default injectIntl(ComponentSummaryList);
