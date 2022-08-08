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
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import FormSpy from "@data-driven-forms/react-form-renderer/form-spy";
import * as composer from "../../../core/composer";

const AWSReview = (formValues) => (
  <>
    <h3>Upload to AWS</h3>
    <TextListItem component={TextListItemVariants.dt}>Access key ID</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{"*".repeat(formValues?.["aws-access-key"].length)}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Secret access key</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["aws-secret-access-key"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Image name</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["aws-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Amazon S3 bucket</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["aws-s3-bucket"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>AWS region</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["aws-region"]}</TextListItem>
  </>
);

const AzureReview = (formValues) => (
  <>
    <h3>Upload to Azure</h3>
    <TextListItem component={TextListItemVariants.dt}>Storage account</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-storage-account"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Storage access key</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["azure-storage-access-key"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Image name</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Storage container</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-storage-container"]}</TextListItem>
  </>
);

const VMWareReview = (formValues) => (
  <>
    <h3>Upload to VMWare</h3>
    <TextListItem component={TextListItemVariants.dt}>Username</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-username"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Password</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["vmware-password"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Image name</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Host</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-host"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Cluster</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-cluster"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Data center</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-data-center"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Data store</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["vmware-data-store"]}</TextListItem>
  </>
);

const ociReview = (formValues) => (
  <>
    <h3>Upload to OCI</h3>
    <TextListItem component={TextListItemVariants.dt}>User OCID</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-user-ocid"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Private key filename</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-private-key-filename"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Fingerprint</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-fingerprint"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Image name</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>OCI bucket</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Bucket namespace</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-namespace"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Bucket region</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-region"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Bucket compartment</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-compartment"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Bucket tenancy</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["oci-bucket-tenancy"]}</TextListItem>
  </>
);

const Review = (props) => {
  const { getState } = useFormApi();
  const [formValues, setFormValues] = useState(getState()?.values);
  const [dependencies, setDependencies] = useState(undefined);

  useEffect(() => {
    const fetchDependencies = async (blueprintName) => {
      const result = await composer.depsolveBlueprint(blueprintName);
      const numDependencies = result.blueprints[0].dependencies.length - formValues["selected-packages"].length;
      setDependencies(numDependencies);
    };
    if (formValues["selected-packages"]) {
      fetchDependencies(props.blueprintName);
    }
  });

  return (
    <>
      <Text>
        Review the information and click &quot;Create image&quot; to create the image using the following criteria.
      </Text>
      <TextContent>
        <TextList component={TextListVariants.dl} id="review-list">
          <TextListItem component={TextListItemVariants.dt}>Blueprint name</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{props.blueprintName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Output type</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{formValues?.["image-output-type"]}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Image size</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{formValues?.["image-size"]}</TextListItem>
          {formValues?.["image-output-type"] === "ami" && formValues?.["image-upload"] && AWSReview(formValues)}
          {formValues?.["image-output-type"] === "vhd" && formValues?.["image-upload"] && AzureReview(formValues)}
          {formValues?.["image-output-type"] === "vmdk" && formValues?.["image-upload"] && VMWareReview(formValues)}
          {formValues?.["image-output-type"] === "oci" && formValues?.["image-upload"] && ociReview(formValues)}
          <TextListItem component={TextListItemVariants.dt}>Packages</TextListItem>
          <FormSpy subscription={{ values: true }}>
            {() => {
              setFormValues(getState()?.values);
              return (
                <TextListItem component={TextListItemVariants.dd}>
                  {formValues["selected-packages"] ? formValues["selected-packages"].length : <Spinner size="sm" />}
                </TextListItem>
              );
            }}
          </FormSpy>
          <TextListItem component={TextListItemVariants.dt}>Dependencies</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {dependencies || dependencies === 0 ? dependencies : <Spinner size="sm" />}
          </TextListItem>
        </TextList>
      </TextContent>
    </>
  );
};

Review.propTypes = {
  blueprintName: PropTypes.string,
};

export default Review;
