import Vue from 'vue';
export { default as Vue } from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import axios from 'axios';

var script = Vue.extend({
    name: "Application",
    methods: {
        functionOne: function () {
            console.log("WORK");
        },
    },
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
  return _c("v-app", [_c("router-view")], 1)
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

var UI = /** @class */ (function () {
    function UI() {
        this.api = axios.create();
        this.router = new VueRouter();
        this.vuetifyOptions = {
            theme: {
                themes: {
                    light: {
                        primary: '#197E81',
                        secondary: '#3c5459',
                        accent: '#F5C00C',
                        error: '#971c19',
                    },
                    dark: {
                        primary: '#165455',
                        secondary: '#ffffff',
                        accent: '#231F20',
                        error: '#971c19',
                    },
                },
            }
        };
        this.routes = [];
    }
    UI.prototype.start = function () {
        Vue.use(Vuex);
        var storeData = {
            state: {
                version: "1.0.0"
            },
            modules: {},
            strict: process.env.NODE_ENV !== "production"
        };
        this.store = new Store(storeData);
        var vuetify = new Vuetify(this.vuetifyOptions);
        Vue.use(VueRouter);
        Vue.use(Vuetify, {
            font: 'mdi',
            iconfont: 'mdi'
        });
        var v = new Vue({
            el: '#app',
            vuetify: vuetify,
            store: this.store,
            router: this.router,
            render: function (render) {
                return render(__vue_component__);
            }
        });
        if (v !== undefined) {
            // start the ui instance
            console.log("Started App");
        }
    };
    UI.prototype.registerStore = function (namespace, store) {
        if (this.store) {
            // TODO check if it is already registered
            this.store.registerModule(namespace, store);
        }
        else {
            this.error('Unable to register store module ' + namespace + ', store has not been already started');
        }
    };
    UI.prototype.storeDispatch = function (action, obj, global) {
        if (!global)
            return this.store.dispatch(action, obj);
        else
            return this.store.dispatch(action, obj, global);
    };
    UI.prototype.registerRoute = function (newRoute, parent) {
        if (parent && typeof parent === "string") {
            this.router.addRoute(parent, newRoute);
        }
        else {
            this.router.addRoute(newRoute);
        }
    };
    UI.prototype.registerView = function (view) {
        Vue.component(view.options.name, view);
    };
    UI.prototype.error = function (err) {
        console.error(err);
    };
    UI.getInstance = function () {
        if (!UI.instance) {
            UI.instance = new UI();
            UI.instance.start();
        }
        return UI.instance;
    };
    return UI;
}());

export { UI };
