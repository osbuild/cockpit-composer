import React from "react";
import PropTypes from "prop-types";
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateFooter,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";
import BlueprintWizard from "../Wizard/BlueprintWizard";

const PackagesEmpty = ({ blueprint }) => (
  <EmptyState>
    <EmptyStateHeader
      titleText={
        <>
          <FormattedMessage defaultMessage="No packages selected" />
        </>
      }
      icon={<EmptyStateIcon icon={CubesIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody />
    <EmptyStateFooter>
      <BlueprintWizard isEdit blueprint={blueprint} />
    </EmptyStateFooter>
  </EmptyState>
);

PackagesEmpty.propTypes = {
  blueprint: PropTypes.object,
};

export default PackagesEmpty;
