import React from "react";
import { FormattedMessage, defineMessages, injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Checkbox, Form, FormGroup, Modal, ModalVariant, TextInput, TextArea } from "@patternfly/react-core";
import { PencilAltIcon } from "@patternfly/react-icons";
import { setBlueprintUsers } from "../../core/actions/blueprints";
import "./UserAccount.css";

const ariaLabels = defineMessages({
  adminCheckbox: {
    defaultMessage: "Server admin checkbox",
  },
});

const messages = defineMessages({
  sshKeyHelp: {
    defaultMessage: "Paste the contents of your public SSH key file here. ",
  },
  usernameValidChars: {
    defaultMessage: "The user name can only consist of letters from a-z, digits, dots, dashes and underscores.",
  },
  usernameEmpty: {
    defaultMessage: "The user name cannot be empty.",
  },
  usernameDuplicate: {
    defaultMessage: "This user name already exists.",
  },
  passwordMatch: {
    defaultMessage: "The values entered for password do not match.",
  },
  labelName: {
    defaultMessage: "Full name",
  },
  labelUsername: {
    defaultMessage: "User name",
  },
  labelRole: {
    defaultMessage: "Role",
  },
  labelAdmin: {
    defaultMessage: "Server administrator",
  },
  labelPassword: {
    defaultMessage: "Password",
  },
  labelConfirmPassword: {
    defaultMessage: "Confirm password",
  },
  labelSSHKey: {
    defaultMessage: "SSH key",
  },
});

class UserAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      name: "",
      // state value for existing username when editing user
      usernameOld: "",
      username: "",
      usernameValidated: "default",
      isUsernameDuplicate: false,
      isUsernameEmpty: false,
      isUsernameValidChars: false,
      isAdmin: false,
      password: "",
      passwordConfirm: "",
      passwordValidated: "default",
      sshKey: "",
    };
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSetName = this.handleSetName.bind(this);
    this.handleSetUsername = this.handleSetUsername.bind(this);
    this.handleIsAdmin = this.handleIsAdmin.bind(this);
    this.validateUserName = this.validateUserName.bind(this);
    this.handleSetPassword = this.handleSetPassword.bind(this);
    this.handleSetPasswordConfirm = this.handleSetPasswordConfirm.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.handleSetSSHKey = this.handleSetSSHKey.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
  }

  componentDidMount() {
    if (this.props.edit) {
      this.setState({
        username: this.props.user.name,
        usernameOld: this.props.user.name,
        name: this.props.user.description,
        password: this.props.user.password,
        passwordConfirm: this.props.user.password,
        isAdmin: this.props.user.groups && this.props.user.groups[0] === "wheel",
        sshKey: this.props.user.key ? this.props.user.key : "",
      });
    }
  }

  handleModalOpen() {
    this.setState({ isModalOpen: true });
  }

  handleModalClose() {
    // clear state
    if (this.props.edit) {
      this.setState({
        username: this.props.user.name,
        usernameOld: this.props.user.name,
        name: this.props.user.description,
        password: this.props.user.password,
        passwordConfirm: this.props.user.password,
        isAdmin: this.props.user.groups && this.props.user.groups[0] === "wheel",
        sshKey: this.props.user.key ? this.props.user.key : "",
      });
    } else {
      this.setState({
        name: "",
        username: "",
        password: "",
        passwordConfirm: "",
        sshKey: "",
      });
    }
    // clear validation
    this.setState({
      usernameValidated: "default",
      isUsernameDuplicate: false,
      isUsernameEmpty: false,
      isUsernameValidChars: false,
      passwordValidated: "default",
    });
    // close modal
    this.setState({ isModalOpen: false });
  }

  handleSetName(name) {
    this.setState({ name });
  }

  handleSetUsername(username) {
    this.setState({ username });
    this.validateUserName(username);
  }

  handleIsAdmin(checked) {
    this.setState({ isAdmin: checked });
  }

  handleSetPassword(password) {
    this.setState({ password });
    if (!password && !this.state.passwordConfirm) {
      this.setState({ passwordValidated: "default" });
    } else if (password === this.state.passwordConfirm) {
      this.setState({ passwordValidated: "success" });
    } else if (this.state.passwordConfirm && password !== this.state.passwordConfirm) {
      this.setState({ passwordValidated: "error" });
    }
  }

  handleSetPasswordConfirm(passwordConfirm) {
    this.setState({ passwordConfirm });
    if (!this.state.password && !passwordConfirm) {
      this.setState({ passwordValidated: "default" });
    } else if (this.state.password === passwordConfirm) {
      this.setState({ passwordValidated: "success" });
    } else {
      this.setState({ passwordValidated: "error" });
    }
  }

  handleSetSSHKey(sshKey) {
    this.setState({ sshKey });
  }

  handleCreateUser() {
    const user = {
      name: this.state.username,
      description: this.state.name ? this.state.name : undefined,
      groups: this.state.isAdmin ? ["wheel"] : undefined,
      password: this.state.password,
      key: this.state.sshKey ? this.state.sshKey : undefined,
    };
    const users = this.props.users.concat(user);
    this.props.setBlueprintUsers(this.props.blueprintID, users);
    this.handleModalClose();
  }

  handleUpdateUser() {
    const userUpdated = {
      name: this.state.username,
      description: this.state.name ? this.state.name : undefined,
      groups: this.state.isAdmin ? ["wheel"] : undefined,
      password: this.state.password,
      key: this.state.sshKey ? this.state.sshKey : undefined,
    };
    const users = this.props.users.map((user) => {
      if (user.name === this.state.usernameOld) return userUpdated;
      return user;
    });
    this.props.setBlueprintUsers(this.props.blueprintID, users);
    this.handleModalClose();
  }

  validateUserName(username) {
    if (username === "") {
      this.setState({ usernameValidated: "error", isUsernameEmpty: true });
      return;
    }

    let isDuplicateUser = false;
    this.props.users.map((user) => {
      if (user.name === username && user.name !== this.state.usernameOld) {
        isDuplicateUser = true;
      }
    });
    if (isDuplicateUser) {
      this.setState({ usernameValidated: "error", isUsernameDuplicate: true });
      return;
    }

    const validCharacters = /^(\d|\w|-|_|\.){0,252}$/.test(username);
    if (!validCharacters) {
      this.setState({ usernameValidated: "error", isUsernameValidChars: true });
      return;
    }

    this.setState({
      usernameValidated: "success",
      isUsernameEmpty: false,
      isUsernameDuplicate: false,
      isUsernameValidChars: false,
    });
  }

  validatePassword() {
    if (!this.state.password && !this.state.passwordConfirm) {
      this.setState({ passwordValidated: "default" });
    } else if (this.state.password === this.state.passwordConfirm) {
      this.setState({ passwordValidated: "success" });
    } else {
      this.setState({ passwordValidated: "error" });
    }
  }

  render() {
    const { isModalOpen } = this.state;
    const { formatMessage } = this.props.intl;

    return (
      <>
        {this.props.edit ? (
          <Button id="button-edit-user" variant="primary" onClick={this.handleModalOpen}>
            <PencilAltIcon />
          </Button>
        ) : (
          <Button variant="primary" onClick={this.handleModalOpen}>
            <FormattedMessage defaultMessage="Create user account" />
          </Button>
        )}
        <Modal
          id="user-account-modal"
          position="top"
          variant={ModalVariant.medium}
          title={
            this.props.edit ? (
              <FormattedMessage defaultMessage="Edit user account" />
            ) : (
              <FormattedMessage defaultMessage="Create user account" />
            )
          }
          isOpen={isModalOpen}
          onClose={this.handleModalClose}
          actions={[
            this.props.edit ? (
              <Button
                key="update"
                variant="primary"
                onClick={this.handleUpdateUser}
                isDisabled={!this.state.username || this.state.password !== this.state.passwordConfirm}
              >
                <FormattedMessage defaultMessage="Update" />
              </Button>
            ) : (
              <Button
                key="create"
                variant="primary"
                onClick={this.handleCreateUser}
                isDisabled={!this.state.username || this.state.password !== this.state.passwordConfirm}
              >
                <FormattedMessage defaultMessage="Create" />
              </Button>
            ),
            <Button key="cancel" variant="link" onClick={this.handleModalClose}>
              <FormattedMessage defaultMessage="Cancel" />
            </Button>,
          ]}
        >
          <Form isHorizontal>
            <FormattedMessage
              defaultMessage="The fields marked with {val} are required."
              values={{
                val: <span className="required-pf">*</span>,
              }}
            />
            <FormGroup label={formatMessage(messages.labelName)} fieldId="user-account-name">
              <TextInput value={this.state.name} type="text" id="user-account-name" onChange={this.handleSetName} />
            </FormGroup>
            <FormGroup
              label={formatMessage(messages.labelUsername)}
              isRequired
              fieldId="user-account-username"
              helperText={formatMessage(messages.usernameValidChars)}
              helperTextInvalid={
                (this.state.isUsernameValidChars && formatMessage(messages.usernameValidChars)) ||
                (this.state.isUsernameEmpty && formatMessage(messages.usernameEmpty)) ||
                (this.state.isUsernameDuplicate && formatMessage(messages.usernameDuplicate))
              }
              validated={this.state.usernameValidated}
            >
              <TextInput
                value={this.state.username}
                onChange={this.handleSetUsername}
                validated={this.state.usernameValidated}
                isRequired
                type="text"
                id="user-account-username"
              />
            </FormGroup>
            <FormGroup label={formatMessage(messages.labelRole)} fieldId="user-account-role">
              <Checkbox
                className="admin-checkbox"
                label={formatMessage(messages.labelAdmin)}
                isChecked={this.state.isAdmin}
                type="text"
                id="user-account-role"
                onChange={this.handleIsAdmin}
                aria-label={formatMessage(ariaLabels.adminCheckbox)}
              />
            </FormGroup>
            <FormGroup
              label={formatMessage(messages.labelPassword)}
              fieldId="user-account-password"
              validated={this.state.passwordValidated}
            >
              <TextInput
                value={this.state.password}
                onChange={this.handleSetPassword}
                onBlur={this.validatePassword}
                validated={this.state.passwordValidated}
                type="password"
                id="user-account-password"
              />
            </FormGroup>
            <FormGroup
              label={formatMessage(messages.labelConfirmPassword)}
              fieldId="user-account-password-confirm"
              validated={this.state.passwordValidated}
              helperTextInvalid={formatMessage(messages.passwordMatch)}
            >
              <TextInput
                value={this.state.passwordConfirm}
                onChange={this.handleSetPasswordConfirm}
                validated={this.state.passwordValidated}
                type="password"
                id="user-account-password-confirm"
              />
            </FormGroup>
            <FormGroup
              label={formatMessage(messages.labelSSHKey)}
              fieldId="user-account-ssh-key"
              helperText={formatMessage(messages.sshKeyHelp)}
            >
              <TextArea
                value={this.state.sshKey}
                onChange={this.handleSetSSHKey}
                type="text"
                id="user-account-ssh-key"
              />
            </FormGroup>
          </Form>
        </Modal>
      </>
    );
  }
}

UserAccount.propTypes = {
  user: PropTypes.object,
  edit: PropTypes.bool,
  blueprintID: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
  setBlueprintUsers: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

UserAccount.defaultProps = {
  user: {},
  edit: false,
  blueprintID: "",
  users: [],
  setBlueprintUsers() {},
};

const mapDispatchToProps = (dispatch) => ({
  setBlueprintUsers: (id, users) => {
    dispatch(setBlueprintUsers(id, users));
  },
});

export default connect(null, mapDispatchToProps)(injectIntl(UserAccount));
