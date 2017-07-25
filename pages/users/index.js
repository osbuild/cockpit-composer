import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import CardView from '../../components/CardView/CardView';
import { connect } from 'react-redux';
import { fetchingUsers } from '../../core/actions/users';

class UsersPage extends React.Component {

  componentWillMount() {
    this.props.fetchingUsers();
  }

  componentDidMount() {
    document.title = 'Users';
  }

  render() {
    const { users } = this.props;
    if (users.length) {
      return (
        <Layout>
          <div className="container-fluid container-pf-nav-pf-vertical container-cards-pf">
            <CardView users={users} />
          </div>
        </Layout>
      );
    }
    return (
      <Layout>
        <div className="container-fluid container-pf-nav-pf-vertical container-cards-pf">
        </div>
      </Layout>
    );
  }
}

UsersPage.propTypes = {
  fetchingUsers: PropTypes.func,
  users: PropTypes.array,
};

const mapStateToProps = (state) => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
  fetchingUsers: () => {
    dispatch(fetchingUsers());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
