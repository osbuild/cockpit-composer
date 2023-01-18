import React from "react";
import PropTypes from "prop-types";
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";
import BlueprintWizard from "../Wizard/BlueprintWizard";

const PackagesEmpty = ({ blueprint }) => (
  <EmptyState>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      <FormattedMessage defaultMessage="No packages selected" />
    </Title>
    <EmptyStateBody />
    <BlueprintWizard isEdit blueprint={blueprint} />
  </EmptyState>
);

PackagesEmpty.propTypes = {
  blueprint: PropTypes.object,
};

export default PackagesEmpty;
