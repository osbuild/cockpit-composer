import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@patternfly/react-core";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import {
  blueprintDetails,
  fdo,
  system,
  packages,
  review,
  users,
} from "./steps";
import { hostnameValidator } from "./validators";
import { selectAllImageTypes } from "../../slices/imagesSlice";
import { updateBlueprint } from "../../slices/blueprintsSlice";

import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import Pf4FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import { componentMapper } from "@data-driven-forms/pf4-component-mapper";
import Packages from "./formComponents/Packages";
import Review from "./formComponents/Review";
import TextFieldCustom from "./formComponents/TextFieldCustom";

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
      },
    };
    formState.blueprint = blueprint;
    formState.customizations = {
      ...blueprint.customizations,
      user: blueprint.customizations?.user?.map((user) => {
        return {
          name: user?.name,
          password: user?.password,
          key: user?.key,
          isAdmin: user?.groups.includes("wheel"),
        };
      }),
    };

    formState["selected-packages"] = blueprint.packages.map((pkg) => pkg.name);

    return formState;
  };

  const stateToCustomizations = (customizations) => {
    // "hostname": string,
    const hostname = customizations.hostname;

    // "kernel": KernelCustomization,
    const kernel = {
      name: customizations.kernel?.name,
      append: customizations.kernel?.append,
    };

    // "sshkey": []SSHKeyCustomization,
    const sshkey = customizations.sshKeys?.map((formSSHKey) => {
      return {
        user: formSSHKey.user,
        key: formSSHKey.key,
      };
    });

    // "user": []UserCustomization,
    // const user = customizations.users?.map((formUser) => {
    //   return {
    //     key: formUser.key,
    //     name: formUser.name,
    //     description: formUser.description,
    //     password: formUser.password,
    //     home: formUser.home,
    //     shell: formUser.shell,
    //     groups: formUser.groups,
    //     uid: formUser.uid,
    //     gid: formUser.gid,
    //   };
    // });
    const user = customizations.user?.map((formUser) => {
      return {
        name: formUser.name,
        password: formUser.password,
        groups: formUser["isAdmin"] ? ["wheel"] : [],
        key: formUser.key,
      };
    });

    // "group": []GroupCustomization,
    const group = customizations.groups?.map((formGroup) => {
      return {
        name: formGroup.name,
        gid: formGroup.gid,
      };
    });

    // "timezone": TimezoneCustomization,
    const timezone = {
      timezone: customizations.timezone?.timezone,
      ntpservers: customizations.timezone?.ntpservers,
    };

    // "locale": LocalCustomizations,
    const locale = {
      languages: customizations.locale?.languages,
      keyboard: customizations.locale?.keyboard,
    };

    // "services": ServicesCustomization,
    const services = {
      enabled: customizations.services?.enabled,
      disabled: customizations.services?.disabled,
    };

    // "installation_device": string,
    const installation_device = customizations.installation_device;

    // "fdo": FDOCustomization,
    const fdo = customizations.fdo;

    // "openscap": OpenSCAPCustomization,
    // const openscap = {
    //   datastream: customizations.openscap?.datastream,
    //   profile_id: customizations.openscap?.profileId,
    // };
    const openscap = customizations.openscap;

    // "firewall": FirewallCustomization,
    //   "ports": []string
    //   "services": | FirewallServicesCustomization
    //   "zones": []FirewallZoneCustomization
    const firewall = {
      ports: customizations.firewall?.ports,
      services: customizations.firewall?.services,
      zones: customizations.firewall?.zones,
    };

    // "filesystem": []FilesystemCustomization
    const filesystem = customizations.filesystem?.map((formMount) => {
      return {
        mountpoint: formMount.mountpoint,
        minsize: formMount.size,
      };
    });

    const customizationsParsed = {
      hostname,
      kernel,
      sshkey,
      user,
      group,
      timezone,
      locale,
      services,
      installation_device,
      fdo,
      openscap,
      firewall,
      filesystem,
    };

    return customizationsParsed;
  };

  const stateToBlueprint = (formValues) => {
    const packages = formValues?.["selected-packages"]?.map((pkg) => ({
      name: pkg,
    }));

    const customizations = formValues.customizations
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
          customValidatorMapper={{ hostnameValidator }}
          componentMapper={{
            ...componentMapper,
            "package-selector": Packages,
            review: Review,
            "text-field-custom": TextFieldCustom,
          }}
          onCancel={handleClose}
          schema={{
            fields: [
              {
                component: componentTypes.WIZARD,
                name: "blueprint-wizard",
                isDynamic: true,
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
                fields: [
                  blueprintDetails(intl),
                  packages(intl),
                  system(intl),
                  users(intl),
                  fdo(intl),
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
