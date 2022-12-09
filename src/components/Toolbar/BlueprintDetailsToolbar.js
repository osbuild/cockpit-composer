import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarGroup,
} from "@patternfly/react-core";

import CreateImageWizard from "../Wizard/CreateImageWizard";
import BlueprintWizard from "../Wizard/BlueprintWizard";

const BlueprintDetailsToolbar = (props) => {
  return (
    <Toolbar className="pf-u-pb-0">
      <ToolbarContent className="pf-u-px-0">
        <ToolbarGroup
          alignment={{ default: "alignLeft" }}
          className="pf-u-align-self-baseline"
        >
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to={"/"}>Back to blueprints</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{props.blueprint?.name}</BreadcrumbItem>
          </Breadcrumb>
        </ToolbarGroup>
        <ToolbarGroup
          variant="button-group"
          alignment={{ default: "alignRight" }}
        >
          <ToolbarItem>
            <BlueprintWizard isEdit blueprint={props.blueprint} />
          </ToolbarItem>
          <ToolbarItem>
            <CreateImageWizard blueprint={props.blueprint} />
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
};

BlueprintDetailsToolbar.propTypes = {
  blueprint: PropTypes.object,
};

export default BlueprintDetailsToolbar;
