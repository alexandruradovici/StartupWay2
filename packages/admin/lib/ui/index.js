import { UI as UI$1 } from '@startupway/main/lib/ui';
import { WorkspaceUI, ToolbarButtonPosition } from '@startupway/workspace/lib/ui';
import { mapGetters } from 'vuex';
import Vue from 'vue';
import _ from 'lodash';
import { SnackBarTypes } from '@startupway/menu/lib/ui';
import moment from 'moment';
import { BusinessTrack, TeamType, WorkshopDay } from '@startupway/teams/lib/ui';

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

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var AdminUi = /** @class */ (function () {
    function AdminUi() {
    }
    return AdminUi;
}());
var UI = new AdminUi();
function getAdminUi() {
    return UI;
}

var script = Vue.extend({
    name: "Admin",
    data: function () {
        return {
            ui: UI$1.getInstance(),
            allUsers: [],
            teams: [],
            viewTeams: [],
            loadingPage: false,
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newUser) return [3 /*break*/, 4];
                                if (!(newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teams/" + newUser.userId)];
                            case 2:
                                response = _a.sent();
                                if (response) {
                                    this.teams = response.data;
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.error(e_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        teams: {
            immediate: true,
            handler: function (newTeams) {
                var _this = this;
                newTeams.forEach(function (team) {
                    _this.viewTeams.push({
                        name: team.teamName,
                        value: team.teamId
                    });
                });
            }
        }
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        modifyUsers: function (users) {
            // users.forEach(element => {
            // 	if (element.role) {
            // 		// as any to replace role: {"Role_name":true} with "Role_name"
            // 		const roleObj = element.role;
            // 		for (const prop in roleObj) {
            // 			if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
            // 				(element.role as any) = prop;
            // 			}
            // 		}
            // 	}
            // });
            return users;
        },
        getAllUsers: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/users/users/all")];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                this.allUsers = this.modifyUsers(response.data);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _a.sent();
                            console.error(e_2);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/, true];
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
      _c(
        "v-navigation-drawer",
        {
          staticStyle: { "border-left": "#ffb100 solid 10px" },
          attrs: { app: "", clipped: "", permanent: "" }
        },
        [
          _c(
            "v-list",
            [
              _c(
                "v-list-item",
                { attrs: { "two-line": "" } },
                [
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-list-item-title", [_vm._v("Admin Panel")]),
                      _vm._v(" "),
                      _c("v-list-item-subtitle", [
                        _vm._v("Innovation Labs 2021")
                      ])
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("v-divider"),
              _vm._v(" "),
              _c(
                "v-list-item",
                {
                  staticClass: "menu-item",
                  attrs: { link: "", to: "/admin/users" }
                },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _c("v-icon", { attrs: { color: "primary" } }, [
                        _vm._v("mdi-account-multiple")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [_c("v-list-item-title", [_vm._v("Users")])],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-list-item",
                {
                  staticClass: "menu-item",
                  attrs: { link: "", to: "/admin/teams" }
                },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _c("v-icon", { attrs: { color: "primary" } }, [
                        _vm._v("mdi-account-group")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [_c("v-list-item-title", [_vm._v("Teams")])],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-list-item",
                {
                  staticClass: "menu-item",
                  attrs: { link: "", to: "/admin/workshops" }
                },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _c("v-icon", { attrs: { color: "primary" } }, [
                        _vm._v("mdi-domain")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [_c("v-list-item-title", [_vm._v("Workshops")])],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-list-item",
                {
                  staticClass: "menu-item",
                  attrs: { link: "", to: "/admin/csv" }
                },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _c("v-icon", { attrs: { color: "primary" } }, [
                        _vm._v("mdi-file-import-outline")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [_c("v-list-item-title", [_vm._v("Import CSV")])],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-list-item",
                {
                  staticClass: "menu-item",
                  attrs: { link: "", to: "/admin/exports" }
                },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _c("v-icon", { attrs: { color: "primary" } }, [
                        _vm._v("mdi-file-export-outline")
                      ])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [_c("v-list-item-title", [_vm._v("Exports")])],
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
      _c(
        "v-container",
        [
          !_vm.loadingPage
            ? _c(
                "transition",
                { attrs: { fluid: "", "pa-0": "" } },
                [_c("router-view")],
                1
              )
            : _vm._e()
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
    name: "UsersEdit",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAllUsers()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            allUsers: [],
            search: "",
            dialog: false,
            show: false,
            dateMenu: false,
            showPass: false,
            roles: [
                "CEO",
                "CTO",
                "CFO",
                "Team Lead",
                "Marketing Specialist",
                "Software Specialist",
                "Hardware Specialist",
                "Other"
            ],
            headers: [
                {
                    text: "Role",
                    align: "left",
                    sortable: false,
                    value: "role"
                },
                { text: "First Name", value: "firstName" },
                { text: "Last Name", value: "lastName" },
                { text: "Email", value: "email" },
                { text: "Actions", value: "action", sortable: false },
                { text: "Last Login", value: "lastLogin", sortable: false },
            ],
            item: {
                userId: "",
                userProductId: "",
                teamId: "",
                firstName: "",
                lastName: "",
                password: "",
                newPassword: "",
                username: "",
                email: "",
                phone: "",
                socialMedia: {},
                birthDate: new Date(),
                userDetails: {},
                role: "",
                avatarUu: "",
                lastLogin: new Date()
            },
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            username: "",
            date: new Date(),
            birthDate: {},
            facebookLink: "",
            linkedinLink: "",
            webpageLink: "",
            details: ""
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/];
                    });
                });
            }
        }
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        formatDate: function (date) {
            var time = (new Date(date)).toTimeString().split(" ");
            return (new Date(date)).toDateString() + " " + time[0];
        },
        modifyUsers: function (users) {
            return __awaiter(this, void 0, void 0, function () {
                var users_1, users_1_1, user;
                var e_2, _a;
                return __generator(this, function (_b) {
                    try {
                        for (users_1 = __values(users), users_1_1 = users_1.next(); !users_1_1.done; users_1_1 = users_1.next()) {
                            user = users_1_1.value;
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
                            // const session = await this.ui.application.api.get("/api/v1/lastLogin/" + user.userId);
                            // if(session) {
                            // 	user.createdAt = this.formatDate(session.data.lastLogin);
                            // }
                            // if(user.avatarUu !== "" && user.avatarUu !== undefined && user.avatarUu !== null){
                            // 	user.image = await this.getUserImage(user.avatarUu, user.UserTeams_userId);
                            // } else {
                            // 	user.image = ""
                            // }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (users_1_1 && !users_1_1.done && (_a = users_1.return)) _a.call(users_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return [2 /*return*/, users];
                });
            });
        },
        getAllUsers: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, e_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/users/users")];
                        case 1:
                            response = _b.sent();
                            if (!(response.status === 200)) return [3 /*break*/, 3];
                            _a = this;
                            return [4 /*yield*/, this.modifyUsers(response.data)];
                        case 2:
                            _a.allUsers = _b.sent();
                            // this.allUsers = this.allUsers.filter((user:User) => { return !this.hasUser(user)});
                            return [2 /*return*/, true];
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            e_3 = _b.sent();
                            console.error(e_3);
                            return [2 /*return*/, false];
                        case 5: return [2 /*return*/, false];
                    }
                });
            });
        },
        addUser: function () {
            return __awaiter(this, void 0, void 0, function () {
                var user, e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = {
                                firstName: this.item.firstName,
                                lastName: this.item.lastName,
                                username: this.item.username,
                                email: this.item.email,
                                phone: this.item.phone,
                                socialMedia: this.item.socialMedia,
                                birthDate: this.item.birthDate,
                                userDetails: this.item.userDetails,
                                role: ""
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/admin/add/user", { user: user })];
                        case 2:
                            _a.sent();
                            this.dialog = false;
                            this.$forceUpdate();
                            return [3 /*break*/, 4];
                        case 3:
                            e_4 = _a.sent();
                            console.error(e_4);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        openDialog: function (user) {
            this.item = user;
            this.item.newPassword = "";
            this.dialog = true;
        },
        editUser: function () {
            return __awaiter(this, void 0, void 0, function () {
                var newUser, bolean, response, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newUser = {};
                            bolean = false;
                            if (this.item.newPassword != "") {
                                newUser = {
                                    userId: this.item.userId,
                                    firstName: this.item.firstName,
                                    lastName: this.item.lastName,
                                    password: this.item.newPassword,
                                    username: this.item.username,
                                    email: this.item.email,
                                    phone: this.item.phone,
                                    socialMedia: this.item.socialMedia,
                                    birthDate: this.item.birthDate,
                                    userDetails: this.item.userDetails,
                                    role: this.item.role,
                                    avatarUu: this.item.avatarUu,
                                    lastLogin: this.item.lastLogin
                                };
                                // bolean = true;
                            }
                            else {
                                newUser = {
                                    userId: this.item.userId,
                                    firstName: this.item.firstName,
                                    lastName: this.item.lastName,
                                    password: this.item.password,
                                    username: this.item.username,
                                    email: this.item.email,
                                    phone: this.item.phone,
                                    socialMedia: this.item.socialMedia,
                                    birthDate: this.item.birthDate,
                                    userDetails: this.item.userDetails,
                                    role: this.item.role,
                                    avatarUu: this.item.avatarUu,
                                    lastLogin: this.item.lastLogin
                                };
                                bolean = false;
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/user/update", {
                                    newUser: newUser,
                                    changedPass: bolean
                                })];
                        case 2:
                            response = _a.sent();
                            if (response) {
                                this.item = {
                                    userId: "",
                                    userProductId: "",
                                    teamId: "",
                                    firstName: "",
                                    lastName: "",
                                    password: "",
                                    username: "",
                                    email: "",
                                    phone: "",
                                    socialMedia: {},
                                    birthDate: new Date(),
                                    userDetails: {},
                                    role: "",
                                    avatarUu: "",
                                    lastLogin: new Date()
                                };
                            }
                            this.dialog = false;
                            this.$forceUpdate();
                            return [3 /*break*/, 4];
                        case 3:
                            e_5 = _a.sent();
                            console.error(e_5);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        exitDialog: function () {
            this.item = {
                userId: "",
                userProductId: "",
                teamId: "",
                firstName: "",
                lastName: "",
                password: "",
                username: "",
                email: "",
                phone: "",
                socialMedia: {},
                birthDate: new Date(),
                userDetails: {},
                role: "",
                avatarUu: "",
                lastLogin: new Date()
            };
            this.dialog = false;
        }
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
    [
      _c(
        "v-container",
        [
          _c(
            "v-card",
            {
              staticStyle: {
                "margin-left": "auto",
                "margin-right": "auto",
                "padding-top": "20px",
                "background-color": "#fcfcfc"
              },
              attrs: { flat: "" }
            },
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
                [_vm._v("\n\t\t\t\tManage Users\n\t\t\t")]
              ),
              _vm._v(" "),
              _c("v-divider"),
              _vm._v(" "),
              _c(
                "v-card-text",
                [
                  _c(
                    "v-row",
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "11", align: "center" } },
                        [
                          _c("v-text-field", {
                            staticStyle: { flex: "0 1 auto" },
                            attrs: {
                              "append-icon": "mdi-magnify",
                              label: "Search",
                              "single-line": "",
                              "hide-details": ""
                            },
                            model: {
                              value: _vm.search,
                              callback: function($$v) {
                                _vm.search = $$v;
                              },
                              expression: "search"
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        { attrs: { cols: "1" } },
                        [
                          _c(
                            "v-tooltip",
                            {
                              attrs: { top: "" },
                              scopedSlots: _vm._u([
                                {
                                  key: "activator",
                                  fn: function(ref) {
                                    var on = ref.on;
                                    return [
                                      _c(
                                        "v-btn",
                                        _vm._g(
                                          {
                                            attrs: { icon: "" },
                                            on: {
                                              click: function($event) {
                                                return _vm.openDialog(_vm.item)
                                              }
                                            }
                                          },
                                          on
                                        ),
                                        [
                                          _c(
                                            "v-icon",
                                            {
                                              attrs: {
                                                large: "",
                                                color: "primary"
                                              }
                                            },
                                            [_vm._v("mdi-plus")]
                                          )
                                        ],
                                        1
                                      )
                                    ]
                                  }
                                }
                              ]),
                              model: {
                                value: _vm.show,
                                callback: function($$v) {
                                  _vm.show = $$v;
                                },
                                expression: "show"
                              }
                            },
                            [_vm._v(" "), _c("span", [_vm._v("Add new user")])]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-data-table", {
                    attrs: {
                      "item-key": "email",
                      headers: _vm.headers,
                      items: _vm.allUsers,
                      search: _vm.search,
                      loading: _vm.allUsers.length <= 0,
                      "loading-text": "Loading users"
                    },
                    scopedSlots: _vm._u([
                      {
                        key: "top",
                        fn: function() {
                          return [
                            _c(
                              "div",
                              [
                                _c(
                                  "v-dialog",
                                  {
                                    attrs: {
                                      persistent: "",
                                      "max-width": "500px"
                                    },
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
                                      [
                                        _vm.item.userId === 0
                                          ? _c(
                                              "v-card-title",
                                              {
                                                staticClass: "justify-center",
                                                staticStyle: {
                                                  "font-family":
                                                    "Georgia, serif"
                                                }
                                              },
                                              [_vm._v("Add New User")]
                                            )
                                          : _c(
                                              "v-card-title",
                                              {
                                                staticClass: "justify-center",
                                                staticStyle: {
                                                  "font-family":
                                                    "Georgia, serif"
                                                }
                                              },
                                              [_vm._v("Edit User")]
                                            ),
                                        _vm._v(" "),
                                        _c("v-divider"),
                                        _vm._v(" "),
                                        _c(
                                          "v-card-text",
                                          [
                                            _c("v-text-field", {
                                              attrs: {
                                                color: "primary",
                                                label: "First Name",
                                                "prepend-icon": "mdi-account"
                                              },
                                              model: {
                                                value: _vm.item.firstName,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.item,
                                                    "firstName",
                                                    $$v
                                                  );
                                                },
                                                expression: "item.firstName"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _c("v-text-field", {
                                              attrs: {
                                                color: "primary",
                                                label: "Last Name",
                                                "prepend-icon": "mdi-account"
                                              },
                                              model: {
                                                value: _vm.item.lastName,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.item,
                                                    "lastName",
                                                    $$v
                                                  );
                                                },
                                                expression: "item.lastName"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _c("v-text-field", {
                                              attrs: {
                                                color: "primary",
                                                label: "Email",
                                                "prepend-icon": "mdi-email"
                                              },
                                              model: {
                                                value: _vm.item.email,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.item,
                                                    "email",
                                                    $$v
                                                  );
                                                },
                                                expression: "item.email"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _c("v-text-field", {
                                              attrs: {
                                                color: "primary",
                                                label: "Phone",
                                                "prepend-icon": "mdi-phone"
                                              },
                                              model: {
                                                value: _vm.item.phone,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.item,
                                                    "phone",
                                                    $$v
                                                  );
                                                },
                                                expression: "item.phone"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _c("v-text-field", {
                                              attrs: {
                                                color: "primary",
                                                label: "Username",
                                                "prepend-icon":
                                                  "mdi-account-badge"
                                              },
                                              model: {
                                                value: _vm.item.username,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.item,
                                                    "username",
                                                    $$v
                                                  );
                                                },
                                                expression: "item.username"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _vm.item.userId !== 0
                                              ? _c(
                                                  "v-menu",
                                                  {
                                                    ref: "dateMenu",
                                                    attrs: {
                                                      "close-on-content-click": false,
                                                      "return-value": _vm.date,
                                                      transition:
                                                        "scale-transition",
                                                      "offset-y": "",
                                                      "max-width": "290px",
                                                      "min-width": "290px"
                                                    },
                                                    on: {
                                                      "update:returnValue": function(
                                                        $event
                                                      ) {
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
                                                                      label:
                                                                        "BirthDate",
                                                                      "persistent-hint":
                                                                        "",
                                                                      "prepend-icon":
                                                                        "mdi-event"
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        _vm.item
                                                                          .birthDate,
                                                                      callback: function(
                                                                        $$v
                                                                      ) {
                                                                        _vm.$set(
                                                                          _vm.item,
                                                                          "birthDate",
                                                                          $$v
                                                                        );
                                                                      },
                                                                      expression:
                                                                        "item.birthDate"
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
                                                      3374293562
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
                                                        attrs: {
                                                          "no-title": ""
                                                        },
                                                        model: {
                                                          value:
                                                            _vm.item.birthDate,
                                                          callback: function(
                                                            $$v
                                                          ) {
                                                            _vm.$set(
                                                              _vm.item,
                                                              "birthDate",
                                                              $$v
                                                            );
                                                          },
                                                          expression:
                                                            "item.birthDate"
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
                                                              click: function(
                                                                $event
                                                              ) {
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
                                                              click: function(
                                                                $event
                                                              ) {
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
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _vm.item.userId !== 0
                                              ? _c("v-text-field", {
                                                  attrs: {
                                                    label: "Facebook Link",
                                                    optional: "",
                                                    color: "primary",
                                                    "prepend-icon":
                                                      "mdi-facebook"
                                                  },
                                                  model: {
                                                    value:
                                                      _vm.item.socialMedia
                                                        .facebook,
                                                    callback: function($$v) {
                                                      _vm.$set(
                                                        _vm.item.socialMedia,
                                                        "facebook",
                                                        $$v
                                                      );
                                                    },
                                                    expression:
                                                      "item.socialMedia.facebook"
                                                  }
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _vm.item.userId !== 0
                                              ? _c("v-text-field", {
                                                  attrs: {
                                                    label: "Linkedin Link",
                                                    optional: "",
                                                    color: "primary",
                                                    "prepend-icon":
                                                      "mdi-linkedin"
                                                  },
                                                  model: {
                                                    value:
                                                      _vm.item.socialMedia
                                                        .linkedin,
                                                    callback: function($$v) {
                                                      _vm.$set(
                                                        _vm.item.socialMedia,
                                                        "linkedin",
                                                        $$v
                                                      );
                                                    },
                                                    expression:
                                                      "item.socialMedia.linkedin"
                                                  }
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _vm.item.userId !== 0
                                              ? _c("v-text-field", {
                                                  attrs: {
                                                    label: "Webpage Link",
                                                    optional: "",
                                                    color: "primary",
                                                    "prepend-icon": "mdi-web"
                                                  },
                                                  model: {
                                                    value:
                                                      _vm.item.socialMedia
                                                        .webpage,
                                                    callback: function($$v) {
                                                      _vm.$set(
                                                        _vm.item.socialMedia,
                                                        "webpage",
                                                        $$v
                                                      );
                                                    },
                                                    expression:
                                                      "item.socialMedia.webpage"
                                                  }
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _c("v-textarea", {
                                              attrs: {
                                                label: "User Details",
                                                optional: "",
                                                color: "primary",
                                                "prepend-icon":
                                                  "mdi-information-outline",
                                                rows: "2"
                                              },
                                              model: {
                                                value: _vm.item.details,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.item,
                                                    "details",
                                                    $$v
                                                  );
                                                },
                                                expression: "item.details"
                                              }
                                            }),
                                            _vm._v(" "),
                                            _vm.item.userId !== 0
                                              ? _c("v-select", {
                                                  attrs: {
                                                    items: _vm.roles,
                                                    label: "Role",
                                                    optional: "",
                                                    color: "primary",
                                                    "prepend-icon":
                                                      "mdi-account-card-details-outline"
                                                  },
                                                  model: {
                                                    value: _vm.item.role,
                                                    callback: function($$v) {
                                                      _vm.$set(
                                                        _vm.item,
                                                        "role",
                                                        $$v
                                                      );
                                                    },
                                                    expression: "item.role"
                                                  }
                                                })
                                              : _vm._e()
                                          ],
                                          1
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "v-card-actions",
                                          { staticClass: "justify-center" },
                                          [
                                            _vm.item.userId !== 0
                                              ? _c(
                                                  "v-btn",
                                                  {
                                                    attrs: {
                                                      rounded: "",
                                                      color: "primary"
                                                    },
                                                    on: {
                                                      click: function($event) {
                                                        return _vm.editUser()
                                                      }
                                                    }
                                                  },
                                                  [_vm._v("Edit User")]
                                                )
                                              : _c(
                                                  "v-btn",
                                                  {
                                                    attrs: {
                                                      color: "primary",
                                                      rounded: ""
                                                    },
                                                    on: {
                                                      click: function($event) {
                                                        return _vm.addUser()
                                                      }
                                                    }
                                                  },
                                                  [_vm._v("Add User")]
                                                ),
                                            _vm._v(" "),
                                            _c(
                                              "v-btn",
                                              {
                                                attrs: {
                                                  color: "primary",
                                                  text: ""
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.exitDialog()
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
                          ]
                        },
                        proxy: true
                      },
                      {
                        key: "action",
                        fn: function(ref) {
                          var item = ref.item;
                          return [
                            _c(
                              "v-icon",
                              {
                                attrs: { small: "" },
                                on: {
                                  click: function($event) {
                                    return _vm.openDialog(item)
                                  }
                                }
                              },
                              [
                                _vm._v(
                                  "\n\t\t\t\t\t\t\tmdi-pencil\n\t\t\t\t\t\t"
                                )
                              ]
                            )
                          ]
                        }
                      }
                    ])
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

var script$2 = Vue.extend({
    name: "TeamsEdit",
    data: function () {
        return {
            ui: UI$1.getInstance(),
            teams: [],
            viewTeams: [],
            users: [],
            selectedTeam: "",
            search: "",
            headers: [
                {
                    text: "Role",
                    align: "left",
                    sortable: false,
                    value: "role"
                },
                { text: "First Name", value: "firstName" },
                { text: "Last Name", value: "lastName" },
                { text: "Email", value: "email" },
            ],
        };
    },
    watch: {
        selectedTeam: {
            immediate: true,
            handler: function (newTeamId) {
                return __awaiter(this, void 0, void 0, function () {
                    var e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.getUsers(newTeamId)];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _a.sent();
                                console.error(e_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(newUser.role === "SuperAdmin" || newUser.role === "Admin")) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/" + newUser.userDetails["location"])];
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
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                if (this.$route.path !== "/workspace")
                                    this.$router.push("/workspace");
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        teams: {
            immediate: true,
            handler: function (newTeams) {
                var _this = this;
                newTeams.forEach(function (team) {
                    _this.viewTeams.push({
                        "name": team.teamName,
                        "value": team.teamId
                    });
                });
            },
        },
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        getUsers: function (teamId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, _b, us, e_3;
                var e_4, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 2, , 3]);
                            this.users = [];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/team/users/" + teamId)];
                        case 1:
                            response = _d.sent();
                            if (response) {
                                try {
                                    for (_a = __values(response.data), _b = _a.next(); !_b.done; _b = _a.next()) {
                                        us = _b.value;
                                        this.users.push(us);
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _d.sent();
                            console.error(e_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
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
    "v-app",
    [
      _c(
        "v-card",
        {
          staticStyle: {
            "margin-left": "auto",
            "margin-right": "auto",
            "padding-top": "20px",
            "background-color": "#fcfcfc"
          },
          attrs: { flat: "", width: "800" }
        },
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
            [_vm._v("\n\t\t\tManage Teams\n\t\t")]
          ),
          _vm._v(" "),
          _c("v-divider"),
          _vm._v(" "),
          _c(
            "v-card-text",
            [
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
                    "Please select a team from the list to review its members."
                  )
                ]
              ),
              _vm._v(" "),
              _c("v-select", {
                staticClass: "justify-center",
                staticStyle: { width: "500px", margin: "0 auto" },
                attrs: {
                  items: _vm.viewTeams,
                  "item-text": "name",
                  "item-value": "value",
                  label: "All Teams"
                },
                model: {
                  value: _vm.selectedTeam,
                  callback: function($$v) {
                    _vm.selectedTeam = $$v;
                  },
                  expression: "selectedTeam"
                }
              }),
              _vm._v(" "),
              _c(
                "v-container",
                { attrs: { "grid-list-xs": "" } },
                [
                  _c(
                    "v-card",
                    { attrs: { flat: "" } },
                    [
                      _c(
                        "v-card-title",
                        {
                          staticClass: "justify-center",
                          staticStyle: { "font-family": "Georgia, serif" }
                        },
                        [_vm._v("Team Composition")]
                      ),
                      _vm._v(" "),
                      _c("v-divider"),
                      _vm._v(" "),
                      _c(
                        "v-card-text",
                        [
                          _c("v-text-field", {
                            staticClass: "justify-center",
                            attrs: {
                              "append-icon": "mdi-magnify",
                              label: "Search",
                              "single-line": "",
                              "hide-details": ""
                            },
                            model: {
                              value: _vm.search,
                              callback: function($$v) {
                                _vm.search = $$v;
                              },
                              expression: "search"
                            }
                          }),
                          _vm._v(" "),
                          _c("v-data-table", {
                            attrs: {
                              "item-key": "email",
                              headers: _vm.headers,
                              items: _vm.users,
                              search: _vm.search,
                              loading: _vm.users.length <= 0,
                              "loading-text": "Loading users"
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
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
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
    undefined,
    undefined,
    undefined
  );

var script$3 = Vue.extend({
    name: "CSV",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            file: undefined,
            encoded: false,
            base64Encode: "",
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (newUser) {
                            if (newUser.role !== "Admin" && newUser.role !== "SuperAdmin") {
                                if (this.$route.path !== "/workspace")
                                    this.$router.push("/workspace");
                            }
                        }
                        return [2 /*return*/];
                    });
                });
            }
        },
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
                if (newFile !== undefined) {
                    this.toBase64(newFile);
                }
                else {
                    this.base64Encode = '';
                }
            }
        }
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    methods: {
        submitFile: function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/admin/uploadCSV", { encode: this.base64Encode })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        toBase64: function (file) {
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
    "v-app",
    [
      _c(
        "v-card",
        {
          staticStyle: {
            "margin-left": "auto",
            "margin-right": "auto",
            "padding-top": "20px",
            "background-color": "#fcfcfc"
          },
          attrs: { flat: "", "min-width": "500" }
        },
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
            [_vm._v("Import CSV")]
          ),
          _vm._v(" "),
          _c("v-divider"),
          _vm._v(" "),
          _c(
            "v-card-text",
            { staticClass: "justify-center" },
            [
              _c("v-file-input", {
                attrs: { type: "file", accept: ".csv", label: "CSV input" },
                model: {
                  value: _vm.file,
                  callback: function($$v) {
                    _vm.file = $$v;
                  },
                  expression: "file"
                }
              })
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
                    rounded: "",
                    color: "primary",
                    disabled: _vm.encoded
                  },
                  on: {
                    click: function($event) {
                      return _vm.submitFile()
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

var script$4 = Vue.extend({
    name: "WorkshopsEdit",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/workshops")];
                    case 1:
                        response = _a.sent();
                        if (response.data) {
                            this.workshops = response.data;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            dateMenu: false,
            allUsers: [],
            workshops: [],
            viewWorkshops: [],
            teams: [],
            viewTeams: [],
            auxViewTeams: [],
            allTeams: [],
            date: new Date().toISOString().substr(0, 10),
            instanceDialog: false,
            workshopDialog: false,
            workshop: "",
            trainer: "",
            details: "",
            workshopName: "",
            activeUsers: {},
            instances: {},
            teamIds: [],
            selected: "",
            attendance: [],
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, respW, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 6];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/" + newUser.userDetails["location"])];
                            case 2:
                                response = _a.sent();
                                if (response) {
                                    this.allTeams = response.data;
                                }
                                return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/workshops")];
                            case 3:
                                respW = _a.sent();
                                if (respW) {
                                    this.workshops = respW.data;
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                e_2 = _a.sent();
                                console.error(e_2);
                                return [3 /*break*/, 5];
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                if (this.$route.path !== "/workspace")
                                    this.$router.push("/workspace");
                                _a.label = 7;
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        allTeams: {
            immediate: true,
            handler: function (newTeams) {
                var _this = this;
                newTeams.forEach(function (team) {
                    _this.viewTeams.push({
                        "name": team.teamName,
                        "value": team.teamId
                    });
                });
                this.auxViewTeams = this.viewTeams;
            },
        },
        workshops: {
            immediate: true,
            handler: function (newWorkshops) {
                var _this = this;
                this.viewWorkshops = [];
                newWorkshops.forEach(function (workshop) {
                    _this.viewWorkshops.push({
                        "name": workshop.workshopName,
                        "value": workshop.workshopId
                    });
                });
            },
        },
        selected: {
            immediate: true,
            handler: function (newWorkshopId) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b, _i, date, _loop_1, this_1, _c, _d, workshop, e_3_1;
                    var e_3, _e;
                    var _this = this;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, this.getWorkshopInstances(newWorkshopId)];
                            case 1:
                                _f.sent();
                                return [4 /*yield*/, this.getAttendance(newWorkshopId)];
                            case 2:
                                _f.sent();
                                _a = [];
                                for (_b in this.instances)
                                    _a.push(_b);
                                _i = 0;
                                _f.label = 3;
                            case 3:
                                if (!(_i < _a.length)) return [3 /*break*/, 12];
                                date = _a[_i];
                                this.activeUsers[date] = new Array();
                                if (!Object.prototype.hasOwnProperty.call(this.instances, date)) return [3 /*break*/, 11];
                                _loop_1 = function (workshop) {
                                    var response, name_1, _a, _b, team, users;
                                    var e_4, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this_1.ui.api.get("/api/v1/teams/team/users/" + workshop.teamId)];
                                            case 1:
                                                response = _d.sent();
                                                if (response) {
                                                    name_1 = "";
                                                    try {
                                                        for (_a = (e_4 = void 0, __values(this_1.teams)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                            team = _b.value;
                                                            if (this_1.user.role === "Admin") {
                                                                if (team.teamId === workshop.teamId)
                                                                    name_1 = team.teamName;
                                                            }
                                                            else if (this_1.user.role === "Mentor") {
                                                                if (team.teamId === workshop.teamId)
                                                                    name_1 = team.teamName;
                                                            }
                                                        }
                                                    }
                                                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                                    finally {
                                                        try {
                                                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                                        }
                                                        finally { if (e_4) throw e_4.error; }
                                                    }
                                                    users = response.data;
                                                    users.forEach(function (user) {
                                                        var tempUser = user;
                                                        tempUser.programmingDetails = {};
                                                        tempUser.programmingDetails["team"] = name_1;
                                                        tempUser.programmingDetails["teamId"] = workshop.teamId;
                                                        var foundAttended = _.find(_this.attendance, function (userAttendance) {
                                                            return userAttendance.userId === user.userId;
                                                        });
                                                        user.programmingDetails["present"] = foundAttended !== undefined ? true : false;
                                                        user = tempUser;
                                                    });
                                                    this_1.activeUsers[date].push({
                                                        teamName: name_1,
                                                        users: users
                                                    });
                                                    this_1.$forceUpdate();
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                this_1 = this;
                                _f.label = 4;
                            case 4:
                                _f.trys.push([4, 9, 10, 11]);
                                _c = (e_3 = void 0, __values(this.instances[date])), _d = _c.next();
                                _f.label = 5;
                            case 5:
                                if (!!_d.done) return [3 /*break*/, 8];
                                workshop = _d.value;
                                return [5 /*yield**/, _loop_1(workshop)];
                            case 6:
                                _f.sent();
                                _f.label = 7;
                            case 7:
                                _d = _c.next();
                                return [3 /*break*/, 5];
                            case 8: return [3 /*break*/, 11];
                            case 9:
                                e_3_1 = _f.sent();
                                e_3 = { error: e_3_1 };
                                return [3 /*break*/, 11];
                            case 10:
                                try {
                                    if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                                }
                                finally { if (e_3) throw e_3.error; }
                                return [7 /*endfinally*/];
                            case 11:
                                _i++;
                                return [3 /*break*/, 3];
                            case 12: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        workshop: {
            immediate: true,
            handler: function (newWorkshopId) {
                return __awaiter(this, void 0, void 0, function () {
                    var instances, response, _a, _b, wInst, _loop_2, this_2, instances_1, instances_1_1, instance;
                    var e_5, _c, e_6, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                instances = [];
                                if (!newWorkshopId) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/mentor/instances/" + newWorkshopId)];
                            case 1:
                                response = _e.sent();
                                this.auxViewTeams = [];
                                try {
                                    for (_a = __values(response.data), _b = _a.next(); !_b.done; _b = _a.next()) {
                                        wInst = _b.value;
                                        // as any this.instances = _.Dictionary<WorkshopInstances> | {[key:string]:WorkshopInstances} ?
                                        instances.push.apply(instances, __spread(wInst));
                                    }
                                }
                                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                finally {
                                    try {
                                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                }
                                _loop_2 = function (instance) {
                                    var _a;
                                    (_a = this_2.auxViewTeams).push.apply(_a, __spread(this_2.viewTeams.filter(function (team) {
                                        return team.value !== instance.teamId;
                                    })));
                                };
                                this_2 = this;
                                try {
                                    for (instances_1 = __values(instances), instances_1_1 = instances_1.next(); !instances_1_1.done; instances_1_1 = instances_1.next()) {
                                        instance = instances_1_1.value;
                                        _loop_2(instance);
                                    }
                                }
                                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                finally {
                                    try {
                                        if (instances_1_1 && !instances_1_1.done && (_d = instances_1.return)) _d.call(instances_1);
                                    }
                                    finally { if (e_6) throw e_6.error; }
                                }
                                _e.label = 2;
                            case 2: return [2 /*return*/];
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
        modifyUsers: function (users) {
            // users.forEach(element => {
            // 	if(element.role){
            // 		const roleObj = element.role;
            // 		for(const prop in roleObj) {
            // 			if (Object.prototype.hasOwnProperty.call(roleObj, prop)) {
            // 				// as any to replace role: {"Role_name":true} with "Role_name"
            // 				(element.role as any) = prop;
            // 			}
            // 		}
            // 	}
            // });
            return users;
        },
        getWorkshopInstances: function (newWorkshopId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, response, _a, _b, team, response, e_7;
                var e_8, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 7, , 8]);
                            if (!newWorkshopId) return [3 /*break*/, 6];
                            if (!(this.user.role === "Mentor")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teams/" + this.user.userId)];
                        case 1:
                            response = _d.sent();
                            if (response)
                                this.teams = response.data;
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(this.user.role === "Admin")) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/")];
                        case 3:
                            response = _d.sent();
                            if (response)
                                this.teams = response.data;
                            _d.label = 4;
                        case 4:
                            if (!(this.teams.length > 0)) return [3 /*break*/, 6];
                            try {
                                for (_a = __values(this.teams), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    team = _b.value;
                                    this.teamIds.push(team.teamId);
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                            return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/mentor/instances/" + newWorkshopId)];
                        case 5:
                            response = _d.sent();
                            if (response) {
                                this.instances = response.data;
                                return [2 /*return*/, true];
                            }
                            _d.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            e_7 = _d.sent();
                            console.error(e_7);
                            return [2 /*return*/, false];
                        case 8: return [2 /*return*/, false];
                    }
                });
            });
        },
        getAttendance: function (newWorkshopId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_9;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            if (!newWorkshopId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/attendance/" + newWorkshopId)];
                        case 1:
                            response = _b.sent();
                            if (response) {
                                (_a = this.attendance).push.apply(_a, __spread(response.data));
                                return [2 /*return*/, true];
                            }
                            _b.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3:
                            e_9 = _b.sent();
                            console.error(e_9);
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/, false];
                    }
                });
            });
        },
        openWorkshopDialog: function () {
            this.workshopDialog = true;
        },
        openInstanceDialog: function () {
            this.instanceDialog = true;
        },
        addInstance: function () {
            return __awaiter(this, void 0, void 0, function () {
                var instances, aux, e_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/workshop/add/instance", {
                                    workshopId: this.workshop,
                                    teamIds: this.teams,
                                    date: this.date,
                                    details: this.details,
                                    trainer: this.trainer,
                                })];
                        case 1:
                            instances = _a.sent();
                            if (instances.data) {
                                aux = this.selected;
                                this.selected = "";
                                this.selected = aux;
                                this.workshop = "";
                                this.teams = [];
                                this.date = "";
                                this.details = "";
                                this.trainer = "";
                                this.instanceDialog = false;
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_10 = _a.sent();
                            console.error(e_10);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        addWorkshop: function () {
            return __awaiter(this, void 0, void 0, function () {
                var workshop, newWorkshop, response, e_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            workshop = {
                                workshopName: this.workshopName
                            };
                            return [4 /*yield*/, this.ui.api.post("/api/v1/workshop/add", workshop)];
                        case 1:
                            newWorkshop = _a.sent();
                            if (!newWorkshop.data) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/workshops")];
                        case 2:
                            response = _a.sent();
                            if (response) {
                                this.workshops = response.data;
                                this.workshopName = "";
                                this.workshopDialog = false;
                            }
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            e_11 = _a.sent();
                            console.error(e_11);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        deny: function (type) {
            if (type === "instance") {
                this.date = new Date().toISOString().substr(0, 10);
                this.trainer = "",
                    this.workshop = "",
                    this.details = "",
                    this.teams = [],
                    this.instanceDialog = false;
            }
            else if (type === "workshop") {
                this.workshopName = "";
                this.workshopDialog = false;
            }
        },
        getAllUsers: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/users/users")];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                this.allUsers = this.modifyUsers(response.data);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_12 = _a.sent();
                            console.error(e_12);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
    }
});

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-app",
    [
      _c(
        "v-card",
        {
          staticStyle: {
            "margin-left": "auto",
            "margin-right": "auto",
            "padding-top": "20px"
          },
          attrs: { flat: "" }
        },
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
            [_vm._v("Workshops Attendance List")]
          ),
          _vm._v(" "),
          _c("v-divider"),
          _vm._v(" "),
          _c(
            "v-card-text",
            [
              _c(
                "div",
                {
                  staticClass: "justify-center",
                  staticStyle: { "margin-bottom": "20px" },
                  attrs: { align: "center" }
                },
                [
                  _c(
                    "v-row",
                    { attrs: { "no-gutters": "", align: "center" } },
                    [
                      _c(
                        "v-col",
                        {
                          attrs: {
                            cols: "12",
                            sm: "6",
                            md: "6",
                            lg: "6",
                            xl: "6",
                            align: "center"
                          }
                        },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { rounded: "", color: "primary" },
                              on: {
                                click: function($event) {
                                  return _vm.openWorkshopDialog()
                                }
                              }
                            },
                            [_vm._v("Add Workshop")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        {
                          attrs: {
                            cols: "12",
                            sm: "6",
                            md: "6",
                            lg: "6",
                            xl: "6",
                            align: "center"
                          }
                        },
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: { rounded: "", color: "primary" },
                              on: {
                                click: function($event) {
                                  return _vm.openInstanceDialog()
                                }
                              }
                            },
                            [_vm._v("Add Teams to Workshop")]
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
              _c("v-divider"),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticStyle: { "margin-top": "20px" },
                  attrs: { align: "center" }
                },
                [
                  _vm._v(
                    "Please select a workshop from the list to check the participants."
                  )
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                { attrs: { align: "center" } },
                [
                  _c("v-select", {
                    staticClass: "justify-center",
                    staticStyle: { width: "500px" },
                    attrs: {
                      items: _vm.workshops,
                      "item-text": "workshopName",
                      "item-value": "workshopId",
                      label: "Workshop",
                      align: "center"
                    },
                    model: {
                      value: _vm.selected,
                      callback: function($$v) {
                        _vm.selected = $$v;
                      },
                      expression: "selected"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.selected
                ? _c(
                    "div",
                    _vm._l(_vm.instances, function(workshop, date) {
                      return _c(
                        "v-card",
                        {
                          key: date,
                          staticClass: "justify-center",
                          attrs: { flat: "", outlined: "", width: "930" }
                        },
                        [
                          _c(
                            "v-card-title",
                            {
                              staticClass: "justify-center",
                              staticStyle: { "font-family": "Georgia, serif" }
                            },
                            [
                              _vm._v(
                                "\n\t\t\t\t\t\t" + _vm._s(date) + "\n\t\t\t\t\t"
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-card-text",
                            [
                              _c(
                                "v-row",
                                _vm._l(_vm.activeUsers[date], function(
                                  team,
                                  idx
                                ) {
                                  return _c(
                                    "div",
                                    { key: idx },
                                    [
                                      _c(
                                        "v-col",
                                        [
                                          _c(
                                            "v-card",
                                            {
                                              attrs: {
                                                flat: "",
                                                outlined: "",
                                                width: "250"
                                              }
                                            },
                                            [
                                              _c(
                                                "v-card-title",
                                                {
                                                  staticClass: "justify-center",
                                                  staticStyle: {
                                                    "font-family":
                                                      "Georgia, serif"
                                                  }
                                                },
                                                [_vm._v(_vm._s(team.teamName))]
                                              ),
                                              _vm._v(" "),
                                              _vm._l(team.users, function(
                                                user,
                                                index
                                              ) {
                                                return _c(
                                                  "v-list-item",
                                                  { key: index },
                                                  [
                                                    _c(
                                                      "v-list-item-content",
                                                      [
                                                        _c(
                                                          "v-row",
                                                          [
                                                            _c(
                                                              "v-col",
                                                              {
                                                                attrs: {
                                                                  cols: "8"
                                                                }
                                                              },
                                                              [
                                                                _c(
                                                                  "h3",
                                                                  {
                                                                    staticStyle: {
                                                                      "font-family":
                                                                        "Georgia, serif"
                                                                    }
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t" +
                                                                        _vm._s(
                                                                          user.firstName
                                                                        ) +
                                                                        " " +
                                                                        _vm._s(
                                                                          user.lastName
                                                                        ) +
                                                                        "\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t"
                                                                    )
                                                                  ]
                                                                )
                                                              ]
                                                            ),
                                                            _vm._v(" "),
                                                            _c(
                                                              "v-col",
                                                              {
                                                                attrs: {
                                                                  cols: "4"
                                                                }
                                                              },
                                                              [
                                                                user
                                                                  .programmingDetails[
                                                                  "present"
                                                                ]
                                                                  ? _c(
                                                                      "div",
                                                                      {
                                                                        staticStyle: {
                                                                          color:
                                                                            "gray"
                                                                        }
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          " Present"
                                                                        )
                                                                      ]
                                                                    )
                                                                  : _c(
                                                                      "div",
                                                                      {
                                                                        staticStyle: {
                                                                          color:
                                                                            "gray"
                                                                        }
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          " Absent"
                                                                        )
                                                                      ]
                                                                    )
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
                                                )
                                              })
                                            ],
                                            2
                                          )
                                        ],
                                        1
                                      )
                                    ],
                                    1
                                  )
                                }),
                                0
                              )
                            ],
                            1
                          )
                        ],
                        1
                      )
                    }),
                    1
                  )
                : _vm._e()
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
          attrs: { persistent: "", width: "400" },
          model: {
            value: _vm.instanceDialog,
            callback: function($$v) {
              _vm.instanceDialog = $$v;
            },
            expression: "instanceDialog"
          }
        },
        [
          _c(
            "v-card",
            { attrs: { width: "400" } },
            [
              _c(
                "v-card-title",
                {
                  staticClass: "justify-center",
                  staticStyle: { "font-family": "Georgia, serif" }
                },
                [_vm._v("Add Instance")]
              ),
              _vm._v(" "),
              _c(
                "v-card-text",
                [
                  _c("v-select", {
                    attrs: {
                      items: _vm.viewWorkshops,
                      "item-text": "name",
                      "item-value": "value",
                      label: "Workshop",
                      optional: ""
                    },
                    model: {
                      value: _vm.workshop,
                      callback: function($$v) {
                        _vm.workshop = $$v;
                      },
                      expression: "workshop"
                    }
                  }),
                  _vm._v(" "),
                  _c("v-text-field", {
                    attrs: {
                      color: "primary",
                      label: "Trainer Name",
                      optional: ""
                    },
                    model: {
                      value: _vm.trainer,
                      callback: function($$v) {
                        _vm.trainer = $$v;
                      },
                      expression: "trainer"
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "v-menu",
                    {
                      ref: "dateMenu",
                      attrs: {
                        "close-on-content-click": false,
                        "return-value": _vm.date,
                        transition: "scale-transition",
                        "offset-y": "",
                        "max-width": "290px",
                        "min-width": "290px"
                      },
                      on: {
                        "update:returnValue": function($event) {
                          _vm.date = $event;
                        },
                        "update:return-value": function($event) {
                          _vm.date = $event;
                        }
                      },
                      scopedSlots: _vm._u([
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
                                      label: "Date",
                                      "persistent-hint": "",
                                      "prepend-icon": "event"
                                    },
                                    model: {
                                      value: _vm.date,
                                      callback: function($$v) {
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
                      ]),
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
                              attrs: { text: "", color: "primary" },
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
                              attrs: { text: "", color: "primary" },
                              on: {
                                click: function($event) {
                                  return _vm.$refs.dateMenu.save(_vm.date)
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
                  ),
                  _vm._v(" "),
                  _c("v-select", {
                    attrs: {
                      items: _vm.auxViewTeams,
                      "item-text": "name",
                      "item-value": "value",
                      label: "Teams",
                      multiple: "",
                      bottom: "",
                      optional: ""
                    },
                    model: {
                      value: _vm.teams,
                      callback: function($$v) {
                        _vm.teams = $$v;
                      },
                      expression: "teams"
                    }
                  }),
                  _vm._v(" "),
                  _c("v-text-field", {
                    attrs: { color: "primary", label: "Details", optional: "" },
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
              ),
              _vm._v(" "),
              _c(
                "v-card-actions",
                { staticClass: "justify-center" },
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { rounded: "", color: "primary", text: "" },
                      on: {
                        click: function($event) {
                          return _vm.addInstance()
                        }
                      }
                    },
                    [_vm._v("Add")]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      attrs: { color: "primary", text: "" },
                      on: {
                        click: function($event) {
                          return _vm.deny("instance")
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
      ),
      _vm._v(" "),
      _c(
        "v-dialog",
        {
          attrs: { persistent: "", width: "400" },
          model: {
            value: _vm.workshopDialog,
            callback: function($$v) {
              _vm.workshopDialog = $$v;
            },
            expression: "workshopDialog"
          }
        },
        [
          _c(
            "v-card",
            { attrs: { width: "400" } },
            [
              _c(
                "v-card-title",
                {
                  staticClass: "justify-center",
                  staticStyle: { "font-family": "Georgia, serif" }
                },
                [_vm._v("Add Workshop")]
              ),
              _vm._v(" "),
              _c(
                "v-card-text",
                [
                  _c("v-text-field", {
                    attrs: { label: "Workshop Name", optional: "" },
                    model: {
                      value: _vm.workshopName,
                      callback: function($$v) {
                        _vm.workshopName = $$v;
                      },
                      expression: "workshopName"
                    }
                  })
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
                      attrs: { color: "primary", rounded: "" },
                      on: {
                        click: function($event) {
                          return _vm.addWorkshop()
                        }
                      }
                    },
                    [_vm._v("Add")]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      attrs: { color: "primary", text: "" },
                      on: {
                        click: function($event) {
                          return _vm.deny("workshop")
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
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$4 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

var MENU;
(function (MENU) {
    MENU["ADMIN_PANEL"] = "1";
    MENU["CSV"] = "2";
})(MENU || (MENU = {}));
var script$5 = Vue.extend({
    name: "AdminMenu",
    data: function () {
        return {
            ui: UI$1.getInstance(),
            userRole: "",
            options: {
                menuName: "",
                menuIcon: "mdi-cogs",
                menuTooltip: "Admin Panel",
                items: [
                    {
                        id: MENU.ADMIN_PANEL,
                        title: "Manage",
                        icon: "mdi-wan",
                        link: "/admin/users"
                    },
                    {
                        id: MENU.CSV,
                        title: "Import CSV",
                        icon: "mdi-file-delimited",
                        link: "/admin/csv"
                    }
                ]
            }
        };
    },
    computed: __assign({}, mapGetters({
        user: "users/user"
    })),
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (newUser) {
                            if (newUser.role === "Admin" || newUser.role === "SuperAdmin") {
                                this.userRole = newUser.role;
                            }
                        }
                        return [2 /*return*/];
                    });
                });
            }
        },
    },
    methods: {
        click: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        }
    }
});

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.userRole
    ? _c("SimpleMenu", {
        attrs: { options: _vm.options },
        on: { click: _vm.click }
      })
    : _vm._e()
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$5 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

var script$6 = Vue.extend({
    name: "ExportView",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            preset: '',
            presetTeams: [],
            city: '',
            cities: [
                "Bucharest",
                "Cluj",
                "Iasi",
                "Sibiu",
                "Timisoara"
            ],
            teamDate: '',
            cityDate: '',
            date: '',
            dates: [
                {
                    text: 'All Teams',
                    value: 'none'
                },
                {
                    text: 'Teams that passed 20th of May assessment',
                    value: 'may'
                },
                {
                    text: 'Teams that passed 12th of October assessment',
                    value: 'oct'
                }
            ],
            team: '',
            teams: [],
            loadingPage: false,
            //SnackBar popup
            snackOptions: {
                text: "",
                type: "info",
                timeout: 2000
            },
            snackbar: false,
            responded: false,
            toStop: false,
            option: '',
            options: [
                {
                    text: 'PowerPoint Presentations',
                    value: 'pres'
                },
                {
                    text: 'Tehnic Demo Videos',
                    value: 'demoVid'
                },
                {
                    text: 'Presentation Videos',
                    value: 'presVid'
                },
                {
                    text: 'Logos',
                    value: 'logo'
                },
                {
                    text: 'Images',
                    value: 'images'
                },
            ],
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newUser) return [3 /*break*/, 4];
                                if (!(newUser.role !== "Admin" && newUser.role !== "SuperAdmin")) return [3 /*break*/, 1];
                                if (this.$route.path !== "/workspace")
                                    this.$router.push("/workspace");
                                return [3 /*break*/, 4];
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams")];
                            case 2:
                                response = _a.sent();
                                if (response) {
                                    this.teams = response.data;
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.error(e_1);
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
    created: function () {
    },
    methods: {
        update: function (prop) {
            this.snackbar = prop;
        },
        exportTeamZip: function (type, option) {
            return __awaiter(this, void 0, void 0, function () {
                var body_1, response, noUpload_1, statusFunction_1, e_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.loadingPage = true;
                            body_1 = {};
                            if (type === 'all')
                                body_1 = {
                                    type: type,
                                    date: this.teamDate,
                                    cityOrTeam: ''
                                };
                            else if (type === 'team')
                                body_1 = {
                                    type: type,
                                    date: 'none',
                                    cityOrTeam: this.team
                                };
                            else if (type === 'city')
                                body_1 = {
                                    type: type,
                                    date: this.cityDate,
                                    cityOrTeam: this.city
                                };
                            else if (type === 'preset')
                                body_1 = {
                                    type: type,
                                    date: 'none',
                                    cityOrTeam: this.preset,
                                    option: option
                                };
                            return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/download/zip/", body_1)];
                        case 1:
                            response = _a.sent();
                            if (response.status === 200) {
                                // let url = response.data.url;
                                this.toStop = false;
                                setTimeout(function () {
                                    if (!_this.toStop) {
                                        _this.snackOptions.text = "Request timed out, please try again later, if the problem perssists please contact teams@tech-lounge.ro for more information";
                                        _this.snackOptions.type = SnackBarTypes.INFO;
                                        _this.snackOptions.timeout = 2000;
                                        _this.snackbar = true;
                                        _this.loadingPage = false;
                                        _this.toStop = true;
                                    }
                                }, 300000);
                                noUpload_1 = function () {
                                    _this.snackOptions.text = "There are no files uploaded for the selected option";
                                    _this.snackOptions.type = SnackBarTypes.INFO;
                                    _this.snackOptions.timeout = 2000;
                                    _this.snackbar = true;
                                    _this.loadingPage = false;
                                    _this.toStop = true;
                                };
                                statusFunction_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var response_1, error_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, this.ui.api.post("/api/v1/uploadDownload/check/zip/status/", body_1)];
                                            case 1:
                                                response_1 = _a.sent();
                                                if (response_1.data) {
                                                    if (response_1.data === "ERROR") {
                                                        this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
                                                        this.snackOptions.type = SnackBarTypes.ERROR;
                                                        this.snackOptions.timeout = 2000;
                                                        this.snackbar = true;
                                                        this.loadingPage = false;
                                                        this.toStop = true;
                                                        return [2 /*return*/];
                                                    }
                                                    else if (response_1.data === "NO_FILES_TO_UPLOAD") {
                                                        noUpload_1();
                                                        return [2 /*return*/];
                                                    }
                                                    else if (response_1.data !== "NOT_DONE" && response_1.data !== "") {
                                                        this.openUrl(response_1.data);
                                                        return [2 /*return*/];
                                                    }
                                                    if (!this.toStop)
                                                        setTimeout(statusFunction_1, 1000);
                                                }
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_1 = _a.sent();
                                                if (error_1.response.status === 401 || error_1.response.status === 502) {
                                                    if (!this.toStop)
                                                        setTimeout(statusFunction_1, 1000);
                                                }
                                                else {
                                                    console.error(error_1);
                                                    this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
                                                    this.snackOptions.type = SnackBarTypes.ERROR;
                                                    this.snackOptions.timeout = 2000;
                                                    this.snackbar = true;
                                                    this.loadingPage = false;
                                                    this.toStop = true;
                                                }
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); };
                                statusFunction_1();
                            }
                            else {
                                this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
                                this.snackOptions.type = SnackBarTypes.ERROR;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _a.sent();
                            console.error(e_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        exportZip: function (type) {
            return __awaiter(this, void 0, void 0, function () {
                var response, url, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.loadingPage = true;
                            return [4 /*yield*/, this.ui.api.get("/api/v1/uploadDownload/download/zip/" + type + "/" + this.date)];
                        case 1:
                            response = _a.sent();
                            if (response.status === 200 && response.data) {
                                url = response.data;
                                window.open(url, '_blank');
                            }
                            else if (response.status === 204) {
                                this.snackOptions.text = "There are no files uploaded for any of the teams";
                                this.snackOptions.type = SnackBarTypes.INFO;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            else {
                                this.snackOptions.text = "Server ERROR; Please contact teams@tech-lounge.ro for more information";
                                this.snackOptions.type = SnackBarTypes.ERROR;
                                this.snackOptions.timeout = 2000;
                                this.snackbar = true;
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _a.sent();
                            console.error(e_3);
                            return [3 /*break*/, 3];
                        case 3:
                            this.loadingPage = false;
                            return [2 /*return*/];
                    }
                });
            });
        },
        exportUDC: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, hiddenElement, e_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/admin/download/udc/data")];
                        case 1:
                            response = _a.sent();
                            if (response.data) {
                                hiddenElement = document.createElement('a');
                                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
                                hiddenElement.target = '_blank';
                                hiddenElement.download = 'users.csv';
                                hiddenElement.click();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_4 = _a.sent();
                            console.error(e_4);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        exportTDD: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, hiddenElement, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/admin/download/team/data")];
                        case 1:
                            response = _a.sent();
                            if (response.data) {
                                hiddenElement = document.createElement('a');
                                hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(response.data);
                                hiddenElement.target = '_blank';
                                hiddenElement.download = 'team.csv';
                                hiddenElement.click();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_5 = _a.sent();
                            console.error(e_5);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        openUrl: function (url) {
            try {
                window.open(url, '_blank');
                this.loadingPage = false;
                this.toStop = true;
            }
            catch (e) {
                console.error(e);
            }
        }
    }
});

/* script */
const __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-app",
    [
      _c(
        "v-card",
        {
          staticStyle: {
            "margin-left": "auto",
            "margin-right": "auto",
            "padding-top": "20px",
            "background-color": "#fcfcfc"
          },
          attrs: { flat: "", "min-width": "500" }
        },
        [
          _c(
            "v-container",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: !_vm.loadingPage,
                  expression: "!loadingPage"
                }
              ]
            },
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
                [_vm._v("Export Data")]
              ),
              _vm._v(" "),
              _c("v-divider"),
              _vm._v(" "),
              _c("v-card-text", { staticClass: "justify-center" }, [
                _vm._v("\n\t\t\t\tMultiple export options\n\t\t\t")
              ]),
              _vm._v(" "),
              _c(
                "v-card-actions",
                { staticClass: "justify-center" },
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { rounded: "", color: "primary" },
                      on: {
                        click: function($event) {
                          return _vm.exportUDC()
                        }
                      }
                    },
                    [
                      _vm._v(
                        "Extract csv with upload/description/canvas information"
                      )
                    ]
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
                      attrs: { rounded: "", color: "primary" },
                      on: {
                        click: function($event) {
                          return _vm.exportTDD()
                        }
                      }
                    },
                    [
                      _vm._v(
                        "Extract csv with description, name, business track, team track"
                      )
                    ]
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("v-divider"),
              _vm._v(" "),
              _c(
                "v-row",
                { attrs: { align: "center" } },
                [
                  _c("v-select", {
                    attrs: {
                      items: _vm.teams,
                      label: "Select a team you wish to export",
                      "item-text": "teamName",
                      "item-value": "productId",
                      hint: "Please make sure to select a value",
                      "persistent-hint": ""
                    },
                    model: {
                      value: _vm.team,
                      callback: function($$v) {
                        _vm.team = $$v;
                      },
                      expression: "team"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-row",
                { attrs: { align: "center" } },
                [
                  _c(
                    "v-btn",
                    {
                      attrs: {
                        disabled: _vm.team === "",
                        rounded: "",
                        color: "primary"
                      },
                      on: {
                        click: function($event) {
                          return _vm.exportTeamZip("team")
                        }
                      }
                    },
                    [_vm._v("Download team zip")]
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
                        "v-card-title",
                        {
                          staticClass: "justify-center",
                          staticStyle: {
                            "font-family": "Georgia, serif",
                            "font-weight": "bold"
                          }
                        },
                        [_vm._v("All Teams")]
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c("v-select", {
                            attrs: {
                              items: _vm.dates,
                              label: "Select type of exports for teams",
                              "item-text": "text",
                              "item-value": "value",
                              hint: "Please make sure to select a value",
                              "persistent-hint": ""
                            },
                            model: {
                              value: _vm.teamDate,
                              callback: function($$v) {
                                _vm.teamDate = $$v;
                              },
                              expression: "teamDate"
                            }
                          }),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.teamDate === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportTeamZip("all")
                                }
                              }
                            },
                            [_vm._v("Download all teams zip")]
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
                      _c("v-select", {
                        attrs: {
                          items: _vm.dates,
                          label: "Select type of exports for resource",
                          "item-text": "text",
                          "item-value": "value",
                          hint: "Please make sure to select a value",
                          "persistent-hint": ""
                        },
                        model: {
                          value: _vm.date,
                          callback: function($$v) {
                            _vm.date = $$v;
                          },
                          expression: "date"
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
                      _c(
                        "v-row",
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
                            [_vm._v("City Teams")]
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            [
                              _c(
                                "v-col",
                                [
                                  _c("v-select", {
                                    attrs: {
                                      items: _vm.cities,
                                      label:
                                        "Select the city you wish to export",
                                      "item-text": "text",
                                      "item-value": "value",
                                      hint:
                                        "Please make sure to select a value",
                                      "persistent-hint": ""
                                    },
                                    model: {
                                      value: _vm.city,
                                      callback: function($$v) {
                                        _vm.city = $$v;
                                      },
                                      expression: "city"
                                    }
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "v-col",
                                [
                                  _c("v-select", {
                                    attrs: {
                                      items: _vm.dates,
                                      label:
                                        "Select type of exports for city teams",
                                      "item-text": "text",
                                      "item-value": "value",
                                      hint:
                                        "Please make sure to select a value",
                                      "persistent-hint": ""
                                    },
                                    model: {
                                      value: _vm.cityDate,
                                      callback: function($$v) {
                                        _vm.cityDate = $$v;
                                      },
                                      expression: "cityDate"
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
                                "v-btn",
                                {
                                  attrs: {
                                    disabled:
                                      _vm.city === "" || _vm.cityDate === "",
                                    rounded: "",
                                    color: "primary"
                                  },
                                  on: {
                                    click: function($event) {
                                      return _vm.exportTeamZip("city")
                                    }
                                  }
                                },
                                [_vm._v("Download city teams zip")]
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
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.date === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportZip("pres")
                                }
                              }
                            },
                            [_vm._v("Download pptx zip")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.date === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportZip("demoVid")
                                }
                              }
                            },
                            [_vm._v("Download tehnic demo video zip")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.date === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportZip("presVid")
                                }
                              }
                            },
                            [_vm._v("Download presentation video zip")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.date === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportZip("image")
                                }
                              }
                            },
                            [_vm._v("Download images zip")]
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        [
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.date === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportZip("logo")
                                }
                              }
                            },
                            [_vm._v("Download logo zip")]
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
                        "v-row",
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
                            [_vm._v("Preset Teams")]
                          ),
                          _vm._v(" "),
                          _c("v-select", {
                            attrs: {
                              items: _vm.presetTeams,
                              label: "Select the preset teams export",
                              "item-text": "text",
                              "item-value": "value",
                              hint: "Please make sure to select a value",
                              "persistent-hint": ""
                            },
                            model: {
                              value: _vm.preset,
                              callback: function($$v) {
                                _vm.preset = $$v;
                              },
                              expression: "preset"
                            }
                          }),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled: _vm.preset === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportTeamZip("preset")
                                }
                              }
                            },
                            [_vm._v("Download preset teams zip")]
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
                        "v-row",
                        [
                          _c("v-select", {
                            attrs: {
                              items: _vm.options,
                              label: "Select the preset teams export",
                              "item-text": "text",
                              "item-value": "value",
                              hint: "Please make sure to select a value",
                              "persistent-hint": ""
                            },
                            model: {
                              value: _vm.option,
                              callback: function($$v) {
                                _vm.option = $$v;
                              },
                              expression: "option"
                            }
                          }),
                          _vm._v(" "),
                          _c(
                            "v-btn",
                            {
                              attrs: {
                                disabled:
                                  _vm.preset === "" || _vm.option === "",
                                rounded: "",
                                color: "primary"
                              },
                              on: {
                                click: function($event) {
                                  return _vm.exportTeamZip("preset", _vm.option)
                                }
                              }
                            },
                            [_vm._v("Download preset teams resource")]
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
          _c(
            "v-container",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.loadingPage,
                  expression: "loadingPage"
                }
              ]
            },
            [
              _c(
                "v-card",
                {
                  staticClass: "justify-center",
                  attrs: { flat: "", outlined: "", color: "#fcfcfc" }
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
                              "Your download is being processed, this might take a few minutes."
                            )
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "v-row",
                        { attrs: { align: "center", justify: "center" } },
                        [
                          _c("strong", { attrs: { color: "accent" } }, [
                            _vm._v("Please do not close or refresh the page!")
                          ])
                        ]
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
      ),
      _vm._v(" "),
      _c("SnackBar", {
        attrs: { options: _vm.snackOptions, snackbar: _vm.snackbar },
        on: { "update-prop": _vm.update }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$6 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    undefined,
    undefined,
    undefined
  );

var script$7 = Vue.extend({
    name: "Dashboard",
    components: {},
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _varToString, name;
            return __generator(this, function (_a) {
                _varToString = function (varObj) { return Object.keys(varObj)[0]; };
                name = _varToString({ BusinessTrack: BusinessTrack });
                this._enumToData(BusinessTrack, name);
                name = _varToString({ TeamType: TeamType });
                this._enumToData(TeamType, name);
                name = _varToString({ WorkshopDay: WorkshopDay });
                this._enumToData(WorkshopDay, name);
                return [2 /*return*/];
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            changed: false,
            allTeams: [],
            startupRules: [
                function (value) {
                    if (value && value.length > 0)
                        return true;
                    else
                        return "Team needs a name";
                },
            ],
            rulesDesc: [
                function (value) { return !value || value.length <= 600 || 'Description must have at most 600 characters'; },
            ],
            drawer: true,
            mini: true,
            valid: true,
            validDesc: true,
            teamId: "",
            role: "",
            menuName: {
                title: "",
            },
            router: false,
            show: true,
            currentRoute: "",
            mentoredTeams: [],
            selectedMentoredTeam: {},
            id: "",
            tabs: [],
            editElement: true,
            dialog: false,
            team: null,
            values: [
                { text: "Yes", value: true },
                { text: "No", value: false },
                { text: "NONE", value: null },
            ],
            teamTypes: [
                "Spin-off",
                "Start-up",
                "Scale-up"
            ],
            businessTracks: [
                "Agriculture",
                "CyberSecurity",
                "FinTech",
                "Health&Lifestyle",
                "Retail",
                "SmartCity",
                "SmartMobility",
                "Other"
            ],
            workshopDays: [],
            locations: [
                "Bucharest",
                "Cluj",
                "Iasi",
                "Sibiu",
                "Timisoara"
            ],
            reviews: [],
            type: "",
            loadingPage: false,
            loading: false,
            expanded: [],
            singleSelect: false,
            headers: [
                {
                    text: "Location",
                    align: "left",
                    sortable: true,
                    value: "location"
                },
                { text: "Workshop Nr.", value: "workshopNr" },
                { text: "Mentor", value: "mentor" },
                { text: "Team Track", value: "teamTrack" },
                { text: "Business Track", value: "businessTrack" },
                { text: "Startup Name", value: "startupName" },
                { text: "Web Page Link", value: "webLink" },
                { text: "Assessment Finals", value: "assessment20May" },
                { text: "Assessment SemiFinals", value: "assessment12Oct" },
                { text: "Actions", value: "actions", sortable: false },
                { text: "Updated Description", value: "updated", sortable: false },
                { text: "Last Team Update", value: "updatedAt", sortable: false },
                { text: "Last Mentor Update", value: "lastMentorUpdate", sortable: false }
            ],
            tableOptions: {},
            existsUpdate: false,
            approveDescriptions: [],
            updated: null,
            approveDialog: false,
            selectedTeam: "",
            allDescriptions: {}
        };
    },
    filters: {
        moment: function (date) {
            return moment(date).format("MMMM Do YYYY, h:mm:ss a");
        }
    },
    watch: {
        mentoredTeam: {
            immediate: true,
            handler: function (newTeam) {
                return __awaiter(this, void 0, void 0, function () {
                    var resp;
                    return __generator(this, function (_a) {
                        if (this.mentoredTeams.length > 0) {
                            resp = this.mentoredTeams.find(function (team) {
                                return team.teamId == newTeam;
                            });
                            if (resp) {
                                this.selectedMentoredTeam = resp;
                            }
                            this.id = newTeam;
                        }
                        return [2 /*return*/];
                    });
                });
            }
        },
        selectedMentoredTeam: {
            immediate: true,
            handler: function (newTeam) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, product, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newTeam) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + newTeam.teamId)];
                            case 2:
                                response = _a.sent();
                                product = response.data;
                                if (product) {
                                    newTeam.businessTrack = product.businessTrack;
                                    newTeam.teamType = product.teamType;
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                console.error(error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        $route: function (to, from) {
            return __awaiter(this, void 0, void 0, function () {
                var response, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (to.path == "/workspace") {
                                this.router = false;
                            }
                            else if (to.path == "/login") {
                                this.tabs = [];
                            }
                            this.currentRoute = to.name;
                            if (!(this.role === "Mentor")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teamsAndProduct/" + this.user.userId)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                this.mentoredTeams = this.modifyTeams(response.data);
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(this.role === "Admin" || this.role === "SuperAdmin")) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/" + this.user.userDetails["location"])];
                        case 3:
                            response = _a.sent();
                            if (response) {
                                this.mentoredTeams = this.modifyTeams(response.data);
                            }
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        _token: {
            immediate: true,
            handler: function (newToken) {
                if (newToken === null) {
                    if (this.$route.path !== "/login")
                        this.$router.push("/login");
                }
            }
        },
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, team, response, team, id, location_1, response, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newUser) return [3 /*break*/, 8];
                                if (newUser.role === "Mentor") {
                                    this.type = "mentor";
                                }
                                else if (newUser.role === "Admin") {
                                    this.type = "admin";
                                }
                                else if (newUser.role === "SuperAdmin") {
                                    this.type = "superAdmin";
                                }
                                else {
                                    this.loading = false;
                                    this.loadingPage = false;
                                }
                                if (!(newUser.role === "Mentor" || newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 4];
                                if (this.tabs.length > 0) {
                                    this.tabs = [];
                                }
                                if (!(newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 2];
                                this.role = newUser.role;
                                return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/" + newUser.userDetails["location"])];
                            case 1:
                                response = _a.sent();
                                if (response) {
                                    this.mentoredTeams = this.modifyTeams(response.data);
                                    for (team in this.mentoredTeams) {
                                        this.mentoredTeams[team].teamId;
                                        this.mentoredTeams[team].description = response.data[team].descriptionEN;
                                        this.mentoredTeams[team].mentor = this.mentoredTeams[team].teamDetails.mentor;
                                    }
                                }
                                return [3 /*break*/, 4];
                            case 2:
                                if (!(newUser.role === "Mentor")) return [3 /*break*/, 4];
                                this.role = newUser.role;
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teamsAndProduct/" + newUser.userId)];
                            case 3:
                                response = _a.sent();
                                if (response) {
                                    this.mentoredTeams = this.modifyTeams(response.data);
                                    for (team in this.mentoredTeams) {
                                        this.mentoredTeams[team].teamId;
                                        this.mentoredTeams[team].description = response.data[team].descriptionEN;
                                    }
                                }
                                _a.label = 4;
                            case 4:
                                _a.trys.push([4, 6, , 7]);
                                id = newUser.userId;
                                location_1 = newUser.userDetails.location;
                                return [4 /*yield*/, this.ui.api.post("/api/v1/admin/teams/review", {
                                        type: this.type,
                                        id: id,
                                        location: location_1
                                    })];
                            case 5:
                                response = _a.sent();
                                this.reviews = response.data;
                                return [3 /*break*/, 7];
                            case 6:
                                e_1 = _a.sent();
                                console.error(e_1);
                                return [3 /*break*/, 7];
                            case 7:
                                this.loading = false;
                                this.loadingPage = false;
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        mentoredTeams: {
            immediate: true,
            handler: function (newTeams) {
                return __awaiter(this, void 0, void 0, function () {
                    var newTeams_1, newTeams_1_1, team, response, product, e_2_1;
                    var e_2, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(this.role === "Mentor")) return [3 /*break*/, 8];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, 7, 8]);
                                newTeams_1 = __values(newTeams), newTeams_1_1 = newTeams_1.next();
                                _b.label = 2;
                            case 2:
                                if (!!newTeams_1_1.done) return [3 /*break*/, 5];
                                team = newTeams_1_1.value;
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + team.teamId)];
                            case 3:
                                response = _b.sent();
                                product = response.data;
                                team.businessTrack = product.businessTrack;
                                team.teamType = product.teamType;
                                _b.label = 4;
                            case 4:
                                newTeams_1_1 = newTeams_1.next();
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 8];
                            case 6:
                                e_2_1 = _b.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 8];
                            case 7:
                                try {
                                    if (newTeams_1_1 && !newTeams_1_1.done && (_a = newTeams_1.return)) _a.call(newTeams_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                                return [7 /*endfinally*/];
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            }
        }
    },
    computed: __assign(__assign({}, mapGetters({
        _token: "users/token",
        user: "users/user",
        currentTeam: "teams/currentTeam",
        mentoredTeam: "teams/mentoredTeam",
        _teams: "teams/teams",
        feed: "feed/feed"
    })), { sortBy: {
            get: function () {
                return this.$store.state.admin.sortBy;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateSortBy', value, { root: true });
            }
        }, sortDesc: {
            get: function () {
                return this.$store.state.admin.sortDesc;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateSortDesc', value, { root: true });
            }
        }, search: {
            get: function () {
                return this.$store.state.admin.search;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateSearch', value, { root: true });
            }
        }, semifinalsFilter: {
            get: function () {
                return this.$store.state.admin.semifinalsFilter;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateSemifinalsFilter', value, { root: true });
            }
        }, finalsFilter: {
            get: function () {
                return this.$store.state.admin.finalsFilter;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateFinalsFilter', value, { root: true });
            }
        }, businessTracksFilter: {
            get: function () {
                return this.$store.state.admin.businessTracksFilter;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateBusinessTracksFilter', value, { root: true });
            }
        }, teamTypeFilter: {
            get: function () {
                return this.$store.state.admin.teamTypeFilter;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateTeamTypeFilter', value, { root: true });
            }
        }, locationFilter: {
            get: function () {
                return this.$store.state.admin.locationFilter;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateLocationFilter', value, { root: true });
            }
        }, workshopFilter: {
            get: function () {
                return this.$store.state.admin.workshopFilter;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateWorkshopFilter', value, { root: true });
            }
        }, teams: function () {
            return this._teams;
        },
        filteredReviews: function () {
            var _this = this;
            var filteredRev = [];
            if (this.reviews.length > 0) {
                filteredRev = this.reviews.filter(function (review) {
                    if (_this.finalsFilter !== null) {
                        if (_this.semifinalsFilter !== null) {
                            return review.teamTrack.includes(_this.teamTypeFilter) &&
                                review.businessTrack.includes(_this.businessTracksFilter) &&
                                review.location.includes(_this.locationFilter) &&
                                review.workshopNr.includes(_this.workshopFilter) &&
                                review.assessment20May === _this.finalsFilter &&
                                review.assessment12Oct === _this.semifinalsFilter;
                        }
                        return review.teamTrack.includes(_this.teamTypeFilter) &&
                            review.businessTrack.includes(_this.businessTracksFilter) &&
                            review.location.includes(_this.locationFilter) &&
                            review.workshopNr.includes(_this.workshopFilter) &&
                            review.assessment20May === _this.finalsFilter;
                    }
                    else {
                        if (_this.semifinalsFilter !== null) {
                            return review.teamTrack.includes(_this.teamTypeFilter) &&
                                review.businessTrack.includes(_this.businessTracksFilter) &&
                                review.location.includes(_this.locationFilter) &&
                                review.workshopNr.includes(_this.workshopFilter) &&
                                review.assessment12Oct === _this.semifinalsFilter;
                        }
                        return review.teamTrack.includes(_this.teamTypeFilter) &&
                            review.businessTrack.includes(_this.businessTracksFilter) &&
                            review.location.includes(_this.locationFilter) &&
                            review.workshopNr.includes(_this.workshopFilter);
                    }
                });
            }
            return filteredRev;
        } }),
    methods: {
        moment: function () {
            return moment();
        },
        formatDate: function (date) {
            var time = (new Date(date)).toTimeString().split(" ");
            if (new Date(date).toString() === "Invalid Date")
                return "";
            else
                return (new Date(date)).toDateString() + " " + time[0];
        },
        openDialog: function (item) {
            this.dialog = true;
            this.team = item;
        },
        openForApprove: function (item) {
            var toApprove = this.approveDescriptions.find(function (el) { return el.teamId === item.teamId; });
            if (toApprove) {
                this.approveDialog = true;
                this.updated = toApprove;
                this.selectedTeam = item.teamId;
            }
        },
        updateColor: function (item) {
            var found = this.approveDescriptions.find(function (element) { return element.teamId === item.teamId; });
            if (found)
                return "red";
            return "green";
        },
        disabledIcon: function (item) {
            if (item) {
                var found = this.approveDescriptions.find(function (element) { return element.teamId === item.teamId; });
                if (found !== undefined)
                    return false;
                return true;
            }
            return false;
        },
        _enumToData: function (enumData, name) {
            // as any to transform from enum to property in data;
            name = name.replace(/^\w/, function (c) { return c.toLowerCase(); }) + "s";
            for (var propName in enumData) {
                if (propName !== "NONE")
                    this[name].push(enumData[propName]);
            }
        },
        clearFilters: function () {
            this.semifinalsFilter = null;
            this.finalsFilter = null;
            this.teamTypeFilter = "";
            this.businessTracksFilter = "";
            this.workshopFilter = "";
            this.locationFilter = "";
        },
        openLink: function (item) {
            var webLink = item.webLink;
            if (!webLink.includes("http://")) {
                webLink = "http://" + webLink;
            }
            window.open(webLink, "_blank");
        },
        goToTeam: function (item) {
            return __awaiter(this, void 0, void 0, function () {
                var teamId, path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            teamId = item.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", teamId)];
                        case 1:
                            _a.sent();
                            path = "/viewTeam/product/";
                            if (this.$route.path !== path)
                                this.$router.push(path + teamId);
                            return [2 /*return*/];
                    }
                });
            });
        },
        changeData: function () {
            return __awaiter(this, void 0, void 0, function () {
                var productIndex_1, response, productToUpdate, product, e_3, e_4, e_5, prd, e_6;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.team !== null && this.team.startupName != "")) return [3 /*break*/, 17];
                            this.loading = true;
                            this.loadingPage = true;
                            productIndex_1 = this.reviews.findIndex(function (el) { return el.startupName === _this.team.startupName; });
                            this.reviews[productIndex_1].updatedAt = this.formatDate(new Date()).toString();
                            return [4 /*yield*/, this.ui.api.post("/api/v1/admin/teams/review/update", {
                                    reviews: this.reviews,
                                    type: this.type
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response) return [3 /*break*/, 16];
                            this.reviews = response.data;
                            productToUpdate = this.allTeams.findIndex(function (el) { return el.startupName === _this.allTeams[productIndex_1].startupName; });
                            if (!(productToUpdate !== undefined)) return [3 /*break*/, 16];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 11, , 12]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + this.allTeams[productToUpdate].teamId)];
                        case 3:
                            product = _a.sent();
                            if (!product.data) return [3 /*break*/, 10];
                            product.data.lastMentorUpdate = this.formatDate(new Date());
                            product.data.updatedAt = this.formatDate(new Date());
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/teams/product/update", {
                                    product: product.data,
                                    upload: "",
                                    ext: ".pptx",
                                    teamId: this.allTeams[productToUpdate].teamId
                                })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            e_3 = _a.sent();
                            console.error(e_3);
                            return [3 /*break*/, 7];
                        case 7:
                            _a.trys.push([7, 9, , 10]);
                            return [4 /*yield*/, this.ui.storeDispatch("teams/updateProduct", {
                                    product: product.data,
                                    teamId: this.allTeams[productToUpdate].teamId
                                })];
                        case 8:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            e_4 = _a.sent();
                            console.error(e_4);
                            return [3 /*break*/, 10];
                        case 10: return [3 /*break*/, 12];
                        case 11:
                            e_5 = _a.sent();
                            console.error(e_5);
                            return [3 /*break*/, 12];
                        case 12:
                            prd = {
                                productId: this.allTeams[productToUpdate].productId,
                                mentorId: this.allTeams[productToUpdate].mentorId,
                                startupName: this.allTeams[productToUpdate].startupName,
                                businessTrack: this.allTeams[productToUpdate].businessTrack,
                                teamType: this.allTeams[productToUpdate].teamType,
                                workshopDay: this.allTeams[productToUpdate].workshopDay,
                                descriptionRO: this.allTeams[productToUpdate].descriptionRO,
                                descriptionEN: this.allTeams[productToUpdate].descriptionRO,
                                pendingDescriptionEN: this.allTeams[productToUpdate].pendingDescriptionEN,
                                pendingDescriptionRO: this.allTeams[productToUpdate].pendingDescriptionRO,
                                productDetails: this.allTeams[productToUpdate].productDetails,
                                lastMentorUpdate: this.formatDate(new Date()),
                                updatedAt: this.allTeams[productToUpdate].updatedAt
                            };
                            _a.label = 13;
                        case 13:
                            _a.trys.push([13, 15, , 16]);
                            return [4 /*yield*/, this.ui.storeDispatch("teams/updateProduct", {
                                    product: prd,
                                    teamId: this.allTeams[productToUpdate].teamId
                                })];
                        case 14:
                            _a.sent();
                            return [3 /*break*/, 16];
                        case 15:
                            e_6 = _a.sent();
                            console.error(e_6);
                            return [3 /*break*/, 16];
                        case 16:
                            this.dialog = false;
                            this.$forceUpdate();
                            this.loadingPage = false;
                            this.loading = false;
                            _a.label = 17;
                        case 17: return [2 /*return*/];
                    }
                });
            });
        },
        editTeam: function (team) {
            this.team = team;
            this.dialog = true;
        },
        exitDialog: function () {
            this.team = {
                postpone: ""
            };
            this.dialog = false;
        },
        exitApproveDialog: function () {
            this.updated = {
                postpone: ""
            };
            this.approveDialog = false;
        },
        approveDescription: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, res, product, found2, productIndex, e_7;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 4, , 5]);
                            if (!this.updated) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.ui.api.post("/api/v1/teams/product/approve/description", {
                                    productId: this.updated.productId,
                                    startupName: this.updated.startupName,
                                    businessTrack: this.updated.businessTrack,
                                    teamType: this.updated.teamType,
                                    workshopDay: this.updated.workshopDay,
                                    mentorId: this.updated.mentorId,
                                    descriptionRO: this.updated.pendingDescriptionRO,
                                    descriptionEN: this.updated.pendingDescriptionEN,
                                    pendingDescriptionRO: "",
                                    pendingDescriptionEN: "",
                                    productDetails: this.updated.productDetails,
                                    lastMentorUpdate: this.formatDate(new Date()),
                                    updatedAt: this.updated.updatedAt
                                })];
                        case 1:
                            response = _a.sent();
                            if (!response.data) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + this.selectedTeam)];
                        case 2:
                            res = _a.sent();
                            if (res) {
                                product = response.data;
                                if (this.updated) {
                                    this.updated.productId = product.productId;
                                    this.updated.startupName = product.startupName;
                                    this.updated.businessTrack = product.businessTrack;
                                    this.updated.teamType = product.teamType;
                                    this.updated.workshopDay = product.workshopDay;
                                    this.updated.mentorId = product.mentorId;
                                    this.updated.descriptionRO = product.descriptionRO;
                                    this.updated.descriptionEN = product.descriptionEN;
                                    this.updated.pendingDescriptionRO = product.pendingDescriptionRO;
                                    this.updated.pendingDescriptionEN = product.pendingDescriptionEN;
                                    this.updated.productDetails = product.productDetails;
                                    this.updated.lastMentorUpdate = product.lastMentorUpdate;
                                    this.updated.updatedAt = product.updatedAt;
                                    found2 = this.approveDescriptions.findIndex(function (el) { return el.teamId === _this.updated.teamId; });
                                    this.approveDescriptions.splice(found2, 1);
                                    this.disabledIcon(null);
                                    this.allDescriptions[product.productId] = product.descriptionEN;
                                    productIndex = this.reviews.findIndex(function (el) { return el.teamId === _this.updated.teamId; });
                                    this.reviews[productIndex].lastMentorUpdate = this.formatDate(new Date()).toString();
                                }
                            }
                            this.$forceUpdate();
                            _a.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            e_7 = _a.sent();
                            console.error(e_7);
                            return [3 /*break*/, 5];
                        case 5:
                            this.approveDialog = false;
                            return [2 /*return*/];
                    }
                });
            });
        },
        selectTeam: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.id = team.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", team.teamId)];
                        case 1:
                            _a.sent();
                            this.changeRoute("/viewTeam/composition");
                            return [2 /*return*/];
                    }
                });
            });
        },
        editProduct: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.id = team.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", team.teamId)];
                        case 1:
                            _a.sent();
                            this.changeRoute("/viewTeam/product");
                            return [2 /*return*/];
                    }
                });
            });
        },
        teamActivity: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.id = team.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", team.teamId)];
                        case 1:
                            _a.sent();
                            this.changeRoute("/viewTeam/activities");
                            return [2 /*return*/];
                    }
                });
            });
        },
        productNewUpdates: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.id = team.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", team.teamId)];
                        case 1:
                            _a.sent();
                            this.changeRoute("/viewTeam/feed");
                            return [2 /*return*/];
                    }
                });
            });
        },
        openCanvas: function (team) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.id = team.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", team.teamId)];
                        case 1:
                            _a.sent();
                            this.changeRoute("/viewTeam/canvas");
                            return [2 /*return*/];
                    }
                });
            });
        },
        modifyTeams: function (newTeams) {
            var e_8, _a;
            var newArray = [];
            try {
                for (var newTeams_2 = __values(newTeams), newTeams_2_1 = newTeams_2.next(); !newTeams_2_1.done; newTeams_2_1 = newTeams_2.next()) {
                    var team = newTeams_2_1.value;
                    team.updatedAt = new Date(this.formatDate(team.updatedAt));
                    team.lastMentorUpdate = new Date(this.formatDate(team.lastMentorUpdate));
                    this.allTeams.push(team);
                    if (team.pendingDescriptionEN !== "" || team.pendingDescriptionRO !== "") {
                        this.existsUpdate = true;
                        this.approveDescriptions.push(team);
                    }
                    ;
                    this.allDescriptions[team.teamId] = team.descriptionEN;
                    var newTeam = {
                        teamId: team.teamId,
                        productId: team.productId,
                        year: team.year,
                        location: team.location,
                        teamName: team.teamName,
                        teamDetails: team.teamDetails,
                        businessTrack: team.businessTrack,
                        teamType: team.teamType,
                        pendingDescriptionRO: team.pendingDescriptionRO,
                        pendingDescriptionEN: team.pendingDescriptionEN,
                        updatedAt: team.updatedAt,
                        lastMentorUpdate: team.lastMentorUpdate,
                        mentor: "",
                        description: ""
                    };
                    newArray.push(newTeam);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (newTeams_2_1 && !newTeams_2_1.done && (_a = newTeams_2.return)) _a.call(newTeams_2);
                }
                finally { if (e_8) throw e_8.error; }
            }
            var found = this.allTeams.findIndex(function (el) { return el.startupName === ""; });
            this.allTeams.splice(found, 1);
            this.allTeams = this.allTeams.sort(function (a, b) {
                var nameA = a.startupName.toUpperCase();
                var nameB = b.startupName.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            return newArray;
        },
        pushToTabs: function (tab) {
            if (this.tabs.find(function (item) {
                return item.link === tab.link;
            }) === undefined) {
                this.tabs.push(tab);
            }
        },
        checkRoute: function () {
            if (this.$router.currentRoute.path === "/workspace")
                return true;
            else
                return false;
        },
        pushBack: function () {
            this.$router.go(-1);
        },
        changeRoute: function (link) {
            if ((this.role === "Mentor" || this.role === "Admin" || this.role === "SuperAdmin") && this.selectedMentoredTeam.teamId !== "" && link.split("/")[1] === "viewTeam") {
                if (this.$route.path !== link + "/" + this.id)
                    this.$router.push(link + "/" + this.id);
            }
            else {
                if (this.$route.path !== link)
                    this.$router.push(link);
            }
        }
    }
});

/* script */
const __vue_script__$7 = script$7;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-app",
    [
      _c("v-container", { attrs: { "background-color": "#fcfcfc" } }, [
        _c(
          "div",
          { staticClass: "justify-center" },
          [
            _c(
              "v-row",
              {
                staticClass: "mb-6",
                attrs: { justify: "center", "no-gutters": "" }
              },
              [
                _c(
                  "v-row",
                  { staticClass: "justify-center", attrs: { align: "center" } },
                  [
                    _c(
                      "v-col",
                      { staticClass: "d-flex align-start flex-column" },
                      [
                        _vm.role !== "Mentor" && _vm.role !== "User"
                          ? _c("h1", { staticClass: "landing-message" }, [
                              _vm._v("Admin View")
                            ])
                          : _c("h1", { staticClass: "landing-message" }, [
                              _vm._v("Mentor View")
                            ])
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "v-col",
                      { staticClass: "d-flex align-end flex-column" },
                      [
                        _c(
                          "v-tooltip",
                          {
                            attrs: { bottom: "" },
                            scopedSlots: _vm._u([
                              {
                                key: "activator",
                                fn: function(ref) {
                                  var on = ref.on;
                                  var attrs = ref.attrs;
                                  return [
                                    _c(
                                      "v-btn",
                                      _vm._g(
                                        _vm._b(
                                          {
                                            attrs: {
                                              fab: "",
                                              medium: "",
                                              right: "",
                                              color: "#197E81"
                                            },
                                            on: {
                                              click: function($event) {
                                                return _vm.changeRoute(
                                                  "/assessment"
                                                )
                                              }
                                            }
                                          },
                                          "v-btn",
                                          attrs,
                                          false
                                        ),
                                        on
                                      ),
                                      [
                                        _c(
                                          "v-icon",
                                          { attrs: { color: "#fcfcfc" } },
                                          [_vm._v("mdi-chart-box-outline")]
                                        )
                                      ],
                                      1
                                    )
                                  ]
                                }
                              }
                            ])
                          },
                          [
                            _vm._v(" "),
                            _c("span", [_vm._v("Check Assessments")])
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
              "v-row",
              { staticClass: "mb-6", attrs: { justify: "center" } },
              [
                _c(
                  "v-card",
                  {
                    staticClass: "mx-auto",
                    attrs: { flat: "", color: "#fcfcfc" }
                  },
                  [
                    _c("v-data-table", {
                      staticClass: "elevation-2",
                      attrs: {
                        "item-key": "startupName",
                        headers: _vm.headers,
                        items: _vm.filteredReviews,
                        search: _vm.search,
                        "single-expand": false,
                        itemsPerPage: -1,
                        "show-expand": "",
                        "multi-sort": "",
                        "sort-by": _vm.sortBy,
                        "sort-desc": _vm.sortDesc,
                        expanded: _vm.expanded,
                        loading: _vm.filteredReviews.length <= 0,
                        "loading-text": "Loading teams"
                      },
                      on: {
                        "update:sortBy": function($event) {
                          _vm.sortBy = $event;
                        },
                        "update:sort-by": function($event) {
                          _vm.sortBy = $event;
                        },
                        "update:sortDesc": function($event) {
                          _vm.sortDesc = $event;
                        },
                        "update:sort-desc": function($event) {
                          _vm.sortDesc = $event;
                        },
                        "update:expanded": function($event) {
                          _vm.expanded = $event;
                        }
                      },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "top",
                            fn: function() {
                              return [
                                _c("v-text-field", {
                                  attrs: {
                                    "append-icon": "mdi-magnify",
                                    label: "Search",
                                    "single-line": "",
                                    "hide-details": ""
                                  },
                                  model: {
                                    value: _vm.search,
                                    callback: function($$v) {
                                      _vm.search = $$v;
                                    },
                                    expression: "search"
                                  }
                                })
                              ]
                            },
                            proxy: true
                          },
                          {
                            key: "header",
                            fn: function() {
                              return [
                                _c(
                                  "div",
                                  [
                                    _c("v-divider", {
                                      staticClass: "mx-4",
                                      attrs: { inset: "", vertical: "" }
                                    }),
                                    _vm._v(" "),
                                    _c("v-spacer"),
                                    _vm._v(" "),
                                    _vm.updated
                                      ? _c(
                                          "v-dialog",
                                          {
                                            attrs: {
                                              persistent: "",
                                              "max-width": "600px"
                                            },
                                            model: {
                                              value: _vm.approveDialog,
                                              callback: function($$v) {
                                                _vm.approveDialog = $$v;
                                              },
                                              expression: "approveDialog"
                                            }
                                          },
                                          [
                                            _c(
                                              "v-card",
                                              [
                                                _c(
                                                  "v-form",
                                                  {
                                                    attrs: {
                                                      "lazy-validation": ""
                                                    },
                                                    model: {
                                                      value: _vm.validDesc,
                                                      callback: function($$v) {
                                                        _vm.validDesc = $$v;
                                                      },
                                                      expression: "validDesc"
                                                    }
                                                  },
                                                  [
                                                    _c(
                                                      "v-card-title",
                                                      {
                                                        staticClass:
                                                          "justify-center",
                                                        staticStyle: {
                                                          "font-family":
                                                            "Georgia, serif"
                                                        }
                                                      },
                                                      [
                                                        _vm._v(
                                                          "Approve Pending Description"
                                                        )
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c("v-divider"),
                                                    _vm._v(" "),
                                                    _c(
                                                      "v-card-text",
                                                      [
                                                        _c("div", [
                                                          _vm._v("Startup Name")
                                                        ]),
                                                        _vm._v(" "),
                                                        _c("v-text-field", {
                                                          attrs: {
                                                            readonly: "",
                                                            outlined: "",
                                                            rounded: "",
                                                            color: "primary",
                                                            rules:
                                                              _vm.startupRules
                                                          },
                                                          model: {
                                                            value:
                                                              _vm.updated
                                                                .startupName,
                                                            callback: function(
                                                              $$v
                                                            ) {
                                                              _vm.$set(
                                                                _vm.updated,
                                                                "startupName",
                                                                $$v
                                                              );
                                                            },
                                                            expression:
                                                              "updated.startupName"
                                                          }
                                                        }),
                                                        _vm._v(" "),
                                                        _c("div", [
                                                          _vm._v(
                                                            "Pending English Description"
                                                          )
                                                        ]),
                                                        _vm._v(" "),
                                                        _c("v-textarea", {
                                                          attrs: {
                                                            outlined: "",
                                                            rounded: "",
                                                            color: "primary",
                                                            rules:
                                                              _vm.rulesDesc,
                                                            "no-resize": "",
                                                            counter: "600"
                                                          },
                                                          model: {
                                                            value:
                                                              _vm.updated
                                                                .pendingDescriptionEN,
                                                            callback: function(
                                                              $$v
                                                            ) {
                                                              _vm.$set(
                                                                _vm.updated,
                                                                "pendingDescriptionEN",
                                                                $$v
                                                              );
                                                            },
                                                            expression:
                                                              "updated.pendingDescriptionEN"
                                                          }
                                                        }),
                                                        _vm._v(" "),
                                                        _c("div", [
                                                          _vm._v(
                                                            "Pending Romanian Description"
                                                          )
                                                        ]),
                                                        _vm._v(" "),
                                                        _c("v-textarea", {
                                                          attrs: {
                                                            outlined: "",
                                                            rounded: "",
                                                            color: "primary",
                                                            rules:
                                                              _vm.rulesDesc,
                                                            "no-resize": "",
                                                            counter: "600"
                                                          },
                                                          model: {
                                                            value:
                                                              _vm.updated
                                                                .pendingDescriptionRO,
                                                            callback: function(
                                                              $$v
                                                            ) {
                                                              _vm.$set(
                                                                _vm.updated,
                                                                "pendingDescriptionRO",
                                                                $$v
                                                              );
                                                            },
                                                            expression:
                                                              "updated.pendingDescriptionRO"
                                                          }
                                                        })
                                                      ],
                                                      1
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "v-card-actions",
                                                      [
                                                        _c(
                                                          "v-card-actions",
                                                          {
                                                            staticClass:
                                                              "justify-center"
                                                          },
                                                          [
                                                            _c(
                                                              "v-btn",
                                                              {
                                                                attrs: {
                                                                  disabled: !_vm.validDesc,
                                                                  rounded: "",
                                                                  color:
                                                                    "primary"
                                                                },
                                                                on: {
                                                                  click: function(
                                                                    $event
                                                                  ) {
                                                                    return _vm.approveDescription()
                                                                  }
                                                                }
                                                              },
                                                              [
                                                                _vm._v(
                                                                  "Approve Descriptions"
                                                                )
                                                              ]
                                                            ),
                                                            _vm._v(" "),
                                                            _c(
                                                              "v-btn",
                                                              {
                                                                attrs: {
                                                                  color:
                                                                    "primary",
                                                                  text: ""
                                                                },
                                                                on: {
                                                                  click: function(
                                                                    $event
                                                                  ) {
                                                                    return _vm.exitApproveDialog()
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
                                          ],
                                          1
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _vm.team
                                      ? _c(
                                          "v-dialog",
                                          {
                                            attrs: {
                                              persistent: "",
                                              "max-width": "600px"
                                            },
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
                                              [
                                                _vm.team
                                                  ? _c(
                                                      "v-form",
                                                      {
                                                        attrs: {
                                                          "lazy-validation": ""
                                                        },
                                                        model: {
                                                          value: _vm.valid,
                                                          callback: function(
                                                            $$v
                                                          ) {
                                                            _vm.valid = $$v;
                                                          },
                                                          expression: "valid"
                                                        }
                                                      },
                                                      [
                                                        _c(
                                                          "v-card-title",
                                                          {
                                                            staticClass:
                                                              "justify-center",
                                                            staticStyle: {
                                                              "font-family":
                                                                "Georgia, serif"
                                                            }
                                                          },
                                                          [
                                                            _vm._v(
                                                              "Edit Team Details"
                                                            )
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c("v-divider"),
                                                        _vm._v(" "),
                                                        _c(
                                                          "v-card-text",
                                                          {
                                                            staticStyle: {
                                                              "margin-top":
                                                                "50px"
                                                            }
                                                          },
                                                          [
                                                            _c("v-text-field", {
                                                              attrs: {
                                                                outlined: "",
                                                                rounded: "",
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-lightbulb-on-outline",
                                                                label:
                                                                  "Startup Name",
                                                                optional: "",
                                                                rules:
                                                                  _vm.startupRules
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .startupName,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "startupName",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.startupName"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-text-field", {
                                                              attrs: {
                                                                outlined: "",
                                                                rounded: "",
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-map-marker-outline",
                                                                label:
                                                                  "Location",
                                                                optional: ""
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .location,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "location",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.location"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-text-field", {
                                                              attrs: {
                                                                outlined: "",
                                                                rounded: "",
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-account-tie-outline",
                                                                label: "Mentor",
                                                                optional: ""
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .mentor,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "mentor",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.mentor"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-text-field", {
                                                              attrs: {
                                                                outlined: "",
                                                                rounded: "",
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-web",
                                                                label:
                                                                  "Website",
                                                                optional: ""
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .webLink,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "webLink",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.webLink"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-textarea", {
                                                              attrs: {
                                                                rounded: "",
                                                                outlined: "",
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-script-text-outline",
                                                                rules:
                                                                  _vm.rulesDesc,
                                                                label:
                                                                  "Description",
                                                                optional: ""
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .description,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "description",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.description"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-select", {
                                                              attrs: {
                                                                label:
                                                                  "Team Track",
                                                                optional: "",
                                                                items:
                                                                  _vm.teamTypes,
                                                                "prepend-icon":
                                                                  "mdi-briefcase-search-outline",
                                                                color: "primary"
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .teamTrack,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "teamTrack",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.teamTrack"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-select", {
                                                              attrs: {
                                                                label:
                                                                  "Business Track",
                                                                items:
                                                                  _vm.businessTracks,
                                                                optional: "",
                                                                "prepend-icon":
                                                                  "mdi-domain",
                                                                color: "primary"
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .businessTrack,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "businessTrack",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.businessTrack"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-text-field", {
                                                              attrs: {
                                                                outlined: "",
                                                                rounded: "",
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-calendar-month-outline",
                                                                label:
                                                                  "Workshop Nr.",
                                                                optional: ""
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .workshopNr,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "workshopNr",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.workshopNr"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _vm.user.role ===
                                                            "Mentor"
                                                              ? _c(
                                                                  "v-textarea",
                                                                  {
                                                                    attrs: {
                                                                      rounded:
                                                                        "",
                                                                      outlined:
                                                                        "",
                                                                      color:
                                                                        "primary",
                                                                      "prepend-icon":
                                                                        "mdi-note-text-outline",
                                                                      label:
                                                                        "Mentor Notes",
                                                                      optional:
                                                                        ""
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        _vm.team
                                                                          .mentorNotes,
                                                                      callback: function(
                                                                        $$v
                                                                      ) {
                                                                        _vm.$set(
                                                                          _vm.team,
                                                                          "mentorNotes",
                                                                          $$v
                                                                        );
                                                                      },
                                                                      expression:
                                                                        "team.mentorNotes"
                                                                    }
                                                                  }
                                                                )
                                                              : _vm._e(),
                                                            _vm._v(" "),
                                                            _vm.user.role ===
                                                            "Admin"
                                                              ? _c(
                                                                  "v-textarea",
                                                                  {
                                                                    attrs: {
                                                                      rounded:
                                                                        "",
                                                                      outlined:
                                                                        "",
                                                                      color:
                                                                        "primary",
                                                                      "prepend-icon":
                                                                        "mdi-note-text-outline",
                                                                      label:
                                                                        "Admin Notes",
                                                                      optional:
                                                                        ""
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        _vm.team
                                                                          .adminNotes,
                                                                      callback: function(
                                                                        $$v
                                                                      ) {
                                                                        _vm.$set(
                                                                          _vm.team,
                                                                          "adminNotes",
                                                                          $$v
                                                                        );
                                                                      },
                                                                      expression:
                                                                        "team.adminNotes"
                                                                    }
                                                                  }
                                                                )
                                                              : _vm._e(),
                                                            _vm._v(" "),
                                                            _c("v-select", {
                                                              attrs: {
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-clipboard-check-outline",
                                                                items:
                                                                  _vm.values,
                                                                "item-text":
                                                                  "text",
                                                                "item-value":
                                                                  "value",
                                                                label:
                                                                  "Assessment Finals"
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .assessment20May,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "assessment20May",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.assessment20May"
                                                              }
                                                            }),
                                                            _vm._v(" "),
                                                            _c("v-select", {
                                                              attrs: {
                                                                color:
                                                                  "primary",
                                                                "prepend-icon":
                                                                  "mdi-clipboard-check-outline",
                                                                items:
                                                                  _vm.values,
                                                                "item-text":
                                                                  "text",
                                                                "item-value":
                                                                  "value",
                                                                label:
                                                                  "Assessment SemiFinals"
                                                              },
                                                              model: {
                                                                value:
                                                                  _vm.team
                                                                    .assessment12Oct,
                                                                callback: function(
                                                                  $$v
                                                                ) {
                                                                  _vm.$set(
                                                                    _vm.team,
                                                                    "assessment12Oct",
                                                                    $$v
                                                                  );
                                                                },
                                                                expression:
                                                                  "team.assessment12Oct"
                                                              }
                                                            })
                                                          ],
                                                          1
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "v-card-actions",
                                                          {
                                                            staticClass:
                                                              "justify-center"
                                                          },
                                                          [
                                                            _c(
                                                              "v-btn",
                                                              {
                                                                attrs: {
                                                                  disabled: !_vm.valid,
                                                                  rounded: "",
                                                                  color:
                                                                    "primary"
                                                                },
                                                                on: {
                                                                  click: function(
                                                                    $event
                                                                  ) {
                                                                    return _vm.changeData()
                                                                  }
                                                                }
                                                              },
                                                              [_vm._v("Apply")]
                                                            ),
                                                            _vm._v(" "),
                                                            _c(
                                                              "v-btn",
                                                              {
                                                                attrs: {
                                                                  color:
                                                                    "primary",
                                                                  text: ""
                                                                },
                                                                on: {
                                                                  click: function(
                                                                    $event
                                                                  ) {
                                                                    return _vm.exitDialog()
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
                                                  : _vm._e()
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
                              ]
                            },
                            proxy: true
                          },
                          {
                            key: "item.actions",
                            fn: function(ref) {
                              var item = ref.item;
                              return [
                                _c(
                                  "v-icon",
                                  {
                                    attrs: { small: "" },
                                    on: {
                                      click: function($event) {
                                        return _vm.openDialog(item)
                                      }
                                    }
                                  },
                                  [
                                    _vm._v(
                                      "\n\t\t\t\t\t\t\t\tmdi-pencil mdi-24px\n\t\t\t\t\t\t\t"
                                    )
                                  ]
                                )
                              ]
                            }
                          },
                          {
                            key: "item.updated",
                            fn: function(ref) {
                              var item = ref.item;
                              return [
                                _c(
                                  "v-icon",
                                  {
                                    attrs: {
                                      small: "",
                                      color: _vm.updateColor(item),
                                      disabled: _vm.disabledIcon(item)
                                    },
                                    on: {
                                      click: function($event) {
                                        return _vm.openForApprove(item)
                                      }
                                    }
                                  },
                                  [
                                    _vm._v(
                                      "\n\t\t\t\t\t\t\t\tmdi-chat-processing mdi-24px\n\t\t\t\t\t\t\t"
                                    )
                                  ]
                                )
                              ]
                            }
                          },
                          {
                            key: "item.assessment12Oct",
                            fn: function(ref) {
                              var item = ref.item;
                              return [
                                _c("v-simple-checkbox", {
                                  attrs: { disabled: "" },
                                  model: {
                                    value: item.assessment12Oct,
                                    callback: function($$v) {
                                      _vm.$set(item, "assessment12Oct", $$v);
                                    },
                                    expression: "item.assessment12Oct"
                                  }
                                })
                              ]
                            }
                          },
                          {
                            key: "item.assessment20May",
                            fn: function(ref) {
                              var item = ref.item;
                              return [
                                _c("v-simple-checkbox", {
                                  attrs: { disabled: "" },
                                  model: {
                                    value: item.assessment20May,
                                    callback: function($$v) {
                                      _vm.$set(item, "assessment20May", $$v);
                                    },
                                    expression: "item.assessment20May"
                                  }
                                })
                              ]
                            }
                          },
                          {
                            key: "expanded-item",
                            fn: function(ref) {
                              var headers = ref.headers;
                              var item = ref.item;
                              return [
                                _c(
                                  "td",
                                  { attrs: { colspan: headers.length } },
                                  [
                                    _c(
                                      "v-card",
                                      { attrs: { flat: "", outlined: "" } },
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
                                            _vm._v(
                                              "\n\t\t\t\t\t\t\t\t\tTeam Description\n\t\t\t\t\t\t\t\t"
                                            )
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "v-card-text",
                                          {
                                            staticStyle: {
                                              "font-family": "Georgia",
                                              "font-size": "16px"
                                            }
                                          },
                                          [
                                            _vm._v(
                                              "\n\t\t\t\t\t\t\t\t\t" +
                                                _vm._s(
                                                  _vm.allDescriptions[
                                                    item.teamId
                                                  ]
                                                ) +
                                                "\n\t\t\t\t\t\t\t\t"
                                            )
                                          ]
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
                                                  rounded: "",
                                                  color: "primary",
                                                  disabled:
                                                    item.webLink.trim() === ""
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.openLink(item)
                                                  }
                                                }
                                              },
                                              [_vm._v("Visit Website")]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "v-btn",
                                              {
                                                attrs: {
                                                  rounded: "",
                                                  color: "primary"
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.selectTeam(item)
                                                  }
                                                }
                                              },
                                              [_vm._v("Edit Team")]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "v-btn",
                                              {
                                                attrs: {
                                                  rounded: "",
                                                  color: "primary"
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.editProduct(item)
                                                  }
                                                }
                                              },
                                              [_vm._v("Edit Product")]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "v-btn",
                                              {
                                                attrs: {
                                                  rounded: "",
                                                  color: "primary"
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.teamActivity(
                                                      item
                                                    )
                                                  }
                                                }
                                              },
                                              [_vm._v("Team Activity")]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "v-btn",
                                              {
                                                attrs: {
                                                  rounded: "",
                                                  color: "primary"
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.productNewUpdates(
                                                      item
                                                    )
                                                  }
                                                }
                                              },
                                              [_vm._v("Product Updates")]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "v-btn",
                                              {
                                                attrs: {
                                                  rounded: "",
                                                  color: "primary"
                                                },
                                                on: {
                                                  click: function($event) {
                                                    return _vm.openCanvas(item)
                                                  }
                                                }
                                              },
                                              [_vm._v("Canvas")]
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
                              ]
                            }
                          }
                        ],
                        null,
                        true
                      )
                    }),
                    _vm._v(" "),
                    _c("v-divider", {
                      staticStyle: {
                        "margin-top": "30px",
                        "margin-bottom": "30px"
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
      ]),
      _vm._v(" "),
      _c(
        "v-navigation-drawer",
        {
          attrs: {
            clipped: "",
            app: "",
            permanent: "",
            right: "",
            "mini-variant": _vm.mini
          },
          on: {
            "update:miniVariant": function($event) {
              _vm.mini = $event;
            },
            "update:mini-variant": function($event) {
              _vm.mini = $event;
            }
          },
          model: {
            value: _vm.drawer,
            callback: function($$v) {
              _vm.drawer = $$v;
            },
            expression: "drawer"
          }
        },
        [
          _c(
            "v-list",
            [
              _c(
                "v-list-item",
                [
                  !_vm.mini
                    ? _c(
                        "v-btn",
                        {
                          attrs: { icon: "" },
                          on: {
                            click: function($event) {
                              $event.stopPropagation();
                              _vm.mini = !_vm.mini;
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("mdi-chevron-right")])],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "v-list-item-icon",
                    [_c("v-icon", [_vm._v("mdi-filter")])],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-list-item-title", [
                    _vm._v("\n\t\t\t\t\tTable Filters\n\t\t\t\t")
                  ])
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("v-divider"),
          _vm._v(" "),
          _c(
            "v-list",
            { attrs: { nav: "", dense: "" } },
            [
              _c(
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.teamTypeFilter.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-radar")
                          ])
                        : _c("v-icon", [_vm._v("mdi-radar")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: { items: _vm.teamTypes, label: "Team Track" },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.teamTypeFilter.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.teamTypeFilter = "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.teamTypeFilter,
                          callback: function($$v) {
                            _vm.teamTypeFilter = $$v;
                          },
                          expression: "teamTypeFilter"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.businessTracksFilter.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-domain")
                          ])
                        : _c("v-icon", [_vm._v("mdi-domain")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.businessTracks,
                          label: "Business Track"
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.businessTracksFilter.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.businessTracksFilter = "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.businessTracksFilter,
                          callback: function($$v) {
                            _vm.businessTracksFilter = $$v;
                          },
                          expression: "businessTracksFilter"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.finalsFilter !== null
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-flag-checkered")
                          ])
                        : _c("v-icon", [_vm._v("mdi-flag-checkered")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.values,
                          "item-text": "text",
                          "item-value": "value",
                          label: "Assessment Finals"
                        },
                        model: {
                          value: _vm.finalsFilter,
                          callback: function($$v) {
                            _vm.finalsFilter = $$v;
                          },
                          expression: "finalsFilter"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.semifinalsFilter !== null
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-flag")
                          ])
                        : _c("v-icon", [_vm._v("mdi-flag")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.values,
                          "item-text": "text",
                          "item-value": "value",
                          label: "Assessment SemiFinals"
                        },
                        model: {
                          value: _vm.semifinalsFilter,
                          callback: function($$v) {
                            _vm.semifinalsFilter = $$v;
                          },
                          expression: "semifinalsFilter"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.locationFilter.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-city")
                          ])
                        : _c("v-icon", [_vm._v("mdi-city")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: { items: _vm.locations, label: "Location" },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.locationFilter.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.locationFilter = "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.locationFilter,
                          callback: function($$v) {
                            _vm.locationFilter = $$v;
                          },
                          expression: "locationFilter"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.workshopFilter.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-briefcase")
                          ])
                        : _c("v-icon", [_vm._v("mdi-briefcase")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: { items: _vm.workshopDays, label: "Workshop" },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.workshopFilter.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.workshopFilter = "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.workshopFilter,
                          callback: function($$v) {
                            _vm.workshopFilter = $$v;
                          },
                          expression: "workshopFilter"
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
                "v-list-item",
                [
                  _c(
                    "v-list-item-icon",
                    [_c("v-icon", [_vm._v("mdi-filter-off")])],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c(
                        "v-btn",
                        {
                          attrs: {
                            outlined: "",
                            rounded: "",
                            color: "primary"
                          },
                          on: {
                            click: function($event) {
                              return _vm.clearFilters()
                            }
                          }
                        },
                        [_vm._v("Clear Filters")]
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
  )
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$7 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    false,
    undefined,
    undefined,
    undefined
  );

var script$8 = Vue.extend({
    name: "Assessment",
    components: {},
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _varToString, name;
            return __generator(this, function (_a) {
                _varToString = function (varObj) { return Object.keys(varObj)[0]; };
                name = _varToString({ BusinessTrack: BusinessTrack });
                this._enumToData(BusinessTrack, name);
                name = _varToString({ TeamType: TeamType });
                this._enumToData(TeamType, name);
                name = _varToString({ WorkshopDay: WorkshopDay });
                this._enumToData(WorkshopDay, name);
                return [2 /*return*/];
            });
        });
    },
    data: function () {
        return {
            ui: UI$1.getInstance(),
            teamId: "",
            role: "",
            drawer: true,
            mini: true,
            router: false,
            show: true,
            currentContent: true,
            mentoredTeams: [],
            selectedMentoredTeam: {},
            id: "",
            editElement: true,
            dialog: false,
            team: null,
            reviews: [],
            type: "",
            loadingPage: false,
            values: [
                { text: "Yes", value: true },
                { text: "No", value: false },
                { text: "NONE", value: null },
            ],
            teamTypes: [
                "Spin-off",
                "Start-up",
                "Scale-up"
            ],
            businessTracks: [
                "Agriculture",
                "CyberSecurity",
                "FinTech",
                "Health&Lifestyle",
                "Retail",
                "SmartCity",
                "SmartMobility",
                "Other"
            ],
            workshopDays: [],
            locations: [
                "Bucharest",
                "Cluj",
                "Iasi",
                "Sibiu",
                "Timisoara"
            ],
            loading: false,
            headers: [
                {
                    text: "Location",
                    align: "left",
                    sortable: true,
                    value: "location"
                },
                { text: "Startup Name", value: "startupName" },
                { text: "Team Track", value: "teamType" },
                { text: "Business Track", value: "businessTrack" },
                { text: "Assesment SemiFinals", value: "assesSemiFinals" },
                { text: "Assesment Finals", value: "assesFinals" },
            ],
            teams: [],
        };
    },
    filters: {
        moment: function (date) {
            return moment(date).format("MMMM Do YYYY, h:mm:ss a");
        }
    },
    watch: {
        mentoredTeam: {
            immediate: true,
            handler: function (newTeam) {
                return __awaiter(this, void 0, void 0, function () {
                    var resp;
                    return __generator(this, function (_a) {
                        if (this.mentoredTeams.length > 0) {
                            resp = this.mentoredTeams.find(function (team) {
                                return team.teamId == newTeam;
                            });
                            if (resp) {
                                this.selectedMentoredTeam = resp;
                            }
                            this.id = newTeam;
                        }
                        return [2 /*return*/];
                    });
                });
            }
        },
        selectedMentoredTeam: {
            immediate: true,
            handler: function (newTeam) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, product, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newTeam) return [3 /*break*/, 4];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + newTeam.teamId)];
                            case 2:
                                response = _a.sent();
                                product = response.data;
                                if (product) {
                                    newTeam.businessTrack = product.businessTrack;
                                    newTeam.teamType = product.teamType;
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                console.error(error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        $route: function (to, from) {
            return __awaiter(this, void 0, void 0, function () {
                var response, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.role === "Mentor")) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teamsAndProduct/" + this.user.userId)];
                        case 1:
                            response = _a.sent();
                            if (response) {
                                this.teams = this.modifyTeams(response.data);
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(this.role === "Admin" || this.role === "SuperAdmin")) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/" + this.user.userDetails["location"])];
                        case 3:
                            response = _a.sent();
                            if (response) {
                                this.teams = this.modifyTeams(response.data);
                            }
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        _token: {
            immediate: true,
            handler: function (newToken) {
                if (newToken === null) {
                    if (this.$route.path !== "/login")
                        this.$router.push("/login");
                }
            }
        },
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!newUser) return [3 /*break*/, 5];
                                this.loading = true;
                                this.loadingPage = true;
                                if (newUser.role === "Mentor") {
                                    this.type = "mentor";
                                }
                                else if (newUser.role === "Admin") {
                                    this.type = "admin";
                                }
                                else if (newUser.role === "SuperAdmin") {
                                    this.type = "superAdmin";
                                }
                                else {
                                    this.loading = false;
                                    this.loadingPage = false;
                                }
                                if (!(newUser.role === "Mentor" || newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 4];
                                if (!(newUser.role === "Admin" || newUser.role === "SuperAdmin")) return [3 /*break*/, 2];
                                this.role = newUser.role;
                                return [4 /*yield*/, this.ui.api.get("/api/v1/admin/teams/" + newUser.userDetails["location"])];
                            case 1:
                                response = _a.sent();
                                if (response) {
                                    this.teams = this.modifyTeams(response.data);
                                }
                                return [3 /*break*/, 4];
                            case 2:
                                if (!(newUser.role === "Mentor")) return [3 /*break*/, 4];
                                this.role = newUser.role;
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/mentor/teamsAndProduct/" + newUser.userId)];
                            case 3:
                                response = _a.sent();
                                if (response) {
                                    this.teams = this.modifyTeams(response.data);
                                }
                                _a.label = 4;
                            case 4:
                                this.loading = false;
                                this.loadingPage = false;
                                _a.label = 5;
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }
        },
        teams: {
            immediate: true,
            handler: function (newTeams) {
                return __awaiter(this, void 0, void 0, function () {
                    var newTeams_1, newTeams_1_1, team, response, product, e_1_1;
                    var e_1, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(this.role === "Mentor")) return [3 /*break*/, 8];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, 7, 8]);
                                newTeams_1 = __values(newTeams), newTeams_1_1 = newTeams_1.next();
                                _b.label = 2;
                            case 2:
                                if (!!newTeams_1_1.done) return [3 /*break*/, 5];
                                team = newTeams_1_1.value;
                                return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + team.teamId)];
                            case 3:
                                response = _b.sent();
                                product = response.data;
                                team.businessTrack = product.businessTrack;
                                team.teamType = product.teamType;
                                _b.label = 4;
                            case 4:
                                newTeams_1_1 = newTeams_1.next();
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 8];
                            case 6:
                                e_1_1 = _b.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 8];
                            case 7:
                                try {
                                    if (newTeams_1_1 && !newTeams_1_1.done && (_a = newTeams_1.return)) _a.call(newTeams_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 8: return [2 /*return*/];
                        }
                    });
                });
            },
        }
    },
    computed: __assign(__assign({}, mapGetters({
        _token: "users/token",
        user: "users/user",
    })), { sortByAssessment: {
            get: function () {
                return this.$store.state.admin.sortByAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentSortBy', value, { root: true });
            }
        }, sortDescAssessment: {
            get: function () {
                return this.$store.state.admin.sortDescAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentSortDesc', value, { root: true });
            }
        }, searchAssessment: {
            get: function () {
                return this.$store.state.admin.searchAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentSearch', value, { root: true });
            }
        }, semifinalsFilterAssessment: {
            get: function () {
                return this.$store.state.admin.semifinalsFilterAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentSemifinalsFilter', value, { root: true });
            }
        }, finalsFilterAssessment: {
            get: function () {
                return this.$store.state.admin.finalsFilterAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentFinalsFilter', value, { root: true });
            }
        }, businessTracksFilterAssessment: {
            get: function () {
                return this.$store.state.admin.businessTracksFilterAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentBusinessTracksFilter', value, { root: true });
            }
        }, teamTypeFilterAssessment: {
            get: function () {
                return this.$store.state.admin.teamTypeFilterAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentTeamTypeFilter', value, { root: true });
            }
        }, locationFilterAssessment: {
            get: function () {
                return this.$store.state.admin.locationFilterAssessment;
            },
            set: function (value) {
                this.ui.storeDispatch('admin/updateAssessmentLocationFilter', value, { root: true });
            }
        }, filteredTeams: function () {
            var _this = this;
            var filteredTeam = [];
            if (this.teams.length > 0) {
                filteredTeam = this.teams.filter(function (team) {
                    if (_this.finalsFilterAssessment !== null) {
                        if (_this.semifinalsFilterAssessment !== null) {
                            return team.teamType.includes(_this.teamTypeFilterAssessment) &&
                                team.businessTrack.includes(_this.businessTracksFilterAssessment) &&
                                team.location.includes(_this.locationFilterAssessment) &&
                                team.assesFinals === _this.finalsFilterAssessment &&
                                team.assesSemiFinals === _this.semifinalsFilterAssessment;
                        }
                        return team.teamType.includes(_this.teamTypeFilterAssessment) &&
                            team.businessTrack.includes(_this.businessTracksFilterAssessment) &&
                            team.location.includes(_this.locationFilterAssessment) &&
                            team.assesFinals === _this.finalsFilterAssessment;
                    }
                    else {
                        if (_this.semifinalsFilterAssessment !== null) {
                            return team.teamType.includes(_this.teamTypeFilterAssessment) &&
                                team.businessTrack.includes(_this.businessTracksFilterAssessment) &&
                                team.location.includes(_this.locationFilterAssessment) &&
                                team.assesSemiFinals === _this.semifinalsFilterAssessment;
                        }
                        return team.teamType.includes(_this.teamTypeFilterAssessment) &&
                            team.businessTrack.includes(_this.businessTracksFilterAssessment) &&
                            team.location.includes(_this.locationFilterAssessment);
                    }
                });
            }
            return filteredTeam;
        } }),
    methods: {
        moment: function () {
            return moment();
        },
        formatDate: function (date) {
            var time = (new Date(date)).toTimeString().split(" ");
            if (new Date(date).toString() === "Invalid Date")
                return "";
            else
                return (new Date(date)).toDateString() + " " + time[0];
        },
        openDialog: function (item) {
            this.dialog = true;
            this.team = item;
        },
        _enumToData: function (enumData, name) {
            // as any to transform from enum to property in data;
            name = name.replace(/^\w/, function (c) { return c.toLowerCase(); }) + "s";
            for (var propName in enumData) {
                if (propName !== "NONE")
                    this[name].push(enumData[propName]);
            }
        },
        clearFilters: function () {
            this.semifinalsFilterAssessment = null;
            this.finalsFilterAssessment = null;
            this.teamTypeFilterAssessment = "";
            this.businessTracksFilterAssessment = "";
            this.locationFilterAssessment = "";
        },
        openLink: function (item) {
            var webLink = item.webLink;
            if (!webLink.includes("http://")) {
                webLink = "http://" + webLink;
            }
            window.open(webLink, "_blank");
        },
        goToTeam: function (item) {
            return __awaiter(this, void 0, void 0, function () {
                var teamId, path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            teamId = item.teamId;
                            return [4 /*yield*/, this.$store.dispatch("teams/mentorTeam", teamId)];
                        case 1:
                            _a.sent();
                            path = "/viewTeam/product/";
                            if (this.$route.path !== path)
                                this.$router.push(path + teamId);
                            return [2 /*return*/];
                    }
                });
            });
        },
        modifyTeams: function (newTeams) {
            var e_2, _a;
            var newArray = [];
            try {
                for (var newTeams_2 = __values(newTeams), newTeams_2_1 = newTeams_2.next(); !newTeams_2_1.done; newTeams_2_1 = newTeams_2.next()) {
                    var team = newTeams_2_1.value;
                    team.assesSemiFinals = team.productDetails["assessment12Oct"];
                    team.assesFinals = team.productDetails["assessment20May"];
                    newArray.push(team);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (newTeams_2_1 && !newTeams_2_1.done && (_a = newTeams_2.return)) _a.call(newTeams_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            newArray = newArray.sort(function (a, b) {
                var nameA = a.startupName.toUpperCase();
                var nameB = b.startupName.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            return newArray;
        },
        checkRoute: function () {
            if (this.$router.currentRoute.path === "/workspace")
                return true;
            else
                return false;
        },
        updateProduct: function (item) {
            return __awaiter(this, void 0, void 0, function () {
                var response, product, resp, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/teams/product/" + item.teamId)];
                        case 1:
                            response = _a.sent();
                            product = response.data;
                            if (!product) return [3 /*break*/, 3];
                            product.productDetails.assessment20May = item.assesFinals;
                            product.productDetails.assessment12Oct = item.assesSemiFinals;
                            return [4 /*yield*/, this.ui.api.post("/api/v1/teams/product/update", { teamId: item.teamId, product: product })];
                        case 2:
                            resp = _a.sent();
                            if (!resp) {
                                console.log("ERROR");
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            console.log("ERROR");
                            _a.label = 4;
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            error_2 = _a.sent();
                            console.error(error_2);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
    }
});

/* script */
const __vue_script__$8 = script$8;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-app",
    [
      _c("v-container", { attrs: { "background-color": "#fcfcfc" } }, [
        _c(
          "div",
          { staticClass: "justify-center" },
          [
            _c(
              "v-row",
              {
                staticClass: "mb-6",
                attrs: { justify: "center", "no-gutters": "" }
              },
              [
                _c(
                  "v-col",
                  [
                    _c(
                      "v-row",
                      {
                        staticClass: "justify-center",
                        attrs: { align: "center" }
                      },
                      [
                        _c("h1", { staticClass: "landing-message" }, [
                          _vm._v("Assessment View")
                        ])
                      ]
                    ),
                    _vm._v(" "),
                    _c("v-row", [_c("v-divider")], 1)
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "v-row",
              { staticClass: "mb-6", attrs: { justify: "center" } },
              [
                _c(
                  "v-card",
                  {
                    staticClass: "mx-auto",
                    attrs: { flat: "", color: "#fcfcfc" }
                  },
                  [
                    _c("v-data-table", {
                      attrs: {
                        "item-key": "startupName",
                        headers: _vm.headers,
                        items: _vm.filteredTeams,
                        search: _vm.searchAssessment,
                        "multi-sort": "",
                        itemsPerPage: -1,
                        "sort-by": _vm.sortByAssessment,
                        "sort-desc": _vm.sortDescAssessment,
                        loading: _vm.filteredTeams.length <= 0,
                        "loading-text": "Loading teams"
                      },
                      on: {
                        "update:sortBy": function($event) {
                          _vm.sortByAssessment = $event;
                        },
                        "update:sort-by": function($event) {
                          _vm.sortByAssessment = $event;
                        },
                        "update:sortDesc": function($event) {
                          _vm.sortDescAssessment = $event;
                        },
                        "update:sort-desc": function($event) {
                          _vm.sortDescAssessment = $event;
                        }
                      },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "top",
                            fn: function() {
                              return [
                                _c("v-text-field", {
                                  attrs: {
                                    "append-icon": "mdi-magnify",
                                    label: "Search",
                                    "single-line": "",
                                    "hide-details": ""
                                  },
                                  model: {
                                    value: _vm.searchAssessment,
                                    callback: function($$v) {
                                      _vm.searchAssessment = $$v;
                                    },
                                    expression: "searchAssessment"
                                  }
                                })
                              ]
                            },
                            proxy: true
                          },
                          {
                            key: "item.assesSemiFinals",
                            fn: function(ref) {
                              var item = ref.item;
                              return [
                                _c("v-simple-checkbox", {
                                  attrs: { color: "#197E81" },
                                  on: {
                                    input: function($event) {
                                      return _vm.updateProduct(item)
                                    }
                                  },
                                  model: {
                                    value: item.assesSemiFinals,
                                    callback: function($$v) {
                                      _vm.$set(item, "assesSemiFinals", $$v);
                                    },
                                    expression: "item.assesSemiFinals"
                                  }
                                })
                              ]
                            }
                          },
                          {
                            key: "item.assesFinals",
                            fn: function(ref) {
                              var item = ref.item;
                              return [
                                _c("v-simple-checkbox", {
                                  attrs: { color: "#197E81" },
                                  on: {
                                    input: function($event) {
                                      return _vm.updateProduct(item)
                                    }
                                  },
                                  model: {
                                    value: item.assesFinals,
                                    callback: function($$v) {
                                      _vm.$set(item, "assesFinals", $$v);
                                    },
                                    expression: "item.assesFinals"
                                  }
                                })
                              ]
                            }
                          }
                        ],
                        null,
                        true
                      )
                    }),
                    _vm._v(" "),
                    _c("v-divider", {
                      staticStyle: {
                        "margin-top": "30px",
                        "margin-bottom": "30px"
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
      ]),
      _vm._v(" "),
      _c(
        "v-navigation-drawer",
        {
          attrs: {
            clipped: "",
            app: "",
            permanent: "",
            right: "",
            "mini-variant": _vm.mini
          },
          on: {
            "update:miniVariant": function($event) {
              _vm.mini = $event;
            },
            "update:mini-variant": function($event) {
              _vm.mini = $event;
            }
          },
          model: {
            value: _vm.drawer,
            callback: function($$v) {
              _vm.drawer = $$v;
            },
            expression: "drawer"
          }
        },
        [
          _c(
            "v-list",
            [
              _c(
                "v-list-item",
                [
                  !_vm.mini
                    ? _c(
                        "v-btn",
                        {
                          attrs: { icon: "" },
                          on: {
                            click: function($event) {
                              $event.stopPropagation();
                              _vm.mini = !_vm.mini;
                            }
                          }
                        },
                        [_c("v-icon", [_vm._v("mdi-chevron-right")])],
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "v-list-item-icon",
                    [_c("v-icon", [_vm._v("mdi-filter")])],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-list-item-title", [
                    _vm._v("\n\t\t\t\t\tTable Filters\n\t\t\t\t")
                  ])
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("v-divider"),
          _vm._v(" "),
          _c(
            "v-list",
            { attrs: { nav: "", dense: "" } },
            [
              _c(
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.teamTypeFilterAssessment.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-radar")
                          ])
                        : _c("v-icon", [_vm._v("mdi-radar")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: { items: _vm.teamTypes, label: "Team Track" },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.teamTypeFilterAssessment.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.teamTypeFilterAssessment = "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.teamTypeFilterAssessment,
                          callback: function($$v) {
                            _vm.teamTypeFilterAssessment = $$v;
                          },
                          expression: "teamTypeFilterAssessment"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.businessTracksFilterAssessment.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-domain")
                          ])
                        : _c("v-icon", [_vm._v("mdi-domain")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.businessTracks,
                          label: "Business Track"
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.businessTracksFilterAssessment.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.businessTracksFilterAssessment =
                                              "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.businessTracksFilterAssessment,
                          callback: function($$v) {
                            _vm.businessTracksFilterAssessment = $$v;
                          },
                          expression: "businessTracksFilterAssessment"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.finalsFilterAssessment !== null
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-flag-checkered")
                          ])
                        : _c("v-icon", [_vm._v("mdi-flag-checkered")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.values,
                          "item-text": "text",
                          "item-value": "value",
                          label: "Assesment Finals"
                        },
                        model: {
                          value: _vm.finalsFilterAssessment,
                          callback: function($$v) {
                            _vm.finalsFilterAssessment = $$v;
                          },
                          expression: "finalsFilterAssessment"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.semifinalsFilterAssessment !== null
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-flag")
                          ])
                        : _c("v-icon", [_vm._v("mdi-flag")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: {
                          items: _vm.values,
                          "item-text": "text",
                          "item-value": "value",
                          label: "Assesment SemiFinals"
                        },
                        model: {
                          value: _vm.semifinalsFilterAssessment,
                          callback: function($$v) {
                            _vm.semifinalsFilterAssessment = $$v;
                          },
                          expression: "semifinalsFilterAssessment"
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
                "v-list-item",
                { attrs: { link: "" } },
                [
                  _c(
                    "v-list-item-icon",
                    [
                      _vm.locationFilterAssessment.trim() !== ""
                        ? _c("v-icon", { attrs: { color: "#197E81" } }, [
                            _vm._v("mdi-city")
                          ])
                        : _c("v-icon", [_vm._v("mdi-city")])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c("v-select", {
                        attrs: { items: _vm.locations, label: "Location" },
                        scopedSlots: _vm._u([
                          {
                            key: "prepend",
                            fn: function() {
                              return [
                                _vm.locationFilterAssessment.trim() !== ""
                                  ? _c(
                                      "v-btn",
                                      {
                                        attrs: { icon: "" },
                                        on: {
                                          click: function($event) {
                                            _vm.locationFilterAssessment = "";
                                          }
                                        }
                                      },
                                      [_c("v-icon", [_vm._v("mdi-close")])],
                                      1
                                    )
                                  : _vm._e()
                              ]
                            },
                            proxy: true
                          }
                        ]),
                        model: {
                          value: _vm.locationFilterAssessment,
                          callback: function($$v) {
                            _vm.locationFilterAssessment = $$v;
                          },
                          expression: "locationFilterAssessment"
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
                "v-list-item",
                [
                  _c(
                    "v-list-item-icon",
                    [_c("v-icon", [_vm._v("mdi-filter-off")])],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-list-item-content",
                    [
                      _c(
                        "v-btn",
                        {
                          attrs: {
                            outlined: "",
                            rounded: "",
                            color: "primary"
                          },
                          on: {
                            click: function($event) {
                              return _vm.clearFilters()
                            }
                          }
                        },
                        [_vm._v("Clear Filters")]
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
  )
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__$8 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    false,
    undefined,
    undefined,
    undefined
  );

function usersStore() {
    var store = {
        namespaced: true,
        state: {
            sortBy: undefined,
            sortDesc: undefined,
            search: "",
            semifinalsFilter: null,
            finalsFilter: null,
            businessTracksFilter: "",
            teamTypeFilter: "",
            locationFilter: "",
            workshopFilter: "",
            sortByAssessment: undefined,
            sortDescAssessment: undefined,
            searchAssessment: "",
            semifinalsFilterAssessment: null,
            finalsFilterAssessment: null,
            businessTracksFilterAssessment: "",
            teamTypeFilterAssessment: "",
            locationFilterAssessment: ""
        },
        getters: {
            sortBy: function (state) { return state.sortBy; },
            sortDesc: function (state) { return state.sortDesc; },
            search: function (state) { return state.search; },
            semifinalsFilter: function (state) { return state.semifinalsFilter; },
            finalsFilter: function (state) { return state.finalsFilter; },
            businessTracksFilter: function (state) { return state.businessTracksFilter; },
            teamTypeFilter: function (state) { return state.teamTypeFilter; },
            locationFilter: function (state) { return state.locationFilter; },
            workshopFilter: function (state) { return state.workshopFilter; },
            sortByAssessment: function (state) { return state.sortByAssessment; },
            sortDescAssessment: function (state) { return state.sortDescAssessment; },
            searchAssessment: function (state) { return state.searchAssessment; },
            semifinalsFilterAssessment: function (state) { return state.semifinalsFilterAssessment; },
            finalsFilterAssessment: function (state) { return state.finalsFilterAssessment; },
            businessTracksFilterAssessment: function (state) { return state.businessTracksFilterAssessment; },
            teamTypeFilterAssessment: function (state) { return state.teamTypeFilterAssessment; },
            locationFilterAssessment: function (state) { return state.locationFilterAssessment; }
        },
        mutations: {
            setSortBy: function (state, newSortBy) {
                state.sortBy = newSortBy;
            },
            setSortDesc: function (state, newSortDesc) {
                state.sortDesc = newSortDesc;
            },
            setSearch: function (state, newSearch) {
                state.search = newSearch;
            },
            setSemifinalsFilter: function (state, newSemifinalsFilter) {
                state.semifinalsFilter = newSemifinalsFilter;
            },
            setFinalsFilter: function (state, newFinalsFilter) {
                state.finalsFilter = newFinalsFilter;
            },
            setBusinessTracksFilter: function (state, newBusinessTracksFilter) {
                state.businessTracksFilter = newBusinessTracksFilter;
            },
            setTeamTypeFilter: function (state, newTeamTypeFilter) {
                state.teamTypeFilter = newTeamTypeFilter;
            },
            setLocationFilter: function (state, newLocationFilter) {
                state.locationFilter = newLocationFilter;
            },
            setWorkshopFilter: function (state, newWorkshopFilter) {
                state.workshopFilter = newWorkshopFilter;
            },
            setAssessmentSortBy: function (state, newSortBy) {
                state.sortByAssessment = newSortBy;
            },
            setAssessmentSortDesc: function (state, newSortDesc) {
                state.sortDescAssessment = newSortDesc;
            },
            setAssessmentSearch: function (state, newSearch) {
                state.searchAssessment = newSearch;
            },
            setAssessmentSemifinalsFilter: function (state, newSemifinalsFilter) {
                state.semifinalsFilterAssessment = newSemifinalsFilter;
            },
            setAssessmentFinalsFilter: function (state, newFinalsFilter) {
                state.finalsFilterAssessment = newFinalsFilter;
            },
            setAssessmentBusinessTracksFilter: function (state, newBusinessTracksFilter) {
                state.businessTracksFilterAssessment = newBusinessTracksFilter;
            },
            setAssessmentTeamTypeFilter: function (state, newTeamTypeFilter) {
                state.teamTypeFilterAssessment = newTeamTypeFilter;
            },
            setAssessmentLocationFilter: function (state, newLocationFilter) {
                state.locationFilterAssessment = newLocationFilter;
            },
        },
        actions: {
            updateSortBy: function (store, newSortBy) {
                store.commit("setSortBy", newSortBy);
            },
            updateSortDesc: function (store, newSortDesc) {
                store.commit("setSortDesc", newSortDesc);
            },
            updateSearch: function (store, newSearch) {
                store.commit("setSearch", newSearch);
            },
            updateSemifinalsFilter: function (store, newSemifinalsFilter) {
                store.commit("setSemifinalsFilter", newSemifinalsFilter);
            },
            updateFinalsFilter: function (store, newFinalsFilter) {
                store.commit("setFinalsFilter", newFinalsFilter);
            },
            updateBusinessTracksFilter: function (store, newBusinessTracksFilter) {
                store.commit("setBusinessTracksFilter", newBusinessTracksFilter);
            },
            updateTeamTypeFilter: function (store, newTeamTypeFilter) {
                store.commit("setTeamTypeFilter", newTeamTypeFilter);
            },
            updateLocationFilter: function (store, newLocationFilter) {
                store.commit("setLocationFilter", newLocationFilter);
            },
            updateWorkshopFilter: function (store, newWorkshopFilter) {
                store.commit("setWorkshopFilter", newWorkshopFilter);
            },
            updateAssessmentSortBy: function (store, newSortBy) {
                store.commit("setAssessmentSortBy", newSortBy);
            },
            updateAssessmentSortDesc: function (store, newSortDesc) {
                store.commit("setAssessmentSortDesc", newSortDesc);
            },
            updateAssessmentSearch: function (store, newSearch) {
                store.commit("setAssessmentSearch", newSearch);
            },
            updateAssessmentSemifinalsFilter: function (store, newSemifinalsFilter) {
                store.commit("setAssessmentSemifinalsFilter", newSemifinalsFilter);
            },
            updateAssessmentFinalsFilter: function (store, newFinalsFilter) {
                store.commit("setAssessmentFinalsFilter", newFinalsFilter);
            },
            updateAssessmentBusinessTracksFilter: function (store, newBusinessTracksFilter) {
                store.commit("setAssessmentBusinessTracksFilter", newBusinessTracksFilter);
            },
            updateAssessmentTeamTypeFilter: function (store, newTeamTypeFilter) {
                store.commit("setAssessmentTeamTypeFilter", newTeamTypeFilter);
            },
            updateAssessmentLocationFilter: function (store, newLocationFilter) {
                store.commit("setAssessmentLocationFilter", newLocationFilter);
            },
        }
    };
    return store;
}

var e_1, _a;
var workspaceUi = WorkspaceUI.getInstance();
workspaceUi.registerToolbarButton(__vue_component__$5, {
    position: ToolbarButtonPosition.RIGHT,
    priority: 4
});
var routes = [];
routes.push({
    path: '/admin/users',
    name: "Admin - Users",
    component: __vue_component__$1
}, {
    path: '/admin/exports',
    name: "Admin - Exports",
    component: __vue_component__$6
}, {
    path: '/admin/workshops',
    name: "Admin - Workshops",
    component: __vue_component__$4
}, {
    path: '/admin/teams',
    name: "Admin - Teams",
    component: __vue_component__$2
}, {
    path: "/admin/csv",
    name: "CSV Upload",
    component: __vue_component__$3
});
var workspaceRoutes = [
    {
        path: '/admin',
        name: "Admin",
        children: routes,
        component: __vue_component__
    },
    {
        path: '/dashboard',
        name: "Dashboard",
        children: [],
        component: __vue_component__$7
    },
    {
        path: '/assessment',
        name: "Assessment",
        children: [],
        component: __vue_component__$8
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
var ui = UI$1.getInstance();
ui.registerStore("admin", usersStore());

export { AdminUi, getAdminUi };
