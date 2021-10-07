import Vue from 'vue';
import { UI as UI$1 } from '@startupway/main/lib/ui';

var MenuUi = /** @class */ (function () {
    function MenuUi() {
    }
    return MenuUi;
}());
var UI = new MenuUi();
function getMenuUi() {
    return UI;
}

var SnackBarTypes;
(function (SnackBarTypes) {
    SnackBarTypes["ERROR"] = "error";
    SnackBarTypes["INFO"] = "info";
    SnackBarTypes["SUCCESS"] = "success";
})(SnackBarTypes || (SnackBarTypes = {}));
var SnackBarHorizontal;
(function (SnackBarHorizontal) {
    SnackBarHorizontal["LEFT"] = "left";
    SnackBarHorizontal["RIGHT"] = "right";
})(SnackBarHorizontal || (SnackBarHorizontal = {}));
var SnackBarVertical;
(function (SnackBarVertical) {
    SnackBarVertical["TOP"] = "top";
    SnackBarVertical["BOTTOM"] = "bottom";
})(SnackBarVertical || (SnackBarVertical = {}));

var script = Vue.extend({
    name: "SimpleMenu",
    watch: {
        options: {
            immediate: true,
            handler: function (newOptions) {
                if (newOptions.menuTooltip === "View Your Teams") {
                    if (newOptions.items.length > 0)
                        this.$emit('click', newOptions.items[0].id);
                }
            }
        }
    },
    props: {
        options: {
            required: true,
            type: Object
        }
    },
    data: function () {
        return {
            id: Number,
        };
    },
    methods: {
        click: function (menuItem) {
            if (menuItem.link) {
                if (this.$route.path !== menuItem.link)
                    this.$router.push(menuItem.link);
            }
            else {
                this.$emit('click', menuItem.id);
            }
        },
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
    "v-menu",
    {
      attrs: { left: "", bottom: "", "offset-y": "" },
      scopedSlots: _vm._u([
        {
          key: "activator",
          fn: function(ref) {
            var menu = ref.on;
            return [
              _c(
                "v-tooltip",
                {
                  attrs: { bottom: "" },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "activator",
                        fn: function(ref) {
                          var tooltip = ref.on;
                          return [
                            _c(
                              "v-btn",
                              _vm._g(
                                { attrs: { text: "" } },
                                Object.assign({}, tooltip, menu)
                              ),
                              [
                                _c(
                                  "v-list-item-avatar",
                                  [
                                    _vm.options.img !== undefined &&
                                    _vm.options.img !== ""
                                      ? _c("v-img", {
                                          attrs: { src: _vm.options.img }
                                        })
                                      : _vm.options.menuIcon
                                      ? _c("v-icon", [
                                          _vm._v(_vm._s(_vm.options.menuIcon))
                                        ])
                                      : _c("v-icon", [
                                          _vm._v("mdi-error-outline")
                                        ])
                                  ],
                                  1
                                ),
                                _vm._v(
                                  "\n\t\t\t\t\t" +
                                    _vm._s(_vm.options.menuName) +
                                    "\n\t\t\t\t"
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
                },
                [
                  _vm._v(" "),
                  _vm.options.menuTooltip
                    ? _c("span", [_vm._v(_vm._s(_vm.options.menuTooltip))])
                    : _c("span", [_vm._v("ERROR")])
                ]
              )
            ]
          }
        }
      ])
    },
    [
      _vm._v(" "),
      _vm.options
        ? _c(
            "v-list",
            _vm._l(_vm.options.items, function(item, index) {
              return _c(
                "v-list-item",
                {
                  key: index,
                  on: {
                    click: function($event) {
                      _vm.click(item);
                    }
                  }
                },
                [
                  _c(
                    "v-list-item-avatar",
                    [
                      item.img !== undefined && item.img !== ""
                        ? _c("v-img", {
                            attrs: { small: "", avatar: "", src: item.img }
                          })
                        : _c("v-icon", [_vm._v(_vm._s(item.icon))])
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-list-item-title", [_vm._v(_vm._s(item.title))])
                ],
                1
              )
            }),
            1
          )
        : _c(
            "v-list",
            [
              _c(
                "v-list-item",
                [
                  _c(
                    "v-list-item-icon",
                    [_c("v-icon", [_vm._v("mdi-error-outline")])],
                    1
                  ),
                  _vm._v(" "),
                  _c("v-list-item-title", [
                    _vm._v(" " + _vm._s(_vm.item.title))
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
    name: "SnackBar",
    watch: {
        snackbar: function () {
            var _this = this;
            if (this.snackbar) {
                var timeout = (this.options.timeout && this.options.timeout !== -1 ? this.options.timeout : 3000);
                setTimeout(function () {
                    _this.$emit("update-snackbar", false);
                }, timeout);
            }
        },
        options: {
            immediate: true,
            deep: true,
            handler: function () {
                console.log("options changed");
                console.log(this.options);
                switch (this.options.horizontal) {
                    case SnackBarHorizontal.LEFT:
                        this.left = true;
                        this.right = false;
                    case SnackBarHorizontal.RIGHT:
                        this.left = false;
                        this.right = true;
                    default:
                        this.left = false;
                        this.right = true;
                }
                switch (this.options.vertical) {
                    case SnackBarVertical.TOP:
                        this.top = true;
                        this.bottom = false;
                    case SnackBarVertical.BOTTOM:
                        this.top = false;
                        this.bottom = true;
                    default:
                        this.top = true;
                        this.bottom = false;
                }
            }
        }
    },
    props: {
        options: {
            required: true,
            type: Object
        },
        snackbar: {
            required: true,
            type: Boolean
        }
    },
    data: function () {
        var timeout = -1;
        var left = false;
        var right = false;
        var top = false;
        var bottom = false;
        return {
            timeout: timeout,
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };
    },
    methods: {
        closeSnackbar: function () {
            this.$emit("update-snackbar", false);
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
    "div",
    { staticClass: "text-center" },
    [
      _c(
        "v-snackbar",
        {
          attrs: {
            timeout: _vm.timeout,
            left: _vm.left,
            right: _vm.right,
            top: _vm.top,
            bottom: _vm.bottom
          },
          model: {
            value: _vm.snackbar,
            callback: function($$v) {
              _vm.snackbar = $$v;
            },
            expression: "snackbar"
          }
        },
        [
          _vm._v(
            "\n\t\t" +
              _vm._s(
                _vm.options.text && _vm.options.text !== ""
                  ? _vm.options.text
                  : "Unkown error"
              ) +
              "\n\t\t"
          ),
          _c(
            "v-btn",
            {
              attrs: { color: _vm.options.type, text: "" },
              on: {
                click: function($event) {
                  return _vm.closeSnackbar()
                }
              }
            },
            [_vm._v("\n\t\t\tClose\n\t\t")]
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

var ui = UI$1.getInstance();
ui.registerView(__vue_component__);
ui.registerView(__vue_component__$1);

export { MenuUi, SnackBarHorizontal, SnackBarTypes, SnackBarVertical, getMenuUi };
