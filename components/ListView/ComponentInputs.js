import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";
import shortid from "shortid";
import ComponentTypeIcons from "./ComponentTypeIcons";

const messages = defineMessages({
  hideDetails: {
    defaultMessage: "Hide Details"
  },
  showDetails: {
    defaultMessage: "Show Details and More Options"
  }
});

class ComponentInputs extends React.Component {
  componentDidMount() {
    this.initializeBootstrapElements();
    this.bindTooltipShow();
    this.bindHideTooltip();
    this.bindTooltipMouseleave();
  }

  componentDidUpdate() {
    this.unbind();
    this.initializeBootstrapElements();
    this.bindTooltipShow();
    this.bindHideTooltip();
    this.bindTooltipMouseleave();
    this.hideTooltip("all");
  }

  componentWillUnmount() {
    this.unbind();
    this.hideTooltip("all");
  }

  bindTooltipShow() {
    $(".cmpsr-list-inputs")
      .off()
      .on("mouseenter focus", '[data-toggle="tooltip"]', event => {
        // prevent li tooltip from flashing when focus moves to the <a>
        event.stopPropagation();
        // hide tooltip for other list items
        if ($(event.currentTarget).hasClass("list-pf-container")) {
          $('.list-pf-container[data-toggle="tooltip"]')
            .not(event.target)
            .tooltip("hide");
        }
        // hide tooltip for component list item if hovering over an action
        if ($(event.currentTarget).parent(".list-pf-actions").length) {
          this.hideTooltip("parent");
        }
        $(event.currentTarget).tooltip("show");
      });
  }

  bindHideTooltip() {
    $(".cmpsr-list-inputs").on("blur mousedown", '[data-toggle="tooltip"]', event => {
      // prevent focus event so that tooltip doesn't display again on click
      event.preventDefault();
      this.hideTooltip(event.currentTarget);
    });
  }

  bindTooltipMouseleave() {
    $(".cmpsr-list-inputs").on("mouseleave", '[data-toggle="tooltip"]', event => {
      this.hideTooltip(event.currentTarget);
      if ($(event.currentTarget).parent(".list-pf-actions").length) {
        $(event.currentTarget)
          .parents(".list-pf-container")
          .tooltip("show");
      }
    });
  }

  unbind() {
    $(".list-pf-actions").off("mouseenter focus mouseleave blur mousedown");
  }

  hideTooltip(target) {
    if (target === "all") {
      $('.cmpsr-list-inputs [data-toggle="tooltip"][aria-describedby]').tooltip("hide");
    } else if (target === "parent") {
      $('.list-pf-container[data-toggle="tooltip"][aria-describedby]').tooltip("hide");
    } else {
      $(target).tooltip("hide");
    }
  }

  initializeBootstrapElements() {
    // Initialize Boostrap-tooltip
    $('[data-toggle="tooltip"]').tooltip({
      trigger: "manual"
    });
  }

  handleEnterKey(event, component) {
    if (event.which === 13 || event.keyCode === 13) {
      const { handleComponentDetails } = this.props;
      handleComponentDetails(event, component);
    }
  }

  render() {
    const { components } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <div className="list-pf cmpsr-list-inputs cmpsr-list-pf__compacted list-pf-stacked">
        {components.map(component => (
          <div
            key={shortid.generate()}
            className={`list-pf-item ${component.active ? "active" : ""}`}
            data-input={component.name}
          >
            <div
              className="list-pf-container"
              role="menuitem"
              tabIndex="0"
              data-toggle="tooltip"
              data-trigger="manual"
              data-placement="top"
              title=""
              data-original-title={
                component.active ? formatMessage(messages.hideDetails) : formatMessage(messages.showDetails)
              }
              onClick={e => this.props.handleComponentDetails(e, component)}
              onKeyPress={e => this.handleEnterKey(e, component)}
            >
              <div className="list-pf-content list-pf-content-flex ">
                <div className="list-pf-left">
                  <ComponentTypeIcons
                    componentType={component.ui_type}
                    componentInBlueprint={component.inBlueprint}
                    isSelected={component.userSelected}
                  />
                </div>
                <div className="list-pf-content-wrapper">
                  <div className="list-pf-main-content">
                    <div className="list-pf-title ">{component.name}</div>
                    <div className="list-pf-description ">{component.summary}</div>
                  </div>
                </div>
                <div className="list-pf-actions">
                  {(component.inBlueprint === true && component.userSelected === true && (
                    <a
                      href="#"
                      className="btn btn-link"
                      data-toggle="tooltip"
                      data-trigger="manual"
                      data-html="true"
                      data-placement="top"
                      title=""
                      data-original-title="Remove Component from Blueprint"
                      onClick={e => this.props.handleRemoveComponent(e, component.name)}
                    >
                      <span className="fa fa-minus" />
                    </a>
                  )) || (
                    <a
                      href="#"
                      className="btn btn-link"
                      data-toggle="tooltip"
                      data-trigger="manual"
                      data-html="true"
                      data-placement="top"
                      title=""
                      data-original-title={`Add Component<br />
                            Version&nbsp;<strong>${component.version}</strong>
                            Release&nbsp;<strong>${component.release}</strong>`}
                      onClick={e => this.props.handleAddComponent(e, component, component.version)}
                    >
                      <span className="fa fa-plus" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ComponentInputs.propTypes = {
  components: PropTypes.arrayOf(PropTypes.object),
  handleComponentDetails: PropTypes.func,
  handleAddComponent: PropTypes.func,
  handleRemoveComponent: PropTypes.func,
  intl: intlShape.isRequired
};

ComponentInputs.defaultProps = {
  components: [],
  handleComponentDetails: function() {},
  handleAddComponent: function() {},
  handleRemoveComponent: function() {}
};

export default injectIntl(ComponentInputs);
