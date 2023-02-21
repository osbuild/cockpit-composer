import React from "react";
import { FormattedMessage } from "react-intl";

const reviewBlueprint = () => {
  return {
    name: "review-blueprint",
    title: <FormattedMessage defaultMessage="Review" />,
    fields: [
      {
        name: "review",
        component: "plain-text",
        label: (
          <FormattedMessage defaultMessage='Please review all details and click "Save".' />
        ),
      },
    ],
  };
};

export default reviewBlueprint;
