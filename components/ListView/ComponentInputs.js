import React, { PropTypes } from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';


class ComponentInputs extends React.Component {

  componentDidMount() {
    this.bindPopover();
    this.bindViewDetails();

  }

  componentDidUpdate() {
    this.unbind();
    this.bindPopover();

  }

  componentWillUnmount(){
    this.unbind();
  }

  bindPopover() {
    // click input to view popover
    $("#cmpsr-recipe-inputs").on('click', '.list-group-item', function(event) {
      if(!$(event.target).is("a, a>span")){
        if($(this).is('[aria-describedby]')) {
          $(this).popover('destroy');
        } else {
          $("#cmpsr-recipe-inputs .list-group-item").popover('destroy');
          $(this).popover('show');
        }
      }
    });
  }
  bindViewDetails() {
    // click View Details link in popover
    $("#cmpsr-recipe-inputs").on('click', '.popover-content a', function(event) {
      var selectedPopover = $(this).parents('.popover').attr('id');
			$(this).parents('.popover').popover('destroy');
      var link = $('[aria-describedby="' + selectedPopover + '"] .list-group-item-heading a');
      link.triggerHandler("click");
      // this does not work
    });
  }
  unbind() {
    $("#cmpsr-recipe-inputs").off('click');
  }



  render() {
    const { components } = this.props;

    return (

      <div id="compsr-inputs" className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny">
        {components.map((component,i) =>
          <div key={i} className="list-group-item" data-html="true" title=""
              data-content={"Version <strong data-item='version'>" + component.version + "</strong><br />Release <strong data-item='release'>" + component.release + "</strong><br />Dependencies <strong data-item='requires'>" + component.requires + "</strong><br /><a href='#'>View Details</a>"}>
            <div className="list-view-pf-actions">
              <a href="#" disabled={ component.inRecipe } className="add pull-right" data-toggle="tooltip" data-placement="top" title="" data-original-title="Add Component" onClick={(e) => this.props.handleAddComponent(e, component)}>
                <span className="pficon pficon-add-circle-o"></span>
              </a>
            </div>
            <div className="list-view-pf-main-info">
              <div className="list-view-pf-left" data-item="type">
                <ComponentTypeIcons componentType={ component.type } />
              </div>
              <div className="list-view-pf-body">
                <div className="list-view-pf-description">
                  <div className="list-group-item-heading">
                    <a href="#" data-item="name" onClick={(e) => this.props.handleComponentDetails(e, component)}>{ component.inRecipe } { component.name }</a>
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
