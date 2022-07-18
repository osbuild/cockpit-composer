export default (props) => {
  if (props["image-upload"]) {
    switch (props["image-output-type"]) {
      case "ami":
        return "aws-auth";
      default:
        return "details";
    }
  } else {
    return "details";
  }
};
