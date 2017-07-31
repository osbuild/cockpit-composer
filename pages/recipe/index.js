import React from 'react';
import PropTypes from 'prop-types';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import Tabs from '../../components/Tabs/Tabs';
import Tab from '../../components/Tabs/Tab';
import RecipeContents from '../../components/ListView/RecipeContents';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateComposition from '../../components/Modal/CreateComposition';
import ExportRecipe from '../../components/Modal/ExportRecipe';
import EmptyState from '../../components/EmptyState/EmptyState';
import ListView from '../../components/ListView/ListView';
import ListItemRevisions from '../../components/ListView/ListItemRevisions';
import ListItemCompositions from '../../components/ListView/ListItemCompositions';
import { connect } from 'react-redux';
import { fetchingRecipeContents, setRecipeDescription } from '../../core/actions/recipes';
import { setModalExportRecipeVisible } from '../../core/actions/modals';
import { makeGetRecipeById } from '../../core/selectors';
import {
  setEditDescriptionVisible, setEditDescriptionValue,
  setSelectedComponent, setSelectedComponentStatus, setSelectedComponentParent,
  setActiveTab,
} from '../../core/actions/recipePage';

class RecipePage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleTabChanged = this.handleTabChanged.bind(this);
    this.handleComponentDetails = this.handleComponentDetails.bind(this);
  }

  state = {
    revisions: [
      {
        number: '3',
        basedOn: 'Revision 2',
        components: '8',
        compositions: '1',
        size: '2,678 KB',
        active: true,
      },
      {
        number: '2',
        basedOn: 'Revision 1',
        components: '5',
        compositions: '1',
        size: '2,345 KB',
        active: false,
      },
      {
        number: '1',
        basedOn: 'New recipe',
        components: '3',
        compositions: '0',
        size: '1,234 KB',
        active: false,
      },
    ],
    comments: [
      {
        date: '2/04/17',
        user: 'Brian Johnson',
        revision: '3',
        comment: 'Including components to support php.',
      },
      {
        date: '1/17/17',
        user: 'Brian Johnson',
        revision: '2',
        comment: 'Early test results are good, but new requirements include php support.',
      },
      {
        date: '1/17/17',
        user: 'Brian Johnson',
        revision: '2',
        comment: 'NOT PRODUCTION READY - only creating a composition to do early testing.',
      },
      {
        date: '1/06/17',
        user: 'Brian Johnson',
        revision: '1',
        comment: `Saving this first revision just to capture minimal requirements
          for comparison against future revisions`,
      },
    ],
    compositions: [
      {
        date_created: '2/06/17',
        date_exported: '2/06/17',
        user: 'Brian Johnson',
        type: 'iso',
        revision: '3',
        size: '2,345 KB',
      },
      {
        date_created: '1/17/17',
        date_exported: '1/17/17',
        user: 'Brian Johnson',
        type: 'iso',
        revision: '2',
        size: '1,234 KB',
      },
    ],
    changelog: [
      {
        revision: '3',
        action: 'Composition exported',
        date: '2/06/07',
        user: 'Brian Johnson',
      },
      {
        revision: '3',
        action: 'Composition created',
        date: '2/06/17',
        user: 'Brian Johnson',
      },
      {
        revision: '3',
        action: 'Recipe modified',
        date: '2/06/17',
        user: 'Brian Johnson',
      },
      {
        revision: '3',
        action: 'Recipe modified',
        date: '2/04/17',
        user: 'Brian Johnson',
      },
      {
        revision: '3',
        action: 'Revision created',
        date: '2/04/17',
        user: 'Brian Johnson',
      },
      {
        revision: '2',
        action: 'Composition exported',
        date: '1/17/17',
        user: 'Brian Johnson',
      },
      {
        revision: '2',
        action: 'Composition created',
        date: '1/17/17',
        user: 'Brian Johnson',
      },
      {
        revision: '2',
        action: 'Recipe modified',
        date: '1/12/17',
        user: 'Brian Johnson',
      },
      {
        revision: '2',
        action: 'Revision created',
        date: '1/06/17',
        user: 'Brian Johnson',
      },
      {
        revision: '1',
        action: 'Recipe modified',
        date: '12/15/16',
        user: 'Brian Johnson',
      },
      {
        revision: '1',
        action: 'Revision created',
        date: '12/15/16',
        user: 'Brian Johnson',
      },
    ],
  };

  componentWillMount() {
    if (this.props.rehydrated) {
      this.props.fetchingRecipeContents(this.props.route.params.recipe.replace(/\s/g, '-'));
    }
    this.props.setEditDescriptionVisible(false);
    this.props.setModalExportRecipeVisible(false);
  }
  // Get the recipe details, and its dependencies
  // Object layout is:
  // {recipes: [{recipe: RECIPE, modules: MODULES}, ...]}
  // Where MODULES is a modules/info/ object {name: "", projects: [{...

  componentDidMount() {
    document.title = 'Recipe';
  }

  setNotifications = () => {
    this.refs.layout.setNotifications();
  }

  handleTabChanged(e) {
    if (this.props.recipePage.activeTab !== e.detail) {
      this.props.setActiveTab(e.detail);
    }
    e.preventDefault();
    e.stopPropagation();
  }

  handleComponentDetails = (event, component, parent) => {
    // the user selected a component to view more details
    this.props.setSelectedComponent(component);
    this.props.setSelectedComponentParent(parent);
    event.preventDefault();
    event.stopPropagation();
  };

  handleEditDescription = (action) => {
    const state = !this.props.recipePage.editDescriptionVisible;
    this.props.setEditDescriptionVisible(state);
    if (state) {
      this.props.setEditDescriptionValue(this.props.recipe.description);
    } else if (action === 'save') {
      this.props.setRecipeDescription(this.props.recipe, this.props.recipePage.editDescriptionValue);
    } else if (action === 'cancel') {
      // cancel action
    }
  }

  handleChangeDescription(event) {
    this.props.setEditDescriptionValue(event.target.value);
  }

  // handle show/hide of modal dialogs
  handleHideModalExport = () => {
    this.props.setModalExportRecipeVisible(false);
  }
  handleShowModalExport = (e) => {
    this.props.setModalExportRecipeVisible(true);
    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    if (!this.props.rehydrated) {
      return <div></div>;
    }

    const { recipe, exportModalVisible, compositionTypes } = this.props;
    const {
      editDescriptionValue, editDescriptionVisible, activeTab,
      selectedComponent, selectedComponentParent, selectedComponentStatus,
    } = this.props.recipePage;

    const activeRevision = this.state.revisions.filter((obj) => obj.active === true)[0];
    const pastRevisions = this.state.revisions.filter((obj) => obj.active === false);
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical" ref="layout">
        <header className="cmpsr-header">
          <ol className="breadcrumb">
            <li><Link to="/recipes">Back to Recipes</Link></li>
            <li className="active"><strong>{this.props.route.params.recipe}</strong></li>
          </ol>
          <div className="cmpsr-title">
            <h1 className="cmpsr-title__item">{this.props.route.params.recipe}</h1>
            <p className="cmpsr-title__item">
              Current Revision: 3
              {recipe.description && <span className="text-muted">, {recipe.description}</span>}
            </p>
          </div>
        </header>
        <Tabs key="pf-tabs" ref="pfTabs" tabChanged={this.handleTabChanged}>
          <Tab tabTitle="Details" active={activeTab === 'Details'}>
            <div className="row toolbar-pf">
              <div className="col-sm-12">
                <form className="toolbar-pf-actions">
                  <div className="toolbar-pf-action-right">
                    <div className="form-group">
                      <Link to={`/edit/${this.props.route.params.recipe}`} className="btn btn-default">Edit Recipe</Link>
                      <button
                        className="btn btn-default"
                        id="cmpsr-btn-crt-compos"
                        data-toggle="modal"
                        data-target="#cmpsr-modal-crt-compos"
                        type="button"
                      >
                        Create Composition
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
                          <li><a href="#" onClick={e => this.handleShowModalExport(e)}>Export</a></li>
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
            <div className="tab-container row">
              <div className="col-md-6">
                <dl className="dl-horizontal mt-">
                  <dt>Name</dt>
                  <dd>{recipe.name}</dd>
                  <dt>Description</dt>
                  {(editDescriptionVisible &&
                    <dd>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={editDescriptionValue}
                          onChange={e => this.handleChangeDescription(e)}
                        />
                        <span className="input-group-btn">
                          <button className="btn btn-link" type="button" onClick={() => this.handleEditDescription('save')}>
                            <span className="fa fa-check" />
                          </button>
                          <button className="btn btn-link" type="button" onClick={() => this.handleEditDescription('cancel')}>
                            <span className="pficon pficon-close" />
                          </button>
                        </span>
                      </div>
                    </dd>) ||
                    <dd onClick={() => this.handleEditDescription()}>
                      {recipe.description}
                      <button className="btn btn-link" type="button">
                        <span className="pficon pficon-edit" />
                      </button>
                    </dd>}
                  <dt>Revision</dt>
                  <dd>3</dd>
                  <dt>Install size</dt>
                  <dd>2,678 KB</dd>
                  <dt>Last modified by</dt>
                  <dd>Brian Johnson</dd>
                  <dt>Last modified date</dt>
                  <dd>01/12/17</dd>
                </dl>
              </div>
              <div className="col-md-6">
                <div className="cmpsr-summary-listview">
                  <p><strong>Comments</strong> <span className="badge">{this.state.comments.length}</span></p>
                  <div className="input-group">
                    <input type="text" className="form-control" />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">Post Comment</button>
                    </span>
                  </div>
                  <div className="list-pf list-pf-stacked cmpsr-list-pf__compacted">
                    {this.state.comments.map((comment, i) => (
                      <div className="list-pf-item" key={i}>
                        <div className="list-pf-container">
                          <div className="list-pf-content list-pf-content-flex ">
                            <div className="list-pf-left">
                              <span className="fa fa-comment-o list-pf-icon-small text-muted" aria-hidden="true" />
                            </div>
                            <div className="list-pf-content-wrapper">
                              <div className="list-pf-main-content">
                                <div className="list-pf-title ">
                                  Revision {comment.revision}, {comment.date}
                                  <span className="text-muted pull-right">
                                    {comment.user}
                                  </span>
                                </div>
                                <div className="list-pf-description ">
                                  {comment.comment}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab tabTitle="Components" active={activeTab === 'Components'}>
            <div className="row">
              {(selectedComponent === '' &&
                <div className="col-sm-12">
                  <div className="row toolbar-pf">
                    <div className="col-sm-12">
                      <form className="toolbar-pf-actions">
                        <div className="form-group">
                          <div className="dropdown btn-group">
                            <button
                              type="button"
                              className="btn btn-default dropdown-toggle"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              Revision 3<span className="caret" />
                            </button>
                            <ul className="dropdown-menu">
                              <li><a>Revision 3</a></li>
                              <li><a>Revision 2</a></li>
                              <li><a>Revision 1</a></li>
                            </ul>
                          </div>
                        </div>
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
                            <Link to={`/edit/${this.props.route.params.recipe}`} className="btn btn-default">Edit Recipe</Link>
                            <button
                              className="btn btn-default"
                              id="cmpsr-btn-crt-compos"
                              data-toggle="modal"
                              data-target="#cmpsr-modal-crt-compos"
                              type="button"
                            >
                              Create Composition
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
                                <li><a href="#" onClick={e => this.handleShowModalExport(e)}>Export</a></li>
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
                  {(recipe.components === undefined || recipe.components.length === 0) &&
                    <EmptyState
                      title={'Empty Recipe'}
                      message={'There are no components listed in the recipe. Edit the recipe to add components.'}
                    >
                      <Link to={`/edit/${this.props.route.params.recipe}`}>
                        <button className="btn btn-default btn-primary" type="button">
                          Edit Recipe
                        </button>
                      </Link>
                    </EmptyState> ||
                    <RecipeContents
                      components={recipe.components}
                      dependencies={recipe.dependencies}
                      noEditComponent
                      handleComponentDetails={this.handleComponentDetails}
                    />}
                </div>) ||
                <div className="col-sm-12 cmpsr-component-details--view">
                  <h3 className="cmpsr-panel__title cmpsr-panel__title--main">Component Details</h3>
                  <ComponentDetailsView
                    parent={this.props.route.params.recipe}
                    component={selectedComponent}
                    componentParent={selectedComponentParent}
                    status={selectedComponentStatus}
                    handleComponentDetails={this.handleComponentDetails}
                  />
                </div>}
            </div>
          </Tab>
          <Tab tabTitle="Revisions" active={activeTab === 'Revisions'}>
            <div className="row toolbar-pf">
              <div className="col-sm-12">
                <form className="toolbar-pf-actions">
                  <div className="toolbar-pf-action-right">
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
            <div className="tab-container">
              <ListView className="cmpsr-recipe__revisions cmpsr-list">
                <div className="list-pf-item list-group-item__separator">
                  <div className="list-pf-container">
                    <div className="list-pf-content">
                      <span className="list-pf-title">Current Revision</span>
                    </div>
                  </div>
                </div>
                <ListItemRevisions
                  listItemParent="cmpsr-recipe__revisions"
                  recipe={this.props.route.params.recipe}
                  comments={this.state.comments}
                  changelog={this.state.changelog}
                  compositions={this.state.compositions}
                  listItem={activeRevision}
                  handleShowModalExport={this.handleShowModalExport}
                />
                <div className="list-pf-item list-group-item__separator">
                  <div className="list-pf-container">
                    <div className="list-pf-content">
                      <span className="list-pf-title">Past Revisions</span>
                    </div>
                  </div>
                </div>
                {pastRevisions.map((revision, i) => (
                  <ListItemRevisions
                    listItemParent="cmpsr-recipe__revisions"
                    recipe={this.props.route.params.recipe}
                    comments={this.state.comments}
                    changelog={this.state.changelog}
                    compositions={this.state.compositions}
                    listItem={revision}
                    handleShowModalExport={this.handleShowModalExport}
                    key={i}
                  />
                ))}
              </ListView>
            </div>
          </Tab>
          <Tab tabTitle="Compositions" active={activeTab === 'Compositions'}>
            <div className="row toolbar-pf">
              <div className="col-sm-12">
                <form className="toolbar-pf-actions">
                  <div className="toolbar-pf-action-right">
                    <div className="form-group">
                      <Link to={`/edit/${this.props.route.params.recipe}`} className="btn btn-default">Edit Recipe</Link>
                      <button
                        className="btn btn-default"
                        id="cmpsr-btn-crt-compos"
                        data-toggle="modal"
                        data-target="#cmpsr-modal-crt-compos"
                        type="button"
                      >
                        Create Composition
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
                          <li><a href="#" onClick={e => this.handleShowModalExport(e)}>Export</a></li>
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
            <div className="tab-container">
              {(this.state.compositions.length === 0 &&
                <EmptyState title={'No Compositions'} message={'No compositions have been created from this recipe.'}>
                  <button
                    className="btn btn-default"
                    id="cmpsr-btn-crt-compos"
                    data-toggle="modal"
                    data-target="#cmpsr-modal-crt-compos"
                    type="button"
                  >
                    Create Composition
                  </button>
                </EmptyState>) ||
                <ListView className="cmpsr-recipe__compositions cmpsr-list">
                  {this.state.compositions.map((composition, i) => (
                    <ListItemCompositions
                      listItemParent="cmpsr-recipe__compositions"
                      recipe={this.props.route.params.recipe}
                      listItem={composition}
                      key={i}
                    />
                  ))}
                </ListView>}
            </div>
          </Tab>
          <Tab tabTitle="Errata" active={activeTab === 'Errata'}>
            <p>Errata</p>
          </Tab>
        </Tabs>
        <CreateComposition recipe={recipe.name} compositionTypes={compositionTypes} setNotifications={this.setNotifications} />
        {exportModalVisible
          ? <ExportRecipe
            recipe={recipe.name}
            contents={recipe.dependencies}
            handleHideModal={this.handleHideModalExport}
          />
          : null}
      </Layout>
    );
  }
}

RecipePage.propTypes = {
  route: PropTypes.object,
  rehydrated: PropTypes.bool,
  fetchingRecipeContents: PropTypes.func,
  recipe: PropTypes.object,
  setActiveTab: PropTypes.func,
  setEditDescriptionValue: PropTypes.func,
  setEditDescriptionVisible: PropTypes.func,
  setSelectedComponent: PropTypes.func,
  setSelectedComponentParent: PropTypes.func,
  setSelectedComponentStatus: PropTypes.func,
  setModalExportRecipeVisible: PropTypes.func,
  recipePage: PropTypes.object,
  setRecipeDescription: PropTypes.func,
  exportModalVisible: PropTypes.bool,
  compositionTypes: PropTypes.array,
};

const makeMapStateToProps = () => {
  const getRecipeById = makeGetRecipeById();
  const mapStateToProps = (state, props) => {
    if (getRecipeById(state, props.route.params.recipe.replace(/\s/g, '-')) !== undefined) {
      return {
        rehydrated: state.rehydrated,
        recipe: getRecipeById(state, props.route.params.recipe.replace(/\s/g, '-')),
        recipePage: state.recipePage,
        exportModalVisible: state.modals.exportRecipe.visible,
        compositionTypes: state.modals.createComposition.compositionTypes,
      };
    }
    return {
      rehydrated: state.rehydrated,
      recipe: {},
      recipePage: state.recipePage,
      exportModalVisible: state.modals.exportRecipe.visible,
      compositionTypes: state.modals.createComposition.compositionTypes,
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
  fetchingRecipeContents: recipeId => {
    dispatch(fetchingRecipeContents(recipeId));
  },
  setRecipeDescription: (recipe, description) => {
    dispatch(setRecipeDescription(recipe, description));
  },
  setEditDescriptionValue: (value) => {
    dispatch(setEditDescriptionValue(value));
  },
  setEditDescriptionVisible: (visible) => {
    dispatch(setEditDescriptionVisible(visible));
  },
  setActiveTab: (activeTab) => {
    dispatch(setActiveTab(activeTab));
  },
  setSelectedComponent: (component) => {
    dispatch(setSelectedComponent(component));
  },
  setSelectedComponentParent: (componentParent) => {
    dispatch(setSelectedComponentParent(componentParent));
  },
  setSelectedComponentStatus: (componentStatus) => {
    dispatch(setSelectedComponentStatus(componentStatus));
  },
  setModalExportRecipeVisible: (visible) => {
    dispatch(setModalExportRecipeVisible(visible));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(RecipePage);
