import React from "react";
import { FormattedMessage } from "react-intl";

const reviewImage = () => {
  return {
    name: "review-image",
    title: <FormattedMessage defaultMessage="Review" />,
    fields: [
      {
        name: "review",
        component: "plain-text",
        label: (
          <FormattedMessage defaultMessage='Please review all details and click "Create".' />
        ),
      },
    ],
  };
};

export default reviewImage;
