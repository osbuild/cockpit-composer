import React, { PropTypes } from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import RecipeListView from '../../components/ListView/RecipeListView';
import constants from '../../core/constants';

class RecipesPage extends React.Component {

  state = { recipes: [] };

  componentDidMount() {
    document.title = 'Composer | Recipes';
  }

  componentWillMount() {
    this.getRecipes();
  }

  getRecipes() {
    let that = this;
    fetch(constants.get_recipes_url).then(r => r.json())
      .then(data => {
        that.setState({recipes : data})
      })
      .catch(e => console.log("Booo"));
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <div className="row toolbar-pf">
          <div className="col-sm-12">
            <form className="toolbar-pf-actions">
              <div className="form-group toolbar-pf-filter">
                <label className="sr-only" for="filter">Name</label>
                <div className="input-group">
                  <div className="input-group-btn">
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Name<span className="caret"></span></button>
                    <ul className="dropdown-menu">
                      <li><a href="#">Name</a></li>
                      <li><a href="#">Version</a></li>
                    </ul>
                  </div>
                  <input type="text" className="form-control" id="filter" placeholder="Filter By Name..." />
                </div>
              </div>
              <div className="form-group">
                <div className="dropdown btn-group">
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Name<span className="caret"></span></button>
                  <ul className="dropdown-menu">
                    <li><a href="#">Name</a></li>
                    <li><a href="#">Version</a></li>
                  </ul>
                </div>
                <button className="btn btn-link" type="button"><span className="fa fa-sort-alpha-asc"></span></button>
              </div>
              <div className="form-group">
                <button className="btn btn-default" type="button" data-toggle="modal" data-target="#cmpsr-modal-crt-recipe">Create Recipe</button>
                <div className="dropdown btn-group  dropdown-kebab-pf">
                  <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebab" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="fa fa-ellipsis-v"></span></button>
                  <ul className="dropdown-menu " aria-labelledby="dropdownKebab">
                    <li><a href="#">Import Recipe</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">Create Compositions</a></li>
                    <li><a href="#">Export Selected Recipes</a></li>
                    <li><a href="#">Delete Selected Recipes</a></li>
                  </ul>
                </div>
              </div>
              <div className="toolbar-pf-action-right">
                <div className="form-group toolbar-pf-find">
                  <button className="btn btn-link btn-find" type="button"><span className="fa fa-search"></span></button>
                  <div className="find-pf-dropdown-container"><input type="text" className="form-control" id="find" placeholder="Find By Keyword..." />
                    <div className="find-pf-buttons">
                      <span className="find-pf-nums">1 of 3</span>
                      <button className="btn btn-link" type="button"><span className="fa fa-angle-up"></span></button>
                      <button className="btn btn-link" type="button"><span className="fa fa-angle-down"></span></button>
                      <button className="btn btn-link btn-find-close" type="button"><span className="pficon pficon-close"></span></button>
                    </div>
                  </div>
                </div>
                <div className="form-group toolbar-pf-view-selector">
                  <button className="btn btn-link" title="Table View"><i className="fa fa-th"></i></button>
                  <button className="btn btn-link " title="Tree View"><i className="pficon pficon-topology"></i></button>
                  <button className="btn btn-link active" title="List View"><i className="fa fa-th-list"></i></button>
                </div>
              </div>
            </form>
            <div className="row toolbar-pf-results toolbar-pf-results-none">
              <div className="col-sm-12">
                <h5>40 Results</h5>
                <p>Active filters: </p>
                <ul className="list-inline">
                  <li><span className="label label-info">Name: nameofthething<a href="#"><span className="pficon pficon-close"></span></a></span></li>
                  <li><span className="label label-info">Version: 3<a href="#"><span className="pficon pficon-close"></span></a></span></li>
                  <li><span className="label label-info">Lifecycle: 5<a href="#"><span className="pficon pficon-close"></span></a></span></li>
                </ul>
                <p><a href="#">Clear All Filters</a></p>
              </div>
            </div>
          </div>
        </div>
        <RecipeListView recipes={ this.state.recipes } />
        <div className="modal fade" id="cmpsr-modal-crt-recipe" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                  <span className="pficon pficon-close"></span>
                </button>
                <h4 className="modal-title" id="myModalLabel">Create Recipe</h4>
              </div>
              <div className="modal-body">
                <form className="form-horizontal">
                  <div className="form-group">
                    <label className="col-sm-3 control-label" for="textInput-modal-markup">Name</label>
                    <div className="col-sm-9">
                      <input type="text" id="textInput-modal-markup" className="form-control" /></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label" for="textInput2-modal-markup">Description</label>
                    <div className="col-sm-9">
                      <input type="text" id="textInput2-modal-markup" className="form-control" /></div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-3 control-label" for="textInput3-modal-markup">Other options will display here</label>
                    <div className="col-sm-9">
                      <input type="text" id="textInput3-modal-markup" className="form-control" />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

}

export default RecipesPage;
