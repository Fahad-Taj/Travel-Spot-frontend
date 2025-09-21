import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { useRef } from 'react';
import "./SideDrawer.css";

const SideDrawer = (props) => {
    // We have to use a nodeRef due to modern practices.
    // Disable Strict Mode if you don't want to use nodeRef at all.
    const nodeRef = useRef(null);

    const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
    >
      <aside ref={nodeRef} className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
