import React from "react";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { Breadcrumb, BreadcrumbItem, Tabs, Tab, Tooltip, TooltipPosition } from "@patternfly/react-core";
import { connect } from "react-redux";
import { TimesIcon } from "@patternfly/react-icons";
import ComponentTypeIcons from "./ComponentTypeIcons";
import DependencyListView from "./DependencyListView";
import LabelWithBadge from "./LabelWithBadge";
import Loading from "../Loading/Loading";
import EmptyState from "../EmptyState/EmptyState";
import { fetchingInputDetails, fetchingInputDeps } from "../../core/actions/inputs";

const messages = defineMessages({
  details: {
    defaultMessage: "Details",
  },
  dependencies: {
    defaultMessage: "Dependencies",
  },
  hideDetails: {
    defaultMessage: "Hide details",
  },
  removeFromBlueprint: {
    defaultMessage: "Remove from blueprint",
  },
  noDepsTitle: {
    defaultMessage: "No dependencies",
  },
  noDepsMessage: {
    defaultMessage: "This component has no dependencies.",
  },
});

class ComponentDetailsView extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedBuildIndex: undefined,
      savedVersion: undefined,
    };
    this.setBuildIndex = this.setBuildIndex.bind(this);
    this.handleVersionSelect = this.handleVersionSelect.bind(this);
    this.handleChildComponent = this.handleChildComponent.bind(this);
    this.handleParentComponent = this.handleParentComponent.bind(this);
    this.handleCloseDetails = this.handleCloseDetails.bind(this);
    this.handleSelectedBuildDeps = this.handleSelectedBuildDeps.bind(this);
  }

  componentDidMount() {
    this.props.fetchingInputDetails(this.props.component);
    if (this.props.handleUpdateComponent) {
      this.setBuildIndex();
    } else if (this.props.dependencies === undefined) {
      this.props.fetchingInputDeps(this.props.component);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.component.name !== prevProps.component.name) {
      this.props.fetchingInputDetails(this.props.component);
      this.setState({ selectedBuildIndex: undefined }); // eslint-disable-line react/no-did-update-set-state
    }
    if (this.props.handleUpdateComponent) {
      this.setBuildIndex();
    } else if (this.props.dependencies === undefined) {
      this.props.fetchingInputDeps(this.props.component);
    }
  }

  handleVersionSelect(event) {
    this.setState({ selectedBuildIndex: event.target.value });
    this.handleSelectedBuildDeps(event.target.value);
  }

  handleSelectedBuildDeps(index) {
    const { component } = this.props;
    // update dependencies for selected component build
    const selectedComponentBuild = {
      ...component,
      release: component.builds[index].release,
      version: component.builds[index].depsolveVersion,
    };
    this.props.fetchingInputDeps(selectedComponentBuild);
  }

  handleParentComponent(event, component, index) {
    // user clicks a node in the breadcrumb
    this.props.setSelectedInput(component);
    const updatedParents = this.props.componentParent.slice(0, index);
    this.props.setSelectedInputParent(updatedParents);
    event.preventDefault();
    event.stopPropagation();
  }

  handleChildComponent(event, component) {
    // user clicks a list item in the dependencies tab
    this.props.setSelectedInput(component);
    const updatedParents = this.props.componentParent.concat(this.props.component);
    this.props.setSelectedInputParent(updatedParents);
    event.preventDefault();
    event.stopPropagation();
  }

  handleCloseDetails(event) {
    this.props.clearSelectedInput();
    event.preventDefault();
    event.stopPropagation();
  }

  setBuildIndex() {
    // if component is not in the blueprint, then default to the first option ("*")
    // if component is in the blueprint, then set selectedBuildIndex to the object with the current selected version
    const { component, selectedComponents } = this.props;
    let index = this.state.selectedBuildIndex;
    if (component.builds !== undefined && index === undefined) {
      if (component.userSelected === true) {
        const selectedVersion = selectedComponents.find((selected) => selected.name === component.name).version;
        const selectedBuild = component.builds.filter((obj) => obj.version === selectedVersion)[0];
        index = component.builds.indexOf(selectedBuild);
        if (index === -1) {
          index = 0;
        }
        this.setState({ selectedBuildIndex: index });
        this.setState({ savedVersion: selectedVersion });
        this.handleSelectedBuildDeps(index);
      } else {
        this.setState({ selectedBuildIndex: 0 });
        this.handleSelectedBuildDeps(0);
      }
    }
  }

  render() {
    const {
      component,
      dependencies,
      componentParent,
      blueprint,
      handleAddComponent,
      handleUpdateComponent,
      handleRemoveComponent,
      handleDepListItem,
    } = this.props;
    const { selectedBuildIndex } = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <div className="cmpsr-panel__body cmpsr-panel__body--main">
        <div className="cmpsr-header">
          {(componentParent.length > 0 && (
            <Breadcrumb>
              <BreadcrumbItem>
                <a href="#" onClick={(e) => this.handleCloseDetails(e)}>
                  <FormattedMessage
                    defaultMessage="Back to {blueprint}"
                    values={{
                      blueprint,
                    }}
                  />
                </a>
              </BreadcrumbItem>
              {componentParent.map((parent, i) => (
                <BreadcrumbItem key={parent.name}>
                  <a href="#" onClick={(e) => this.handleParentComponent(e, parent, i)}>
                    {parent.name}
                  </a>
                </BreadcrumbItem>
              ))}
              <li />
            </Breadcrumb>
          )) || (
            <Breadcrumb>
              <BreadcrumbItem>
                <a href="#" onClick={(e) => this.handleCloseDetails(e)}>
                  <FormattedMessage
                    defaultMessage="Back to {blueprint}"
                    values={{
                      blueprint,
                    }}
                  />
                </a>
              </BreadcrumbItem>
            </Breadcrumb>
          )}
          <div className="cmpsr-header__actions">
            <ul className="list-inline">
              {handleAddComponent !== undefined &&
                ((component.inBlueprint && !component.userSelected) || !component.inBlueprint) && (
                  <li>
                    <button
                      className="btn btn-primary add"
                      type="button"
                      onClick={(e) => handleAddComponent(e, component, component.builds[selectedBuildIndex].version)}
                    >
                      <FormattedMessage defaultMessage="Add" />
                    </button>
                  </li>
                )}
              {handleUpdateComponent !== undefined &&
                component.inBlueprint &&
                component.userSelected &&
                component.builds !== undefined &&
                selectedBuildIndex !== undefined &&
                component.builds[selectedBuildIndex].version !== this.state.savedVersion && (
                  <li>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => handleUpdateComponent(e, component, component.builds[selectedBuildIndex].version)}
                    >
                      <FormattedMessage defaultMessage="Apply change" />
                    </button>
                  </li>
                )}
              {handleRemoveComponent !== undefined && component.inBlueprint && component.userSelected && (
                <li>
                  <Tooltip position={TooltipPosition.bottom} content={formatMessage(messages.removeFromBlueprint)}>
                    <button
                      className="btn btn-default"
                      type="button"
                      onClick={(e) => handleRemoveComponent(e, component.name)}
                    >
                      <FormattedMessage defaultMessage="Remove" />
                    </button>
                  </Tooltip>
                </li>
              )}
              <li>
                <Tooltip position={TooltipPosition.bottom} content={formatMessage(messages.hideDetails)}>
                  <button type="button" className="close" onClick={(e) => this.handleCloseDetails(e)}>
                    <TimesIcon />
                  </button>
                </Tooltip>
              </li>
            </ul>
          </div>
          <h3 className="cmpsr-title">
            <span>
              <ComponentTypeIcons
                componentType={component.ui_type}
                compDetails
                componentInBlueprint={component.inBlueprint}
                isSelected={component.userSelected}
              />{" "}
              {component.name}
            </span>
          </h3>
        </div>
        {handleUpdateComponent !== undefined && component.builds !== undefined && component.builds.length > 1 && (
          <div className="cmpsr-component-details__form">
            <h4>
              <FormattedMessage defaultMessage="Component options" />
            </h4>
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-3 col-md-2 control-label" htmlFor="cmpsr-compon__version-select">
                  <FormattedMessage defaultMessage="Version" />
                </label>
                <div className="col-sm-8 col-md-9">
                  <select
                    id="cmpsr-compon__version-select"
                    className="form-control"
                    value={selectedBuildIndex}
                    onChange={this.handleVersionSelect}
                  >
                    {component.builds.map((build, i) => (
                      <option key={build.version} value={i}>
                        {build.version} {build.version === "*" && "(latest version)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        )}
        <div>
          <Tabs id="blueprint-tabs" defaultActiveKey="details">
            <Tab eventKey="details" title={formatMessage(messages.details)}>
              <h4 className="cmpsr-title">{component.summary}</h4>
              <p>{component.description}</p>
              <dl className="dl-horizontal">
                <dt>
                  <FormattedMessage defaultMessage="Type" />
                </dt>
                <dd>{component.ui_type}</dd>
                <dt>
                  <FormattedMessage defaultMessage="Version" />
                </dt>
                {((component.builds === undefined || selectedBuildIndex === undefined) && (
                  <dd>{component.version}</dd>
                )) || <dd>{component.builds[selectedBuildIndex].depsolveVersion}</dd>}
                <dt>
                  <FormattedMessage defaultMessage="Release" />
                </dt>
                {((component.builds === undefined || selectedBuildIndex === undefined) && (
                  <dd>{component.release}</dd>
                )) || <dd>{component.builds[selectedBuildIndex].release}</dd>}
                <dt>
                  <FormattedMessage defaultMessage="URL" />
                </dt>
                {(component.homepage !== null && (
                  <dd>
                    <a target="_blank" rel="noopener noreferrer" href={component.homepage}>
                      {component.homepage}
                    </a>
                  </dd>
                )) || <dd>&nbsp;</dd>}
              </dl>
            </Tab>
            {(dependencies === undefined && (
              <Tab eventKey="dependencies" title={formatMessage(messages.dependencies)}>
                <Loading />
              </Tab>
            )) || (
              <Tab
                eventKey="dependencies"
                title={<LabelWithBadge title={formatMessage(messages.dependencies)} badge={dependencies.length} />}
              >
                {(dependencies.length === 0 && (
                  <EmptyState
                    title={formatMessage(messages.noDepsTitle)}
                    message={formatMessage(messages.noDepsMessage)}
                  />
                )) || (
                  <DependencyListView
                    id="cmpsr-component-dependencies"
                    listItems={dependencies}
                    noEditComponent
                    handleComponentDetails={this.handleChildComponent}
                    componentDetailsParent={component}
                    fetchDetails={handleDepListItem}
                  />
                )}
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    );
  }
}

ComponentDetailsView.propTypes = {
  component: PropTypes.shape({
    arch: PropTypes.string,
    epoch: PropTypes.number,
    homepage: PropTypes.string,
    inBlueprint: PropTypes.bool,
    name: PropTypes.string,
    release: PropTypes.string,
    summary: PropTypes.string,
    description: PropTypes.string,
    ui_type: PropTypes.string,
    userSelected: PropTypes.bool,
    version: PropTypes.string,
    builds: PropTypes.arrayOf(PropTypes.object),
  }),
  selectedComponents: PropTypes.arrayOf(PropTypes.object),
  blueprint: PropTypes.string,
  componentParent: PropTypes.arrayOf(PropTypes.object),
  handleRemoveComponent: PropTypes.func,
  handleAddComponent: PropTypes.func,
  handleUpdateComponent: PropTypes.func,
  handleDepListItem: PropTypes.func,
  fetchingInputDeps: PropTypes.func,
  fetchingInputDetails: PropTypes.func,
  dependencies: PropTypes.arrayOf(PropTypes.object),
  setSelectedInput: PropTypes.func,
  setSelectedInputParent: PropTypes.func,
  clearSelectedInput: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

ComponentDetailsView.defaultProps = {
  component: {},
  selectedComponents: [],
  blueprint: "",
  componentParent: [],
  handleRemoveComponent: undefined,
  handleAddComponent: undefined,
  handleUpdateComponent: undefined,
  handleDepListItem() {},
  fetchingInputDeps() {},
  fetchingInputDetails() {},
  dependencies: undefined,
  setSelectedInput() {},
  setSelectedInputParent() {},
  clearSelectedInput() {},
};

const mapDispatchToProps = (dispatch) => ({
  fetchingInputDetails: (component) => {
    dispatch(fetchingInputDetails(component));
  },
  fetchingInputDeps: (component) => {
    dispatch(fetchingInputDeps(component));
  },
});

export default connect(null, mapDispatchToProps)(injectIntl(ComponentDetailsView));
