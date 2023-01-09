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
} from "./steps";
import { hostnameValidator, filesystemValidator } from "./validators";
import { selectAllImageTypes } from "../../slices/imagesSlice";
import { updateBlueprint } from "../../slices/blueprintsSlice";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import Packages from "./formComponents/Packages";
import Review from "./formComponents/Review";
import TextFieldCustom from "./formComponents/TextFieldCustom";
import FileSystemConfigToggle from "./formComponents/FileSystemConfigToggle";
import FileSystemConfiguration from "./formComponents/FileSystemConfiguration";
import TextInputGroupWithChips from "./formComponents/TextInputGroupWithChips";
import { UNIT_GIB } from "../../constants";
import UploadFile from "./formComponents/UploadFile";

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
    const blueprintData = stateToBlueprint(formValues);
    dispatch(updateBlueprint(blueprintData));
    handleClose();
  };

  const blueprintToState = (blueprint) => {
    const formState = {
      blueprint: {},
      customizations: {
        user: [],
        filesystem: [],
      },
      "selected-packages": [],
      "filesystem-toggle": "auto",
    };
    formState.blueprint = blueprint;
    formState.customizations = {
      ...blueprint.customizations,
      user: blueprint.customizations?.user?.map((user) => ({
        name: user?.name,
        password: user?.password,
        key: user?.key,
        isAdmin: user?.groups.includes("wheel"),
      })),
    };
    if (blueprint.customizations?.filesystem) {
      formState.customizations.filesystem =
        blueprint.customizations.filesystem.map((fs) => ({
          mountpoint: fs?.mountpoint,
          // default to using GBs
          size: fs?.minsize / UNIT_GIB,
          unit: UNIT_GIB,
        }));
      formState["filesystem-toggle"] = "manual";
    }

    formState["selected-packages"] = blueprint.packages?.map(
      (pkg) => pkg?.name
    );
    return formState;
  };

  const stateToCustomizations = (customizations) => {
    // the form state of these matches the api state
    const {
      hostname,
      kernel,
      sshkey,
      group,
      timezone,
      locale,
      services,
      installation_device,
      fdo,
      openscap,
      firewall,
      ignition,
    } = customizations;

    // Parse the user field
    const parseUser = (formUser) => {
      return {
        name: formUser.name,
        password: formUser.password,
        groups: formUser.isAdmin ? ["wheel"] : [],
        key: formUser.key,
      };
    };
    const user = customizations.user ? customizations.user.map(parseUser) : [];

    // Parse the filesystem field
    const parseFilesystem = (formMount) => {
      return {
        mountpoint: formMount.mountpoint,
        minsize: formMount.size * formMount.unit,
      };
    };
    const filesystem = customizations.filesystem
      ? customizations.filesystem.map(parseFilesystem)
      : [];

    // Combine the parsed fields with the rest of the customizations
    const customizationsParsed = {
      hostname,
      kernel,
      sshkey,
      user,
      group,
      installation_device,
      firewall,
      filesystem,
      ignition,
    };

    if (openscap.length) {
      customizationsParsed.openscap = openscap;
    }
    if (fdo.length) {
      customizationsParsed.fdo = fdo;
    }
    if (timezone.length) {
      customizationsParsed.timezone = timezone;
    }
    if (locale.length) {
      customizationsParsed.locale = locale;
    }
    if (services.length) {
      customizationsParsed.services = services;
    }

    return customizationsParsed;
  };

  const stateToBlueprint = (formValues) => {
    const packages = formValues?.["selected-packages"]?.length
      ? formValues["selected-packages"].map((pkg) => ({
          name: pkg,
        }))
      : [];

    const customizations = formValues?.customizations
      ? stateToCustomizations(formValues?.customizations)
      : undefined;

    const blueprint = {
      ...formValues.blueprint,
      customizations,
      packages,
    };
    return blueprint;
  };

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
          initialValues={
            props.isEdit ? blueprintToState(props.blueprint) : undefined
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
