import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import Link from "../Link/Link";
import CreateImage from "../Modal/CreateImage";
import DeleteBlueprint from "../Modal/DeleteBlueprint";
import ExportBlueprint from "../Modal/ExportBlueprint";

class BlueprintListView extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const { blueprints, layout } = this.props;
    return (
      <div className="list-group list-view-pf list-view-pf-view">
        {blueprints.map(blueprint => (
          <div className="list-group-item" key={blueprint.name} data-blueprint={blueprint.name}>
            <div className="list-view-pf-actions">
              <Link to={`/edit/${blueprint.name}`} className="btn btn-default">
                <FormattedMessage defaultMessage="Edit Packages" />
              </Link>
              <CreateImage blueprint={blueprint} layout={layout} />
              <div className="dropdown pull-right dropdown-kebab-pf">
                <button
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  id="dropdownKebabRight9"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  <span className="fa fa-ellipsis-v" />
                </button>
                <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight9">
                  <li>
                    <ExportBlueprint blueprint={blueprint} />
                  </li>
                  <li>
                    <DeleteBlueprint blueprint={blueprint} />
                  </li>
                </ul>
              </div>
            </div>
            <div className="list-view-pf-main-info">
              <span className="pficon pficon-template list-pf-icon list-pf-icon-small" />
              <div className="list-view-pf-body">
                <div className="list-view-pf-description">
                  <div className="list-group-item-heading">
                    <Link to={`/blueprint/${blueprint.name}`}>{blueprint.name}</Link>
                  </div>
                  <div className="list-group-item-text">{blueprint.description}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

BlueprintListView.propTypes = {
  blueprints: PropTypes.arrayOf(PropTypes.object),
  layout: PropTypes.shape({
    setNotifications: PropTypes.func
  })
};

BlueprintListView.defaultProps = {
  blueprints: [],
  layout: {}
};

export default BlueprintListView;
