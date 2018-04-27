import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import Tabs from '../../components/Tabs/Tabs';
import Tab from '../../components/Tabs/Tab';
import ListView from '../../components/ListView/ListView';
import ListItemComponents from '../../components/ListView/ListItemComponents';
import DependencyListView from '../../components/ListView/DependencyListView';

const messages = defineMessages({
  dependencies: {
    defaultMessage: "Dependencies {count}"
  },
  selected: {
    defaultMessage: "Selected Components {count}"
  }
});

class BlueprintContents extends React.Component {
  constructor() {
    super();
    this.state = { activeTab: 'Components' };
    this.handleTabChanged = this.handleTabChanged.bind(this);
  }

  handleTabChanged(e) {
    if (this.state.activeTab !== e.detail) {
      this.setState({ activeTab: e.detail });
    }
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { components, dependencies, handleComponentDetails, handleRemoveComponent, noEditComponent } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <Tabs
          key={components.length}
          ref={c => {
            this.pfTabs = c;
          }}
          tabChanged={this.handleTabChanged}
          classnames="nav nav-tabs nav-tabs-pf"
        >
          <Tab
            tabTitle={formatMessage(messages.selected, {count: <span className="badge">{components.length}</span>})}
            active={this.state.activeTab === 'Selected'}
          >
            <ListView className="cmpsr-blueprint__components" stacked>
              {components.map((listItem, i) => (
                <ListItemComponents
                  listItemParent="cmpsr-blueprint__components"
                  listItem={listItem}
                  key={i}
                  handleRemoveComponent={handleRemoveComponent}
                  handleComponentDetails={handleComponentDetails}
                  noEditComponent={noEditComponent}
                />
              ))}
            </ListView>
          </Tab>
          <Tab
            tabTitle={formatMessage(messages.dependencies, {count: <span className="badge">{dependencies.length}</span>})}
            active={this.state.activeTab === 'Dependencies'}
          >
            <DependencyListView
              className="cmpsr-blueprint__dependencies"
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

BlueprintContents.propTypes = {
  components: PropTypes.array,
  dependencies: PropTypes.array,
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  intl: intlShape.isRequired,
  noEditComponent: PropTypes.bool,
};

export default injectIntl(BlueprintContents);
