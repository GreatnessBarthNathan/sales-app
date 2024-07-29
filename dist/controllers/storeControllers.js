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
exports.calcStoreWorth = exports.updateStore = exports.createStoreProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const customErrors_1 = require("../errors/customErrors");
const http_status_codes_1 = require("http-status-codes");
// CREATE STORE PRODUCT
const createStoreProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, store } = req.body;
    if (!name || !store)
        throw new customErrors_1.BadRequestError("Please provide all values");
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    const product = yield productModel_1.default.findOne({ name });
    if (!product)
        throw new customErrors_1.NotFoundError("product does not exist");
    if (product.store > 0)
        throw new customErrors_1.BadRequestError("This product is already in store");
    yield productModel_1.default.findOneAndUpdate({ name }, { store }, { new: true, runValidators: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Product added to store" });
});
exports.createStoreProduct = createStoreProduct;
// UPDATE STORE PRODUCT
const updateStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, branch, CP, SP, store, release } = req.body;
    if (!name || !branch || !CP || !SP || !store)
        throw new customErrors_1.BadRequestError("Please provide all values");
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    const product = yield productModel_1.default.findOne({ name });
    if (!product)
        throw new customErrors_1.NotFoundError("Product not found");
    product.qty = Number(release) + Number(product.qty);
    yield productModel_1.default.findOneAndUpdate({ name }, Object.assign(Object.assign({}, req.body), { qty: product.qty }), {
        new: true,
        runValidators: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "store product updated" });
});
exports.updateStore = updateStore;
// CALCULATE WORTH OF GOODS IN STORE
const calcStoreWorth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.user?.role !== "admin")
    //   throw new UnAuthorizedError("Not permitted to perform this task")
    const products = yield productModel_1.default.find({ store: { $gte: 1 } }).sort({ name: 1 });
    const storeWorth = yield products.reduce((total, value) => {
        total.totalCost += value.CP * value.store;
        total.totalWorth += value.SP * value.store;
        return total;
    }, { totalCost: 0, totalWorth: 0 });
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, storeWorth });
});
exports.calcStoreWorth = calcStoreWorth;
//# sourceMappingURL=storeControllers.js.map