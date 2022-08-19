import React from "react";
import { FormattedMessage } from "react-intl";
import SubmitButtonsCustom from "../formComponents/SubmitButtonsCustom";

const review = () => {
  return {
    name: "review",
    component: "review",
    title: <FormattedMessage id="wizard.review.title" defaultMessage="Review" />,
    buttons: SubmitButtonsCustom,
    fields: [
      {
        name: "review",
        component: "review",
      },
    ],
  };
};

export default review;
