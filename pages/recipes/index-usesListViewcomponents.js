import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import ListViewExpand from '../../components/ListView/ListViewExpand';
import ListViewExpRow from '../../components/ListView/ListViewExpRow';
import Actions from '../../components/Actions/Actions';
import constants from '../../core/constants';

var recipeActions = [
	  {
	    label: "Edit Recipe",
	    type: "button",
	    inlistview: true
	  },
    {
	    label: "Create Composition",
	    type: "button",
	    inlistview: true
	  }
    // ,
    // {
	  //   label: "Update All Components",
	  //   type: "menu",
	  //   inlistview: false
	  // },
    // {
	  //   label: "Export Recipe",
	  //   type: "menu",
	  //   inlistview: true
	  // },
    // {
	  //   label: "Delete Recipe",
	  //   type: "button",
	  //   inlistview: true
	  // }
  ]

class RecipesPage extends React.Component {

  state = { recipes: [] };

  componentDidMount() {
    document.title = 'Composer | Recipes';
  }

  componentWillMount() {
    this.getRecipes();
  }

  getRecipes() {
    // The /recipes/list response looks like:
    // {"recipes":["example","http-server","nfs-server"],"offset":0,"limit":20}
    fetch(constants.get_recipes_list).then(r => r.json())
      .then(listdata => {
        for (var i in data.recipes) {
            fetch(constants.get_recipes_info + listdata.recipes[i])
                .then(r => r.json())
                .then(recipedata => {
                    // data returned is of form {"<recipe name>": {<recipe>}}, just return recipe
                    this.setState(
                        { recipes: this.state.recipes.concat(recipedata[0]) }
                    );
                });
            }
      })
      .catch(e => console.log("Error getting recipe list: " + e));
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <ListViewExpand items={ this.state.recipes } actions={recipeActions} />
      </Layout>
    );
  }

}

export default RecipesPage;
