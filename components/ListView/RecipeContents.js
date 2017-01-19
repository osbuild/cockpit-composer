import React, { PropTypes } from 'react';
import ListViewExpand from '../../components/ListView/ListViewExpand';
import DependencyListView from '../../components/ListView/DependencyListView';

class RecipeContents extends React.Component {

  render() {
    const { components } = this.props;
    const { dependencies } = this.props;
    const { handleRemoveComponent } = this.props;
    const { handleComponentDetails } = this.props;


    return (
      <div className="panel-group row" id="cmpsr-recipe-contents">
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
              <ListViewExpand id="cmpsr-recipe-components" listItems={ components } handleRemoveComponent={handleRemoveComponent} handleComponentDetails={handleComponentDetails} />
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4 className="panel-title">
              <a data-toggle="collapse" href="#collapseTwo" className="collapsed" data-parent="#cmpsr-recipe-contents">
                Dependencies
              </a>
            </h4>
          </div>
          <div id="collapseTwo" className="panel-collapse collapse">
            <div className="panel-body">
              <DependencyListView id="cmpsr-recipe-dependencies" listItems= { dependencies } handleRemoveComponent={handleRemoveComponent} handleComponentDetails={handleComponentDetails} />
            </div>
          </div>
        </div>
      </div>

    )
  }

}

export default RecipeContents;
