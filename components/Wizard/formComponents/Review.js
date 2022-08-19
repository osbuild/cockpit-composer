import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Spinner,
  Text,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from "@patternfly/react-core";
import { FormattedMessage, defineMessages } from "react-intl";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import FormSpy from "@data-driven-forms/react-form-renderer/form-spy";
import * as composer from "../../../core/composer";

const messages = defineMessages({
  uploadToAWS: {
    id: "wizard.review.uploadToAWS",
    defaultMessage: "Upload to AWS",
  },
  uploadToAzure: {
    id: "wizard.review.uploadToAzure",
    defaultMessage: "Upload to Azure",
  },
  uploadToVMWare: {
    id: "wizard.review.uploadToVMWare",
    defaultMessage: "Upload to VMWare",
  },
  uploadToOCI: {
    id: "wizard.review.uploadToOCI",
    defaultMessage: "Upload to OCI",
  },
  review: {
    id: "wizard.review.review",
    defaultMessage: 'Review the information and click "Create image" to create the image using the following criteria.',
  },
  accessKeyID: {
    id: "wizard.review.accessKeyID",
    defaultMessage: "Access key ID",
  },
  secretAccessKey: {
    id: "wizard.review.secretAccessKey",
    defaultMessage: "Secret access key",
  },
  imageName: {
    id: "wizard.review.imageName",
    defaultMessage: "Image name",
  },
  amazonS3Bucket: {
    id: "wizard.review.amazonS3Bucket",
    defaultMessage: "Amazon S3 bucket",
  },
  awsRegion: {
    id: "wizard.review.awsRegion",
    defaultMessage: "AWS region",
  },
  storageAccount: {
    id: "wizard.review.storageAccount",
    defaultMessage: "Storage account",
  },
  storageAccessKey: {
    id: "wizard.review.storageAccessKey",
    defaultMessage: "Storage access key",
  },
  storageContainer: {
    id: "wizard.review.storageContainer",
    defaultMessage: "Storage container",
  },
  username: {
    id: "wizard.review.username",
    defaultMessage: "Username",
  },
  password: {
    id: "wizard.review.password",
    defaultMessage: "Password",
  },
  host: {
    id: "wizard.review.host",
    defaultMessage: "Host",
  },
  cluster: {
    id: "wizard.review.cluster",
    defaultMessage: "Cluster",
  },
  dataCenter: {
    id: "wizard.review.dataCenter",
    defaultMessage: "Data center",
  },
  dataStore: {
    id: "wizard.review.dataStore",
    defaultMessage: "Data store",
  },
  userOCID: {
    id: "wizard.review.userOCID",
    defaultMessage: "User OCID",
  },
  privateKey: {
    id: "wizard.review.privateKey",
    defaultMessage: "Private key filename",
  },
  fingerprint: {
    id: "wizard.review.fingerprint",
    defaultMessage: "Fingerprint",
  },
  ociBucket: {
    id: "wizard.review.ociBucket",
    defaultMessage: "OCI bucket",
  },
  bucketNamespace: {
    id: "wizard.review.bucketNamespace",
    defaultMessage: "Bucket namespace",
  },
  bucketRegion: {
    id: "wizard.review.bucketRegion",
    defaultMessage: "Bucket region",
  },
  bucketCompartment: {
    id: "wizard.review.bucketCompartment",
    defaultMessage: "Bucket compartment",
  },
  bucketTenancy: {
    id: "wizard.review.bucketTenancy",
    defaultMessage: "Bucket tenancy",
  },
  hostname: {
    id: "wizard.review.hostname",
    defaultMessage: "Hostname",
  },
  installationDevice: {
    id: "wizard.review.installationDevice",
    defaultMessage: "Installation device",
  },
  blueprintName: {
    id: "wizard.review.blueprintName",
    defaultMessage: "Blueprint name",
  },
  outputType: {
    id: "wizard.review.outputType",
    defaultMessage: "Output type",
  },
  imageSize: {
    id: "wizard.review.imageSize",
    defaultMessage: "Image size",
  },
  packages: {
    id: "wizard.review.packages",
    defaultMessage: "Packages",
  },
  dependencies: {
    id: "wizard.review.dependencies",
    defaultMessage: "Dependencies",
  },
});

const AWSReview = (formValues) => (
  <>
    <h3>
      <FormattedMessage {...messages.uploadToAWS} />
    </h3>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.accessKeyID} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{"*".repeat(formValues?.["aws-access-key"].length)}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.secretAccessKey} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["aws-secret-access-key"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.imageName} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["aws-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.amazonS3Bucket} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["aws-s3-bucket"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.awsRegion} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["aws-region"]}</TextListItem>
  </>
);

const AzureReview = (formValues) => (
  <>
    <h3>
      <FormattedMessage {...messages.uploadToAzure} />
    </h3>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.storageAccount} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-storage-account"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.storageAccessKey} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["azure-storage-access-key"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.imageName} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.storageContainer} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-storage-container"]}</TextListItem>
  </>
);

const VMWareReview = (formValues) => (
  <>
    <h3>
      <FormattedMessage {...messages.uploadToVMWare} />
    </h3>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.username} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-username"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.password} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["vmware-password"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.imageName} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.host} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-host"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.cluster} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-cluster"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.dataCenter} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-data-center"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.dataStore} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-data-store"]}</TextListItem>
  </>
);

const ociReview = (formValues) => (
  <>
    <h3>
      <FormattedMessage {...messages.uploadToOCI} />
    </h3>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.userOCID} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-user-ocid"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.privateKey} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-private-key-filename"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.fingerprint} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-fingerprint"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.imageName} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.ociBucket} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.bucketNamespace} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-namespace"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.bucketRegion} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-region"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.bucketCompartment} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-compartment"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>
      <FormattedMessage {...messages.bucketTenancy} />
    </TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-tenancy"]}</TextListItem>
  </>
);

const customizations = (formValues) => (
  <>
    {formValues?.["customizations-hostname"] && (
      <>
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage {...messages.hostname} />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>{formValues?.["customizations-hostname"]}</TextListItem>
      </>
    )}
    {formValues?.["customizations-install-device"] && (
      <>
        <TextListItem component={TextListItemVariants.dt}>
          <FormattedMessage {...messages.installationDevice} />
        </TextListItem>
        <TextListItem component={TextListItemVariants.dd}>{formValues?.["customizations-install-device"]}</TextListItem>
      </>
    )}
  </>
);

const Review = (props) => {
  const { getState } = useFormApi();
  const [formValues, setFormValues] = useState(getState()?.values);
  const [dependencies, setDependencies] = useState(undefined);

  useEffect(() => {
    const fetchDependencies = async (packages) => {
      if (packages?.length) {
        const result = await composer.getComponentDependencies(packages);
        // Build a Set() because Packages may share dependencies
        const dependencies = new Set(
          result.reduce((deps, pkg) => {
            const pkgDependencies = pkg.dependencies.map((dep) => dep.name);
            return [...deps, ...pkgDependencies];
          }, [])
        );
        setDependencies(dependencies.size);
      } else {
        setDependencies(0);
      }
    };

    if (formValues["selected-packages"]) {
      fetchDependencies(formValues["selected-packages"]);
    }
  });

  return (
    <>
      <Text>
        <FormattedMessage {...messages.review} />
      </Text>
      <TextContent>
        <TextList component={TextListVariants.dl} id="review-list">
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage {...messages.blueprintName} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{props.blueprintName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage {...messages.outputType} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{formValues?.["image-output-type"]}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage {...messages.imageSize} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{formValues?.["image-size"]}</TextListItem>
          {formValues?.["image-output-type"] === "ami" && formValues?.["image-upload"] && AWSReview(formValues)}
          {formValues?.["image-output-type"] === "vhd" && formValues?.["image-upload"] && AzureReview(formValues)}
          {formValues?.["image-output-type"] === "vmdk" && formValues?.["image-upload"] && VMWareReview(formValues)}
          {formValues?.["image-output-type"] === "oci" && formValues?.["image-upload"] && ociReview(formValues)}
          <FormSpy
            subscription={{ values: true }}
            onChange={() => {
              setFormValues(getState()?.values);
            }}
          />
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage {...messages.packages} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {formValues["selected-packages"] ? formValues["selected-packages"].length : <Spinner size="sm" />}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            <FormattedMessage {...messages.dependencies} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {dependencies || dependencies === 0 ? dependencies : <Spinner size="sm" />}
          </TextListItem>
          {customizations(formValues)}
        </TextList>
      </TextContent>
    </>
  );
};

Review.propTypes = {
  blueprintName: PropTypes.string,
};

export default Review;
