import React from 'react';
import Layout from '../../components/Layout';
// import constants from '../../core/constants';

class HomePage extends React.Component {

  componentDidMount() {
    document.title = 'Home';
  }

  render() {
    return (
      <Layout className="container-fluid container-pf-nav-pf-vertical">
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <h3>The product we are testing today will simplify the construction and
            maintenance of &ldquo;gold images&rdquo; across a variety of deployment platforms.
            </h3>
            <p>We use the following terminology:</p>
            <dl className="dl-horizontal">
              <dt>Recipe</dt>
              <dd>Lists the contents that will be included in the gold image
              when it is generated.</dd>
              <dt>Composition</dt>
              <dd>The gold image itself, which can be produced in a
              variety of output formats.</dd>
            </dl>
            <p><em>Thank you for your help.</em></p>
          </div>
        </div>
      </Layout>
    );
  }

}

export default HomePage;
