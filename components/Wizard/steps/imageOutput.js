export default {
  id: "wizard-image-output",
  title: "Image output",
  name: "image-output",
  nextStep: "details",
  fields: [
    {
      component: "blueprint-name",
      name: "blueprint-name",
    },
    {
      component: "image-output-select",
      name: "image-output-type",
      label: "Type",
    },
  ],
};
