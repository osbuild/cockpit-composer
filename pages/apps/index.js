import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import ListViewExpand from '../../components/ListView/listview-expand';
import constants from '../../core/constants';

class AppsPage extends React.Component {

  state = { apps: [] };

  componentDidMount() {
    document.title = 'Composer | Recipes';
  }

  componentWillMount() {
    this.getApps();
  }

  getApps() {
    let that = this;
    fetch(constants.get_apps_url).then(r => r.json())
      .then(data => {
        that.setState({apps : data})
      })
      .catch(e => console.log("Booo"));
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <ListViewExpand apps={ this.state.apps }/>
      </Layout>
    );
  }

}

export default AppsPage;
