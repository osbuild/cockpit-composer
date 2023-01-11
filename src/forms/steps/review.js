import React from "react";
import { FormattedMessage } from "react-intl";

const review = () => {
  return {
    name: "review",
    component: "review",
    title: (
      <FormattedMessage id="wizard.review.title" defaultMessage="Review" />
    ),
    fields: [
      {
        name: "review",
        component: "review",
      },
    ],
  };
};

export default review;
