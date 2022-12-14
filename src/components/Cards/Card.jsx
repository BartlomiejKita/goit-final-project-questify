import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useTimeout } from "../../hooks/useTimeout";
import { convertDayDisplay } from "../../utils/convertDayDisplay";
import { ReactComponent as FireIcon } from "./images/fire.svg";
import { ReactComponent as StarIcon } from "./images/star.svg";
import { ReactComponent as TrophyIcon } from "./images/trophy.svg";
import { ReactComponent as QuestAwardIcon } from "./images/quest-award.svg";
import { ReactComponent as ChallengeAwardIcon } from "./images/challenge-award.svg";
import { ReactComponent as ArrowIcon } from "./images/arrow.svg";
import {
  CardItem,
  CardType,
  Category,
  DatetimeBar,
  DifficultyBar,
  FlippedCard,
  ContinueBox,
} from "./Card.styled";
import { useCompleteCardMutation } from "../../redux/slices/questifyAPI";
import CardDelete from "../CardDelete/CardDelete";
import ConfirmCancelModal from "../ConfirmCancelModal/ConfirmCancelModal";


const Card = ({ _id: id, title, difficulty, category, date, time, type }) => {

  const [completeCard] = useCompleteCardMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleIsFlipped = () => {
    setIsFlipped((current) => !current);
    !isFlipped && toggleDeleteModal();
  };
  const toggleModal = () => setIsModalOpen((isModalOpen) => !isModalOpen);

  const questDatetime = new Date(`${date}T${time}`).getTime();
  const isTimeout = useTimeout(questDatetime);

  const convertedDate = convertDayDisplay(date, type);

  const isChallenge = (type) => type === "Challenge";
  const typeIcon = isChallenge(type) ? (
    <TrophyIcon onClick={toggleIsFlipped} />
  ) : (
    <StarIcon onClick={toggleIsFlipped} />
  );
  const awardIcon = isChallenge(type) ? (
    <ChallengeAwardIcon />
  ) : (
    <QuestAwardIcon />
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleDeleteModal = () =>
    setIsDeleteModalOpen((isDeleteModalOpen) => !isDeleteModalOpen);

  const shortenTitle = (() => {
    if (title.length > 18) {
      return `${title.slice(0, 17)}...`;
    }

    return title;
  })();

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <CardItem cardType={type} onClick={toggleDeleteModal}>
        <DifficultyBar cardType={type} difficulty={difficulty}>
          <p>{difficulty}</p>
          {typeIcon}
        </DifficultyBar>
        {isChallenge(type) && <CardType>{type}</CardType>}
        <h3>{title}</h3>
        <DatetimeBar>
          <p>
            <span>{convertedDate}</span>, <span>{time}</span>
          </p>
          {isTimeout && <FireIcon />}
        </DatetimeBar>
        <Category category={category}>{category}</Category>
        <CardDelete cardType={type} cardId={id} isOpen={isDeleteModalOpen} />
      </CardItem>
      <FlippedCard>
        <p>
          COMPLETED: <span onClick={toggleIsFlipped}>{shortenTitle}</span>
        </p>
        {awardIcon}
        <ContinueBox onClick={toggleModal}>
          <p>Continue</p>
          <ArrowIcon />
        </ContinueBox>
        <ConfirmCancelModal
          isOpen={isModalOpen}
          modalContent="Are you sure?"
          nameOfConfirm="Yes"
          cancelingModalAction={toggleModal}
          confirmingModalAction={() => completeCard(id)}
        />
      </FlippedCard>
    </ReactCardFlip>
  );
};

export default Card;
