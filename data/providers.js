const providerSettings = {
  aws: {
    auth: {
      accessKeyID: {
        displayText: "AWS access key ID",
        helperText: "",
        isPassword: true,
      },
      secretAccessKey: {
        displayText: "AWS secret access key",
        helperText: "",
        isPassword: true,
      },
      region: {
        displayText: "AWS region",
        helperText: "",
        isPassword: false,
      },
    },
    settings: {
      bucket: {
        displayText: "Amazon S3 bucket name",
        helperText: "",
        isPassword: false,
      },
    },
  },
};

export default providerSettings;
