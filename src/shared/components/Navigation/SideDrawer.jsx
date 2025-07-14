import { createPortal } from "react-dom";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = props.show && (
    <aside className="side-drawer" onClick={props.onClick}>
      {props.children}
    </aside>
  );

  return createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
