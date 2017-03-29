import React from 'react';
import Layout from '../../components/Layout';
import ProjectListView from '../../components/ListView/ProjectListView';
import constants from '../../core/constants';

class HomePage extends React.Component {

  state = { projects: [] };

  componentWillMount() {
    this.getProjects();
  }

  componentDidMount() {
    document.title = 'Welder | Home';
  }

  getProjects() {
    const that = this;
    fetch(constants.get_projects_url, { credentials: 'same-origin' }).then(r => r.json())
      .then(data => {
        that.setState({ projects: data });
      })
      .catch(e => console.log(`Error getting projects: ${e}`));
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <ProjectListView projects={this.state.projects} />
      </Layout>
    );
  }

}

export default HomePage;
