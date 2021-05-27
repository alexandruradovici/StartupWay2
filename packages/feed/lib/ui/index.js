import Vue from 'vue';
import { UI as UI$1 } from '@startupway/main/lib/ui';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { v4 } from 'uuid';
import { WorkspaceUI } from '@startupway/workspace/lib/ui';

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

var FeedUi = /** @class */ (function () {
    function FeedUi() {
    }
    return FeedUi;
}());
var UI = new FeedUi();
function getFeedUi() {
    return UI;
}

var FeedTypes;
(function (FeedTypes) {
    FeedTypes["INVESTMENT"] = "Investment";
    FeedTypes["AWARD"] = "Award";
    FeedTypes["UPDATE"] = "Update";
    FeedTypes["COLLABORATORS"] = "Collaborators";
})(FeedTypes || (FeedTypes = {}));

var script = Vue.extend({
    name: "ProductFeedUser",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loadingPage = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.ui.storeDispatch("feed/loadFeed", this.teamId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        this.loadingPage = false;
                        return [2 /*return*/];
                }
            });
        });
    },
    filters: {
        moment: function (date) {
            return moment(date).format("MMMM Do YYYY, h:mm:ss a");
        }
    },
    watch: {
        currentTeam: {
            immediate: true,
            handler: function (newTeam) {
                return __awaiter(this, void 0, void 0, function () {
                    var e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.loadingPage = true;
                                if (!newTeam) return [3 /*break*/, 4];
                                this.teamId = newTeam.teamId;
                                if (!(this.teamId === "" || this.teamId === undefined)) return [3 /*break*/, 1];
                                if (this.$route.path !== "/workspace")
                                    this.$router.push("/workspace");
                                this.productUpdates = [];
                                return [3 /*break*/, 4];
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.ui.storeDispatch("feed/loadFeed", this.teamId)];
                            case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                console.error(e_2);
                                return [3 /*break*/, 4];
                            case 4:
                                this.loadingPage = false;
                                return [2 /*return*/];
                        }
                    });
                });
            }
        },
        feed: {
            immediate: true,
            handler: function (newFeed) {
                this.productUpdates = newFeed;
            }
        }
    },
    computed: __assign({}, mapGetters({
        currentTeam: "teams/currentTeam",
        feed: "feed/feed"
    })),
    data: function () {
        return {
            ui: UI$1.getInstance(),
            productUpdates: [],
            items: [
                {
                    name: "Investments",
                    value: FeedTypes.INVESTMENT
                },
                {
                    name: "Awards",
                    value: FeedTypes.AWARD
                },
                {
                    name: "Current Status",
                    value: FeedTypes.UPDATE
                },
                {
                    name: "Collaborations",
                    value: FeedTypes.COLLABORATORS
                }
            ],
            teamId: "",
            value: "",
            text: "",
            amount: "",
            newFeedUpdate: "",
            FeedTypes: FeedTypes,
            editDialog: false,
            loadingPage: false,
            edited: null,
            removeDialog: false
        };
    },
    methods: {
        accept: function (feed) {
            this.deleteFeed(feed);
            this.removeDialog = false;
        },
        deny: function () {
            this.removeDialog = false;
        },
        deleteFeed: function (feed) {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.ui.storeDispatch("feed/deleteFeed", feed)];
                        case 1:
                            response = _a.sent();
                            if (!response) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.ui.storeDispatch("feed/loadFeed", feed.teamId)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            e_3 = _a.sent();
                            console.error(e_3);
                            return [3 /*break*/, 5];
                        case 5:
                            this.$forceUpdate();
                            return [2 /*return*/];
                    }
                });
            });
        },
        updateFeed: function (feed) {
            return __awaiter(this, void 0, void 0, function () {
                var details, response, e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            details = {};
                            if (this.amount !== "" && feed.feedType === FeedTypes.INVESTMENT) {
                                details["amount"] = this.amount;
                            }
                            details["text"] = this.text;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/feed/update", {
                                    newFeed: {
                                        feedId: feed.feedId,
                                        feedType: feed.feedType,
                                        teamId: feed.teamId,
                                        text: details,
                                        date: feed.date,
                                    }
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.data) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.storeDispatch("feed/loadFeed", feed.teamId)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            e_4 = _a.sent();
                            console.error(e_4);
                            return [3 /*break*/, 6];
                        case 6:
                            this.editDialog = false;
                            this.edited = null;
                            this.value = "";
                            this.text = "";
                            this.amount = "";
                            return [2 /*return*/];
                    }
                });
            });
        },
        enableEdit: function (feed) {
            this.editDialog = true;
            this.edited = feed;
        },
        denyActivity: function () {
            this.edited = null;
            this.editDialog = false;
        },
        moment: function () {
            return moment();
        },
        formatDate: function (date) {
            var time = (new Date(date)).toTimeString().split(" ");
            return (new Date(date)).toDateString() + " " + time[0];
        },
        addFeed: function () {
            return __awaiter(this, void 0, void 0, function () {
                var details, feed, response, e_5, product, e_6, e_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            details = {};
                            if (this.amount !== "" && this.value === "Investment") {
                                details["amount"] = this.amount;
                            }
                            details["text"] = this.text;
                            feed = {
                                feedId: v4(),
                                teamId: this.teamId,
                                feedType: this.value,
                                text: details,
                                date: new Date()
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.ui.storeDispatch("feed/addFeed", feed)];
                        case 2:
                            response = _a.sent();
                            if (!response) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.storeDispatch("feed/loadFeed", this.teamId)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            e_5 = _a.sent();
                            console.error(e_5);
                            return [3 /*break*/, 6];
                        case 6:
                            _a.trys.push([6, 12, , 13]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + this.teamId)];
                        case 7:
                            product = _a.sent();
                            if (!product.data) return [3 /*break*/, 11];
                            product.data.updatedAt = this.formatDate(new Date());
                            _a.label = 8;
                        case 8:
                            _a.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/teams/product/update", {
                                    product: product.data,
                                    upload: "",
                                    ext: ".pptx",
                                    teamId: this.teamId
                                })];
                        case 9:
                            _a.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            e_6 = _a.sent();
                            console.error(e_6);
                            return [3 /*break*/, 11];
                        case 11: return [3 /*break*/, 13];
                        case 12:
                            e_7 = _a.sent();
                            console.error(e_7);
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
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
            { staticClass: "content", attrs: { width: "1000" } },
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
                                  "Note: You can update the newsfeed 4 times a day"
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
                  staticStyle: { margin: "auto", "margin-top": "20px" },
                  attrs: { flat: "", "max-width": "1000" }
                },
                [
                  _c("v-divider"),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticStyle: {
                        "margin-top": "20px",
                        "margin-bottom": "20px"
                      },
                      attrs: { align: "center" }
                    },
                    [
                      _vm._v(
                        "Please select the type of update you would like to publish."
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-container",
                    { attrs: { "pr-7": "", "pl-7": "", fluid: "" } },
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.items,
                          "item-text": "name",
                          "item-value": "value",
                          label: "Update"
                        },
                        model: {
                          value: _vm.value,
                          callback: function($$v) {
                            _vm.value = $$v;
                          },
                          expression: "value"
                        }
                      }),
                      _vm._v(" "),
                      _vm.value === _vm.FeedTypes.INVESTMENT
                        ? _c(
                            "div",
                            [
                              _c("v-textarea", {
                                attrs: {
                                  name: "Investments",
                                  label: "Investments",
                                  counter: "400"
                                },
                                model: {
                                  value: _vm.text,
                                  callback: function($$v) {
                                    _vm.text = $$v;
                                  },
                                  expression: "text"
                                }
                              }),
                              _vm._v(" "),
                              _c("v-text-field", {
                                attrs: {
                                  name: "Details",
                                  label: "Amount",
                                  counter: "10"
                                },
                                model: {
                                  value: _vm.amount,
                                  callback: function($$v) {
                                    _vm.amount = $$v;
                                  },
                                  expression: "amount"
                                }
                              })
                            ],
                            1
                          )
                        : _vm.value === _vm.FeedTypes.AWARD ||
                          _vm.value === _vm.FeedTypes.UPDATE
                        ? _c(
                            "div",
                            [
                              _c("v-textarea", {
                                attrs: {
                                  name: _vm.value,
                                  label: _vm.value,
                                  counter: "600"
                                },
                                model: {
                                  value: _vm.text,
                                  callback: function($$v) {
                                    _vm.text = $$v;
                                  },
                                  expression: "text"
                                }
                              })
                            ],
                            1
                          )
                        : _vm.value === _vm.FeedTypes.COLLABORATORS
                        ? _c(
                            "div",
                            [
                              _c("v-textarea", {
                                attrs: {
                                  name: _vm.value,
                                  label: _vm.value,
                                  counter: "400"
                                },
                                model: {
                                  value: _vm.text,
                                  callback: function($$v) {
                                    _vm.text = $$v;
                                  },
                                  expression: "text"
                                }
                              })
                            ],
                            1
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _c(
                        "v-card-actions",
                        {
                          staticClass: "justify-center",
                          model: {
                            value: _vm.value,
                            callback: function($$v) {
                              _vm.value = $$v;
                            },
                            expression: "value"
                          }
                        },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { color: "primary" },
                              on: {
                                click: function($event) {
                                  return _vm.addFeed()
                                }
                              }
                            },
                            [_vm._v("Submit")]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-container",
                    { attrs: { "pr-7": "", "pl-7": "", fluid: "" } },
                    [
                      _vm._l(_vm.productUpdates, function(item, index) {
                        return _c(
                          "v-card",
                          { key: index, staticClass: "mb-4" },
                          [
                            _c(
                              "v-card-title",
                              { staticStyle: { "font-weight": "bold" } },
                              [
                                item.feedType === _vm.FeedTypes.INVESTMENT
                                  ? _c(
                                      "v-icon",
                                      {
                                        attrs: {
                                          large: "",
                                          left: "",
                                          color: "#22542b"
                                        }
                                      },
                                      [_vm._v("mdi-account-cash")]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                item.feedType === _vm.FeedTypes.AWARD
                                  ? _c(
                                      "v-icon",
                                      {
                                        attrs: {
                                          large: "",
                                          left: "",
                                          color: "#e0ac1b"
                                        }
                                      },
                                      [_vm._v("mdi-trophy")]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                item.feedType === _vm.FeedTypes.UPDATE
                                  ? _c(
                                      "v-icon",
                                      {
                                        attrs: {
                                          large: "",
                                          left: "",
                                          color: "#9e2219"
                                        }
                                      },
                                      [_vm._v("mdi-update")]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                item.feedType === _vm.FeedTypes.COLLABORATORS
                                  ? _c(
                                      "v-icon",
                                      {
                                        attrs: {
                                          large: "",
                                          left: "",
                                          color: "#202b4f"
                                        }
                                      },
                                      [_vm._v("mdi-account-tie")]
                                    )
                                  : _vm._e(),
                                _vm._v(
                                  "\n\t\t\t\t\t\t\n\t\t\t\t\t\t" +
                                    _vm._s(item.feedType) +
                                    "\n\t\t\t\t\t\t"
                                ),
                                _c("br")
                              ],
                              1
                            ),
                            _vm._v(" "),
                            item && item.date
                              ? _c(
                                  "v-card-subtitle",
                                  {
                                    staticStyle: {
                                      "font-size": "15px",
                                      "font-weight": "bold"
                                    }
                                  },
                                  [
                                    _vm._v(
                                      "\n\t\t\t\t\t\t" +
                                        _vm._s(_vm.formatDate(item.date)) +
                                        "\n\t\t\t\t\t"
                                    )
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _c(
                              "v-card-text",
                              [
                                _c("span", [_vm._v(_vm._s(item.text["text"]))]),
                                _vm._v(" "),
                                _c("v-spacer"),
                                _vm._v(" "),
                                item.feedType === _vm.FeedTypes.INVESTMENT
                                  ? _c("span", [
                                      _vm._v(
                                        " Amount:" +
                                          _vm._s(item.text["amount"]) +
                                          " "
                                      )
                                    ])
                                  : _vm._e()
                              ],
                              1
                            )
                          ],
                          1
                        )
                      }),
                      _vm._v(" "),
                      _c(
                        "v-dialog",
                        {
                          attrs: { "max-width": "450" },
                          model: {
                            value: _vm.editDialog,
                            callback: function($$v) {
                              _vm.editDialog = $$v;
                            },
                            expression: "editDialog"
                          }
                        },
                        [
                          _vm.edited
                            ? _c(
                                "v-card",
                                { attrs: { flat: "", width: "450" } },
                                [
                                  _c(
                                    "v-card-title",
                                    {
                                      staticClass: "justify-center",
                                      staticStyle: {
                                        "font-family": "Georgia, serif",
                                        "font-weight": "bold"
                                      }
                                    },
                                    [
                                      _vm._v(
                                        "\n\t\t\t\t\t\t\tEdit " +
                                          _vm._s(_vm.edited.feedType) +
                                          " \n\t\t\t\t\t\t"
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-card-subtitle",
                                    {
                                      staticClass: "justify-center",
                                      staticStyle: { "font-weight": "bold" }
                                    },
                                    [
                                      _vm._v(
                                        "\n\t\t\t\t\t\t\t" +
                                          _vm._s(
                                            _vm.formatDate(_vm.edited.date)
                                          ) +
                                          "\n\t\t\t\t\t\t"
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("v-divider"),
                                  _vm._v(" "),
                                  _c("v-card-text", [
                                    _vm.edited.feedType ===
                                    _vm.FeedTypes.INVESTMENT
                                      ? _c(
                                          "div",
                                          [
                                            _c("v-textarea", {
                                              attrs: {
                                                name: "Investments",
                                                label: "Investments",
                                                counter: "400"
                                              },
                                              model: {
                                                value: _vm.text,
                                                callback: function($$v) {
                                                  _vm.text = $$v;
                                                },
                                                expression: "text"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _c("v-text-field", {
                                              attrs: {
                                                name: "Details",
                                                label: "Amount",
                                                counter: "10"
                                              },
                                              model: {
                                                value: _vm.amount,
                                                callback: function($$v) {
                                                  _vm.amount = $$v;
                                                },
                                                expression: "amount"
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      : _vm.edited.feedType ===
                                          _vm.FeedTypes.AWARD ||
                                        _vm.edited.feedType ===
                                          _vm.FeedTypes.UPDATE
                                      ? _c(
                                          "div",
                                          [
                                            _c("v-textarea", {
                                              attrs: {
                                                name: _vm.edited.feedType,
                                                label: _vm.edited.feedType,
                                                counter: "600"
                                              },
                                              model: {
                                                value: _vm.text,
                                                callback: function($$v) {
                                                  _vm.text = $$v;
                                                },
                                                expression: "text"
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      : _vm.edited.feedType ===
                                        _vm.FeedTypes.COLLABORATORS
                                      ? _c(
                                          "div",
                                          [
                                            _c("v-textarea", {
                                              attrs: {
                                                name: _vm.edited.feedType,
                                                label: _vm.edited.feedType,
                                                counter: "400"
                                              },
                                              model: {
                                                value: _vm.text,
                                                callback: function($$v) {
                                                  _vm.text = $$v;
                                                },
                                                expression: "text"
                                              }
                                            })
                                          ],
                                          1
                                        )
                                      : _vm._e()
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "v-card-actions",
                                    { staticClass: "justify-center" },
                                    [
                                      _c(
                                        "v-btn",
                                        {
                                          attrs: { icon: "", fab: "" },
                                          on: {
                                            click: function($event) {
                                              return _vm.enableEdit(_vm.item)
                                            }
                                          }
                                        },
                                        [
                                          _c("v-icon", [
                                            _vm._v("mdi-pencil-circle-outline")
                                          ])
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-btn",
                                        {
                                          attrs: { icon: "", fab: "" },
                                          on: {
                                            click: function($event) {
(_vm.edited = _vm.item),
                                                (_vm.removeDialog = true);
                                            }
                                          }
                                        },
                                        [
                                          _c("v-icon", [
                                            _vm._v("mdi-close-circle")
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
                            : _vm._e()
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-dialog",
                        {
                          attrs: { persistent: "", "max-width": "290" },
                          model: {
                            value: _vm.removeDialog,
                            callback: function($$v) {
                              _vm.removeDialog = $$v;
                            },
                            expression: "removeDialog"
                          }
                        },
                        [
                          _c(
                            "v-card",
                            [
                              _c(
                                "v-card-title",
                                {
                                  staticClass: "justify-center",
                                  staticStyle: {
                                    "font-family": "Georgia, serif"
                                  }
                                },
                                [_vm._v("Remove Feed")]
                              ),
                              _vm._v(" "),
                              _c("v-card-text", [
                                _vm._v(
                                  "Are you sure you want to remove this update form your team's feed list?"
                                )
                              ]),
                              _vm._v(" "),
                              _c(
                                "v-card-actions",
                                { staticClass: "justify-center" },
                                [
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: { color: "#32a852", text: "" },
                                      on: {
                                        click: function($event) {
                                          return _vm.accept(_vm.edited)
                                        }
                                      }
                                    },
                                    [_vm._v("Yes")]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: { color: "#a83232", text: "" },
                                      on: {
                                        click: function($event) {
                                          return _vm.deny()
                                        }
                                      }
                                    },
                                    [_vm._v("No")]
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
                    ],
                    2
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
    name: "ProductFeedViewer",
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
                                this.teamId = (this.$route.params.teamId);
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
                                return [4 /*yield*/, this.ui.api.get("/api/v1/feed/" + this.teamId)];
                            case 6:
                                response = _a.sent();
                                if (response.data) {
                                    this.productUpdates = response.data;
                                    if (this.productUpdates.length === 0) {
                                        this.productUpdates = null;
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
                                if (response) {
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
                                if (response) {
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
            productUpdates: [],
            FeedTypes: FeedTypes,
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
                            if (response.data) {
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
                    if (user.userDetails["faculty"] !== undefined) {
                        user.faculty = user.userDetails["faculty"];
                    }
                    else {
                        user.faculty = "";
                    }
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
              _c("v-divider"),
              _vm._v(" "),
              _vm.productUpdates
                ? _vm._l(_vm.productUpdates, function(item, index) {
                    return _c(
                      "v-card",
                      {
                        key: index,
                        staticClass: "justify-center",
                        staticStyle: {
                          margin: "auto",
                          "margin-bottom": "20px",
                          "margin-top": "30px"
                        },
                        attrs: { flat: "", outlined: "", width: "800" }
                      },
                      [
                        _c(
                          "v-card-title",
                          {
                            staticStyle: {
                              "font-family": "Georgia, serif",
                              "font-size": "18px",
                              "font-weight": "600"
                            }
                          },
                          [
                            item.feedType === _vm.FeedTypes.INVESTMENT
                              ? _c(
                                  "v-icon",
                                  {
                                    attrs: {
                                      large: "",
                                      left: "",
                                      color: "#22542b"
                                    }
                                  },
                                  [_vm._v("mdi-account-cash")]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            item.feedType === _vm.FeedTypes.AWARD
                              ? _c(
                                  "v-icon",
                                  {
                                    attrs: {
                                      large: "",
                                      left: "",
                                      color: "#e0ac1b"
                                    }
                                  },
                                  [_vm._v("mdi-trophy")]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            item.feedType === _vm.FeedTypes.UPDATE
                              ? _c(
                                  "v-icon",
                                  {
                                    attrs: {
                                      large: "",
                                      left: "",
                                      color: "#9e2219"
                                    }
                                  },
                                  [_vm._v("mdi-update")]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            item.feedType === _vm.FeedTypes.COLLABORATORS
                              ? _c(
                                  "v-icon",
                                  {
                                    attrs: {
                                      large: "",
                                      left: "",
                                      color: "#202b4f"
                                    }
                                  },
                                  [_vm._v("mdi-account-tie")]
                                )
                              : _vm._e(),
                            _vm._v(
                              "\n\t\t\t\t\n\t\t\t\t\tFeed Type: " +
                                _vm._s(item.feedType) +
                                "\n\t\t\t\t"
                            )
                          ],
                          1
                        ),
                        _vm._v(" "),
                        item && item.date
                          ? _c(
                              "v-card-subtitle",
                              {
                                staticStyle: {
                                  "font-family": "Georgia, serif",
                                  "font-size": "18px"
                                }
                              },
                              [
                                _vm._v(
                                  "\n\t\t\t\t\t\t" +
                                    _vm._s(_vm.formatDate(item.date)) +
                                    "\n\t\t\t\t"
                                )
                              ]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _c("v-divider"),
                        _vm._v(" "),
                        _c(
                          "v-card-text",
                          { staticStyle: { "font-family": "Georgia, serif" } },
                          [
                            _c("span", [
                              _vm._v(
                                "Feed Description: " + _vm._s(item.text["text"])
                              )
                            ]),
                            _vm._v(" "),
                            _c("v-spacer"),
                            _vm._v(" "),
                            item.feedType === _vm.FeedTypes.INVESTMENT
                              ? _c("span", [
                                  _vm._v(
                                    " Amount:" +
                                      _vm._s(item.text["amount"]) +
                                      " "
                                  )
                                ])
                              : _vm._e()
                          ],
                          1
                        )
                      ],
                      1
                    )
                  })
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
                                "\n\t\t\t\t\t\tNo feed to show for this team.\n\t\t\t\t\t"
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
            2
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

function feedStore() {
    var ui = UI$1.getInstance();
    var store = {
        namespaced: true,
        state: {
            feed: []
        },
        getters: {
            feed: function (state) { return state.feed; },
        },
        mutations: {
            setFeed: function (state, newFeed) {
                state.feed = newFeed;
            }
        },
        actions: {
            loadFeed: function (storeParam, teamId) {
                return __awaiter(this, void 0, void 0, function () {
                    var newFeed, r, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                newFeed = [];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, ui.api.get("/api/v1/feed/" + teamId)];
                            case 2:
                                r = _a.sent();
                                newFeed = r.data;
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.error(e_1);
                                return [2 /*return*/, false];
                            case 4:
                                storeParam.commit("setFeed", newFeed);
                                return [2 /*return*/, true];
                        }
                    });
                });
            },
            addFeed: function (storeParam, feed) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, ui.api.post("/api/v1/feed/add", feed)];
                            case 1:
                                response = _a.sent();
                                if (response.status === 200) {
                                    return [2 /*return*/, true];
                                }
                                else {
                                    return [2 /*return*/, false];
                                }
                            case 2:
                                e_2 = _a.sent();
                                console.error(e_2);
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            },
            updateFeed: function (storeParam, feed) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, ui.api.post("/api/v1/feed/update", { feed: feed })];
                            case 1:
                                response = _a.sent();
                                if (response.status === 200) {
                                    return [2 /*return*/, true];
                                }
                                else {
                                    return [2 /*return*/, false];
                                }
                            case 2:
                                e_3 = _a.sent();
                                console.error(e_3);
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            },
            deleteFeed: function (storeParam, feed) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, ui.api.post("/api/v1/feed/delete", { feed: feed })];
                            case 1:
                                response = _a.sent();
                                if (response.status === 200) {
                                    return [2 /*return*/, true];
                                }
                                else {
                                    return [2 /*return*/, false];
                                }
                            case 2:
                                e_4 = _a.sent();
                                console.error(e_4);
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
        }
    };
    return store;
}

var e_1, _a, e_2, _b;
var workspaceUi = WorkspaceUI.getInstance();
var ui = UI$1.getInstance();
var workspaceRoutes = [
    {
        path: '/product/feed',
        name: "Product Feed",
        component: __vue_component__
    }
];
var viewTeamRoutes = [
    {
        path: '/viewTeam/feed/:teamId',
        name: "Product Feed Viewer",
        component: __vue_component__$1
    }
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
ui.registerStore("feed", feedStore());

export { FeedTypes, FeedUi, getFeedUi };
