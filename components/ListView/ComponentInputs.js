import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListItemCells,
  Tooltip,
  TooltipPosition,
} from "@patternfly/react-core";
import ComponentTypeIcons from "./ComponentTypeIcons";

const messages = defineMessages({
  hideDetails: {
    defaultMessage: "Hide details",
  },
  showDetails: {
    defaultMessage: "Show details and more options",
  },
  addComponent: {
    defaultMessage: "Add latest version",
  },
  removeComponent: {
    defaultMessage: "Remove component from blueprint",
  },
});

// eslint-disable-next-line react/prefer-stateless-function
class ComponentInputs extends React.Component {
  render() {
    const { components, label } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <DataList aria-label={label} data-list="inputs" className="cc-m-compact">
        {components.map((component) => (
          <DataListItem
            key={component.name}
            aria-labelledby={`${component.name}-input`}
            className={component.active ? "active" : ""}
            data-input={component.name}
          >
            <DataListItemRow>
              <div className="cc-c-data-list__item-icon">
                <ComponentTypeIcons
                  componentType={component.ui_type}
                  componentInBlueprint={component.inBlueprint}
                  isSelected={component.userSelected}
                />
              </div>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary">
                    <div>
                      <Tooltip
                        position={TooltipPosition.top}
                        content={
                          component.active ? formatMessage(messages.hideDetails) : formatMessage(messages.showDetails)
                        }
                      >
                        <a href="#" onClick={(e) => this.props.handleComponentDetails(e, component)}>
                          <strong id={`${component.name}-input`} data-input-name>
                            {component.name}
                          </strong>
                        </a>
                      </Tooltip>
                    </div>
                    <div data-input-description>{component.summary}</div>
                  </DataListCell>,
                ]}
              />
              <div className="pf-c-data-list__item-action">
                {(component.inBlueprint === true && component.userSelected === true && (
                  <Tooltip position={TooltipPosition.top} content={formatMessage(messages.removeComponent)}>
                    <a
                      href="#"
                      className="btn btn-link"
                      onClick={(e) => this.props.handleRemoveComponent(e, component.name)}
                    >
                      <span className="fa fa-minus" />
                    </a>
                  </Tooltip>
                )) || (
                  <Tooltip
                    position={TooltipPosition.top}
                    content={
                      <div>
                        {formatMessage(messages.addComponent)}
                        <br />({component.version})
                      </div>
                    }
                  >
                    <a
                      href="#"
                      className="btn btn-link"
                      onClick={(e) => this.props.handleAddComponent(e, component, "*")}
                    >
                      <span className="fa fa-plus" />
                    </a>
                  </Tooltip>
                )}
              </div>
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    );
  }
}

ComponentInputs.propTypes = {
  components: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.string,
  handleComponentDetails: PropTypes.func,
  handleAddComponent: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  intl: intlShape.isRequired,
};

ComponentInputs.defaultProps = {
  components: [],
  label: "",
  handleComponentDetails() {},
  handleAddComponent() {},
  handleRemoveComponent() {},
};

export default injectIntl(ComponentInputs);
