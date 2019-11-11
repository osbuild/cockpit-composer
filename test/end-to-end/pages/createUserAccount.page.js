class CreateUserAccount {
  constructor() {
    this.containerSelector = '[id="cmpsr-modal-user-account"]';
  }

  loading() {
    $(this.containerSelector).waitForExist(timeout);
  }

  get fullNameBox() {
    return $(`${this.containerSelector} [id="textInput2-modal-user"]`).element();
  }

  get userNameBox() {
    return $(`${this.containerSelector} [id="textInput1-modal-user"]`).element();
  }

  get userErrorLabel() {
    return $(`${this.containerSelector} [id="textInput1-modal-user-help1"]`).element();
  }

  get roleCheckbox() {
    return $(`${this.containerSelector} input[type="checkbox"]`).element();
  }

  get passwordBox() {
    return $(`${this.containerSelector} [id="textInput1-modal-password"]`).element();
  }

  get confirmPasswordBox() {
    return $(`${this.containerSelector} [id="textInput2-modal-password"]`).element();
  }

  get passwordErrorLabel1() {
    return $(`${this.containerSelector} [id="textInput2-modal-password-help"]`).element();
  }

  get passwordErrorLabel2() {
    return $(`${this.containerSelector} [id="textInput2-modal-password-help2"]`).element();
  }

  get setNewPasswordButton() {
    return $("span=Set New Password").element();
  }

  get removePasswordButton() {
    return $("span=Remove Password").element();
  }

  get setPasswordButton() {
    return $("span=Set Password").element();
  }

  get sshKeyBox() {
    return $(`${this.containerSelector} [id="textInput5-modal-user"]`).element();
  }

  get createButton() {
    return $(`${this.containerSelector} [type="submit"]`).element();
  }

  get cancelButton() {
    return $("span=Cancel").element();
  }

  get updateButton() {
    return $("span=Update").element();
  }

  get xButton() {
    return $(`${this.containerSelector} .close`).element();
  }
}

module.exports = new CreateUserAccount();
