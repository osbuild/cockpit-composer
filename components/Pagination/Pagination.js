import React from "react";
import { FormattedMessage, defineMessages, injectIntl, intlShape } from "react-intl";
import PropTypes from "prop-types";

const messages = defineMessages({
  previousPage: {
    defaultMessage: "Show Previous Page",
  },
  nextPage: {
    defaultMessage: "Show Next Page",
  },
  currentPage: {
    defaultMessage: "Current Page",
    description: "Label of form input for setting current page number",
  },
  pagination: {
    defaultMessage: "Pagination",
  },
});

class Pagination extends React.Component {
  constructor() {
    super();
    this.state = { pageValue: 0 };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ pageValue: this.props.currentPage });
  }

  componentDidUpdate() {
    if (this.paginationPage === document.activeElement) {
      this.paginationPage.select();
    }
  }

  static getDerivedStateFromProps(newProps, prevState) {
    if (prevState.pageValue !== newProps.currentPage) {
      return { pageValue: newProps.currentPage };
    }
    return null;
  }

  handleBlur() {
    // if the user exits the field when the value != the current page
    // then reset the page value
    this.setState({ pageValue: this.props.currentPage });
  }

  handleChange(event) {
    // check if value is a number, if not or if <= 0, then set to ''
    let page;
    if (!isNaN(event.target.value) && event.target.value > 0) {
      page = event.target.value - 1;
    } else {
      page = 0;
    }
    // only update the value if the value is within the range or is '' (in case
    // the user is clearing the value to type a new one)
    if (!(page > Math.ceil(this.props.totalItems / this.props.pageSize - 1))) {
      this.setState({ pageValue: page });
    } else {
      event.target.select();
    }
  }
  // current page and total pages start count at 0. Anywhere these values
  // display in the UI, then + 1 must be included.

  render() {
    const { formatMessage } = this.props.intl;
    const { cssClass, currentPage, totalItems, pageSize } = this.props;
    const totalPages = Math.ceil(totalItems / pageSize - 1);
    const startItems = (currentPage + 1) * pageSize - pageSize + 1;
    const endItems = (currentPage === totalPages && totalItems) || (currentPage + 1) * pageSize;
    const pageInput = (
      <input
        className="pagination-pf-page form-control"
        ref={(c) => (this.paginationPage = c)}
        type="text"
        value={this.state.pageValue + 1}
        id="cmpsr-blueprint-inputs-page"
        aria-label={formatMessage(messages.currentPage)}
        onClick={() => {
          this.paginationPage.select();
        }}
        onChange={this.handleChange}
        onKeyPress={(e) => this.props.handlePagination(e)}
        onBlur={this.handleBlur}
      />
    );
    let previousPage = null;
    if (currentPage === 0) {
      previousPage = (
        <li className="disabled">
          <a aria-disabled="true" role="button" aria-label={formatMessage(messages.previousPage)}>
            <span className="i fa fa-angle-left" />
          </a>
        </li>
      );
    } else {
      previousPage = (
        <li>
          <a
            href="#"
            role="button"
            aria-label={formatMessage(messages.previousPage)}
            data-page={currentPage - 1}
            onClick={(e) => this.props.handlePagination(e)}
          >
            <span className="i fa fa-angle-left" />
          </a>
        </li>
      );
    }
    let nextPage = null;
    if (currentPage === totalPages) {
      nextPage = (
        <li className="disabled">
          <a aria-disabled="true" role="button" aria-label={formatMessage(messages.nextPage)}>
            <span className="i fa fa-angle-right" />
          </a>
        </li>
      );
    } else {
      nextPage = (
        <li>
          <a
            href="#"
            role="button"
            aria-label={formatMessage(messages.nextPage)}
            data-page={currentPage + 1}
            onClick={(e) => this.props.handlePagination(e)}
          >
            <span className="i fa fa-angle-right" />
          </a>
        </li>
      );
    }
    return (
      <nav className={`${cssClass}  content-view-pf-pagination`} aria-label={formatMessage(messages.pagination)}>
        <span className="sr-only">
          <FormattedMessage
            defaultMessage="Current Items"
            description="Label for the string: 1–50 of 125; only visible to screen readers"
          />
          :
        </span>
        <FormattedMessage
          defaultMessage="{startNumber} - {endNumber} of {totalNumber}"
          values={{
            startNumber: startItems,
            endNumber: endItems,
            totalNumber: totalItems,
          }}
        />
        <span className="pagination-cmpsr-pages">
          <ul className="pagination pagination-pf-back" role="presentation">
            {previousPage}
          </ul>
          <FormattedMessage
            defaultMessage="{currentPage} of {totalPages}"
            values={{
              currentPage: pageInput,
              totalPages: totalPages + 1,
            }}
          />
          <ul className="pagination pagination-pf-forward" role="presentation">
            {nextPage}
          </ul>
        </span>
      </nav>
    );
  }
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  cssClass: PropTypes.string,
  totalItems: PropTypes.number,
  pageSize: PropTypes.number,
  handlePagination: PropTypes.func,
  intl: intlShape.isRequired,
};

Pagination.defaultProps = {
  currentPage: 0,
  cssClass: "",
  totalItems: 0,
  pageSize: 0,
  handlePagination() {},
};

export default injectIntl(Pagination);
