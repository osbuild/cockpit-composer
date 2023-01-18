import React from "react";
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import { FormattedMessage } from "react-intl";
import BlueprintWizard from "../Wizard/BlueprintWizard";

const BlueprintsEmpty = () => (
  <EmptyState>
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
      <FormattedMessage defaultMessage="No blueprints" />
    </Title>
    <EmptyStateBody />
    <BlueprintWizard />
  </EmptyState>
);

export default BlueprintsEmpty;
