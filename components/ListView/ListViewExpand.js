import React, { PropTypes } from 'react';
import ListViewExpRow from '../../components/ListView/ListViewExpRow';
import Actions from '../../components/Actions/Actions';

var random = "random text";


class ListViewExpand extends React.Component {

  componentDidMount() {
    this.bindExpand();
  }

  componentDidUpdate() {
    this.unbind();
    this.bindExpand();
  }

  componentWillUnmount(){
    this.unbind();
  }

  bindExpand() {

  }



  render() {
    const { items } = this.props; // eslint-disable-line no-use-before-define
    const { actions } = this.props;
    const { text } = "text";

    return (
      <div className="list-group list-view-pf list-view-pf-view">
        <p>{ random }</p>
        <ListViewExpRow items={items} actions = { actions } />
        <Actions className={"list-view-pf-actions"} actions = { actions } />
      </div>
    )
  }


}

export default ListViewExpand;

// Note: removing one of the components, actions or list view exp row, will result in this page rendering
