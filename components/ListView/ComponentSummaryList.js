import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';
import constants from '../../core/constants';

class ComponentSummaryList extends React.Component {

  // state = { dependencies: []}

  // componentWillMount() {
  //   this.getDependencies();
  // }
  // getDependencies() {
  //   fetch(constants.get_dependencies_list + this.props.component).then(r => r.json())
  //     .then(data => {
  //       let dependencies = [];
  //       data.modules.map(i => {
  //         dependencies = dependencies.concat(i.projects);
  //       });
  //       this.setState({dependencies: dependencies});
  //     })
  //     .catch(e => console.log("no dependencies"));
  // }

  render() {
      return (
        <div className="cmpsr-summary-listview">
          <p><strong>Dependencies</strong> ({this.props.listItems.length} First Level, n Total)</p>
          <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
            {this.props.listItems.map((listItem, i) =>
              <div className="list-group-item" key={i}>
                <div className="list-view-pf-main-info">
                  <div className="list-view-pf-left" data-item="type">
                    <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
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

export default ComponentSummaryList;
