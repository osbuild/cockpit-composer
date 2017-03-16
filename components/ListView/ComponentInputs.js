import React from 'react';
import ComponentTypeIcons from '../../components/ListView/ComponentTypeIcons';


class ComponentInputs extends React.Component {

  componentDidMount() {
    this.bindPopover();
    this.bindViewDetails();
    this.initializeBootstrapElements();
  }

  componentDidUpdate() {
    this.unbind();
    this.bindPopover();
    this.bindViewDetails();
    this.initializeBootstrapElements();
    $('#cmpsr-recipe-inputs .list-group-item').popover('destroy');
  }

  componentWillUnmount() {
    this.unbind();
  }

  bindPopover() {
    // click input to view popover
    $('#cmpsr-recipe-inputs').on('click', '.list-group-item', function (event) {
      if (!$(event.target).is('a, a>span')) {
        if ($(this).is('[aria-describedby]')) {
          $(this).popover('destroy');
        } else {
          $('#cmpsr-recipe-inputs .list-group-item').popover('destroy');
          $(this).popover('show');
        }
      }
    });
  }

  unbind() {
    $('#cmpsr-recipe-inputs').off('click');
  }

  bindViewDetails() {
    // click View Details link in popover
    $('#cmpsr-recipe-inputs').on('click', '.popover-content a', function (event) {
      const selectedPopover = $(this).parents('.popover').attr('id');
      const link = $(`[aria-describedby="${selectedPopover}"] .list-group-item-heading a`);
      $(link)[0].click();
      $(this).parents('.popover').popover('destroy');
    });
  }

  initializeBootstrapElements() {
    // Initialize Boostrap-tooltip
    $('[data-toggle="tooltip"]').tooltip();
  }

// TODO add the following after 'requires' after resolving issue where
// duplicate list items are included for multiple builds
// " + component.projects.length + "

  render() {
    const { components } = this.props;

    return (

      <div
        id="compsr-inputs"
        className="list-group list-view-pf list-view-pf-view cmpsr-list-view-viewskinny"
      >
        {components.map((component, i) =>
          <div
            key={i}
            className={`list-group-item ${component.active ? 'active' : ''}`}
            data-html="true"
            title=""
            data-content={
              `Version <strong data-item='version'>${component.version}</strong><br />
                Release <strong data-item='release'>${component.release}</strong><br />
                Dependencies <strong data-item='requires'></strong><br />
                ${component.active ?
                  '<a href="#">Hide Details</a>' : '<a href="#">View Details</a>'}`}
          >
            <div className="list-view-pf-actions">
              <a
                href="#"
                disabled={component.inRecipe}
                className="add pull-right"
                data-toggle="tooltip"
                data-placement="top"
                title=""
                data-original-title="Add Component"
                onClick={(e) => this.props.handleAddComponent(e, 'input', component, [])}
              >
                <span className="pficon pficon-add-circle-o"></span>
              </a>
            </div>
            <div className="list-view-pf-main-info">
              <div className="list-view-pf-left" data-item="type">
                <ComponentTypeIcons componentType={component.ui_type} />
              </div>
              <div className="list-view-pf-body">
                <div className="list-view-pf-description">
                  <div className="list-group-item-heading">
                    <a
                      href="#"
                      data-item="name"
                      onClick={(e) => this.props.handleComponentDetails(e, component)}
                    >{component.name}</a>
                  </div>
                  <div
                    className="list-group-item-text"
                    data-item="summary"
                  >{component.summary}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

}

export default ComponentInputs;
