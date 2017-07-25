import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-patternfly-shims';
import ListView from '../../components/ListView/ListView';
import ListItemComponents from '../../components/ListView/ListItemComponents';
import DependencyListView from '../../components/ListView/DependencyListView';

class RecipeContents extends React.Component {
  constructor() {
    super();
    this.handleTabChanged = this.handleTabChanged.bind(this);
  }

  state = {
    activeTab: 'Components',
    depsTabTitle: 'Dependencies',
  };

  componentWillReceiveProps(newProps) {
    if (newProps.dependencies.length > 0) {
      this.setState({ depsTabTitle: `Dependencies <span class="badge">${newProps.dependencies.length}</span>` });
    } else {
      this.setState({ depsTabTitle: 'Dependencies' });
    }
  }
  // Not sure why this doesn't work. The Virtual DOM seems to be updated but the actual DOM is not
  // Maybe this is due to using a web component instead of react component for tabs

  handleTabChanged(e) {
    if (this.state.activeTab !== e.detail) {
      this.setState({ activeTab: e.detail });
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { components, dependencies, handleComponentDetails, handleRemoveComponent, noEditComponent } = this.props;

    return (
      <div className="nav-tabs-pf">
        <Tabs
          key="pf-tabs"
          ref={c => {
            this.pfTabs = c;
          }}
          tabChanged={this.handleTabChanged}
        >
          <Tab
            tabTitle={`Selected Components <span class="badge">${components.length}</span>`}
            active={this.state.activeTab === 'Selected'}
          >
            <ListView className="cmpsr-recipe__components" stacked>
              {components.map((listItem, i) => (
                <ListItemComponents
                  listItemParent="cmpsr-recipe__components"
                  listItem={listItem}
                  key={i}
                  handleRemoveComponent={handleRemoveComponent}
                  handleComponentDetails={handleComponentDetails}
                  noEditComponent={noEditComponent}
                />
              ))}
            </ListView>
          </Tab>
          <Tab tabTitle={this.state.depsTabTitle} active={this.state.activeTab === 'Dependencies'}>
            <DependencyListView
              className="cmpsr-recipe__dependencies"
              listItems={dependencies}
              handleRemoveComponent={handleRemoveComponent}
              handleComponentDetails={handleComponentDetails}
              noEditComponent={noEditComponent}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

RecipeContents.propTypes = {
  components: PropTypes.array,
  dependencies: PropTypes.array,
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  noEditComponent: PropTypes.bool,
};

export default RecipeContents;
