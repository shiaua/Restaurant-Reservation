function CreateTableForm({
    onSubmit,
    onCancel,
    tableInfo,
    setTableInfo,
    submitLabel,
    cancelLabel,
  }) {
    const handleInputChange = (evt) => {
      setTableInfo({
        ...tableInfo,
        [evt.target.name]: evt.target.value,
      });
    };
    return (
      <form onSubmit={onSubmit}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label htmlFor="table_name">Table Name</label>
              <input
                id="table_name"
                name="table_name"
                type="text"
                value={tableInfo.table_name}
                onChange={handleInputChange}
                required
                className="form-control"
                minLength={2}
                placeholder="Table Name"
              ></input>
            </div>
            <div className="form-group col">
              <label htmlFor="capacity">Capacity</label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                value={tableInfo.capacity}
                onChange={handleInputChange}
                required
                className="form-control"
                min={1}
                aria-label="Capacity of Table"
              ></input>
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
  
  export default CreateTableForm;