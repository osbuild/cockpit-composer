import React from 'react';
import Layout from '../../components/Layout';
import RecipeListView from '../../components/ListView/RecipeListView';
import CreateRecipe from '../../components/Modal/CreateRecipe';
import RecipeApi from '../../data/RecipeApi';
import constants from '../../core/constants';
import utils from '../../core/utils';

class RecipesPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
  }

  state = { recipes: [] };

  componentWillMount() {
    this.getRecipes();
  }

  componentDidMount() {
    document.title = 'Recipes';
  }

  setNotifications = () => {
    this.refs.layout.setNotifications();
  }

  getRecipes() {
    // The /recipes/list response looks like:
    // {"recipes":["example","http-server","nfs-server"],"offset":0,"limit":20}
    utils.apiFetch(constants.get_recipes_list)
      .then(listdata => {
        for (const i of listdata.recipes) {
          const recipeName = listdata.recipes[i];
            // Recipe info looks like:
            // {"recipes":[{"name":"http-server","description":"An example http server",
            // "modules":[{"name":"fm-httpd","version":"23.*"},{"name":"fm-php","version":"11.6.*"}]
            // ,"packages":[{"name":"tmux","version":"2.2"}]}],"offset":0,"limit":20}
          utils.apiFetch(constants.get_recipes_info + recipeName)
              .then(recipedata => {
                const recipe = recipedata.recipes[0];
                recipe.id = recipeName;
                this.setState({ recipes: this.state.recipes.concat(recipe) });
              });
        }
      })
      .catch(e => console.log(`Error getting recipes: ${e}`));
  }

  handleDelete = (event, recipe) => {
    event.preventDefault();
    event.stopPropagation();
    const p = new Promise((resolve, reject) => {
      RecipeApi.deleteRecipe(recipe)
      .then(() => {
        // find the recipe in recipes and remove it
        let recipes = this.state.recipes;
        recipes = recipes.filter(
          (obj) => (obj.id !== recipe)
        );
        this.setState({ recipes });
        resolve();
      }).catch(e => {
        console.log(`Error deleting recipe: ${e}`);
        reject();
      });
    });
    return p;
  }


  render() {
    return (
      <Layout
        className="container-fluid container-pf-nav-pf-vertical"
        ref="layout"
      >
        <div className="row toolbar-pf">
          <div className="col-sm-12">
            <form className="toolbar-pf-actions">
              <div className="form-group toolbar-pf-filter">
                <label className="sr-only" htmlFor="filter">Name</label>
                <div className="input-group">
                  <div className="input-group-btn">
                    <button
                      type="button"
                      className="btn btn-default dropdown-toggle"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >Name<span className="caret"></span></button>
                    <ul className="dropdown-menu">
                      <li><a >Name</a></li>
                      <li><a >Version</a></li>
                    </ul>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="filter"
                    placeholder="Filter By Name..."
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="dropdown btn-group">
                  <button
                    type="button"
                    className="btn btn-default dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >Name<span className="caret"></span></button>
                  <ul className="dropdown-menu">
                    <li><a >Name</a></li>
                    <li><a >Version</a></li>
                  </ul>
                </div>
                <button className="btn btn-link" type="button">
                  <span className="fa fa-sort-alpha-asc"></span>
                </button>
              </div>

              <div className="toolbar-pf-action-right">
                <div className="form-group">
                  <button
                    className="btn btn-default"
                    type="button"
                    data-toggle="modal"
                    data-target="#cmpsr-modal-crt-recipe"
                  >Create Recipe</button>
                  <div className="dropdown btn-group  dropdown-kebab-pf">
                    <button
                      className="btn btn-link dropdown-toggle"
                      type="button"
                      id="dropdownKebab"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    ><span className="fa fa-ellipsis-v"></span></button>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
                      <li><a >Import Recipe</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a >Create Compositions</a></li>
                      <li><a >Export Selected Recipes</a></li>
                      <li className="hidden"><a >Archive Selected Recipes</a></li>
                    </ul>
                  </div>
                </div>
                <div className="form-group toolbar-pf-find">
                  <button className="btn btn-link btn-find" type="button">
                    <span className="fa fa-search"></span>
                  </button>
                  <div className="find-pf-dropdown-container">
                    <input
                      type="text"
                      className="form-control"
                      id="find"
                      placeholder="Find By Keyword..."
                    />
                    <div className="find-pf-buttons">
                      <span className="find-pf-nums">1 of 3</span>
                      <button className="btn btn-link" type="button">
                        <span className="fa fa-angle-up"></span>
                      </button>
                      <button className="btn btn-link" type="button">
                        <span className="fa fa-angle-down"></span>
                      </button>
                      <button className="btn btn-link btn-find-close" type="button">
                        <span className="pficon pficon-close"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="row toolbar-pf-results toolbar-pf-results-none">
              <div className="col-sm-12">
                <h5>40 Results</h5>
                <p>Active filters: </p>
                <ul className="list-inline">
                  <li>
                    <span className="label label-info">Name: nameofthething
                      <a ><span className="pficon pficon-close"></span></a>
                    </span>
                  </li>
                  <li>
                    <span className="label label-info">Version: 3
                      <a ><span className="pficon pficon-close"></span></a>
                    </span>
                  </li>
                  <li>
                    <span className="label label-info">Lifecycle: 5
                      <a ><span className="pficon pficon-close"></span></a>
                    </span>
                  </li>
                </ul>
                <p><a >Clear All Filters</a></p>
              </div>
            </div>
          </div>
        </div>
        <RecipeListView recipes={this.state.recipes} handleDelete={this.handleDelete} setNotifications={this.setNotifications} />
        <CreateRecipe />
      </Layout>
    );
  }

}

export default RecipesPage;
