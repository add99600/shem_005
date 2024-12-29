import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";

function PageTemplate({
  headerTitle = "header Title",
  headerSmall = "header small text goes here...",
  panelTitle = "Panel Title",
  panelBody = "Panel Body",
  cssClass = "h-100",
  children,
}) {
  return (
    <div>
      <h1 className="page-header">
        {headerTitle} <small>{headerSmall}</small>
      </h1>

      <div className="row">
        <div className={`col-xl-12 ${cssClass}`}>
          <Panel>
            <PanelHeader>{panelTitle}</PanelHeader>
            <PanelBody>{panelBody}</PanelBody>
            {children}
          </Panel>
        </div>
      </div>
    </div>
  );
}

export default PageTemplate;
