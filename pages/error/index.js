import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import history from '../../core/history';
import Link from '../../components/Link';
import s from './styles.css';

const messages = defineMessages({
  errorMessage: {
    defaultMessage: "Error"
  },
  pageNotFoundMessage: {
    defaultMessage: "Page Not Found"
  },
  pageNotFoundTitle: {
    defaultMessage: "Page not found"
  },
  oupsTitle: {
    defaultMessage: "Oups, something went wrong"
  }
});

class ErrorPage extends React.Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    document.title = this.props.error && this.props.error.status === 404 ?
      this.props.intl.formatMessage(messages.pageNotFoundMessage) :
      this.props.intl.formatMessage(messages.errorMessage);
  }

  goBack(event) {
    event.preventDefault();
    history.goBack();
  }

  render() {
    const { formatMessage } = this.props.intl;

    if (this.props.error) console.error(this.props.error); // eslint-disable-line no-console

    const [code, title] = this.props.error && this.props.error.status === 404 ?
      ['404', formatMessage(messages.pageNotFoundTitle)] :
      ['Error', formatMessage(messages.oupsTitle)];

    return (
      <div className={s.container}>
        <main className={s.content}>
          <h1 className={s.code}>{code}</h1>
          <p className={s.title}>{title}</p>
          {code === '404' &&
            <p className={s.text}>
              <FormattedMessage defaultMessage="The page you're looking for does not exist or an another error occurred." />
            </p>
          }
          <p className={s.text}>
            <FormattedMessage
              defaultMessage="{goBack}, or head over to the&nbsp;{homePage} to choose a new direction."
              values={{
                goBack: <a href="/" onClick={this.goBack}><FormattedMessage defaultMessage="Go back" /></a>,
                homePage: <Link to="/"><FormattedMessage defaultMessage="home page" /></Link>
              }}
            />
          </p>
        </main>
      </div>
    );
  }

}

ErrorPage.propTypes = {
  error: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(ErrorPage);
