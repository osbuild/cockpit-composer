import React, { useState } from "react";
import PropTypes from "prop-types";
import { Pagination } from "@patternfly/react-core";

import PackagesTable from "../Table/PackagesTable";
import PackagesToolbar from "../Toolbar/PackagesToolbar";

const PackagesTab = (props) => {
  const [toggle, setToggle] = useState("additional");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(20);
  const [isSortAscending, setIsSortAscending] = useState(true);

  const filterPackagesByName = (packages, value) =>
    packages.filter((pack) => pack.name.includes(value));

  const sortPackagesByName = (packages, isSortAscending) =>
    packages.sort((a, b) => {
      if (a.name < b.name) {
        return isSortAscending ? -1 : 1;
      }
      if (a.name > b.name) {
        return isSortAscending ? 1 : -1;
      }
      return 0;
    });

  const sortAndFilterPackages = (packages) => {
    const filteredPackages = filterPackagesByName(packages, inputValue);
    return sortPackagesByName(filteredPackages, isSortAscending);
  };

  const onToggleClick = (_isSelected, event) =>
    setToggle(event.currentTarget.id);

  const onSetPage = (_event, newPage) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event, newPerPage) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const packagesList =
    toggle === "additional" ? props.packages : props.dependencies;

  const sortedAndFilteredPackages = sortAndFilterPackages(packagesList);

  const itemsStartInclusive = (page - 1) * perPage;
  const itemsEndExclusive = itemsStartInclusive + perPage;

  const paginatedList = sortedAndFilteredPackages?.slice(
    itemsStartInclusive,
    itemsEndExclusive
  );

  return (
    <div className="pf-u-p-lg">
      <PackagesToolbar
        inputValue={inputValue}
        onInputChange={setInputValue}
        toggle={toggle}
        onToggleClick={onToggleClick}
        page={page}
        onPerPageSelect={onPerPageSelect}
        perPage={perPage}
        onSetPage={onSetPage}
        itemCount={packagesList?.length ? packagesList.length : 0}
      />
      <PackagesTable
        packages={paginatedList}
        setIsSortAscending={setIsSortAscending}
        isSortAscending={isSortAscending}
      />
      <Pagination
        itemCount={packagesList?.length}
        perPage={perPage}
        page={page}
        onSetPage={onSetPage}
        onPerPageSelect={onPerPageSelect}
        variant="bottom"
        isCompact
      />
    </div>
  );
};

PackagesTab.propTypes = {
  packages: PropTypes.arrayOf(PropTypes.object),
  dependencies: PropTypes.arrayOf(PropTypes.object),
};

export default PackagesTab;
