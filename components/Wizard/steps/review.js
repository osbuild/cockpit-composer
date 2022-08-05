import React from "react";
import { Button, Tooltip } from "@patternfly/react-core";

const CustomReviewFooter = (props) => {
  console.log("props: ", props);
  return (
    <>
      <Tooltip content={<div>Update the blueprint and build an image.</div>}>
        <Button variant="primary">Create image</Button>
      </Tooltip>
      <Tooltip content={<div>Update the blueprint without building an image.</div>}>
        <Button variant="secondary">Update blueprint</Button>
      </Tooltip>
      <Button variant="secondary">Back</Button>
      <Button variant="link">Cancel</Button>
    </>
  );
};

export default {
  name: "review",
  component: "review",
  title: "Review",
  buttons: CustomReviewFooter,
  fields: [
    {
      name: "review",
      component: "review",
    },
  ],
};
