"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = void 0;
const ora_1 = __importDefault(require("ora"));
let currentSpinner = null;
exports.spinner = {
    start: (message) => {
        if (currentSpinner) {
            currentSpinner.stop();
        }
        currentSpinner = (0, ora_1.default)(message).start();
        return currentSpinner;
    },
    succeed: (message) => {
        if (currentSpinner) {
            currentSpinner.succeed(message);
            currentSpinner = null;
        }
    },
    fail: (message) => {
        if (currentSpinner) {
            currentSpinner.fail(message);
            currentSpinner = null;
        }
    },
    warn: (message) => {
        if (currentSpinner) {
            currentSpinner.warn(message);
            currentSpinner = null;
        }
    },
    info: (message) => {
        if (currentSpinner) {
            currentSpinner.info(message);
            currentSpinner = null;
        }
    },
    stop: () => {
        if (currentSpinner) {
            currentSpinner.stop();
            currentSpinner = null;
        }
    },
    text: (message) => {
        if (currentSpinner) {
            currentSpinner.text = message;
        }
    },
};
exports.default = exports.spinner;
//# sourceMappingURL=spinner.js.map