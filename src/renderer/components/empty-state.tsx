import React from "react";

import Icon from "./basics/icon";

import styled from "./styles";
import Button from "./basics/button";
import { ILocalizedString } from "common/types";
import { T } from "renderer/t";

const EmptyStateDiv = styled.div`
  color: ${props => props.theme.secondaryText};
  width: 100%;
  text-align: center;

  .leader {
    display: inline-block;
    font-size: 170px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: ${props => props.theme.fontSizes.enormous};
    font-weight: bold;
    margin-bottom: 10px;
  }

  h2 {
    font-size: ${props => props.theme.fontSizes.huge};
  }
`;

const ButtonContainer = styled.div`
  margin: 20px;
  display: inline-block;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  overflow: hidden;
`;

class EmptyState extends React.PureComponent<IProps> {
  render() {
    const {
      bigText,
      smallText,
      icon,
      buttonIcon,
      buttonText,
      buttonAction,
      className,
    } = this.props;

    return (
      <EmptyStateContainer>
        <EmptyStateDiv className={className}>
          <Icon icon={icon} className="leader" />
          <h1>{T(bigText)}</h1>
          {smallText ? <h2>{T(smallText)}</h2> : null}
          {buttonAction ? (
            <>
              <ButtonContainer>
                <Button
                  icon={buttonIcon}
                  primary
                  discreet
                  onClick={buttonAction}
                >
                  {T(buttonText)}
                </Button>
              </ButtonContainer>
            </>
          ) : null}
        </EmptyStateDiv>
      </EmptyStateContainer>
    );
  }
}

export default EmptyState;

interface IProps {
  className?: string;
  bigText: ILocalizedString;
  smallText?: ILocalizedString;
  icon: string;
  buttonIcon?: string;
  buttonText?: ILocalizedString;
  buttonAction?: React.MouseEventHandler<HTMLDivElement>;
}
