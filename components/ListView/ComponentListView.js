import React, { PropTypes } from 'react';

class ComponentListView extends React.Component {

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
    // click the list-view heading then expand a row
    $(".list-group-item-header").click(function(event){
      if(!$(event.target).is("button, a, input, .fa-ellipsis-v")){
        $(this).find(".fa-angle-right").toggleClass("fa-angle-down")
          .end().parent().toggleClass("list-view-pf-expand-active")
          .find(".list-group-item-container").toggleClass("hidden");
      }
    });

    // click the close button, hide the expand row and remove the active status
    $(".list-group-item-container .close").on("click", function (){
      $(this).parent().addClass("hidden")
        .parent().removeClass("list-view-pf-expand-active")
        .find(".fa-angle-right").removeClass("fa-angle-down");
    });
  }

  unbind() {
    $(".list-group-item-header").off('click');
    $(".list-group-item-container .close").off('click');
  }

  render() {
    const { components } = this.props; // eslint-disable-line no-use-before-define

    return (

      <div className="list-group list-view-pf list-view-pf-view">

        {components.map((component,i) =>
          <div className="list-group-item" key={i}>
            <div className="list-group-item-header">
              <div className="list-view-pf-expand">
                <span className="fa fa-angle-right"></span>
              </div>
              <div className="list-view-pf-checkbox">
                <input type="checkbox" />
              </div>
              <div className="list-view-pf-actions">
                <div className="dropdown pull-right dropdown-kebab-pf">
                  <button className="btn btn-link dropdown-toggle" type="button" id="dropdownKebabRight9" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span className="fa fa-ellipsis-v"></span></button>
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownKebabRight9">
                    <li><a href="#">View</a></li>
                    <li><a href="#">Update</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">Remove</a></li>
                  </ul>
                </div>
              </div>
              <div className="list-view-pf-main-info">
                <div className="list-view-pf-left">
                  <span className="fa fa-cube list-view-pf-icon-sm"></span>
                </div>
                <div className="list-view-pf-body">
                  <div className="list-view-pf-description">
                    <div className="list-group-item-heading">
                      { component.name }
                    </div>
                    <div className="list-group-item-text">
                      { component.summary }
                    </div>
                  </div>
                  <div className="list-view-pf-additional-info">
    			          <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
    			            Version <strong>{ component.version }</strong>
    			          </div>
                    <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
    			            Release <strong>{ component.release }</strong>
    			          </div>
    			          <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
    			            Lifecycle<strong>01/15/2017</strong>
    			          </div>
                    <div className="list-view-pf-additional-info-item list-view-pf-additional-info-item-stacked">
    			            Dependencies <strong>{ component.requires }</strong>
    			          </div>
    			        </div>
                </div>
              </div>
            </div>

            <div className="list-group-item-container container-fluid hidden">
              <div className="close hidden">
                <span className="pficon pficon-close"></span>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <dl className="dl-horizontal">
                    <dt>Version</dt>
                    <dd>{ component.version }</dd>
                    <dt>Release</dt>
                    <dd>{ component.release }</dd>
                    <dt>Lifecycle</dt>
                    <dd>01/15/2017</dd>
                    <dt>Support Level</dt>
                    <dd>Basic</dd>
                    <dt>Dependencies</dt>
                    <dd>2</dd>
                  </dl>
                  <strong>Errata</strong>
                  <ul>
                    <li><a>RHBA-2016:1641 RHEL Atomic OSTree Update 7.2.6-1</a></li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <strong>2 Dependencies</strong>
                  <div className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">

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
                    <div className="list-group-item">
                      <div className="list-view-pf-main-info">
                        <div className="list-view-pf-left" data-item="type">
                          <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
                        </div>
                        <div className="list-view-pf-body">
                          <div className="list-view-pf-description">
                            <div className="list-group-item-heading">
                              <a href="#" data-item="name">fm-group:kde-education</a>
                            </div>
                            <div className="list-group-item-text" data-item="summary">KDE Educational applications</div>
                          </div>
                        </div>
                      </div>
                    </div>

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

export default ComponentListView;
