import React from "react";

type Props = {};

const layout = ({ children, modal }:{
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default layout;
