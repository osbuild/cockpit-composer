import React from "react";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import {
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListItemCells,
} from "@patternfly/react-core";
import { PficonTemplateIcon } from "@patternfly/react-icons";
import Link from "../Link/Link";
import CreateImageWizard from "../Wizard/CreateImageWizard";
import DeleteBlueprint from "../Modal/DeleteBlueprint";
import ExportBlueprint from "../Modal/ExportBlueprint";
import DropdownKebab from "../Dropdown/DropdownKebab";

class BlueprintsDataList extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const { blueprints, ariaLabel } = this.props;

    const dropdownItems = (blueprint) => [
      <li key="export">
        <ExportBlueprint blueprint={blueprint} />
      </li>,
      <li key="delete">
        <DeleteBlueprint blueprint={blueprint} />
      </li>,
    ];

    return (
      <DataList aria-label={ariaLabel} className="cc-m-nowrap-on-lg">
        {blueprints.map((blueprint) => (
          <DataListItem
            key={blueprint.name}
            data-blueprint={blueprint.name}
            aria-labelledby={`${blueprint.name}-name`}
          >
            <DataListItemRow>
              <div className="cc-c-data-list__item-icon">
                <PficonTemplateIcon />
              </div>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary" width={2}>
                    <Link to={`/blueprint/${blueprint.name}`}>
                      <strong id={`${blueprint.name}-name`}>
                        {blueprint.name}
                      </strong>
                    </Link>
                  </DataListCell>,
                  <DataListCell key="secondary" width={3} data-description>
                    {blueprint.description}
                  </DataListCell>,
                ]}
              />
              <div className="pf-c-data-list__item-action cc-m-nowrap">
                <CreateImageWizard blueprint={blueprint} />
                <DropdownKebab dropdownItems={dropdownItems(blueprint)} />
              </div>
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    );
  }
}

BlueprintsDataList.propTypes = {
  blueprints: PropTypes.arrayOf(PropTypes.object),
  ariaLabel: PropTypes.string,
};

BlueprintsDataList.defaultProps = {
  blueprints: [],
  ariaLabel: "",
};

export default injectIntl(BlueprintsDataList);
