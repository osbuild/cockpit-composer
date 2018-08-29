/* global $ */

import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import Link from '../../components/Link';

class BlueprintListView extends React.PureComponent {
  constructor() {
    super();
  }

  render() {
    const { blueprints } = this.props; // eslint-disable-line no-use-before-define
    return (
      <div className="list-group list-view-pf list-view-pf-view">
        {blueprints.map((blueprint, i) =>
          <div className="list-group-item" key={i} data-blueprint={blueprint.name}>
            <div className="list-view-pf-actions">
              <Link to={`/edit/${blueprint.name}`} className="btn btn-default">
                <FormattedMessage defaultMessage="Edit Blueprint" />
              </Link>
              {(blueprint.modules.length === 0 && blueprint.packages.length === 0) &&
                <button type="button" className="btn btn-default" disabled="disabled">
                  <FormattedMessage defaultMessage="Create Image" />
                </button>
              ||
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={(e) => this.props.handleShowModalCreateImage(e, blueprint)}
                >
                  <FormattedMessage defaultMessage="Create Image" />
                </button>
              }
              <div className="dropdown pull-right dropdown-kebab-pf">
                <button
                  className="btn btn-link dropdown-toggle"
                  type="button"
                  id="dropdownKebabRight9"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                ><span className="fa fa-ellipsis-v"></span></button>
                <ul
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="dropdownKebabRight9"
                >
                  {(blueprint.modules.length === 0 && blueprint.packages.length === 0) &&
                    <li className="disabled">
                      <a aria-disabled="true">
                        <FormattedMessage defaultMessage="Export" />
                      </a>
                    </li>
                    ||
                    <li>
                      <a href="#" onClick={(e) => this.props.handleShowModalExport(e, blueprint.name)}>
                        <FormattedMessage defaultMessage="Export" />
                      </a>
                    </li>
                  }
                  <li>
                    <a href="#" onClick={(e) => this.props.handleShowModalDelete(e, blueprint)}>
                      <FormattedMessage defaultMessage="Delete" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="list-view-pf-main-info">
              <span className="pficon pficon-template list-pf-icon-small"></span>
              <div className="list-view-pf-body">
                <div className="list-view-pf-description">
                  <div className="list-group-item-heading">
                    <Link to={`/blueprint/${blueprint.name}`}>{blueprint.name}</Link>
                  </div>
                  <div className="list-group-item-text">
                    {blueprint.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

BlueprintListView.propTypes = {
  handleShowModalDelete: PropTypes.func,
  blueprints: PropTypes.array,
  setNotifications: PropTypes.func,
  handleShowModalExport: PropTypes.func,
  handleShowModalCreateImage: PropTypes.func,
};

export default BlueprintListView;
