import React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "../connect";

import urls from "common/constants/urls";

import Icon from "../basics/icon";

import { T } from "renderer/t";

import { IRootState, IOpenAtLoginError } from "common/types";

class OpenAtLoginError extends React.PureComponent<IProps & IDerivedProps> {
  render() {
    const { openAtLoginError } = this.props;

    if (!openAtLoginError) {
      return null;
    }

    let cause: JSX.Element | string;

    if (openAtLoginError.cause === "no_desktop_file") {
      cause = T([
        "preferences.behavior.open_at_login.causes.no_desktop_file",
        {
          linux_install_page: (
            <a href={urls.installingOnLinux}>installing itch on Linux</a>
          ),
        },
      ]);
    } else if (openAtLoginError.cause === "error") {
      cause = openAtLoginError.message;
    }

    if (cause) {
      return (
        <p className="explanation drop-down" style={{ marginBottom: "15px" }}>
          <Icon icon="warning" />{" "}
          {T([
            "preferences.behavior.open_at_login.error",
            {
              cause: <span>{cause}</span>,
            },
          ])}
        </p>
      );
    }

    return null;
  }
}

interface IProps {}

interface IDerivedProps {
  openAtLoginError: IOpenAtLoginError;
}

export default connect<IProps>(OpenAtLoginError, {
  state: createStructuredSelector({
    openAtLoginError: (rs: IRootState) => rs.status.openAtLoginError,
  }),
});
