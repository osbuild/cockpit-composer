import React, { PropTypes } from 'react';

class ProjectListView extends React.Component {

  render() {
    const { projects } = this.props;

    return (
      <div className="list-group list-view-pf list-view-pf-view">

        {projects.map((project,i) =>
          <div className="list-group-item" key={i}>

            <div className="list-view-pf-actions">
              <button className="btn btn-default">Action</button>
            </div>

            <div className="list-view-pf-main-info">
              <div className="list-view-pf-left">
                <span className="fa fa-plane list-view-pf-icon-sm"></span>
              </div>
              <div className="list-view-pf-body">
                <div className="list-view-pf-description">
                  <div className="list-group-item-heading">
                    { project.name }
                  </div>
                </div>
                <div className="list-view-pf-additional-info">
                  <div className="list-view-pf-additional-info-item">
                    <span className="pficon pficon-screen"></span>
                    <strong>8</strong> Hosts
                  </div>
                  <div className="list-view-pf-additional-info-item">
                    <span className="pficon pficon-cluster"></span>
                    <strong>6</strong> Clusters
                  </div>
                  <div className="list-view-pf-additional-info-item">
                    <span className="pficon pficon-container-node"></span>
                    <strong>10</strong> Nodes
                  </div>
                  <div className="list-view-pf-additional-info-item">
                    <span className="pficon pficon-image"></span>
                    <strong>8</strong> Images
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    )
  }

}

export default ProjectListView;
