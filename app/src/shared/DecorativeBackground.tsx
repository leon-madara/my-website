import { useLocation } from "react-router-dom";

export function DecorativeBackground() {
  const location = useLocation();

  if (location.pathname.startsWith("/portfolio")) {
    return null;
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="background-pattern"
        role="presentation"
      />
      <div
        aria-hidden="true"
        className="kenyan-code-elements"
        role="presentation"
      >
        <div className="code-element code-element-1">&lt;/&gt;</div>
        <div className="code-element code-element-2">{"{ }"}</div>
        <div className="code-element code-element-3">[ ]</div>
        <div className="code-element code-element-4">( )</div>
        <div className="code-element code-element-5">=&gt;</div>
        <div className="code-element code-element-6">&amp;&amp;</div>
      </div>
    </>
  );
}
