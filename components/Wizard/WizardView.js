/* global $ */

import React from 'react';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
// import Wizard from './Wizard';

const messages = defineMessages({
  closeLabel: {
    defaultMessage: "Close"
  }
});

class WizardView extends React.Component {

  // componentDidMount() {
  //   const wizard = new Wizard('#complete');
  // }

  handleClose = (event) => {
    this.props.handleClose(event);
  };


  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="modal " id="complete" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg wizard-pf">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close wizard-pf-dismiss"
                aria-label={formatMessage(messages.closeLabel)}
                onClick={this.handleClose}
              ><span aria-hidden="true">&times;</span></button>
              <dt className="modal-title"><FormattedMessage defaultMessage="Wizard Title" /></dt>
            </div>
            <div className="modal-body wizard-pf-body clearfix">
              <div className="wizard-pf-steps hidden">
                <ul className="wizard-pf-steps-indicator">
                  <li className="wizard-pf-step active" data-tabgroup="1">
                    <a>
                      <span className="wizard-pf-step-number">1</span>
                      <span className="wizard-pf-step-title"><FormattedMessage defaultMessage="First Step" /></span>
                    </a>
                  </li>
                  <li className="wizard-pf-step" data-tabgroup="2">
                    <a>
                      <span className="wizard-pf-step-number">2</span>
                      <span className="wizard-pf-step-title"><FormattedMessage defaultMessage="Second Step" /></span>
                    </a>
                  </li>
                  <li className="wizard-pf-step" data-tabgroup="3">
                    <a>
                      <span className="wizard-pf-step-number">3</span>
                      <span className="wizard-pf-step-title"><FormattedMessage defaultMessage="Review" /></span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="wizard-pf-row">
                <div className="wizard-pf-sidebar hidden">
                  <ul className="list-group">
                    <li className="list-group-item active">
                      <a href="#">
                        <span className="wizard-pf-substep-number">1A.</span>
                        <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Details" /></span>
                      </a>
                    </li>
                    <li className="list-group-item">
                      <a href="#">
                        <span className="wizard-pf-substep-number">1B.</span>
                        <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Settings" /></span>
                      </a>
                    </li>
                  </ul>
                  <ul className="list-group hidden">
                    <li className="list-group-item">
                      <a href="#">
                        <span className="wizard-pf-substep-number">2A.</span>
                        <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Details" /></span>
                      </a>
                    </li>
                    <li className="list-group-item">
                      <a href="#">
                        <span className="wizard-pf-substep-number">2B.</span>
                        <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Settings" /></span>
                      </a>
                    </li>
                  </ul>
                  <ul className="list-group hidden">
                    <li className="list-group-item">
                      <a>
                        <span className="wizard-pf-substep-number">3A.</span>
                        <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Summary" /></span>
                      </a>
                    </li>
                    <li className="list-group-item">
                      <a>
                        <span className="wizard-pf-substep-number">3B.</span>
                        <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Progress" /></span>
                      </a>
                    </li>
                  </ul>
                </div> {/* /.wizard-pf-sidebar */}
                <div className="wizard-pf-main">
                  <div className="wizard-pf-loading blank-slate-pf">
                    <div className="spinner spinner-lg blank-slate-pf-icon"></div>
                    <h3 className="blank-slate-pf-main-action"><FormattedMessage defaultMessage="Loading Wizard" /></h3>
                    <p className="blank-slate-pf-secondary-action">Lorem ipsum dolor sit amet,
                    porta at suspendisse ac, ut wisi
                    vivamus, lorem sociosqu eget nunc amet. </p>
                  </div>
                  <div className="wizard-pf-contents hidden">
                    <form className="form-horizontal">
                      <div className="form-group required">
                        <label className="col-sm-2 control-label" htmlhtmlFor="textInput-markup">
                          <FormattedMessage defaultMessage="Name" />
                        </label>
                        <div className="col-sm-10">
                          <input type="text" data-id="textInput-markup" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label
                          className="col-sm-2 control-label"
                          htmlhtmlFor="descriptionInput-markup"
                        ><FormattedMessage defaultMessage="Description (Optional)" /></label>
                        <div className="col-sm-10">
                          <textarea
                            data-id="descriptionInput-markup"
                            className="form-control"
                            rows="2"
                          ></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="wizard-pf-contents hidden">
                    <form className="form-horizontal">
                      <div className="form-group required">
                        <label className="col-sm-2 control-label" htmlhtmlFor="lorem">
                            Lorem ipsum
                        </label>
                        <div className="col-sm-10">
                          <input type="text" id="lorem" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label" htmlhtmlFor="dolor">
                            Dolor (Optional)
                        </label>
                        <div className="col-sm-10">
                          <textarea id="dolor" className="form-control" rows="2"></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="wizard-pf-contents hidden">
                    <form className="form-horizontal">
                      <div className="form-group required">
                        <label className="col-sm-2 control-label" htmlhtmlFor="aliquam">
                            Aliquam
                        </label>
                        <div className="col-sm-10">
                          <input type="text" id="aliquam" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label" htmlhtmlFor="fermentum">
                            Fermentum
                        </label>
                        <div className="col-sm-10">
                          <textarea id="fermentum" className="form-control" rows="2"></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="wizard-pf-contents hidden">
                    <form className="form-horizontal">
                      <div className="form-group required">
                        <label className="col-sm-2 control-label" htmlhtmlFor="consectetur">
                            Consectetur
                        </label>
                        <div className="col-sm-10">
                          <input type="text" id="consectetur" className="form-control" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label" htmlhtmlFor="adipiscing">
                            Adipiscing
                        </label>
                        <div className="col-sm-10">
                          <textarea id="adipiscing" className="form-control" rows="2"></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="wizard-pf-contents hidden">
                    <div className="wizard-pf-review-steps">
                      <ul className="list-group">
                        <li className="list-group-item">
                          <a
                            onClick={() => {
                              $(this).toggleClass('collapsed');
                              $('#reviewStep1').toggleClass('collapse');
                            }}
                          ><FormattedMessage defaultMessage="First Step" /></a>
                          <div id="reviewStep1" className="wizard-pf-review-substeps">
                            <ul className="list-group">
                              <li className="list-group-item">
                                <a
                                  onClick={() => {
                                    $(this).toggleClass('collapsed');
                                    $('#reviewStep1Substep1').toggleClass('collapse');
                                  }}
                                >
                                  <span className="wizard-pf-substep-number">1A.</span>
                                  <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Details" /></span>
                                </a>
                                <div id="reviewStep1Substep1" className="wizard-pf-review-content">
                                  <form className="form">
                                    <div className="wizard-pf-review-item">
                                      <span className="wizard-pf-review-item-label">
                                        <FormattedMessage defaultMessage="Name:" />
                                      </span>
                                      <span className="wizard-pf-review-item-value">
                                        <FormattedMessage defaultMessage="First Last" />
                                      </span>
                                    </div>
                                    <div className="wizard-pf-review-item">
                                      <span className="wizard-pf-review-item-label">
                                        <FormattedMessage defaultMessage="Description:" />
                                      </span>
                                      <span className="wizard-pf-review-item-value">
                                        <FormattedMessage defaultMessage="This is the description" />
                                      </span>
                                    </div>
                                  </form>
                                </div>
                              </li>
                              <li className="list-group-item">
                                <a
                                  onClick={() => {
                                    $(this).toggleClass('collapsed');
                                    $('#reviewStep1Substep2').toggleClass('collapse');
                                  }}
                                >
                                  <span className="wizard-pf-substep-number">1B.</span>
                                  <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Settings" /></span>
                                </a>
                                <div id="reviewStep1Substep2" className="wizard-pf-review-content">
                                  <form className="form">
                                    <div className="wizard-pf-review-item">
                                      <div className="wizard-pf-review-item-field">
                                        <FormattedMessage defaultMessage="Setting A" />
                                      </div>
                                      <div className="wizard-pf-review-item-field">
                                        <FormattedMessage defaultMessage="Setting B" />
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="list-group-item">
                          <a
                            onClick={() => {
                              $(this).toggleClass('collapsed');
                              $('#reviewStep2').toggleClass('collapse');
                            }}
                          ><FormattedMessage defaultMessage="Second Step" /></a>
                          <div id="reviewStep2" className="wizard-pf-review-substeps">
                            <ul className="list-group">
                              <li className="list-group-item">
                                <a
                                  onClick={() => {
                                    $(this).toggleClass('collapsed');
                                    $('#reviewStep2Substep1').toggleClass('collapse');
                                  }}
                                >
                                  <span className="wizard-pf-substep-number">2A.</span>
                                  <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Details" /></span>
                                </a>
                                <div id="reviewStep2Substep1" className="wizard-pf-review-content">
                                  <form className="form">
                                    <div className="wizard-pf-review-item">
                                      <span className="wizard-pf-review-item-label">
                                        <FormattedMessage defaultMessage="Name:" />
                                      </span>
                                      <span className="wizard-pf-review-item-value">
                                        <FormattedMessage defaultMessage="First Last" />
                                      </span>
                                    </div>
                                    <div className="wizard-pf-review-item">
                                      <span className="wizard-pf-review-item-label">
                                        <FormattedMessage defaultMessage="Description:" />
                                      </span>
                                      <span className="wizard-pf-review-item-value">
                                        <FormattedMessage defaultMessage="This is the description" />
                                      </span>
                                    </div>
                                  </form>
                                </div>
                              </li>
                              <li className="list-group-item">
                                <a
                                  onClick={() => {
                                    $(this).toggleClass('collapsed');
                                    $('#reviewStep2Substep2').toggleClass('collapse');
                                  }}
                                >
                                  <span className="wizard-pf-substep-number">2B.</span>
                                  <span className="wizard-pf-substep-title"><FormattedMessage defaultMessage="Settings" /></span>
                                </a>
                                <div id="reviewStep2Substep2" className="wizard-pf-review-content">
                                  <form className="form">
                                    <div className="wizard-pf-review-item">
                                      <div className="wizard-pf-review-item-field">
                                        <FormattedMessage defaultMessage="Setting A" />
                                      </div>
                                      <div className="wizard-pf-review-item-field">
                                        <FormattedMessage defaultMessage="Setting B" />
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="wizard-pf-contents hidden">
                    <div className="wizard-pf-process blank-slate-pf">
                      <div className="spinner spinner-lg blank-slate-pf-icon"></div>
                      <h3 className="blank-slate-pf-main-action"><FormattedMessage defaultMessage="Deployment in progress" /></h3>
                      <p className="blank-slate-pf-secondary-action">Lorem ipsum dolor sit amet,
                      porta at suspendisse ac, ut wisi
                      vivamus, lorem sociosqu eget nunc amet. </p>
                    </div>
                    <div className="wizard-pf-complete blank-slate-pf hidden">
                      <div className="wizard-pf-success-icon">
                        <span className="glyphicon glyphicon-ok-circle"></span>
                      </div>
                      <h3 className="blank-slate-pf-main-action">
                        <FormattedMessage defaultMessage="Deployment was successful" />
                      </h3>
                      <p className="blank-slate-pf-secondary-action">Lorem ipsum dolor sit amet,
                      porta at suspendisse ac, ut wisi
                      vivamus, lorem sociosqu eget nunc amet. </p>
                      <button type="button" className="btn btn-lg btn-primary">
                        <FormattedMessage defaultMessage="View Deployment" />
                      </button>

                    </div>
                  </div>
                </div>{/* /.wizard-pf-main */}
              </div>

            </div>{/* /.wizard-pf-body */}

            <div className="modal-footer wizard-pf-footer">
              <button
                type="button"
                className="btn btn-default btn-cancel wizard-pf-cancel wizard-pf-dismiss"
                onClick={this.handleClose}
              ><FormattedMessage defaultMessage="Cancel" /></button>
              <button type="button" className="btn btn-default wizard-pf-back disabled">
                <span className="i fa fa-angle-left"></span>
                <FormattedMessage defaultMessage="Back" />
              </button>
              <button type="button" className="btn btn-primary wizard-pf-next disabled">
                <FormattedMessage defaultMessage="Next" />
                <span className="i fa fa-angle-right"></span>
              </button>
              <button type="button" className="btn btn-primary hidden wizard-pf-finish">
                <FormattedMessage defaultMessage="Deploy" />
                <span className="i fa fa-angle-right"></span>
              </button>
              <button
                type="button"
                className="btn btn-primary hidden wizard-pf-close wizard-pf-dismiss"
                onClick={this.handleClose}
              ><FormattedMessage defaultMessage="Close" /></button>

            </div>{/* .wizard-pf-footer */}
          </div>{/* /.modal-content */}
        </div>{/* /.modal-dialog */}
      </div>
    );
  }
}

WizardView.propTypes = {
  handleClose: PropTypes.func,
  intl: intlShape.isRequired,
};

export default injectIntl(WizardView);
