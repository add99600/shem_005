import React from "react";
import PageHeader from "./page-header";
import PageContent from "./page-content";

function PageHub({ menuId, title }) {
  return (
    <div style={{ backgroundColor: "var(--bs-body-bg)" }}>
      <PageHeader title={title} />
      <PageContent menuId={menuId} />
    </div>
  );
}

export default PageHub;
