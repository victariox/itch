import React from "react";
import classNames from "classnames";
import Hoverable from "../basics/hover-hoc";
import Filler from "../basics/filler";
import Cover from "../basics/cover";
import IconButton from "../basics/icon-button";

const HoverCover = Hoverable(Cover);

import MainAction from "../game-actions/main-action";
import getGameStatus, { IGameStatus } from "common/helpers/get-game-status";
import { IRootState } from "common/types";
import { connect, Dispatchers, actionCreatorsList } from "../connect";

import { Game, CaveSummary } from "common/butlerd/messages";

class Cell extends React.PureComponent<IProps & IDerivedProps> {
  render() {
    const { game, status } = this.props;

    const {
      column,
      columnWidth,
      row,
      rowHeight,
      interiorMargin,
      globalMargin,
    } = this.props;
    const { stillCoverUrl, coverUrl } = game;

    // round numbers to avoid blurry text
    const translateX = Math.round(column * (columnWidth + interiorMargin));
    const translateY = Math.round(
      globalMargin + row * (rowHeight + interiorMargin)
    );
    const style = {
      transform: `translate(${translateX}px, ${translateY}px)`,
    };

    const className = classNames("grid--cell");

    return (
      <div className={className} style={style} data-game-id={game.id}>
        <HoverCover
          className="cell--cover"
          showGifMarker={true}
          coverUrl={coverUrl}
          stillCoverUrl={stillCoverUrl}
          gameId={game.id}
        />
        <div className="cell--undercover">
          <div className="cell--title">{game.title}</div>
          <div className="cell--actions">
            <MainAction
              className="cell-main-action"
              game={game}
              status={status}
            />
            <Filler />
            <IconButton
              big
              className="cell-main-action"
              icon="more_vert"
              onClick={this.onMoreClick}
              emphasized
            />
          </div>
        </div>
      </div>
    );
  }

  onMoreClick = (ev: React.MouseEvent<any>) => {
    const { game, openGameContextMenu } = this.props;
    openGameContextMenu({ game, clientX: ev.clientX, clientY: ev.pageY });
  };
}

interface IProps {
  game: Game;
  cave: CaveSummary;

  column: number;
  columnWidth: number;

  row: number;
  rowHeight: number;

  interiorMargin: number;
  globalMargin: number;
}

const actionCreators = actionCreatorsList("openGameContextMenu");

type IDerivedProps = Dispatchers<typeof actionCreators> & {
  status: IGameStatus;
};

export default connect<IProps>(Cell, {
  state: (rs: IRootState, props: IProps) => ({
    status: getGameStatus(rs, props.game),
  }),
  actionCreators,
});
