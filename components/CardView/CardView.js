/* global $ */

import React from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

class CardView extends React.Component {
  componentDidMount() {
    // run matchHeight jquery plugin
    this.matchHeight();

    // Card Single Select
    $('.card-pf-view-single-select').click(() => {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
      } else {
        $('.card-pf-view-single-select').removeClass('active'); $(this).addClass('active');
      }
    });
  }

  matchHeight() {
    // matchHeight the contents of each .card-pf and then the .card-pf itself
    $(".row-cards-pf > [class*='col'] > .card-pf > .card-pf-body").matchHeight();
  }


  render() {
    const { users } = this.props; // eslint-disable-line no-use-before-define

    return (
      <div className="row row-cards-pf">
        {users.map((user, i) =>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={i}>
            <div className="card-pf card-pf-view card-pf-view-select card-pf-view-single-select">
              <div className="card-pf-body">
                <div className="card-pf-top-element">
                  <span className="fa fa-birthday-cake card-pf-icon-circle"></span>
                </div>
                <h2 className="card-pf-title text-center">
                  {user.name}
                </h2>
                <div className="card-pf-items text-center">
                  <div className="card-pf-item">
                    <span className="pficon pficon-screen"></span>
                    <span className="card-pf-item-text">8</span>
                  </div>
                  <div className="card-pf-item">
                    <span className="fa fa-check"></span>
                  </div>
                </div>
                <p className="card-pf-info text-center">
                  <FormattedMessage
                    defaultMessage="{createdOnMsg} {createdOnDate, date, 'YYYY-MM-dd'} {createdOnDate, time, 'hh:mm a'}"
                    values={{
                      createOnMsg: <strong><FormattedMessage defaultMessage="Created On" /></strong>,
                      createdOnDate: new Date(2015, 2, 1, 2, 0)
                    }}
                  />
                  <br />
                  <FormattedMessage defaultMessage="Never Expires" />
                </p>
              </div>
              <div className="card-pf-view-checkbox">
                <input type="checkbox" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

CardView.propTypes = {
  users: PropTypes.array,
};

export default CardView;
