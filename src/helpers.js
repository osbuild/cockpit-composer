import { UNIT_GIB } from "./constants";

export const formTimestampLabel = (ts) => {
  // get Mon DD, YYYY format
  const ms = Math.round(ts * 1000);
  const date = new Date(ms);
  const options = { month: "short", day: "numeric", year: "numeric" };
  const tsDisplay = new Intl.DateTimeFormat("en-US", options).format(date);
  return tsDisplay;
};

export const cleanEmptyFields = (obj) => {
  const cleaned = Object.entries(obj).reduce((fields, [key, value]) => {
    if (value === undefined || value === null || value === "") {
      return fields;
    }
    if (typeof value === "object") {
      const cleanedValue = cleanEmptyFields(value);
      if (Object.keys(cleanedValue).length === 0) {
        return fields;
      }
      return { ...fields, [key]: cleanedValue };
    }
    return { ...fields, [key]: value };
  }, {});
  return cleaned;
};

export const blueprintToFormState = (blueprint) => {
  if (!blueprint) return {};
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
  // this helps with the blueprint select watcher
  formState.blueprintName = blueprint.name;
  formState.customizations = {
    ...blueprint.customizations,
    user: blueprint.customizations?.user?.map((user) => ({
      name: user?.name,
      password: user?.password,
      key: user?.key,
      isAdmin: user?.groups?.includes("wheel"),
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

  formState["selected-packages"] = blueprint.packages?.map((pkg) => pkg?.name);
  return formState;
};

const formStateToCustomizations = (customizations) => {
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
    : undefined;

  let openscap;
  if (
    customizations?.openscap?.datastream ||
    customizations?.openscap?.profile_id
  ) {
    openscap = customizations.openscap;
  }

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
    openscap,
    fdo,
    timezone,
    locale,
    services,
  };

  return customizationsParsed;
};

export const formStateToBlueprint = (formValues) => {
  const packages = formValues?.["selected-packages"]?.length
    ? formValues["selected-packages"].map((pkg) => ({
        name: pkg,
      }))
    : [];

  const customizations = formValues?.customizations
    ? formStateToCustomizations(formValues?.customizations)
    : undefined;

  const cleanEmptyCustomizations = cleanEmptyFields(customizations);

  const blueprint = {
    ...formValues.blueprint,
    customizations: cleanEmptyCustomizations,
    packages,
  };
  return blueprint;
};
