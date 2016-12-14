import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';

class ComponentSummaryList extends React.Component {

  render() {
    const { dependencyCount, dependencyList } = this.props;
    if (dependencyCount > 0) {
      return (
        <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
          {dependencyList.map((component,i) =>
            <div key={i} className="list-group-item" data-html="true" title=""
                data-content={"Version <strong data-item='version'>" + component.version + "</strong><br />Release <strong data-item='release'>" + component.release + "</strong><br />Dependencies <strong data-item='requires'>" + component.requires + "</strong><br /><a href='#'>View Details</a>"}>
              <div className="list-view-pf-main-info">
                <div className="list-view-pf-left" data-item="type">
                  <ComponentTypeIcons componentType={ component.type } />
                </div>
                <div className="list-view-pf-body">
                  <div className="list-view-pf-description">
                    <div className="list-group-item-heading">
                      <a href="#" data-item="name">{ component.name }</a>
                    </div>
                    <div className="list-group-item-text" data-item="summary">{ component.summary }</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="list-group-item">
            <div className="list-view-pf-main-info">
              <div className="list-view-pf-left" data-item="type">
                <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
              </div>
              <div className="list-view-pf-body">
                <div className="list-view-pf-description">
                  <div className="list-group-item-heading">
                    <a href="#" data-item="name">fm-group:rpm-development-tools</a>
                  </div>
                  <div className="list-group-item-text" data-item="summary">These tools include core development tools such rpmbuild.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ComponentSummaryList;
