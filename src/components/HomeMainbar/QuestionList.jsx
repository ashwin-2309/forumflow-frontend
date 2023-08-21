import React from "react";
import Questions from "./Questions";

const QuestionList = ({ questionsList }) => {
  console.log(questionsList);
  if (!questionsList) {
    return <></>; // Return empty if questionsList is not available yet
  }

  return (
    <>
      {questionsList.map((question) => (
        <Questions question={question} key={question._id} />
      ))}
    </>
  );
};

export default QuestionList;