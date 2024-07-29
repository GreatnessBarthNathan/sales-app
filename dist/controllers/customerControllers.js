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
exports.deleteCustomer = exports.updateCustomer = exports.getSingleCustomer = exports.getAllCustomers = exports.createCustomer = void 0;
const customErrors_1 = require("../errors/customErrors");
const http_status_codes_1 = require("http-status-codes");
const customerModel_1 = __importDefault(require("../models/customerModel"));
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phoneNumber } = req.body;
    if (!firstName || !lastName || !phoneNumber)
        throw new customErrors_1.BadRequestError("Please enter all fields");
    const alreadyExists = yield customerModel_1.default.findOne({ phoneNumber });
    if (alreadyExists)
        throw new customErrors_1.BadRequestError("This customer already exists");
    yield customerModel_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "customer account created" });
});
exports.createCustomer = createCustomer;
const getAllCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customers = yield customerModel_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: customers.length, customers });
});
exports.getAllCustomers = getAllCustomers;
const getSingleCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customerModel_1.default.findOne({ _id: req.params.id });
    if (!customer)
        throw new customErrors_1.NotFoundError(`No customer found with the id: ${req.params.id}`);
    res.status(http_status_codes_1.StatusCodes.OK).json({ customer });
});
exports.getSingleCustomer = getSingleCustomer;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phoneNumber } = req.body;
    if (!firstName || !lastName || !phoneNumber)
        throw new customErrors_1.BadRequestError("Please provide all values");
    const customer = yield customerModel_1.default.findOne({ _id: req.params.id });
    if (!customer)
        throw new customErrors_1.NotFoundError(`No customer found with the id: ${req.params.id}`);
    yield customerModel_1.default.findOneAndUpdate({ _id: req.params.id }, Object.assign({}, req.body), { runValidators: true, new: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "customer record updated" });
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield customerModel_1.default.findOne({ _id: req.params.id });
    if (!customer)
        throw new customErrors_1.NotFoundError(`No customer found with the id: ${req.params.id}`);
    yield customerModel_1.default.findOneAndDelete({ _id: req.params.id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "customer deleted" });
});
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=customerControllers.js.map