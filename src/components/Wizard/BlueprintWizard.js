import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@patternfly/react-core";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import {
  blueprintDetails,
  fdo,
  filesystem,
  kernel,
  packages,
  review,
  users,
  services,
  firewall,
  groups,
  sshkeys,
  timezone,
  locale,
  other,
  ignition,
  openscap,
} from "../../forms/steps";
import { hostnameValidator, filesystemValidator } from "../../forms/validators";
import { selectAllImageTypes } from "../../slices/imagesSlice";
import { updateBlueprint } from "../../slices/blueprintsSlice";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import Packages from "../../forms/components/Packages";
import Review from "../../forms/components/Review";
import TextFieldCustom from "../../forms/components/TextFieldCustom";
import FileSystemConfigToggle from "../../forms/components/FileSystemConfigToggle";
import FileSystemConfiguration from "../../forms/components/FileSystemConfiguration";
import TextInputGroupWithChips from "../../forms/components/TextInputGroupWithChips";
import UploadFile from "../../forms/components/UploadFile";
import { blueprintToFormState, formStateToBlueprint } from "../../helpers";

const messages = defineMessages({
  editBlueprint: {
    defaultMessage: "Edit blueprint",
  },
  createBlueprint: {
    defaultMessage: "Create blueprint",
  },
  save: {
    defaultMessage: "Save",
  },
  create: {
    defaultMessage: "Create",
  },
});

const BlueprintWizard = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const getImageTypes = () =>
    useSelector((state) => selectAllImageTypes(state));
  const imageTypes = getImageTypes();

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleClose = () => {
    setIsWizardOpen(false);
  };

  const handleOpen = () => {
    setIsWizardOpen(true);
  };

  const handleSaveBlueprint = (formValues) => {
    const blueprintData = formStateToBlueprint(formValues);
    dispatch(updateBlueprint(blueprintData));
    handleClose();
  };

  return (
    <>
      {props.isEdit ? (
        <Button variant="secondary" onClick={handleOpen}>
          <FormattedMessage defaultMessage="Edit blueprint" />
        </Button>
      ) : (
        <Button variant="plain" onClick={handleOpen}>
          <FormattedMessage defaultMessage="Create blueprint" />
        </Button>
      )}
      {isWizardOpen && (
        <FormRenderer
          initialValues={
            props.isEdit ? blueprintToFormState(props.blueprint) : undefined
          }
          blueprint={props.blueprint}
          imageTypes={imageTypes}
          FormTemplate={(props) => (
            <Pf4FormTemplate {...props} showFormControls={false} />
          )}
          onSubmit={(formValues) => handleSaveBlueprint(formValues)}
          validatorMapper={{ hostnameValidator, filesystemValidator }}
          componentMapper={{
            ...componentMapper,
            "package-selector": Packages,
            review: Review,
            "text-field-custom": TextFieldCustom,
            "filesystem-toggle": FileSystemConfigToggle,
            "filesystem-configuration": FileSystemConfiguration,
            "text-input-group-with-chips": TextInputGroupWithChips,
            "upload-file": UploadFile,
          }}
          onCancel={handleClose}
          schema={{
            fields: [
              {
                component: componentTypes.WIZARD,
                name: "blueprint-wizard",
                inModal: true,
                showTitles: true,
                title: props.isEdit
                  ? intl.formatMessage(messages.editBlueprint)
                  : intl.formatMessage(messages.createBlueprint),
                buttonLabels: {
                  submit: props.isEdit
                    ? intl.formatMessage(messages.save)
                    : intl.formatMessage(messages.create),
                },
                onKeyDown: (event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                },
                fields: [
                  blueprintDetails(intl),
                  packages(intl),
                  kernel(intl),
                  filesystem(intl),
                  services(intl),
                  firewall(intl),
                  users(intl),
                  groups(intl),
                  sshkeys(intl),
                  timezone(intl),
                  locale(intl),
                  other(intl),
                  fdo(intl),
                  openscap(intl),
                  ignition(intl),
                  review(intl),
                ],
              },
            ],
          }}
        />
      )}
    </>
  );
};

BlueprintWizard.propTypes = {
  blueprint: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default BlueprintWizard;
