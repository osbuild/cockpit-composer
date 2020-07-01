import React from "react";
import { defineMessages, injectIntl, intlShape, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import {
  DataListItem,
  DataListItemRow,
  DataListToggle,
  DataListCell,
  DataListItemCells,
  DataListContent,
} from "@patternfly/react-core";
import ComponentTypeIcons from "./ComponentTypeIcons";
import ComponentSummaryList from "./ComponentSummaryList";

const messages = defineMessages({
  details: {
    defaultMessage: "details",
  },
  actions: {
    defaultMessage: "actions",
  },
});

class ComponentsDataListItem extends React.Component {
  constructor() {
    super();
    this.state = { expanded: false };
    this.handleExpandComponent = this.handleExpandComponent.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expanded === true && this.props.listItem.dependencies === undefined) {
      this.props.fetchDetails(this.props.listItem);
    }
  }

  handleExpandComponent() {
    // the user clicked a list item in the blueprint contents area to expand or collapse
    const expandState = !this.state.expanded;
    this.setState((prevState) => ({ expanded: !prevState.expanded }));
    if (expandState === true && this.props.listItem.dependencies === undefined) {
      this.props.fetchDetails(this.props.listItem);
    }
  }

  render() {
    const { listItem, noEditComponent, handleComponentDetails, handleRemoveComponent } = this.props;
    const { expanded } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <DataListItem
        key={listItem.name}
        aria-labelledby={listItem.name}
        data-component={listItem.name}
        isExpanded={expanded}
        className="cc-component"
      >
        <DataListItemRow>
          <DataListToggle
            onClick={this.handleExpandComponent}
            isExpanded={expanded}
            id={`${listItem.name}-toggle`}
            aria-controls={`${listItem.name}-details`}
            aria-label={`${listItem.name} ${formatMessage(messages.details)}`}
          />
          <div className="cc-c-data-list__item-icon">
            <ComponentTypeIcons
              componentType={listItem.ui_type}
              componentInBlueprint={listItem.inBlueprint}
              isSelected={listItem.userSelected}
            />
          </div>
          <DataListItemCells
            dataListCells={[
              <DataListCell key="primary" className="cc-component__name">
                <div>
                  <a href="#" onClick={(e) => handleComponentDetails(e, listItem)}>
                    <strong id={listItem.name} data-component-name>
                      {listItem.name}
                    </strong>
                  </a>
                </div>
                <div>{listItem.summary}</div>
              </DataListCell>,
              <DataListCell
                key="secondary"
                className="cc-component__version pf-u-display-flex-on-xl pf-u-flex-direction-column"
              >
                <FormattedMessage defaultMessage="Version" /> <strong>{listItem.version}</strong>
              </DataListCell>,
              <DataListCell
                key="tertiary"
                className="cc-component__release pf-u-display-flex-on-xl pf-u-flex-direction-column"
              >
                <FormattedMessage defaultMessage="Release" /> <strong>{listItem.release}</strong>
              </DataListCell>,
            ]}
          />
          {noEditComponent !== true && (
            <div className="pf-c-data-list__item-action">
              <div className="dropdown pull-right dropdown-kebab-pf">
                <button
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  id={`${listItem.name}-kebab`}
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                  aria-label={`${listItem.name} ${formatMessage(messages.actions)}`}
                >
                  <span className="fa fa-ellipsis-v" />
                </button>
                <ul className="dropdown-menu dropdown-menu-right" aria-labelledby={`${listItem.name}-kebab`}>
                  <li>
                    <a href="#" onClick={(e) => handleComponentDetails(e, listItem)}>
                      <FormattedMessage defaultMessage="View" />
                    </a>
                  </li>
                  {listItem.inBlueprint && listItem.userSelected && (
                    <li>
                      <a href="#" onClick={(e) => handleRemoveComponent(e, listItem.name)}>
                        <FormattedMessage defaultMessage="Remove" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </DataListItemRow>
        <DataListContent
          aria-label={`${listItem.name}
          ${formatMessage(messages.details)}`}
          id={`${listItem.name}-details`}
          isHidden={!expanded}
        >
          <div className="pf-l-flex pf-m-column pf-m-row-on-lg">
            <div className="pf-m-flex-1">
              <div className="pf-c-content">
                <dl>
                  <dt>
                    <FormattedMessage defaultMessage="Version" />
                  </dt>
                  <dd>{listItem.version ? listItem.version : <span>&nbsp;</span>}</dd>
                  <dt>
                    <FormattedMessage defaultMessage="Release" />
                  </dt>
                  <dd>{listItem.release ? listItem.release : <span>&nbsp;</span>}</dd>
                  <dt>URL</dt>
                  {(listItem.homepage != null && (
                    <dd>
                      <a target="_blank" rel="noopener noreferrer" href={listItem.homepage}>
                        {listItem.homepage}
                      </a>
                    </dd>
                  )) || <dd>&nbsp;</dd>}
                </dl>
              </div>
            </div>
            <div className="pf-m-flex-1">
              {listItem.dependencies && <ComponentSummaryList listItems={listItem.dependencies} />}
            </div>
          </div>
        </DataListContent>
      </DataListItem>
    );
  }
}

ComponentsDataListItem.propTypes = {
  listItem: PropTypes.shape({
    arch: PropTypes.string,
    epoch: PropTypes.number,
    inBlueprint: PropTypes.bool,
    name: PropTypes.string,
    summary: PropTypes.string,
    release: PropTypes.string,
    ui_type: PropTypes.string,
    userSelected: PropTypes.bool,
    version: PropTypes.string,
    homepage: PropTypes.string,
    dependencies: PropTypes.arrayOf(PropTypes.object),
  }),
  componentDetailsParent: PropTypes.shape({
    active: PropTypes.bool,
    group_type: PropTypes.string,
    inBlueprint: PropTypes.bool,
    name: PropTypes.string,
    release: PropTypes.string,
    releaseSelected: PropTypes.string,
    summary: PropTypes.string,
    ui_type: PropTypes.string,
    userSelected: PropTypes.bool,
    version: PropTypes.string,
    versionSelected: PropTypes.string,
  }),
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  noEditComponent: PropTypes.bool,
  fetchDetails: PropTypes.func,
  intl: intlShape.isRequired,
};

ComponentsDataListItem.defaultProps = {
  listItem: {},
  componentDetailsParent: {},
  handleComponentDetails() {},
  handleRemoveComponent() {},
  noEditComponent: false,
  fetchDetails() {},
};

export default injectIntl(ComponentsDataListItem);
