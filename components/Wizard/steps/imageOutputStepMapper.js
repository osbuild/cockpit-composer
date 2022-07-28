export default (props) => {
  if (props["image-upload"]) {
    switch (props["image-output-type"]) {
      case "ami":
        return "aws-auth";
      case "vhd":
        return "azure-auth";
      default:
        return "details";
    }
  } else {
    return "details";
  }
};
