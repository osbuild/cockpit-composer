import React, { PropTypes } from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import ComponentListView from '../../components/ListView/ComponentListView';
import CreateComposition from '../../components/Modal/CreateComposition';
import constants from '../../core/constants';

class RecipePage extends React.Component {

  state = { components: [] };

  componentDidMount() {
    document.title = 'Composer | Recipe';
  }

  componentWillMount() {
    this.getRecipe();
  }

  getRecipe() {
    let that = this;
    fetch(constants.get_recipe_url).then(r => r.json())
      .then(data => {
        that.setState({components : data})
      })
      .catch(e => console.log("Booo"));
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">

				<ol className="breadcrumb"><li><Link to="/recipes">Back to Recipes</Link></li><li className="active"><strong>Low Latency</strong></li></ol>

				<h1>Low Latency</h1>

				<ul className="nav nav-tabs"><li><a href="#">Details</a></li><li className="active"><a href="#">Components</a></li><li><a href="#">Compositions</a></li></ul>

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
                <Link to="/edit"><button className="btn btn-default" type="button">Edit Recipe</button></Link>&nbsp;
								<button className="btn btn-default" id="cmpsr-btn-crt-compos" data-toggle="modal" data-target="#cmpsr-modal-crt-compos" type="button">Create Composition</button>
                <div className="dropdown btn-group  dropdown-kebab-pf">
                  <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebab" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="fa fa-ellipsis-v"></span></button>
                  <ul className="dropdown-menu " aria-labelledby="dropdownKebab">
                    <li><a href="#">Export Recipe</a></li>
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
        <ComponentListView components={ this.state.components } />
				<CreateComposition types={this.state.comptypes} />
      </Layout>
    );
  }

}

export default RecipePage;
