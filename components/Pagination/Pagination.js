import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';

const messages = defineMessages({
  previousPage: {
    defaultMessage: "Show Previous Page"
  },
  nextPage: {
    defaultMessage: "Show Next Page"
  },
  currentPage: {
    defaultMessage: "Current Page"
  }
});

class Pagination extends React.Component {
  constructor() {
    super();
    this.state = { pageValue: '' }
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.setState({ pageValue: this.props.currentPage });
  }

  componentWillReceiveProps(newProps) {
    this.setState({ pageValue: newProps.currentPage });
    // If the input has focus when the page value is updated, then select the
    // text
    if (this.refs.paginationPage === document.activeElement) {
      this.refs.paginationPage.select();
    }
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
      page = '';
    }
    // only update the value if the value is within the range or is '' (in case
    // the user is clearing the value to type a new one)
    if (!(page > Math.ceil((this.props.totalItems / this.props.pageSize) - 1)) || page === '') {
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
    const totalPages = Math.ceil((totalItems / pageSize) - 1);
    const startItems = (currentPage + 1) * pageSize - pageSize + 1;
    const endItems = currentPage === totalPages && totalItems || (currentPage + 1) * pageSize;
    let pageInput = null;
    if (this.state.pageValue !== '') {
      pageInput = (
        <input
          className="pagination-pf-page form-control"
          ref="paginationPage"
          type="text" value={this.state.pageValue + 1}
          id="cmpsr-blueprint-inputs-page"
          aria-label={formatMessage(messages.currentPage)}
          onClick={() => { this.refs.paginationPage.select(); }}
          onChange={this.handleChange}
          onKeyPress={(e) => this.props.handlePagination(e)}
          onBlur={this.handleBlur}
        />
      );
    } else {
      pageInput = (
        <input
          className="pagination-pf-page form-control"
          ref="paginationPage"
          type="text" value=""
          id="cmpsr-blueprint-inputs-page"
          aria-label={formatMessage(messages.currentPage)}
          onClick={() => { this.refs.paginationPage.select(); }}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      );
    }
    let previousPage = null;
    if (currentPage === 0) {
      previousPage = (
        <li className="disabled">
          <a 
            aria-disabled="true" 
            role="button"
            aria-label={formatMessage(messages.previousPage)}
          >
            <span className="i fa fa-angle-left"></span>
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
            <span className="i fa fa-angle-left"></span>
          </a>
        </li>
      );
    }
    let nextPage = null;
    if (currentPage === totalPages) {
      nextPage = (
        <li className="disabled">
          <a 
            aria-disabled="true"
            role="button"
            aria-label={formatMessage(messages.nextPage)}
          >
            <span className="i fa fa-angle-right"></span>
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
            <span className="i fa fa-angle-right"></span>
          </a>
        </li>
      );
    }
    return (
      <div className={`${cssClass}  content-view-pf-pagination`}>
        <FormattedMessage
          defaultMessage="{items} {start} {to} {end} of {total} {items}"
          values={{
            items: <span className="sr-only"><FormattedMessage defaultMessage="Items" /></span>,
            start: startItems,
            to: <span className="pagination-cmpsr-to"><FormattedMessage defaultMessage="to" /></span>,
            end: endItems,
            total: totalItems
          }}
        />
        <span className="pagination-cmpsr-pages">
          <ul className="pagination pagination-pf-back" role="presentation">
            {previousPage}
          </ul>
          <FormattedMessage
            defaultMessage="{currentPage} of {totalPages} {pages}"
            values={{
              currentPage: pageInput,
              totalPages: totalPages + 1,
              pages: <span className="sr-only"><FormattedMessage defaultMessage="Pages" /></span>
            }}
          />
          <ul className="pagination pagination-pf-forward" role="presentation">
            {nextPage}
          </ul>
        </span>
      </div>
      
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

export default (injectIntl(Pagination));
