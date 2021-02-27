import Vue from 'vue';
import { mapGetters } from 'vuex';
import { UI as UI$1 } from '@startupway/main/lib/ui';
import { find, remove } from 'lodash';
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

var WorkshopUi = /** @class */ (function () {
    function WorkshopUi() {
    }
    return WorkshopUi;
}());
var UI = new WorkshopUi();
function getWorkshopUi() {
    return UI;
}

var script = Vue.extend({
    name: "Workshop",
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.ui.api.get("/api/v1/workshops")];
                    case 1:
                        response = _a.sent();
                        if (response) {
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
            workshops: [],
            activeUsers: {},
            instances: {},
            teamIds: [],
            // as any same as canvas
            teams: [],
            selected: 0,
            attendance: [],
            userRole: ""
        };
    },
    watch: {
        user: {
            immediate: true,
            handler: function (newUser) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (newUser.role === "Mentor" || newUser.role === "Admin" || newUser.role === "SuperAdmin") {
                            this.userRole = newUser.role;
                        }
                        return [2 /*return*/];
                    });
                });
            }
        },
        selected: {
            immediate: true,
            handler: function (newWorkshopId) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b, _i, date, _loop_1, this_1, _c, _d, workshop, e_2_1;
                    var e_2, _e;
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
                                    var e_3, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0: return [4 /*yield*/, this_1.ui.api.get("/api/v1/teams/team/users/" + workshop.teamId)];
                                            case 1:
                                                response = _d.sent();
                                                if (response) {
                                                    name_1 = "";
                                                    try {
                                                        for (_a = (e_3 = void 0, __values(this_1.teams)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                            team = _b.value;
                                                            if (this_1.user.role === "Admin") {
                                                                if (team.teams_teamId === workshop.teamId)
                                                                    name_1 = team.teams_teamName;
                                                            }
                                                            else if (this_1.user.role === "Mentor") {
                                                                if (team.teamId === workshop.teamId)
                                                                    name_1 = team.teams_teamName;
                                                            }
                                                        }
                                                    }
                                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                                    finally {
                                                        try {
                                                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                                        }
                                                        finally { if (e_3) throw e_3.error; }
                                                    }
                                                    users = response.data;
                                                    users.forEach(function (user) {
                                                        var tempUser = user;
                                                        tempUser.programmingDetails = {};
                                                        tempUser.programmingDetails["team"] = name_1;
                                                        tempUser.programmingDetails["teamId"] = workshop.teamId;
                                                        var foundAttended = find(_this.attendance, function (userAttendance) {
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
                                _c = (e_2 = void 0, __values(this.instances[date])), _d = _c.next();
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
                                e_2_1 = _f.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 11];
                            case 10:
                                try {
                                    if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                                }
                                finally { if (e_2) throw e_2.error; }
                                return [7 /*endfinally*/];
                            case 11:
                                _i++;
                                return [3 /*break*/, 3];
                            case 12: return [2 /*return*/];
                        }
                    });
                });
            }
        }
    },
    computed: __assign({}, mapGetters({
        currentTeam: "teams/currentTeam",
        user: "users/user"
    })),
    methods: {
        getWorkshopInstances: function (newWorkshopId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, response, _a, _b, team, response, e_4;
                var e_5, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 7, , 8]);
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
                                    // as any same as canvas
                                    this.teamIds.push(team.teamId);
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_5) throw e_5.error; }
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
                            e_4 = _d.sent();
                            console.error(e_4);
                            return [2 /*return*/, false];
                        case 8: return [2 /*return*/, false];
                    }
                });
            });
        },
        getAttendance: function (newWorkshopId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, e_6;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.get("/api/v1/workshop/attendance/" + newWorkshopId)];
                        case 1:
                            response = _b.sent();
                            if (response) {
                                (_a = this.attendance).push.apply(_a, __spread(response.data));
                                return [2 /*return*/, true];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_6 = _b.sent();
                            console.error(e_6);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/, false];
                    }
                });
            });
        },
        pushToAttendance: function (user, date) {
            return __awaiter(this, void 0, void 0, function () {
                var workshopInstanceId, _a, _b, workshop;
                var e_7, _c;
                return __generator(this, function (_d) {
                    workshopInstanceId = "";
                    if (!user.programmingDetails["present"]) {
                        try {
                            // as any this.instances = _.Dictionary<WorkshopInstances> | {[key:string]:WorkshopInstances} ?
                            for (_a = __values(this.instances[date]), _b = _a.next(); !_b.done; _b = _a.next()) {
                                workshop = _b.value;
                                if (workshop.teamId == user.programmingDetails["teamId"]) {
                                    workshopInstanceId = workshop.workshopInstanceId;
                                    break;
                                }
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_7) throw e_7.error; }
                        }
                        user.programmingDetails["present"] = true;
                        this.attendance.push({
                            attendanceId: v4(),
                            workshopInstanceId: workshopInstanceId,
                            attendanceDate: date,
                            userId: user.userId
                        });
                    }
                    else {
                        remove(this.attendance, function (att) {
                            return att.userId === user.userId;
                        });
                        user.programmingDetails["present"] = false;
                    }
                    this.$forceUpdate();
                    return [2 /*return*/];
                });
            });
        },
        submitAttendance: function () {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.ui.api.post("/api/v1/workshop/attendance", {
                                    attendance: this.attendance,
                                    workshopId: this.selected
                                })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 3];
                        case 3:
                            this.$forceUpdate();
                            this.selected = this.selected;
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
      _c(
        "v-container",
        [
          _c("v-select", {
            attrs: {
              items: _vm.workshops,
              "item-text": "workshopName",
              "item-value": "workshopId",
              label: "Workshop"
            },
            model: {
              value: _vm.selected,
              callback: function($$v) {
                _vm.selected = $$v;
              },
              expression: "selected"
            }
          }),
          _vm._v(" "),
          _vm.selected
            ? _c(
                "v-container",
                [
                  _c(
                    "v-item-group",
                    [
                      _c(
                        "v-row",
                        _vm._l(_vm.instances, function(workshop, date) {
                          return _c(
                            "v-col",
                            { key: date },
                            [
                              _c(
                                "v-card",
                                [
                                  _c(
                                    "v-card-title",
                                    { attrs: { "primary-title": "" } },
                                    [
                                      _vm._v(
                                        "\n\t\t\t\t\t\t\t\t" +
                                          _vm._s(date) +
                                          "\n\t\t\t\t\t\t\t"
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "v-card-text",
                                    [
                                      _c(
                                        "v-list",
                                        _vm._l(_vm.activeUsers[date], function(
                                          team,
                                          idx
                                        ) {
                                          return _c(
                                            "v-list-item-group",
                                            { key: idx },
                                            [
                                              _c(
                                                "v-card",
                                                [
                                                  _c("v-card-title", [
                                                    _vm._v(
                                                      _vm._s(team.teamName)
                                                    )
                                                  ]),
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
                                                            _vm._v(
                                                              "\n\t\t\t\t\t\t\t\t\t\t\t\t\t" +
                                                                _vm._s(
                                                                  user.firstName
                                                                ) +
                                                                " " +
                                                                _vm._s(
                                                                  user.lastName
                                                                ) +
                                                                "\n\t\t\t\t\t\t\t\t\t\t\t\t\t"
                                                            ),
                                                            user
                                                              .programmingDetails[
                                                              "present"
                                                            ]
                                                              ? _c("h3", [
                                                                  _vm._v(
                                                                    "Present"
                                                                  )
                                                                ])
                                                              : _vm._e()
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "v-list-item-action",
                                                          [
                                                            _c(
                                                              "v-btn",
                                                              {
                                                                attrs: {
                                                                  text: ""
                                                                },
                                                                on: {
                                                                  click: function(
                                                                    $event
                                                                  ) {
                                                                    return _vm.pushToAttendance(
                                                                      user,
                                                                      date
                                                                    )
                                                                  }
                                                                }
                                                              },
                                                              [
                                                                _vm._v(
                                                                  "Present"
                                                                )
                                                              ]
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
                                        }),
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
                        }),
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      attrs: { color: "primary" },
                      on: {
                        click: function($event) {
                          return _vm.submitAttendance()
                        }
                      }
                    },
                    [_vm._v("Submit")]
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

var e_1, _a;
var workspaceUi = WorkspaceUI.getInstance();
var workspaceRoutes = [
    {
        path: "/workshop",
        name: "Workshop",
        component: __vue_component__
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

export { WorkshopUi, getWorkshopUi };
