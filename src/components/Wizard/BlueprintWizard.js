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
  reviewBlueprint,
} from "../../forms/steps";
import {
  hostnameValidator,
  filesystemValidator,
  blueprintNameValidator,
} from "../../forms/validators";
import { selectAllImageTypes } from "../../slices/imagesSlice";
import {
  selectAllBlueprintNames,
  updateBlueprint,
} from "../../slices/blueprintsSlice";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import Packages from "../../forms/components/Packages";
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
});

const BlueprintWizard = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const getImageTypes = () =>
    useSelector((state) => selectAllImageTypes(state));
  const imageTypes = getImageTypes();

  const getBlueprintNames = () =>
    useSelector((state) => selectAllBlueprintNames(state));
  const blueprintNames = getBlueprintNames();

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleClose = () => {
    setIsWizardOpen(false);
  };

  const handleOpen = () => {
    setIsWizardOpen(true);
  };

  const handleSaveBlueprint = (formValues, formApi) => {
    // this is necessary because swapping steps doesn't always update the formValues but calling getState() provides them
    // the key check is necessary because the formvalues object can contain an undefined key value of {undefined: undefined}
    // the reason it is a string "undefined" is because javascript
    const formState =
      Object.keys(formValues)[0] !== "undefined"
        ? formValues
        : formApi.getState().values;
    const blueprintData = formStateToBlueprint(formState);
    dispatch(updateBlueprint(blueprintData));
    handleClose();
    window.location.href = `#/${blueprintData.name}`;
  };

  const initialValues = props.isEdit
    ? blueprintToFormState(props.blueprint)
    : {};
  // Used for blueprint name validation
  initialValues["blueprint-names"] = blueprintNames;
  initialValues["isEdit"] = props.isEdit;

  return (
    <>
      <Button variant="secondary" onClick={handleOpen}>
        {props.isEdit ? (
          <FormattedMessage defaultMessage="Edit blueprint" />
        ) : (
          <FormattedMessage defaultMessage="Create blueprint" />
        )}
      </Button>
      {isWizardOpen && (
        <FormRenderer
          initialValues={initialValues}
          blueprint={props.blueprint}
          imageTypes={imageTypes}
          FormTemplate={(props) => (
            <Pf4FormTemplate {...props} showFormControls={false} />
          )}
          onSubmit={(formValues, formApi) =>
            handleSaveBlueprint(formValues, formApi)
          }
          validatorMapper={{
            hostnameValidator,
            filesystemValidator,
            blueprintNameValidator,
          }}
          componentMapper={{
            ...componentMapper,
            "package-selector": Packages,
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
                  submit: intl.formatMessage(messages.save),
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
                  reviewBlueprint(intl),
                ],
                initialState: {
                  activeStep: "blueprint-details",
                  activeStepIndex: 0,
                  prevSteps: [
                    "blueprint-details",
                    "packages",
                    "kernel",
                    "filesystem",
                    "services",
                    "firewall",
                    "users",
                    "groups",
                    "sshkeys",
                    "timezone",
                    "locale",
                    "other",
                    "fdo",
                    "openscap",
                    "ignition",
                    "review-blueprint",
                  ],
                  maxStepIndex: 15,
                },
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
