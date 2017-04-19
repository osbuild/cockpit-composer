import React from 'react';
import ListView from '../../components/ListView/ListView';
import ListItemComponents from '../../components/ListView/ListItemComponents';
import DependencyListView from '../../components/ListView/DependencyListView';

class RecipeContents extends React.Component {

  render() {
    const { components } = this.props;
    const { dependencies } = this.props;
    const { handleRemoveComponent } = this.props;
    const { handleComponentDetails } = this.props;


    return (
      <div className="panel-group" id="cmpsr-recipe-contents">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">
              <a data-toggle="collapse" href="#collapseOne" data-parent="#cmpsr-recipe-contents">
                Selected Components ({components.length})
              </a>
            </h4>
          </div>
          <div id="collapseOne" className="panel-collapse collapse in">
            <div className="panel-body">
              <ListView id="cmpsr-recipe-components" >
                {components.map((listItem, i) =>
                  <ListItemComponents
                    listItemParent="cmpsr-recipe-components"
                    listItem={listItem}
                    key={i}
                    handleRemoveComponent={handleRemoveComponent}
                    handleComponentDetails={handleComponentDetails}
                    noEditComponent={this.props.noEditComponent}
                  />
                )}
              </ListView>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">
              <a
                data-toggle="collapse"
                href="#collapseTwo"
                className="collapsed"
                data-parent="#cmpsr-recipe-contents"
              >
                Dependencies
              </a>
            </h4>
          </div>
          <div id="collapseTwo" className="panel-collapse collapse">
            <div className="panel-body">
              <DependencyListView
                id="cmpsr-recipe-dependencies"
                listItems={dependencies}
                handleRemoveComponent={handleRemoveComponent}
                handleComponentDetails={handleComponentDetails}
                noEditComponent={this.props.noEditComponent}
              />
            </div>
          </div>
        </div>
      </div>

    );
  }

}

export default RecipeContents;
