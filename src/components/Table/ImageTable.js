import React, { useState } from "react";
import PropTypes from "prop-types";
import { useIntl, FormattedMessage } from "react-intl";
import { Button, Flex } from "@patternfly/react-core";
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@patternfly/react-table";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  PendingIcon,
} from "@patternfly/react-icons";
import cockpit from "cockpit";
import DeleteImage from "../Modal/DeleteImage";
import StopBuild from "../Modal/StopBuild";
import { formTimestampLabel } from "../../helpers";

const StatusLabel = (props) => {
  switch (props.status) {
    case "WAITING":
      return (
        <Flex className="pf-u-align-items-baseline pf-m-nowrap">
          <div className="pf-u-mr-sm">
            <PendingIcon />
          </div>
          <FormattedMessage defaultMessage="Pending" />
        </Flex>
      );
    case "RUNNING":
      return (
        <Flex className="pf-u-align-items-baseline pf-m-nowrap">
          <div className="pf-u-mr-sm">
            <InProgressIcon className="pending" />
          </div>
          <FormattedMessage defaultMessage="Building" />
        </Flex>
      );
    case "FINISHED":
      return (
        <Flex className="pf-u-align-items-baseline pf-m-nowrap">
          <div className="pf-u-mr-sm">
            <CheckCircleIcon className="success" />
          </div>
          <FormattedMessage defaultMessage="Ready" />
        </Flex>
      );
    case "FAILED":
      return (
        <Flex className="pf-u-align-items-baseline pf-m-nowrap">
          <div className="pf-u-mr-sm">
            <ExclamationCircleIcon className="error" />
          </div>
          <FormattedMessage defaultMessage="Failed" />
        </Flex>
      );
    default:
      break;
  }
};

const sizeLabel = (size) => {
  const gigabyte = 1024 * 1024 * 1024;
  const sizeGB = size / gigabyte;
  return sizeGB + " GB";
};

const ImageRow = ({ image, columns }) => {
  // downloading logs and images is done via cockpit
  // cockpit is used to query the api and download the file to the users browser
  const downloadLogs = () => {
    const link = document.createElement("a");
    const query = window.btoa(
      JSON.stringify({
        payload: "http-stream2",
        unix: "/run/weldr/api.socket",
        method: "GET",
        path: `/api/v1/compose/log/${image.id}`,
        superuser: "try",
      })
    );
    const dowloadhref = `/cockpit/channel/${cockpit.transport.csrf_token}?${query}`;

    link.setAttribute("href", dowloadhref);
    link.setAttribute("download", image.id + ".log");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    const query = window.btoa(
      JSON.stringify({
        payload: "http-stream2",
        unix: "/run/weldr/api.socket",
        method: "GET",
        path: `/api/v0/compose/image/${image.id}`,
        superuser: "try",
      })
    );
    const dowloadhref = `/cockpit/channel/${cockpit.transport.csrf_token}?${query}`;

    link.setAttribute("href", dowloadhref);
    link.setAttribute("download", image.id + ".qcow2");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Tr key={image.id}>
        <Td dataLabel={columns[0].title}>{image.id}</Td>
        <Td dataLabel={columns[1].title}>{image.blueprint}</Td>
        <Td dataLabel={columns[2].title}>{image.compose_type}</Td>
        <Td dataLabel={columns[3].title}>
          {formTimestampLabel(image.job_created)}
        </Td>
        <Td dataLabel={columns[4].title}>
          {image.queue_status === "FINISHED" ||
          image.queue_status === "FAILED" ? (
            sizeLabel(image.image_size)
          ) : (
            <InProgressIcon className="pending" />
          )}
        </Td>
        <Td dataLabel={columns[5].title}>
          <StatusLabel status={image.queue_status} />
        </Td>
        <Td modifier="fitContent">
          <Button
            variant="secondary"
            onClick={() => downloadImage()}
            isDisabled={image.queue_status !== "FINISHED"}
          >
            <FormattedMessage defaultMessage="Download image" />
          </Button>
        </Td>
        <Td modifier="fitContent">
          <Button variant="secondary" onClick={() => downloadLogs()}>
            <FormattedMessage defaultMessage="Download logs" />
          </Button>
        </Td>
        <Td isActionCell>
          {image.queue_status === "FINISHED" ||
          image.queue_status === "FAILED" ? (
            <DeleteImage image={image} />
          ) : (
            <StopBuild image={image} />
          )}
        </Td>
      </Tr>
    </>
  );
};

ImageRow.propTypes = {
  image: PropTypes.object,
  columns: PropTypes.array,
};

const ImageTable = (props) => {
  const intl = useIntl();
  // start sorting by created date
  const [activeSortIndex, setActiveSortIndex] = useState(3);
  const [isSortAscending, setIsSortAscending] = useState(false);
  const [sortBy, setSortBy] = useState("job_created");

  const columns = [
    {
      title: intl.formatMessage({ defaultMessage: "Image ID" }),
      fieldId: "id",
    },
    {
      title: intl.formatMessage({ defaultMessage: "Blueprint" }),
      fieldId: "blueprint",
    },
    {
      title: intl.formatMessage({ defaultMessage: "Type" }),
      fieldId: "compose_type",
    },
    {
      title: intl.formatMessage({ defaultMessage: "Created" }),
      fieldId: "job_created",
    },
    {
      title: intl.formatMessage({ defaultMessage: "Size" }),
      fieldId: "image_size",
    },
    {
      title: intl.formatMessage({ defaultMessage: "Status" }),
      fieldId: "queue_status",
    },
  ];

  const onSort = (event, index) => {
    setActiveSortIndex(index);
    setIsSortAscending(!isSortAscending);
    setSortBy(columns[index].fieldId);
  };

  const getSortParams = (columnIndex) => ({
    sortBy: {
      index: activeSortIndex,
      direction: isSortAscending ? "asc" : "desc",
    },
    onSort,
    columnIndex,
  });

  const sortedImages = props.images.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return isSortAscending ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return isSortAscending ? 1 : -1;
    }
    return 0;
  });

  return (
    <TableComposable variant="compact" aria-label="Images table">
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => (
            <Th key={columnIndex} sort={getSortParams(columnIndex)}>
              {column.title}
            </Th>
          ))}
          <Th />
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {sortedImages?.map((image) => (
          <ImageRow key={image.id} image={image} columns={columns} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

StatusLabel.propTypes = {
  status: PropTypes.string,
};

ImageTable.propTypes = {
  images: PropTypes.array,
};

export default ImageTable;
