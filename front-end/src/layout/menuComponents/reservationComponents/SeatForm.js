function SeatForm({
    onSubmit,
    onCancel,
    setSelectedTable,
    submitLabel,
    cancelLabel,
    tableOptions,
    tables,
  }) {
    const handleTableSelection = (evt) => {
      const findSelectedTable = tables.find(
        (table) => table.table_id === parseInt(evt.target.value)
      );
      setSelectedTable(findSelectedTable);
    };
    return (
      <form onSubmit={onSubmit}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="table_id">Seat at:</label>
              <select
                id="table_id"
                name="table_id"
                onChange={handleTableSelection}
                required
                className="form-control"
              >
                <option value>Select a table</option>
                {tableOptions}
              </select>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={onCancel}
          >
            <span className="oi oi-x"></span>
            &nbsp;{cancelLabel}
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="oi oi-check"></span>
            &nbsp;{submitLabel}
          </button>
        </fieldset>
      </form>
    );
  }
  
  export default SeatForm;