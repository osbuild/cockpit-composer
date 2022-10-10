export default (props) => {
  switch (props["image-output-type"]) {
    case "edge-installer":
      return "users";
    default:
      return "system";
  }
};
