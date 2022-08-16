export default {
  title: "Customizations",
  name: "customizations",
  nextStep: "packages",
  fields: [
    {
      component: "text-field-custom",
      name: "customizations-hostname",
      className: "pf-u-w-75",
      type: "text",
      label: "Hostname",
      helperText: "If no hostname is provided, the hostname will be determined by the OS",
      validate: [
        {
          type: "hostnameValidator",
        },
      ],
    },
  ],
};
