import { UI as UI$1 } from '@startupway/main/lib/ui';
import { WorkspaceUI, ToolbarButtonPosition } from '@startupway/workspace/lib/ui';
import Vue from 'vue';
import { SnackBarTypes, SnackBarHorizontal, SnackBarVertical } from '@startupway/menu/lib/ui';
import { mapGetters } from 'vuex';
import VueRecaptcha from 'vue-recaptcha';

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

var UsersUi = /** @class */ (function () {
    function UsersUi() {
    }
    return UsersUi;
}());
var UI = new UsersUi();
function getUsersUi() {
    return UI;
}

var universities = [
    "N/A",
    "Universitatea Politehnica Bucuresti",
    "Universitatea Politehnica Timisoara",
    "Universitatea Lucian Blaga, Sibiu",
    "Universitatea Craiova",
    "Universitatea Pitesti",
    "Universitatea Bucuresti",
    "Universitatea de Arhitectura si Urbanism Ion Mincu",
    "Universitatea Babes-Bolyai Cluj",
    "Universitatea Transilvania",
    "Universitatea Alexandru Ioan Cuza, Iasi",
    "Universitatea Ovidius",
    "Universitatea de Medicina si Farmacie Carol Davila",
    "Academia de Studii Economice",
    "Academia Tehnica Militara",
    "Academia Nationala de Informatii",
    "The Entrepreneurship Academy"
];

var STARTUPWAY_TOKEN = "startupway:token";
function usersStore() {
    var ui = UI$1.getInstance();
    ui.api.interceptors.request.use(function (config) {
        if (window.localStorage.getItem(STARTUPWAY_TOKEN)) {
            config.headers.Authorization = 'Bearer ' + window.localStorage.getItem(STARTUPWAY_TOKEN);
        }
        return config;
    });
    var store = {
        namespaced: true,
        state: {
            token: undefined,
            user: undefined
        },
        getters: {
            token: function (state) { return state.token; },
            user: function (state) { return state.user; }
        },
        mutations: {
            token: function (state, token) {
                state.token = token;
                window.localStorage.setItem(STARTUPWAY_TOKEN, token);
            },
            user: function (state, newUser) {
                state.user = newUser;
            }
        },
        actions: {
            login: function (storeParam, _a) {
                var username = _a.username, password = _a.password;
                return __awaiter(this, void 0, void 0, function () {
                    var r, e_1, errorToken;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, ui.api.post("/api/v1/users/login", {
                                        username: username,
                                        password: password,
                                        lastLogin: new Date()
                                    })];
                            case 1:
                                r = _b.sent();
                                if (r.data.sessionId === "") {
                                    return [2 /*return*/, r.data.token];
                                }
                                storeParam.commit('token', r.data.token);
                                return [2 /*return*/, r.data.token];
                            case 2:
                                e_1 = _b.sent();
                                console.error(e_1);
                                errorToken = "error";
                                return [2 /*return*/, errorToken];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            },
            logout: function (storeParam) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, ui.api.post("/api/v1/users/logout")];
                            case 1:
                                _a.sent();
                                storeParam.commit('token', null);
                                storeParam.commit('user', null);
                                //TODO DELETE SESSIONS
                                return [2 /*return*/, true];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, false];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            },
            load: function (storeParam) {
                return __awaiter(this, void 0, void 0, function () {
                    var user, response, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                user = null;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, ui.api.get("/api/v1/users/user")];
                            case 2:
                                response = _a.sent();
                                user = response.data;
                                return [3 /*break*/, 4];
                            case 3:
                                e_3 = _a.sent();
                                console.error(e_3);
                                return [2 /*return*/, false];
                            case 4:
                                storeParam.commit("user", user);
                                return [2 /*return*/, true];
                        }
                    });
                });
            }
        }
    };
    return store;
}

var img = "data:image/png;base64,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";

var script = Vue.extend({
    name: "Login",
    components: {
        VueRecaptcha: VueRecaptcha
    },
    mounted: function () {
        this.ui.logEvent("USERS", (this.$options.name ? this.$options.name : "UNKOWN"), VueRecaptcha.name + " Loaded");
        this.loadedPage = true;
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            login: "",
            pass: "",
            snackOptions: {
                text: "",
                type: SnackBarTypes.INFO,
                timeout: 2000,
                horizontal: SnackBarHorizontal.RIGHT,
                vertical: SnackBarVertical.BOTTOM
            },
            showPassword: false,
            snackbar: false,
            dialog: false,
            verified: true,
            sent: true,
            email: "",
            lightOff: true,
            lightOn: false,
            aKey: "6Le6Jq4ZAAAAAEf_TFh2ZR-3tv3wycflW7ctlEeF",
            loginImage: img,
            triggered: false,
            loadedPage: false,
            loadedRecaptcha: false,
        };
    },
    watch: {
        _token: {
            immediate: true,
            handler: function (value) {
                return __awaiter(this, void 0, void 0, function () {
                    var serverResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!value) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.ui.api.get("/api/v1/users/user", {
                                        headers: { Authorization: "Bearer " + this._token }
                                    })];
                            case 1:
                                serverResponse = _a.sent();
                                if (serverResponse.status !== 401) {
                                    if (this.$route.path !== "/workspace")
                                        this.$router.push("/workspace");
                                }
                                return [3 /*break*/, 2];
                            case 2: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        ligthOff: {
            immediate: true,
            handler: function () {
                var _this = this;
                setInterval(function () {
                    _this.lightOff = !_this.lightOff;
                    _this.lightOn = !_this.lightOn;
                }, 1000);
            }
        }
    },
    computed: __assign({}, mapGetters({
        _token: "users/token"
    })),
    methods: {
        update: function (prop) {
            console.log("got update event");
            this.snackbar = prop;
        },
        // as any -> Google api, to reseach into response type.
        validate: function (response) {
            if (response) {
                this.verified = false;
            }
        },
        resetPassword: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/users/verify/" + this.email)];
                        case 1:
                            response = _a.sent();
                            if (!(response.data.accept = "Yes")) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.ui.api.post("/api/v1/admin/createResetEmail", { email: this.email })];
                        case 2:
                            _a.sent();
                            this.verified = false;
                            this.sent = false;
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            error_1 = _a.sent();
                            console.error(error_1);
                            this.snackOptions.text = "FrontEnd error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        loginFunction: function () {
            return __awaiter(this, void 0, void 0, function () {
                var token, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.triggered = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.ui.storeDispatch("users/login", {
                                    username: this.login,
                                    password: this.pass,
                                    lastLogin: new Date()
                                })];
                        case 2:
                            token = _a.sent();
                            if (token === "cred") {
                                this.snackOptions.text = "Password or Username incorrect";
                                this.snackOptions.type = SnackBarTypes.ERROR;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            else if (token === "error") {
                                this.snackOptions.text = "Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                                this.snackOptions.type = SnackBarTypes.ERROR;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error(error_2);
                            this.snackOptions.text = "FrontEnd error. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            return [3 /*break*/, 4];
                        case 4:
                            this.triggered = false;
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

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
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
      _c(
        "v-container",
        { staticClass: "bg", attrs: { fluid: "", "fill-height": "" } },
        [
          _c(
            "v-layout",
            { attrs: { "align-center": "", "justify-center": "" } },
            [
              _c(
                "v-flex",
                { attrs: { xs12: "", sm8: "", md4: "" } },
                [
                  _c(
                    "v-fab-transition",
                    [
                      _vm.loadedPage
                        ? _c(
                            "v-card",
                            {
                              staticClass: "elevation-12",
                              attrs: { shaped: "" }
                            },
                            [
                              _c(
                                "v-toolbar",
                                {
                                  staticStyle: {},
                                  attrs: {
                                    color: "primary",
                                    dark: "",
                                    flat: "",
                                    height: "170px"
                                  }
                                },
                                [
                                  _c("v-img", {
                                    attrs: {
                                      contain: "",
                                      src: _vm.loginImage,
                                      "max-height": "170"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-card-text",
                                { staticStyle: { "margin-top": "50px" } },
                                [
                                  _c(
                                    "v-form",
                                    [
                                      _c("v-text-field", {
                                        staticClass: "pb-2",
                                        attrs: {
                                          id: "login",
                                          label: "Username",
                                          name: "login",
                                          type: "text",
                                          rounded: "",
                                          outlined: "",
                                          color: "primary",
                                          "prepend-icon":
                                            "mdi-account-circle mdi-36px"
                                        },
                                        on: {
                                          keyup: function($event) {
                                            if (
                                              !$event.type.indexOf("key") &&
                                              _vm._k(
                                                $event.keyCode,
                                                "enter",
                                                13,
                                                $event.key,
                                                "Enter"
                                              )
                                            ) {
                                              return null
                                            }
                                            return _vm.loginFunction()
                                          }
                                        },
                                        model: {
                                          value: _vm.login,
                                          callback: function($$v) {
                                            _vm.login = $$v;
                                          },
                                          expression: "login"
                                        }
                                      }),
                                      _vm._v(" "),
                                      _c("v-text-field", {
                                        staticClass: "pb-2",
                                        attrs: {
                                          id: "password",
                                          label: "Password",
                                          name: "password",
                                          type: _vm.showPassword
                                            ? "text"
                                            : "password",
                                          rounded: "",
                                          outlined: "",
                                          color: "primary",
                                          "prepend-icon":
                                            "mdi-key-variant mdi-36px",
                                          "append-icon": _vm.showPassword
                                            ? "mdi-eye"
                                            : "mdi-eye-off"
                                        },
                                        on: {
                                          "click:append": function($event) {
                                            _vm.showPassword = !_vm.showPassword;
                                          },
                                          keyup: function($event) {
                                            if (
                                              !$event.type.indexOf("key") &&
                                              _vm._k(
                                                $event.keyCode,
                                                "enter",
                                                13,
                                                $event.key,
                                                "Enter"
                                              )
                                            ) {
                                              return null
                                            }
                                            return _vm.loginFunction()
                                          }
                                        },
                                        model: {
                                          value: _vm.pass,
                                          callback: function($$v) {
                                            _vm.pass = $$v;
                                          },
                                          expression: "pass"
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
                                "v-card-actions",
                                { staticClass: "justify-center" },
                                [
                                  _c(
                                    "v-col",
                                    { staticClass: "justify-center" },
                                    [
                                      _c(
                                        "v-row",
                                        { staticClass: "justify-center" },
                                        [
                                          _c(
                                            "v-btn",
                                            {
                                              attrs: {
                                                disabled: _vm.triggered,
                                                rounded: "",
                                                "min-height": "10%",
                                                width: "75%",
                                                color: "primary"
                                              },
                                              on: {
                                                click: function($event) {
                                                  return _vm.loginFunction()
                                                }
                                              }
                                            },
                                            [_vm._v("Login")]
                                          )
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "v-row",
                                        { staticClass: "justify-center" },
                                        [
                                          _c(
                                            "v-btn",
                                            {
                                              staticStyle: {
                                                "margin-top": "30px"
                                              },
                                              attrs: {
                                                color: "primary",
                                                width: "75%",
                                                text: ""
                                              },
                                              on: {
                                                click: function($event) {
                                                  _vm.dialog = true;
                                                }
                                              }
                                            },
                                            [_vm._v("Forgot Password?")]
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
                            1
                          )
                        : _vm._e()
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
            "v-scale-transition",
            [
              _c(
                "v-dialog",
                {
                  attrs: { width: "450", persistent: "" },
                  model: {
                    value: _vm.dialog,
                    callback: function($$v) {
                      _vm.dialog = $$v;
                    },
                    expression: "dialog"
                  }
                },
                [
                  _c(
                    "v-card",
                    { attrs: { width: "450", flat: "" } },
                    [
                      _c(
                        "v-card-title",
                        {
                          staticClass: "justify-center",
                          staticStyle: { margin: "auto" }
                        },
                        [_vm._v("\n\t\t\t\t\t\tPassword Recovery\n\t\t\t\t\t")]
                      ),
                      _vm._v(" "),
                      _c("v-divider"),
                      _vm._v(" "),
                      !_vm.sent
                        ? _c(
                            "v-card-text",
                            { staticStyle: { "margin-top": "20px" } },
                            [
                              _vm._v(
                                "\n\t\t\t\t\t\tAn email with the reset link has been sent to your account\n\t\t\t\t\t"
                              )
                            ]
                          )
                        : _c(
                            "v-card-text",
                            { staticStyle: { "margin-top": "20px" } },
                            [
                              _vm._v(
                                "\n\t\t\t\t\t\tPlease enter your email\n\t\t\t\t\t\t"
                              ),
                              _c("v-spacer"),
                              _vm._v(" "),
                              _c("v-text-field", {
                                attrs: { placeholder: "Email" },
                                model: {
                                  value: _vm.email,
                                  callback: function($$v) {
                                    _vm.email = $$v;
                                  },
                                  expression: "email"
                                }
                              }),
                              _vm._v(" "),
                              _c(
                                "v-scale-transition",
                                [
                                  _c("vue-recaptcha", {
                                    directives: [
                                      {
                                        name: "show",
                                        rawName: "v-show",
                                        value: _vm.loadedRecaptcha,
                                        expression: "loadedRecaptcha"
                                      }
                                    ],
                                    attrs: {
                                      sitekey: _vm.aKey,
                                      loadRecaptchaScript: true
                                    },
                                    on: {
                                      "hook:mounted": function($event) {
                                        _vm.loadedRecaptcha = true;
                                      },
                                      verify: _vm.validate
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
                        "v-card-actions",
                        [
                          _vm.sent
                            ? _c(
                                "v-btn",
                                {
                                  attrs: { disabled: _vm.verified },
                                  on: {
                                    click: function($event) {
                                      return _vm.resetPassword()
                                    }
                                  }
                                },
                                [_vm._v("Reset Password")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _c("v-spacer"),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: { color: "primary" },
                              on: {
                                click: function($event) {
(_vm.dialog = false), (_vm.sent = true);
                                }
                              }
                            },
                            [_vm._v("Close")]
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
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("SnackBar", {
        attrs: { options: _vm.snackOptions, snackbar: _vm.snackbar },
        on: { "update-snackbar": _vm.update }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-42980660_0", { source: "\n.bg {\r\n\tbackground-image: linear-gradient(to right top, #ffffff, #fafbfe, #f4f8fc, #ecf5fa, #e4f2f6, #d2e7eb, #c0dcde, #aed1d1, #8dbcbc, #6ca7a8, #499294, #197e81);\n}\r\n", map: {"version":3,"sources":["/mnt/d/Proiecte/StartupWay2PR2/packages/users/src/ui/views/Login.vue"],"names":[],"mappings":";AA8PA;CACA,2JAAA;AACA","file":"Login.vue","sourcesContent":["<template>\r\n\t<v-app>\r\n\t\t<v-container\r\n\t\t\tfluid \r\n\t\t\tfill-height\r\n\t\t\tclass=\"bg\"\r\n\t\t>\r\n\t\t\t<v-layout align-center justify-center> \r\n\t\t\t\t<v-flex xs12 sm8 md4>\r\n\t\t\t\t\t<v-fab-transition>\r\n\t\t\t\t\t\t<v-card v-if=\"loadedPage\" class=\"elevation-12\" shaped>\r\n\t\t\t\t\t\t\t<v-toolbar color=\"primary\" dark flat height=\"170px\" style=\"padding\">\r\n\t\t\t\t\t\t\t\t<v-img contain :src=\"loginImage\" max-height=\"170\"></v-img>\t\t\t\t\t\t\t\t \t\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t\t</v-toolbar>\r\n\t\t\t\t\t\t\t<v-card-text style=\"margin-top: 50px;\">\r\n\t\t\t\t\t\t\t\t<v-form>\r\n\t\t\t\t\t\t\t\t\t<v-text-field\r\n\t\t\t\t\t\t\t\t\t\tid=\"login\"\r\n\t\t\t\t\t\t\t\t\t\tv-model=\"login\"\r\n\t\t\t\t\t\t\t\t\t\tlabel=\"Username\"\r\n\t\t\t\t\t\t\t\t\t\tname=\"login\"\r\n\t\t\t\t\t\t\t\t\t\ttype=\"text\"\r\n\t\t\t\t\t\t\t\t\t\trounded\r\n\t\t\t\t\t\t\t\t\t\toutlined\r\n\t\t\t\t\t\t\t\t\t\tcolor=\"primary\"\r\n\t\t\t\t\t\t\t\t\t\tprepend-icon=\"mdi-account-circle mdi-36px\"\r\n\t\t\t\t\t\t\t\t\t\t@keyup.enter=\"loginFunction()\"\r\n\t\t\t\t\t\t\t\t\t\tclass=\"pb-2\"\r\n\t\t\t\t\t\t\t\t\t></v-text-field>\r\n\r\n\t\t\t\t\t\t\t\t\t<v-text-field\r\n\t\t\t\t\t\t\t\t\t\tid=\"password\"\r\n\t\t\t\t\t\t\t\t\t\tv-model=\"pass\"\r\n\t\t\t\t\t\t\t\t\t\tlabel=\"Password\"\r\n\t\t\t\t\t\t\t\t\t\tname=\"password\"\r\n\t\t\t\t\t\t\t\t\t\t:type=\"showPassword ? 'text' : 'password'\"\r\n\t\t\t\t\t\t\t\t\t\trounded\r\n\t\t\t\t\t\t\t\t\t\toutlined\r\n\t\t\t\t\t\t\t\t\t\tcolor=\"primary\"\r\n\t\t\t\t\t\t\t\t\t\tprepend-icon=\"mdi-key-variant mdi-36px\"\r\n\t\t\t\t\t\t\t\t\t\t:append-icon=\"showPassword ? 'mdi-eye' : 'mdi-eye-off'\"\r\n\t\t\t\t\t\t\t\t\t\t@click:append=\"showPassword = !showPassword\"\r\n\t\t\t\t\t\t\t\t\t\t@keyup.enter=\"loginFunction()\"\r\n\t\t\t\t\t\t\t\t\t\tclass=\"pb-2\"\r\n\t\t\t\t\t\t\t\t\t></v-text-field>\r\n\t\t\t\t\t\t\t\t</v-form>\r\n\t\t\t\t\t\t\t</v-card-text>\r\n\t\t\t\t\t\t\t<v-card-actions class=\"justify-center\">\r\n\t\t\t\t\t\t\t\t<v-col class=\"justify-center\">\r\n\t\t\t\t\t\t\t\t\t<v-row class=\"justify-center\">\r\n\t\t\t\t\t\t\t\t\t\t<v-btn :disabled=\"triggered\" rounded min-height=\"10%\" width=\"75%\" color=\"primary\" @click=\"loginFunction()\">Login</v-btn>\r\n\t\t\t\t\t\t\t\t\t</v-row>\r\n\t\t\t\t\t\t\t\t\t<v-row class=\"justify-center\">\r\n\t\t\t\t\t\t\t\t\t\t<v-btn color=\"primary\" width=\"75%\" text @click=\"dialog=true\" style=\"margin-top: 30px;\">Forgot Password?</v-btn>\r\n\t\t\t\t\t\t\t\t\t</v-row>\r\n\t\t\t\t\t\t\t\t</v-col>\r\n\t\t\t\t\t\t\t</v-card-actions>\r\n\t\t\t\t\t\t</v-card>\r\n\t\t\t\t\t</v-fab-transition>\r\n\t\t\t\t</v-flex>\r\n\t\t\t</v-layout>\r\n\t\t\t<v-scale-transition>\r\n\t\t\t\t<v-dialog width=\"450\" v-model=\"dialog\" persistent>\r\n\t\t\t\t\t<v-card width=\"450\" flat>\r\n\t\t\t\t\t\t<v-card-title class=\"justify-center\" style=\" margin: auto;\">\r\n\t\t\t\t\t\t\tPassword Recovery\r\n\t\t\t\t\t\t</v-card-title>\r\n\t\t\t\t\t\t<v-divider></v-divider>\r\n\t\t\t\t\t\t<v-card-text v-if=\"!sent\" style=\"margin-top: 20px;\">\r\n\t\t\t\t\t\t\tAn email with the reset link has been sent to your account\r\n\t\t\t\t\t\t</v-card-text>\r\n\t\t\t\t\t\t<v-card-text v-else style=\"margin-top: 20px;\">\r\n\t\t\t\t\t\t\tPlease enter your email\r\n\t\t\t\t\t\t\t<v-spacer></v-spacer>\r\n\t\t\t\t\t\t\t<v-text-field v-model=\"email\" placeholder=\"Email\"></v-text-field>\r\n\t\t\t\t\t\t\t<v-scale-transition>\r\n\t\t\t\t\t\t\t\t<vue-recaptcha v-show=\"loadedRecaptcha\" @hook:mounted=\"loadedRecaptcha = true\" @verify=\"validate\" :sitekey=\"aKey\" :loadRecaptchaScript=\"true\"></vue-recaptcha>\r\n\t\t\t\t\t\t\t</v-scale-transition>\r\n\t\t\t\t\t\t</v-card-text>\r\n\t\t\t\t\t\t<v-card-actions>\r\n\t\t\t\t\t\t\t<v-btn v-if=\"sent\" :disabled=\"verified\" @click=\"resetPassword()\">Reset Password</v-btn>\r\n\t\t\t\t\t\t\t<v-spacer></v-spacer>\r\n\t\t\t\t\t\t\t<v-btn color=\"primary\" @click=\"dialog=false, sent=true\">Close</v-btn>\r\n\t\t\t\t\t\t</v-card-actions>\r\n\t\t\t\t\t</v-card>\r\n\t\t\t\t</v-dialog>\r\n\t\t\t</v-scale-transition>\r\n\t\t</v-container>\r\n\t\t<SnackBar :options=\"snackOptions\" @update-snackbar=\"update\" :snackbar=\"snackbar\"></SnackBar>\r\n\t</v-app>\r\n</template>\r\n\r\n<script lang=\"ts\">\r\nimport Vue from \"vue\";\r\nimport login from \"../img/welcome-startupway-white-668px.png\";\r\nimport { UI } from \"@startupway/main/lib/ui\";\r\nimport { User } from \"../../common\";\r\nimport { SnackBarOptions, SnackBarTypes, SnackBarHorizontal, SnackBarVertical } from \"@startupway/menu/lib/ui\";\r\nimport { mapGetters } from \"vuex\";\r\nimport VueRecaptcha from \"vue-recaptcha\";\r\ninterface ILogin {\r\n\tui: UI,\r\n\tlogin: string,\r\n\tpass: string,\r\n\tsnackOptions: SnackBarOptions,\r\n\tshowPassword: boolean,\r\n\tsnackbar: boolean,\r\n\tdialog: boolean,\r\n\tverified: boolean,\r\n\tsent: boolean,\r\n\temail: string,\r\n\tlightOff: boolean,\r\n\tlightOn: boolean,\r\n\taKey: string,\r\n\tloginImage: string,\r\n\ttriggered: boolean,\r\n\tloadedPage: boolean,\r\n\tloadedRecaptcha: boolean,\r\n}\r\nexport default Vue.extend({\r\n\tname: \"Login\",\r\n\tcomponents: {\r\n\t\tVueRecaptcha\r\n\t},\r\n\tmounted () {\r\n\t\tthis.ui.logEvent(\r\n\t\t\t\"USERS\",\r\n\t\t\t(this.$options.name ? this.$options.name : \"UNKOWN\"),\r\n\t\t\t`${VueRecaptcha.name} Loaded`\r\n\t\t);\r\n\t\tthis.loadedPage = true;\r\n\t},\r\n\tdata (): ILogin {\r\n\t\treturn {\r\n\t\t\tui: UI.getInstance(),\r\n\t\t\tlogin: \"\" as string,\r\n\t\t\tpass: \"\" as string,\r\n\t\t\tsnackOptions: {\r\n\t\t\t\ttext:\"\",\r\n\t\t\t\ttype: SnackBarTypes.INFO,\r\n\t\t\t\ttimeout:2000,\r\n\t\t\t\thorizontal: SnackBarHorizontal.RIGHT,\r\n\t\t\t\tvertical: SnackBarVertical.BOTTOM\r\n\t\t\t},\r\n\t\t\tshowPassword: false,\r\n\t\t\tsnackbar: false,\r\n\t\t\tdialog: false,\r\n\t\t\tverified: true,\r\n\t\t\tsent: true,\r\n\t\t\temail: \"\",\r\n\t\t\tlightOff: true,\r\n\t\t\tlightOn: false,\r\n\t\t\taKey:\"6Le6Jq4ZAAAAAEf_TFh2ZR-3tv3wycflW7ctlEeF\",\r\n\t\t\tloginImage: login,\r\n\t\t\ttriggered: false,\r\n\t\t\tloadedPage: false,\r\n\t\t\tloadedRecaptcha: false,\r\n\t\t};\r\n\t},\r\n\twatch: {\r\n\t\t_token: {\r\n\t\t\timmediate: true,\r\n\t\t\tasync handler(value: string):Promise<void> {\r\n\t\t\t\tif (value) {\r\n\t\t\t\t\tlet serverResponse = await this.ui.api.get<User | null>(\"/api/v1/users/user\", {\r\n\t\t\t\t\t\theaders: { Authorization: `Bearer ${this._token}` }\r\n\t\t\t\t\t});\r\n\t\t\t\t\tif (serverResponse.status !== 401) {\r\n\t\t\t\t\t\tif (this.$route.path!==\"/workspace\")\r\n\t\t\t\t\t\t\tthis.$router.push(\"/workspace\");\r\n\t\t\t\t\t}\r\n\t\t\t\t\t// get user - if not 401 push this.$router.push (\"/workspace\")\r\n\t\t\t\t\t// else delete token\r\n\t\t\t\t} else {\r\n\t\t\t\t\t// error\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t},\r\n\t\tligthOff: {\r\n\t\t\timmediate: true,\r\n\t\t\thandler():void {\r\n\t\t\t\tsetInterval( () => {\r\n\t\t\t\t\tthis.lightOff = !this.lightOff;\r\n\t\t\t\t\tthis.lightOn = !this.lightOn;\r\n\t\t\t\t}, 1000);\r\n\t\t\t}\r\n\t\t}\r\n\t},\r\n\tcomputed: {\r\n\t\t...mapGetters({\r\n\t\t\t_token: \"users/token\"\r\n\t\t})\r\n\t},\r\n\tmethods: {\r\n\t\tupdate (prop:boolean): void {\r\n\t\t\tconsole.log(\"got update event\");\r\n\t\t\tthis.snackbar = prop;\r\n\t\t},\r\n\t\t// as any -> Google api, to reseach into response type.\r\n\t\tvalidate(response:any):void {\r\n\t\t\tif (response) {\r\n\t\t\t\tthis.verified = false;\r\n\t\t\t}\r\n\t\t},\r\n\t\t\r\n\t\tasync resetPassword():Promise<void> {\r\n\t\t\ttry {\r\n\t\t\t\tlet response = await this.ui.api.get<{accept:string}>(\"/api/v1/users/verify/\"+this.email);\r\n\t\t\t\tif (response.data.accept = \"Yes\") {\r\n\t\t\t\t\tawait this.ui.api.post(\"/api/v1/admin/createResetEmail\", {email:this.email});\r\n\t\t\t\t\tthis.verified = false;\r\n\t\t\t\t\tthis.sent=false;\r\n\t\t\t\t}\r\n\t\t\t} catch (error) {\r\n\t\t\t\tconsole.error(error);\r\n\t\t\t\tthis.snackOptions.text = \"FrontEnd error. If the error persists, please contact technical support: teams@tech-lounge.ro.\";\r\n\t\t\t\tthis.snackOptions.type = SnackBarTypes.ERROR;\r\n\t\t\t\tthis.snackOptions.timeout = 2000;\r\n\t\t\t\tthis.snackbar = true;\r\n\t\t\t}\r\n\t\t},\r\n\t\tasync loginFunction():Promise<void> {\r\n\t\t\tthis.triggered = true;\r\n\t\t\ttry {\r\n\t\t\t\tlet token = <string> await this.ui.storeDispatch(\"users/login\", {\r\n\t\t\t\t\tusername: this.login,\r\n\t\t\t\t\tpassword: this.pass,\r\n\t\t\t\t\tlastLogin: new Date()\r\n\t\t\t\t});\r\n\t\t\t\tif (token === \"cred\") {\r\n\t\t\t\t\tthis.snackOptions.text = \"Password or Username incorrect\";\r\n\t\t\t\t\tthis.snackOptions.type = SnackBarTypes.ERROR;\r\n\t\t\t\t\tthis.snackOptions.timeout = 2000;\r\n\t\t\t\t\tthis.snackbar = true;\r\n\t\t\t\t} else if (token === \"error\") {\r\n\t\t\t\t\tthis.snackOptions.text = \"Server Error. If the error persists, please contact technical support: teams@tech-lounge.ro.\";\r\n\t\t\t\t\tthis.snackOptions.type = SnackBarTypes.ERROR;\r\n\t\t\t\t\tthis.snackOptions.timeout = 2000;\r\n\t\t\t\t\tthis.snackbar = true;\r\n\t\t\t\t}\r\n\t\t\t} catch (error) {\r\n\t\t\t\tconsole.error(error);\r\n\t\t\t\tthis.snackOptions.text = \"FrontEnd error. If the error persists, please contact technical support: teams@tech-lounge.ro.\";\r\n\t\t\t\tthis.snackOptions.type = SnackBarTypes.ERROR;\r\n\t\t\t\tthis.snackOptions.timeout = 2000;\r\n\t\t\t\tthis.snackbar = true;\r\n\t\t\t}\r\n\t\t\tthis.triggered = false;\r\n\t\t}\r\n\t}\r\n});\r\n</script>\r\n\r\n<style lang=\"css\">\r\n.bg {\r\n\tbackground-image: linear-gradient(to right top, #ffffff, #fafbfe, #f4f8fc, #ecf5fa, #e4f2f6, #d2e7eb, #c0dcde, #aed1d1, #8dbcbc, #6ca7a8, #499294, #197e81);\r\n}\r\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
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
    createInjector,
    undefined,
    undefined
  );

var MenuOptions;
(function (MenuOptions) {
    MenuOptions["MY_ACCOUNT"] = "1";
    MenuOptions["LOGOUT"] = "2";
})(MenuOptions || (MenuOptions = {}));
var script$1 = Vue.extend({
    name: "UserMenu",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ui = UI$1.getInstance();
                        return [4 /*yield*/, this.ui.storeDispatch("users/load", {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    data: function () {
        return {
            ui: {},
            options: {
                menuName: "User Menu",
                menuIcon: "mdi-account",
                img: "",
                menuTooltip: "Your Account",
                items: [
                    {
                        id: MenuOptions.MY_ACCOUNT,
                        title: "My Account",
                        icon: "mdi-account-settings",
                        link: "/user/account",
                    },
                    {
                        id: MenuOptions.LOGOUT,
                        title: "Logout",
                        icon: "mdi-exit-run",
                    }
                ]
            },
            snackOptions: {
                text: "",
                type: SnackBarTypes.INFO,
                timeout: 2000
            },
            snackbar: false,
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (user) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, aux, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                if (!user) return [3 /*break*/, 2];
                                this.options.menuName = user.firstName + " " + user.lastName;
                                return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", { userId: user.userId })];
                            case 1:
                                response = _a.sent();
                                if (response.data) {
                                    aux = this.options;
                                    aux.img = response.data;
                                    this.options = aux;
                                }
                                else if (response.status === 500) {
                                    this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                                    this.snackOptions.type = SnackBarTypes.ERROR;
                                    this.snackOptions.timeout = 2000;
                                    this.snackbar = true;
                                }
                                else {
                                    this.options.img = "";
                                }
                                _a.label = 2;
                            case 2: return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                if (e_1.status === 500) {
                                    console.error(e_1);
                                    this.snackOptions.text = "Server Error while Loading User Avatar. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                                    this.snackOptions.type = SnackBarTypes.ERROR;
                                    this.snackOptions.timeout = 2000;
                                    this.snackbar = true;
                                }
                                this.options.img = "";
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        },
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        click: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1, e;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            if (!(id === MenuOptions.LOGOUT)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.ui.storeDispatch('users/logout', {})];
                        case 1:
                            _a.sent();
                            // await this.ui.storeDispatch("teams/selectTeam", 0);
                            if (this.$route.path !== "/login") {
                                this.$router.push("/login");
                            }
                            _a.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            e = error_1;
                            console.error(e);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        update: function (prop) {
            this.snackbar = prop;
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
    "div",
    [
      _c("SimpleMenu", {
        attrs: { options: _vm.options },
        on: { click: _vm.click }
      }),
      _vm._v(" "),
      _vm.snackbar
        ? _c("SnackBar", {
            attrs: { options: _vm.snackOptions },
            on: { "update-snackbar": _vm.update }
          })
        : _vm._e()
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

var script$2 = Vue.extend({
    name: "EditAccount",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1, e, error_2, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.ui.storeDispatch("users/load", {})];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        console.log(this.user);
                        this.firstName = this.user.firstName;
                        this.lastName = this.user.lastName;
                        this.username = this.user.username;
                        this.email = this.user.email;
                        this.phone = this.user.phone;
                        this.date = new Date(this.user.birthDate).toISOString().substr(0, 10);
                        this.facebook = this.user.socialMedia.facebook;
                        this.linkedin = this.user.socialMedia.linkedin;
                        this.webpage = this.user.socialMedia.webpage;
                        this.faculty = this.user.userDetails.faculty;
                        this.group = this.user.userDetails.group;
                        this.details = this.user.userDetails.details;
                        if (!this.user) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", { userId: this.user.userId })];
                    case 3:
                        response = _a.sent();
                        if (response.data) {
                            this.imgData = response.data;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        e = error_1;
                        console.error(e.message);
                        this.snackOptions.text = e.message;
                        this.snackOptions.type = SnackBarTypes.ERROR;
                        this.snackOptions.timeout = 2000;
                        this.snackbar = true;
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        e = error_2;
                        console.error(e.message);
                        this.snackOptions.text = e.message;
                        this.snackOptions.type = SnackBarTypes.ERROR;
                        this.snackOptions.timeout = 2000;
                        this.snackbar = true;
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            snackOptions: {
                text: "",
                type: SnackBarTypes.INFO,
                timeout: 2000,
                horizontal: SnackBarHorizontal.RIGHT,
                vertical: SnackBarVertical.BOTTOM
            },
            snackbar: false,
            extendedImage: "",
            extendDialog: false,
            loadingPage: false,
            show: false,
            dateMenu: false,
            universities: universities,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            username: "",
            date: new Date().toISOString().substr(0, 10),
            birthDate: {},
            facebook: "",
            linkedin: "",
            webpage: "",
            details: "",
            faculty: "",
            group: "",
            imageRules: [
                function (value) { return !value || value.size < 5000000 || 'Image size should be less than 5 MB!'; },
            ],
            characterRules: [
                function (f) {
                    if (f.length > 0)
                        return true;
                    else
                        return "Filed cannot be empty!";
                }
            ],
            phoneRules: [
                function (v) {
                    var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
                    if (v.match(phoneno))
                        return true;
                    else
                        return "Phone number is not valid";
                }
            ],
            //File upload
            file: undefined,
            encoded: false,
            base64Encode: "",
            ext: "",
            imgData: "",
            valid: true
        };
    },
    watch: {
        //FILE upload
        base64Encode: {
            immediate: true,
            handler: function (base64Encode) {
                if (base64Encode !== '' && base64Encode !== undefined) {
                    this.encoded = false;
                }
                else {
                    this.encoded = true;
                }
            }
        },
        file: {
            immediate: false,
            handler: function (newFile) {
                if (newFile !== "" && newFile !== undefined) {
                    this.ext = newFile.name.split('.')[1].toLowerCase();
                    if (newFile !== undefined) {
                        this._toBase64(newFile);
                    }
                    else {
                        this.base64Encode = '';
                    }
                }
            }
        }
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        updateSnack: function (prop) {
            console.log("got update event");
            this.snackbar = prop;
        },
        extendImage: function (image) {
            this.extendedImage = image;
            this.extendDialog = true;
        },
        _toBase64: function (file) {
            var _this = this;
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                var result = reader.result;
                if (result) {
                    var aux = result.toString().split(",");
                    _this.base64Encode = aux[1];
                }
            };
            reader.onerror = function (err) {
                console.error(err);
            };
            return true;
        },
        goToSecurity: function () {
            if (this.$route.path !== "/user/security")
                this.$router.push("/user/security");
        },
        uploadImage: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, response_1, error_3, e;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loadingPage = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/upload/file/user/avatar", {
                                    userId: this.user.userId,
                                    base64Encode: this.base64Encode
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.data) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.ui.storeDispatch("users/load", {})];
                        case 3:
                            if (!_a.sent()) return [3 /*break*/, 5];
                            this.firstName = this.user.firstName;
                            this.lastName = this.user.lastName;
                            this.username = this.user.username;
                            this.email = this.user.email;
                            this.phone = this.user.phone;
                            this.date = new Date(this.user.birthDate).toISOString().substr(0, 10);
                            this.facebook = this.user.socialMedia.facebook;
                            this.linkedin = this.user.socialMedia.linkedin;
                            this.webpage = this.user.socialMedia.webpage;
                            this.details = this.user.userDetails.details;
                            this.faculty = this.user.userDetails.faculty;
                            this.group = this.user.userDetails.group;
                            return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", { userId: this.user.userId })];
                        case 4:
                            response_1 = _a.sent();
                            if (response_1.data) {
                                this.imgData = response_1.data;
                                this.snackOptions.text = "Image update has been successful";
                                this.snackOptions.type = SnackBarTypes.SUCCESS;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_3 = _a.sent();
                            e = error_3;
                            console.error(e.message);
                            this.snackOptions.text = e.message;
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            return [3 /*break*/, 7];
                        case 7:
                            this.loadingPage = false;
                            return [2 /*return*/];
                    }
                });
            });
        },
        _verifyString: function (check) {
            for (var i = 0; i < check.length; i++) {
                if (check.charCodeAt(i) > 255) {
                    this.valid = false;
                    return false;
                }
            }
            this.valid = true;
            return true;
        },
        update: function () {
            return __awaiter(this, void 0, void 0, function () {
                var socialMedia, userDetails, newUser, changedPass, response, error_4, e;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loadingPage = true;
                            socialMedia = {
                                facebook: this.facebook,
                                linkedin: this.linkedin,
                                webpage: this.webpage
                            };
                            userDetails = {
                                faculty: this.faculty,
                                group: this.group,
                                details: this.details,
                                location: this.user.userDetails["location"]
                            };
                            changedPass = false;
                            if (this.password == "") {
                                newUser = {
                                    userId: this.user.userId,
                                    firstName: this.firstName,
                                    lastName: this.lastName,
                                    role: this.user.role,
                                    username: this.username,
                                    password: this.user.password,
                                    email: this.email,
                                    phone: this.phone,
                                    socialMedia: socialMedia,
                                    avatarUu: this.user.avatarUu,
                                    birthDate: new Date(this.date),
                                    lastLogin: this.user.lastLogin,
                                    userDetails: userDetails
                                };
                                changedPass = false;
                            }
                            else {
                                newUser = {
                                    userId: this.user.userId,
                                    firstName: this.firstName,
                                    lastName: this.lastName,
                                    role: this.user.role,
                                    username: this.username,
                                    password: this.password,
                                    email: this.email,
                                    phone: this.phone,
                                    socialMedia: socialMedia,
                                    avatarUu: this.user.avatarUu,
                                    birthDate: new Date(this.date),
                                    lastLogin: this.user.lastLogin,
                                    userDetails: userDetails
                                };
                                changedPass = true;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/users/user/update", {
                                    newUser: newUser,
                                    changedPass: changedPass
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.data) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.storeDispatch("users/load", {})];
                        case 3:
                            if (_a.sent()) {
                                this.firstName = this.user.firstName;
                                this.lastName = this.user.lastName;
                                this.username = this.user.username;
                                this.email = this.user.email;
                                this.phone = this.user.phone;
                                this.date = new Date(this.user.birthDate).toISOString().substr(0, 10);
                                this.facebook = this.user.socialMedia.facebook;
                                this.linkedin = this.user.socialMedia.linkedin;
                                this.webpage = this.user.socialMedia.webpage;
                                this.details = this.user.userDetails.details;
                                this.faculty = this.user.userDetails.faculty;
                                this.group = this.user.userDetails.group;
                                this.snackOptions.text = "Account update has been successful";
                                this.snackOptions.type = SnackBarTypes.SUCCESS;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            this.snackOptions.text = "An unexpected error occured. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_4 = _a.sent();
                            e = error_4;
                            console.error(e.message);
                            this.snackOptions.text = e.message;
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            return [3 /*break*/, 7];
                        case 7:
                            this.loadingPage = false;
                            return [2 /*return*/];
                    }
                });
            });
        },
    }
});

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      !_vm.loadingPage
        ? _c(
            "v-container",
            [
              _c(
                "v-form",
                {
                  attrs: { "lazy-validation": "" },
                  model: {
                    value: _vm.valid,
                    callback: function($$v) {
                      _vm.valid = $$v;
                    },
                    expression: "valid"
                  }
                },
                [
                  _c(
                    "v-card",
                    {
                      staticStyle: { margin: "auto", "padding-top": "20px" },
                      attrs: { flat: "", "max-width": "900", color: "#fcfcfc" }
                    },
                    [
                      _c(
                        "v-card-title",
                        { staticClass: "justify-center" },
                        [
                          _c(
                            "v-list-item-avatar",
                            { attrs: { size: "60" } },
                            [
                              _vm.imgData && _vm.imgData !== ""
                                ? _c("v-img", {
                                    staticClass: "zoom",
                                    attrs: { src: _vm.imgData },
                                    on: {
                                      click: function($event) {
                                        return _vm.extendImage(_vm.imgData)
                                      }
                                    }
                                  })
                                : _c("v-icon", [
                                    _vm._v("mdi-account-circle mdi-48px")
                                  ])
                            ],
                            1
                          ),
                          _vm._v(
                            "\n\t\t\t\t\t\t" +
                              _vm._s(_vm.user.firstName) +
                              " " +
                              _vm._s(_vm.user.lastName) +
                              "\n\t\t\t\t\t"
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("v-divider"),
                      _vm._v(" "),
                      _c(
                        "v-card-text",
                        [
                          _c(
                            "v-row",
                            { attrs: { justify: "center" } },
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-file-input", {
                                    attrs: {
                                      type: "file",
                                      "prepend-icon": "mdi-camera",
                                      rules: _vm.imageRules,
                                      filled: "",
                                      "auto-grow": "",
                                      accept: "image/*",
                                      label: "Profile Photo",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.file,
                                      callback: function($$v) {
                                        _vm.file = $$v;
                                      },
                                      expression: "file"
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: {
                                        rounded: "",
                                        color: "primary",
                                        justify: "center"
                                      },
                                      on: {
                                        click: function($event) {
                                          return _vm.uploadImage()
                                        }
                                      }
                                    },
                                    [_vm._v("Upload")]
                                  )
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
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      rules: _vm.characterRules,
                                      label: "First Name",
                                      placeholder: _vm.user.firstName,
                                      color: "primary",
                                      "prepend-icon":
                                        "mdi-account-badge-outline"
                                    },
                                    model: {
                                      value: _vm.firstName,
                                      callback: function($$v) {
                                        _vm.firstName = $$v;
                                      },
                                      expression: "firstName"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      rules: _vm.characterRules,
                                      label: "Last Name",
                                      placeholder: _vm.user.lastName,
                                      color: "primary",
                                      "prepend-icon": "mdi-account-badge"
                                    },
                                    model: {
                                      value: _vm.lastName,
                                      callback: function($$v) {
                                        _vm.lastName = $$v;
                                      },
                                      expression: "lastName"
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
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "Phone",
                                      placeholder: _vm.user.phone,
                                      rules: _vm.phoneRules,
                                      color: "primary",
                                      "prepend-icon": "mdi-phone"
                                    },
                                    model: {
                                      value: _vm.phone,
                                      callback: function($$v) {
                                        _vm.phone = $$v;
                                      },
                                      expression: "phone"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c(
                                    "v-btn",
                                    {
                                      attrs: { color: "primary", rounded: "" },
                                      on: {
                                        click: function($event) {
                                          return _vm.goToSecurity()
                                        }
                                      }
                                    },
                                    [
                                      _c("v-icon", [
                                        _vm._v(
                                          "\n\t\t\t\t\t\t\t\t\t\tmdi-cog\n\t\t\t\t\t\t\t\t\t"
                                        )
                                      ]),
                                      _vm._v(
                                        "\n \t\t\t\t\t\t\t\t\tChange Security Settings\n\t\t\t\t\t\t\t\t"
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
                            "v-row",
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c(
                                    "v-menu",
                                    {
                                      ref: "dateMenu",
                                      attrs: {
                                        "close-on-content-click": false,
                                        "return-value": _vm.date,
                                        transition: "scale-transition",
                                        "offset-y": "",
                                        "min-width": "auto"
                                      },
                                      on: {
                                        "update:returnValue": function($event) {
                                          _vm.date = $event;
                                        },
                                        "update:return-value": function(
                                          $event
                                        ) {
                                          _vm.date = $event;
                                        }
                                      },
                                      scopedSlots: _vm._u(
                                        [
                                          {
                                            key: "activator",
                                            fn: function(ref) {
                                              var on = ref.on;
                                              return [
                                                _c(
                                                  "v-text-field",
                                                  _vm._g(
                                                    {
                                                      attrs: {
                                                        label: "Birthdate",
                                                        "persistent-hint": "",
                                                        "prepend-icon":
                                                          "mdi-calendar"
                                                      },
                                                      model: {
                                                        value: _vm.date,
                                                        callback: function(
                                                          $$v
                                                        ) {
                                                          _vm.date = $$v;
                                                        },
                                                        expression: "date"
                                                      }
                                                    },
                                                    on
                                                  )
                                                )
                                              ]
                                            }
                                          }
                                        ],
                                        null,
                                        false,
                                        2271028494
                                      ),
                                      model: {
                                        value: _vm.dateMenu,
                                        callback: function($$v) {
                                          _vm.dateMenu = $$v;
                                        },
                                        expression: "dateMenu"
                                      }
                                    },
                                    [
                                      _vm._v(" "),
                                      _c(
                                        "v-date-picker",
                                        {
                                          attrs: { "no-title": "" },
                                          model: {
                                            value: _vm.date,
                                            callback: function($$v) {
                                              _vm.date = $$v;
                                            },
                                            expression: "date"
                                          }
                                        },
                                        [
                                          _c("v-spacer"),
                                          _vm._v(" "),
                                          _c(
                                            "v-btn",
                                            {
                                              attrs: {
                                                text: "",
                                                color: "primary"
                                              },
                                              on: {
                                                click: function($event) {
                                                  _vm.dateMenu = false;
                                                }
                                              }
                                            },
                                            [_vm._v("Cancel")]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "v-btn",
                                            {
                                              attrs: {
                                                text: "",
                                                color: "primary"
                                              },
                                              on: {
                                                click: function($event) {
                                                  return _vm.$refs.dateMenu.save(
                                                    _vm.date
                                                  )
                                                }
                                              }
                                            },
                                            [_vm._v("OK")]
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
                                "v-col",
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "User Details",
                                      optional: "",
                                      "prepend-icon": "mdi-information-outline",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.details,
                                      callback: function($$v) {
                                        _vm.details = $$v;
                                      },
                                      expression: "details"
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
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-select", {
                                    attrs: {
                                      items: _vm.universities,
                                      label: "Faculty",
                                      optional: "",
                                      "prepend-icon": "mdi-school",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.faculty,
                                      callback: function($$v) {
                                        _vm.faculty = $$v;
                                      },
                                      expression: "faculty"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "6", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "Group",
                                      optional: "",
                                      "prepend-icon": "mdi-group",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.group,
                                      callback: function($$v) {
                                        _vm.group = $$v;
                                      },
                                      expression: "group"
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
                            { attrs: { justify: "space-around" } },
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "4" } },
                                [
                                  _c("v-text-field", {
                                    staticStyle: { width: "250px" },
                                    attrs: {
                                      label: "Webpage Link",
                                      optional: "",
                                      "prepend-icon": "mdi-web",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.webpage,
                                      callback: function($$v) {
                                        _vm.webpage = $$v;
                                      },
                                      expression: "webpage"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "4" } },
                                [
                                  _c("v-text-field", {
                                    staticStyle: { width: "250px" },
                                    attrs: {
                                      label: "Facebook Link",
                                      optional: "",
                                      "prepend-icon": "mdi-facebook-box",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.facebook,
                                      callback: function($$v) {
                                        _vm.facebook = $$v;
                                      },
                                      expression: "facebook"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "4" } },
                                [
                                  _c("v-text-field", {
                                    staticStyle: { width: "250px" },
                                    attrs: {
                                      label: "Linkedin Link",
                                      optional: "",
                                      "prepend-icon": "mdi-linkedin-box",
                                      color: "primary"
                                    },
                                    model: {
                                      value: _vm.linkedin,
                                      callback: function($$v) {
                                        _vm.linkedin = $$v;
                                      },
                                      expression: "linkedin"
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
                                disabled: !_vm.valid,
                                rounded: "",
                                color: "primary",
                                justify: "center"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.update()
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
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-dialog",
                {
                  attrs: { "max-width": "450" },
                  model: {
                    value: _vm.extendDialog,
                    callback: function($$v) {
                      _vm.extendDialog = $$v;
                    },
                    expression: "extendDialog"
                  }
                },
                [
                  _c(
                    "v-card",
                    { attrs: { flat: "", "max-width": "450" } },
                    [
                      _vm.extendedImage
                        ? _c("v-img", { attrs: { src: _vm.extendedImage } })
                        : _vm._e(),
                      _vm._v(" "),
                      _c(
                        "v-card-actions",
                        { staticClass: "justify-center" },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { text: "", color: "primary" },
                              on: {
                                click: function($event) {
                                  _vm.extendDialog = false;
                                }
                              }
                            },
                            [_vm._v("Exit")]
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
          ),
      _vm._v(" "),
      _c("SnackBar", {
        attrs: { options: _vm.snackOptions, snackbar: _vm.snackbar },
        on: { "update-snackbar": _vm.updateSnack }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-9560c80c_0", { source: ".zoom {\n  transition: transform 0.2s;\n  /* Animation */\n}\n.zoom:hover {\n  transform: scale(1.2);\n}\n", map: {"version":3,"sources":["EditAccount.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B,cAAc;AAChB;AACA;EACE,qBAAqB;AACvB","file":"EditAccount.vue","sourcesContent":[".zoom {\n  transition: transform 0.2s;\n  /* Animation */\n}\n.zoom:hover {\n  transform: scale(1.2);\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$3 = Vue.extend({
    name: "EditSecuritySettings",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1, e, error_2, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.ui.storeDispatch("users/load", {})];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        if (!this.user) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        this.firstName = this.user.firstName;
                        this.lastName = this.user.lastName;
                        this.username = this.user.username;
                        this.email = this.user.email;
                        this.phone = this.user.phone;
                        this.date = new Date(this.user.birthDate)
                            .toISOString()
                            .substr(0, 10);
                        this.facebook = this
                            .user.socialMedia.facebook;
                        this.linkedin = this
                            .user.socialMedia.linkedin;
                        this.webpage = this.user.socialMedia.webpage;
                        this.faculty = this.user.userDetails.faculty;
                        this.group = this.user.userDetails.group;
                        this.details = this.user.userDetails.details;
                        return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/get/file/user/avatar", { userId: this.user.userId })];
                    case 3:
                        response = _a.sent();
                        if (response.data) {
                            this.imgData = response.data;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        e = error_1;
                        console.error(e.message);
                        this.snackOptions.text = e.message;
                        this.snackOptions.type = SnackBarTypes.ERROR;
                        this.snackOptions.timeout = 2000;
                        this.snackbar = true;
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        e = error_2;
                        console.error(e.message);
                        this.snackOptions.text = e.message;
                        this.snackOptions.type = SnackBarTypes.ERROR;
                        this.snackOptions.timeout = 2000;
                        this.snackbar = true;
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            snackOptions: {
                text: "",
                type: SnackBarTypes.INFO,
                timeout: 2000,
                horizontal: SnackBarHorizontal.RIGHT,
                vertical: SnackBarVertical.BOTTOM
            },
            snackbar: false,
            extendDialog: false,
            loadingPage: false,
            showNew: false,
            showConfirm: false,
            valid: true,
            imgData: null,
            extendedImage: "",
            universities: universities,
            firstName: "",
            lastName: "",
            email: "",
            passwordNew: "",
            passwordConfirm: "",
            phone: "",
            username: "",
            date: new Date().toISOString().substr(0, 10),
            birthDate: {},
            facebook: "",
            linkedin: "",
            webpage: "",
            details: "",
            faculty: "",
            group: "",
            characterRules: [
                function (f) {
                    for (var i = 0; i < f.length; i++) {
                        if (f.charCodeAt(i) > 127) {
                            return "Field must not contain unicode characters!";
                        }
                    }
                    return true;
                },
                function (f) {
                    if (f.length > 0)
                        return true;
                    else
                        return "Filed cannot be empty!";
                }
            ],
            passwordRules: [
                function (p) {
                    if (p !== "" && p.length < 8)
                        return "Password must be at least 8 characters long!";
                    else
                        return true;
                },
                function (f) {
                    for (var i = 0; i < f.length; i++) {
                        if (f.charCodeAt(i) > 127) {
                            return "Field must not contain unicode characters!";
                        }
                    }
                    return true;
                }
            ],
            emailRules: [
                function (e) {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e))
                        return true;
                    else
                        return "You have entered an invalid email address!";
                },
                function (f) {
                    if (f.length > 0)
                        return true;
                    else
                        return "Filed cannot be empty!";
                }
            ]
        };
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        back: function () {
            if (this.$route.path !== "/user/account") {
                this.$router.push("/user/account");
            }
        },
        updateSnack: function (prop) {
            console.log("got update event");
            this.snackbar = prop;
        },
        extendImage: function (image) {
            this.extendedImage = image;
            this.extendDialog = true;
        },
        update: function () {
            return __awaiter(this, void 0, void 0, function () {
                var socialMedia, userDetails, newUser, changedPass, response, error_3, e;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.loadingPage = true;
                            socialMedia = {
                                facebook: this.facebook,
                                linkedin: this.linkedin,
                                webpage: this.webpage
                            };
                            userDetails = {
                                faculty: this.faculty,
                                group: this.group,
                                details: this.details,
                                location: this.user.userDetails["location"]
                            };
                            changedPass = false;
                            if (this.passwordNew == "") {
                                newUser = {
                                    userId: this.user.userId,
                                    firstName: this.firstName,
                                    lastName: this.lastName,
                                    role: this.user.role,
                                    username: this.username,
                                    password: this.user.password,
                                    email: this.email,
                                    phone: this.phone,
                                    socialMedia: socialMedia,
                                    avatarUu: this.user.avatarUu,
                                    birthDate: new Date(this.date),
                                    lastLogin: this.user.lastLogin,
                                    userDetails: userDetails
                                };
                                changedPass = false;
                            }
                            else {
                                newUser = {
                                    userId: this.user.userId,
                                    firstName: this.firstName,
                                    lastName: this.lastName,
                                    role: this.user.role,
                                    username: this.username,
                                    password: this.passwordNew,
                                    email: this.email,
                                    phone: this.phone,
                                    socialMedia: socialMedia,
                                    avatarUu: this.user.avatarUu,
                                    birthDate: new Date(this.date),
                                    lastLogin: this.user.lastLogin,
                                    userDetails: userDetails
                                };
                                changedPass = true;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/users/user/update", {
                                    newUser: newUser,
                                    changedPass: changedPass
                                })];
                        case 2:
                            response = _a.sent();
                            if (!response.data) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.storeDispatch("users/load", {})];
                        case 3:
                            if (_a.sent()) {
                                this.firstName = this.user.firstName;
                                this.lastName = this.user.lastName;
                                this.username = this.user.username;
                                this.email = this.user.email;
                                this.phone = this.user.phone;
                                this.date = new Date(this.user.birthDate)
                                    .toISOString()
                                    .substr(0, 10);
                                this.facebook = this.user.socialMedia.facebook;
                                this.linkedin = this.user.socialMedia.linkedin;
                                this.webpage = this.user.socialMedia.webpage;
                                this.details = this.user.userDetails.details;
                                this.faculty = this.user.userDetails.faculty;
                                this.group = this.user.userDetails.group;
                                this.snackOptions.text = "Update has been successful!";
                                this.snackOptions.type = SnackBarTypes.SUCCESS;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            return [3 /*break*/, 5];
                        case 4:
                            this.snackOptions.text = "An unexpected error occured. If the error persists, please contact technical support: teams@tech-lounge.ro.";
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            error_3 = _a.sent();
                            e = error_3;
                            console.error(e.message);
                            this.snackOptions.text = e.message;
                            this.snackOptions.type = SnackBarTypes.ERROR;
                            this.snackOptions.timeout = 2000;
                            this.snackbar = true;
                            return [3 /*break*/, 7];
                        case 7:
                            this.loadingPage = false;
                            return [2 /*return*/];
                    }
                });
            });
        }
    }
});

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      !_vm.loadingPage
        ? _c(
            "v-container",
            [
              _c(
                "v-form",
                {
                  attrs: { "lazy-validation": "" },
                  model: {
                    value: _vm.valid,
                    callback: function($$v) {
                      _vm.valid = $$v;
                    },
                    expression: "valid"
                  }
                },
                [
                  _c(
                    "v-card",
                    {
                      staticStyle: { margin: "auto", "padding-top": "20px" },
                      attrs: { flat: "", "max-width": "900", color: "#fcfcfc" }
                    },
                    [
                      _c(
                        "v-card-title",
                        { staticClass: "justify-center" },
                        [
                          _c(
                            "v-list-item-avatar",
                            { attrs: { size: "60" } },
                            [
                              _c("v-hover", {
                                scopedSlots: _vm._u(
                                  [
                                    {
                                      key: "default",
                                      fn: function(ref) {
                                        var hover = ref.hover;
                                        return [
                                          _vm.imgData && _vm.imgData !== ""
                                            ? _c("v-img", {
                                                attrs: {
                                                  elevation: hover ? 16 : 0,
                                                  src: _vm.imgData
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.extendImage(
                                                      _vm.imgData
                                                    )
                                                  }
                                                }
                                              })
                                            : _c("v-icon", [
                                                _vm._v(
                                                  "mdi-account-circle mdi-48px"
                                                )
                                              ])
                                        ]
                                      }
                                    }
                                  ],
                                  null,
                                  false,
                                  74143598
                                )
                              })
                            ],
                            1
                          ),
                          _vm._v(
                            "\n\t\t\t\t\t" +
                              _vm._s(_vm.user.firstName) +
                              " " +
                              _vm._s(_vm.user.lastName) +
                              "\n\t\t\t\t"
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("v-list-item-subtitle", [
                        _vm._v("\n\t\t\t\t\tSecurity Settings\n\t\t\t\t")
                      ]),
                      _vm._v(" "),
                      _c("v-divider"),
                      _vm._v(" "),
                      _c(
                        "v-card-text",
                        [
                          _c(
                            "v-row",
                            { attrs: { justify: "space-around" } },
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "4", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "Username",
                                      placeholder: _vm.user.username,
                                      rules: _vm.characterRules,
                                      color: "primary",
                                      "prepend-icon": "mdi-account-convert"
                                    },
                                    model: {
                                      value: _vm.username,
                                      callback: function($$v) {
                                        _vm.username = $$v;
                                      },
                                      expression: "username"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "4", aling: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      label: "Email",
                                      placeholder: _vm.user.email,
                                      rules: _vm.emailRules,
                                      color: "primary",
                                      "prepend-icon": "mdi-email"
                                    },
                                    model: {
                                      value: _vm.email,
                                      callback: function($$v) {
                                        _vm.email = $$v;
                                      },
                                      expression: "email"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                { attrs: { cols: "4", align: "center" } },
                                [
                                  _c("v-text-field", {
                                    attrs: {
                                      "prepend-icon": _vm.showNew
                                        ? "mdi-eye"
                                        : "mdi-eye-off",
                                      rules: _vm.passwordRules,
                                      type: _vm.showNew ? "text" : "password",
                                      label: "New Password",
                                      color: "primary"
                                    },
                                    on: {
                                      "click:prepend": function($event) {
                                        _vm.showNew = !_vm.showNew;
                                      }
                                    },
                                    model: {
                                      value: _vm.passwordNew,
                                      callback: function($$v) {
                                        _vm.passwordNew = $$v;
                                      },
                                      expression: "passwordNew"
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
                      ),
                      _vm._v(" "),
                      _c(
                        "v-card-actions",
                        { staticClass: "justify-center" },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { color: "secondary" },
                              on: {
                                click: function($event) {
                                  return _vm.back()
                                }
                              }
                            },
                            [_vm._v("\n\t\t\t\t\t\tBack\n\t\t\t\t\t")]
                          ),
                          _vm._v(" "),
                          _c("v-spacer"),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: !_vm.valid,
                                rounded: "",
                                color: "primary",
                                justify: "center"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.update()
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
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-dialog",
                {
                  attrs: { "max-width": "450" },
                  model: {
                    value: _vm.extendDialog,
                    callback: function($$v) {
                      _vm.extendDialog = $$v;
                    },
                    expression: "extendDialog"
                  }
                },
                [
                  _c(
                    "v-card",
                    { attrs: { flat: "", "max-width": "450" } },
                    [
                      _vm.extendedImage
                        ? _c("v-img", { attrs: { src: _vm.extendedImage } })
                        : _vm._e(),
                      _vm._v(" "),
                      _c(
                        "v-card-actions",
                        { staticClass: "justify-center" },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { text: "", color: "primary" },
                              on: {
                                click: function($event) {
                                  _vm.extendDialog = false;
                                }
                              }
                            },
                            [_vm._v("Exit")]
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
          ),
      _vm._v(" "),
      _c("SnackBar", {
        attrs: { options: _vm.snackOptions, snackbar: _vm.snackbar },
        on: { "update-snackbar": _vm.updateSnack }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$3 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    undefined,
    undefined,
    undefined
  );

var e_1, _a;
var workspaceUi = WorkspaceUI.getInstance();
workspaceUi.registerToolbarButton(__vue_component__$1, {
    position: ToolbarButtonPosition.RIGHT,
    priority: 3
});
var workspaceRoutes = [
    {
        path: "/user/security",
        name: "Edit Security Settings",
        component: __vue_component__$3
    },
    {
        path: "/user/account",
        name: "Edit Account",
        component: __vue_component__$2
    },
];
try {
    for (var workspaceRoutes_1 = __values(workspaceRoutes), workspaceRoutes_1_1 = workspaceRoutes_1.next(); !workspaceRoutes_1_1.done; workspaceRoutes_1_1 = workspaceRoutes_1.next()) {
        var route_1 = workspaceRoutes_1_1.value;
        workspaceUi.registerWorkspaceRoutes(route_1);
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (workspaceRoutes_1_1 && !workspaceRoutes_1_1.done && (_a = workspaceRoutes_1.return)) _a.call(workspaceRoutes_1);
    }
    finally { if (e_1) throw e_1.error; }
}
var ui = UI$1.getInstance();
var route = {
    path: '/login',
    name: "Login",
    component: __vue_component__
};
var redirect = {
    path: "/",
    redirect: "/login",
    beforeEnter: function (to, from, next) {
        window.location.href = to.fullPath.substring(1);
    }
};
ui.registerRoute(route);
ui.registerRoute(redirect);
ui.registerStore("users", usersStore());

export { UsersUi, getUsersUi, universities };
