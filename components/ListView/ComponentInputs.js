import React, { PropTypes } from 'react';

class ComponentInputs extends React.Component {

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

      <div id="compsr-inputs" className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
        {components.map((component,i) =>
          <div className="list-group-item">
            <div className="list-view-pf-actions">
              <a href="#" className="add pull-right" data-toggle="tooltip" data-placement="top" title="" data-original-title="Add Component">
                <span className="pficon pficon-add-circle-o"></span>
              </a>
            </div>
            <div className="list-view-pf-main-info">
              <div className="list-view-pf-left" data-item="type">
                <span className="fa fa-cube list-view-pf-icon-sm" title="Module"></span>
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
      </div>
    )
  }

}

export default ComponentInputs;
