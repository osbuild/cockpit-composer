import { UNIT_GIB } from "./constants";

export const formTimestampLabel = (ts) => {
  // get Mon DD, YYYY format
  const ms = Math.round(ts * 1000);
  const date = new Date(ms);
  const options = { month: "short", day: "numeric", year: "numeric" };
  const tsDisplay = new Intl.DateTimeFormat("en-US", options).format(date);
  return tsDisplay;
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
  const { hostname, sshkey, group, installation_device } = customizations;

  let fdo;
  if (
    customizations?.fdo?.diun_pub_key_hash ||
    customizations?.fdo?.diun_pub_key_insecure ||
    customizations?.fdo?.diun_pub_key_root_certs ||
    customizations?.fdo?.manufacturing_server_url
  ) {
    fdo = customizations.fdo;
  }

  let firewall;
  if (
    customizations?.firewall?.ports?.length > 0 ||
    customizations?.firewall?.zones ||
    customizations?.firewall?.services?.enabled?.length > 0 ||
    customizations?.firewall?.services?.disabled?.length > 0
  ) {
    firewall = customizations.firewall;
  }

  let ignition;
  if (customizations?.ignition?.firstboot?.url) {
    ignition = customizations.ignition;
  }

  let kernel;
  if (customizations?.kernel?.name || customizations?.kernel?.append) {
    kernel = customizations.kernel;
  }

  let locale;
  if (
    customizations?.locale?.keyboard ||
    customizations?.locale?.languages?.length > 0
  ) {
    locale = customizations.locale;
  }

  let services;
  if (
    customizations?.services?.enabled?.length > 0 ||
    customizations?.services?.disabled?.length > 0
  ) {
    services = customizations.services;
  }

  let timezone;
  if (
    customizations?.timezone?.timezone ||
    customizations?.timezone?.ntpservers?.length > 0
  ) {
    locale = customizations.locale;
  }

  // Parse the user field
  const parseUser = (formUser) => {
    return {
      name: formUser.name,
      password: formUser.password,
      groups: formUser.isAdmin ? ["wheel"] : [],
      key: formUser.key,
    };
  };
  const user = customizations.user
    ? customizations.user.map(parseUser)
    : undefined;

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

  // if a user steps through each component in the form without filling any
  // of the steps out, there is a possibility that each form field is empty.
  // if this is the case, we want to return an empty (or undefined) `customizationsParsed`
  // object
  const everythingUndefined = Object.keys(customizationsParsed).every(
    (key) => customizationsParsed[key] === undefined
  );

  return everythingUndefined ? undefined : customizationsParsed;
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

  const blueprint = {
    ...formValues.blueprint,
    customizations,
    packages,
  };
  return blueprint;
};
