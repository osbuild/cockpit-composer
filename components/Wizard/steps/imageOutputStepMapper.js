export default (props) => {
  if (props["image-upload"]) {
    switch (props["image-output-type"]) {
      case "ami":
        return "aws-auth";
      case "oci":
        return "oci-auth";
      case "vhd":
        return "azure-auth";
      case "vmdk":
        return "vmware-auth";
      default:
        return "system";
    }
    // check if image type is an ostree-settings
  } else if (
    [
      "fedora-iot-commit",
      "edge-commit",
      "edge-container",
      "edge-installer",
      "edge-raw-image",
      "edge-simplified-installer",
    ].includes(props["image-output-type"])
  ) {
    return "ostree-settings";
  } else {
    return "system";
  }
};
