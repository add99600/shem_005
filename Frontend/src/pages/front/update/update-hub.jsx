import React from "react";
import PageHeader from "../page-header";
import PageContent from "./update-content";

import { useParams } from "react-router-dom";

function UpdateHub({ menuId, title }) {
  const { table, id } = useParams();

  console.log("Menu ID:", table);
  console.log("Work ID:", id);

  return (
    <div style={{ backgroundColor: "var(--bs-body-bg)" }}>
      <PageHeader title={title} />
      <PageContent menuId={menuId} table={table} id={id} />
    </div>
  );
}

export default UpdateHub;
