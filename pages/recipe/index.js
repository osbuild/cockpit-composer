import React, { PropTypes } from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import Tabs from '../../components/Tabs/Tabs'
import Tab from '../../components/Tabs/Tab';
import RecipeContents from '../../components/ListView/RecipeContents';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateComposition from '../../components/Modal/CreateComposition';
import EmptyState from '../../components/EmptyState/EmptyState';
import Toolbar from '../../components/Toolbar/Toolbar';
import constants from '../../core/constants';

class RecipePage extends React.Component {

  state = { recipe: [], components: [], dependencies: [], activeTab: "Components", selectedComponent: "", selectedComponentStatus: "view", selectedComponentParent: "" };

  componentDidMount() {
    document.title = 'Composer | Recipe';
  }

  componentWillMount() {
    Promise.all([this.getRecipe()]).then((data) => {
      this.setState({"recipe" : data[0].recipes[0]});
      this.setState({"components" : constants.setComponentType(data[0].recipes[0])});
      this.getDependencies();
    }).catch(e => console.log('Error in Recipe promise: ' + e));
  }

  getRecipe() {
    let recipeName = this.props.route.params.recipe;
    let p = new Promise((resolve, reject) => {
      fetch(constants.get_recipes_info + recipeName)
        .then(r => r.json())
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          console.log("Error fetching recipes: " + e);
          reject();
          }
        );
    });
    return p;
  }

  getDependencies() {
    let components = this.state.components.slice(0);
    let componentNames = "";
    components.map(component => {
      componentNames = componentNames + component.name + ",";
    })
    // get list of component names, then fetch the dependencies for those components, then combine the projects into a single array
    fetch(constants.get_dependencies_list + componentNames).then(r => r.json())
      .then(data => {
        let dependencies = [];
        data.modules.map(i => {
          dependencies = dependencies.concat(i.projects);
        });
        this.setState({dependencies: dependencies});
      })
      .catch(e => console.log("no dependencies"));
  }

  handleTabChanged(e){
    if(this.state.activeTab != e.detail){
      this.setState({activeTab: e.detail});
    }
  }

  handleComponentDetails = (event, component, parent) => {
    // the user selected a component to view more details
      this.setState({selectedComponent: component});
      this.setState({selectedComponentParent: parent});
  };

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">

				<ol className="breadcrumb"><li><Link to="/recipes">Back to Recipes</Link></li><li className="active"><strong>{ this.props.route.params.recipe }</strong></li></ol>

				<h1>{ this.props.route.params.recipe }</h1>

        <Tabs key="pf-tabs" ref="pfTabs" tabChanged={this.handleTabChanged.bind(this)}>
          <Tab tabTitle="Details" active={this.state.activeTab == 'Details'}>
            <div className="tab-container">
              <dl className="dl-horizontal mt-">
                <dt>Name</dt>
                <dd>{this.state.recipe.name}</dd>
                <dt>Description</dt>
                <dd>{this.state.recipe.description}</dd>
                <dt>Version</dt>
                <dd>3</dd>
                <dt>Last modified by</dt>
                <dd>Brian Johnson</dd>
                <dt>Last modified date</dt>
                <dd>01/12/17</dd>
              </dl>
            </div>
          </Tab>
          <Tab tabTitle="Components" active={this.state.activeTab == 'Components'}>
            <div className="row">
            { this.state.selectedComponent == "" &&
            <div className="col-sm-12" id="cmpsr-recipe-list">
              <div className="row toolbar-pf">
                <div className="col-sm-12">
                  <form className="toolbar-pf-actions">
                    <div className="form-group toolbar-pf-filter">
                      <label className="sr-only" htmlFor="filter">Name</label>
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
                      <Link to={"/edit/" + this.props.route.params.recipe } className="btn btn-default">Edit Recipe</Link>
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
              { this.state.components.length == 0 &&
              <EmptyState title={"Empty Recipe"} message={"There are no components listed in the recipe. Edit the recipe to add components."} >
                <Link to={"/edit/" + this.props.route.params.recipe }><button className="btn btn-default btn-primary" type="button">Edit Recipe</button></Link>
              </EmptyState>
              ||
              <RecipeContents components={ this.state.components }
                dependencies={ this.state.dependencies }
                noEditComponent
                handleComponentDetails={this.handleComponentDetails.bind(this)} />
              }
  					</div>
            ||
            <div className="col-sm-12" id="cmpsr-recipe-details">
              <ComponentDetailsView
                component={ this.state.selectedComponent }
                componentParent={ this.state.selectedComponentParent }
                status={ this.state.selectedComponentStatus }
                handleComponentDetails={this.handleComponentDetails.bind(this)} />
            </div>
            }
            </div>
          </Tab>
          <Tab tabTitle="Compositions" active={this.state.activeTab == 'Compositions'}>
            <p>Compositions</p>
          </Tab>
          <Tab tabTitle="Versions" active={this.state.activeTab == 'Versions'}>
            <p>Versions</p>
          </Tab>
          <Tab tabTitle="Errata" active={this.state.activeTab == 'Errata'}>
            <p>Errata</p>
          </Tab>
        </Tabs>


				<CreateComposition types={this.state.comptypes} />
      </Layout>
    );
  }

}

export default RecipePage;
