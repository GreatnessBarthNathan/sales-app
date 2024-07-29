"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfit = exports.updateOrder = exports.returnItem = exports.deleteOrder = exports.singleOrder = exports.getAllOrders = exports.createOrder = void 0;
const customErrors_1 = require("../errors/customErrors");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const expensesModel_1 = __importDefault(require("../models/expensesModel"));
const http_status_codes_1 = require("http-status-codes");
const dayjs_1 = __importDefault(require("dayjs"));
const cashModel_1 = __importDefault(require("../models/cashModel"));
const bankModel_1 = __importDefault(require("../models/bankModel"));
// CREATE ORDER
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { total, items, balance, cash, bank, customer } = req.body;
    if (!total || !items)
        throw new customErrors_1.NotFoundError("Missing fields");
    req.body.enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const orderItems = items;
    // check for correct product
    for (let orderItem of orderItems) {
        let existingItem = yield productModel_1.default.findOne({ _id: orderItem.productId });
        if (!existingItem)
            throw new customErrors_1.NotFoundError(`No product with id: ${orderItem.productId}`);
        // update inventory
        existingItem.qty -= orderItem.pcs;
        yield productModel_1.default.findOneAndUpdate({ _id: orderItem.productId }, { qty: existingItem.qty }, { new: true, runValidators: true });
    }
    yield orderModel_1.default.create({
        total,
        orderItems,
        balance,
        cash,
        bank,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        customer,
        enteredAt: req.body.enteredAt,
    });
    if (cash > 0) {
        yield cashModel_1.default.create({
            amount: cash,
            enteredBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userName,
            enteredAt: req.body.enteredAt,
        });
    }
    if (bank > 0) {
        yield bankModel_1.default.create({
            amount: bank,
            enteredBy: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userName,
            enteredAt: req.body.enteredAt,
        });
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "Order Created" });
});
exports.createOrder = createOrder;
// GET ALL ORDERS
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({}).sort({ enteredAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: orders.length, orders });
});
exports.getAllOrders = getAllOrders;
// GET SINGLE ORDER
const singleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findOne({ _id: req.params.id });
    if (!order)
        throw new customErrors_1.NotFoundError("This order does not exist");
    const user = yield userModel_1.default.findOne({ _id: order.userId });
    if (!user)
        throw new customErrors_1.NotFoundError("No user found");
    res.status(http_status_codes_1.StatusCodes.OK).json({ soldBy: user.firstName, order });
});
exports.singleOrder = singleOrder;
// DELETE ORDER .... THIS WILL NOT BE CARRIED OUT THOUGH
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not Permitted");
    const order = yield orderModel_1.default.findOne({ _id: req.params.id });
    if (!order)
        throw new customErrors_1.NotFoundError(`No order found with id: ${req.params.id}`);
    for (let item of order.orderItems) {
        const product = yield productModel_1.default.findOne({ _id: item.productId });
        if (!product)
            throw new customErrors_1.NotFoundError("Product does not exist");
        product.qty += item.pcs;
        yield productModel_1.default.findOneAndUpdate({ _id: item.productId }, { qty: product.qty }, { new: true, runValidators: true });
    }
    yield orderModel_1.default.findOneAndDelete({ _id: req.params.id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Order deleted" });
});
exports.deleteOrder = deleteOrder;
// RETURN ITEM
const returnItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    if (((_e = req.user) === null || _e === void 0 ? void 0 : _e.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted");
    const { orderId, itemId } = req.query;
    if (!orderId || !itemId)
        throw new customErrors_1.UnauthenticatedError("Invalid credentials");
    const order = yield orderModel_1.default.findOne({ _id: orderId });
    if (!order)
        throw new customErrors_1.NotFoundError("Order does not exist");
    order.orderItems.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        const targetItem = order.orderItems.find((item) => String(item._id) === itemId);
        if (!targetItem)
            throw new customErrors_1.NotFoundError("Item does not exist");
        if (targetItem.returned)
            throw new customErrors_1.UnauthenticatedError("Item already returned");
        if (item === targetItem) {
            const product = yield productModel_1.default.findOne({ _id: targetItem.productId });
            if (!product)
                throw new customErrors_1.NotFoundError("Product not found");
            product.qty += targetItem.pcs;
            yield productModel_1.default.findOneAndUpdate({ _id: product._id }, { qty: product.qty }, { new: true, runValidators: true });
        }
    }));
    const newOrderItems = order.orderItems.map((item) => {
        if (String(item._id) === itemId) {
            item.returned = true;
        }
        return item;
    });
    yield orderModel_1.default.findOneAndUpdate({ _id: orderId }, { orderItems: newOrderItems }, { new: true, runValidators: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Item returned & Inventory updated" });
});
exports.returnItem = returnItem;
// UPDATE ORDER
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findById(req.params.id);
    if (!order)
        throw new customErrors_1.NotFoundError("order not found");
    yield orderModel_1.default.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), { runValidators: true, new: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "order updated" });
});
exports.updateOrder = updateOrder;
// CALCULATE PROFIT
const getProfit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    let grossProfit = 0;
    if (((_f = req.user) === null || _f === void 0 ? void 0 : _f.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    const orders = yield orderModel_1.default.find({});
    for (let order of orders) {
        for (let item of order.orderItems) {
            if (!item.returned) {
                grossProfit += item.diff;
            }
        }
    }
    const expenses = yield expensesModel_1.default.find({});
    const totalExpenses = expenses.reduce((total, value) => {
        total += value.amount;
        return total;
    }, 0);
    const analysis = {
        grossProfit,
        totalExpenses,
        netProfit: grossProfit - totalExpenses,
    };
    res.status(http_status_codes_1.StatusCodes.OK).json({ analysis });
});
exports.getProfit = getProfit;
//# sourceMappingURL=orderControllers.js.map