import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Page, PageSection, PageSectionVariants } from "@patternfly/react-core";

import BlueprintTable from "../components/Table/BlueprintTable";
import BlueprintListToolbar from "../components/Toolbar/BlueprintToolbar";
import Notifications from "../components/Notifications/Notifications";
import {
  selectAllBlueprintNames,
  selectBlueprintsFilteredAndSorted,
} from "../slices/blueprintsSlice";

const BlueprintList = () => {
  const filterKey = "name";
  const [filterValue, setFilterValue] = useState("");
  const sortBy = "name";
  const [isSortAscending, setIsSortAscending] = useState(true);

  const blueprintNames = useSelector((state) => selectAllBlueprintNames(state));

  const blueprintsFilteredAndSorted = useSelector((state) =>
    selectBlueprintsFilteredAndSorted(state, {
      key: filterKey,
      value: filterValue,
      sortBy: sortBy,
      isSortAscending: isSortAscending,
    })
  );

  return (
    <Page>
      <Notifications />
      <PageSection
        hasShadowBottom
        variant={PageSectionVariants.light}
        className="pf-u-py-0"
      >
        <BlueprintListToolbar
          isSortAscending={isSortAscending}
          setIsSortAscending={setIsSortAscending}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          blueprintNames={blueprintNames}
        />
      </PageSection>
      <PageSection variant={PageSectionVariants.light} className="pf-u-py-0">
        <BlueprintTable blueprints={blueprintsFilteredAndSorted} />
      </PageSection>
    </Page>
  );
};

export default BlueprintList;
