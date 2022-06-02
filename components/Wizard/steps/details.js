import { componentTypes } from "@data-driven-forms/react-form-renderer";

export default {
  title: "Details",
  name: "details",
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: "image-size-input",
      label: "Image size",
      type: "number",
    },
  ],
};
