import React from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';

class ComponentSummaryList extends React.Component {

  state = { showAll: false }

  handleShowAll = (event) => {
    // the user clicked a list item in the recipe contents area to expand or collapse
    const showState = !this.state.showAll;
    this.setState({ showAll: showState });
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const listItems = this.state.showAll ? this.props.listItems : this.props.listItems.slice(0, 5);
    return (
      <div className="cmpsr-summary-listview">
        <p>
          <strong>Dependencies</strong>
          <span> ({this.props.listItems.length} First Level, --- Total) </span>
          <a href="#" className="pull-right" onClick={(e) => this.handleShowAll(e)}>
            {`${this.state.showAll ? 'Show Less' : 'Show All'}`}
          </a>
        </p>
        <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
          {listItems.map((listItem, i) =>
            <div className="list-group-item" key={i}>
              <div className="list-view-pf-main-info">
                <div className="list-view-pf-left" data-item="type">
                  <ComponentTypeIcons componentType={listItem.ui_type} />
                </div>
                <div className="list-view-pf-body">
                  <div className="list-view-pf-description">
                    <a href="#" data-item="name">{listItem.name}</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

ComponentSummaryList.propTypes = {
  listItems: React.PropTypes.array,
};

export default ComponentSummaryList;
