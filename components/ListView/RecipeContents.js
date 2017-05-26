import React from 'react';
import PropTypes from 'prop-types';
import ListView from '../../components/ListView/ListView';
import ListItemComponents from '../../components/ListView/ListItemComponents';
import DependencyListView from '../../components/ListView/DependencyListView';

const RecipeContents = (props) => (
  <div className="panel-group" id="cmpsr-recipe-contents">
    <div className="panel panel-default">
      <div className="panel-heading">
        <h4 className="panel-title">
          <a data-toggle="collapse" href="#collapseOne" data-parent="#cmpsr-recipe-contents">
            Selected Components ({props.components.length})
          </a>
        </h4>
      </div>
      <div id="collapseOne" className="panel-collapse collapse in">
        <div className="panel-body">
          <ListView id="cmpsr-recipe-components" >
            {props.components.map((listItem, i) =>
              <ListItemComponents
                listItemParent="cmpsr-recipe-components"
                listItem={listItem}
                key={i}
                handleRemoveComponent={props.handleRemoveComponent}
                handleComponentDetails={props.handleComponentDetails}
                noEditComponent={props.noEditComponent}
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
            listItems={props.dependencies}
            handleRemoveComponent={props.handleRemoveComponent}
            handleComponentDetails={props.handleComponentDetails}
            noEditComponent={props.noEditComponent}
          />
        </div>
      </div>
    </div>
  </div>
);

RecipeContents.propTypes = {
  components: PropTypes.array,
  dependencies: PropTypes.array,
  handleComponentDetails: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  noEditComponent: PropTypes.bool,
};

export default RecipeContents;
