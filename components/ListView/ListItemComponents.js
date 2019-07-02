import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import ComponentTypeIcons from "./ComponentTypeIcons";
import ComponentSummaryList from "./ComponentSummaryList";

class ListItemComponents extends React.Component {
  constructor() {
    super();
    this.state = { expanded: false };
  }

  componentWillReceiveProps(newProps) {
    // compare old value to new value, and if this component is getting new data,
    // then get the current expand state of the new value as it is in the old dom
    // and apply that expand state to this component
    const olditem = this.props.listItem.name;
    const newitem = newProps.listItem.name;
    const parent = this.props.listItemParent;
    if (olditem !== newitem) {
      if ($(`.${parent} [data-component="${newitem.name}"]`).hasClass("active")) {
        this.setState({ expanded: true });
      } else {
        this.setState({ expanded: false });
      }
    }
    if (this.state.expanded === true && newProps.listItem.dependencies === undefined) {
      this.props.fetchDetails(newProps.listItem);
    }
  }

  handleExpandComponent(event) {
    // the user clicked a list item in the blueprint contents area to expand or collapse
    if (!$(event.target).is("button, a, input, .fa-ellipsis-v")) {
      const expandState = !this.state.expanded;
      this.setState(prevState => ({ expanded: !prevState.expanded }));
      if (expandState === true && this.props.listItem.dependencies === undefined) {
        this.props.fetchDetails(this.props.listItem);
      }
    }
  }

  render() {
    const { listItem, noEditComponent, handleComponentDetails, handleRemoveComponent } = this.props;
    const { expanded } = this.state;
    return (
      <div className={`list-pf-item ${expanded ? "active" : ""}`} data-component={listItem.name}>
        <div className="list-pf-container" onClick={e => this.handleExpandComponent(e)} role="presentation">
          <div className="list-pf-chevron">
            <span className={`fa ${expanded ? "fa-angle-down" : "fa-angle-right"}`} />
          </div>
          <div className="list-pf-select">
            <input type="checkbox" />
          </div>
          <div className="list-pf-content list-pf-content-flex ">
            <div className="list-pf-left">
              <ComponentTypeIcons
                componentType={listItem.ui_type}
                componentInBlueprint={listItem.inBlueprint}
                isSelected={listItem.userSelected}
              />
            </div>
            <div className="list-pf-content-wrapper">
              <div className="list-pf-main-content">
                <div className="list-pf-title text-overflow-pf">
                  <a href="#" onClick={e => handleComponentDetails(e, listItem)}>
                    {listItem.name}
                  </a>
                </div>
                <div className="list-pf-description">{listItem.summary}</div>
              </div>
              <div className="list-pf-additional-content">
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  <FormattedMessage
                    defaultMessage="Version {version}"
                    values={{
                      version: <strong>{listItem.version}</strong>
                    }}
                  />
                </div>
                <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
                  <FormattedMessage
                    defaultMessage="Release {release}"
                    values={{
                      release: <strong>{listItem.release}</strong>
                    }}
                  />
                </div>
              </div>
            </div>
            {noEditComponent !== true && (
              <div className="list-pf-actions">
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
                      <a href="#" onClick={e => handleComponentDetails(e, listItem)}>
                        <FormattedMessage defaultMessage="View" />
                      </a>
                    </li>
                    {listItem.inBlueprint && listItem.userSelected && (
                      <li>
                        <a href="#" onClick={e => handleRemoveComponent(e, listItem.name)}>
                          <FormattedMessage defaultMessage="Remove" />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={`list-pf-expansion collapse ${expanded ? "in" : ""}`}>
          <div className="list-pf-container">
            <div className="list-pf-content">
              <div className="container-fluid ">
                <div className="row">
                  <div className="col-md-6">
                    <dl className="dl-horizontal clearfix">
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
                  <div className="col-md-6">
                    {listItem.dependencies && <ComponentSummaryList listItems={listItem.dependencies} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListItemComponents.propTypes = {
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
    homepage: PropTypes.arrayOf(PropTypes.string),
    dependencies: PropTypes.arrayOf(PropTypes.object)
  }),
  listItemParent: PropTypes.string,
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
    versionSelected: PropTypes.string
  }),
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  noEditComponent: PropTypes.bool,
  fetchDetails: PropTypes.func
};

ListItemComponents.defaultProps = {
  listItem: {},
  listItemParent: "",
  componentDetailsParent: {},
  handleComponentDetails: function() {},
  handleRemoveComponent: function() {},
  noEditComponent: false,
  fetchDetails: function() {}
};

export default ListItemComponents;
