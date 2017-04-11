import React from 'react';
import Layout from '../../components/Layout';
import constants from '../../core/constants';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = 'Home';
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        
      </Layout>
    );
  }

}

export default HomePage;
