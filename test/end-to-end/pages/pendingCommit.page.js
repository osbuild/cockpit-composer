class PendingCommitPage {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-pending-changes"]';
  }

  loading() {
    $(this.containerSelector).waitForDisplayed(timeout);
  }

  get commitButton() {
    return $(`${this.containerSelector} .modal-footer button[class="btn btn-primary"]`).element();
  }

  get closeButton() {
    return $("button=Close").element();
  }

  get xButton() {
    return $(`${this.containerSelector} .pficon-close`).element();
  }

  get infoMessage() {
    return $("span=Only changes to selected components are shown.").element();
  }

  get blueprintNameLabel() {
    return $(`${this.containerSelector} .form-horizontal > p`).element();
  }

  get changeLogList() {
    return $$(`${this.containerSelector} .form-horizontal ul li`);
  }

  actionNameOnNth(nth) {
    return $$(`${this.containerSelector} .form-horizontal ul li .col-sm-3`)[nth].getText();
  }

  changedPackageNameOnNth(nth) {
    return $$(`${this.containerSelector} .form-horizontal ul li .col-sm-9`)[nth].getText();
  }
}

module.exports = new PendingCommitPage();
