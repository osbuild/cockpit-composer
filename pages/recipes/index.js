import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import RecipeListView from '../../components/ListView/RecipeListView';
import CreateRecipe from '../../components/Modal/CreateRecipe';
import ExportRecipe from '../../components/Modal/ExportRecipe';
import { connect } from 'react-redux';
import { fetchingRecipes, deletingRecipe } from '../../core/actions/recipes';
import {
  setModalExportRecipeName, setModalExportRecipeContents, setModalExportRecipeVisible, fetchingModalExportRecipeContents,
} from '../../core/actions/modals';

class RecipesPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
  }

  componentWillMount() {
    // this.props.fetchingRecipes();
  }

  componentDidMount() {
    document.title = 'Recipes';
  }

  setNotifications = () => {
    this.refs.layout.setNotifications();
  };

  handleDelete = (event, recipe) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.deletingRecipe(recipe);
  };

  // handle show/hide of modal dialogs
  handleHideModalExport = () => {
    this.props.setModalExportRecipeVisible(false);
    this.props.setModalExportRecipeName('');
    this.props.setModalExportRecipeContents([]);
  };
  handleShowModalExport = (e, recipe) => {
    // This implementation of the dialog only provides a text option, and it's
    // automatically selected. Eventually, the following code should move to a
    // separate function that is called when the user selects the text option

    // display the dialog, a spinner will display while contents are undefined
    this.props.setModalExportRecipeName(recipe);
    this.props.setModalExportRecipeContents(undefined);
    const recipeName = recipe.replace(/\s/g, '-');
    // run depsolving against recipe to get contents for dialog
    this.props.fetchingModalExportRecipeContents(recipeName);
    this.props.setModalExportRecipeVisible(true);
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { recipes, exportRecipe, createComposition } = this.props;
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical" ref="layout">
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
                    >
                      Name<span className="caret" />
                    </button>
                    <ul className="dropdown-menu">
                      <li><a>Name</a></li>
                      <li><a>Version</a></li>
                    </ul>
                  </div>
                  <input type="text" className="form-control" id="filter" placeholder="Filter By Name..." />
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
                  >
                    Name<span className="caret" />
                  </button>
                  <ul className="dropdown-menu">
                    <li><a>Name</a></li>
                    <li><a>Version</a></li>
                  </ul>
                </div>
                <button className="btn btn-link" type="button">
                  <span className="fa fa-sort-alpha-asc" />
                </button>
              </div>

              <div className="toolbar-pf-action-right">
                <div className="form-group">
                  <button className="btn btn-default" type="button" data-toggle="modal" data-target="#cmpsr-modal-crt-recipe">
                    Create Recipe
                  </button>
                  <div className="dropdown btn-group  dropdown-kebab-pf">
                    <button
                      className="btn btn-link dropdown-toggle"
                      type="button"
                      id="dropdownKebab"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="fa fa-ellipsis-v" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
                      <li><a>Import Recipe</a></li>
                      <li role="separator" className="divider" />
                      <li><a>Create Compositions</a></li>
                      <li><a>Export Selected Recipes</a></li>
                      <li className="hidden"><a>Archive Selected Recipes</a></li>
                    </ul>
                  </div>
                </div>
                <div className="form-group toolbar-pf-find">
                  <button className="btn btn-link btn-find" type="button">
                    <span className="fa fa-search" />
                  </button>
                  <div className="find-pf-dropdown-container">
                    <input type="text" className="form-control" id="find" placeholder="Find By Keyword..." />
                    <div className="find-pf-buttons">
                      <span className="find-pf-nums">1 of 3</span>
                      <button className="btn btn-link" type="button">
                        <span className="fa fa-angle-up" />
                      </button>
                      <button className="btn btn-link" type="button">
                        <span className="fa fa-angle-down" />
                      </button>
                      <button className="btn btn-link btn-find-close" type="button">
                        <span className="pficon pficon-close" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      {createComposition.compositionTypes !== undefined &&
        <RecipeListView
          recipes={recipes}
          compositionTypes={createComposition.compositionTypes}
          handleDelete={this.handleDelete}
          setNotifications={this.setNotifications}
          handleShowModalExport={this.handleShowModalExport}
        />
      }
        <CreateRecipe recipeNames={this.props.recipes.map(recipe => recipe.id)} />
        {(exportRecipe !== undefined && exportRecipe.visible)
          ? <ExportRecipe
            recipe={exportRecipe.name}
            contents={exportRecipe.contents}
            handleHideModal={this.handleHideModalExport}
          />
          : null}
      </Layout>
    );
  }
}

RecipesPage.propTypes = {
  fetchingRecipes: PropTypes.func,
  deletingRecipe: PropTypes.func,
  setModalExportRecipeVisible: PropTypes.func,
  setModalExportRecipeName: PropTypes.func,
  setModalExportRecipeContents: PropTypes.func,
  fetchingModalExportRecipeContents: PropTypes.func,
  recipes: PropTypes.array,
  exportRecipe: PropTypes.object,
  createComposition: PropTypes.object,
};

const mapStateToProps = state => ({
  exportRecipe: state.modals.exportRecipe,
  createComposition: state.modals.createComposition,
  recipes: state.recipes,
});

const mapDispatchToProps = dispatch => ({
  fetchingModalExportRecipeContents: modalRecipeName => {
    dispatch(fetchingModalExportRecipeContents(modalRecipeName));
  },
  fetchingRecipes: () => {
    dispatch(fetchingRecipes());
  },
  setModalExportRecipeName: modalRecipeName => {
    dispatch(setModalExportRecipeName(modalRecipeName));
  },
  setModalExportRecipeContents: modalRecipeContents => {
    dispatch(setModalExportRecipeContents(modalRecipeContents));
  },
  setModalExportRecipeVisible: modalVisible => {
    dispatch(setModalExportRecipeVisible(modalVisible));
  },
  deletingRecipe: recipe => {
    dispatch(deletingRecipe(recipe));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipesPage);
