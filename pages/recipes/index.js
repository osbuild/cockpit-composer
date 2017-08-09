import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import RecipeListView from '../../components/ListView/RecipeListView';
import CreateRecipe from '../../components/Modal/CreateRecipe';
import ExportRecipe from '../../components/Modal/ExportRecipe';
import { connect } from 'react-redux';
import { fetchingRecipes, deletingRecipe } from '../../core/actions/recipes';
import {
  setExportModalRecipeName, setExportModalRecipeContents, setExportModalVisible,
  fetchingExportModalRecipeContents,
} from '../../core/actions/modals';

class RecipesPage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
  }

  componentWillMount() {
    this.props.fetchingRecipes();
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
    this.props.setExportModalVisible(false);
    this.props.setExportModalRecipeName('');
    this.props.setExportModalRecipeContents([]);
  };
  handleShowModalExport = (e, recipe) => {
    // This implementation of the dialog only provides a text option, and it's
    // automatically selected. Eventually, the following code should move to a
    // separate function that is called when the user selects the text option

    // display the dialog, a spinner will display while contents are undefined
    this.props.setExportModalRecipeName(recipe);
    this.props.setExportModalRecipeContents(undefined);
    const recipeName = recipe.replace(/\s/g, '-');
    // run depsolving against recipe to get contents for dialog
    this.props.fetchingExportModalRecipeContents(recipeName);
    this.props.setExportModalVisible(true);
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { recipes, modalRecipeName, modalVisible, modalRecipeContents } = this.props;
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
        <RecipeListView
          recipes={recipes}
          handleDelete={this.handleDelete}
          setNotifications={this.setNotifications}
          handleShowModalExport={this.handleShowModalExport}
        />
        <CreateRecipe recipeNames={this.props.recipes.map(recipe => recipe.id)} />
        {modalVisible
          ? <ExportRecipe recipe={modalRecipeName} contents={modalRecipeContents} handleHideModal={this.handleHideModalExport} />
          : null}
      </Layout>
    );
  }
}

RecipesPage.propTypes = {
  fetchingRecipes: PropTypes.func,
  deletingRecipe: PropTypes.func,
  setExportModalVisible: PropTypes.func,
  setExportModalRecipeName: PropTypes.func,
  setExportModalRecipeContents: PropTypes.func,
  fetchingExportModalRecipeContents: PropTypes.func,
  recipes: PropTypes.array,
  modalRecipeName: PropTypes.string,
  modalVisible: PropTypes.bool,
  modalRecipeContents: PropTypes.array,
};

const mapStateToProps = state => ({
  modalRecipeName: state.exportModal.name,
  modalRecipeContents: state.exportModal.contents,
  modalVisible: state.exportModal.visible,
  recipes: state.recipes,
});

const mapDispatchToProps = dispatch => ({
  setExportModalRecipeName: modalRecipeName => {
    dispatch(setExportModalRecipeName(modalRecipeName));
  },
  setExportModalRecipeContents: modalRecipeContents => {
    dispatch(setExportModalRecipeContents(modalRecipeContents));
  },
  setExportModalVisible: modalVisible => {
    dispatch(setExportModalVisible(modalVisible));
  },
  fetchingExportModalRecipeContents: modalRecipeName => {
    dispatch(fetchingExportModalRecipeContents(modalRecipeName));
  },
  fetchingRecipes: () => {
    dispatch(fetchingRecipes());
  },
  deletingRecipe: recipe => {
    dispatch(deletingRecipe(recipe));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipesPage);
