import React, { PropTypes } from 'react';
import ListViewExpand from '../../components/ListView/ListViewExpand';

class RecipeContents extends React.Component {

  render() {
    const { components } = this.props;
    const { dependencies } = this.props;
    const { handleRemoveComponent } = this.props;

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
              <ListViewExpand id="cmpsr-recipe-components" listItems={ components } handleRemoveComponent={handleRemoveComponent} />
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
              <div className="row toolbar-pf">
                <div className="col-sm-12">
                  <form className="toolbar-pf-actions">
                    <div className="form-group">
                      <span className="text-muted">Show:</span> First Level Dependencies ({dependencies.length}) <span className="text-muted">|</span> <a>All Dependencies (28)</a>
                    </div>
                  </form>
                </div>
              </div>
              <div className="alert alert-warning alert-dismissable">
                <span className="pficon pficon-warning-triangle-o"></span>
                One or more dependencies have multiple variations that could be used. A default variation was automatically selected. Click a flagged dependency to see other options available.
              </div>
              <ListViewExpand id="cmpsr-recipe-dependencies" listItems={ dependencies } handleRemoveComponent={handleRemoveComponent} isDependency />
            </div>
          </div>
        </div>
      </div>



    )
  }

}

export default RecipeContents;
