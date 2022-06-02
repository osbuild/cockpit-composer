import { componentTypes } from "@data-driven-forms/react-form-renderer";

export default {
  title: "Details",
  name: "details",
  nextStep: "review",
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: "image-size",
      label: "Image size",
      type: "number",
    },
  ],
};
