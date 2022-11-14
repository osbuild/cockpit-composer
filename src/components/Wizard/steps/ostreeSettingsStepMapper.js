export default (props) => {
  switch (props["image-output-type"]) {
    case "edge-simplified-installer":
      return "fdo";
    default:
      return "system";
  }
};
