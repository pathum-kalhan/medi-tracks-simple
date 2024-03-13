"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { blue } from "@mui/material/colors";

const MessageRow = styled("div")({
  display: "flex",
});

const MessageRowRight = styled(MessageRow)({
  justifyContent: "flex-end",
});

const MessageBubble = styled("div")(({ theme }) => ({
  position: "relative",
  marginBottom: "10px",
  padding: "10px",
  width: "60%",
  textAlign: "left",
  font: '400 .9em "Open Sans", sans-serif',
  borderRadius: "10px",
}));

const OrangeAvatar = styled(Avatar)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[500]),
  backgroundColor: blue[500],
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const DisplayName = styled("div")({
  marginLeft: "20px",
});

export const MessageLeft = (props: any) => {
  console.log(props, "props in message left");
  const {
    message = "no message",
    timestamp = "",
    photoURL,
    displayName = "Avatar",
  } = props;

  return (
    <>
      <MessageRow>
        <OrangeAvatar alt={displayName} src={photoURL}></OrangeAvatar>
        <div>
          <DisplayName>{displayName}</DisplayName>
          <MessageBubble>
            <p>{message}</p>
            <div>{timestamp}</div>
          </MessageBubble>
        </div>
      </MessageRow>
    </>
  );
};

export const MessageRight = (props: any) => {
  const { message = "no message", timestamp = "" } = props;

  return (
    <MessageRowRight>
      <MessageBubble>
        <p>{message}</p>
        <div>{timestamp}</div>
      </MessageBubble>
    </MessageRowRight>
  );
};
