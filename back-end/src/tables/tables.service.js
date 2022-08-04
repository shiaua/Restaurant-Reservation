const knex = require("../db/connection");
const tableName = "tables";

function list() {
  return knex(tableName).select().orderBy("table_name");
}

function readReservation(reservation_id) {
  return knex("reservations").select().where({ reservation_id }).first();
}

function readTable(table_id) {
  return knex(tableName).select().where({ table_id }).first();
}

function create(newTable) {
  return knex(tableName)
    .insert(newTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

//return the `Tables` table updated row
function updateTables({ table_id, reservation_id }) {
  return knex.transaction(async (trx) => {
    const table = await knex(tableName)
      .where({ table_id })
      .update({ reservation_id })
      .returning("*")
      .transacting(trx)
      .then((clearedRecords) => clearedRecords[0]);

    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .returning("*")
      .transacting(trx)
      .then((clearedRecords) => clearedRecords[0]);
    return table;
  });
}

//return the `Tables` table updated row
function clearFinishedTable(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    const table = await knex(tableName)
      .where({ table_id })
      .update("reservation_id", null)
      .returning("*")
      .transacting(trx)
      .then((clearedRecords) => clearedRecords[0]);

    await knex("reservations")
      .where({ reservation_id })
      .update("status", "finished")
      .returning("*")
      .transacting(trx)
      .then((clearedRecords) => clearedRecords[0]);
    return table;
  });
}
module.exports = {
  list,
  readTable,
  readReservation,
  create,
  updateTables,
  clearFinishedTable,
};