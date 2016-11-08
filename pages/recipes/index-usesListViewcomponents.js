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
        <ListViewExpand items={ this.state.recipes } actions={recipeActions} />
      </Layout>
    );
  }

}

export default RecipesPage;
