import React from "react";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { DataList, DataListItem, DataListItemRow, DataListCell, DataListItemCells } from "@patternfly/react-core";
import { PficonTemplateIcon } from "@patternfly/react-icons";
import Link from "../Link/Link";
import CreateImageUpload from "../Wizard/CreateImageUpload";
import DeleteBlueprint from "../Modal/DeleteBlueprint";
import ExportBlueprint from "../Modal/ExportBlueprint";

const messages = defineMessages({
  actions: {
    defaultMessage: "actions",
  },
});

class BlueprintsDataList extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const { blueprints, layout, ariaLabel } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <DataList aria-label={ariaLabel} className="cc-m-nowrap-on-lg">
        {blueprints.map((blueprint) => (
          <DataListItem key={blueprint.name} data-blueprint={blueprint.name} aria-labelledby={`${blueprint.name}-name`}>
            <DataListItemRow>
              <div className="cc-c-data-list__item-icon">
                <PficonTemplateIcon />
              </div>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary" width={2}>
                    <Link to={`/blueprint/${blueprint.name}`}>
                      <strong id={`${blueprint.name}-name`}>{blueprint.name}</strong>
                    </Link>
                  </DataListCell>,
                  <DataListCell key="secondary" width={3} data-description>
                    {blueprint.description}
                  </DataListCell>,
                ]}
              />
              <div className="pf-c-data-list__item-action cc-m-nowrap">
                <Link to={`/edit/${blueprint.name}`} className="btn btn-default">
                  <FormattedMessage defaultMessage="Edit packages" />
                </Link>
                <CreateImageUpload blueprint={blueprint} layout={layout} />
                <div className="dropdown pull-right dropdown-kebab-pf">
                  <button
                    className="btn btn-link dropdown-toggle"
                    type="button"
                    id={`${blueprint.name}-kebab`}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                    aria-label={`${blueprint.name} ${formatMessage(messages.actions)}`}
                  >
                    <span className="fa fa-ellipsis-v" />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby={`${blueprint.name}-kebab`}>
                    <li>
                      <ExportBlueprint blueprint={blueprint} />
                    </li>
                    <li>
                      <DeleteBlueprint blueprint={blueprint} />
                    </li>
                  </ul>
                </div>
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
  layout: PropTypes.shape({
    setNotifications: PropTypes.func,
  }),
  ariaLabel: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

BlueprintsDataList.defaultProps = {
  blueprints: [],
  layout: {},
  ariaLabel: "",
};

export default injectIntl(BlueprintsDataList);
