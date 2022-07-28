import React from "react";
import PropTypes from "prop-types";
import {
  Text,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from "@patternfly/react-core";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";

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
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["azure-storage-account"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Storage access key</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>
      {"*".repeat(formValues?.["azure-storage-access-key"].length)}
    </TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Image name</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-image-name"]}</TextListItem>
    <TextListItem component={TextListItemVariants.dt}>Storage account</TextListItem>
    <TextListItem component={TextListItemVariants.dd}>{formValues?.["azure-storage-container"]}</TextListItem>
  </>
);

const Review = (props) => {
  const { getState } = useFormApi();
  const formValues = getState()?.values;
  return (
    <>
      <Text>
        Review the information and click &quot;Create image&quot; to create the image using the following criteria.
      </Text>
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Blueprint name</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{props.blueprintName}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Output type</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{formValues?.["image-output-type"]}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Image size</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{formValues?.["image-size"]}</TextListItem>
          {formValues?.["image-output-type"] === "ami" && formValues?.["image-upload"] && AWSReview(formValues)}
          {formValues?.["image-output-type"] === "vhd" && formValues?.["image-upload"] && AzureReview(formValues)}
        </TextList>
      </TextContent>
    </>
  );
};

Review.propTypes = {
  blueprintName: PropTypes.string,
};

export default Review;
