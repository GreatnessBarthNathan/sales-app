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
exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
// CREATE NEW PRODUCT
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, branch, qty, CP, SP, store } = req.body;
    if (!name || !branch || !qty || !CP || !SP || !store)
        throw new customErrors_1.BadRequestError("Please provide all values");
    req.body.userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Unauthorized to perform this task");
    const existingProduct = yield productModel_1.default.findOne({ name });
    if (existingProduct)
        throw new customErrors_1.BadRequestError("Product already exists");
    yield productModel_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "Product created" });
});
exports.createProduct = createProduct;
// GET ALL PRODUCTS
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({}).sort({ name: 1 });
    const worth = products.reduce((total, value) => {
        total.totalCost += value.qty * value.CP;
        total.totalWorth += value.qty * value.SP;
        return total;
    }, { totalCost: 0, totalWorth: 0 });
    res.status(http_status_codes_1.StatusCodes.OK).json({ worth, products });
});
exports.getProducts = getProducts;
// GET SINGLE PRODUCT
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findOne({ _id: req.params.id });
    if (!product)
        throw new customErrors_1.NotFoundError("Product not found");
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
});
exports.getSingleProduct = getSingleProduct;
// UPDATE PRODUCT
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { name, branch, CP, SP, qty } = req.body;
    if (!name || !branch || !CP || !SP || !qty)
        throw new customErrors_1.BadRequestError("Please provide all values");
    if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Unauthorized to perform this task");
    const product = yield productModel_1.default.findById(req.params.id);
    if (!product)
        throw new customErrors_1.NotFoundError("Product not found");
    yield productModel_1.default.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), {
        new: true,
        runValidators: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "product updated" });
});
exports.updateProduct = updateProduct;
// DELETE PRODUCT
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Unauthorized to perform this task");
    yield productModel_1.default.findByIdAndDelete(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Product deleted" });
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productControllers.js.map