import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";

export default {
  title: "Authentication",
  name: "vmware-auth",
  substepOf: "Upload to VMWare",
  nextStep: "vmware-dest",
  fields: [
    {
      component: "text-field-custom",
      name: "vmware-username",
      className: "pf-u-w-50",
      type: "text",
      label: "Username",
      isRequired: true,
      autoFocus: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
    },
    {
      component: "text-field-custom",
      name: "vmware-password",
      className: "pf-u-w-50",
      type: "password",
      label: "Password",
      isRequired: true,
      validate: [
        {
          type: validatorTypes.REQUIRED,
        },
      ],
    },
  ],
};
