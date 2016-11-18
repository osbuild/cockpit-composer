import React, { PropTypes } from 'react';

class ComponentInputAdd extends React.Component {

  render() {
    const { recipecomponents } = this.props;

    let addButton = null;
    let index = this.state.recipecomponents.indexOf(component);
    if (index >= 0) {
      addButton = <a href="#" className="add pull-right" data-toggle="tooltip" data-placement="top" title="" data-original-title="Add Component" onClick={(e) => this.props.handleAddComponent(e, component)}><span className="pficon pficon-add-circle-o"></span></a>;
    }

    return (
      <span>
        {addButton}
      </span>
    )
  }

}

export default ComponentInputAdd;
