// Copied from https://github.com/RedHatInsights/image-builder-frontend

import React, { useEffect, useState } from "react";

import useFieldApi from "@data-driven-forms/react-form-renderer/use-field-api";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import { ToggleGroup, ToggleGroupItem } from "@patternfly/react-core";
import { useIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  toggleLabel: {
    defaultMessage: "Automatic partitioning toggle",
  },
  auto: {
    defaultMessage: "Use automatic partitioning",
  },
  manual: {
    defaultMessage: "Manually configure partitions",
  },
});

const FileSystemConfigToggle = ({ ...props }) => {
  const intl = useIntl();
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const [selected, setSelected] = useState(
    getState()?.values?.["filesystem-toggle"] || "auto"
  );

  useEffect(() => {
    change(input.name, selected);
  }, [selected]);

  const onClick = (_, evt) => {
    setSelected(evt.currentTarget.id);
  };

  return (
    <>
      <ToggleGroup aria-label={intl.formatMessage(messages.toggleLabel)}>
        <ToggleGroupItem
          onChange={onClick}
          text={intl.formatMessage(messages.auto)}
          buttonId="auto"
          isSelected={selected === "auto"}
        />
        <ToggleGroupItem
          onChange={onClick}
          text={intl.formatMessage(messages.manual)}
          buttonId="manual"
          isSelected={selected === "manual"}
          data-testid="filesystem-toggle-manual"
        />
      </ToggleGroup>
    </>
  );
};

export default FileSystemConfigToggle;
