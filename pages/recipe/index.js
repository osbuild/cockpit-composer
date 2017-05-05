import React from 'react';
import Link from '../../components/Link';
import Layout from '../../components/Layout';
import { Tab, Tabs } from 'react-patternfly-shims';
import RecipeContents from '../../components/ListView/RecipeContents';
import ComponentDetailsView from '../../components/ListView/ComponentDetailsView';
import CreateComposition from '../../components/Modal/CreateComposition';
import EmptyState from '../../components/EmptyState/EmptyState';
import ListView from '../../components/ListView/ListView';
import ListItemExpandRevisions from '../../components/ListView/ListItemExpandRevisions';
import ListItemCompositions from '../../components/ListView/ListItemCompositions';
import RecipeApi from '../../data/RecipeApi';


class RecipePage extends React.Component {
  constructor() {
    super();
    this.setNotifications = this.setNotifications.bind(this);
    this.handleTabChanged = this.handleTabChanged.bind(this);
    this.handleComponentDetails = this.handleComponentDetails.bind(this);
  }

  state = {
    recipe: {},
    components: [],
    dependencies: [],
    activeTab: 'Components',
    selectedComponent: '',
    selectedComponentStatus: 'view',
    selectedComponentParent: '',
    inlineEditDescription: false,
    inlineEditDescriptionValue: '',
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
    const recipeName = this.props.route.params.recipe.replace(/\s/g, '-');
    Promise.all([RecipeApi.getRecipe(recipeName)]).then((data) => {
      const recipe = {
        name: data[0].name,
        description: data[0].description,
      };
      this.setState({ recipe });
      this.setState({ components: data[0].components });
      this.setState({ dependencies: data[0].dependencies });
    }).catch(e => console.log(`Error in EditRecipe promise: ${e}`));
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
    if (this.state.activeTab !== e.detail) {
      this.setState({ activeTab: e.detail });
    }
    e.preventDefault();
    e.stopPropagation();
  }

  handleComponentDetails = (event, component, parent) => {
    // the user selected a component to view more details
    this.setState({ selectedComponent: component });
    this.setState({ selectedComponentParent: parent });
    event.preventDefault();
    event.stopPropagation();
  };

  handleEditDescription = (action) => {
    const state = !this.state.inlineEditDescription;
    this.setState({ inlineEditDescription: state });
    if (state === true) {
      this.setState({ inlineEditDescriptionValue: this.state.recipe.description });
    } else if (action === 'save') {
      const recipe = this.state.recipe;
      recipe.description = this.state.inlineEditDescriptionValue;
      this.setState({ recipe });
      RecipeApi.handleEditDescription(recipe.description);
    } else if (action === 'cancel') {
      // cancel action
    }
  }

  handleChangeDescription(event) {
    this.setState({ inlineEditDescriptionValue: event.target.value });
  }

  render() {
    const activeRevision = this.state.revisions.filter((obj) => obj.active === true)[0];
    const pastRevisions = this.state.revisions.filter((obj) => obj.active === false);
    return (
      <Layout
        className="container-fluid container-pf-nav-pf-vertical"
        ref="layout"
      >
        <ol className="breadcrumb">
          <li><Link to="/recipes">Back to Recipes</Link></li>
          <li className="active"><strong>{this.props.route.params.recipe}</strong></li>
        </ol>
        <div className="cmpsr-title-summary">
          <h1 className="cmpsr-title-summary__item">{this.props.route.params.recipe}</h1>
          <p className="cmpsr-title-summary__item">Current Revision: 3
            {this.state.recipe.description &&
              <span className="text-muted">, {this.state.recipe.description}</span>
            }
          </p>
        </div>
        <Tabs key="pf-tabs" ref="pfTabs" tabChanged={this.handleTabChanged}>
          <Tab tabTitle="Details" active={this.state.activeTab === 'Details'}>
            <div className="row toolbar-pf">
              <div className="col-sm-12">
                <form className="toolbar-pf-actions">
                  <div className="toolbar-pf-action-right">
                    <div className="form-group">
                      <Link
                        to={`/edit/${this.props.route.params.recipe}`}
                        className="btn btn-default"
                      >Edit Recipe</Link>
                      <button
                        className="btn btn-default"
                        id="cmpsr-btn-crt-compos"
                        data-toggle="modal"
                        data-target="#cmpsr-modal-crt-compos"
                        type="button"
                      >Create Composition</button>
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
                          <li><a>Export</a></li>
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
            <div className="tab-container row">
              <div className="col-md-6">
                <dl className="dl-horizontal mt-">
                  <dt>Name</dt>
                  <dd>{this.state.recipe.name}</dd>
                  <dt>Description</dt>
                  {this.state.inlineEditDescription &&
                    <dd>
                      <div className="input-group">
                        <input
                          type="text" className="form-control"
                          value={this.state.inlineEditDescriptionValue}
                          onChange={(e) => this.handleChangeDescription(e)}
                        />
                        <span className="input-group-btn">
                          <button className="btn btn-link" type="button" onClick={() => this.handleEditDescription('save')}>
                            <span className="fa fa-check"></span>
                          </button>
                          <button className="btn btn-link" type="button" onClick={() => this.handleEditDescription('cancel')}>
                            <span className="pficon pficon-close"></span>
                          </button>
                        </span>
                      </div>
                    </dd>
                    ||
                    <dd onClick={() => this.handleEditDescription()}>
                      {this.state.recipe.description}
                      <button className="btn btn-link" type="button">
                        <span className="pficon pficon-edit"></span>
                      </button>
                    </dd>
                  }
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
                  <p><strong>Comments</strong></p>
                  <div className="input-group">
                    <input type="text" className="form-control" />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">Post Comment</button>
                    </span>
                  </div>
                  <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
                    {this.state.comments.map((comment, i) =>
                      <div className="list-group-item" key={i}>
                        <div className="list-view-pf-main-info">
                          <div className="list-view-pf-left" data-item="type">
                            <span
                              className="fa fa-comment-o list-view-pf-icon-sm"
                              aria-hidden="true"
                            ></span>
                          </div>
                          <div className="list-view-pf-body">
                            <div className="list-view-pf-description">
                              <p className="text-muted pull-right">
                                &nbsp;&nbsp;{comment.user},
                                Revision {comment.revision}, {comment.date}
                              </p>
                              <p>{comment.comment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab tabTitle="Components" active={this.state.activeTab === 'Components'}>
            <div className="row">
            {this.state.selectedComponent === '' &&
              <div className="col-sm-12" id="cmpsr-recipe-list">
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
                          >Revision 3<span className="caret"></span></button>
                          <ul className="dropdown-menu">
                            <li><a >Revision 3</a></li>
                            <li><a >Revision 2</a></li>
                            <li><a >Revision 1</a></li>
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
                          <Link
                            to={`/edit/${this.props.route.params.recipe}`}
                            className="btn btn-default"
                          >Edit Recipe</Link>
                          <button
                            className="btn btn-default"
                            id="cmpsr-btn-crt-compos"
                            data-toggle="modal"
                            data-target="#cmpsr-modal-crt-compos"
                            type="button"
                          >Create Composition</button>
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
                              <li><a >Export</a></li>
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
                {this.state.components.length === 0 &&
                  <EmptyState
                    title={'Empty Recipe'}
                    message={'There are no components listed in the recipe. Edit the recipe to add components.'}
                  >
                    <Link to={`/edit/${this.props.route.params.recipe}`}>
                      <button className="btn btn-default btn-primary" type="button">
                        Edit Recipe
                      </button>
                    </Link>
                  </EmptyState>
                ||
                  <RecipeContents
                    components={this.state.components}
                    dependencies={this.state.dependencies}
                    noEditComponent
                    handleComponentDetails={this.handleComponentDetails}
                  />
                }
              </div>
            ||
              <div className="col-sm-12" id="cmpsr-recipe-details">
                <ComponentDetailsView
                  parent={this.props.route.params.recipe}
                  component={this.state.selectedComponent}
                  componentParent={this.state.selectedComponentParent}
                  status={this.state.selectedComponentStatus}
                  handleComponentDetails={this.handleComponentDetails}
                />
              </div>
            }
            </div>
          </Tab>
          <Tab tabTitle="Revisions" active={this.state.activeTab === 'Revisions'}>
            <div className="row toolbar-pf">
              <div className="col-sm-12">
                <form className="toolbar-pf-actions">
                  <div className="toolbar-pf-action-right">
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
            <ListView id="cmpsr-recipe-revisions" >
              <div className="list-group-item list-group-item__separator">
                <div className="list-view-pf-main-info">
                  <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                      <div className="list-group-item-heading">
                        Current Revision
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ListItemExpandRevisions
                listItemParent="cmpsr-recipe-revisions"
                recipe={this.props.route.params.recipe}
                comments={this.state.comments}
                changelog={this.state.changelog}
                compositions={this.state.compositions}
                listItem={activeRevision}
              />
              <div className="list-group-item list-group-item__separator">
                <div className="list-view-pf-main-info">
                  <div className="list-view-pf-body">
                    <div className="list-view-pf-description">
                      <div className="list-group-item-heading">
                        Past Revisions
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {pastRevisions.map((revision, i) =>
                <ListItemExpandRevisions
                  listItemParent="cmpsr-recipe-revisions"
                  recipe={this.props.route.params.recipe}
                  comments={this.state.comments}
                  changelog={this.state.changelog}
                  compositions={this.state.compositions}
                  listItem={revision}
                  key={i}
                />
              )}
            </ListView>
          </Tab>
          <Tab tabTitle="Compositions" active={this.state.activeTab === 'Compositions'}>
            <div className="row toolbar-pf">
              <div className="col-sm-12">
                <form className="toolbar-pf-actions">
                  <div className="toolbar-pf-action-right">
                    <div className="form-group">
                      <Link
                        to={`/edit/${this.props.route.params.recipe}`}
                        className="btn btn-default"
                      >Edit Recipe</Link>
                      <button
                        className="btn btn-default"
                        id="cmpsr-btn-crt-compos"
                        data-toggle="modal"
                        data-target="#cmpsr-modal-crt-compos"
                        type="button"
                      >Create Composition</button>
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
                          <li><a >Export</a></li>
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
            {this.state.compositions.length === 0 &&
              <EmptyState
                title={'No Compositions'}
                message={'No compositions have been created from this recipe.'}
              >
                <button
                  className="btn btn-default"
                  id="cmpsr-btn-crt-compos"
                  data-toggle="modal"
                  data-target="#cmpsr-modal-crt-compos"
                  type="button"
                >
                  Create Composition
                </button>
              </EmptyState>
            ||
              <ListView id="cmpsr-recipe-compositions" >
                {this.state.compositions.map((composition, i) =>
                  <ListItemCompositions
                    listItemParent="cmpsr-recipe-compositions"
                    recipe={this.props.route.params.recipe}
                    listItem={composition}
                    key={i}
                  />
                )}
              </ListView>
            }
          </Tab>
          <Tab tabTitle="Errata" active={this.state.activeTab === 'Errata'}>
            <p>Errata</p>
          </Tab>
        </Tabs>
        <CreateComposition
          recipe={this.state.recipe.name}
          setNotifications={this.setNotifications}
        />
      </Layout>
    );
  }

}

RecipePage.propTypes = {
  route: React.PropTypes.object,
};

export default RecipePage;
