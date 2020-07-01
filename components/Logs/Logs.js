import React from "react";
// import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Bullseye } from "@patternfly/react-core";
import Loading from "../Loading/Loading";

class Logs extends React.PureComponent {
  render() {
    let logSection;
    if (this.props.fetchingLog) {
      logSection = (
        <Bullseye>
          <Loading />
        </Bullseye>
      );
    } else logSection = <pre className="pf-u-px-lg pf-u-py-md">{this.props.logContent}</pre>;

    return <>{logSection}</>;
  }
}

Logs.propTypes = {
  fetchingLog: PropTypes.bool,
  logContent: PropTypes.string,
};

Logs.defaultProps = {
  fetchingLog: false,
  logContent: "",
};

export default Logs;
