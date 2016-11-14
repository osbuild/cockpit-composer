import React, { PropTypes } from 'react';

class Actions extends React.Component {

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
    // include js for dropdown kebab
  }

  unbind() {
    $(".list-group-item-header").off('click');
    $(".list-group-item-container .close").off('click');
  }

  render() {
    // const { Buttons } = this.props;
    // const { MenuItems } = this.props;
    const { className } = this.props;
    const { actions } = this.props;

    return (
      <div className={className}>
        {actions.map((action,i) =>
          <button className="btn btn-default">{ action.label }</button>
        )}
        <div className="dropdown dropdown-kebab-pf pull-right">
          <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebab" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <span className="fa fa-ellipsis-v"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebab">
            {actions.map((action,i) =>
              <li><a href="#">{ action.label }</a></li>
            )}
          </ul>
        </div>
      </div>
    )
  }


}

export default Actions;
