import { UI as UI$1 } from '@startupway/main/lib/ui';
import { WorkspaceUI } from '@startupway/workspace/lib/ui';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { v4 } from 'uuid';
import moment from 'moment';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

var BModelCanvasUi = /** @class */ (function () {
    function BModelCanvasUi() {
    }
    return BModelCanvasUi;
}());
var UI = new BModelCanvasUi();
function getBModelCanvasUi() {
    return UI;
}

var script = Vue.extend({
    name: "BusinnessCanvasUser",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        this.loadingPage = true;
                        return [4 /*yield*/, this.ui.storeDispatch("teams/loadProduct", this.teamId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.ui.api.get("/api/v1/canvas/" + this.teamId)];
                    case 2:
                        response = _a.sent();
                        if (response.data) {
                            this.canvases = response.data;
                        }
                        this.loadingPage = false;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    watch: {
        currentTeam: {
            immediate: true,
            handler: function (newTeam) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.loadingPage = true;
                                if (!newTeam) return [3 /*break*/, 5];
                                this.teamId = newTeam.teamId;
                                if (!(this.teamId === "")) return [3 /*break*/, 1];
                                if (this.$route.path !== "/workspace")
                                    this.$router.push("/workspace");
                                return [3 /*break*/, 5];
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, this.ui.storeDispatch("teams/loadProduct", this.teamId)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, this.ui.api.get("/api/v1/canvas/" + this.teamId)];
                            case 3:
                                response = _a.sent();
                                if (response.data) {
                                    this.canvases = response.data;
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _a.sent();
                                console.error(e_2);
                                return [3 /*break*/, 5];
                            case 5:
                                this.loadingPage = false;
                                return [2 /*return*/];
                        }
                    });
                });
            }
        },
        product: {
            immediate: true,
            handler: function (newProduct) {
                if (newProduct)
                    this.productId = newProduct.productId;
            }
        },
        canvases: {
            immediate: true,
            handler: function (newCanvases) {
                var _a;
                this.loadingPage = true;
                if (newCanvases.length !== 0) {
                    this.canvas = newCanvases[newCanvases.length - 1];
                    this.problem = this.canvas.fields["Problem"];
                    this.solution = this.canvas.fields["Solution"];
                    this.proposition = this.canvas.fields["Unique Value Proposition"];
                    this.advantage = this.canvas.fields["Unfair Advantage"];
                    this.segment = this.canvas.fields["Customer Segments"];
                    this.alternatives = this.canvas.fields["Existing Alternatives"];
                    this.metrics = this.canvas.fields["Key Metrics"];
                    this.concept = this.canvas.fields["High-Level Concept"];
                    this.channels = this.canvas.fields["Channels"];
                    this.adaptors = this.canvas.fields["Early Adaptors"];
                    this.cost = this.canvas.fields["Cost Structure"];
                    this.revenue = this.canvas.fields["Revenue Streams"];
                }
                else {
                    this.canvas = {
                        modelId: v4(),
                        productId: this.productId,
                        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        fields: (_a = {},
                            _a["Problem"] = "",
                            _a["Solution"] = "",
                            _a["Unique Value Proposition"] = "",
                            _a["Unfair Advantage"] = "",
                            _a["Customer Segments"] = "",
                            _a["Existing Alternatives"] = "",
                            _a["Key Metrics"] = "",
                            _a["High-Level Concept"] = "",
                            _a["Channels"] = "",
                            _a["Early Adaptors"] = "",
                            _a["Cost Structure"] = "",
                            _a["Revenue Streams"] = "",
                            _a)
                    };
                }
                this.loadingPage = false;
            }
        }
    },
    computed: __assign({}, mapGetters({
        currentTeam: "teams/currentTeam",
        product: "teams/product"
    })),
    data: function () {
        return {
            ui: UI$1.getInstance(),
            checkLength: false,
            types: [],
            lengthRules: [function (v) { return (v || '').length <= 250 || 'Description must be 250 characters or less'; }],
            loadingPage: false,
            edit: false,
            teamId: "",
            productId: "",
            canvas: {},
            canvases: [],
            problem: "",
            segment: "",
            alternatives: "",
            adaptors: "",
            proposition: "",
            concept: "",
            solution: "",
            advantage: "",
            cost: "",
            channels: "",
            metrics: "",
            revenue: ""
        };
    },
    methods: {
        countdown: function (type, model) {
            if (model.length > 250) {
                this.checkLength = true;
                if (!this.types.find(function (el) { return el === type; })) {
                    this.types.push(type);
                }
            }
            else {
                if (this.types.find(function (el) { return el === type; })) {
                    this.types = this.types.filter(function (el) { return el !== type; });
                }
                if (this.types.length === 0)
                    this.checkLength = false;
            }
        },
        formatDate: function (date) {
            var time = (new Date(date)).toTimeString().split(" ");
            return (new Date(date)).toDateString() + " " + time[0];
        },
        isToday: function (someDate) {
            var today = new Date();
            if (typeof someDate === "string") {
                someDate = new Date(someDate);
            }
            return someDate.getDate() == today.getDate() &&
                someDate.getMonth() == today.getMonth() &&
                someDate.getFullYear() == today.getFullYear();
        },
        updateCanvas: function () {
            return __awaiter(this, void 0, void 0, function () {
                var fields, canvas, response, res, e_3, product, e_4, e_5;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.loadingPage = true;
                            fields = (_a = {},
                                _a["Problem"] = this.problem,
                                _a["Solution"] = this.solution,
                                _a["Unique Value Proposition"] = this.proposition,
                                _a["Unfair Advantage"] = this.advantage,
                                _a["Customer Segments"] = this.segment,
                                _a["Existing Alternatives"] = this.alternatives,
                                _a["Key Metrics"] = this.metrics,
                                _a["High-Level Concept"] = this.concept,
                                _a["Channels"] = this.channels,
                                _a["Early Adaptors"] = this.adaptors,
                                _a["Cost Structure"] = this.cost,
                                _a["Revenue Streams"] = this.revenue,
                                _a);
                            canvas = {
                                modelId: v4(),
                                date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                                productId: this.productId,
                                fields: fields
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/canvas/" + this.teamId, canvas)];
                        case 2:
                            response = _b.sent();
                            if (!response.data) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/canvas/" + this.teamId)];
                        case 3:
                            res = _b.sent();
                            if (res.data) {
                                this.canvases = res.data;
                            }
                            this.problem = "";
                            this.segment = "";
                            this.alternatives = "";
                            this.adaptors = "";
                            this.proposition = "";
                            this.concept = "";
                            this.solution = "";
                            this.advantage = "";
                            this.cost = "";
                            this.channels = "";
                            this.metrics = "";
                            this.revenue = "";
                            _b.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            e_3 = _b.sent();
                            console.error(e_3);
                            return [3 /*break*/, 6];
                        case 6:
                            _b.trys.push([6, 12, , 13]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + this.teamId)];
                        case 7:
                            product = _b.sent();
                            if (!product.data) return [3 /*break*/, 11];
                            product.data.updatedAt = this.formatDate(new Date());
                            _b.label = 8;
                        case 8:
                            _b.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/teams/product/update", {
                                    product: product.data,
                                    upload: "",
                                    ext: ".pptx",
                                    teamId: this.teamId
                                })];
                        case 9:
                            _b.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            e_4 = _b.sent();
                            console.error(e_4);
                            return [3 /*break*/, 11];
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            e_5 = _b.sent();
                            console.error(e_5);
                            return [3 /*break*/, 13];
                        case 13:
                            this.loadingPage = false;
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
});

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-app",
    [
      !_vm.loadingPage
        ? _c(
            "v-container",
            [
              _c(
                "v-container",
                [
                  _c(
                    "v-card",
                    {
                      staticClass: "justify-center",
                      attrs: { flat: "", outlined: "" }
                    },
                    [
                      _c(
                        "v-card-text",
                        { staticClass: "justify-center" },
                        [
                          _c(
                            "v-row",
                            { attrs: { align: "center", justify: "center" } },
                            [
                              _c("strong", { attrs: { color: "accent" } }, [
                                _vm._v(
                                  "Note: You can update the business canvas once a day"
                                )
                              ])
                            ]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-card",
                {
                  staticStyle: { margin: "auto", "margin-top": "50px" },
                  attrs: { flat: "", "max-width": "1000" }
                },
                [
                  _c("v-divider"),
                  _vm._v(" "),
                  _c(
                    "v-card-text",
                    [
                      _c(
                        "v-row",
                        { attrs: { "no-gutters": "" } },
                        [
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("PROBLEM")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  placeholder: _vm.canvas.fields["Problem"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250",
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-lightbulb-on-outline"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown("Problem", _vm.problem)
                                  }
                                },
                                model: {
                                  value: _vm.problem,
                                  callback: function($$v) {
                                    _vm.problem = $$v;
                                  },
                                  expression: "problem"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("CUSTOMER SEGMENTS")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-account-switch",
                                  placeholder:
                                    _vm.canvas.fields["Customer Segments"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Customer Segments",
                                      _vm.segment
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.segment,
                                  callback: function($$v) {
                                    _vm.segment = $$v;
                                  },
                                  expression: "segment"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("EXISTING ALTERNATIVES")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-compare",
                                  placeholder:
                                    _vm.canvas.fields["Existing Alternatives"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Existing Alternatives",
                                      _vm.alternatives
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.alternatives,
                                  callback: function($$v) {
                                    _vm.alternatives = $$v;
                                  },
                                  expression: "alternatives"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("EARLY ADAPTORS")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-account-child-outline",
                                  placeholder:
                                    _vm.canvas.fields["Early Adaptors"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Early Adaptors",
                                      _vm.adaptors
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.adaptors,
                                  callback: function($$v) {
                                    _vm.adaptors = $$v;
                                  },
                                  expression: "adaptors"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("UNIQUE VALUE PROPOSITION")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-briefcase",
                                  placeholder:
                                    _vm.canvas.fields[
                                      "Unique Value Proposition"
                                    ],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Unique Value Proposition",
                                      _vm.proposition
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.proposition,
                                  callback: function($$v) {
                                    _vm.proposition = $$v;
                                  },
                                  expression: "proposition"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("HIGH-LEVEL CONCEPT")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-presentation-play",
                                  placeholder:
                                    _vm.canvas.fields["High-Level Concept"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "High-Level Concept",
                                      _vm.concept
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.concept,
                                  callback: function($$v) {
                                    _vm.concept = $$v;
                                  },
                                  expression: "concept"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("SOLUTION")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-flag",
                                  placeholder: _vm.canvas.fields["Solution"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Solution",
                                      _vm.solution
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.solution,
                                  callback: function($$v) {
                                    _vm.solution = $$v;
                                  },
                                  expression: "solution"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("UNFAIR ADVANTAGE")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-bell-plus-outline",
                                  placeholder:
                                    _vm.canvas.fields["Unfair Advantage"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Unfair Advantage",
                                      _vm.advantage
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.advantage,
                                  callback: function($$v) {
                                    _vm.advantage = $$v;
                                  },
                                  expression: "advantage"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("COST STRUCTURE")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-sack-percent",
                                  rows: "4",
                                  placeholder:
                                    _vm.canvas.fields["Cost Structure"],
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Cost Structure",
                                      _vm.cost
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.cost,
                                  callback: function($$v) {
                                    _vm.cost = $$v;
                                  },
                                  expression: "cost"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("CHANNELS")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-google-circles-extended",
                                  placeholder: _vm.canvas.fields["Channels"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Channels",
                                      _vm.channels
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.channels,
                                  callback: function($$v) {
                                    _vm.channels = $$v;
                                  },
                                  expression: "channels"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("KEY METRICS")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-key-link",
                                  placeholder: _vm.canvas.fields["Key Metrics"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Key Metrics",
                                      _vm.metrics
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.metrics,
                                  callback: function($$v) {
                                    _vm.metrics = $$v;
                                  },
                                  expression: "metrics"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            {
                              attrs: {
                                cols: "12",
                                sm: "10",
                                md: "8",
                                lg: "4",
                                xl: "4"
                              }
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticStyle: {
                                    "text-align": "center",
                                    "font-weight": "bold",
                                    "margin-top": "15px"
                                  }
                                },
                                [_vm._v("REVENUE STREAMS")]
                              ),
                              _vm._v(" "),
                              _c("v-textarea", {
                                attrs: {
                                  required: "",
                                  rules: _vm.lengthRules,
                                  outlined: "",
                                  rounded: "",
                                  color: "primary",
                                  "prepend-icon": "mdi-account-cash-outline",
                                  placeholder:
                                    _vm.canvas.fields["Revenue Streams"],
                                  rows: "4",
                                  "no-resize": "",
                                  counter: "250"
                                },
                                on: {
                                  keyup: function($event) {
                                    return _vm.countdown(
                                      "Revenue Streams",
                                      _vm.revenue
                                    )
                                  }
                                },
                                model: {
                                  value: _vm.revenue,
                                  callback: function($$v) {
                                    _vm.revenue = $$v;
                                  },
                                  expression: "revenue"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm.checkLength
                        ? _c("div", { staticClass: "error-message" }, [
                            _vm._v(
                              "\n\t\t\t\t\t\tPlease review the following fields: " +
                                _vm._s(_vm.types.join(", ")) +
                                ". The character limit is set to 250.\n\t\t\t\t\t"
                            )
                          ])
                        : _vm._e()
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-card-actions",
                    { staticClass: "justify-center" },
                    [
                      _c(
                        "v-btn",
                        {
                          attrs: {
                            disabled: _vm.checkLength,
                            color: "primary",
                            rounded: "",
                            type: "submit"
                          },
                          on: {
                            click: function($event) {
                              return _vm.updateCanvas()
                            }
                          }
                        },
                        [_vm._v("Submit Canvas")]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        : _c(
            "v-container",
            [
              _c(
                "v-row",
                { attrs: { justify: "center" } },
                [
                  _c(
                    "v-col",
                    { attrs: { md: "auto" } },
                    [
                      _c("v-progress-circular", {
                        attrs: {
                          size: 500,
                          color: "primary",
                          indeterminate: ""
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

var script$1 = Vue.extend({
    name: "BusinessCanvasViewer",
    watch: {
        $route: {
            immediate: true,
            handler: function (newRoute) {
                return __awaiter(this, void 0, void 0, function () {
                    var found, response, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.loadingPage = true;
                                this.teamId = this.$route.params.teamId;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 7, , 8]);
                                return [4 /*yield*/, this.getUsers(this.teamId)];
                            case 2:
                                if (!_a.sent()) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.getAllUsers()];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4: return [4 /*yield*/, this.ui.api.get("/api/v1/teams/team/" + this.teamId)];
                            case 5:
                                found = _a.sent();
                                if (found.data) {
                                    this.team = found.data.teamName;
                                }
                                return [4 /*yield*/, this.ui.api.get("/api/v1/canvas/" + this.teamId)];
                            case 6:
                                response = _a.sent();
                                if (response.data) {
                                    this.canvases = response.data;
                                    if (this.canvases.length === 0) {
                                        this.canvases = null;
                                    }
                                }
                                return [3 /*break*/, 8];
                            case 7:
                                e_1 = _a.sent();
                                console.error(e_1);
                                return [3 /*break*/, 8];
                            case 8:
                                this.loadingPage = false;
                                return [2 /*return*/];
                        }
                    });
                });
            }
        },
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_2, response, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.loadingPage = true;
                                if (!newUser) return [3 /*break*/, 9];
                                if (!(newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                this.location = newUser.userDetails["location"];
                                return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/")];
                            case 2:
                                response = _a.sent();
                                if (response.data) {
                                    this.teams = response.data;
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                console.error(e_2);
                                return [3 /*break*/, 4];
                            case 4: return [3 /*break*/, 9];
                            case 5:
                                if (!(newUser.role === "Mentor")) return [3 /*break*/, 9];
                                _a.label = 6;
                            case 6:
                                _a.trys.push([6, 8, , 9]);
                                this.location = newUser.userDetails["location"];
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teams/" + newUser.userId)];
                            case 7:
                                response = _a.sent();
                                if (response.data) {
                                    this.teams = response.data;
                                }
                                return [3 /*break*/, 9];
                            case 8:
                                e_3 = _a.sent();
                                console.error(e_3);
                                return [3 /*break*/, 9];
                            case 9:
                                this.loadingPage = false;
                                return [2 /*return*/];
                        }
                    });
                });
            }
        },
    },
    computed: __assign({}, mapGetters({
        user: "users/user",
    })),
    data: function () {
        return {
            ui: UI$1.getInstance(),
            loadingPage: false,
            teams: [],
            location: "",
            users: [],
            allUsers: [],
            teamId: "",
            team: "",
            canvases: [],
        };
    },
    methods: {
        moment: function () {
            return moment();
        },
        formatDate: function (date) {
            var time = (new Date(date)).toTimeString().split(" ");
            return (new Date(date)).toDateString() + " " + time[0];
        },
        hasUser: function (user) {
            var e_4, _a;
            try {
                for (var _b = __values(this.users), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var aux = _c.value;
                    if (aux.userId === user.userId) {
                        return true;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return false;
        },
        getUsers: function (teamId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/team/users/" + teamId)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                this.users = this.modifyUsers(response.data);
                                return [2 /*return*/, true];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_5 = _a.sent();
                            console.error(e_5);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/, false];
                    }
                });
            });
        },
        getAllUsers: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_6;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/users/users")];
                        case 1:
                            response = _a.sent();
                            if (response.data) {
                                this.allUsers = this.modifyUsers(response.data);
                                this.allUsers = this.allUsers.filter(function (user) { return !_this.hasUser(user); });
                                return [2 /*return*/, true];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_6 = _a.sent();
                            console.error(e_6);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/, false];
                    }
                });
            });
        },
        modifyUsers: function (users) {
            var e_7, _a;
            try {
                for (var users_1 = __values(users), users_1_1 = users_1.next(); !users_1_1.done; users_1_1 = users_1.next()) {
                    var user = users_1_1.value;
                    // Inject prop
                    if (user.userDetails["faculty"] !== undefined) {
                        user.faculty = user.userDetails["faculty"];
                    }
                    else {
                        user.faculty = "";
                    }
                    // Inject prop
                    if (user.userDetails["group"] !== undefined) {
                        user.group = user.userDetails["group"];
                    }
                    else {
                        user.group = "";
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (users_1_1 && !users_1_1.done && (_a = users_1.return)) _a.call(users_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            return users;
        },
    }
});

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-app",
    { attrs: { id: "app" } },
    [
      !_vm.loadingPage
        ? _c(
            "v-container",
            { staticClass: "content", attrs: { width: "1000" } },
            [
              _c("v-divider", { staticStyle: { "margin-bottom": "30px" } }),
              _vm._v(" "),
              _vm.canvases
                ? _c(
                    "v-expansion-panels",
                    { attrs: { popout: "" } },
                    _vm._l(_vm.canvases, function(canvas, index) {
                      return _c(
                        "v-expansion-panel",
                        { key: index },
                        [
                          _c("v-expansion-panel-header", [
                            _vm._v(
                              " Canvas Update: " +
                                _vm._s(_vm.formatDate(canvas.date)) +
                                " "
                            )
                          ]),
                          _vm._v(" "),
                          canvas.fields
                            ? _c(
                                "v-expansion-panel-content",
                                [
                                  _c(
                                    "v-row",
                                    _vm._l(canvas.fields, function(
                                      propValue,
                                      propName
                                    ) {
                                      return _c(
                                        "v-col",
                                        {
                                          key: propName,
                                          attrs: { cols: "6", md: "4" }
                                        },
                                        [
                                          _c(
                                            "v-card",
                                            {
                                              staticClass: "pa-2",
                                              attrs: {
                                                outlined: "",
                                                tile: "",
                                                rounded: ""
                                              }
                                            },
                                            [
                                              _c(
                                                "v-card-title",
                                                {
                                                  staticClass: "justify-center",
                                                  staticStyle: {
                                                    "font-family":
                                                      "Georgia, serif",
                                                    "font-size": "16px",
                                                    "font-weight": "600"
                                                  }
                                                },
                                                [
                                                  _vm._v(
                                                    "\n\t\t\t\t\t\t\t\t\t\t" +
                                                      _vm._s(propName) +
                                                      "\n\t\t\t\t\t\t\t\t\t"
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c("v-divider"),
                                              _vm._v(" "),
                                              _c("v-card-text", [
                                                _vm._v(
                                                  "\n\t\t\t\t\t\t\t\t\t\t" +
                                                    _vm._s(propValue) +
                                                    "\n\t\t\t\t\t\t\t\t\t"
                                                )
                                              ])
                                            ],
                                            1
                                          )
                                        ],
                                        1
                                      )
                                    }),
                                    1
                                  )
                                ],
                                1
                              )
                            : _vm._e()
                        ],
                        1
                      )
                    }),
                    1
                  )
                : _c(
                    "span",
                    [
                      _c(
                        "v-row",
                        { attrs: { justify: "center", "no-gutters": "" } },
                        [
                          _c("v-col", { attrs: { md: "auto" } }, [
                            _c("h1", { staticClass: "landing-message" }, [
                              _vm._v(
                                "\n\t\t\t\t\t\t\tNo canvas to show for this team.\n\t\t\t\t\t\t"
                              )
                            ])
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  )
            ],
            1
          )
        : _c(
            "v-container",
            [
              _c(
                "v-row",
                { attrs: { justify: "center" } },
                [
                  _c(
                    "v-col",
                    { attrs: { md: "auto" } },
                    [
                      _c("v-progress-circular", {
                        attrs: {
                          size: 500,
                          color: "primary",
                          indeterminate: ""
                        }
                      })
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    undefined,
    undefined,
    undefined
  );

var e_1, _a, e_2, _b;
var workspaceUi = WorkspaceUI.getInstance();
var ui = UI$1.getInstance();
var workspaceRoutes = [
    {
        path: '/product/canvas',
        name: "Business Canvas",
        component: __vue_component__
    }
];
var viewTeamRoutes = [
    {
        path: '/viewTeam/canvas/:teamId',
        name: "Business Canvas Viewer",
        component: __vue_component__$1
    },
];
try {
    for (var workspaceRoutes_1 = __values(workspaceRoutes), workspaceRoutes_1_1 = workspaceRoutes_1.next(); !workspaceRoutes_1_1.done; workspaceRoutes_1_1 = workspaceRoutes_1.next()) {
        var route = workspaceRoutes_1_1.value;
        workspaceUi.registerWorkspaceRoutes(route);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (workspaceRoutes_1_1 && !workspaceRoutes_1_1.done && (_a = workspaceRoutes_1.return)) _a.call(workspaceRoutes_1);
    }
    finally { if (e_1) throw e_1.error; }
}
try {
    for (var viewTeamRoutes_1 = __values(viewTeamRoutes), viewTeamRoutes_1_1 = viewTeamRoutes_1.next(); !viewTeamRoutes_1_1.done; viewTeamRoutes_1_1 = viewTeamRoutes_1.next()) {
        var route = viewTeamRoutes_1_1.value;
        ui.registerRoute(route, "Mentored Team");
    }
}
catch (e_2_1) { e_2 = { error: e_2_1 }; }
finally {
    try {
        if (viewTeamRoutes_1_1 && !viewTeamRoutes_1_1.done && (_b = viewTeamRoutes_1.return)) _b.call(viewTeamRoutes_1);
    }
    finally { if (e_2) throw e_2.error; }
}

export { BModelCanvasUi, getBModelCanvasUi };
