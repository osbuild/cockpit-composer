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

const Review = (props) => {
  const { getState } = useFormApi();

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
          <TextListItem component={TextListItemVariants.dd}>{getState()?.values?.["image-output-type"]}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>Image size</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{getState()?.values?.["image-size"]}</TextListItem>
        </TextList>
      </TextContent>
    </>
  );
};

export default Review;
