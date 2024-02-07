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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const { ES_ADDON_KIBANA_HOST, ES_API_KEY, SERVICE_VERSION } = process.env;
const directory = './build/static/js';
function postSourceMap(sourceMapPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (sourceMapPath) {
            const bundlePath = sourceMapPath.replace('.map', '');
            if (bundlePath) {
                console.log(`Uploading ${sourceMapPath}`);
                const sourcemapData = (0, fs_1.readFileSync)(`${directory}/${sourceMapPath}`, 'utf8');
                const formData = new FormData();
                formData.append('sourcemap', sourcemapData);
                formData.append('service_version', SERVICE_VERSION);
                formData.append('service_name', "patient-react");
                formData.append('bundle_filepath', bundlePath);
                yield axios_1.default.post(`${ES_ADDON_KIBANA_HOST}/api/apm/sourcemaps`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'kbn-xsrf': 'true',
                        'Authorization': `ApiKey ${ES_API_KEY}`
                    },
                })
                    .then(() => {
                    console.log(`${sourceMapPath} uploaded successfully`);
                })
                    .catch((requestError) => {
                    console.log(requestError);
                });
            }
        }
    });
}
function loadFiles() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Uploading sourcemaps started.');
        const files = yield fs_1.promises.opendir(directory);
        try {
            for (var _d = true, files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), _a = files_1_1.done, !_a; _d = true) {
                _c = files_1_1.value;
                _d = false;
                const file = _c;
                const { name } = file;
                if (file.name.includes('.map')) {
                    yield postSourceMap(name);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = files_1.return)) yield _b.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log('Uploading sourcemaps complete.');
    });
}
loadFiles();
//# sourceMappingURL=app.js.map