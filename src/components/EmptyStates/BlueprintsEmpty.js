import React from "react";
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

const BlueprintsEmpty = () => (
  <EmptyState>
    <EmptyStateHeader
      titleText={
        <>
          <FormattedMessage defaultMessage="No blueprints" />
        </>
      }
      icon={<EmptyStateIcon icon={CubesIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody />
    <EmptyStateFooter>
      <BlueprintWizard />
    </EmptyStateFooter>
  </EmptyState>
);

export default BlueprintsEmpty;
