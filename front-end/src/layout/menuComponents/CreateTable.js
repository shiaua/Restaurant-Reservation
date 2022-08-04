import React, { useState } from "react";
import { useHistory } from "react-router";
import CreateTableForm from "./CreateTableForm";
import ErrorAlert from "../ErrorAlert";
import { createTables } from "../../utils/api";

function CreateTable() {
  const history = useHistory();

  const initialTableInfo = {
    table_name: "",
    capacity: 0,
  };
  const [tableInfo, setTableInfo] = useState(initialTableInfo);
  const [error, setError] = useState(null);

  const handleCreateTable = async (evt) => {
    evt.preventDefault();
    setTableInfo(initialTableInfo);
    setError(null);
    try {
      const abortController = new AbortController();
      await createTables(
        {
          ...tableInfo,
          capacity: parseInt(tableInfo.capacity),
        },
        abortController.signal
      );
      history.push("/");
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      } else return;
    }
  };

  const onCancel = () => {
    setTableInfo(initialTableInfo);
    if (history.length > 1) {
      history.goBack();
    } else history.push("/");
  };
  return (
    <main>
      <h1>Create Table</h1>
      {error ? <ErrorAlert key={Date.now()} error={error} /> : null}
      <CreateTableForm
        onSubmit={handleCreateTable}
        onCancel={onCancel}
        tableInfo={tableInfo}
        setTableInfo={setTableInfo}
        submitLabel="Submit"
        cancelLabel="Cancel"
      />
    </main>
  );
}

export default CreateTable;