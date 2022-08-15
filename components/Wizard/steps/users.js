export default {
  title: "Users",
  name: "users",
  substepOf: "Customizations",
  nextStep: "packages",
  fields: [
    {
      component: "field-array",
      name: "customizations-users",
      buttonLabels: { add: "Add user", remove: "Remove user", removeAll: "Remove all users" },
      fields: [
        {
          component: "text-field-custom",
          name: "username",
          className: "pf-u-w-50",
          type: "text",
          label: "User name",
          isRequired: true,
          autoFocus: true,
          validate: [
            {
              type: "required",
            },
          ],
        },
        {
          component: "text-field-custom",
          name: "password",
          className: "pf-u-w-50",
          type: "password",
          label: "Password",
        },
        {
          component: "textarea",
          name: "ssh-key",
          className: "pf-u-w-50 pf-u-h-25vh",
          type: "text",
          label: "SSH key",
        },
        {
          component: "checkbox",
          name: "is-admin",
          className: "pf-u-w-50",
          type: "text",
          label: "Server administrator",
        },
      ],
    },
  ],
};
