const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary"); 


async function list(req, res) {
    const data = await service.list()
    res.json({data}); 
}

async function create(req, res, next) {
    const {table_name, capacity} = req.body.data

    const result = await service.create({
        table_name,
        capacity,
    })
    res.status(201)
    res.json({data: result})
}

function hasData(req, res, next) {
    if (!req.body.data) {
        next({
            status: 400,
            message: "Table does not have data."
        })
    } else next();
}


const hasTableName = (req, res, next) => {
    const {data: {table_name} = {}} = req.body

    if (table_name && table_name.length > 1) {
        return next();
    }
    return next({
        status: 400,
        message: "table_name is required"
    })
}


const hasCapacity = (req, res, next) => {
    const {data: {capacity} = {}} = req.body

    if (capacity && typeof capacity === "number") {
        return next();
    }
    return next({
        status: 400,
        message: "capacity is required"
    })
}


async function update(req, res) {
    const updatedTable = {
        ...res.locals.table,
        reservation_id: res.locals.reservation.reservation_id,
    }

    const data = await service.update(updatedTable)
    res.json({data})
}


async function tableExists(req, res, next) {
    const table = await service.read(req.params.table_id)

    if (table) {
        res.locals.table = table
        return next();
    }
    next({
        status: 404, 
        message: `Table ${table_id} cannot be found`
    })
}


async function reservationExists(req, res, next) {
    const {data: {reservation_id} = {}} = req.body

    if (reservation_id) {
        const reservation = await service.readReservation(reservation_id)

        if (reservation) {
            res.locals.reservation = reservation
            return next();
        }
        return next({
            status: 404,
            message: `999`
        })
    } else {
        return next({
            status: 400,
            message: `reservation_id does not exist`
        })
    }
}


const hasAvailibility = (req, res, next) => {
    if (res.locals.table.reservation_id !== null) {
        return next({
            status: 400,
            message: "occupied"
        })
    }

    if (res.locals.table.capacity >= res.locals.reservation.people) {
        return next();
    }
    return next({
        status: 400,
        message: "need capacity"
    })
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasData, 
        hasTableName, 
        hasCapacity, 
        asyncErrorBoundary(create),
    ],
    update: [
        asyncErrorBoundary(tableExists),
        hasData,
        reservationExists,
        hasAvailibility,
        asyncErrorBoundary(update),
    ],
}