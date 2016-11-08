import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import ProjectListView from '../../components/ListView/ProjectListView';
import constants from '../../core/constants';

class HomePage extends React.Component {

  state = { projects: [] };

  componentDidMount() {
    document.title = 'Composer | Home';
  }

  componentWillMount() {
    this.getProjects();
  }

  getProjects() {
    let that = this;
    fetch(constants.get_projects_url).then(r => r.json())
      .then(data => {
        that.setState({projects : data})
      })
      .catch(e => console.log("Booo"));
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <ProjectListView projects={ this.state.projects }/>
      </Layout>
    );
  }

}

export default HomePage;
