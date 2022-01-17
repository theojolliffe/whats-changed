
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity$5 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/ui/Warning.svelte generated by Svelte v3.43.1 */

    const file$v = "src/ui/Warning.svelte";

    function create_fragment$y(ctx) {
    	let div;
    	let strong;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			strong = element("strong");
    			strong.textContent = "Warning!";
    			t1 = text(" This prototype uses 2011 data in lieu of the latest Census 2021 data being released. Data are likely to contain inaccuracies.");
    			add_location(strong, file$v, 1, 2, 24);
    			attr_dev(div, "class", "warning svelte-srzfvi");
    			add_location(div, file$v, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, strong);
    			append_dev(div, t1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Warning', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Warning> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Warning extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Warning",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear(year) {
      return year < 0 ? "-" + pad(-year, 6)
        : year > 9999 ? "+" + pad(year, 6)
        : pad(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear(date.getUTCFullYear()) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
          : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
          : "");
    }

    function dsv(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsv(",");

    var csvParse = csv.parse;

    function autoType(object) {
      for (var key in object) {
        var value = object[key].trim(), number, m;
        if (!value) value = null;
        else if (value === "true") value = true;
        else if (value === "false") value = false;
        else if (value === "NaN") value = NaN;
        else if (!isNaN(number = +value)) value = number;
        else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
          if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
          value = new Date(value);
        }
        else continue;
        object[key] = value;
      }
      return object;
    }

    // https://github.com/d3/d3-dsv/issues/45
    const fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

    const ordinal$1 = i => {
    	if (i < 10) {
    		return [
    			'',
    			'first',
    			'second',
    			'third',
    			'fourth',
    			'fifth',
    			'sixth',
    			'seventh',
    			'eighth',
    			'ninth'
    		][i];
    	}

    	const j = i % 10;
    	const k = i % 100;
    	if (j === 1 && k !== 11) {
    		return i + 'st';
    	}

    	if (j === 2 && k !== 12) {
    		return i + 'nd';
    	}

    	if (j === 3 && k !== 13) {
    		return i + 'rd';
    	}

    	return i + 'th';
    };

    // https://stackoverflow.com/a/2901298/3347737
    const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const possessive = s => {
    	if (s[s.length - 1] === 's') {
    		return s + '\'';
    	}

    	return s + '\'s';
    };

    const createText = (template, dict) => {
    	// This is based on Douglas Crockford's old json_parse https://github.com/douglascrockford/JSON-js/blob/03157639c7a7cddd2e9f032537f346f1a87c0f6d/json_parse.js

    	if (typeof template !== 'string') {
    		throw new TypeError(`Expected a string, got ${typeof template}`);
    	}

    	let at = 1;
    	let ch = template.charAt(0);

    	const getCh = function () {
    		// Just to keep xo happy
    		return ch;
    	};

    	const error = function (m) {
    		throw JSON.stringify({
    			name: 'Robo-journalist error',
    			message: m,
    			at,
    			text: template
    		});
    	};

    	const next = function (c) {
    		// If a c parameter is provided, verify that it matches the current character.
    		if (c && c !== ch) {
    			error('Expected \'' + c + '\' instead of \'' + ch + '\'');
    		}

    		// Get the next character. When there are no more characters,
    		// return the empty string.
    		ch = template.charAt(at);
    		at += 1;
    		return ch;
    	};

    	const getValue = function (key) {
    		const parts = key.split('.');
    		let d = dict;
    		for (const part of parts) {
    			try {
    				d = d[part];
    			} catch {
    				error(`${key} is not in the data dictionary.`);
    			}
    		}

    		return d;
    	};

    	const rpn = function (key) {
    		const tokens = key.split(' ');
    		const operators = {
    			'+': (a, b) => a + b,
    			'-': (a, b) => a - b,
    			'*': (a, b) => a * b,
    			'/': (a, b) => a / b,
    			'<': (a, b) => a < b,
    			'>': (a, b) => a > b,
    			'<=': (a, b) => a <= b,
    			'>=': (a, b) => a >= b
    		};
    		const stack = [];
    		for (const token of tokens) {
    			if (/^-?\d+$/.test(token)) {
    				// An integer literal
    				stack.push(Number(token));
    			} else if (token in operators) {
    				const b = Number(stack.pop());
    				const a = Number(stack.pop());
    				stack.push(operators[token](a, b));
    			} else if (token === '\'') {
    				stack[stack.length - 1] = possessive(stack[stack.length - 1]);
    			} else if (token === ',') {
    				stack[stack.length - 1] = numberWithCommas(stack[stack.length - 1]);
    			} else if (token === '.0') {
    				stack[stack.length - 1] = stack[stack.length - 1].toFixed(0);
    			} else if (token === '.1') {
    				stack[stack.length - 1] = stack[stack.length - 1].toFixed(1);
    			} else if (token === '.2') {
    				stack[stack.length - 1] = stack[stack.length - 1].toFixed(2);
    			} else if (token === '~abs') {
    				stack[stack.length - 1] = Math.abs(stack[stack.length - 1]);
    			} else if (token === '~ord') {
    				stack[stack.length - 1] = ordinal$1(Number(stack[stack.length - 1]));
    			} else if (token === '~ord\'') {
    				let result = ordinal$1(Number(stack.pop()));
    				if (result === 'first') {
    					result = '';
    				} else {
    					result += ' ';
    				}

    				stack.push(result);
    			} else if (token.charAt(0) === '^') {
    				stack[stack.length - 1] = getValue(token.slice(1))(stack[stack.length - 1]);
    			} else {
    				stack.push(getValue(token));
    			}
    		}

    		if (stack.length !== 1) {
    			error('Invalid RPN');
    		}

    		return stack[0];
    	};

    	const eitherOr = function (which) {
    		next('?');
    		const first = parse();
    		next(':');
    		const second = parse();
    		next('}');
    		return which ? first : second;
    	};

    	const braced = function () {
    		next('{');
    		if (ch === ':') {
    			// {:} adds a colon to the output
    			next(':');
    			next('}');
    			return ':';
    		}

    		let varName = '';
    		while (getCh()) {
    			if (ch === '}') {
    				next('}');
    				return rpn(varName);
    			}

    			if (ch === '?') {
    				return eitherOr(rpn(varName));
    			}

    			varName += ch;
    			next();
    		}

    		error('Braces not closed');
    	};

    	const parse = function () {
    		let result = '';
    		while (getCh()) {
    			if (ch === ':' || ch === '}') {
    				return result;
    			}

    			if (ch === '{') {
    				result += braced();
    				continue;
    			}

    			result += ch;
    			next();
    		}

    		return result;
    	};

    	const result = parse();
    	if (ch !== '') {
    		error(`Didn't expect '${ch}'`);
    	}

    	return result;
    };

    async function getData(url) {
      let response = await fetch(url);
      let string = await response.text();
    	let data = await csvParse(string, autoType);
      return data;
    }

    let chains = {
      'good': ['bad', 'fair'],
      'bad': ['good', 'fair'],
      'white': ['black', 'asian'],
      'black': ['white', 'asian'],
      'asian': ['white', 'black'],
      'rented_private': ['rented_social', 'owned'],
      'rented_social': ['rented_private', 'owned'],
      'owned': ['rented_private', 'rented_social'],
      'student': ['employee', 'unemployed', 'self-employed'],
      'self-employed': ['employee', 'unemployed', 'student'],
      'employee': ['unemployed', 'self-employed', 'student',],
      'unemployed': ['employee', 'self-employed', 'student'],
      'car_van': ['bus', 'train_metro', 'foot', 'home'],
      'bus': ['car_van', 'train_metro', 'foot', 'home'],
      'train_metro': ['bus', 'car_van', 'foot', 'home'],
      'foot': ['bus', 'train_metro', 'car_van', 'home'],
      'home': ['bus', 'train_metro', 'foot', 'car_van'],
      'OnePerson': ['Cohabiting', 'Married'],
      'Cohabiting': ['OnePerson', 'Married'],
      'LoneParent': ['Married', 'Cohabiting'],
      'Christian': ['Muslim', 'Noreligion'],
      'Muslim': ['Christian', 'Noreligion'],
      'Noreligion': ['Christian', 'Muslim'],
      'Buddhist': ['Hindu', 'Sikh'],
      'Hindu': ['Sikh', 'Buddhist'],
      'Jewish': ['Christian', 'Muslim'],
      'Sikh': ['Hindu', 'Buddhist'],
      'Single': ['Married', 'Seperated'],
      'Married': ['Single', 'Seperated'],
      'Seperated': ['Married', 'Single'],
      '40PlushoursWeek': ['20to49hoursWeek', '1to19hoursWeek'],
      '20to49hoursWeek': ['40PlushoursWeek', '1to19hoursWeek'],
      '1to19hoursWeek': ['40PlushoursWeek', '20to49hoursWeek'],
      'Kids': ['NoKids', 'NonDepKids'],
      'NoKids': ['Kids', 'NonDepKids'],
      'NonDepKids': ['Kids', 'NoKids'],
      'Male1-15': ['Male49plus'],
      'Male49plus': ['Male1-15'],
      'Female1-15': ['Female49plus'],
      'Female49plus': ['Female1-15']
    };

    let array = ['South East', 'South West', 'East', 'West Midlands', 'East Midlands', 'North East', 'North West'];
    function regionThe(place, nt) {
      if (place=="East") { place = place + " England";}
      return ((!array.includes(place))|(nt=="NT")) ? place : 'The ' + place;
    }

    function uncap1(string) {
        if (string.slice(0, 3)=="The") {
            return string.charAt(0).toLowerCase() + string.slice(1);
        } else { return string }
    }


    function drop(x, d, r) {
      let int = Math.abs(x);
      let pos = x < 0 ? d: r;
      let nuLu = {1: '', 2: 'second-', 3: 'third-', 4: 'fourth-', 5: 'fifth-'};
      let word = nuLu[int];
      return word + pos
    }


    let num_word = {'quarter of a million': 250000, 'half a million': 500000, 'three quarters of a million': 750000, 'one million': 1000000};

    let frac_word = {'one in two': 0.5, 'one in three': 0.333, 'one in four': 0.25, 'one in five': 0.2, 'one in six': 0.167, 'one in seven': 0.143, 'one in eight': 0.125, 'one in nine': 0.111, '1 in 10': 0.1,'1 in 11' : 0.09, '1 in 12' : 0.083, '1 in 13' : 0.077, '1 in 14' : 0.071, '1 in 15' : 0.067, '1 in 16' : 0.063, '1 in 17' : 0.059, '1 in 18' : 0.056, '1 in 19' : 0.053 ,'1 in 20': 0.05, '2 in 10': 0.2, '3 in 10': 0.3, '4 in 10': 0.4, '6 in 10': 0.6, '7 in 10': 0.7, '8 in 10': 0.8, '9 in 10': 0.9, 'all': 1.0};


    function get_word(num, dict) {
      if (dict == "frac") {
        dict = frac_word;
      } else if (dict == "num") {
        dict = num_word;
      }
      let OverUnder;
      let lowest = 2000000;
      let lowest_label;
      for (const label in dict) {
        if (Math.abs(num-dict[label])<lowest) {
          lowest = Math.abs(num-dict[label]); 
          lowest_label = label;
          if (num-dict[label]==0) {
            OverUnder = "about"; 
          }
          else if (num-dict[label]>0) {
            OverUnder = "just over";
          }
          else if (num-dict[label]<0) {
            OverUnder = "just under";
          } } }
      return [OverUnder, lowest_label]
    }
    function figs(x, f) {
      if (f!=3) {
        f = 2;
      }
      let sigfig = Number.parseFloat(Number.parseFloat(x).toPrecision(f));
      let text;
      if (x-sigfig<-x/100) {
        text = "under ";
      }	
      if (x-sigfig<-x/800) {
        if (Math.round(Math.random())==1) {
          text = "almost ";
        } else {
          text = "just under ";
        }
      }
      else if (x-sigfig>x/100) {
        text = " just over ";
      }
      else if (x-sigfig>x/800) {
        text = "just over ";
      }
      else {
        text = "about";
      }
      return [text, sigfig];
    }


    function cur(s, place, i, type) {
      if (type=="rl") {
        type = "_rank_local";
      } else if (type=="r") {
        type = "_rank";
      } else {
        type = "";
      }
      return place.data[s[i][0]][s[i][1]+type][2011][s[i][3]]
    }

    function cha(s, place, i, type) {
      if (type=="rl") {
        type = "_rank_local";
      } else if (type=="r") {
        type = "_rank";
      } else {
        type = "";
      }
      return Math.round(place.data[s[i][0]][s[i][1]+type]['change'][s[i][3]]*10)/10
    }

    function qui(n) {
      return Math.ceil(5*n/331)
    }

    function otherEst(s, place, i, hiLo, type) {
      if (typeof hiLo==="number" & hiLo<0) {
        hiLo = "highest";
      } else if (typeof hiLo==="number") {
        hiLo = "lowest";
      }
      
      let optAr = Object.assign({}, place.data[s[i][0]][s[i][1]+'_rank_local'][type]);
      let l = new Set(chains[s[i][3]]);

      for (let prop of Object.keys(optAr)) {
        if (!l.has(prop)) {
          delete optAr[prop];
        }
      }
      let optArKey;
      if (Object.keys(optAr).length>1) {
        if (hiLo=='lowest') {
          for (let [k, v] of Object.entries(optAr)) {
            if (v > 0) {
              delete optAr[k];
            }
          }
          if (optAr.length>0) {
            optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] > optAr[b] ? a : b);
          } else {
            optArKey = undefined;
          }
          
        }
        if (hiLo=='highest') {
          for (let [k, v] of Object.entries(optAr)) {
            if (v < 0) {
              delete optAr[k];
            }
          }
          if (optAr.length>0) {
            optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] < optAr[b] ? a : b);
          } else {
            optArKey = undefined;
          }
        }
      } else {
        optArKey = Object.keys(optAr);
      }
      return optArKey
    }

    function otherRank(s, place, i, t="r") {
      let locExt = "";
      if (t=="rl") {
        locExt = "_local";
      }
      return place.data[s[i][0]][s[i][1]+'_rank'+locExt]['change'][otherEst(s, place, i, cha(s, place, i, t), 'change')]
    }

    function ud(n, w1, w2) { if (n<0) { return w2 } else { return w1 } }
    var city;
    if (parent=="London") {
      city = "city";
    } else {
      city = "region";
    }

    function sign(x, y) {
      if (Math.sign(x) == Math.sign(y)) {
        return true
      } else {
        return false
      }
    }


    var ones = ['', '', 'second-', 'third-', 'fourth-', 'fifth-', 'sixth-', 'seventh-', 'eighth-', 'ninth-'];

    var nuwords = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    function nuword(x) {
      if (x<10) {
        return nuwords[x]
      } else {
        return x
      }
    }

    function suffixer(int) {
      let ord;
      if (int==12) {
        ord = 'twelfth';
      } else if ((int>10)&(int<20)) {
        ord = int+"th";
      } else {
        let mod = Math.round(int) % 10;
        ord = mod == 1 ? int+'st' : mod == 2 ? int+'nd' : mod == 3 ? int+'rd' : int+'th';
      }
      return ord
    }

    function ord(x) {
      let ordin;
      if (Math.abs(x)<10) {
        ordin = ones[Math.abs(x)];
      } else {
        ordin = suffixer(Math.abs(x))+"-";
      }
      return ordin
    }

    var ageBandLU = {
      '0-9': ['children under the age of nine years', 'under nine years'],
      '10-19': ['people between the ages of 10 and 19 years','between 10 and 19 years'],
      '20-29': ['people between the ages of 20 and 29 years', 'between 20 and 29 years'],
      '30-39': ['people between the ages of 30 and 39 years','between 30 and 39 years'],
      '40-49': ['people between the ages of 40 and 49 years','between 40 and 49 years'],
      '50-59': ['people between the ages of 50 and 59 years','between 50 and 59 years'],
      '60-69': ['people between the ages of 60 and 69 years','between 60 and 69 years'],
      '70-79': ['people between the ages of 70 and 79 years', 'between 70 and 79 years'],
      '80plus': ['people aged 80 years or over', 'over the age of 80 years']
    };
    function eq(a, b) {
      return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.every((val, index) => val === b[index]);
    }
    function udord(n, w1, w2) {
      let w = ud(n, w1, w2);
      let nu = ord(n);
      return nu+w
    }

    function adv(x, y) {
      let w;
      let d = x-y;
      let perc = (d/y)*100;
      if (Math.abs(perc)>7) {
        w = 'considerably';
      } else if (Math.abs(perc)>3) {
        w = 'somewhat';
      } else {
        w = 'slightly';
      }
      return w
    }

    function uds(n, w1, w2, w3) {
       if (n<-1) { 
         return w2 
        } else if (n>1) { 
          return w1 
        } else {
          return w3
        }
      }

    /* src/ui/Select.svelte generated by Svelte v3.43.1 */
    const file$u = "src/ui/Select.svelte";

    function get_each_context_1$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[35] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context$h(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[33] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    // (225:1) {:else}
    function create_else_block_1$2(ctx) {
    	let a;
    	let span0;

    	let t0_value = (/*placeholder*/ ctx[0]
    	? /*placeholder*/ ctx[0]
    	: 'Select one') + "";

    	let t0;
    	let t1;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = " ";
    			attr_dev(span0, "class", "svelte-qdzmwx");
    			add_location(span0, file$u, 226, 2, 4757);
    			attr_dev(span1, "class", "button svelte-qdzmwx");
    			toggle_class(span1, "search", /*search*/ ctx[3]);
    			toggle_class(span1, "down", !/*search*/ ctx[3]);
    			add_location(span1, file$u, 227, 2, 4815);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "svelte-qdzmwx");
    			add_location(a, file$u, 225, 1, 4721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(a, t1);
    			append_dev(a, span1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*toggle*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*placeholder*/ 1 && t0_value !== (t0_value = (/*placeholder*/ ctx[0]
    			? /*placeholder*/ ctx[0]
    			: 'Select one') + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*search*/ 8) {
    				toggle_class(span1, "search", /*search*/ ctx[3]);
    			}

    			if (dirty[0] & /*search*/ 8) {
    				toggle_class(span1, "down", !/*search*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(225:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (220:1) {#if selectedItem && !search}
    function create_if_block_4$7(ctx) {
    	let a;
    	let span0;
    	let t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let mounted;
    	let dispose;
    	let if_block = /*group*/ ctx[2] && create_if_block_5$6(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = " ";
    			attr_dev(span0, "class", "selection svelte-qdzmwx");
    			add_location(span0, file$u, 221, 2, 4536);
    			attr_dev(span1, "class", "button close svelte-qdzmwx");
    			add_location(span1, file$u, 222, 2, 4644);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "selected svelte-qdzmwx");
    			add_location(a, file$u, 220, 1, 4483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			if (if_block) if_block.m(span0, null);
    			append_dev(a, t2);
    			append_dev(a, span1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*unSelect*/ ctx[14], false, false, false),
    					listen_dev(a, "click", /*toggle*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem, label*/ 66 && t0_value !== (t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

    			if (/*group*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$6(ctx);
    					if_block.c();
    					if_block.m(span0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$7.name,
    		type: "if",
    		source: "(220:1) {#if selectedItem && !search}",
    		ctx
    	});

    	return block;
    }

    // (222:48) {#if group}
    function create_if_block_5$6(ctx) {
    	let small;
    	let t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(t_value);
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$u, 221, 59, 4593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem, group*/ 68 && t_value !== (t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$6.name,
    		type: "if",
    		source: "(222:48) {#if group}",
    		ctx
    	});

    	return block;
    }

    // (231:1) {#if expanded}
    function create_if_block$k(ctx) {
    	let div;
    	let input_1;
    	let t;
    	let ul;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*filter*/ ctx[4].length < 0) return create_if_block_1$d;
    		if (/*filtered*/ ctx[9][0] && /*group*/ ctx[2]) return create_if_block_2$a;
    		if (/*filtered*/ ctx[9][0]) return create_if_block_3$7;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input_1 = element("input");
    			t = space();
    			ul = element("ul");
    			if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "placeholder", "");
    			attr_dev(input_1, "autocomplete", "false");
    			attr_dev(input_1, "class", "svelte-qdzmwx");
    			add_location(input_1, file$u, 232, 2, 4967);
    			attr_dev(ul, "class", "svelte-qdzmwx");
    			add_location(ul, file$u, 233, 2, 5084);
    			attr_dev(div, "id", "dropdown");
    			set_style(div, "top", "0");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			add_location(div, file$u, 231, 1, 4914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input_1);
    			set_input_value(input_1, /*filter*/ ctx[4]);
    			/*input_1_binding*/ ctx[23](input_1);
    			append_dev(div, t);
    			append_dev(div, ul);
    			if_block.m(ul, null);
    			/*div_binding*/ ctx[30](div);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[22]),
    					listen_dev(input_1, "keyup", /*doKeyup*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filter*/ 16 && input_1.value !== /*filter*/ ctx[4]) {
    				set_input_value(input_1, /*filter*/ ctx[4]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_1_binding*/ ctx[23](null);
    			if_block.d();
    			/*div_binding*/ ctx[30](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(231:1) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (249:3) {:else}
    function create_else_block$5(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "No results";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$u, 249, 3, 5657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(249:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (243:25) 
    function create_if_block_3$7(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*filtered*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$7(get_each_context_1$7(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, active, select, filtered, label*/ 11010) {
    				each_value_1 = /*filtered*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$7(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$7.name,
    		type: "if",
    		source: "(243:25) ",
    		ctx
    	});

    	return block;
    }

    // (237:34) 
    function create_if_block_2$a(ctx) {
    	let each_1_anchor;
    	let each_value = /*filtered*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$h(get_each_context$h(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, active, select, filtered, group, label*/ 11014) {
    				each_value = /*filtered*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$h(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$h(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$a.name,
    		type: "if",
    		source: "(237:34) ",
    		ctx
    	});

    	return block;
    }

    // (235:3) {#if filter.length < 0}
    function create_if_block_1$d(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Type a name...";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$u, 235, 3, 5119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$d.name,
    		type: "if",
    		source: "(235:3) {#if filter.length < 0}",
    		ctx
    	});

    	return block;
    }

    // (244:3) {#each filtered as option, i}
    function create_each_block_1$7(ctx) {
    	let li;
    	let t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let i = /*i*/ ctx[34];
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[27](/*option*/ ctx[32]);
    	}

    	function mouseover_handler_1() {
    		return /*mouseover_handler_1*/ ctx[28](/*i*/ ctx[34]);
    	}

    	const assign_li = () => /*li_binding_1*/ ctx[29](li, i);
    	const unassign_li = () => /*li_binding_1*/ ctx[29](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$u, 244, 3, 5475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			assign_li();

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler_1, false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filtered, label*/ 514 && t0_value !== (t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

    			if (i !== /*i*/ ctx[34]) {
    				unassign_li();
    				i = /*i*/ ctx[34];
    				assign_li();
    			}

    			if (dirty[0] & /*active*/ 256) {
    				toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_li();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$7.name,
    		type: "each",
    		source: "(244:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    // (238:3) {#each filtered as option, i}
    function create_each_block$h(ctx) {
    	let li;
    	let t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let small;
    	let t2_value = /*option*/ ctx[32][/*group*/ ctx[2]] + "";
    	let t2;
    	let t3;
    	let i = /*i*/ ctx[34];
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[24](/*option*/ ctx[32]);
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[25](/*i*/ ctx[34]);
    	}

    	const assign_li = () => /*li_binding*/ ctx[26](li, i);
    	const unassign_li = () => /*li_binding*/ ctx[26](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$u, 239, 20, 5362);
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$u, 238, 3, 5214);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, small);
    			append_dev(small, t2);
    			append_dev(li, t3);
    			assign_li();

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler, false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filtered, label*/ 514 && t0_value !== (t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*filtered, group*/ 516 && t2_value !== (t2_value = /*option*/ ctx[32][/*group*/ ctx[2]] + "")) set_data_dev(t2, t2_value);

    			if (i !== /*i*/ ctx[34]) {
    				unassign_li();
    				i = /*i*/ ctx[34];
    				assign_li();
    			}

    			if (dirty[0] & /*active*/ 256) {
    				toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_li();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$h.name,
    		type: "each",
    		source: "(238:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedItem*/ ctx[6] && !/*search*/ ctx[3]) return create_if_block_4$7;
    		return create_else_block_1$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*expanded*/ ctx[7] && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", "select");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			toggle_class(div, "active", /*expanded*/ ctx[7]);
    			add_location(div, file$u, 218, 0, 4386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "keydown", /*doKeydown*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			}

    			if (/*expanded*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$k(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*expanded*/ 128) {
    				toggle_class(div, "active", /*expanded*/ ctx[7]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sleep$1(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let regex;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, []);
    	const dispatch = createEventDispatcher();
    	let { options } = $$props;
    	let { selected = null } = $$props;
    	let { placeholder = "Find an area..." } = $$props;
    	let { value = "code" } = $$props;
    	let { label = "name" } = $$props;
    	let { group = null } = $$props;
    	let { search = false } = $$props;
    	let selectedPrev = selected;

    	let selectedItem = selected
    	? options.find(d => {
    			d[value] == selected[value];
    		})
    	: null;

    	let expanded = false;
    	let filter = '';
    	let active = null;
    	let filtered;
    	let el;
    	let input;
    	let items = [];

    	function toggle(ev) {
    		ev.stopPropagation();
    		$$invalidate(4, filter = '');
    		$$invalidate(7, expanded = !expanded);

    		sleep$1(10).then(() => {
    			if (input && expanded) {
    				input.focus();
    			}
    		});
    	}

    	function select(option) {
    		$$invalidate(17, selected = option);
    		$$invalidate(7, expanded = false);
    		dispatch('select', { selected: option, value: option[value] });
    	}

    	function unSelect(ev) {
    		ev.stopPropagation();
    		$$invalidate(17, selected = null);
    		$$invalidate(20, selectedPrev = null);
    		$$invalidate(6, selectedItem = null);
    		dispatch('select', { selected: null, value: null });
    	}

    	function doKeydown(ev) {
    		if (expanded && filtered[0] && Number.isInteger(active)) {
    			if (ev.keyCode === 38) {
    				$$invalidate(8, active -= active > 0 ? 1 : 0);
    				items[active].scrollIntoView({ block: 'nearest', inline: 'start' });
    			} else if (ev.keyCode === 40) {
    				$$invalidate(8, active += active < filtered.length - 1 ? 1 : 0);
    				items[active].scrollIntoView({ block: 'nearest', inline: 'end' });
    			}
    		}
    	}

    	function doKeyup(ev) {
    		if (filtered[0] && Number.isInteger(active)) {
    			if (ev.keyCode === 13) {
    				select(filtered[active]);
    			}
    		}
    	}

    	const writable_props = ['options', 'selected', 'placeholder', 'value', 'label', 'group', 'search'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function input_1_input_handler() {
    		filter = this.value;
    		$$invalidate(4, filter);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(10, input);
    		});
    	}

    	const click_handler = option => select(option);
    	const mouseover_handler = i => $$invalidate(8, active = i);

    	function li_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			items[i] = $$value;
    			$$invalidate(11, items);
    		});
    	}

    	const click_handler_1 = option => select(option);
    	const mouseover_handler_1 = i => $$invalidate(8, active = i);

    	function li_binding_1($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			items[i] = $$value;
    			$$invalidate(11, items);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(5, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(18, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(17, selected = $$props.selected);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(19, value = $$props.value);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('search' in $$props) $$invalidate(3, search = $$props.search);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		options,
    		selected,
    		placeholder,
    		value,
    		label,
    		group,
    		search,
    		selectedPrev,
    		selectedItem,
    		expanded,
    		filter,
    		active,
    		filtered,
    		el,
    		input,
    		items,
    		sleep: sleep$1,
    		toggle,
    		select,
    		unSelect,
    		doKeydown,
    		doKeyup,
    		regex
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(18, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(17, selected = $$props.selected);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(19, value = $$props.value);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('search' in $$props) $$invalidate(3, search = $$props.search);
    		if ('selectedPrev' in $$props) $$invalidate(20, selectedPrev = $$props.selectedPrev);
    		if ('selectedItem' in $$props) $$invalidate(6, selectedItem = $$props.selectedItem);
    		if ('expanded' in $$props) $$invalidate(7, expanded = $$props.expanded);
    		if ('filter' in $$props) $$invalidate(4, filter = $$props.filter);
    		if ('active' in $$props) $$invalidate(8, active = $$props.active);
    		if ('filtered' in $$props) $$invalidate(9, filtered = $$props.filtered);
    		if ('el' in $$props) $$invalidate(5, el = $$props.el);
    		if ('input' in $$props) $$invalidate(10, input = $$props.input);
    		if ('items' in $$props) $$invalidate(11, items = $$props.items);
    		if ('regex' in $$props) $$invalidate(21, regex = $$props.regex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*filter*/ 16) {
    			$$invalidate(21, regex = filter ? new RegExp(filter, 'i') : null);
    		}

    		if ($$self.$$.dirty[0] & /*regex, options, label*/ 2359298) {
    			{
    				$$invalidate(9, filtered = regex
    				? options.filter(option => regex.test(option[label]))
    				: options);

    				$$invalidate(8, active = 0);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*el*/ 32) {
    			document.onclick = function (e) {
    				if (e.target !== el) {
    					$$invalidate(7, expanded = false);
    					$$invalidate(8, active = 0);
    				}
    			};
    		}

    		if ($$self.$$.dirty[0] & /*selectedPrev, selected, options, value*/ 1966080) {
    			if (selectedPrev != selected) {
    				$$invalidate(6, selectedItem = options.find(d => d[value] == selected[value]));
    				$$invalidate(20, selectedPrev = selected);
    			}
    		}
    	};

    	return [
    		placeholder,
    		label,
    		group,
    		search,
    		filter,
    		el,
    		selectedItem,
    		expanded,
    		active,
    		filtered,
    		input,
    		items,
    		toggle,
    		select,
    		unSelect,
    		doKeydown,
    		doKeyup,
    		selected,
    		options,
    		value,
    		selectedPrev,
    		regex,
    		input_1_input_handler,
    		input_1_binding,
    		click_handler,
    		mouseover_handler,
    		li_binding,
    		click_handler_1,
    		mouseover_handler_1,
    		li_binding_1,
    		div_binding
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$x,
    			create_fragment$x,
    			safe_not_equal,
    			{
    				options: 18,
    				selected: 17,
    				placeholder: 0,
    				value: 19,
    				label: 1,
    				group: 2,
    				search: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$x.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[18] === undefined && !('options' in props)) {
    			console.warn("<Select> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get search() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var archieml = createCommonjsModule(function (module, exports) {
    // Structure inspired by John Resig's HTML parser
    // http://ejohn.org/blog/pure-javascript-html-parser/

    (function() {

    // The load function takes a string of text as its only argument.
    // It then proceeds to match the text to one of several regular expressions
    // which match patterns for different types of commands in AML.
    function load(input, options) {
      var whitespacePattern = '\\u0000\\u0009\\u000A\\u000B\\u000C\\u000D\\u0020\\u00A0\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u200B\\u2028\\u2029\\u202F\\u205F\\u3000\\uFEFF';
      var slugBlacklist = whitespacePattern + '\\u005B\\u005C\\u005D\\u007B\\u007D\\u003A';

      var nextLine = new RegExp('.*((\r|\n)+)');
      var startKey = new RegExp('^\\s*([^' + slugBlacklist + ']+)[ \t\r]*:[ \t\r]*(.*(?:\n|\r|$))');
      var commandKey = new RegExp('^\\s*:[ \t\r]*(endskip|ignore|skip|end).*?(\n|\r|$)', 'i');
      var arrayElement = new RegExp('^\\s*\\*[ \t\r]*(.*(?:\n|\r|$))');
      var scopePattern = new RegExp('^\\s*(\\[|\\{)[ \t\r]*([\+\.]*)[ \t\r]*([^' + slugBlacklist + ']*)[ \t\r]*(?:\\]|\\}).*?(\n|\r|$)');

      var data = {},
          scope = data,

          stack = [],
          stackScope = undefined,

          bufferScope = null,
          bufferKey = null,
          bufferString = '',

          isSkipping = false;

      var options = options || {};
      if (options.comments !== true) options.comments = false;

      while (input) {
        // Inside the input stream loop, the `input` string is trimmed down as matches
        // are found, and fires a call to the matching parse*() function.
        var match;

        if (commandKey.exec(input)) {
          match = commandKey.exec(input);

          parseCommandKey(match[1].toLowerCase());

        } else if (!isSkipping && startKey.exec(input) &&
            (!stackScope || stackScope.arrayType !== 'simple')) {
          match = startKey.exec(input);

          parseStartKey(match[1], match[2] || '');

        } else if (!isSkipping && arrayElement.exec(input) && stackScope && stackScope.array &&
            (stackScope.arrayType !== 'complex' && stackScope.arrayType !== 'freeform') &&
            stackScope.flags.indexOf('+') < 0) {
          match = arrayElement.exec(input);

          parseArrayElement(match[1]);

        } else if (!isSkipping && scopePattern.exec(input)) {
          match = scopePattern.exec(input);

          parseScope(match[1], match[2], match[3]);

        } else if (nextLine.exec(input)) {
          match = nextLine.exec(input);

          parseText(match[0]);

        } else {
          // End of document reached
          parseText(input);
          input = '';
        }

        if (match) input = input.substring(match[0].length);
      }

      // The following parse functions add to the global `data` object and update
      // scoping variables to keep track of what we're parsing.

      function parseStartKey(key, restOfLine) {
        // When a new key is encountered, the rest of the line is immediately added as
        // its value, by calling `flushBuffer`.
        flushBuffer();

        incrementArrayElement(key);

        if (stackScope && stackScope.flags.indexOf('+') > -1) key = 'value';

        bufferKey = key;
        bufferString = restOfLine;

        flushBufferInto(key, {replace: true});
      }

      function parseArrayElement(value) {
        flushBuffer();

        stackScope.arrayType = stackScope.arrayType || 'simple';

        stackScope.array.push('');
        bufferKey = stackScope.array;
        bufferString = value;
        flushBufferInto(stackScope.array, {replace: true});
      }

      function parseCommandKey(command) {
        // if isSkipping, don't parse any command unless :endskip

        if (isSkipping && !(command === "endskip" || command === "ignore")) return flushBuffer();

        switch (command) {
          case "end":
            // When we get to an end key, save whatever was in the buffer to the last
            // active key.
            if (bufferKey) flushBufferInto(bufferKey, {replace: false});
            return;

          case "ignore":
            // When ":ignore" is reached, stop parsing immediately
            input = '';
            break;

          case "skip":
            isSkipping = true;
            break;

          case "endskip":
            isSkipping = false;
            break;
        }

        flushBuffer();
      }

      function parseScope(scopeType, flags, scopeKey) {
        // Throughout the parsing, `scope` refers to one of the following:
        //   * `data`
        //   * an object - one level within `data` - when we're within a {scope} block
        //   * an object at the end of an array - which is one level within `data` -
        //     when we're within an [array] block.
        //
        // `scope` changes whenever a scope key is encountered. It also changes
        // within parseStartKey when we start a new object within an array.
        flushBuffer();

        if (scopeKey == '') {

          // Move up a level
          var lastStackItem = stack.pop();
          scope = (lastStackItem ? lastStackItem.scope : data) || data;
          stackScope = stack[stack.length - 1];

        } else if (scopeType === '[' || scopeType === '{') {
          var nesting = false;
          var keyScope = data;

          // If the flags include ".", drill down into the appropriate scope.
          if (flags.indexOf('.') > -1) {
            incrementArrayElement(scopeKey);
            nesting = true;
            if (stackScope) keyScope = scope;

          // Otherwise, make sure we reset to the global scope
          } else {
            scope = data;
            stack = [];
          }

          // Within freeforms, the `type` of nested objects and arrays is taken
          // verbatim from the `keyScope`.
          if (stackScope && stackScope.flags.indexOf('+') > -1) {
            var parsedScopeKey = scopeKey;

          // Outside of freeforms, dot-notation interpreted as nested data.
          } else {
            var keyBits = scopeKey.split('.');
            for (var i=0; i<keyBits.length - 1; i++) {
              keyScope = keyScope[keyBits[i]] = keyScope[keyBits[i]] || {};
            }
            var parsedScopeKey = keyBits[keyBits.length - 1];
          }

          var stackScopeItem = {
            array: null,
            arrayType: null,
            arrayFirstKey: null,
            flags: flags,
            scope: scope
          };
          
          // Content of nested scopes within a freeform should be stored under "value."
          var isNestedFreeform = stackScope && stackScope.flags.indexOf('+') > -1 && flags.indexOf('.') > -1;

          if (scopeType == '[') {
            if (isNestedFreeform) parsedScopeKey = 'value';
            stackScopeItem.array = keyScope[parsedScopeKey] = [];
            if (flags.indexOf('+') > -1) stackScopeItem.arrayType = 'freeform';
            if (nesting) {
              stack.push(stackScopeItem);
            } else {
              stack = [stackScopeItem];
            }
            stackScope = stack[stack.length - 1];

          } else if (scopeType == '{') {
            if (nesting) {
              if (isNestedFreeform) scope = scope.value = {};
              else scope = keyScope[parsedScopeKey] = keyScope = {};
              stack.push(stackScopeItem);
            } else {
              scope = keyScope[parsedScopeKey] = (typeof keyScope[parsedScopeKey] === 'object') ? keyScope[parsedScopeKey] : {};
              stack = [stackScopeItem];
            }
            stackScope = stack[stack.length - 1];
          }
        }
      }

      function parseText(text) {
        if (stackScope && stackScope.flags.indexOf('+') > -1 && text.match(/[^\n\r\s]/)) {
          stackScope.array.push({"type": "text", "value": text.replace(/(^\s*)|(\s*$)/g, '')});
        } else {
          bufferString += input.substring(0, text.length);
        }
      }

      function incrementArrayElement(key) {
        // Special handling for arrays. If this is the start of the array, remember
        // which key was encountered first. If this is a duplicate encounter of
        // that key, start a new object.

        if (stackScope && stackScope.array) {
          // If we're within a simple array, ignore
          stackScope.arrayType = stackScope.arrayType || 'complex';
          if (stackScope.arrayType === 'simple') return;

          // arrayFirstKey may be either another key, or null
          if (stackScope.arrayFirstKey === null || stackScope.arrayFirstKey === key) stackScope.array.push(scope = {});
          if (stackScope.flags.indexOf('+') > -1) {
            scope.type = key;
          } else {
            stackScope.arrayFirstKey = stackScope.arrayFirstKey || key;
          }
        }
      }

      function formatValue(value, type) {
        if (options.comments) {
          value = value.replace(/(?:^\\)?\[[^\[\]\n\r]*\](?!\])/mg, ""); // remove comments
          value = value.replace(/\[\[([^\[\]\n\r]*)\]\]/g, "[$1]"); // [[]] => []
        }

        if (type == 'append') {
          // If we're appending to a multi-line string, escape special punctuation
          // by using a backslash at the beginning of any line.
          // Note we do not do this processing for the first line of any value.
          value = value.replace(new RegExp('^(\\s*)\\\\', 'gm'), "$1");
        }

        return value;
      }

      function flushBuffer() {
        var result = bufferString + '';
        bufferString = '';
        bufferKey = null;
        return result;
      }

      function flushBufferInto(key, options) {
        options = options || {};
        var existingBufferKey = bufferKey;
        var value = flushBuffer();

        if (options.replace) {
          value = formatValue(value, 'replace').replace(new RegExp('^\\s*'), '');
          bufferString = (new RegExp('\\s*$')).exec(value)[0];
          bufferKey = existingBufferKey;
        } else {
          value = formatValue(value, 'append');
        }

        if (typeof key === 'object') {
          // key is an array
          if (options.replace) key[key.length - 1] = '';

          key[key.length - 1] += value.replace(new RegExp('\\s*$'), '');

        } else {
          var keyBits = key.split('.');
          bufferScope = scope;

          for (var i=0; i<keyBits.length - 1; i++) {
            if (typeof bufferScope[keyBits[i]] === 'string') bufferScope[keyBits[i]] = {};
            bufferScope = bufferScope[keyBits[i]] = bufferScope[keyBits[i]] || {};
          }

          if (options.replace) bufferScope[keyBits[keyBits.length - 1]] = '';

          bufferScope[keyBits[keyBits.length - 1]] += value.replace(new RegExp('\\s*$'), '');
        }
      }

      flushBuffer();
      return data;
    }
    var archieml = {load: load};

    {
      if (module.exports) {
        exports = module.exports = archieml;
      }
      exports.archieml = archieml;
    }
    }.call(commonjsGlobal));
    });

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /* --------------------------------------------
     *
     * Return a truthy value if is zero
     *
     * --------------------------------------------
     */
    function canBeZero (val) {
    	if (val === 0) {
    		return true;
    	}
    	return val;
    }

    function makeAccessor (acc) {
    	if (!canBeZero(acc)) return null;
    	if (Array.isArray(acc)) {
    		return d => acc.map(k => {
    			return typeof k !== 'function' ? d[k] : k(d);
    		});
    	} else if (typeof acc !== 'function') { // eslint-disable-line no-else-return
    		return d => d[acc];
    	}
    	return acc;
    }

    /* --------------------------------------------
     *
     * Remove undefined fields from an object
     *
     * --------------------------------------------
     */

    // From Object.fromEntries polyfill https://github.com/tc39/proposal-object-from-entries/blob/master/polyfill.js#L1
    function fromEntries(iter) {
    	const obj = {};

    	for (const pair of iter) {
    		if (Object(pair) !== pair) {
    			throw new TypeError("iterable for fromEntries should yield objects");
    		}

    		// Consistency with Map: contract is that entry has "0" and "1" keys, not
    		// that it is an array or iterable.

    		const { "0": key, "1": val } = pair;

    		Object.defineProperty(obj, key, {
    			configurable: true,
    			enumerable: true,
    			writable: true,
    			value: val,
    		});
    	}

    	return obj;
    }

    function filterObject (obj, comparisonObj = {}) {
    	return fromEntries(Object.entries(obj).filter(([key, value]) => {
    		return value !== undefined
    			&& comparisonObj[key] === undefined;
    	}));
    }

    /* --------------------------------------------
     *
     * Calculate the extents of desired fields
     * For example, a fields object like this:
     * `{'x': d => d.x, 'y': d => d.y}`
     * For data like this:
     * [{ x: 0, y: -10 }, { x: 10, y: 0 }, { x: 5, y: 10 }]
     * Returns an object like:
     * `{ x: [0, 10], y: [-10, 10] }`
     *
     * --------------------------------------------
     */
    function calcExtents (data, fields) {
    	if (!Array.isArray(data)) {
    		throw new TypeError('The first argument of calcExtents() must be an array.');
    	}

    	if (
    		Array.isArray(fields)
    		|| fields === undefined
    		|| fields === null
    	) {
    		throw new TypeError('The second argument of calcExtents() must be an '
    		+ 'object with field names as keys as accessor functions as values.');
    	}

    	const extents = {};

    	const keys = Object.keys(fields);
    	const kl = keys.length;
    	let i;
    	let j;
    	let k;
    	let s;
    	let min;
    	let max;
    	let acc;
    	let val;

    	const dl = data.length;
    	for (i = 0; i < kl; i += 1) {
    		s = keys[i];
    		acc = fields[s];
    		min = null;
    		max = null;
    		for (j = 0; j < dl; j += 1) {
    			val = acc(data[j]);
    			if (Array.isArray(val)) {
    				const vl = val.length;
    				for (k = 0; k < vl; k += 1) {
    					if (val[k] !== undefined && val[k] !== null && Number.isNaN(val[k]) === false) {
    						if (min === null || val[k] < min) {
    							min = val[k];
    						}
    						if (max === null || val[k] > max) {
    							max = val[k];
    						}
    					}
    				}
    			} else if (val !== undefined && val !== null && Number.isNaN(val) === false) {
    				if (min === null || val < min) {
    					min = val;
    				}
    				if (max === null || val > max) {
    					max = val;
    				}
    			}
    		}
    		extents[s] = [min, max];
    	}

    	return extents;
    }

    /* --------------------------------------------
     * If we have a domain from settings, fill in
     * any null values with ones from our measured extents
     * otherwise, return the measured extent
     */
    function partialDomain (domain = [], directive) {
    	if (Array.isArray(directive) === true) {
    		return directive.map((d, i) => {
    			if (d === null) {
    				return domain[i];
    			}
    			return d;
    		});
    	}
    	return domain;
    }

    function calcDomain (s) {
    	return function domainCalc ([$extents, $domain]) {
    		return $extents ? partialDomain($extents[s], $domain) : $domain;
    	};
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector$1(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending$1(f(d), x);
    }

    function number$3(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect$1 = bisector$1(ascending$1);
    const bisectRight$1 = ascendingBisect$1.right;
    bisector$1(number$3).center;
    var bisect$1 = bisectRight$1;

    var e10$1 = Math.sqrt(50),
        e5$1 = Math.sqrt(10),
        e2$1 = Math.sqrt(2);

    function ticks$1(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement$1(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement$1(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10$1 ? 10 : error >= e5$1 ? 5 : error >= e2$1 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10$1 ? 10 : error >= e5$1 ? 5 : error >= e2$1 ? 2 : 1);
    }

    function tickStep$1(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10$1) step1 *= 10;
      else if (error >= e5$1) step1 *= 5;
      else if (error >= e2$1) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange$1(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define$1(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend$1(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color$1() {}

    var darker$1 = 0.7;
    var brighter$1 = 1 / darker$1;

    var reI$1 = "\\s*([+-]?\\d+)\\s*",
        reN$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex$1 = /^#([0-9a-f]{3,8})$/,
        reRgbInteger$1 = new RegExp("^rgb\\(" + [reI$1, reI$1, reI$1] + "\\)$"),
        reRgbPercent$1 = new RegExp("^rgb\\(" + [reP$1, reP$1, reP$1] + "\\)$"),
        reRgbaInteger$1 = new RegExp("^rgba\\(" + [reI$1, reI$1, reI$1, reN$1] + "\\)$"),
        reRgbaPercent$1 = new RegExp("^rgba\\(" + [reP$1, reP$1, reP$1, reN$1] + "\\)$"),
        reHslPercent$1 = new RegExp("^hsl\\(" + [reN$1, reP$1, reP$1] + "\\)$"),
        reHslaPercent$1 = new RegExp("^hsla\\(" + [reN$1, reP$1, reP$1, reN$1] + "\\)$");

    var named$1 = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define$1(Color$1, color$1, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex$1, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex$1,
      formatHsl: color_formatHsl$1,
      formatRgb: color_formatRgb$1,
      toString: color_formatRgb$1
    });

    function color_formatHex$1() {
      return this.rgb().formatHex();
    }

    function color_formatHsl$1() {
      return hslConvert$1(this).formatHsl();
    }

    function color_formatRgb$1() {
      return this.rgb().formatRgb();
    }

    function color$1(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex$1.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn$1(m) // #ff0000
          : l === 3 ? new Rgb$1((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba$1(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba$1((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger$1.exec(format)) ? new Rgb$1(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent$1.exec(format)) ? new Rgb$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger$1.exec(format)) ? rgba$1(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent$1.exec(format)) ? rgba$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named$1.hasOwnProperty(format) ? rgbn$1(named$1[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb$1(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn$1(n) {
      return new Rgb$1(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba$1(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb$1(r, g, b, a);
    }

    function rgbConvert$1(o) {
      if (!(o instanceof Color$1)) o = color$1(o);
      if (!o) return new Rgb$1;
      o = o.rgb();
      return new Rgb$1(o.r, o.g, o.b, o.opacity);
    }

    function rgb$3(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert$1(r) : new Rgb$1(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb$1(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define$1(Rgb$1, rgb$3, extend$1(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter$1 : Math.pow(brighter$1, k);
        return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker$1 : Math.pow(darker$1, k);
        return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex$1, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex$1,
      formatRgb: rgb_formatRgb$1,
      toString: rgb_formatRgb$1
    }));

    function rgb_formatHex$1() {
      return "#" + hex$1(this.r) + hex$1(this.g) + hex$1(this.b);
    }

    function rgb_formatRgb$1() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex$1(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla$1(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl$1(h, s, l, a);
    }

    function hslConvert$1(o) {
      if (o instanceof Hsl$1) return new Hsl$1(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color$1)) o = color$1(o);
      if (!o) return new Hsl$1;
      if (o instanceof Hsl$1) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl$1(h, s, l, o.opacity);
    }

    function hsl$1(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert$1(h) : new Hsl$1(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl$1(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define$1(Hsl$1, hsl$1, extend$1(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter$1 : Math.pow(brighter$1, k);
        return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker$1 : Math.pow(darker$1, k);
        return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb$1(
          hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb$1(h, m1, m2),
          hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb$1(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant$1 = x => () => x;

    function linear$3(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential$1(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma$1(y) {
      return (y = +y) === 1 ? nogamma$1 : function(a, b) {
        return b - a ? exponential$1(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma$1(a, b) {
      var d = b - a;
      return d ? linear$3(a, d) : constant$1(isNaN(a) ? b : a);
    }

    var rgb$2 = (function rgbGamma(y) {
      var color = gamma$1(y);

      function rgb(start, end) {
        var r = color((start = rgb$3(start)).r, (end = rgb$3(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma$1(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray$1(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray$1(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray$1(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate$1(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date$1(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber$1(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object$1(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate$1(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA$1 = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB$1 = new RegExp(reA$1.source, "g");

    function zero$1(b) {
      return function() {
        return b;
      };
    }

    function one$1(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string$1(a, b) {
      var bi = reA$1.lastIndex = reB$1.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA$1.exec(a))
          && (bm = reB$1.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber$1(am, bm)});
        }
        bi = reB$1.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one$1(q[0].x)
          : zero$1(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate$1(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$1(b)
          : (t === "number" ? interpolateNumber$1
          : t === "string" ? ((c = color$1(b)) ? (b = c, rgb$2) : string$1)
          : b instanceof color$1 ? rgb$2
          : b instanceof Date ? date$1
          : isNumberArray$1(b) ? numberArray$1
          : Array.isArray(b) ? genericArray$1
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object$1
          : interpolateNumber$1)(a, b);
    }

    function interpolateRound$1(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants$1(x) {
      return function() {
        return x;
      };
    }

    function number$2(x) {
      return +x;
    }

    var unit$1 = [0, 1];

    function identity$4(x) {
      return x;
    }

    function normalize$1(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants$1(isNaN(b) ? NaN : 0.5);
    }

    function clamper$1(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap$1(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize$1(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize$1(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap$1(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize$1(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect$1(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy$1(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer$1() {
      var domain = unit$1,
          range = unit$1,
          interpolate = interpolate$1,
          transform,
          untransform,
          unknown,
          clamp = identity$4,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$4) clamp = clamper$1(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap$1 : bimap$1;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber$1)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number$2), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate = interpolateRound$1, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$4, rescale()) : clamp !== identity$4;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous$1() {
      return transformer$1()(identity$4, identity$4);
    }

    function formatDecimal$1(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts$1(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent$1(x) {
      return x = formatDecimalParts$1(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup$1(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals$1(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re$1 = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier$1(specifier) {
      if (!(match = re$1.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier$1({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier$1.prototype = FormatSpecifier$1.prototype; // instanceof

    function FormatSpecifier$1(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier$1.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim$1(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent$1;

    function formatPrefixAuto$1(x, p) {
      var d = formatDecimalParts$1(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent$1 = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts$1(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded$1(x, p) {
      var d = formatDecimalParts$1(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes$1 = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal$1,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded$1(x * 100, p),
      "r": formatRounded$1,
      "s": formatPrefixAuto$1,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$3(x) {
      return x;
    }

    var map$1 = Array.prototype.map,
        prefixes$1 = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale$1(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$3 : formatGroup$1(map$1.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$3 : formatNumerals$1(map$1.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier$1(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes$1[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes$1[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim$1(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes$1[8 + prefixExponent$1 / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier$1(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes$1[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale$1;
    var format$1;
    var formatPrefix$1;

    defaultLocale$1({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      format$1 = locale$1.format;
      formatPrefix$1 = locale$1.formatPrefix;
      return locale$1;
    }

    function precisionFixed$1(step) {
      return Math.max(0, -exponent$1(Math.abs(step)));
    }

    function precisionPrefix$1(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent$1(value) / 3))) * 3 - exponent$1(Math.abs(step)));
    }

    function precisionRound$1(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent$1(max) - exponent$1(step)) + 1;
    }

    function tickFormat$1(start, stop, count, specifier) {
      var step = tickStep$1(start, stop, count),
          precision;
      specifier = formatSpecifier$1(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix$1(step, value))) specifier.precision = precision;
          return formatPrefix$1(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound$1(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed$1(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format$1(specifier);
    }

    function linearish$1(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks$1(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat$1(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement$1(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear$2() {
      var scale = continuous$1();

      scale.copy = function() {
        return copy$1(scale, linear$2());
      };

      initRange$1.apply(scale, arguments);

      return linearish$1(scale);
    }

    function transformPow(exponent) {
      return function(x) {
        return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
      };
    }

    function transformSqrt(x) {
      return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
    }

    function transformSquare(x) {
      return x < 0 ? -x * x : x * x;
    }

    function powish(transform) {
      var scale = transform(identity$4, identity$4),
          exponent = 1;

      function rescale() {
        return exponent === 1 ? transform(identity$4, identity$4)
            : exponent === 0.5 ? transform(transformSqrt, transformSquare)
            : transform(transformPow(exponent), transformPow(1 / exponent));
      }

      scale.exponent = function(_) {
        return arguments.length ? (exponent = +_, rescale()) : exponent;
      };

      return linearish$1(scale);
    }

    function pow$2() {
      var scale = powish(transformer$1());

      scale.copy = function() {
        return copy$1(scale, pow$2()).exponent(scale.exponent());
      };

      initRange$1.apply(scale, arguments);

      return scale;
    }

    function sqrt() {
      return pow$2.apply(null, arguments).exponent(0.5);
    }

    var defaultScales = {
    	x: linear$2,
    	y: linear$2,
    	z: linear$2,
    	r: sqrt
    };

    /* --------------------------------------------
     *
     * Determine whether a scale is a log, symlog, power or other
     * This is not meant to be exhaustive of all the different types of
     * scales in d3-scale and focuses on continuous scales
     *
     * --------------------------------------------
     */
    function findScaleType(scale) {
    	if (scale.constant) {
    		return 'symlog';
    	}
    	if (scale.base) {
    		return 'log';
    	}
    	if (scale.exponent) {
    		if (scale.exponent() === 0.5) {
    			return 'sqrt';
    		}
    		return 'pow';
    	}
    	return 'other';
    }

    function identity$2 (d) {
    	return d;
    }

    function log(sign) {
    	return x => Math.log(sign * x);
    }

    function exp(sign) {
    	return x => sign * Math.exp(x);
    }

    function symlog$1(c) {
    	return x => Math.sign(x) * Math.log1p(Math.abs(x / c));
    }

    function symexp(c) {
    	return x => Math.sign(x) * Math.expm1(Math.abs(x)) * c;
    }

    function pow$1(exponent) {
    	return function powFn(x) {
    		return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    	};
    }

    function getPadFunctions(scale) {
    	const scaleType = findScaleType(scale);

    	if (scaleType === 'log') {
    		const sign = Math.sign(scale.domain()[0]);
    		return { lift: log(sign), ground: exp(sign), scaleType };
    	}
    	if (scaleType === 'pow') {
    		const exponent = 1;
    		return { lift: pow$1(exponent), ground: pow$1(1 / exponent), scaleType };
    	}
    	if (scaleType === 'sqrt') {
    		const exponent = 0.5;
    		return { lift: pow$1(exponent), ground: pow$1(1 / exponent), scaleType };
    	}
    	if (scaleType === 'symlog') {
    		const constant = 1;
    		return { lift: symlog$1(constant), ground: symexp(constant), scaleType };
    	}

    	return { lift: identity$2, ground: identity$2, scaleType };
    }

    /* --------------------------------------------
     *
     * Returns a modified scale domain by in/decreasing
     * the min/max by taking the desired difference
     * in pixels and converting it to units of data.
     * Returns an array that you can set as the new domain.
     * Padding contributed by @veltman.
     * See here for discussion of transforms: https://github.com/d3/d3-scale/issues/150
     *
     * --------------------------------------------
     */

    function padScale (scale, padding) {
    	if (typeof scale.range !== 'function') {
    		throw new Error('Scale method `range` must be a function');
    	}
    	if (typeof scale.domain !== 'function') {
    		throw new Error('Scale method `domain` must be a function');
    	}
    	if (!Array.isArray(padding)) {
    		return scale.domain();
    	}

    	if (scale.domain().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a domain of length 2 to use padding. Are you sure you want to use padding? Your scale\'s domain is:', scale.domain());
    	}
    	if (scale.range().length !== 2) {
    		console.warn('[LayerCake] The scale is expected to have a range of length 2 to use padding. Are you sure you want to use padding? Your scale\'s range is:', scale.range());
    	}

    	const { lift, ground } = getPadFunctions(scale);

    	const d0 = scale.domain()[0];

    	const isTime = Object.prototype.toString.call(d0) === '[object Date]';

    	const [d1, d2] = scale.domain().map(d => {
    		return isTime ? lift(d.getTime()) : lift(d);
    	});
    	const [r1, r2] = scale.range();
    	const paddingLeft = padding[0] || 0;
    	const paddingRight = padding[1] || 0;

    	const step = (d2 - d1) / (Math.abs(r2 - r1) - paddingLeft - paddingRight); // Math.abs() to properly handle reversed scales

    	return [d1 - paddingLeft * step, paddingRight * step + d2].map(d => {
    		return isTime ? ground(new Date(d)) : ground(d);
    	});
    }

    /* eslint-disable no-nested-ternary */
    function calcBaseRange(s, width, height, reverse, percentRange) {
    	let min;
    	let max;
    	if (percentRange === true) {
    		min = 0;
    		max = 100;
    	} else {
    		min = s === 'r' ? 1 : 0;
    		max = s === 'y' ? height : s === 'r' ? 25 : width;
    	}
    	return reverse === true ? [max, min] : [min, max];
    }

    function getDefaultRange(s, width, height, reverse, range, percentRange) {
    	return !range
    		? calcBaseRange(s, width, height, reverse, percentRange)
    		: typeof range === 'function'
    			? range({ width, height })
    			: range;
    }

    function createScale (s) {
    	return function scaleCreator ([$scale, $extents, $domain, $padding, $nice, $reverse, $width, $height, $range, $percentScale]) {
    		if ($extents === null) {
    			return null;
    		}

    		const defaultRange = getDefaultRange(s, $width, $height, $reverse, $range, $percentScale);

    		const scale = $scale === defaultScales[s] ? $scale() : $scale.copy();

    		/* --------------------------------------------
    		 * On creation, `$domain` will already have any nulls filled in
    		 * But if we set it via the context it might not, so rerun it through partialDomain
    		 */
    		scale
    			.domain(partialDomain($extents[s], $domain))
    			.range(defaultRange);

    		if ($padding) {
    			scale.domain(padScale(scale, $padding));
    		}

    		if ($nice === true) {
    			if (typeof scale.nice === 'function') {
    				scale.nice();
    			} else {
    				console.error(`[Layer Cake] You set \`${s}Nice: true\` but the ${s}Scale does not have a \`.nice\` method. Ignoring...`);
    			}
    		}

    		return scale;
    	};
    }

    function createGetter ([$acc, $scale]) {
    	return d => {
    		const val = $acc(d);
    		if (Array.isArray(val)) {
    			return val.map(v => $scale(v));
    		}
    		return $scale(val);
    	};
    }

    function getRange([$scale]) {
    	if (typeof $scale === 'function') {
    		if (typeof $scale.range === 'function') {
    			return $scale.range();
    		}
    		console.error('[LayerCake] Your scale doesn\'t have a `.range` method?');
    	}
    	return null;
    }

    var defaultReverses = {
    	x: false,
    	y: true,
    	z: false,
    	r: false
    };

    /* node_modules/layercake/src/LayerCake.svelte generated by Svelte v3.43.1 */

    const { Object: Object_1$3, console: console_1$4 } = globals;
    const file$t = "node_modules/layercake/src/LayerCake.svelte";

    const get_default_slot_changes$2 = dirty => ({
    	element: dirty[0] & /*element*/ 4,
    	width: dirty[0] & /*$width_d*/ 64,
    	height: dirty[0] & /*$height_d*/ 128,
    	aspectRatio: dirty[0] & /*$aspectRatio_d*/ 256,
    	containerWidth: dirty[0] & /*$_containerWidth*/ 512,
    	containerHeight: dirty[0] & /*$_containerHeight*/ 1024
    });

    const get_default_slot_context$2 = ctx => ({
    	element: /*element*/ ctx[2],
    	width: /*$width_d*/ ctx[6],
    	height: /*$height_d*/ ctx[7],
    	aspectRatio: /*$aspectRatio_d*/ ctx[8],
    	containerWidth: /*$_containerWidth*/ ctx[9],
    	containerHeight: /*$_containerHeight*/ ctx[10]
    });

    // (308:0) {#if (ssr === true || typeof window !== 'undefined')}
    function create_if_block$j(ctx) {
    	let div;
    	let div_style_value;
    	let div_resize_listener;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[54].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[53], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-container svelte-vhzpsp");

    			attr_dev(div, "style", div_style_value = "position:" + /*position*/ ctx[5] + "; " + (/*position*/ ctx[5] === 'absolute'
    			? 'top:0;right:0;bottom:0;left:0;'
    			: '') + " " + (/*pointerEvents*/ ctx[4] === false
    			? 'pointer-events:none;'
    			: '') + "");

    			add_render_callback(() => /*div_elementresize_handler*/ ctx[56].call(div));
    			add_location(div, file$t, 308, 1, 9512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[55](div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[56].bind(div));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*element, $width_d, $height_d, $aspectRatio_d, $_containerWidth, $_containerHeight*/ 1988 | dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[53], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			if (!current || dirty[0] & /*position, pointerEvents*/ 48 && div_style_value !== (div_style_value = "position:" + /*position*/ ctx[5] + "; " + (/*position*/ ctx[5] === 'absolute'
    			? 'top:0;right:0;bottom:0;left:0;'
    			: '') + " " + (/*pointerEvents*/ ctx[4] === false
    			? 'pointer-events:none;'
    			: '') + "")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[55](null);
    			div_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(308:0) {#if (ssr === true || typeof window !== 'undefined')}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') && create_if_block$j(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ssr*/ ctx[3] === true || typeof window !== 'undefined') {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*ssr*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let context;
    	let $width_d;
    	let $height_d;
    	let $aspectRatio_d;
    	let $_containerWidth;
    	let $_containerHeight;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayerCake', slots, ['default']);
    	let { ssr = false } = $$props;
    	let { pointerEvents = true } = $$props;
    	let { position = 'relative' } = $$props;
    	let { percentRange = false } = $$props;
    	let { width = undefined } = $$props;
    	let { height = undefined } = $$props;
    	let { containerWidth = width || 100 } = $$props;
    	let { containerHeight = height || 100 } = $$props;
    	let { element = undefined } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { z = undefined } = $$props;
    	let { r = undefined } = $$props;
    	let { custom = {} } = $$props;
    	let { data = [] } = $$props;
    	let { xDomain = undefined } = $$props;
    	let { yDomain = undefined } = $$props;
    	let { zDomain = undefined } = $$props;
    	let { rDomain = undefined } = $$props;
    	let { xNice = false } = $$props;
    	let { yNice = false } = $$props;
    	let { zNice = false } = $$props;
    	let { rNice = false } = $$props;
    	let { xReverse = defaultReverses.x } = $$props;
    	let { yReverse = defaultReverses.y } = $$props;
    	let { zReverse = defaultReverses.z } = $$props;
    	let { rReverse = defaultReverses.r } = $$props;
    	let { xPadding = undefined } = $$props;
    	let { yPadding = undefined } = $$props;
    	let { zPadding = undefined } = $$props;
    	let { rPadding = undefined } = $$props;
    	let { xScale = defaultScales.x } = $$props;
    	let { yScale = defaultScales.y } = $$props;
    	let { zScale = defaultScales.y } = $$props;
    	let { rScale = defaultScales.r } = $$props;
    	let { xRange = undefined } = $$props;
    	let { yRange = undefined } = $$props;
    	let { zRange = undefined } = $$props;
    	let { rRange = undefined } = $$props;
    	let { padding = {} } = $$props;
    	let { extents = {} } = $$props;
    	let { flatData = undefined } = $$props;

    	/* --------------------------------------------
     * Preserve a copy of our passed in settings before we modify them
     * Return this to the user's context so they can reference things if need be
     * Add the active keys since those aren't on our settings object.
     * This is mostly an escape-hatch
     */
    	const config = {};

    	/* --------------------------------------------
     * Make store versions of each parameter
     * Prefix these with `_` to keep things organized
     */
    	const _percentRange = writable();

    	const _containerWidth = writable();
    	validate_store(_containerWidth, '_containerWidth');
    	component_subscribe($$self, _containerWidth, value => $$invalidate(9, $_containerWidth = value));
    	const _containerHeight = writable();
    	validate_store(_containerHeight, '_containerHeight');
    	component_subscribe($$self, _containerHeight, value => $$invalidate(10, $_containerHeight = value));
    	const _x = writable();
    	const _y = writable();
    	const _z = writable();
    	const _r = writable();
    	const _custom = writable();
    	const _data = writable();
    	const _xDomain = writable();
    	const _yDomain = writable();
    	const _zDomain = writable();
    	const _rDomain = writable();
    	const _xNice = writable();
    	const _yNice = writable();
    	const _zNice = writable();
    	const _rNice = writable();
    	const _xReverse = writable();
    	const _yReverse = writable();
    	const _zReverse = writable();
    	const _rReverse = writable();
    	const _xPadding = writable();
    	const _yPadding = writable();
    	const _zPadding = writable();
    	const _rPadding = writable();
    	const _xScale = writable();
    	const _yScale = writable();
    	const _zScale = writable();
    	const _rScale = writable();
    	const _xRange = writable();
    	const _yRange = writable();
    	const _zRange = writable();
    	const _rRange = writable();
    	const _padding = writable();
    	const _flatData = writable();
    	const _extents = writable();
    	const _config = writable(config);

    	/* --------------------------------------------
     * Create derived values
     * Suffix these with `_d`
     */
    	const activeGetters_d = derived([_x, _y, _z, _r], ([$x, $y, $z, $r]) => {
    		const obj = {};

    		if ($x) {
    			obj.x = $x;
    		}

    		if ($y) {
    			obj.y = $y;
    		}

    		if ($z) {
    			obj.z = $z;
    		}

    		if ($r) {
    			obj.r = $r;
    		}

    		return obj;
    	});

    	const padding_d = derived([_padding, _containerWidth, _containerHeight], ([$padding]) => {
    		const defaultPadding = { top: 0, right: 0, bottom: 0, left: 0 };
    		return Object.assign(defaultPadding, $padding);
    	});

    	const box_d = derived([_containerWidth, _containerHeight, padding_d], ([$containerWidth, $containerHeight, $padding]) => {
    		const b = {};
    		b.top = $padding.top;
    		b.right = $containerWidth - $padding.right;
    		b.bottom = $containerHeight - $padding.bottom;
    		b.left = $padding.left;
    		b.width = b.right - b.left;
    		b.height = b.bottom - b.top;

    		if (b.width <= 0) {
    			console.error('[LayerCake] Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?');
    		}

    		if (b.height <= 0) {
    			console.error('[LayerCake] Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?');
    		}

    		return b;
    	});

    	const width_d = derived([box_d], ([$box]) => {
    		return $box.width;
    	});

    	validate_store(width_d, 'width_d');
    	component_subscribe($$self, width_d, value => $$invalidate(6, $width_d = value));

    	const height_d = derived([box_d], ([$box]) => {
    		return $box.height;
    	});

    	validate_store(height_d, 'height_d');
    	component_subscribe($$self, height_d, value => $$invalidate(7, $height_d = value));

    	/* --------------------------------------------
     * Calculate extents by taking the extent of the data
     * and filling that in with anything set by the user
     */
    	const extents_d = derived([_flatData, activeGetters_d, _extents], ([$flatData, $activeGetters, $extents]) => {
    		const getters = filterObject($activeGetters, $extents);

    		if (Object.keys(getters).length > 0) {
    			return {
    				...calcExtents($flatData, getters),
    				...$extents
    			};
    		} else {
    			return {};
    		}
    	});

    	const xDomain_d = derived([extents_d, _xDomain], calcDomain('x'));
    	const yDomain_d = derived([extents_d, _yDomain], calcDomain('y'));
    	const zDomain_d = derived([extents_d, _zDomain], calcDomain('z'));
    	const rDomain_d = derived([extents_d, _rDomain], calcDomain('r'));

    	const xScale_d = derived(
    		[
    			_xScale,
    			extents_d,
    			xDomain_d,
    			_xPadding,
    			_xNice,
    			_xReverse,
    			width_d,
    			height_d,
    			_xRange,
    			_percentRange
    		],
    		createScale('x')
    	);

    	const xGet_d = derived([_x, xScale_d], createGetter);

    	const yScale_d = derived(
    		[
    			_yScale,
    			extents_d,
    			yDomain_d,
    			_yPadding,
    			_yNice,
    			_yReverse,
    			width_d,
    			height_d,
    			_yRange,
    			_percentRange
    		],
    		createScale('y')
    	);

    	const yGet_d = derived([_y, yScale_d], createGetter);

    	const zScale_d = derived(
    		[
    			_zScale,
    			extents_d,
    			zDomain_d,
    			_zPadding,
    			_zNice,
    			_zReverse,
    			width_d,
    			height_d,
    			_zRange,
    			_percentRange
    		],
    		createScale('z')
    	);

    	const zGet_d = derived([_z, zScale_d], createGetter);

    	const rScale_d = derived(
    		[
    			_rScale,
    			extents_d,
    			rDomain_d,
    			_rPadding,
    			_rNice,
    			_rReverse,
    			width_d,
    			height_d,
    			_rRange,
    			_percentRange
    		],
    		createScale('r')
    	);

    	const rGet_d = derived([_r, rScale_d], createGetter);
    	const xRange_d = derived([xScale_d], getRange);
    	const yRange_d = derived([yScale_d], getRange);
    	const zRange_d = derived([zScale_d], getRange);
    	const rRange_d = derived([rScale_d], getRange);

    	const aspectRatio_d = derived([width_d, height_d], ([$aspectRatio, $width, $height]) => {
    		return $width / $height;
    	});

    	validate_store(aspectRatio_d, 'aspectRatio_d');
    	component_subscribe($$self, aspectRatio_d, value => $$invalidate(8, $aspectRatio_d = value));

    	const writable_props = [
    		'ssr',
    		'pointerEvents',
    		'position',
    		'percentRange',
    		'width',
    		'height',
    		'containerWidth',
    		'containerHeight',
    		'element',
    		'x',
    		'y',
    		'z',
    		'r',
    		'custom',
    		'data',
    		'xDomain',
    		'yDomain',
    		'zDomain',
    		'rDomain',
    		'xNice',
    		'yNice',
    		'zNice',
    		'rNice',
    		'xReverse',
    		'yReverse',
    		'zReverse',
    		'rReverse',
    		'xPadding',
    		'yPadding',
    		'zPadding',
    		'rPadding',
    		'xScale',
    		'yScale',
    		'zScale',
    		'rScale',
    		'xRange',
    		'yRange',
    		'zRange',
    		'rRange',
    		'padding',
    		'extents',
    		'flatData'
    	];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<LayerCake> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	function div_elementresize_handler() {
    		containerWidth = this.clientWidth;
    		containerHeight = this.clientHeight;
    		$$invalidate(0, containerWidth);
    		$$invalidate(1, containerHeight);
    	}

    	$$self.$$set = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(16, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(17, width = $$props.width);
    		if ('height' in $$props) $$invalidate(18, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(19, x = $$props.x);
    		if ('y' in $$props) $$invalidate(20, y = $$props.y);
    		if ('z' in $$props) $$invalidate(21, z = $$props.z);
    		if ('r' in $$props) $$invalidate(22, r = $$props.r);
    		if ('custom' in $$props) $$invalidate(23, custom = $$props.custom);
    		if ('data' in $$props) $$invalidate(24, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(25, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(26, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(27, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(28, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(29, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(30, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(31, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(32, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(33, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(34, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(35, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(36, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(37, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(38, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(39, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(40, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(41, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(42, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(43, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(44, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(45, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(46, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(47, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(48, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(49, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(50, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(51, flatData = $$props.flatData);
    		if ('$$scope' in $$props) $$invalidate(53, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		writable,
    		derived,
    		makeAccessor,
    		filterObject,
    		calcExtents,
    		calcDomain,
    		createScale,
    		createGetter,
    		getRange,
    		defaultScales,
    		defaultReverses,
    		ssr,
    		pointerEvents,
    		position,
    		percentRange,
    		width,
    		height,
    		containerWidth,
    		containerHeight,
    		element,
    		x,
    		y,
    		z,
    		r,
    		custom,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		config,
    		_percentRange,
    		_containerWidth,
    		_containerHeight,
    		_x,
    		_y,
    		_z,
    		_r,
    		_custom,
    		_data,
    		_xDomain,
    		_yDomain,
    		_zDomain,
    		_rDomain,
    		_xNice,
    		_yNice,
    		_zNice,
    		_rNice,
    		_xReverse,
    		_yReverse,
    		_zReverse,
    		_rReverse,
    		_xPadding,
    		_yPadding,
    		_zPadding,
    		_rPadding,
    		_xScale,
    		_yScale,
    		_zScale,
    		_rScale,
    		_xRange,
    		_yRange,
    		_zRange,
    		_rRange,
    		_padding,
    		_flatData,
    		_extents,
    		_config,
    		activeGetters_d,
    		padding_d,
    		box_d,
    		width_d,
    		height_d,
    		extents_d,
    		xDomain_d,
    		yDomain_d,
    		zDomain_d,
    		rDomain_d,
    		xScale_d,
    		xGet_d,
    		yScale_d,
    		yGet_d,
    		zScale_d,
    		zGet_d,
    		rScale_d,
    		rGet_d,
    		xRange_d,
    		yRange_d,
    		zRange_d,
    		rRange_d,
    		aspectRatio_d,
    		context,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$_containerWidth,
    		$_containerHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('ssr' in $$props) $$invalidate(3, ssr = $$props.ssr);
    		if ('pointerEvents' in $$props) $$invalidate(4, pointerEvents = $$props.pointerEvents);
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('percentRange' in $$props) $$invalidate(16, percentRange = $$props.percentRange);
    		if ('width' in $$props) $$invalidate(17, width = $$props.width);
    		if ('height' in $$props) $$invalidate(18, height = $$props.height);
    		if ('containerWidth' in $$props) $$invalidate(0, containerWidth = $$props.containerWidth);
    		if ('containerHeight' in $$props) $$invalidate(1, containerHeight = $$props.containerHeight);
    		if ('element' in $$props) $$invalidate(2, element = $$props.element);
    		if ('x' in $$props) $$invalidate(19, x = $$props.x);
    		if ('y' in $$props) $$invalidate(20, y = $$props.y);
    		if ('z' in $$props) $$invalidate(21, z = $$props.z);
    		if ('r' in $$props) $$invalidate(22, r = $$props.r);
    		if ('custom' in $$props) $$invalidate(23, custom = $$props.custom);
    		if ('data' in $$props) $$invalidate(24, data = $$props.data);
    		if ('xDomain' in $$props) $$invalidate(25, xDomain = $$props.xDomain);
    		if ('yDomain' in $$props) $$invalidate(26, yDomain = $$props.yDomain);
    		if ('zDomain' in $$props) $$invalidate(27, zDomain = $$props.zDomain);
    		if ('rDomain' in $$props) $$invalidate(28, rDomain = $$props.rDomain);
    		if ('xNice' in $$props) $$invalidate(29, xNice = $$props.xNice);
    		if ('yNice' in $$props) $$invalidate(30, yNice = $$props.yNice);
    		if ('zNice' in $$props) $$invalidate(31, zNice = $$props.zNice);
    		if ('rNice' in $$props) $$invalidate(32, rNice = $$props.rNice);
    		if ('xReverse' in $$props) $$invalidate(33, xReverse = $$props.xReverse);
    		if ('yReverse' in $$props) $$invalidate(34, yReverse = $$props.yReverse);
    		if ('zReverse' in $$props) $$invalidate(35, zReverse = $$props.zReverse);
    		if ('rReverse' in $$props) $$invalidate(36, rReverse = $$props.rReverse);
    		if ('xPadding' in $$props) $$invalidate(37, xPadding = $$props.xPadding);
    		if ('yPadding' in $$props) $$invalidate(38, yPadding = $$props.yPadding);
    		if ('zPadding' in $$props) $$invalidate(39, zPadding = $$props.zPadding);
    		if ('rPadding' in $$props) $$invalidate(40, rPadding = $$props.rPadding);
    		if ('xScale' in $$props) $$invalidate(41, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(42, yScale = $$props.yScale);
    		if ('zScale' in $$props) $$invalidate(43, zScale = $$props.zScale);
    		if ('rScale' in $$props) $$invalidate(44, rScale = $$props.rScale);
    		if ('xRange' in $$props) $$invalidate(45, xRange = $$props.xRange);
    		if ('yRange' in $$props) $$invalidate(46, yRange = $$props.yRange);
    		if ('zRange' in $$props) $$invalidate(47, zRange = $$props.zRange);
    		if ('rRange' in $$props) $$invalidate(48, rRange = $$props.rRange);
    		if ('padding' in $$props) $$invalidate(49, padding = $$props.padding);
    		if ('extents' in $$props) $$invalidate(50, extents = $$props.extents);
    		if ('flatData' in $$props) $$invalidate(51, flatData = $$props.flatData);
    		if ('context' in $$props) $$invalidate(52, context = $$props.context);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*x*/ 524288) {
    			if (x) config.x = x;
    		}

    		if ($$self.$$.dirty[0] & /*y*/ 1048576) {
    			if (y) config.y = y;
    		}

    		if ($$self.$$.dirty[0] & /*z*/ 2097152) {
    			if (z) config.z = z;
    		}

    		if ($$self.$$.dirty[0] & /*r*/ 4194304) {
    			if (r) config.r = r;
    		}

    		if ($$self.$$.dirty[0] & /*xDomain*/ 33554432) {
    			if (xDomain) config.xDomain = xDomain;
    		}

    		if ($$self.$$.dirty[0] & /*yDomain*/ 67108864) {
    			if (yDomain) config.yDomain = yDomain;
    		}

    		if ($$self.$$.dirty[0] & /*zDomain*/ 134217728) {
    			if (zDomain) config.zDomain = zDomain;
    		}

    		if ($$self.$$.dirty[0] & /*rDomain*/ 268435456) {
    			if (rDomain) config.rDomain = rDomain;
    		}

    		if ($$self.$$.dirty[1] & /*xRange*/ 16384) {
    			if (xRange) config.xRange = xRange;
    		}

    		if ($$self.$$.dirty[1] & /*yRange*/ 32768) {
    			if (yRange) config.yRange = yRange;
    		}

    		if ($$self.$$.dirty[1] & /*zRange*/ 65536) {
    			if (zRange) config.zRange = zRange;
    		}

    		if ($$self.$$.dirty[1] & /*rRange*/ 131072) {
    			if (rRange) config.rRange = rRange;
    		}

    		if ($$self.$$.dirty[0] & /*percentRange*/ 65536) {
    			_percentRange.set(percentRange);
    		}

    		if ($$self.$$.dirty[0] & /*containerWidth*/ 1) {
    			_containerWidth.set(containerWidth);
    		}

    		if ($$self.$$.dirty[0] & /*containerHeight*/ 2) {
    			_containerHeight.set(containerHeight);
    		}

    		if ($$self.$$.dirty[0] & /*x*/ 524288) {
    			_x.set(makeAccessor(x));
    		}

    		if ($$self.$$.dirty[0] & /*y*/ 1048576) {
    			_y.set(makeAccessor(y));
    		}

    		if ($$self.$$.dirty[0] & /*z*/ 2097152) {
    			_z.set(makeAccessor(z));
    		}

    		if ($$self.$$.dirty[0] & /*r*/ 4194304) {
    			_r.set(makeAccessor(r));
    		}

    		if ($$self.$$.dirty[0] & /*xDomain*/ 33554432) {
    			_xDomain.set(xDomain);
    		}

    		if ($$self.$$.dirty[0] & /*yDomain*/ 67108864) {
    			_yDomain.set(yDomain);
    		}

    		if ($$self.$$.dirty[0] & /*zDomain*/ 134217728) {
    			_zDomain.set(zDomain);
    		}

    		if ($$self.$$.dirty[0] & /*rDomain*/ 268435456) {
    			_rDomain.set(rDomain);
    		}

    		if ($$self.$$.dirty[0] & /*custom*/ 8388608) {
    			_custom.set(custom);
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 16777216) {
    			_data.set(data);
    		}

    		if ($$self.$$.dirty[0] & /*xNice*/ 536870912) {
    			_xNice.set(xNice);
    		}

    		if ($$self.$$.dirty[0] & /*yNice*/ 1073741824) {
    			_yNice.set(yNice);
    		}

    		if ($$self.$$.dirty[1] & /*zNice*/ 1) {
    			_zNice.set(zNice);
    		}

    		if ($$self.$$.dirty[1] & /*rNice*/ 2) {
    			_rNice.set(rNice);
    		}

    		if ($$self.$$.dirty[1] & /*xReverse*/ 4) {
    			_xReverse.set(xReverse);
    		}

    		if ($$self.$$.dirty[1] & /*yReverse*/ 8) {
    			_yReverse.set(yReverse);
    		}

    		if ($$self.$$.dirty[1] & /*zReverse*/ 16) {
    			_zReverse.set(zReverse);
    		}

    		if ($$self.$$.dirty[1] & /*rReverse*/ 32) {
    			_rReverse.set(rReverse);
    		}

    		if ($$self.$$.dirty[1] & /*xPadding*/ 64) {
    			_xPadding.set(xPadding);
    		}

    		if ($$self.$$.dirty[1] & /*yPadding*/ 128) {
    			_yPadding.set(yPadding);
    		}

    		if ($$self.$$.dirty[1] & /*zPadding*/ 256) {
    			_zPadding.set(zPadding);
    		}

    		if ($$self.$$.dirty[1] & /*rPadding*/ 512) {
    			_rPadding.set(rPadding);
    		}

    		if ($$self.$$.dirty[1] & /*xScale*/ 1024) {
    			_xScale.set(xScale);
    		}

    		if ($$self.$$.dirty[1] & /*yScale*/ 2048) {
    			_yScale.set(yScale);
    		}

    		if ($$self.$$.dirty[1] & /*zScale*/ 4096) {
    			_zScale.set(zScale);
    		}

    		if ($$self.$$.dirty[1] & /*rScale*/ 8192) {
    			_rScale.set(rScale);
    		}

    		if ($$self.$$.dirty[1] & /*xRange*/ 16384) {
    			_xRange.set(xRange);
    		}

    		if ($$self.$$.dirty[1] & /*yRange*/ 32768) {
    			_yRange.set(yRange);
    		}

    		if ($$self.$$.dirty[1] & /*zRange*/ 65536) {
    			_zRange.set(zRange);
    		}

    		if ($$self.$$.dirty[1] & /*rRange*/ 131072) {
    			_rRange.set(rRange);
    		}

    		if ($$self.$$.dirty[1] & /*padding*/ 262144) {
    			_padding.set(padding);
    		}

    		if ($$self.$$.dirty[1] & /*extents*/ 524288) {
    			_extents.set(filterObject(extents));
    		}

    		if ($$self.$$.dirty[0] & /*data*/ 16777216 | $$self.$$.dirty[1] & /*flatData*/ 1048576) {
    			_flatData.set(flatData || data);
    		}

    		if ($$self.$$.dirty[1] & /*context*/ 2097152) {
    			setContext('LayerCake', context);
    		}
    	};

    	$$invalidate(52, context = {
    		activeGetters: activeGetters_d,
    		width: width_d,
    		height: height_d,
    		percentRange: _percentRange,
    		aspectRatio: aspectRatio_d,
    		containerWidth: _containerWidth,
    		containerHeight: _containerHeight,
    		x: _x,
    		y: _y,
    		z: _z,
    		r: _r,
    		custom: _custom,
    		data: _data,
    		xNice: _xNice,
    		yNice: _yNice,
    		zNice: _zNice,
    		rNice: _rNice,
    		xReverse: _xReverse,
    		yReverse: _yReverse,
    		zReverse: _zReverse,
    		rReverse: _rReverse,
    		xPadding: _xPadding,
    		yPadding: _yPadding,
    		zPadding: _zPadding,
    		rPadding: _rPadding,
    		padding: padding_d,
    		flatData: _flatData,
    		extents: extents_d,
    		xDomain: xDomain_d,
    		yDomain: yDomain_d,
    		zDomain: zDomain_d,
    		rDomain: rDomain_d,
    		xRange: xRange_d,
    		yRange: yRange_d,
    		zRange: zRange_d,
    		rRange: rRange_d,
    		config: _config,
    		xScale: xScale_d,
    		xGet: xGet_d,
    		yScale: yScale_d,
    		yGet: yGet_d,
    		zScale: zScale_d,
    		zGet: zGet_d,
    		rScale: rScale_d,
    		rGet: rGet_d
    	});

    	return [
    		containerWidth,
    		containerHeight,
    		element,
    		ssr,
    		pointerEvents,
    		position,
    		$width_d,
    		$height_d,
    		$aspectRatio_d,
    		$_containerWidth,
    		$_containerHeight,
    		_containerWidth,
    		_containerHeight,
    		width_d,
    		height_d,
    		aspectRatio_d,
    		percentRange,
    		width,
    		height,
    		x,
    		y,
    		z,
    		r,
    		custom,
    		data,
    		xDomain,
    		yDomain,
    		zDomain,
    		rDomain,
    		xNice,
    		yNice,
    		zNice,
    		rNice,
    		xReverse,
    		yReverse,
    		zReverse,
    		rReverse,
    		xPadding,
    		yPadding,
    		zPadding,
    		rPadding,
    		xScale,
    		yScale,
    		zScale,
    		rScale,
    		xRange,
    		yRange,
    		zRange,
    		rRange,
    		padding,
    		extents,
    		flatData,
    		context,
    		$$scope,
    		slots,
    		div_binding,
    		div_elementresize_handler
    	];
    }

    class LayerCake extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$w,
    			create_fragment$w,
    			safe_not_equal,
    			{
    				ssr: 3,
    				pointerEvents: 4,
    				position: 5,
    				percentRange: 16,
    				width: 17,
    				height: 18,
    				containerWidth: 0,
    				containerHeight: 1,
    				element: 2,
    				x: 19,
    				y: 20,
    				z: 21,
    				r: 22,
    				custom: 23,
    				data: 24,
    				xDomain: 25,
    				yDomain: 26,
    				zDomain: 27,
    				rDomain: 28,
    				xNice: 29,
    				yNice: 30,
    				zNice: 31,
    				rNice: 32,
    				xReverse: 33,
    				yReverse: 34,
    				zReverse: 35,
    				rReverse: 36,
    				xPadding: 37,
    				yPadding: 38,
    				zPadding: 39,
    				rPadding: 40,
    				xScale: 41,
    				yScale: 42,
    				zScale: 43,
    				rScale: 44,
    				xRange: 45,
    				yRange: 46,
    				zRange: 47,
    				rRange: 48,
    				padding: 49,
    				extents: 50,
    				flatData: 51
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayerCake",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get ssr() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ssr(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerWidth() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerWidth(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get z() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set z(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get custom() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set custom(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rDomain() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rDomain(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rNice() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rNice(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rReverse() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rReverse(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rPadding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rPadding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rScale() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rScale(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rRange() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rRange(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extents() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extents(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flatData() {
    		throw new Error("<LayerCake>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flatData(value) {
    		throw new Error("<LayerCake>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/src/layouts/Html.svelte generated by Svelte v3.43.1 */
    const file$s = "node_modules/layercake/src/layouts/Html.svelte";
    const get_default_slot_changes$1 = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context$1 = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$v(ctx) {
    	let div;
    	let div_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "layercake-layout-html svelte-1bu60uu");
    			attr_dev(div, "style", div_style_value = "top: " + /*$padding*/ ctx[3].top + "px; right:" + /*$padding*/ ctx[3].right + "px; bottom:" + /*$padding*/ ctx[3].bottom + "px; left:" + /*$padding*/ ctx[3].left + "px;" + /*zIndexStyle*/ ctx[1] + /*pointerEventsStyle*/ ctx[2]);
    			add_location(div, file$s, 16, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[9](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 129)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (!current || dirty & /*$padding, zIndexStyle, pointerEventsStyle*/ 14 && div_style_value !== (div_style_value = "top: " + /*$padding*/ ctx[3].top + "px; right:" + /*$padding*/ ctx[3].right + "px; bottom:" + /*$padding*/ ctx[3].bottom + "px; left:" + /*$padding*/ ctx[3].left + "px;" + /*zIndexStyle*/ ctx[1] + /*pointerEventsStyle*/ ctx[2])) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Html', slots, ['default']);
    	let { element = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let zIndexStyle = '';
    	let pointerEventsStyle = '';
    	const { padding } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(3, $padding = value));
    	const writable_props = ['element', 'zIndex', 'pointerEvents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Html> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(5, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(6, pointerEvents = $$props.pointerEvents);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		zIndex,
    		pointerEvents,
    		zIndexStyle,
    		pointerEventsStyle,
    		padding,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('zIndex' in $$props) $$invalidate(5, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(6, pointerEvents = $$props.pointerEvents);
    		if ('zIndexStyle' in $$props) $$invalidate(1, zIndexStyle = $$props.zIndexStyle);
    		if ('pointerEventsStyle' in $$props) $$invalidate(2, pointerEventsStyle = $$props.pointerEventsStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*zIndex*/ 32) {
    			$$invalidate(1, zIndexStyle = typeof zIndex !== 'undefined'
    			? `z-index:${zIndex};`
    			: '');
    		}

    		if ($$self.$$.dirty & /*pointerEvents*/ 64) {
    			$$invalidate(2, pointerEventsStyle = pointerEvents === false ? 'pointer-events:none;' : '');
    		}
    	};

    	return [
    		element,
    		zIndexStyle,
    		pointerEventsStyle,
    		$padding,
    		padding,
    		zIndex,
    		pointerEvents,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Html extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { element: 0, zIndex: 5, pointerEvents: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get element() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/layercake/src/layouts/Svg.svelte generated by Svelte v3.43.1 */
    const file$r = "node_modules/layercake/src/layouts/Svg.svelte";
    const get_default_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_default_slot_context = ctx => ({ element: /*element*/ ctx[0] });
    const get_defs_slot_changes = dirty => ({ element: dirty & /*element*/ 1 });
    const get_defs_slot_context = ctx => ({ element: /*element*/ ctx[0] });

    function create_fragment$u(ctx) {
    	let svg;
    	let defs;
    	let g;
    	let g_transform_value;
    	let svg_style_value;
    	let current;
    	const defs_slot_template = /*#slots*/ ctx[13].defs;
    	const defs_slot = create_slot(defs_slot_template, ctx, /*$$scope*/ ctx[12], get_defs_slot_context);
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			if (defs_slot) defs_slot.c();
    			g = svg_element("g");
    			if (default_slot) default_slot.c();
    			add_location(defs, file$r, 24, 1, 652);
    			attr_dev(g, "class", "layercake-layout-svg_g");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$padding*/ ctx[6].left + ", " + /*$padding*/ ctx[6].top + ")");
    			add_location(g, file$r, 27, 1, 697);
    			attr_dev(svg, "class", "layercake-layout-svg svelte-u84d8d");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "width", /*$containerWidth*/ ctx[4]);
    			attr_dev(svg, "height", /*$containerHeight*/ ctx[5]);
    			attr_dev(svg, "style", svg_style_value = "" + (/*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]));
    			add_location(svg, file$r, 16, 0, 487);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);

    			if (defs_slot) {
    				defs_slot.m(defs, null);
    			}

    			append_dev(svg, g);

    			if (default_slot) {
    				default_slot.m(g, null);
    			}

    			/*svg_binding*/ ctx[14](svg);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (defs_slot) {
    				if (defs_slot.p && (!current || dirty & /*$$scope, element*/ 4097)) {
    					update_slot_base(
    						defs_slot,
    						defs_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(defs_slot_template, /*$$scope*/ ctx[12], dirty, get_defs_slot_changes),
    						get_defs_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, element*/ 4097)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*$padding*/ 64 && g_transform_value !== (g_transform_value = "translate(" + /*$padding*/ ctx[6].left + ", " + /*$padding*/ ctx[6].top + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}

    			if (!current || dirty & /*$containerWidth*/ 16) {
    				attr_dev(svg, "width", /*$containerWidth*/ ctx[4]);
    			}

    			if (!current || dirty & /*$containerHeight*/ 32) {
    				attr_dev(svg, "height", /*$containerHeight*/ ctx[5]);
    			}

    			if (!current || dirty & /*zIndexStyle, pointerEventsStyle*/ 12 && svg_style_value !== (svg_style_value = "" + (/*zIndexStyle*/ ctx[2] + /*pointerEventsStyle*/ ctx[3]))) {
    				attr_dev(svg, "style", svg_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defs_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defs_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (defs_slot) defs_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			/*svg_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $containerWidth;
    	let $containerHeight;
    	let $padding;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svg', slots, ['defs','default']);
    	let { element = undefined } = $$props;
    	let { viewBox = undefined } = $$props;
    	let { zIndex = undefined } = $$props;
    	let { pointerEvents = undefined } = $$props;
    	let zIndexStyle = '';
    	let pointerEventsStyle = '';
    	const { containerWidth, containerHeight, padding } = getContext('LayerCake');
    	validate_store(containerWidth, 'containerWidth');
    	component_subscribe($$self, containerWidth, value => $$invalidate(4, $containerWidth = value));
    	validate_store(containerHeight, 'containerHeight');
    	component_subscribe($$self, containerHeight, value => $$invalidate(5, $containerHeight = value));
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(6, $padding = value));
    	const writable_props = ['element', 'viewBox', 'zIndex', 'pointerEvents'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svg> was created with unknown prop '${key}'`);
    	});

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('zIndex' in $$props) $$invalidate(10, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(11, pointerEvents = $$props.pointerEvents);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		element,
    		viewBox,
    		zIndex,
    		pointerEvents,
    		zIndexStyle,
    		pointerEventsStyle,
    		containerWidth,
    		containerHeight,
    		padding,
    		$containerWidth,
    		$containerHeight,
    		$padding
    	});

    	$$self.$inject_state = $$props => {
    		if ('element' in $$props) $$invalidate(0, element = $$props.element);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('zIndex' in $$props) $$invalidate(10, zIndex = $$props.zIndex);
    		if ('pointerEvents' in $$props) $$invalidate(11, pointerEvents = $$props.pointerEvents);
    		if ('zIndexStyle' in $$props) $$invalidate(2, zIndexStyle = $$props.zIndexStyle);
    		if ('pointerEventsStyle' in $$props) $$invalidate(3, pointerEventsStyle = $$props.pointerEventsStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*zIndex*/ 1024) {
    			$$invalidate(2, zIndexStyle = typeof zIndex !== 'undefined'
    			? `z-index:${zIndex};`
    			: '');
    		}

    		if ($$self.$$.dirty & /*pointerEvents*/ 2048) {
    			$$invalidate(3, pointerEventsStyle = pointerEvents === false ? 'pointer-events:none;' : '');
    		}
    	};

    	return [
    		element,
    		viewBox,
    		zIndexStyle,
    		pointerEventsStyle,
    		$containerWidth,
    		$containerHeight,
    		$padding,
    		containerWidth,
    		containerHeight,
    		padding,
    		zIndex,
    		pointerEvents,
    		$$scope,
    		slots,
    		svg_binding
    	];
    }

    class Svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			element: 0,
    			viewBox: 1,
    			zIndex: 10,
    			pointerEvents: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svg",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get element() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zIndex() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zIndex(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointerEvents() {
    		throw new Error("<Svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointerEvents(value) {
    		throw new Error("<Svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function ascending(a, b) {
      return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare1 = f;
      let compare2 = f;

      if (f.length !== 2) {
        delta = (d, x) => f(d) - x;
        compare1 = ascending;
        compare2 = (d, x) => ascending(f(d), x);
      }

      function left(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function right(a, x, lo = 0, hi = a.length) {
        if (lo < hi) {
          if (compare1(x, x) !== 0) return hi;
          do {
            const mid = (lo + hi) >>> 1;
            if (compare2(a[mid], x) <= 0) lo = mid + 1;
            else hi = mid;
          } while (lo < hi);
        }
        return lo;
      }

      function center(a, x, lo = 0, hi = a.length) {
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;
    var bisect = bisectRight;

    class InternMap extends Map {
      constructor(entries, key = keyof) {
        super();
        Object.defineProperties(this, {_intern: {value: new Map()}, _key: {value: key}});
        if (entries != null) for (const [key, value] of entries) this.set(key, value);
      }
      get(key) {
        return super.get(intern_get(this, key));
      }
      has(key) {
        return super.has(intern_get(this, key));
      }
      set(key, value) {
        return super.set(intern_set(this, key), value);
      }
      delete(key) {
        return super.delete(intern_delete(this, key));
      }
    }

    function intern_get({_intern, _key}, value) {
      const key = _key(value);
      return _intern.has(key) ? _intern.get(key) : value;
    }

    function intern_set({_intern, _key}, value) {
      const key = _key(value);
      if (_intern.has(key)) return _intern.get(key);
      _intern.set(key, value);
      return value;
    }

    function intern_delete({_intern, _key}, value) {
      const key = _key(value);
      if (_intern.has(key)) {
        value = _intern.get(key);
        _intern.delete(key);
      }
      return value;
    }

    function keyof(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function range(start, stop, step) {
      start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

      var i = -1,
          n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
          range = new Array(n);

      while (++i < n) {
        range[i] = start + i * step;
      }

      return range;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    const implicit = Symbol("implicit");

    function ordinal() {
      var index = new InternMap(),
          domain = [],
          range = [],
          unknown = implicit;

      function scale(d) {
        let i = index.get(d);
        if (i === undefined) {
          if (unknown !== implicit) return unknown;
          index.set(d, i = domain.push(d) - 1);
        }
        return range[i % range.length];
      }

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = new InternMap();
        for (const value of _) {
          if (index.has(value)) continue;
          index.set(value, domain.push(value) - 1);
        }
        return scale;
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), scale) : range.slice();
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return ordinal(domain, range).unknown(unknown);
      };

      initRange.apply(scale, arguments);

      return scale;
    }

    function band() {
      var scale = ordinal().unknown(undefined),
          domain = scale.domain,
          ordinalRange = scale.range,
          r0 = 0,
          r1 = 1,
          step,
          bandwidth,
          round = false,
          paddingInner = 0,
          paddingOuter = 0,
          align = 0.5;

      delete scale.unknown;

      function rescale() {
        var n = domain().length,
            reverse = r1 < r0,
            start = reverse ? r1 : r0,
            stop = reverse ? r0 : r1;
        step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
        if (round) step = Math.floor(step);
        start += (stop - start - step * (n - paddingInner)) * align;
        bandwidth = step * (1 - paddingInner);
        if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
        var values = range(n).map(function(i) { return start + step * i; });
        return ordinalRange(reverse ? values.reverse() : values);
      }

      scale.domain = function(_) {
        return arguments.length ? (domain(_), rescale()) : domain();
      };

      scale.range = function(_) {
        return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
      };

      scale.rangeRound = function(_) {
        return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
      };

      scale.bandwidth = function() {
        return bandwidth;
      };

      scale.step = function() {
        return step;
      };

      scale.round = function(_) {
        return arguments.length ? (round = !!_, rescale()) : round;
      };

      scale.padding = function(_) {
        return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
      };

      scale.paddingInner = function(_) {
        return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
      };

      scale.paddingOuter = function(_) {
        return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
      };

      scale.align = function(_) {
        return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
      };

      scale.copy = function() {
        return band(domain(), [r0, r1])
            .round(round)
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter)
            .align(align);
      };

      return initRange.apply(rescale(), arguments);
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$1(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisect(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$1,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$1) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$1, rescale()) : clamp !== identity$1;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$1, identity$1);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function transformSymlog(c) {
      return function(x) {
        return Math.sign(x) * Math.log1p(Math.abs(x / c));
      };
    }

    function transformSymexp(c) {
      return function(x) {
        return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
      };
    }

    function symlogish(transform) {
      var c = 1, scale = transform(transformSymlog(c), transformSymexp(c));

      scale.constant = function(_) {
        return arguments.length ? transform(transformSymlog(c = +_), transformSymexp(c)) : c;
      };

      return linearish(scale);
    }

    function symlog() {
      var scale = symlogish(transformer());

      scale.copy = function() {
        return copy(scale, symlog()).constant(scale.constant());
      };

      return initRange.apply(scale, arguments);
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity$5, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    function groupData(data, domain, key) {
      let groups = [];
      if (key) {
        domain.forEach(group => {
          groups.push(data.filter(d => d[key] == group));
        });
      } else {
        groups = [data];
      }
      return groups;
    }

    function stackData(data, domain, valKey, grpKey) {
      let groups = [];
      let base = JSON.parse(JSON.stringify(data.filter(d => d[grpKey] == domain[0])));
      base.forEach(d => d[valKey] = 0);
      domain.forEach(group => {
        let clone = JSON.parse(JSON.stringify(data.filter(d => d[grpKey] == group)));
        clone.forEach((d, i) => {
          d[valKey] += base[i][valKey];
          base[i][valKey] = d[valKey];
        });
        groups.push(clone);
      });
      return groups;
    }

    const seed = 1;
    const randomness1 = 5;
    const randomness2 = 2;

    class AccurateBeeswarm {
      constructor(items, radiusFun, xFun, padding, yOffset) {
        this.items = items;
        this.radiusFun = radiusFun;
        this.xFun = xFun;
        this.padding = padding;
        this.yOffset = yOffset;
        this.tieBreakFn = this._sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed);
        this.maxR = Math.max(...items.map(d => radiusFun(d)));
        this.rng = this._sfc32(1, 2, 3, seed);
      }

      calculateYPositions() {
        let all = this.items
          .map((d, i) => ({
            datum: d,
            originalIndex: i,
            x: this.xFun(d),
            r: this.radiusFun(d) + this.padding,
            y: null,
            placed: false
          }))
          .sort((a, b) => a.x - b.x);
        all.forEach(function(d, i) {
          d.index = i;
        });
        let tieBreakFn = this.tieBreakFn;
        all.forEach(function(d) {
          d.tieBreaker = tieBreakFn(d.x);
        });
        let allSortedByPriority = [...all].sort((a, b) => {
          let key_a = this.radiusFun(a.datum) + a.tieBreaker * randomness1;
          let key_b = this.radiusFun(b.datum) + b.tieBreaker * randomness1;
          if (key_a != key_b) return key_b - key_a;
          return a.x - b.x;
        });
        for (let item of allSortedByPriority) {
          item.placed = true;
          item.y = this._getBestYPosition(item, all);
        }
        all.sort((a, b) => a.originalIndex - b.originalIndex);
        return all.map(d => ({
          x: d.x,
          y: d.y + this.yOffset,
          r: this.radiusFun(d.datum)
        }));
      }

      // Random number generator (for reproducibility)
      // https://stackoverflow.com/a/47593316
      _sfc32(a, b, c, d) {
        let rng = function() {
          a >>>= 0;
          b >>>= 0;
          c >>>= 0;
          d >>>= 0;
          var t = (a + b) | 0;
          a = b ^ (b >>> 9);
          b = (c + (c << 3)) | 0;
          c = (c << 21) | (c >>> 11);
          d = (d + 1) | 0;
          t = (t + d) | 0;
          c = (c + t) | 0;
          return (t >>> 0) / 4294967296;
        };
        for (let i = 0; i < 10; i++) {
          rng();
        }
        return rng;
      }

      _getBestYPosition(item, all) {
        let forbiddenIntervals = [];
        for (let step of [-1, 1]) {
          let xDist;
          let r = item.r;
          for (
            let i = item.index + step;
            i >= 0 &&
            i < all.length &&
            (xDist = Math.abs(item.x - all[i].x)) < r + this.maxR;
            i += step
          ) {
            let other = all[i];
            if (!other.placed) continue;
            let sumOfRadii = r + other.r;
            if (xDist >= r + other.r) continue;
            let yDist = Math.sqrt(sumOfRadii * sumOfRadii - xDist * xDist);
            let forbiddenInterval = [other.y - yDist, other.y + yDist];
            forbiddenIntervals.push(forbiddenInterval);
          }
        }
        if (forbiddenIntervals.length == 0) {
          return item.r * (this.rng() - .5) * randomness2;
        }
        let candidatePositions = forbiddenIntervals.flat();
        candidatePositions.push(0);
        candidatePositions.sort((a, b) => {
          let abs_a = Math.abs(a);
          let abs_b = Math.abs(b);
          if (abs_a < abs_b) return -1;
          if (abs_a > abs_b) return 1;
          return a - b;
        });
        // find first candidate position that is not in any of the
        // forbidden intervals
        for (let i = 0; i < candidatePositions.length; i++) {
          let position = candidatePositions[i];
          if (
            forbiddenIntervals.every(
              interval => position <= interval[0] || position >= interval[1]
            )
          ) {
            return position;
          }
        }
      }
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/SetCoords.svelte generated by Svelte v3.43.1 */

    function create_fragment$t(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let $yScale;
    	let $xScale;
    	let $yRange;
    	let $xGet;
    	let $rRange;
    	let $rGet;
    	let $yGet;
    	let $width;
    	let $r;
    	let $y;
    	let $x;
    	let $custom;
    	let $data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SetCoords', slots, []);
    	const { data, x, y, r, xGet, yGet, rGet, xScale, yScale, yRange, rRange, custom, width } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(18, $data = value));
    	validate_store(x, 'x');
    	component_subscribe($$self, x, value => $$invalidate(16, $x = value));
    	validate_store(y, 'y');
    	component_subscribe($$self, y, value => $$invalidate(15, $y = value));
    	validate_store(r, 'r');
    	component_subscribe($$self, r, value => $$invalidate(14, $r = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(23, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(26, $yGet = value));
    	validate_store(rGet, 'rGet');
    	component_subscribe($$self, rGet, value => $$invalidate(25, $rGet = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(21, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(20, $yScale = value));
    	validate_store(yRange, 'yRange');
    	component_subscribe($$self, yRange, value => $$invalidate(22, $yRange = value));
    	validate_store(rRange, 'rRange');
    	component_subscribe($$self, rRange, value => $$invalidate(24, $rRange = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(17, $custom = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(13, $width = value));
    	let coords = $custom.coords;
    	let type = $custom.type;
    	let prevWidth = $width;

    	function setCoords(data, custom, x, y, r, width) {
    		let mode = custom.mode;
    		let padding = custom.padding;

    		let duration = custom.animation && width == prevWidth
    		? custom.duration
    		: 0;

    		prevWidth = width;
    		let newcoords;

    		if (type == 'bar') {
    			newcoords = data.map((d, i) => d.map((e, j) => {
    				return {
    					x: mode == 'default' || mode == 'grouped' || (mode == 'comparison' || mode == 'stacked') && i == 0
    					? 0
    					: mode == 'stacked' ? x(data[i - 1][j]) : x(e),
    					y: mode == 'grouped'
    					? $yGet(e) + i * (1 / data.length) * $yScale.bandwidth()
    					: $yGet(e),
    					w: mode == 'default' || mode == 'grouped' || (mode == 'comparison' || mode == 'stacked') && i == 0
    					? x(e)
    					: mode == 'stacked' ? x(e) - x(data[i - 1][j]) : 0,
    					h: mode == 'grouped'
    					? $yScale.bandwidth() / data.length
    					: $yScale.bandwidth()
    				};
    			}));
    		} else if (type == 'column') {
    			newcoords = data.map((d, i) => d.map((e, j) => {
    				return {
    					x: mode == 'grouped' && $xScale.bandwidth
    					? $xGet(e) + i * (1 / data.length) * $xScale.bandwidth()
    					: mode == 'grouped'
    						? $xGet(e)[0] + i * (1 / data.length) * Math.max(0, $xGet(e)[1] - $xGet(e)[0])
    						: $xScale.bandwidth ? $xGet(e) : $xGet(e)[0],
    					y: y(e),
    					w: mode == 'grouped' && $xScale.bandwidth
    					? $xScale.bandwidth() / data.length
    					: mode == 'grouped'
    						? Math.max(0, $xGet(e)[1] - $xGet(e)[0]) / data.length
    						: $xScale.bandwidth
    							? $xScale.bandwidth()
    							: Math.max(0, $xGet(e)[1] - $xGet(e)[0]),
    					h: mode == 'default' || mode == 'grouped' || (mode == 'comparison' || mode == 'stacked') && i == 0
    					? y(e)
    					: mode == 'stacked' ? y(e) - y(data[i - 1][j]) : 0
    				};
    			}));
    		} else if (type == 'scatter') {
    			let rVal = d => r ? $rGet(d) : $rRange[0];

    			newcoords = y
    			? data.map(d => ({ x: x(d), y: y(d), r: rVal(d) }))
    			: new AccurateBeeswarm(data, d => rVal(d), d => $xGet(d), padding, $yRange[0] / 2).calculateYPositions().map(d => ({
    					x: $xScale.invert(d.x),
    					y: $yScale.invert(d.y),
    					r: d.r
    				}));
    		} else if (type == 'line') {
    			newcoords = data.map(d => d.map(e => {
    				return { x: x(e), y: y(e) };
    			}));
    		}

    		coords.set(newcoords, { duration });
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SetCoords> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		AccurateBeeswarm,
    		data,
    		x,
    		y,
    		r,
    		xGet,
    		yGet,
    		rGet,
    		xScale,
    		yScale,
    		yRange,
    		rRange,
    		custom,
    		width,
    		coords,
    		type,
    		prevWidth,
    		setCoords,
    		$yScale,
    		$xScale,
    		$yRange,
    		$xGet,
    		$rRange,
    		$rGet,
    		$yGet,
    		$width,
    		$r,
    		$y,
    		$x,
    		$custom,
    		$data
    	});

    	$$self.$inject_state = $$props => {
    		if ('coords' in $$props) coords = $$props.coords;
    		if ('type' in $$props) type = $$props.type;
    		if ('prevWidth' in $$props) prevWidth = $$props.prevWidth;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$data, $custom, $x, $y, $r, $width*/ 516096) {
    			setCoords($data, $custom, $x, $y, $r, $width);
    		}
    	};

    	return [
    		data,
    		x,
    		y,
    		r,
    		xGet,
    		yGet,
    		rGet,
    		xScale,
    		yScale,
    		yRange,
    		rRange,
    		custom,
    		width,
    		$width,
    		$r,
    		$y,
    		$x,
    		$custom,
    		$data
    	];
    }

    class SetCoords extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SetCoords",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Line.svelte generated by Svelte v3.43.1 */
    const file$q = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Line.svelte";

    function get_each_context$g(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[35] = i;
    	return child_ctx;
    }

    function get_each_context_1$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[35] = i;
    	return child_ctx;
    }

    // (53:0) {#if $coords}
    function create_if_block$i(ctx) {
    	let g;
    	let each_1_anchor;
    	let each_value_1 = /*$coords*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$6(get_each_context_1$6(ctx, each_value_1, i));
    	}

    	let if_block = /*idKey*/ ctx[16] && (/*hover*/ ctx[3] || /*selected*/ ctx[1] || /*highlighted*/ ctx[4][0]) && create_if_block_1$c(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(g, "class", "line-group");
    			add_location(g, file$q, 53, 0, 1185);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, each_1_anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*makePath, $coords, $config, $zGet, $data, lineWidth, doHover, doSelect*/ 7340516) {
    				each_value_1 = /*$coords*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$6(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*idKey*/ ctx[16] && (/*hover*/ ctx[3] || /*selected*/ ctx[1] || /*highlighted*/ ctx[4][0])) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$c(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(53:0) {#if $coords}",
    		ctx
    	});

    	return block;
    }

    // (55:1) {#each $coords as group, i}
    function create_each_block_1$6(ctx) {
    	let path0;
    	let path0_d_value;
    	let path1;
    	let path1_d_value;
    	let path1_stroke_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[24](/*i*/ ctx[35], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[26](/*i*/ ctx[35], ...args);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[28](/*i*/ ctx[35], ...args);
    	}

    	const block = {
    		c: function create() {
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "class", "path-hover svelte-rh3b33");
    			attr_dev(path0, "d", path0_d_value = /*makePath*/ ctx[20](/*group*/ ctx[33]));
    			add_location(path0, file$q, 55, 2, 1239);
    			attr_dev(path1, "class", "path-line svelte-rh3b33");
    			attr_dev(path1, "d", path1_d_value = /*makePath*/ ctx[20](/*group*/ ctx[33]));

    			attr_dev(path1, "stroke", path1_stroke_value = /*$config*/ ctx[7].z
    			? /*$zGet*/ ctx[8](/*$data*/ ctx[6][/*i*/ ctx[35]][0])
    			: /*$config*/ ctx[7].zRange[0]);

    			attr_dev(path1, "stroke-width", /*lineWidth*/ ctx[2]);
    			add_location(path1, file$q, 64, 3, 1502);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path0, anchor);
    			insert_dev(target, path1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(path0, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(path0, "mouseleave", /*mouseleave_handler*/ ctx[25], false, false, false),
    					listen_dev(path0, "focus", focus_handler, false, false, false),
    					listen_dev(path0, "blur", /*blur_handler*/ ctx[27], false, false, false),
    					listen_dev(path0, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$coords*/ 32 && path0_d_value !== (path0_d_value = /*makePath*/ ctx[20](/*group*/ ctx[33]))) {
    				attr_dev(path0, "d", path0_d_value);
    			}

    			if (dirty[0] & /*$coords*/ 32 && path1_d_value !== (path1_d_value = /*makePath*/ ctx[20](/*group*/ ctx[33]))) {
    				attr_dev(path1, "d", path1_d_value);
    			}

    			if (dirty[0] & /*$config, $zGet, $data*/ 448 && path1_stroke_value !== (path1_stroke_value = /*$config*/ ctx[7].z
    			? /*$zGet*/ ctx[8](/*$data*/ ctx[6][/*i*/ ctx[35]][0])
    			: /*$config*/ ctx[7].zRange[0])) {
    				attr_dev(path1, "stroke", path1_stroke_value);
    			}

    			if (dirty[0] & /*lineWidth*/ 4) {
    				attr_dev(path1, "stroke-width", /*lineWidth*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path0);
    			if (detaching) detach_dev(path1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$6.name,
    		type: "each",
    		source: "(55:1) {#each $coords as group, i}",
    		ctx
    	});

    	return block;
    }

    // (76:1) {#if idKey && (hover || selected || highlighted[0])}
    function create_if_block_1$c(ctx) {
    	let each_1_anchor;
    	let each_value = /*$coords*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*makePath, $coords, $data, idKey, hovered, colorHover, selected, colorSelect, colorHighlight, lineWidth, highlighted*/ 2031735) {
    				each_value = /*$coords*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$g(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$g(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(76:1) {#if idKey && (hover || selected || highlighted[0])}",
    		ctx
    	});

    	return block;
    }

    // (78:2) {#if [hovered, selected, ...highlighted].includes($data[i][0][idKey]) }
    function create_if_block_2$9(ctx) {
    	let path;
    	let path_d_value;
    	let path_stroke_value;
    	let path_stroke_width_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "path-overlay svelte-rh3b33");
    			attr_dev(path, "d", path_d_value = /*makePath*/ ctx[20](/*group*/ ctx[33]));

    			attr_dev(path, "stroke", path_stroke_value = /*$data*/ ctx[6][/*i*/ ctx[35]][0][/*idKey*/ ctx[16]] == /*hovered*/ ctx[0]
    			? /*colorHover*/ ctx[17]
    			: /*$data*/ ctx[6][/*i*/ ctx[35]][0][/*idKey*/ ctx[16]] == /*selected*/ ctx[1]
    				? /*colorSelect*/ ctx[18]
    				: /*colorHighlight*/ ctx[19]);

    			attr_dev(path, "stroke-width", path_stroke_width_value = /*lineWidth*/ ctx[2] + 1.5);
    			add_location(path, file$q, 78, 3, 1840);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$coords*/ 32 && path_d_value !== (path_d_value = /*makePath*/ ctx[20](/*group*/ ctx[33]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty[0] & /*$data, hovered, selected*/ 67 && path_stroke_value !== (path_stroke_value = /*$data*/ ctx[6][/*i*/ ctx[35]][0][/*idKey*/ ctx[16]] == /*hovered*/ ctx[0]
    			? /*colorHover*/ ctx[17]
    			: /*$data*/ ctx[6][/*i*/ ctx[35]][0][/*idKey*/ ctx[16]] == /*selected*/ ctx[1]
    				? /*colorSelect*/ ctx[18]
    				: /*colorHighlight*/ ctx[19])) {
    				attr_dev(path, "stroke", path_stroke_value);
    			}

    			if (dirty[0] & /*lineWidth*/ 4 && path_stroke_width_value !== (path_stroke_width_value = /*lineWidth*/ ctx[2] + 1.5)) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$9.name,
    		type: "if",
    		source: "(78:2) {#if [hovered, selected, ...highlighted].includes($data[i][0][idKey]) }",
    		ctx
    	});

    	return block;
    }

    // (77:1) {#each $coords as group, i}
    function create_each_block$g(ctx) {
    	let show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1], .../*highlighted*/ ctx[4]].includes(/*$data*/ ctx[6][/*i*/ ctx[35]][0][/*idKey*/ ctx[16]]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_2$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hovered, selected, highlighted, $data*/ 83) show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1], .../*highlighted*/ ctx[4]].includes(/*$data*/ ctx[6][/*i*/ ctx[35]][0][/*idKey*/ ctx[16]]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$g.name,
    		type: "each",
    		source: "(77:1) {#each $coords as group, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let if_block_anchor;
    	let if_block = /*$coords*/ ctx[5] && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*$coords*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $yScale;
    	let $xScale;
    	let $custom;
    	let $coords;
    	let $data;
    	let $config;
    	let $zGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Line', slots, []);
    	const { data, xScale, yScale, zGet, config, custom } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(6, $data = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(30, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(29, $yScale = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(8, $zGet = value));
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(7, $config = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(31, $custom = value));
    	const dispatch = createEventDispatcher();
    	let { lineWidth = 2.5 } = $$props;
    	let { hover = false } = $$props;
    	let { hovered = null } = $$props;
    	let { select = false } = $$props;
    	let { selected = null } = $$props;
    	let { highlighted = [] } = $$props;
    	let coords = $custom.coords;
    	validate_store(coords, 'coords');
    	component_subscribe($$self, coords, value => $$invalidate(5, $coords = value));
    	let idKey = $custom.idKey;
    	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
    	let colorSelect = $custom.colorSelect ? $custom.colorSelect : '#206095';

    	let colorHighlight = $custom.colorHighlight
    	? $custom.colorHighlight
    	: '#206095';

    	// Function to make SVG path
    	const makePath = group => {
    		let path = 'M' + group.map(d => {
    			return $xScale(d.x) + ',' + $yScale(d.y);
    		}).join('L');

    		return path;
    	};

    	function doHover(e, d) {
    		if (hover) {
    			$$invalidate(0, hovered = d ? d[0][idKey] : null);
    			dispatch('hover', { id: hovered, data: d, event: e });
    		}
    	}

    	function doSelect(e, d) {
    		if (select) {
    			$$invalidate(1, selected = d ? d[0][idKey] : null);
    			dispatch('select', { id: selected, data: d, event: e });
    		}
    	}

    	const writable_props = ['lineWidth', 'hover', 'hovered', 'select', 'selected', 'highlighted'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Line> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (i, e) => doHover(e, $data[i]);
    	const mouseleave_handler = e => doHover(e, null);
    	const focus_handler = (i, e) => doHover(e, $data[i]);
    	const blur_handler = e => doHover(e, null);
    	const click_handler = (i, e) => doSelect(e, $data[i]);

    	$$self.$$set = $$props => {
    		if ('lineWidth' in $$props) $$invalidate(2, lineWidth = $$props.lineWidth);
    		if ('hover' in $$props) $$invalidate(3, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('select' in $$props) $$invalidate(23, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(4, highlighted = $$props.highlighted);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		data,
    		xScale,
    		yScale,
    		zGet,
    		config,
    		custom,
    		dispatch,
    		lineWidth,
    		hover,
    		hovered,
    		select,
    		selected,
    		highlighted,
    		coords,
    		idKey,
    		colorHover,
    		colorSelect,
    		colorHighlight,
    		makePath,
    		doHover,
    		doSelect,
    		$yScale,
    		$xScale,
    		$custom,
    		$coords,
    		$data,
    		$config,
    		$zGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('lineWidth' in $$props) $$invalidate(2, lineWidth = $$props.lineWidth);
    		if ('hover' in $$props) $$invalidate(3, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('select' in $$props) $$invalidate(23, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(4, highlighted = $$props.highlighted);
    		if ('coords' in $$props) $$invalidate(15, coords = $$props.coords);
    		if ('idKey' in $$props) $$invalidate(16, idKey = $$props.idKey);
    		if ('colorHover' in $$props) $$invalidate(17, colorHover = $$props.colorHover);
    		if ('colorSelect' in $$props) $$invalidate(18, colorSelect = $$props.colorSelect);
    		if ('colorHighlight' in $$props) $$invalidate(19, colorHighlight = $$props.colorHighlight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hovered,
    		selected,
    		lineWidth,
    		hover,
    		highlighted,
    		$coords,
    		$data,
    		$config,
    		$zGet,
    		data,
    		xScale,
    		yScale,
    		zGet,
    		config,
    		custom,
    		coords,
    		idKey,
    		colorHover,
    		colorSelect,
    		colorHighlight,
    		makePath,
    		doHover,
    		doSelect,
    		select,
    		mouseover_handler,
    		mouseleave_handler,
    		focus_handler,
    		blur_handler,
    		click_handler
    	];
    }

    class Line extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$s,
    			create_fragment$s,
    			safe_not_equal,
    			{
    				lineWidth: 2,
    				hover: 3,
    				hovered: 0,
    				select: 23,
    				selected: 1,
    				highlighted: 4
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Line",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get lineWidth() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineWidth(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hovered() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hovered(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Area.svelte generated by Svelte v3.43.1 */
    const file$p = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Area.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (36:0) {#if $coords}
    function create_if_block$h(ctx) {
    	let g;
    	let each_value = /*$coords*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "area-group");
    			add_location(g, file$p, 36, 0, 780);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*makeArea, $coords, $config, $zGet, $data, $zRange, opacity*/ 16447) {
    				each_value = /*$coords*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(36:0) {#if $coords}",
    		ctx
    	});

    	return block;
    }

    // (38:1) {#each $coords as group, i}
    function create_each_block$f(ctx) {
    	let path;
    	let path_d_value;
    	let path_fill_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "path-area");
    			attr_dev(path, "d", path_d_value = /*makeArea*/ ctx[14](/*group*/ ctx[19], /*i*/ ctx[21]));

    			attr_dev(path, "fill", path_fill_value = /*$config*/ ctx[2].z
    			? /*$zGet*/ ctx[3](/*$data*/ ctx[4][/*i*/ ctx[21]][0])
    			: /*$zRange*/ ctx[5][0]);

    			attr_dev(path, "opacity", /*opacity*/ ctx[0]);
    			add_location(path, file$p, 38, 1, 833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$coords*/ 2 && path_d_value !== (path_d_value = /*makeArea*/ ctx[14](/*group*/ ctx[19], /*i*/ ctx[21]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty & /*$config, $zGet, $data, $zRange*/ 60 && path_fill_value !== (path_fill_value = /*$config*/ ctx[2].z
    			? /*$zGet*/ ctx[3](/*$data*/ ctx[4][/*i*/ ctx[21]][0])
    			: /*$zRange*/ ctx[5][0])) {
    				attr_dev(path, "fill", path_fill_value);
    			}

    			if (dirty & /*opacity*/ 1) {
    				attr_dev(path, "opacity", /*opacity*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(38:1) {#each $coords as group, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let if_block_anchor;
    	let if_block = /*$coords*/ ctx[1] && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$coords*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $yScale;
    	let $xScale;
    	let $coords;
    	let $custom;
    	let $config;
    	let $zGet;
    	let $data;
    	let $zRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Area', slots, []);
    	const { data, xScale, yScale, zGet, zRange, config, custom } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(4, $data = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(16, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(15, $yScale = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(3, $zGet = value));
    	validate_store(zRange, 'zRange');
    	component_subscribe($$self, zRange, value => $$invalidate(5, $zRange = value));
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(2, $config = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(17, $custom = value));
    	let { opacity = 1 } = $$props;
    	let coords = $custom.coords;
    	validate_store(coords, 'coords');
    	component_subscribe($$self, coords, value => $$invalidate(1, $coords = value));
    	let idKey = $custom.idKey;

    	// Function to make SVG path
    	const makeArea = (group, i) => {
    		let yRange = $yScale.range();

    		let path1 = 'M' + group.map(d => {
    			return $xScale(d.x) + ',' + $yScale(d.y);
    		}).join('L');

    		let path2 = i == 0
    		? 'L' + group.map(d => {
    				return $xScale(d.x) + ',' + yRange[0];
    			}).reverse().join('L')
    		: 'L' + [...$coords[i - 1]].reverse().map(d => {
    				return $xScale(d.x) + ',' + $yScale(d.y);
    			}).join('L');

    		let area = path1 + path2 + 'Z';
    		return area;
    	};

    	const writable_props = ['opacity'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Area> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('opacity' in $$props) $$invalidate(0, opacity = $$props.opacity);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		data,
    		xScale,
    		yScale,
    		zGet,
    		zRange,
    		config,
    		custom,
    		opacity,
    		coords,
    		idKey,
    		makeArea,
    		$yScale,
    		$xScale,
    		$coords,
    		$custom,
    		$config,
    		$zGet,
    		$data,
    		$zRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('opacity' in $$props) $$invalidate(0, opacity = $$props.opacity);
    		if ('coords' in $$props) $$invalidate(13, coords = $$props.coords);
    		if ('idKey' in $$props) idKey = $$props.idKey;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		opacity,
    		$coords,
    		$config,
    		$zGet,
    		$data,
    		$zRange,
    		data,
    		xScale,
    		yScale,
    		zGet,
    		zRange,
    		config,
    		custom,
    		coords,
    		makeArea
    	];
    }

    class Area extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { opacity: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Area",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get opacity() {
    		throw new Error("<Area>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Area>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/AxisX.svelte generated by Svelte v3.43.1 */
    const file$o = "node_modules/@onsvisual/svelte-charts/src/charts/shared/AxisX.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	child_ctx[26] = i;
    	return child_ctx;
    }

    // (46:3) {#if gridlines !== false}
    function create_if_block_1$b(ctx) {
    	let line;
    	let line_y__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "gridline svelte-r9f2bw");
    			attr_dev(line, "y1", line_y__value = /*$height*/ ctx[17] * -1);
    			attr_dev(line, "y2", "0");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", "0");
    			set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			toggle_class(line, "dashed", /*tickDashed*/ ctx[1]);
    			add_location(line, file$o, 46, 4, 1135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 131072 && line_y__value !== (line_y__value = /*$height*/ ctx[17] * -1)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*tickColor*/ 8) {
    				set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			}

    			if (dirty & /*tickDashed*/ 2) {
    				toggle_class(line, "dashed", /*tickDashed*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(46:3) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (49:3) {#if tickMarks === true}
    function create_if_block$g(ctx) {
    	let line;
    	let line_x__value;
    	let line_x__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "tick-mark svelte-r9f2bw");
    			attr_dev(line, "y1", 0);
    			attr_dev(line, "y2", 6);

    			attr_dev(line, "x1", line_x__value = /*xTick*/ ctx[7] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0);

    			attr_dev(line, "x2", line_x__value_1 = /*xTick*/ ctx[7] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0);

    			set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			add_location(line, file$o, 49, 4, 1302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*xTick, isBandwidth, $xScale*/ 24704 && line_x__value !== (line_x__value = /*xTick*/ ctx[7] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*xTick, isBandwidth, $xScale*/ 24704 && line_x__value_1 !== (line_x__value_1 = /*xTick*/ ctx[7] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*tickColor*/ 8) {
    				set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(49:3) {#if tickMarks === true}",
    		ctx
    	});

    	return block;
    }

    // (44:1) {#each tickVals as tick, i}
    function create_each_block$e(ctx) {
    	let g;
    	let if_block0_anchor;
    	let text_1;

    	let t_value = (/*i*/ ctx[26] == /*tickVals*/ ctx[15].length - 1
    	? /*prefix*/ ctx[11] + /*formatTick*/ ctx[5](/*tick*/ ctx[24]) + /*suffix*/ ctx[12]
    	: /*formatTick*/ ctx[5](/*tick*/ ctx[24])) + "";

    	let t;
    	let text_1_x_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[0] !== false && create_if_block_1$b(ctx);
    	let if_block1 = /*tickMarks*/ ctx[2] === true && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			text_1 = svg_element("text");
    			t = text(t_value);

    			attr_dev(text_1, "x", text_1_x_value = /*xTick*/ ctx[7] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0);

    			attr_dev(text_1, "y", /*yTick*/ ctx[8]);
    			attr_dev(text_1, "dx", /*dxTick*/ ctx[9]);
    			attr_dev(text_1, "dy", /*dyTick*/ ctx[10]);
    			attr_dev(text_1, "text-anchor", /*textAnchor*/ ctx[21](/*i*/ ctx[26]));
    			set_style(text_1, "fill", /*textColor*/ ctx[4]);
    			attr_dev(text_1, "class", "svelte-r9f2bw");
    			add_location(text_1, file$o, 51, 3, 1508);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[24] + " svelte-r9f2bw");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$xScale*/ ctx[14](/*tick*/ ctx[24]) + "," + /*$yRange*/ ctx[16][0] + ")");
    			add_location(g, file$o, 44, 2, 1021);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[0] !== false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$b(ctx);
    					if_block0.c();
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*tickMarks*/ ctx[2] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$g(ctx);
    					if_block1.c();
    					if_block1.m(g, text_1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*tickVals, prefix, formatTick, suffix*/ 38944 && t_value !== (t_value = (/*i*/ ctx[26] == /*tickVals*/ ctx[15].length - 1
    			? /*prefix*/ ctx[11] + /*formatTick*/ ctx[5](/*tick*/ ctx[24]) + /*suffix*/ ctx[12]
    			: /*formatTick*/ ctx[5](/*tick*/ ctx[24])) + "")) set_data_dev(t, t_value);

    			if (dirty & /*xTick, isBandwidth, $xScale*/ 24704 && text_1_x_value !== (text_1_x_value = /*xTick*/ ctx[7] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*yTick*/ 256) {
    				attr_dev(text_1, "y", /*yTick*/ ctx[8]);
    			}

    			if (dirty & /*dxTick*/ 512) {
    				attr_dev(text_1, "dx", /*dxTick*/ ctx[9]);
    			}

    			if (dirty & /*dyTick*/ 1024) {
    				attr_dev(text_1, "dy", /*dyTick*/ ctx[10]);
    			}

    			if (dirty & /*textColor*/ 16) {
    				set_style(text_1, "fill", /*textColor*/ ctx[4]);
    			}

    			if (dirty & /*tickVals*/ 32768 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[24] + " svelte-r9f2bw")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xScale, tickVals, $yRange*/ 114688 && g_transform_value !== (g_transform_value = "translate(" + /*$xScale*/ ctx[14](/*tick*/ ctx[24]) + "," + /*$yRange*/ ctx[16][0] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(44:1) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let g;
    	let each_value = /*tickVals*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "axis x-axis svelte-r9f2bw");
    			toggle_class(g, "snapTicks", /*snapTicks*/ ctx[6]);
    			add_location(g, file$o, 42, 0, 950);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xScale, $yRange, xTick, isBandwidth, yTick, dxTick, dyTick, textAnchor, textColor, prefix, formatTick, suffix, tickColor, tickMarks, $height, tickDashed, gridlines*/ 2359231) {
    				each_value = /*tickVals*/ ctx[15];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*snapTicks*/ 64) {
    				toggle_class(g, "snapTicks", /*snapTicks*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $xScale;
    	let $yRange;
    	let $height;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisX', slots, []);
    	const { width, height, xScale, yRange } = getContext('LayerCake');
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(17, $height = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(14, $xScale = value));
    	validate_store(yRange, 'yRange');
    	component_subscribe($$self, yRange, value => $$invalidate(16, $yRange = value));
    	let { gridlines = true } = $$props;
    	let { tickDashed = false } = $$props;
    	let { tickMarks = false } = $$props;
    	let { tickColor = '#bbb' } = $$props;
    	let { textColor = '#666' } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { snapTicks = false } = $$props;
    	let { ticks = undefined } = $$props;
    	let { xTick = undefined } = $$props;
    	let { yTick = 16 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = 0 } = $$props;
    	let { prefix = '' } = $$props;
    	let { suffix = '' } = $$props;

    	function textAnchor(i) {
    		if (snapTicks === true) {
    			if (i === 0) {
    				return 'start';
    			}

    			if (i === tickVals.length - 1) {
    				return 'end';
    			}
    		}

    		return 'middle';
    	}

    	const writable_props = [
    		'gridlines',
    		'tickDashed',
    		'tickMarks',
    		'tickColor',
    		'textColor',
    		'formatTick',
    		'snapTicks',
    		'ticks',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick',
    		'prefix',
    		'suffix'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisX> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('tickDashed' in $$props) $$invalidate(1, tickDashed = $$props.tickDashed);
    		if ('tickMarks' in $$props) $$invalidate(2, tickMarks = $$props.tickMarks);
    		if ('tickColor' in $$props) $$invalidate(3, tickColor = $$props.tickColor);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('formatTick' in $$props) $$invalidate(5, formatTick = $$props.formatTick);
    		if ('snapTicks' in $$props) $$invalidate(6, snapTicks = $$props.snapTicks);
    		if ('ticks' in $$props) $$invalidate(22, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(7, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(8, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(9, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(10, dyTick = $$props.dyTick);
    		if ('prefix' in $$props) $$invalidate(11, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(12, suffix = $$props.suffix);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		width,
    		height,
    		xScale,
    		yRange,
    		gridlines,
    		tickDashed,
    		tickMarks,
    		tickColor,
    		textColor,
    		formatTick,
    		snapTicks,
    		ticks,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		prefix,
    		suffix,
    		textAnchor,
    		tickVals,
    		isBandwidth,
    		$xScale,
    		$yRange,
    		$height
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('tickDashed' in $$props) $$invalidate(1, tickDashed = $$props.tickDashed);
    		if ('tickMarks' in $$props) $$invalidate(2, tickMarks = $$props.tickMarks);
    		if ('tickColor' in $$props) $$invalidate(3, tickColor = $$props.tickColor);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('formatTick' in $$props) $$invalidate(5, formatTick = $$props.formatTick);
    		if ('snapTicks' in $$props) $$invalidate(6, snapTicks = $$props.snapTicks);
    		if ('ticks' in $$props) $$invalidate(22, ticks = $$props.ticks);
    		if ('xTick' in $$props) $$invalidate(7, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(8, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(9, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(10, dyTick = $$props.dyTick);
    		if ('prefix' in $$props) $$invalidate(11, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(12, suffix = $$props.suffix);
    		if ('tickVals' in $$props) $$invalidate(15, tickVals = $$props.tickVals);
    		if ('isBandwidth' in $$props) $$invalidate(13, isBandwidth = $$props.isBandwidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xScale*/ 16384) {
    			$$invalidate(13, isBandwidth = typeof $xScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $xScale*/ 4218880) {
    			$$invalidate(15, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth
    				? $xScale.domain()
    				: typeof ticks === 'function'
    					? ticks($xScale.ticks())
    					: $xScale.ticks(ticks));
    		}
    	};

    	return [
    		gridlines,
    		tickDashed,
    		tickMarks,
    		tickColor,
    		textColor,
    		formatTick,
    		snapTicks,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		prefix,
    		suffix,
    		isBandwidth,
    		$xScale,
    		tickVals,
    		$yRange,
    		$height,
    		height,
    		xScale,
    		yRange,
    		textAnchor,
    		ticks
    	];
    }

    class AxisX$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			gridlines: 0,
    			tickDashed: 1,
    			tickMarks: 2,
    			tickColor: 3,
    			textColor: 4,
    			formatTick: 5,
    			snapTicks: 6,
    			ticks: 22,
    			xTick: 7,
    			yTick: 8,
    			dxTick: 9,
    			dyTick: 10,
    			prefix: 11,
    			suffix: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisX",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get gridlines() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickDashed() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickDashed(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickMarks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickMarks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickColor() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickColor(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snapTicks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snapTicks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/AxisY.svelte generated by Svelte v3.43.1 */
    const file$n = "node_modules/@onsvisual/svelte-charts/src/charts/shared/AxisY.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (34:3) {#if gridlines !== false}
    function create_if_block_1$a(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "gridline svelte-f7wn4m");
    			attr_dev(line, "x2", "100%");

    			attr_dev(line, "y1", line_y__value = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0));

    			attr_dev(line, "y2", line_y__value_1 = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0));

    			set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			toggle_class(line, "dashed", /*tickDashed*/ ctx[2]);
    			add_location(line, file$n, 34, 4, 997);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTick, isBandwidth, $yScale*/ 24704 && line_y__value !== (line_y__value = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 24704 && line_y__value_1 !== (line_y__value_1 = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*tickColor*/ 8) {
    				set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			}

    			if (dirty & /*tickDashed*/ 4) {
    				toggle_class(line, "dashed", /*tickDashed*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(34:3) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (44:3) {#if tickMarks === true}
    function create_if_block$f(ctx) {
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "tick-mark svelte-f7wn4m");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", line_x__value = /*isBandwidth*/ ctx[13] ? -6 : 6);

    			attr_dev(line, "y1", line_y__value = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0));

    			attr_dev(line, "y2", line_y__value_1 = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0));

    			set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			add_location(line, file$n, 44, 4, 1286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isBandwidth*/ 8192 && line_x__value !== (line_x__value = /*isBandwidth*/ ctx[13] ? -6 : 6)) {
    				attr_dev(line, "x2", line_x__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 24704 && line_y__value !== (line_y__value = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 24704 && line_y__value_1 !== (line_y__value_1 = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*tickColor*/ 8) {
    				set_style(line, "stroke", /*tickColor*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(44:3) {#if tickMarks === true}",
    		ctx
    	});

    	return block;
    }

    // (32:1) {#each tickVals as tick, i}
    function create_each_block$d(ctx) {
    	let g;
    	let if_block0_anchor;
    	let text_1;

    	let t_value = (/*i*/ ctx[24] == /*tickVals*/ ctx[15].length - 1
    	? /*prefix*/ ctx[11] + /*formatTick*/ ctx[5](/*tick*/ ctx[22]) + /*suffix*/ ctx[12]
    	: /*formatTick*/ ctx[5](/*tick*/ ctx[22])) + "";

    	let t;
    	let text_1_y_value;
    	let text_1_dx_value;
    	let text_1_dy_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[1] !== false && create_if_block_1$a(ctx);
    	let if_block1 = /*tickMarks*/ ctx[0] === true && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "x", /*xTick*/ ctx[6]);

    			attr_dev(text_1, "y", text_1_y_value = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0));

    			attr_dev(text_1, "dx", text_1_dx_value = /*isBandwidth*/ ctx[13] ? -4 : /*dxTick*/ ctx[8]);
    			attr_dev(text_1, "dy", text_1_dy_value = /*isBandwidth*/ ctx[13] ? 4 : /*dyTick*/ ctx[9]);
    			set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[13] ? 'end' : /*textAnchor*/ ctx[10]);
    			set_style(text_1, "fill", /*textColor*/ ctx[4]);
    			add_location(text_1, file$n, 53, 3, 1546);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[22] + " svelte-f7wn4m");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*$xRange*/ ctx[17][0] + (/*isBandwidth*/ ctx[13] ? /*$padding*/ ctx[16].left : 0)) + ", " + /*$yScale*/ ctx[14](/*tick*/ ctx[22]) + ")");
    			add_location(g, file$n, 32, 2, 846);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[1] !== false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$a(ctx);
    					if_block0.c();
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*tickMarks*/ ctx[0] === true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					if_block1.m(g, text_1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*tickVals, prefix, formatTick, suffix*/ 38944 && t_value !== (t_value = (/*i*/ ctx[24] == /*tickVals*/ ctx[15].length - 1
    			? /*prefix*/ ctx[11] + /*formatTick*/ ctx[5](/*tick*/ ctx[22]) + /*suffix*/ ctx[12]
    			: /*formatTick*/ ctx[5](/*tick*/ ctx[22])) + "")) set_data_dev(t, t_value);

    			if (dirty & /*xTick*/ 64) {
    				attr_dev(text_1, "x", /*xTick*/ ctx[6]);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 24704 && text_1_y_value !== (text_1_y_value = /*yTick*/ ctx[7] + (/*isBandwidth*/ ctx[13]
    			? /*$yScale*/ ctx[14].bandwidth() / 2
    			: 0))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*isBandwidth, dxTick*/ 8448 && text_1_dx_value !== (text_1_dx_value = /*isBandwidth*/ ctx[13] ? -4 : /*dxTick*/ ctx[8])) {
    				attr_dev(text_1, "dx", text_1_dx_value);
    			}

    			if (dirty & /*isBandwidth, dyTick*/ 8704 && text_1_dy_value !== (text_1_dy_value = /*isBandwidth*/ ctx[13] ? 4 : /*dyTick*/ ctx[9])) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty & /*isBandwidth, textAnchor*/ 9216) {
    				set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[13] ? 'end' : /*textAnchor*/ ctx[10]);
    			}

    			if (dirty & /*textColor*/ 16) {
    				set_style(text_1, "fill", /*textColor*/ ctx[4]);
    			}

    			if (dirty & /*tickVals*/ 32768 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[22] + " svelte-f7wn4m")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xRange, isBandwidth, $padding, $yScale, tickVals*/ 253952 && g_transform_value !== (g_transform_value = "translate(" + (/*$xRange*/ ctx[17][0] + (/*isBandwidth*/ ctx[13] ? /*$padding*/ ctx[16].left : 0)) + ", " + /*$yScale*/ ctx[14](/*tick*/ ctx[22]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(32:1) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let g;
    	let g_transform_value;
    	let each_value = /*tickVals*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "axis y-axis");
    			attr_dev(g, "transform", g_transform_value = "translate(" + -/*$padding*/ ctx[16].left + ", 0)");
    			add_location(g, file$n, 30, 0, 748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xRange, isBandwidth, $padding, $yScale, xTick, yTick, dxTick, dyTick, textAnchor, textColor, prefix, formatTick, suffix, tickColor, tickMarks, tickDashed, gridlines*/ 262143) {
    				each_value = /*tickVals*/ ctx[15];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$padding*/ 65536 && g_transform_value !== (g_transform_value = "translate(" + -/*$padding*/ ctx[16].left + ", 0)")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $yScale;
    	let $padding;
    	let $xRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisY', slots, []);
    	const { padding, xRange, yScale } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(16, $padding = value));
    	validate_store(xRange, 'xRange');
    	component_subscribe($$self, xRange, value => $$invalidate(17, $xRange = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(14, $yScale = value));
    	let { ticks = 4 } = $$props;
    	let { tickMarks = false } = $$props;
    	let { gridlines = true } = $$props;
    	let { tickDashed = false } = $$props;
    	let { tickColor = '#bbb' } = $$props;
    	let { textColor = '#666' } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { xTick = 0 } = $$props;
    	let { yTick = 0 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = -4 } = $$props;
    	let { textAnchor = 'start' } = $$props;
    	let { prefix = '' } = $$props;
    	let { suffix = '' } = $$props;

    	const writable_props = [
    		'ticks',
    		'tickMarks',
    		'gridlines',
    		'tickDashed',
    		'tickColor',
    		'textColor',
    		'formatTick',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick',
    		'textAnchor',
    		'prefix',
    		'suffix'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisY> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ticks' in $$props) $$invalidate(21, ticks = $$props.ticks);
    		if ('tickMarks' in $$props) $$invalidate(0, tickMarks = $$props.tickMarks);
    		if ('gridlines' in $$props) $$invalidate(1, gridlines = $$props.gridlines);
    		if ('tickDashed' in $$props) $$invalidate(2, tickDashed = $$props.tickDashed);
    		if ('tickColor' in $$props) $$invalidate(3, tickColor = $$props.tickColor);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('formatTick' in $$props) $$invalidate(5, formatTick = $$props.formatTick);
    		if ('xTick' in $$props) $$invalidate(6, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(7, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(8, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(9, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(10, textAnchor = $$props.textAnchor);
    		if ('prefix' in $$props) $$invalidate(11, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(12, suffix = $$props.suffix);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		padding,
    		xRange,
    		yScale,
    		ticks,
    		tickMarks,
    		gridlines,
    		tickDashed,
    		tickColor,
    		textColor,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		prefix,
    		suffix,
    		isBandwidth,
    		tickVals,
    		$yScale,
    		$padding,
    		$xRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('ticks' in $$props) $$invalidate(21, ticks = $$props.ticks);
    		if ('tickMarks' in $$props) $$invalidate(0, tickMarks = $$props.tickMarks);
    		if ('gridlines' in $$props) $$invalidate(1, gridlines = $$props.gridlines);
    		if ('tickDashed' in $$props) $$invalidate(2, tickDashed = $$props.tickDashed);
    		if ('tickColor' in $$props) $$invalidate(3, tickColor = $$props.tickColor);
    		if ('textColor' in $$props) $$invalidate(4, textColor = $$props.textColor);
    		if ('formatTick' in $$props) $$invalidate(5, formatTick = $$props.formatTick);
    		if ('xTick' in $$props) $$invalidate(6, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(7, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(8, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(9, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(10, textAnchor = $$props.textAnchor);
    		if ('prefix' in $$props) $$invalidate(11, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(12, suffix = $$props.suffix);
    		if ('isBandwidth' in $$props) $$invalidate(13, isBandwidth = $$props.isBandwidth);
    		if ('tickVals' in $$props) $$invalidate(15, tickVals = $$props.tickVals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$yScale*/ 16384) {
    			$$invalidate(13, isBandwidth = typeof $yScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $yScale*/ 2121728) {
    			$$invalidate(15, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth
    				? $yScale.domain()
    				: typeof ticks === 'function'
    					? ticks($yScale.ticks())
    					: $yScale.ticks(ticks));
    		}
    	};

    	return [
    		tickMarks,
    		gridlines,
    		tickDashed,
    		tickColor,
    		textColor,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		prefix,
    		suffix,
    		isBandwidth,
    		$yScale,
    		tickVals,
    		$padding,
    		$xRange,
    		padding,
    		xRange,
    		yScale,
    		ticks
    	];
    }

    class AxisY$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {
    			ticks: 21,
    			tickMarks: 0,
    			gridlines: 1,
    			tickDashed: 2,
    			tickColor: 3,
    			textColor: 4,
    			formatTick: 5,
    			xTick: 6,
    			yTick: 7,
    			dxTick: 8,
    			dyTick: 9,
    			textAnchor: 10,
    			prefix: 11,
    			suffix: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisY",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get ticks() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickMarks() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickMarks(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridlines() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickDashed() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickDashed(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickColor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickColor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textAnchor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textAnchor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Legend.svelte generated by Svelte v3.43.1 */

    const file$m = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Legend.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (12:0) {#if Array.isArray(domain) && Array.isArray(colors)}
    function create_if_block$e(ctx) {
    	let ul;
    	let each_value = /*domain*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "legend svelte-1w19nmy");
    			add_location(ul, file$m, 12, 2, 483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*domain, colors, horizontal, line, comparison, markerWidth, markerLength, round*/ 255) {
    				each_value = /*domain*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(12:0) {#if Array.isArray(domain) && Array.isArray(colors)}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#each domain as label, i}
    function create_each_block$c(ctx) {
    	let li;
    	let div;
    	let t0;
    	let t1_value = /*label*/ ctx[8] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "bullet svelte-1w19nmy");
    			set_style(div, "background-color", /*colors*/ ctx[1][/*i*/ ctx[10]]);

    			set_style(div, "width", (!/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    			? /*markerWidth*/ ctx[5]
    			: /*markerLength*/ ctx[6]) + "px");

    			set_style(div, "height", (/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    			? /*markerWidth*/ ctx[5]
    			: /*markerLength*/ ctx[6]) + "px");

    			toggle_class(div, "round", /*round*/ ctx[7]);
    			add_location(div, file$m, 15, 8, 553);
    			attr_dev(li, "class", "svelte-1w19nmy");
    			add_location(li, file$m, 14, 6, 540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors*/ 2) {
    				set_style(div, "background-color", /*colors*/ ctx[1][/*i*/ ctx[10]]);
    			}

    			if (dirty & /*horizontal, line, comparison, markerWidth, markerLength*/ 124) {
    				set_style(div, "width", (!/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    				? /*markerWidth*/ ctx[5]
    				: /*markerLength*/ ctx[6]) + "px");
    			}

    			if (dirty & /*horizontal, line, comparison, markerWidth, markerLength*/ 124) {
    				set_style(div, "height", (/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    				? /*markerWidth*/ ctx[5]
    				: /*markerLength*/ ctx[6]) + "px");
    			}

    			if (dirty & /*round*/ 128) {
    				toggle_class(div, "round", /*round*/ ctx[7]);
    			}

    			if (dirty & /*domain*/ 1 && t1_value !== (t1_value = /*label*/ ctx[8] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(14:4) {#each domain as label, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let show_if = Array.isArray(/*domain*/ ctx[0]) && Array.isArray(/*colors*/ ctx[1]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*domain, colors*/ 3) show_if = Array.isArray(/*domain*/ ctx[0]) && Array.isArray(/*colors*/ ctx[1]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Legend', slots, []);
    	let { domain = null } = $$props;
    	let { colors = null } = $$props;
    	let { line = false } = $$props;
    	let { comparison = false } = $$props;
    	let { horizontal = true } = $$props;
    	let { markerWidth = 2.5 } = $$props;
    	let { markerLength = 13 } = $$props;
    	let { round = false } = $$props;

    	const writable_props = [
    		'domain',
    		'colors',
    		'line',
    		'comparison',
    		'horizontal',
    		'markerWidth',
    		'markerLength',
    		'round'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Legend> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('domain' in $$props) $$invalidate(0, domain = $$props.domain);
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    		if ('line' in $$props) $$invalidate(2, line = $$props.line);
    		if ('comparison' in $$props) $$invalidate(3, comparison = $$props.comparison);
    		if ('horizontal' in $$props) $$invalidate(4, horizontal = $$props.horizontal);
    		if ('markerWidth' in $$props) $$invalidate(5, markerWidth = $$props.markerWidth);
    		if ('markerLength' in $$props) $$invalidate(6, markerLength = $$props.markerLength);
    		if ('round' in $$props) $$invalidate(7, round = $$props.round);
    	};

    	$$self.$capture_state = () => ({
    		domain,
    		colors,
    		line,
    		comparison,
    		horizontal,
    		markerWidth,
    		markerLength,
    		round
    	});

    	$$self.$inject_state = $$props => {
    		if ('domain' in $$props) $$invalidate(0, domain = $$props.domain);
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    		if ('line' in $$props) $$invalidate(2, line = $$props.line);
    		if ('comparison' in $$props) $$invalidate(3, comparison = $$props.comparison);
    		if ('horizontal' in $$props) $$invalidate(4, horizontal = $$props.horizontal);
    		if ('markerWidth' in $$props) $$invalidate(5, markerWidth = $$props.markerWidth);
    		if ('markerLength' in $$props) $$invalidate(6, markerLength = $$props.markerLength);
    		if ('round' in $$props) $$invalidate(7, round = $$props.round);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [domain, colors, line, comparison, horizontal, markerWidth, markerLength, round];
    }

    class Legend$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			domain: 0,
    			colors: 1,
    			line: 2,
    			comparison: 3,
    			horizontal: 4,
    			markerWidth: 5,
    			markerLength: 6,
    			round: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legend",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get domain() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set domain(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get line() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set line(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get comparison() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set comparison(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get markerWidth() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set markerWidth(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get markerLength() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set markerLength(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get round() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set round(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Title.svelte generated by Svelte v3.43.1 */

    const file$l = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Title.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "title svelte-b06b69");
    			add_location(div, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Footer.svelte generated by Svelte v3.43.1 */

    const file$k = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Footer.svelte";

    function create_fragment$m(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "footer svelte-7jvwfp");
    			add_location(div, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Labels.svelte generated by Svelte v3.43.1 */
    const file$j = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Labels.svelte";

    function get_each_context_1$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (16:0) {#if $coords}
    function create_if_block$d(ctx) {
    	let defs;
    	let filter;
    	let feFlood;
    	let feMerge;
    	let feMergeNode0;
    	let feMergeNode1;
    	let t;
    	let g;

    	function select_block_type(ctx, dirty) {
    		if (/*$coords*/ ctx[2][0] && /*$coords*/ ctx[2][0].x) return create_if_block_1$9;
    		if (/*$coords*/ ctx[2][0] && /*$coords*/ ctx[2][0][0] && /*$coords*/ ctx[2][0][0].x) return create_if_block_3$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			filter = svg_element("filter");
    			feFlood = svg_element("feFlood");
    			feMerge = svg_element("feMerge");
    			feMergeNode0 = svg_element("feMergeNode");
    			feMergeNode1 = svg_element("feMergeNode");
    			t = space();
    			g = svg_element("g");
    			if (if_block) if_block.c();
    			attr_dev(feFlood, "flood-color", "rgba(255,255,255,0.8)");
    			attr_dev(feFlood, "result", "bg");
    			add_location(feFlood, file$j, 18, 2, 506);
    			attr_dev(feMergeNode0, "in", "bg");
    			add_location(feMergeNode0, file$j, 20, 3, 581);
    			attr_dev(feMergeNode1, "in", "SourceGraphic");
    			add_location(feMergeNode1, file$j, 21, 3, 607);
    			add_location(feMerge, file$j, 19, 2, 568);
    			attr_dev(filter, "x", "0");
    			attr_dev(filter, "y", "0");
    			attr_dev(filter, "width", "1");
    			attr_dev(filter, "height", "1");
    			attr_dev(filter, "id", "bgfill");
    			add_location(filter, file$j, 17, 1, 450);
    			add_location(defs, file$j, 16, 0, 442);
    			attr_dev(g, "class", "label-group");
    			add_location(g, file$j, 25, 0, 673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, filter);
    			append_dev(filter, feFlood);
    			append_dev(filter, feMerge);
    			append_dev(feMerge, feMergeNode0);
    			append_dev(feMerge, feMergeNode1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, g, anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(g, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(g);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(16:0) {#if $coords}",
    		ctx
    	});

    	return block;
    }

    // (41:58) 
    function create_if_block_3$6(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$coords*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$5(get_each_context_1$5(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xScale, $coords, $yScale, $data, labelKey, hovered, selected, idKey*/ 6207) {
    				each_value_1 = /*$coords*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$5(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$6.name,
    		type: "if",
    		source: "(41:58) ",
    		ctx
    	});

    	return block;
    }

    // (27:1) {#if $coords[0] && $coords[0].x}
    function create_if_block_1$9(ctx) {
    	let each_1_anchor;
    	let each_value = /*$coords*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xScale, $coords, $yScale, $data, labelKey, hovered, selected, idKey*/ 6207) {
    				each_value = /*$coords*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(27:1) {#if $coords[0] && $coords[0].x}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {#if [hovered, selected].includes($data[i][0][idKey])}
    function create_if_block_4$6(ctx) {
    	let text_1;
    	let t_value = /*$data*/ ctx[3][/*i*/ ctx[16]][0][/*labelKey*/ ctx[12]] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "label svelte-1ijkebl");
    			attr_dev(text_1, "transform", "translate(2,3)");
    			attr_dev(text_1, "filter", "url(#bgfill)");
    			attr_dev(text_1, "fill", "#333");
    			attr_dev(text_1, "x", text_1_x_value = /*$xScale*/ ctx[4](/*d*/ ctx[14][/*d*/ ctx[14].length - 1].x));
    			attr_dev(text_1, "y", text_1_y_value = /*$yScale*/ ctx[5](/*d*/ ctx[14][/*d*/ ctx[14].length - 1].y));
    			add_location(text_1, file$j, 43, 2, 1142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data*/ 8 && t_value !== (t_value = /*$data*/ ctx[3][/*i*/ ctx[16]][0][/*labelKey*/ ctx[12]] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$xScale, $coords*/ 20 && text_1_x_value !== (text_1_x_value = /*$xScale*/ ctx[4](/*d*/ ctx[14][/*d*/ ctx[14].length - 1].x))) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*$yScale, $coords*/ 36 && text_1_y_value !== (text_1_y_value = /*$yScale*/ ctx[5](/*d*/ ctx[14][/*d*/ ctx[14].length - 1].y))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$6.name,
    		type: "if",
    		source: "(43:2) {#if [hovered, selected].includes($data[i][0][idKey])}",
    		ctx
    	});

    	return block;
    }

    // (42:1) {#each $coords as d, i}
    function create_each_block_1$5(ctx) {
    	let show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1]].includes(/*$data*/ ctx[3][/*i*/ ctx[16]][0][/*idKey*/ ctx[11]]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_4$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hovered, selected, $data*/ 11) show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1]].includes(/*$data*/ ctx[3][/*i*/ ctx[16]][0][/*idKey*/ ctx[11]]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$5.name,
    		type: "each",
    		source: "(42:1) {#each $coords as d, i}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if [hovered, selected].includes($data[i][idKey])}
    function create_if_block_2$8(ctx) {
    	let text_1;
    	let t_value = /*$data*/ ctx[3][/*i*/ ctx[16]][/*labelKey*/ ctx[12]] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;

    	const block = {
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "label svelte-1ijkebl");
    			attr_dev(text_1, "transform", "translate(5,-5)");
    			attr_dev(text_1, "filter", "url(#bgfill)");
    			attr_dev(text_1, "fill", "#333");
    			attr_dev(text_1, "x", text_1_x_value = /*$xScale*/ ctx[4](/*d*/ ctx[14].x));
    			attr_dev(text_1, "y", text_1_y_value = /*$yScale*/ ctx[5](/*d*/ ctx[14].y));
    			add_location(text_1, file$j, 29, 2, 812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$data*/ 8 && t_value !== (t_value = /*$data*/ ctx[3][/*i*/ ctx[16]][/*labelKey*/ ctx[12]] + "")) set_data_dev(t, t_value);

    			if (dirty & /*$xScale, $coords*/ 20 && text_1_x_value !== (text_1_x_value = /*$xScale*/ ctx[4](/*d*/ ctx[14].x))) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*$yScale, $coords*/ 36 && text_1_y_value !== (text_1_y_value = /*$yScale*/ ctx[5](/*d*/ ctx[14].y))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(29:2) {#if [hovered, selected].includes($data[i][idKey])}",
    		ctx
    	});

    	return block;
    }

    // (28:1) {#each $coords as d, i}
    function create_each_block$b(ctx) {
    	let show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1]].includes(/*$data*/ ctx[3][/*i*/ ctx[16]][/*idKey*/ ctx[11]]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_2$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hovered, selected, $data*/ 11) show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1]].includes(/*$data*/ ctx[3][/*i*/ ctx[16]][/*idKey*/ ctx[11]]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(28:1) {#each $coords as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;
    	let if_block = /*$coords*/ ctx[2] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$coords*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $custom;
    	let $coords;
    	let $data;
    	let $xScale;
    	let $yScale;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Labels', slots, []);
    	const { data, xScale, yScale, custom } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(3, $data = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(4, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(5, $yScale = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(13, $custom = value));
    	let { hovered = null } = $$props;
    	let { selected = null } = $$props;
    	let coords = $custom.coords;
    	validate_store(coords, 'coords');
    	component_subscribe($$self, coords, value => $$invalidate(2, $coords = value));
    	let idKey = $custom.idKey;
    	let labelKey = $custom.labelKey;
    	const writable_props = ['hovered', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Labels> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		data,
    		xScale,
    		yScale,
    		custom,
    		hovered,
    		selected,
    		coords,
    		idKey,
    		labelKey,
    		$custom,
    		$coords,
    		$data,
    		$xScale,
    		$yScale
    	});

    	$$self.$inject_state = $$props => {
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('coords' in $$props) $$invalidate(10, coords = $$props.coords);
    		if ('idKey' in $$props) $$invalidate(11, idKey = $$props.idKey);
    		if ('labelKey' in $$props) $$invalidate(12, labelKey = $$props.labelKey);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hovered,
    		selected,
    		$coords,
    		$data,
    		$xScale,
    		$yScale,
    		data,
    		xScale,
    		yScale,
    		custom,
    		coords,
    		idKey,
    		labelKey
    	];
    }

    class Labels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { hovered: 0, selected: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Labels",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get hovered() {
    		throw new Error("<Labels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hovered(value) {
    		throw new Error("<Labels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Labels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Labels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/LineChart.svelte generated by Svelte v3.43.1 */
    const file$i = "node_modules/@onsvisual/svelte-charts/src/charts/LineChart.svelte";
    const get_front_slot_changes$2 = dirty => ({});
    const get_front_slot_context$2 = ctx => ({});
    const get_svg_slot_changes$2 = dirty => ({});
    const get_svg_slot_context$2 = ctx => ({});
    const get_back_slot_changes$2 = dirty => ({});
    const get_back_slot_context$2 = ctx => ({});
    const get_options_slot_changes$2 = dirty => ({});
    const get_options_slot_context$2 = ctx => ({});

    // (102:0) {#if title}
    function create_if_block_8$1(ctx) {
    	let title_1;
    	let current;

    	title_1 = new Title({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(title_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(title_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const title_1_changes = {};

    			if (dirty[0] & /*title*/ 131072 | dirty[1] & /*$$scope*/ 4194304) {
    				title_1_changes.$$scope = { dirty, ctx };
    			}

    			title_1.$set(title_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(title_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(102:0) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (103:2) <Title>
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[17]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 131072) set_data_dev(t, /*title*/ ctx[17]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(103:2) <Title>",
    		ctx
    	});

    	return block;
    }

    // (133:3) {#if width > 80}
    function create_if_block_2$7(ctx) {
    	let setcoords;
    	let t0;
    	let t1;
    	let svg;
    	let t2;
    	let current;
    	setcoords = new SetCoords({ $$inline: true });
    	const back_slot_template = /*#slots*/ ctx[48].back;
    	const back_slot = create_slot(back_slot_template, ctx, /*$$scope*/ ctx[53], get_back_slot_context$2);

    	svg = new Svg({
    			props: {
    				pointerEvents: /*interactive*/ ctx[29],
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const front_slot_template = /*#slots*/ ctx[48].front;
    	const front_slot = create_slot(front_slot_template, ctx, /*$$scope*/ ctx[53], get_front_slot_context$2);

    	const block = {
    		c: function create() {
    			create_component(setcoords.$$.fragment);
    			t0 = space();
    			if (back_slot) back_slot.c();
    			t1 = space();
    			create_component(svg.$$.fragment);
    			t2 = space();
    			if (front_slot) front_slot.c();
    		},
    		m: function mount(target, anchor) {
    			mount_component(setcoords, target, anchor);
    			insert_dev(target, t0, anchor);

    			if (back_slot) {
    				back_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(svg, target, anchor);
    			insert_dev(target, t2, anchor);

    			if (front_slot) {
    				front_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (back_slot) {
    				if (back_slot.p && (!current || dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						back_slot,
    						back_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(back_slot_template, /*$$scope*/ ctx[53], dirty, get_back_slot_changes$2),
    						get_back_slot_context$2
    					);
    				}
    			}

    			const svg_changes = {};
    			if (dirty[0] & /*interactive*/ 536870912) svg_changes.pointerEvents = /*interactive*/ ctx[29];

    			if (dirty[0] & /*hovered, selected, labels, lineWidth, line, mode, areaOpacity, area, yTicks, yFormatTick, yAxis, xTicks, snapTicks, xPrefix, xAxis*/ 1408364547 | dirty[1] & /*$$scope, select, hover, highlighted, yPrefix, ySuffix, xSuffix*/ 4194479) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);

    			if (front_slot) {
    				if (front_slot.p && (!current || dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						front_slot,
    						front_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(front_slot_template, /*$$scope*/ ctx[53], dirty, get_front_slot_changes$2),
    						get_front_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setcoords.$$.fragment, local);
    			transition_in(back_slot, local);
    			transition_in(svg.$$.fragment, local);
    			transition_in(front_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setcoords.$$.fragment, local);
    			transition_out(back_slot, local);
    			transition_out(svg.$$.fragment, local);
    			transition_out(front_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setcoords, detaching);
    			if (detaching) detach_dev(t0);
    			if (back_slot) back_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t2);
    			if (front_slot) front_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(133:3) {#if width > 80}",
    		ctx
    	});

    	return block;
    }

    // (137:6) {#if xAxis}
    function create_if_block_7$2(ctx) {
    	let axisx;
    	let current;

    	axisx = new AxisX$1({
    			props: {
    				ticks: /*xTicks*/ ctx[15],
    				snapTicks: /*snapTicks*/ ctx[21],
    				prefix: /*xPrefix*/ ctx[30],
    				suffix: /*xSuffix*/ ctx[31]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisx_changes = {};
    			if (dirty[0] & /*xTicks*/ 32768) axisx_changes.ticks = /*xTicks*/ ctx[15];
    			if (dirty[0] & /*snapTicks*/ 2097152) axisx_changes.snapTicks = /*snapTicks*/ ctx[21];
    			if (dirty[0] & /*xPrefix*/ 1073741824) axisx_changes.prefix = /*xPrefix*/ ctx[30];
    			if (dirty[1] & /*xSuffix*/ 1) axisx_changes.suffix = /*xSuffix*/ ctx[31];
    			axisx.$set(axisx_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(137:6) {#if xAxis}",
    		ctx
    	});

    	return block;
    }

    // (140:6) {#if yAxis}
    function create_if_block_6$2(ctx) {
    	let axisy;
    	let current;

    	axisy = new AxisY$1({
    			props: {
    				ticks: /*yTicks*/ ctx[16],
    				formatTick: /*yFormatTick*/ ctx[12],
    				prefix: /*yPrefix*/ ctx[32],
    				suffix: /*ySuffix*/ ctx[33]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisy.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisy, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisy_changes = {};
    			if (dirty[0] & /*yTicks*/ 65536) axisy_changes.ticks = /*yTicks*/ ctx[16];
    			if (dirty[0] & /*yFormatTick*/ 4096) axisy_changes.formatTick = /*yFormatTick*/ ctx[12];
    			if (dirty[1] & /*yPrefix*/ 2) axisy_changes.prefix = /*yPrefix*/ ctx[32];
    			if (dirty[1] & /*ySuffix*/ 4) axisy_changes.suffix = /*ySuffix*/ ctx[33];
    			axisy.$set(axisy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisy, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(140:6) {#if yAxis}",
    		ctx
    	});

    	return block;
    }

    // (143:6) {#if area}
    function create_if_block_5$5(ctx) {
    	let area_1;
    	let current;

    	area_1 = new Area({
    			props: {
    				mode: /*mode*/ ctx[24],
    				opacity: /*areaOpacity*/ ctx[25]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(area_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(area_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const area_1_changes = {};
    			if (dirty[0] & /*mode*/ 16777216) area_1_changes.mode = /*mode*/ ctx[24];
    			if (dirty[0] & /*areaOpacity*/ 33554432) area_1_changes.opacity = /*areaOpacity*/ ctx[25];
    			area_1.$set(area_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(area_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(area_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(area_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$5.name,
    		type: "if",
    		source: "(143:6) {#if area}",
    		ctx
    	});

    	return block;
    }

    // (146:6) {#if line}
    function create_if_block_4$5(ctx) {
    	let line_1;
    	let updating_selected;
    	let updating_hovered;
    	let current;

    	function line_1_selected_binding(value) {
    		/*line_1_selected_binding*/ ctx[49](value);
    	}

    	function line_1_hovered_binding(value) {
    		/*line_1_hovered_binding*/ ctx[50](value);
    	}

    	let line_1_props = {
    		lineWidth: /*lineWidth*/ ctx[28],
    		select: /*select*/ ctx[36],
    		hover: /*hover*/ ctx[34],
    		highlighted: /*highlighted*/ ctx[38]
    	};

    	if (/*selected*/ ctx[1] !== void 0) {
    		line_1_props.selected = /*selected*/ ctx[1];
    	}

    	if (/*hovered*/ ctx[0] !== void 0) {
    		line_1_props.hovered = /*hovered*/ ctx[0];
    	}

    	line_1 = new Line({ props: line_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(line_1, 'selected', line_1_selected_binding));
    	binding_callbacks.push(() => bind(line_1, 'hovered', line_1_hovered_binding));
    	line_1.$on("hover", /*hover_handler*/ ctx[51]);
    	line_1.$on("select", /*select_handler*/ ctx[52]);

    	const block = {
    		c: function create() {
    			create_component(line_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(line_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const line_1_changes = {};
    			if (dirty[0] & /*lineWidth*/ 268435456) line_1_changes.lineWidth = /*lineWidth*/ ctx[28];
    			if (dirty[1] & /*select*/ 32) line_1_changes.select = /*select*/ ctx[36];
    			if (dirty[1] & /*hover*/ 8) line_1_changes.hover = /*hover*/ ctx[34];
    			if (dirty[1] & /*highlighted*/ 128) line_1_changes.highlighted = /*highlighted*/ ctx[38];

    			if (!updating_selected && dirty[0] & /*selected*/ 2) {
    				updating_selected = true;
    				line_1_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			if (!updating_hovered && dirty[0] & /*hovered*/ 1) {
    				updating_hovered = true;
    				line_1_changes.hovered = /*hovered*/ ctx[0];
    				add_flush_callback(() => updating_hovered = false);
    			}

    			line_1.$set(line_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(line_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(line_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(line_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$5.name,
    		type: "if",
    		source: "(146:6) {#if line}",
    		ctx
    	});

    	return block;
    }

    // (149:3) {#if labels}
    function create_if_block_3$5(ctx) {
    	let labels_1;
    	let current;

    	labels_1 = new Labels({
    			props: {
    				hovered: /*hovered*/ ctx[0],
    				selected: /*selected*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(labels_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(labels_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const labels_1_changes = {};
    			if (dirty[0] & /*hovered*/ 1) labels_1_changes.hovered = /*hovered*/ ctx[0];
    			if (dirty[0] & /*selected*/ 2) labels_1_changes.selected = /*selected*/ ctx[1];
    			labels_1.$set(labels_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labels_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labels_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(labels_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(149:3) {#if labels}",
    		ctx
    	});

    	return block;
    }

    // (136:2) <Svg pointerEvents={interactive}>
    function create_default_slot_2$4(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let if_block0 = /*xAxis*/ ctx[13] && create_if_block_7$2(ctx);
    	let if_block1 = /*yAxis*/ ctx[14] && create_if_block_6$2(ctx);
    	let if_block2 = /*area*/ ctx[23] && create_if_block_5$5(ctx);
    	let if_block3 = /*line*/ ctx[22] && create_if_block_4$5(ctx);
    	let if_block4 = /*labels*/ ctx[20] && create_if_block_3$5(ctx);
    	const svg_slot_template = /*#slots*/ ctx[48].svg;
    	const svg_slot = create_slot(svg_slot_template, ctx, /*$$scope*/ ctx[53], get_svg_slot_context$2);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (svg_slot) svg_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t4, anchor);

    			if (svg_slot) {
    				svg_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*xAxis*/ ctx[13]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*xAxis*/ 8192) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*yAxis*/ ctx[14]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*yAxis*/ 16384) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*area*/ ctx[23]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*area*/ 8388608) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_5$5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*line*/ ctx[22]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*line*/ 4194304) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_4$5(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*labels*/ ctx[20]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*labels*/ 1048576) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_3$5(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(t4.parentNode, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (svg_slot) {
    				if (svg_slot.p && (!current || dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						svg_slot,
    						svg_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(svg_slot_template, /*$$scope*/ ctx[53], dirty, get_svg_slot_changes$2),
    						get_svg_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(svg_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(svg_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (svg_slot) svg_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(136:2) <Svg pointerEvents={interactive}>",
    		ctx
    	});

    	return block;
    }

    // (107:1) <LayerCake   {padding}   x={xKey}   y={yKey}   z={zKey}   yDomain={$yDomain}   yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}   zScale={scaleOrdinal()}   {zDomain}   zRange={colors}   data={groupedData}   flatData={data}   custom={{    type: 'line',    mode,    idKey,    labelKey,    coords,    colorSelect,    colorHover,    colorHighlight,       animation,       duration     }}   let:width  >
    function create_default_slot_1$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*width*/ ctx[60] > 80 && create_if_block_2$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*width*/ ctx[60] > 80) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[1] & /*width*/ 536870912) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(107:1) <LayerCake   {padding}   x={xKey}   y={yKey}   z={zKey}   yDomain={$yDomain}   yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}   zScale={scaleOrdinal()}   {zDomain}   zRange={colors}   data={groupedData}   flatData={data}   custom={{    type: 'line',    mode,    idKey,    labelKey,    coords,    colorSelect,    colorHover,    colorHighlight,       animation,       duration     }}   let:width  >",
    		ctx
    	});

    	return block;
    }

    // (158:0) {#if legend && zDomain}
    function create_if_block_1$8(ctx) {
    	let legend_1;
    	let current;

    	legend_1 = new Legend$1({
    			props: {
    				domain: /*zDomain*/ ctx[40],
    				colors: /*colors*/ ctx[27],
    				line: /*line*/ ctx[22],
    				markerWidth: /*lineWidth*/ ctx[28]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(legend_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(legend_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const legend_1_changes = {};
    			if (dirty[1] & /*zDomain*/ 512) legend_1_changes.domain = /*zDomain*/ ctx[40];
    			if (dirty[0] & /*colors*/ 134217728) legend_1_changes.colors = /*colors*/ ctx[27];
    			if (dirty[0] & /*line*/ 4194304) legend_1_changes.line = /*line*/ ctx[22];
    			if (dirty[0] & /*lineWidth*/ 268435456) legend_1_changes.markerWidth = /*lineWidth*/ ctx[28];
    			legend_1.$set(legend_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legend_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legend_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(legend_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(158:0) {#if legend && zDomain}",
    		ctx
    	});

    	return block;
    }

    // (161:0) {#if footer}
    function create_if_block$c(ctx) {
    	let footer_1;
    	let current;

    	footer_1 = new Footer({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(footer_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const footer_1_changes = {};

    			if (dirty[0] & /*footer*/ 262144 | dirty[1] & /*$$scope*/ 4194304) {
    				footer_1_changes.$$scope = { dirty, ctx };
    			}

    			footer_1.$set(footer_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(161:0) {#if footer}",
    		ctx
    	});

    	return block;
    }

    // (162:2) <Footer>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*footer*/ ctx[18]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*footer*/ 262144) set_data_dev(t, /*footer*/ ctx[18]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(162:2) <Footer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let layercake;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*title*/ ctx[17] && create_if_block_8$1(ctx);
    	const options_slot_template = /*#slots*/ ctx[48].options;
    	const options_slot = create_slot(options_slot_template, ctx, /*$$scope*/ ctx[53], get_options_slot_context$2);

    	layercake = new LayerCake({
    			props: {
    				padding: /*padding*/ ctx[26],
    				x: /*xKey*/ ctx[6],
    				y: /*yKey*/ ctx[7],
    				z: /*zKey*/ ctx[8],
    				yDomain: /*$yDomain*/ ctx[42],
    				yScale: /*yScale*/ ctx[11] == 'log'
    				? symlog()
    				: linear(),
    				zScale: ordinal(),
    				zDomain: /*zDomain*/ ctx[40],
    				zRange: /*colors*/ ctx[27],
    				data: /*groupedData*/ ctx[41],
    				flatData: /*data*/ ctx[2],
    				custom: {
    					type: 'line',
    					mode: /*mode*/ ctx[24],
    					idKey: /*idKey*/ ctx[9],
    					labelKey: /*labelKey*/ ctx[10],
    					coords: /*coords*/ ctx[43],
    					colorSelect: /*colorSelect*/ ctx[37],
    					colorHover: /*colorHover*/ ctx[35],
    					colorHighlight: /*colorHighlight*/ ctx[39],
    					animation: /*animation*/ ctx[4],
    					duration: /*duration*/ ctx[5]
    				},
    				$$slots: {
    					default: [
    						create_default_slot_1$4,
    						({ width }) => ({ 60: width }),
    						({ width }) => [0, width ? 536870912 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*legend*/ ctx[19] && /*zDomain*/ ctx[40] && create_if_block_1$8(ctx);
    	let if_block2 = /*footer*/ ctx[18] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (options_slot) options_slot.c();
    			t1 = space();
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div, "class", "chart-container svelte-1dnlmiu");

    			set_style(div, "height", typeof /*height*/ ctx[3] == 'number'
    			? /*height*/ ctx[3] + 'px'
    			: /*height*/ ctx[3]);

    			add_location(div, file$i, 105, 0, 3481);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			if (options_slot) {
    				options_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[17]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 131072) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_8$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (options_slot) {
    				if (options_slot.p && (!current || dirty[1] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						options_slot,
    						options_slot_template,
    						ctx,
    						/*$$scope*/ ctx[53],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[53])
    						: get_slot_changes(options_slot_template, /*$$scope*/ ctx[53], dirty, get_options_slot_changes$2),
    						get_options_slot_context$2
    					);
    				}
    			}

    			const layercake_changes = {};
    			if (dirty[0] & /*padding*/ 67108864) layercake_changes.padding = /*padding*/ ctx[26];
    			if (dirty[0] & /*xKey*/ 64) layercake_changes.x = /*xKey*/ ctx[6];
    			if (dirty[0] & /*yKey*/ 128) layercake_changes.y = /*yKey*/ ctx[7];
    			if (dirty[0] & /*zKey*/ 256) layercake_changes.z = /*zKey*/ ctx[8];
    			if (dirty[1] & /*$yDomain*/ 2048) layercake_changes.yDomain = /*$yDomain*/ ctx[42];

    			if (dirty[0] & /*yScale*/ 2048) layercake_changes.yScale = /*yScale*/ ctx[11] == 'log'
    			? symlog()
    			: linear();

    			if (dirty[1] & /*zDomain*/ 512) layercake_changes.zDomain = /*zDomain*/ ctx[40];
    			if (dirty[0] & /*colors*/ 134217728) layercake_changes.zRange = /*colors*/ ctx[27];
    			if (dirty[1] & /*groupedData*/ 1024) layercake_changes.data = /*groupedData*/ ctx[41];
    			if (dirty[0] & /*data*/ 4) layercake_changes.flatData = /*data*/ ctx[2];

    			if (dirty[0] & /*mode, idKey, labelKey, animation, duration*/ 16778800 | dirty[1] & /*colorSelect, colorHover, colorHighlight*/ 336) layercake_changes.custom = {
    				type: 'line',
    				mode: /*mode*/ ctx[24],
    				idKey: /*idKey*/ ctx[9],
    				labelKey: /*labelKey*/ ctx[10],
    				coords: /*coords*/ ctx[43],
    				colorSelect: /*colorSelect*/ ctx[37],
    				colorHover: /*colorHover*/ ctx[35],
    				colorHighlight: /*colorHighlight*/ ctx[39],
    				animation: /*animation*/ ctx[4],
    				duration: /*duration*/ ctx[5]
    			};

    			if (dirty[0] & /*interactive, hovered, selected, labels, lineWidth, line, mode, areaOpacity, area, yTicks, yFormatTick, yAxis, xTicks, snapTicks, xPrefix, xAxis*/ 1945235459 | dirty[1] & /*$$scope, select, hover, highlighted, yPrefix, ySuffix, xSuffix, width*/ 541065391) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (!current || dirty[0] & /*height*/ 8) {
    				set_style(div, "height", typeof /*height*/ ctx[3] == 'number'
    				? /*height*/ ctx[3] + 'px'
    				: /*height*/ ctx[3]);
    			}

    			if (/*legend*/ ctx[19] && /*zDomain*/ ctx[40]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*legend*/ 524288 | dirty[1] & /*zDomain*/ 512) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*footer*/ ctx[18]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*footer*/ 262144) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$c(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(options_slot, local);
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(options_slot, local);
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (options_slot) options_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let zDomain;
    	let groupedData;
    	let $yDomain;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LineChart', slots, ['options','back','svg','front']);
    	let { data } = $$props;
    	let { height = 250 } = $$props;
    	let { animation = true } = $$props;
    	let { duration = 800 } = $$props;
    	let { xKey = 'x' } = $$props;
    	let { yKey = 'y' } = $$props;
    	let { zKey = null } = $$props;
    	let { idKey = zKey } = $$props;
    	let { labelKey = idKey } = $$props;
    	let { yScale = 'linear' } = $$props;
    	let { yFormatTick = d => d } = $$props;
    	let { yMax = null } = $$props;
    	let { yMin = 0 } = $$props;
    	let { xAxis = true } = $$props;
    	let { yAxis = true } = $$props;
    	let { xTicks = 4 } = $$props;
    	let { yTicks = 4 } = $$props;
    	let { title = null } = $$props;
    	let { footer = null } = $$props;
    	let { legend = false } = $$props;
    	let { labels = false } = $$props;
    	let { snapTicks = true } = $$props;
    	let { line = true } = $$props;
    	let { area = true } = $$props;
    	let { mode = 'default' } = $$props;
    	let { areaOpacity = 1 } = $$props;
    	let { padding = { top: 0, bottom: 20, left: 35, right: 0 } } = $$props;
    	let { color = null } = $$props;

    	let { colors = color
    	? [color]
    	: [
    			'#206095',
    			'#A8BD3A',
    			'#003C57',
    			'#27A0CC',
    			'#118C7B',
    			'#F66068',
    			'#746CB1',
    			'#22D0B6',
    			'lightgrey'
    		] } = $$props;

    	let { lineWidth = 2.5 } = $$props;
    	let { interactive = true } = $$props;
    	let { xPrefix = "" } = $$props;
    	let { xSuffix = "" } = $$props;
    	let { yPrefix = "" } = $$props;
    	let { ySuffix = "" } = $$props;
    	let { hover = false } = $$props;
    	let { hovered = null } = $$props;
    	let { colorHover = 'orange' } = $$props;
    	let { select = false } = $$props;
    	let { selected = null } = $$props;
    	let { colorSelect = '#206095' } = $$props;
    	let { highlighted = [] } = $$props;
    	let { colorHighlight = '#206095' } = $$props;
    	const tweenOptions = { duration, easing: cubicInOut };
    	const coords = tweened(undefined, tweenOptions);
    	const distinct = (d, i, arr) => arr.indexOf(d) == i;

    	function getTotals(data, keys) {
    		let arr = [];

    		keys.forEach(key => {
    			let vals = data.filter(d => d[xKey] == key).map(d => d[yKey]);
    			let sum = vals.reduce((acc, curr) => acc + curr);
    			arr.push(sum);
    		});

    		return arr;
    	}

    	// Functions to animate yDomain
    	const yDomSet = (data, mode, yKey, yMax) => yMax
    	? [yMin, yMax]
    	: mode == 'stacked' && yKey
    		? [
    				yMin,
    				Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))
    			]
    		: [yMin, Math.max(...data.map(d => d[yKey]))];

    	function yDomUpdate(data, mode, yKey, yMax) {
    		let newYDom = yDomSet(data, mode, yKey, yMax);

    		if (newYDom[0] != yDom[0] || newYDom[1] != yDom[1]) {
    			yDomain.set(newYDom, { duration: animation ? duration : 0 });
    			yDom = newYDom;
    		}
    	}

    	let yDom = yDomSet(data, mode, yKey, yMax);
    	const yDomain = tweened(yDom, tweenOptions);
    	validate_store(yDomain, 'yDomain');
    	component_subscribe($$self, yDomain, value => $$invalidate(42, $yDomain = value));

    	const writable_props = [
    		'data',
    		'height',
    		'animation',
    		'duration',
    		'xKey',
    		'yKey',
    		'zKey',
    		'idKey',
    		'labelKey',
    		'yScale',
    		'yFormatTick',
    		'yMax',
    		'yMin',
    		'xAxis',
    		'yAxis',
    		'xTicks',
    		'yTicks',
    		'title',
    		'footer',
    		'legend',
    		'labels',
    		'snapTicks',
    		'line',
    		'area',
    		'mode',
    		'areaOpacity',
    		'padding',
    		'color',
    		'colors',
    		'lineWidth',
    		'interactive',
    		'xPrefix',
    		'xSuffix',
    		'yPrefix',
    		'ySuffix',
    		'hover',
    		'hovered',
    		'colorHover',
    		'select',
    		'selected',
    		'colorSelect',
    		'highlighted',
    		'colorHighlight'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LineChart> was created with unknown prop '${key}'`);
    	});

    	function line_1_selected_binding(value) {
    		selected = value;
    		$$invalidate(1, selected);
    	}

    	function line_1_hovered_binding(value) {
    		hovered = value;
    		$$invalidate(0, hovered);
    	}

    	function hover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
    		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
    		if ('xKey' in $$props) $$invalidate(6, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(7, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(8, zKey = $$props.zKey);
    		if ('idKey' in $$props) $$invalidate(9, idKey = $$props.idKey);
    		if ('labelKey' in $$props) $$invalidate(10, labelKey = $$props.labelKey);
    		if ('yScale' in $$props) $$invalidate(11, yScale = $$props.yScale);
    		if ('yFormatTick' in $$props) $$invalidate(12, yFormatTick = $$props.yFormatTick);
    		if ('yMax' in $$props) $$invalidate(45, yMax = $$props.yMax);
    		if ('yMin' in $$props) $$invalidate(46, yMin = $$props.yMin);
    		if ('xAxis' in $$props) $$invalidate(13, xAxis = $$props.xAxis);
    		if ('yAxis' in $$props) $$invalidate(14, yAxis = $$props.yAxis);
    		if ('xTicks' in $$props) $$invalidate(15, xTicks = $$props.xTicks);
    		if ('yTicks' in $$props) $$invalidate(16, yTicks = $$props.yTicks);
    		if ('title' in $$props) $$invalidate(17, title = $$props.title);
    		if ('footer' in $$props) $$invalidate(18, footer = $$props.footer);
    		if ('legend' in $$props) $$invalidate(19, legend = $$props.legend);
    		if ('labels' in $$props) $$invalidate(20, labels = $$props.labels);
    		if ('snapTicks' in $$props) $$invalidate(21, snapTicks = $$props.snapTicks);
    		if ('line' in $$props) $$invalidate(22, line = $$props.line);
    		if ('area' in $$props) $$invalidate(23, area = $$props.area);
    		if ('mode' in $$props) $$invalidate(24, mode = $$props.mode);
    		if ('areaOpacity' in $$props) $$invalidate(25, areaOpacity = $$props.areaOpacity);
    		if ('padding' in $$props) $$invalidate(26, padding = $$props.padding);
    		if ('color' in $$props) $$invalidate(47, color = $$props.color);
    		if ('colors' in $$props) $$invalidate(27, colors = $$props.colors);
    		if ('lineWidth' in $$props) $$invalidate(28, lineWidth = $$props.lineWidth);
    		if ('interactive' in $$props) $$invalidate(29, interactive = $$props.interactive);
    		if ('xPrefix' in $$props) $$invalidate(30, xPrefix = $$props.xPrefix);
    		if ('xSuffix' in $$props) $$invalidate(31, xSuffix = $$props.xSuffix);
    		if ('yPrefix' in $$props) $$invalidate(32, yPrefix = $$props.yPrefix);
    		if ('ySuffix' in $$props) $$invalidate(33, ySuffix = $$props.ySuffix);
    		if ('hover' in $$props) $$invalidate(34, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('colorHover' in $$props) $$invalidate(35, colorHover = $$props.colorHover);
    		if ('select' in $$props) $$invalidate(36, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('colorSelect' in $$props) $$invalidate(37, colorSelect = $$props.colorSelect);
    		if ('highlighted' in $$props) $$invalidate(38, highlighted = $$props.highlighted);
    		if ('colorHighlight' in $$props) $$invalidate(39, colorHighlight = $$props.colorHighlight);
    		if ('$$scope' in $$props) $$invalidate(53, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		scaleOrdinal: ordinal,
    		scaleLinear: linear,
    		scaleSymlog: symlog,
    		tweened,
    		cubicInOut,
    		groupData,
    		stackData,
    		SetCoords,
    		Line,
    		Area,
    		AxisX: AxisX$1,
    		AxisY: AxisY$1,
    		Legend: Legend$1,
    		Title,
    		Footer,
    		Labels,
    		data,
    		height,
    		animation,
    		duration,
    		xKey,
    		yKey,
    		zKey,
    		idKey,
    		labelKey,
    		yScale,
    		yFormatTick,
    		yMax,
    		yMin,
    		xAxis,
    		yAxis,
    		xTicks,
    		yTicks,
    		title,
    		footer,
    		legend,
    		labels,
    		snapTicks,
    		line,
    		area,
    		mode,
    		areaOpacity,
    		padding,
    		color,
    		colors,
    		lineWidth,
    		interactive,
    		xPrefix,
    		xSuffix,
    		yPrefix,
    		ySuffix,
    		hover,
    		hovered,
    		colorHover,
    		select,
    		selected,
    		colorSelect,
    		highlighted,
    		colorHighlight,
    		tweenOptions,
    		coords,
    		distinct,
    		getTotals,
    		yDomSet,
    		yDomUpdate,
    		yDom,
    		yDomain,
    		zDomain,
    		groupedData,
    		$yDomain
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
    		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
    		if ('xKey' in $$props) $$invalidate(6, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(7, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(8, zKey = $$props.zKey);
    		if ('idKey' in $$props) $$invalidate(9, idKey = $$props.idKey);
    		if ('labelKey' in $$props) $$invalidate(10, labelKey = $$props.labelKey);
    		if ('yScale' in $$props) $$invalidate(11, yScale = $$props.yScale);
    		if ('yFormatTick' in $$props) $$invalidate(12, yFormatTick = $$props.yFormatTick);
    		if ('yMax' in $$props) $$invalidate(45, yMax = $$props.yMax);
    		if ('yMin' in $$props) $$invalidate(46, yMin = $$props.yMin);
    		if ('xAxis' in $$props) $$invalidate(13, xAxis = $$props.xAxis);
    		if ('yAxis' in $$props) $$invalidate(14, yAxis = $$props.yAxis);
    		if ('xTicks' in $$props) $$invalidate(15, xTicks = $$props.xTicks);
    		if ('yTicks' in $$props) $$invalidate(16, yTicks = $$props.yTicks);
    		if ('title' in $$props) $$invalidate(17, title = $$props.title);
    		if ('footer' in $$props) $$invalidate(18, footer = $$props.footer);
    		if ('legend' in $$props) $$invalidate(19, legend = $$props.legend);
    		if ('labels' in $$props) $$invalidate(20, labels = $$props.labels);
    		if ('snapTicks' in $$props) $$invalidate(21, snapTicks = $$props.snapTicks);
    		if ('line' in $$props) $$invalidate(22, line = $$props.line);
    		if ('area' in $$props) $$invalidate(23, area = $$props.area);
    		if ('mode' in $$props) $$invalidate(24, mode = $$props.mode);
    		if ('areaOpacity' in $$props) $$invalidate(25, areaOpacity = $$props.areaOpacity);
    		if ('padding' in $$props) $$invalidate(26, padding = $$props.padding);
    		if ('color' in $$props) $$invalidate(47, color = $$props.color);
    		if ('colors' in $$props) $$invalidate(27, colors = $$props.colors);
    		if ('lineWidth' in $$props) $$invalidate(28, lineWidth = $$props.lineWidth);
    		if ('interactive' in $$props) $$invalidate(29, interactive = $$props.interactive);
    		if ('xPrefix' in $$props) $$invalidate(30, xPrefix = $$props.xPrefix);
    		if ('xSuffix' in $$props) $$invalidate(31, xSuffix = $$props.xSuffix);
    		if ('yPrefix' in $$props) $$invalidate(32, yPrefix = $$props.yPrefix);
    		if ('ySuffix' in $$props) $$invalidate(33, ySuffix = $$props.ySuffix);
    		if ('hover' in $$props) $$invalidate(34, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('colorHover' in $$props) $$invalidate(35, colorHover = $$props.colorHover);
    		if ('select' in $$props) $$invalidate(36, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('colorSelect' in $$props) $$invalidate(37, colorSelect = $$props.colorSelect);
    		if ('highlighted' in $$props) $$invalidate(38, highlighted = $$props.highlighted);
    		if ('colorHighlight' in $$props) $$invalidate(39, colorHighlight = $$props.colorHighlight);
    		if ('yDom' in $$props) yDom = $$props.yDom;
    		if ('zDomain' in $$props) $$invalidate(40, zDomain = $$props.zDomain);
    		if ('groupedData' in $$props) $$invalidate(41, groupedData = $$props.groupedData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, mode, yKey*/ 16777348 | $$self.$$.dirty[1] & /*yMax*/ 16384) {
    			yDomUpdate(data, mode, yKey, yMax);
    		}

    		if ($$self.$$.dirty[0] & /*zKey, data*/ 260) {
    			// Function to update zDomain
    			$$invalidate(40, zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null);
    		}

    		if ($$self.$$.dirty[0] & /*mode, data, yKey, zKey*/ 16777604 | $$self.$$.dirty[1] & /*zDomain*/ 512) {
    			// Create a data series for each zKey (group)
    			$$invalidate(41, groupedData = mode == 'stacked'
    			? stackData(data, zDomain, yKey, zKey)
    			: groupData(data, zDomain, zKey));
    		}
    	};

    	return [
    		hovered,
    		selected,
    		data,
    		height,
    		animation,
    		duration,
    		xKey,
    		yKey,
    		zKey,
    		idKey,
    		labelKey,
    		yScale,
    		yFormatTick,
    		xAxis,
    		yAxis,
    		xTicks,
    		yTicks,
    		title,
    		footer,
    		legend,
    		labels,
    		snapTicks,
    		line,
    		area,
    		mode,
    		areaOpacity,
    		padding,
    		colors,
    		lineWidth,
    		interactive,
    		xPrefix,
    		xSuffix,
    		yPrefix,
    		ySuffix,
    		hover,
    		colorHover,
    		select,
    		colorSelect,
    		highlighted,
    		colorHighlight,
    		zDomain,
    		groupedData,
    		$yDomain,
    		coords,
    		yDomain,
    		yMax,
    		yMin,
    		color,
    		slots,
    		line_1_selected_binding,
    		line_1_hovered_binding,
    		hover_handler,
    		select_handler,
    		$$scope
    	];
    }

    class LineChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$k,
    			create_fragment$k,
    			safe_not_equal,
    			{
    				data: 2,
    				height: 3,
    				animation: 4,
    				duration: 5,
    				xKey: 6,
    				yKey: 7,
    				zKey: 8,
    				idKey: 9,
    				labelKey: 10,
    				yScale: 11,
    				yFormatTick: 12,
    				yMax: 45,
    				yMin: 46,
    				xAxis: 13,
    				yAxis: 14,
    				xTicks: 15,
    				yTicks: 16,
    				title: 17,
    				footer: 18,
    				legend: 19,
    				labels: 20,
    				snapTicks: 21,
    				line: 22,
    				area: 23,
    				mode: 24,
    				areaOpacity: 25,
    				padding: 26,
    				color: 47,
    				colors: 27,
    				lineWidth: 28,
    				interactive: 29,
    				xPrefix: 30,
    				xSuffix: 31,
    				yPrefix: 32,
    				ySuffix: 33,
    				hover: 34,
    				hovered: 0,
    				colorHover: 35,
    				select: 36,
    				selected: 1,
    				colorSelect: 37,
    				highlighted: 38,
    				colorHighlight: 39
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineChart",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console.warn("<LineChart> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		return this.$$.ctx[2];
    	}

    	set data(data) {
    		this.$$set({ data });
    		flush();
    	}

    	get height() {
    		return this.$$.ctx[3];
    	}

    	set height(height) {
    		this.$$set({ height });
    		flush();
    	}

    	get animation() {
    		return this.$$.ctx[4];
    	}

    	set animation(animation) {
    		this.$$set({ animation });
    		flush();
    	}

    	get duration() {
    		return this.$$.ctx[5];
    	}

    	set duration(duration) {
    		this.$$set({ duration });
    		flush();
    	}

    	get xKey() {
    		return this.$$.ctx[6];
    	}

    	set xKey(xKey) {
    		this.$$set({ xKey });
    		flush();
    	}

    	get yKey() {
    		return this.$$.ctx[7];
    	}

    	set yKey(yKey) {
    		this.$$set({ yKey });
    		flush();
    	}

    	get zKey() {
    		return this.$$.ctx[8];
    	}

    	set zKey(zKey) {
    		this.$$set({ zKey });
    		flush();
    	}

    	get idKey() {
    		return this.$$.ctx[9];
    	}

    	set idKey(idKey) {
    		this.$$set({ idKey });
    		flush();
    	}

    	get labelKey() {
    		return this.$$.ctx[10];
    	}

    	set labelKey(labelKey) {
    		this.$$set({ labelKey });
    		flush();
    	}

    	get yScale() {
    		return this.$$.ctx[11];
    	}

    	set yScale(yScale) {
    		this.$$set({ yScale });
    		flush();
    	}

    	get yFormatTick() {
    		return this.$$.ctx[12];
    	}

    	set yFormatTick(yFormatTick) {
    		this.$$set({ yFormatTick });
    		flush();
    	}

    	get yMax() {
    		return this.$$.ctx[45];
    	}

    	set yMax(yMax) {
    		this.$$set({ yMax });
    		flush();
    	}

    	get yMin() {
    		return this.$$.ctx[46];
    	}

    	set yMin(yMin) {
    		this.$$set({ yMin });
    		flush();
    	}

    	get xAxis() {
    		return this.$$.ctx[13];
    	}

    	set xAxis(xAxis) {
    		this.$$set({ xAxis });
    		flush();
    	}

    	get yAxis() {
    		return this.$$.ctx[14];
    	}

    	set yAxis(yAxis) {
    		this.$$set({ yAxis });
    		flush();
    	}

    	get xTicks() {
    		return this.$$.ctx[15];
    	}

    	set xTicks(xTicks) {
    		this.$$set({ xTicks });
    		flush();
    	}

    	get yTicks() {
    		return this.$$.ctx[16];
    	}

    	set yTicks(yTicks) {
    		this.$$set({ yTicks });
    		flush();
    	}

    	get title() {
    		return this.$$.ctx[17];
    	}

    	set title(title) {
    		this.$$set({ title });
    		flush();
    	}

    	get footer() {
    		return this.$$.ctx[18];
    	}

    	set footer(footer) {
    		this.$$set({ footer });
    		flush();
    	}

    	get legend() {
    		return this.$$.ctx[19];
    	}

    	set legend(legend) {
    		this.$$set({ legend });
    		flush();
    	}

    	get labels() {
    		return this.$$.ctx[20];
    	}

    	set labels(labels) {
    		this.$$set({ labels });
    		flush();
    	}

    	get snapTicks() {
    		return this.$$.ctx[21];
    	}

    	set snapTicks(snapTicks) {
    		this.$$set({ snapTicks });
    		flush();
    	}

    	get line() {
    		return this.$$.ctx[22];
    	}

    	set line(line) {
    		this.$$set({ line });
    		flush();
    	}

    	get area() {
    		return this.$$.ctx[23];
    	}

    	set area(area) {
    		this.$$set({ area });
    		flush();
    	}

    	get mode() {
    		return this.$$.ctx[24];
    	}

    	set mode(mode) {
    		this.$$set({ mode });
    		flush();
    	}

    	get areaOpacity() {
    		return this.$$.ctx[25];
    	}

    	set areaOpacity(areaOpacity) {
    		this.$$set({ areaOpacity });
    		flush();
    	}

    	get padding() {
    		return this.$$.ctx[26];
    	}

    	set padding(padding) {
    		this.$$set({ padding });
    		flush();
    	}

    	get color() {
    		return this.$$.ctx[47];
    	}

    	set color(color) {
    		this.$$set({ color });
    		flush();
    	}

    	get colors() {
    		return this.$$.ctx[27];
    	}

    	set colors(colors) {
    		this.$$set({ colors });
    		flush();
    	}

    	get lineWidth() {
    		return this.$$.ctx[28];
    	}

    	set lineWidth(lineWidth) {
    		this.$$set({ lineWidth });
    		flush();
    	}

    	get interactive() {
    		return this.$$.ctx[29];
    	}

    	set interactive(interactive) {
    		this.$$set({ interactive });
    		flush();
    	}

    	get xPrefix() {
    		return this.$$.ctx[30];
    	}

    	set xPrefix(xPrefix) {
    		this.$$set({ xPrefix });
    		flush();
    	}

    	get xSuffix() {
    		return this.$$.ctx[31];
    	}

    	set xSuffix(xSuffix) {
    		this.$$set({ xSuffix });
    		flush();
    	}

    	get yPrefix() {
    		return this.$$.ctx[32];
    	}

    	set yPrefix(yPrefix) {
    		this.$$set({ yPrefix });
    		flush();
    	}

    	get ySuffix() {
    		return this.$$.ctx[33];
    	}

    	set ySuffix(ySuffix) {
    		this.$$set({ ySuffix });
    		flush();
    	}

    	get hover() {
    		return this.$$.ctx[34];
    	}

    	set hover(hover) {
    		this.$$set({ hover });
    		flush();
    	}

    	get hovered() {
    		return this.$$.ctx[0];
    	}

    	set hovered(hovered) {
    		this.$$set({ hovered });
    		flush();
    	}

    	get colorHover() {
    		return this.$$.ctx[35];
    	}

    	set colorHover(colorHover) {
    		this.$$set({ colorHover });
    		flush();
    	}

    	get select() {
    		return this.$$.ctx[36];
    	}

    	set select(select) {
    		this.$$set({ select });
    		flush();
    	}

    	get selected() {
    		return this.$$.ctx[1];
    	}

    	set selected(selected) {
    		this.$$set({ selected });
    		flush();
    	}

    	get colorSelect() {
    		return this.$$.ctx[37];
    	}

    	set colorSelect(colorSelect) {
    		this.$$set({ colorSelect });
    		flush();
    	}

    	get highlighted() {
    		return this.$$.ctx[38];
    	}

    	set highlighted(highlighted) {
    		this.$$set({ highlighted });
    		flush();
    	}

    	get colorHighlight() {
    		return this.$$.ctx[39];
    	}

    	set colorHighlight(colorHighlight) {
    		this.$$set({ colorHighlight });
    		flush();
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Column.svelte generated by Svelte v3.43.1 */
    const file$h = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Column.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    function get_each_context_1$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[38] = list[i];
    	child_ctx[40] = i;
    	return child_ctx;
    }

    // (47:0) {#if $coords}
    function create_if_block$b(ctx) {
    	let g;
    	let each_value = /*$coords*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "column-group");
    			add_location(g, file$h, 47, 0, 1176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$coords, mode, $yScale, markerWidth, $data, idKey, hovered, colorHover, selected, colorSelect, colorHighlight, highlighted, lineWidth, overlayFill, $config, $zGet, $zRange, doHover, doSelect*/ 66848767) {
    				each_value = /*$coords*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(47:0) {#if $coords}",
    		ctx
    	});

    	return block;
    }

    // (50:3) {#each group as d, j}
    function create_each_block_1$4(ctx) {
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_height_value;
    	let rect_width_value;
    	let rect_stroke_value;
    	let rect_stroke_width_value;
    	let rect_fill_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[29](/*i*/ ctx[37], /*j*/ ctx[40], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[31](/*i*/ ctx[37], /*j*/ ctx[40], ...args);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[33](/*i*/ ctx[37], /*j*/ ctx[40], ...args);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "class", "column-rect");
    			attr_dev(rect, "data-id", /*j*/ ctx[40]);
    			attr_dev(rect, "x", rect_x_value = /*d*/ ctx[38].x);

    			attr_dev(rect, "y", rect_y_value = /*mode*/ ctx[4] == 'barcode' || /*mode*/ ctx[4] == 'comparison' && /*i*/ ctx[37] > 0
    			? /*$yScale*/ ctx[6](/*d*/ ctx[38].y) - /*markerWidth*/ ctx[23] / 2
    			: /*$yScale*/ ctx[6](/*d*/ ctx[38].y));

    			attr_dev(rect, "height", rect_height_value = (/*mode*/ ctx[4] == 'barcode' || /*mode*/ ctx[4] == 'comparison' && /*i*/ ctx[37] > 0) && /*$yScale*/ ctx[6](0) - /*$yScale*/ ctx[6](/*d*/ ctx[38].h) < /*markerWidth*/ ctx[23]
    			? /*markerWidth*/ ctx[23]
    			: /*$yScale*/ ctx[6](0) - /*$yScale*/ ctx[6](/*d*/ ctx[38].h));

    			attr_dev(rect, "width", rect_width_value = /*d*/ ctx[38].w * 1.4);

    			attr_dev(rect, "stroke", rect_stroke_value = /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*hovered*/ ctx[0]
    			? /*colorHover*/ ctx[19]
    			: /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*selected*/ ctx[1]
    				? /*colorSelect*/ ctx[20]
    				: /*colorHighlight*/ ctx[21]);

    			attr_dev(rect, "stroke-width", rect_stroke_width_value = /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*hovered*/ ctx[0] || /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*selected*/ ctx[1] || /*highlighted*/ ctx[2].includes(/*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]])
    			? /*lineWidth*/ ctx[22]
    			: 0);

    			attr_dev(rect, "fill", rect_fill_value = /*overlayFill*/ ctx[3] && /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*selected*/ ctx[1]
    			? /*colorSelect*/ ctx[20]
    			: /*overlayFill*/ ctx[3] && /*highlighted*/ ctx[2].includes(/*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]])
    				? /*colorHighlight*/ ctx[21]
    				: /*$config*/ ctx[8].z
    					? /*$zGet*/ ctx[9](/*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]])
    					: /*$zRange*/ ctx[10][0]);

    			add_location(rect, file$h, 50, 3, 1258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(rect, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(rect, "mouseleave", /*mouseleave_handler*/ ctx[30], false, false, false),
    					listen_dev(rect, "focus", focus_handler, false, false, false),
    					listen_dev(rect, "blur", /*blur_handler*/ ctx[32], false, false, false),
    					listen_dev(rect, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$coords*/ 32 && rect_x_value !== (rect_x_value = /*d*/ ctx[38].x)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty[0] & /*mode, $yScale, $coords*/ 112 && rect_y_value !== (rect_y_value = /*mode*/ ctx[4] == 'barcode' || /*mode*/ ctx[4] == 'comparison' && /*i*/ ctx[37] > 0
    			? /*$yScale*/ ctx[6](/*d*/ ctx[38].y) - /*markerWidth*/ ctx[23] / 2
    			: /*$yScale*/ ctx[6](/*d*/ ctx[38].y))) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty[0] & /*mode, $yScale, $coords*/ 112 && rect_height_value !== (rect_height_value = (/*mode*/ ctx[4] == 'barcode' || /*mode*/ ctx[4] == 'comparison' && /*i*/ ctx[37] > 0) && /*$yScale*/ ctx[6](0) - /*$yScale*/ ctx[6](/*d*/ ctx[38].h) < /*markerWidth*/ ctx[23]
    			? /*markerWidth*/ ctx[23]
    			: /*$yScale*/ ctx[6](0) - /*$yScale*/ ctx[6](/*d*/ ctx[38].h))) {
    				attr_dev(rect, "height", rect_height_value);
    			}

    			if (dirty[0] & /*$coords*/ 32 && rect_width_value !== (rect_width_value = /*d*/ ctx[38].w * 1.4)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty[0] & /*$data, hovered, selected*/ 131 && rect_stroke_value !== (rect_stroke_value = /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*hovered*/ ctx[0]
    			? /*colorHover*/ ctx[19]
    			: /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*selected*/ ctx[1]
    				? /*colorSelect*/ ctx[20]
    				: /*colorHighlight*/ ctx[21])) {
    				attr_dev(rect, "stroke", rect_stroke_value);
    			}

    			if (dirty[0] & /*$data, hovered, selected, highlighted*/ 135 && rect_stroke_width_value !== (rect_stroke_width_value = /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*hovered*/ ctx[0] || /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*selected*/ ctx[1] || /*highlighted*/ ctx[2].includes(/*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]])
    			? /*lineWidth*/ ctx[22]
    			: 0)) {
    				attr_dev(rect, "stroke-width", rect_stroke_width_value);
    			}

    			if (dirty[0] & /*overlayFill, $data, selected, highlighted, $config, $zGet, $zRange*/ 1934 && rect_fill_value !== (rect_fill_value = /*overlayFill*/ ctx[3] && /*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]] == /*selected*/ ctx[1]
    			? /*colorSelect*/ ctx[20]
    			: /*overlayFill*/ ctx[3] && /*highlighted*/ ctx[2].includes(/*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]][/*idKey*/ ctx[18]])
    				? /*colorHighlight*/ ctx[21]
    				: /*$config*/ ctx[8].z
    					? /*$zGet*/ ctx[9](/*$data*/ ctx[7][/*i*/ ctx[37]][/*j*/ ctx[40]])
    					: /*$zRange*/ ctx[10][0])) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$4.name,
    		type: "each",
    		source: "(50:3) {#each group as d, j}",
    		ctx
    	});

    	return block;
    }

    // (49:1) {#each $coords as group, i}
    function create_each_block$a(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*group*/ ctx[35];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$4(get_each_context_1$4(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$coords, mode, $yScale, markerWidth, $data, idKey, hovered, colorHover, selected, colorSelect, colorHighlight, highlighted, lineWidth, overlayFill, $config, $zGet, $zRange, doHover, doSelect*/ 66848767) {
    				each_value_1 = /*group*/ ctx[35];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$4(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(49:1) {#each $coords as group, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let if_block_anchor;
    	let if_block = /*$coords*/ ctx[5] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*$coords*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let mode;
    	let $custom;
    	let $coords;
    	let $yScale;
    	let $data;
    	let $config;
    	let $zGet;
    	let $zRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Column', slots, []);
    	const { data, yScale, zGet, zRange, config, custom } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(7, $data = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(6, $yScale = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(9, $zGet = value));
    	validate_store(zRange, 'zRange');
    	component_subscribe($$self, zRange, value => $$invalidate(10, $zRange = value));
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(8, $config = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(28, $custom = value));
    	const dispatch = createEventDispatcher();
    	let { hover = false } = $$props;
    	let { hovered = null } = $$props;
    	let { select = false } = $$props;
    	let { selected = null } = $$props;
    	let { highlighted = [] } = $$props;
    	let { overlayFill = false } = $$props;
    	let coords = $custom.coords;
    	validate_store(coords, 'coords');
    	component_subscribe($$self, coords, value => $$invalidate(5, $coords = value));
    	let idKey = $custom.idKey;
    	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
    	let colorSelect = $custom.colorSelect ? $custom.colorSelect : 'black';

    	let colorHighlight = $custom.colorHighlight
    	? $custom.colorHighlight
    	: 'black';

    	let lineWidth = $custom.lineWidth ? $custom.lineWidth : 2;
    	let markerWidth = $custom.markerWidth ? $custom.markerWidth : 2.5;

    	function doHover(e, d) {
    		if (hover) {
    			$$invalidate(0, hovered = d ? d[idKey] : null);
    			dispatch('hover', { id: hovered, data: d, event: e });
    		}
    	}

    	function doSelect(e, d) {
    		if (select) {
    			$$invalidate(1, selected = d ? d[idKey] : null);
    			dispatch('select', { id: selected, data: d, event: e });
    		}
    	}

    	const writable_props = ['hover', 'hovered', 'select', 'selected', 'highlighted', 'overlayFill'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Column> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (i, j, e) => doHover(e, $data[i][j]);
    	const mouseleave_handler = e => doHover(e, null);
    	const focus_handler = (i, j, e) => doHover(e, $data[i][j]);
    	const blur_handler = e => doHover(e, null);
    	const click_handler = (i, j, e) => doSelect(e, $data[i][j]);

    	$$self.$$set = $$props => {
    		if ('hover' in $$props) $$invalidate(26, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('select' in $$props) $$invalidate(27, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('overlayFill' in $$props) $$invalidate(3, overlayFill = $$props.overlayFill);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		data,
    		yScale,
    		zGet,
    		zRange,
    		config,
    		custom,
    		dispatch,
    		hover,
    		hovered,
    		select,
    		selected,
    		highlighted,
    		overlayFill,
    		coords,
    		idKey,
    		colorHover,
    		colorSelect,
    		colorHighlight,
    		lineWidth,
    		markerWidth,
    		doHover,
    		doSelect,
    		mode,
    		$custom,
    		$coords,
    		$yScale,
    		$data,
    		$config,
    		$zGet,
    		$zRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('hover' in $$props) $$invalidate(26, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('select' in $$props) $$invalidate(27, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('overlayFill' in $$props) $$invalidate(3, overlayFill = $$props.overlayFill);
    		if ('coords' in $$props) $$invalidate(17, coords = $$props.coords);
    		if ('idKey' in $$props) $$invalidate(18, idKey = $$props.idKey);
    		if ('colorHover' in $$props) $$invalidate(19, colorHover = $$props.colorHover);
    		if ('colorSelect' in $$props) $$invalidate(20, colorSelect = $$props.colorSelect);
    		if ('colorHighlight' in $$props) $$invalidate(21, colorHighlight = $$props.colorHighlight);
    		if ('lineWidth' in $$props) $$invalidate(22, lineWidth = $$props.lineWidth);
    		if ('markerWidth' in $$props) $$invalidate(23, markerWidth = $$props.markerWidth);
    		if ('mode' in $$props) $$invalidate(4, mode = $$props.mode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$custom*/ 268435456) {
    			$$invalidate(4, mode = $custom.mode ? $custom.mode : 'default');
    		}
    	};

    	return [
    		hovered,
    		selected,
    		highlighted,
    		overlayFill,
    		mode,
    		$coords,
    		$yScale,
    		$data,
    		$config,
    		$zGet,
    		$zRange,
    		data,
    		yScale,
    		zGet,
    		zRange,
    		config,
    		custom,
    		coords,
    		idKey,
    		colorHover,
    		colorSelect,
    		colorHighlight,
    		lineWidth,
    		markerWidth,
    		doHover,
    		doSelect,
    		hover,
    		select,
    		$custom,
    		mouseover_handler,
    		mouseleave_handler,
    		focus_handler,
    		blur_handler,
    		click_handler
    	];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				hover: 26,
    				hovered: 0,
    				select: 27,
    				selected: 1,
    				highlighted: 2,
    				overlayFill: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get hover() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hovered() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hovered(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overlayFill() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overlayFill(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/ColumnChart.svelte generated by Svelte v3.43.1 */
    const file$g = "node_modules/@onsvisual/svelte-charts/src/charts/ColumnChart.svelte";
    const get_front_slot_changes$1 = dirty => ({});
    const get_front_slot_context$1 = ctx => ({});
    const get_svg_slot_changes$1 = dirty => ({});
    const get_svg_slot_context$1 = ctx => ({});
    const get_back_slot_changes$1 = dirty => ({});
    const get_back_slot_context$1 = ctx => ({});
    const get_options_slot_changes$1 = dirty => ({});
    const get_options_slot_context$1 = ctx => ({});

    // (96:0) {#if title}
    function create_if_block_5$4(ctx) {
    	let title_1;
    	let current;

    	title_1 = new Title({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(title_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(title_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const title_1_changes = {};

    			if (dirty[0] & /*title*/ 8192 | dirty[1] & /*$$scope*/ 65536) {
    				title_1_changes.$$scope = { dirty, ctx };
    			}

    			title_1.$set(title_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(title_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$4.name,
    		type: "if",
    		source: "(96:0) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (97:2) <Title>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[13]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 8192) set_data_dev(t, /*title*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(97:2) <Title>",
    		ctx
    	});

    	return block;
    }

    // (129:3) {#if width > 80}
    function create_if_block_2$6(ctx) {
    	let setcoords;
    	let t0;
    	let t1;
    	let svg;
    	let t2;
    	let current;
    	setcoords = new SetCoords({ $$inline: true });
    	const back_slot_template = /*#slots*/ ctx[44].back;
    	const back_slot = create_slot(back_slot_template, ctx, /*$$scope*/ ctx[47], get_back_slot_context$1);

    	svg = new Svg({
    			props: {
    				pointerEvents: /*interactive*/ ctx[20],
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const front_slot_template = /*#slots*/ ctx[44].front;
    	const front_slot = create_slot(front_slot_template, ctx, /*$$scope*/ ctx[47], get_front_slot_context$1);

    	const block = {
    		c: function create() {
    			create_component(setcoords.$$.fragment);
    			t0 = space();
    			if (back_slot) back_slot.c();
    			t1 = space();
    			create_component(svg.$$.fragment);
    			t2 = space();
    			if (front_slot) front_slot.c();
    		},
    		m: function mount(target, anchor) {
    			mount_component(setcoords, target, anchor);
    			insert_dev(target, t0, anchor);

    			if (back_slot) {
    				back_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(svg, target, anchor);
    			insert_dev(target, t2, anchor);

    			if (front_slot) {
    				front_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (back_slot) {
    				if (back_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						back_slot,
    						back_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(back_slot_template, /*$$scope*/ ctx[47], dirty, get_back_slot_changes$1),
    						get_back_slot_context$1
    					);
    				}
    			}

    			const svg_changes = {};
    			if (dirty[0] & /*interactive*/ 1048576) svg_changes.pointerEvents = /*interactive*/ ctx[20];

    			if (dirty[0] & /*select, selected, hover, hovered, highlighted, overlayFill, yTicks, yFormatTick, yPrefix, yAxis, xAxis*/ 1457528320 | dirty[1] & /*$$scope*/ 65536) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);

    			if (front_slot) {
    				if (front_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						front_slot,
    						front_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(front_slot_template, /*$$scope*/ ctx[47], dirty, get_front_slot_changes$1),
    						get_front_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setcoords.$$.fragment, local);
    			transition_in(back_slot, local);
    			transition_in(svg.$$.fragment, local);
    			transition_in(front_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setcoords.$$.fragment, local);
    			transition_out(back_slot, local);
    			transition_out(svg.$$.fragment, local);
    			transition_out(front_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setcoords, detaching);
    			if (detaching) detach_dev(t0);
    			if (back_slot) back_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t2);
    			if (front_slot) front_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(129:3) {#if width > 80}",
    		ctx
    	});

    	return block;
    }

    // (133:6) {#if xAxis}
    function create_if_block_4$4(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(133:6) {#if xAxis}",
    		ctx
    	});

    	return block;
    }

    // (136:6) {#if yAxis}
    function create_if_block_3$4(ctx) {
    	let axisy;
    	let current;

    	axisy = new AxisY$1({
    			props: {
    				ticks: /*yTicks*/ ctx[12],
    				formatTick: /*yFormatTick*/ ctx[9],
    				prefix: /*yPrefix*/ ctx[21],
    				suffix: "%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisy.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisy, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisy_changes = {};
    			if (dirty[0] & /*yTicks*/ 4096) axisy_changes.ticks = /*yTicks*/ ctx[12];
    			if (dirty[0] & /*yFormatTick*/ 512) axisy_changes.formatTick = /*yFormatTick*/ ctx[9];
    			if (dirty[0] & /*yPrefix*/ 2097152) axisy_changes.prefix = /*yPrefix*/ ctx[21];
    			axisy.$set(axisy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisy, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(136:6) {#if yAxis}",
    		ctx
    	});

    	return block;
    }

    // (132:2) <Svg pointerEvents={interactive}>
    function create_default_slot_2$3(ctx) {
    	let t0;
    	let t1;
    	let column;
    	let t2;
    	let current;
    	let if_block0 = /*xAxis*/ ctx[10] && create_if_block_4$4(ctx);
    	let if_block1 = /*yAxis*/ ctx[11] && create_if_block_3$4(ctx);

    	column = new Column({
    			props: {
    				select: /*select*/ ctx[25],
    				selected: /*selected*/ ctx[26],
    				hover: /*hover*/ ctx[22],
    				hovered: /*hovered*/ ctx[23],
    				highlighted: /*highlighted*/ ctx[28],
    				overlayFill: /*overlayFill*/ ctx[30]
    			},
    			$$inline: true
    		});

    	column.$on("hover", /*hover_handler*/ ctx[45]);
    	column.$on("select", /*select_handler*/ ctx[46]);
    	const svg_slot_template = /*#slots*/ ctx[44].svg;
    	const svg_slot = create_slot(svg_slot_template, ctx, /*$$scope*/ ctx[47], get_svg_slot_context$1);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(column.$$.fragment);
    			t2 = space();
    			if (svg_slot) svg_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(column, target, anchor);
    			insert_dev(target, t2, anchor);

    			if (svg_slot) {
    				svg_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*xAxis*/ ctx[10]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4$4(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*yAxis*/ ctx[11]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*yAxis*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const column_changes = {};
    			if (dirty[0] & /*select*/ 33554432) column_changes.select = /*select*/ ctx[25];
    			if (dirty[0] & /*selected*/ 67108864) column_changes.selected = /*selected*/ ctx[26];
    			if (dirty[0] & /*hover*/ 4194304) column_changes.hover = /*hover*/ ctx[22];
    			if (dirty[0] & /*hovered*/ 8388608) column_changes.hovered = /*hovered*/ ctx[23];
    			if (dirty[0] & /*highlighted*/ 268435456) column_changes.highlighted = /*highlighted*/ ctx[28];
    			if (dirty[0] & /*overlayFill*/ 1073741824) column_changes.overlayFill = /*overlayFill*/ ctx[30];
    			column.$set(column_changes);

    			if (svg_slot) {
    				if (svg_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						svg_slot,
    						svg_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(svg_slot_template, /*$$scope*/ ctx[47], dirty, get_svg_slot_changes$1),
    						get_svg_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(column.$$.fragment, local);
    			transition_in(svg_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(column.$$.fragment, local);
    			transition_out(svg_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(column, detaching);
    			if (detaching) detach_dev(t2);
    			if (svg_slot) svg_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(132:2) <Svg pointerEvents={interactive}>",
    		ctx
    	});

    	return block;
    }

    // (101:1) <LayerCake   {padding}   x={xKey}   y={yKey}   z={zKey}   {xDomain}   yDomain={$yDomain}   {zDomain}   xScale={scaleBand()}   yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}   zScale={scaleOrdinal()}   zRange={colors}   data={groupedData}   flatData={data}   custom={{    type: 'column',    mode,    idKey,       coords,    markerWidth,    colorSelect,    colorHover,    colorHighlight,       animation,       duration     }}   let:width  >
    function create_default_slot_1$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*width*/ ctx[54] > 80 && create_if_block_2$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*width*/ ctx[54] > 80) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[1] & /*width*/ 8388608) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(101:1) <LayerCake   {padding}   x={xKey}   y={yKey}   z={zKey}   {xDomain}   yDomain={$yDomain}   {zDomain}   xScale={scaleBand()}   yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}   zScale={scaleOrdinal()}   zRange={colors}   data={groupedData}   flatData={data}   custom={{    type: 'column',    mode,    idKey,       coords,    markerWidth,    colorSelect,    colorHover,    colorHighlight,       animation,       duration     }}   let:width  >",
    		ctx
    	});

    	return block;
    }

    // (146:0) {#if legend && zDomain}
    function create_if_block_1$7(ctx) {
    	let legend_1;
    	let current;

    	legend_1 = new Legend$1({
    			props: {
    				domain: /*zDomain*/ ctx[31],
    				colors: /*colors*/ ctx[18],
    				markerWidth: /*markerWidth*/ ctx[19],
    				line: /*mode*/ ctx[16] == 'barcode',
    				comparison: /*mode*/ ctx[16] == 'comparison'
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(legend_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(legend_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const legend_1_changes = {};
    			if (dirty[1] & /*zDomain*/ 1) legend_1_changes.domain = /*zDomain*/ ctx[31];
    			if (dirty[0] & /*colors*/ 262144) legend_1_changes.colors = /*colors*/ ctx[18];
    			if (dirty[0] & /*markerWidth*/ 524288) legend_1_changes.markerWidth = /*markerWidth*/ ctx[19];
    			if (dirty[0] & /*mode*/ 65536) legend_1_changes.line = /*mode*/ ctx[16] == 'barcode';
    			if (dirty[0] & /*mode*/ 65536) legend_1_changes.comparison = /*mode*/ ctx[16] == 'comparison';
    			legend_1.$set(legend_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legend_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legend_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(legend_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(146:0) {#if legend && zDomain}",
    		ctx
    	});

    	return block;
    }

    // (149:0) {#if footer}
    function create_if_block$a(ctx) {
    	let footer_1;
    	let current;

    	footer_1 = new Footer({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(footer_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const footer_1_changes = {};

    			if (dirty[0] & /*footer*/ 16384 | dirty[1] & /*$$scope*/ 65536) {
    				footer_1_changes.$$scope = { dirty, ctx };
    			}

    			footer_1.$set(footer_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(149:0) {#if footer}",
    		ctx
    	});

    	return block;
    }

    // (150:2) <Footer>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*footer*/ ctx[14]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*footer*/ 16384) set_data_dev(t, /*footer*/ ctx[14]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(150:2) <Footer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let layercake;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*title*/ ctx[13] && create_if_block_5$4(ctx);
    	const options_slot_template = /*#slots*/ ctx[44].options;
    	const options_slot = create_slot(options_slot_template, ctx, /*$$scope*/ ctx[47], get_options_slot_context$1);

    	layercake = new LayerCake({
    			props: {
    				padding: /*padding*/ ctx[17],
    				x: /*xKey*/ ctx[4],
    				y: /*yKey*/ ctx[5],
    				z: /*zKey*/ ctx[6],
    				xDomain: /*xDomain*/ ctx[33],
    				yDomain: /*$yDomain*/ ctx[34],
    				zDomain: /*zDomain*/ ctx[31],
    				xScale: band(),
    				yScale: /*yScale*/ ctx[8] == 'log'
    				? symlog()
    				: linear(),
    				zScale: ordinal(),
    				zRange: /*colors*/ ctx[18],
    				data: /*groupedData*/ ctx[32],
    				flatData: /*data*/ ctx[0],
    				custom: {
    					type: 'column',
    					mode: /*mode*/ ctx[16],
    					idKey: /*idKey*/ ctx[7],
    					coords: /*coords*/ ctx[35],
    					markerWidth: /*markerWidth*/ ctx[19],
    					colorSelect: /*colorSelect*/ ctx[27],
    					colorHover: /*colorHover*/ ctx[24],
    					colorHighlight: /*colorHighlight*/ ctx[29],
    					animation: /*animation*/ ctx[2],
    					duration: /*duration*/ ctx[3]
    				},
    				$$slots: {
    					default: [
    						create_default_slot_1$3,
    						({ width }) => ({ 54: width }),
    						({ width }) => [0, width ? 8388608 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*legend*/ ctx[15] && /*zDomain*/ ctx[31] && create_if_block_1$7(ctx);
    	let if_block2 = /*footer*/ ctx[14] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (options_slot) options_slot.c();
    			t1 = space();
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div, "class", "chart-container svelte-1dnlmiu");

    			set_style(div, "height", typeof /*height*/ ctx[1] == 'number'
    			? /*height*/ ctx[1] + 'px'
    			: /*height*/ ctx[1]);

    			add_location(div, file$g, 99, 0, 3436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			if (options_slot) {
    				options_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[13]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 8192) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (options_slot) {
    				if (options_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						options_slot,
    						options_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(options_slot_template, /*$$scope*/ ctx[47], dirty, get_options_slot_changes$1),
    						get_options_slot_context$1
    					);
    				}
    			}

    			const layercake_changes = {};
    			if (dirty[0] & /*padding*/ 131072) layercake_changes.padding = /*padding*/ ctx[17];
    			if (dirty[0] & /*xKey*/ 16) layercake_changes.x = /*xKey*/ ctx[4];
    			if (dirty[0] & /*yKey*/ 32) layercake_changes.y = /*yKey*/ ctx[5];
    			if (dirty[0] & /*zKey*/ 64) layercake_changes.z = /*zKey*/ ctx[6];
    			if (dirty[1] & /*xDomain*/ 4) layercake_changes.xDomain = /*xDomain*/ ctx[33];
    			if (dirty[1] & /*$yDomain*/ 8) layercake_changes.yDomain = /*$yDomain*/ ctx[34];
    			if (dirty[1] & /*zDomain*/ 1) layercake_changes.zDomain = /*zDomain*/ ctx[31];

    			if (dirty[0] & /*yScale*/ 256) layercake_changes.yScale = /*yScale*/ ctx[8] == 'log'
    			? symlog()
    			: linear();

    			if (dirty[0] & /*colors*/ 262144) layercake_changes.zRange = /*colors*/ ctx[18];
    			if (dirty[1] & /*groupedData*/ 2) layercake_changes.data = /*groupedData*/ ctx[32];
    			if (dirty[0] & /*data*/ 1) layercake_changes.flatData = /*data*/ ctx[0];

    			if (dirty[0] & /*mode, idKey, markerWidth, colorSelect, colorHover, colorHighlight, animation, duration*/ 688455820) layercake_changes.custom = {
    				type: 'column',
    				mode: /*mode*/ ctx[16],
    				idKey: /*idKey*/ ctx[7],
    				coords: /*coords*/ ctx[35],
    				markerWidth: /*markerWidth*/ ctx[19],
    				colorSelect: /*colorSelect*/ ctx[27],
    				colorHover: /*colorHover*/ ctx[24],
    				colorHighlight: /*colorHighlight*/ ctx[29],
    				animation: /*animation*/ ctx[2],
    				duration: /*duration*/ ctx[3]
    			};

    			if (dirty[0] & /*interactive, select, selected, hover, hovered, highlighted, overlayFill, yTicks, yFormatTick, yPrefix, yAxis, xAxis*/ 1458576896 | dirty[1] & /*$$scope, width*/ 8454144) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (!current || dirty[0] & /*height*/ 2) {
    				set_style(div, "height", typeof /*height*/ ctx[1] == 'number'
    				? /*height*/ ctx[1] + 'px'
    				: /*height*/ ctx[1]);
    			}

    			if (/*legend*/ ctx[15] && /*zDomain*/ ctx[31]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*legend*/ 32768 | dirty[1] & /*zDomain*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$7(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*footer*/ ctx[14]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*footer*/ 16384) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$a(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(options_slot, local);
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(options_slot, local);
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (options_slot) options_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let xDomain;
    	let zDomain;
    	let groupedData;
    	let $yDomain;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColumnChart', slots, ['options','back','svg','front']);
    	let { data } = $$props;
    	let { height = 250 } = $$props;
    	let { animation = true } = $$props;
    	let { duration = 800 } = $$props;
    	let { xKey = 'x' } = $$props;
    	let { yKey = 'y' } = $$props;
    	let { zKey = null } = $$props;
    	let { idKey = xKey } = $$props;
    	let { yScale = 'linear' } = $$props;
    	let { yFormatTick = d => d } = $$props;
    	let { yMax = null } = $$props;
    	let { yMin = 0 } = $$props;
    	let { xAxis = true } = $$props;
    	let { yAxis = true } = $$props;
    	let { yTicks = 4 } = $$props;
    	let { title = null } = $$props;
    	let { footer = null } = $$props;
    	let { legend = false } = $$props;
    	let { mode = 'default' } = $$props;
    	let { padding = { top: 0, bottom: 20, left: 35, right: 0 } } = $$props;
    	let { color = null } = $$props;

    	let { colors = color
    	? [color]
    	: [
    			'#206095',
    			'#27A0CC',
    			'#A8BD3A',
    			'#003C57',
    			'#118C7B',
    			'#F66068',
    			'#746CB1',
    			'#22D0B6',
    			'lightgrey'
    		] } = $$props;

    	let { markerWidth = 2.5 } = $$props;
    	let { spacing = 0.05 } = $$props; // proportion of bar width (1 = 100%)
    	let { interactive = true } = $$props;
    	let { xPrefix = "" } = $$props;
    	let { xSuffix = "" } = $$props;
    	let { yPrefix = "" } = $$props;
    	let { ySuffix = "" } = $$props;
    	let { hover = false } = $$props;
    	let { hovered = null } = $$props;
    	let { colorHover = 'orange' } = $$props;
    	let { select = false } = $$props;
    	let { selected = null } = $$props;
    	let { colorSelect = 'black' } = $$props;
    	let { highlighted = [] } = $$props;
    	let { colorHighlight = 'black' } = $$props;
    	let { overlayFill = false } = $$props;
    	const tweenOptions = { duration, easing: cubicInOut };
    	const coords = tweened(undefined, tweenOptions);
    	const distinct = (d, i, arr) => arr.indexOf(d) == i;

    	function getTotals(data, keys) {
    		let arr = [];

    		keys.forEach(key => {
    			let vals = data.filter(d => d[xKey] == key).map(d => d[yKey]);
    			let sum = vals.reduce((a, b) => a + b, 0);
    			arr.push(sum);
    		});

    		return arr;
    	}

    	// Functions to animate yDomain
    	const yDomSet = (data, mode, yKey, yMax) => yMax
    	? [yMin, yMax]
    	: mode == 'stacked' && yKey
    		? [
    				yMin,
    				Math.max(...getTotals(data, data.map(d => d[xKey]).filter(distinct)))
    			]
    		: [yMin, Math.max(...data.map(d => d[yKey]))];

    	function yDomUpdate(data, mode, yKey, yMax) {
    		let newYDom = yDomSet(data, mode, yKey, yMax);

    		if (newYDom[0] != yDom[0] || newYDom[1] != yDom[1]) {
    			yDomain.set(newYDom, { duration: animation ? duration : 0 });
    			yDom = newYDom;
    		}
    	}

    	let yDom = yDomSet(data, mode, yKey, yMax);
    	const yDomain = tweened(yDom, tweenOptions);
    	validate_store(yDomain, 'yDomain');
    	component_subscribe($$self, yDomain, value => $$invalidate(34, $yDomain = value));

    	const writable_props = [
    		'data',
    		'height',
    		'animation',
    		'duration',
    		'xKey',
    		'yKey',
    		'zKey',
    		'idKey',
    		'yScale',
    		'yFormatTick',
    		'yMax',
    		'yMin',
    		'xAxis',
    		'yAxis',
    		'yTicks',
    		'title',
    		'footer',
    		'legend',
    		'mode',
    		'padding',
    		'color',
    		'colors',
    		'markerWidth',
    		'spacing',
    		'interactive',
    		'xPrefix',
    		'xSuffix',
    		'yPrefix',
    		'ySuffix',
    		'hover',
    		'hovered',
    		'colorHover',
    		'select',
    		'selected',
    		'colorSelect',
    		'highlighted',
    		'colorHighlight',
    		'overlayFill'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColumnChart> was created with unknown prop '${key}'`);
    	});

    	function hover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('animation' in $$props) $$invalidate(2, animation = $$props.animation);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('xKey' in $$props) $$invalidate(4, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(5, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(6, zKey = $$props.zKey);
    		if ('idKey' in $$props) $$invalidate(7, idKey = $$props.idKey);
    		if ('yScale' in $$props) $$invalidate(8, yScale = $$props.yScale);
    		if ('yFormatTick' in $$props) $$invalidate(9, yFormatTick = $$props.yFormatTick);
    		if ('yMax' in $$props) $$invalidate(37, yMax = $$props.yMax);
    		if ('yMin' in $$props) $$invalidate(38, yMin = $$props.yMin);
    		if ('xAxis' in $$props) $$invalidate(10, xAxis = $$props.xAxis);
    		if ('yAxis' in $$props) $$invalidate(11, yAxis = $$props.yAxis);
    		if ('yTicks' in $$props) $$invalidate(12, yTicks = $$props.yTicks);
    		if ('title' in $$props) $$invalidate(13, title = $$props.title);
    		if ('footer' in $$props) $$invalidate(14, footer = $$props.footer);
    		if ('legend' in $$props) $$invalidate(15, legend = $$props.legend);
    		if ('mode' in $$props) $$invalidate(16, mode = $$props.mode);
    		if ('padding' in $$props) $$invalidate(17, padding = $$props.padding);
    		if ('color' in $$props) $$invalidate(39, color = $$props.color);
    		if ('colors' in $$props) $$invalidate(18, colors = $$props.colors);
    		if ('markerWidth' in $$props) $$invalidate(19, markerWidth = $$props.markerWidth);
    		if ('spacing' in $$props) $$invalidate(40, spacing = $$props.spacing);
    		if ('interactive' in $$props) $$invalidate(20, interactive = $$props.interactive);
    		if ('xPrefix' in $$props) $$invalidate(41, xPrefix = $$props.xPrefix);
    		if ('xSuffix' in $$props) $$invalidate(42, xSuffix = $$props.xSuffix);
    		if ('yPrefix' in $$props) $$invalidate(21, yPrefix = $$props.yPrefix);
    		if ('ySuffix' in $$props) $$invalidate(43, ySuffix = $$props.ySuffix);
    		if ('hover' in $$props) $$invalidate(22, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(23, hovered = $$props.hovered);
    		if ('colorHover' in $$props) $$invalidate(24, colorHover = $$props.colorHover);
    		if ('select' in $$props) $$invalidate(25, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(26, selected = $$props.selected);
    		if ('colorSelect' in $$props) $$invalidate(27, colorSelect = $$props.colorSelect);
    		if ('highlighted' in $$props) $$invalidate(28, highlighted = $$props.highlighted);
    		if ('colorHighlight' in $$props) $$invalidate(29, colorHighlight = $$props.colorHighlight);
    		if ('overlayFill' in $$props) $$invalidate(30, overlayFill = $$props.overlayFill);
    		if ('$$scope' in $$props) $$invalidate(47, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		scaleLinear: linear,
    		scaleSymlog: symlog,
    		tweened,
    		cubicInOut,
    		groupData,
    		stackData,
    		SetCoords,
    		Column,
    		AxisX: AxisX$1,
    		AxisY: AxisY$1,
    		Legend: Legend$1,
    		Title,
    		Footer,
    		data,
    		height,
    		animation,
    		duration,
    		xKey,
    		yKey,
    		zKey,
    		idKey,
    		yScale,
    		yFormatTick,
    		yMax,
    		yMin,
    		xAxis,
    		yAxis,
    		yTicks,
    		title,
    		footer,
    		legend,
    		mode,
    		padding,
    		color,
    		colors,
    		markerWidth,
    		spacing,
    		interactive,
    		xPrefix,
    		xSuffix,
    		yPrefix,
    		ySuffix,
    		hover,
    		hovered,
    		colorHover,
    		select,
    		selected,
    		colorSelect,
    		highlighted,
    		colorHighlight,
    		overlayFill,
    		tweenOptions,
    		coords,
    		distinct,
    		getTotals,
    		yDomSet,
    		yDomUpdate,
    		yDom,
    		yDomain,
    		zDomain,
    		groupedData,
    		xDomain,
    		$yDomain
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('animation' in $$props) $$invalidate(2, animation = $$props.animation);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('xKey' in $$props) $$invalidate(4, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(5, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(6, zKey = $$props.zKey);
    		if ('idKey' in $$props) $$invalidate(7, idKey = $$props.idKey);
    		if ('yScale' in $$props) $$invalidate(8, yScale = $$props.yScale);
    		if ('yFormatTick' in $$props) $$invalidate(9, yFormatTick = $$props.yFormatTick);
    		if ('yMax' in $$props) $$invalidate(37, yMax = $$props.yMax);
    		if ('yMin' in $$props) $$invalidate(38, yMin = $$props.yMin);
    		if ('xAxis' in $$props) $$invalidate(10, xAxis = $$props.xAxis);
    		if ('yAxis' in $$props) $$invalidate(11, yAxis = $$props.yAxis);
    		if ('yTicks' in $$props) $$invalidate(12, yTicks = $$props.yTicks);
    		if ('title' in $$props) $$invalidate(13, title = $$props.title);
    		if ('footer' in $$props) $$invalidate(14, footer = $$props.footer);
    		if ('legend' in $$props) $$invalidate(15, legend = $$props.legend);
    		if ('mode' in $$props) $$invalidate(16, mode = $$props.mode);
    		if ('padding' in $$props) $$invalidate(17, padding = $$props.padding);
    		if ('color' in $$props) $$invalidate(39, color = $$props.color);
    		if ('colors' in $$props) $$invalidate(18, colors = $$props.colors);
    		if ('markerWidth' in $$props) $$invalidate(19, markerWidth = $$props.markerWidth);
    		if ('spacing' in $$props) $$invalidate(40, spacing = $$props.spacing);
    		if ('interactive' in $$props) $$invalidate(20, interactive = $$props.interactive);
    		if ('xPrefix' in $$props) $$invalidate(41, xPrefix = $$props.xPrefix);
    		if ('xSuffix' in $$props) $$invalidate(42, xSuffix = $$props.xSuffix);
    		if ('yPrefix' in $$props) $$invalidate(21, yPrefix = $$props.yPrefix);
    		if ('ySuffix' in $$props) $$invalidate(43, ySuffix = $$props.ySuffix);
    		if ('hover' in $$props) $$invalidate(22, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(23, hovered = $$props.hovered);
    		if ('colorHover' in $$props) $$invalidate(24, colorHover = $$props.colorHover);
    		if ('select' in $$props) $$invalidate(25, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(26, selected = $$props.selected);
    		if ('colorSelect' in $$props) $$invalidate(27, colorSelect = $$props.colorSelect);
    		if ('highlighted' in $$props) $$invalidate(28, highlighted = $$props.highlighted);
    		if ('colorHighlight' in $$props) $$invalidate(29, colorHighlight = $$props.colorHighlight);
    		if ('overlayFill' in $$props) $$invalidate(30, overlayFill = $$props.overlayFill);
    		if ('yDom' in $$props) yDom = $$props.yDom;
    		if ('zDomain' in $$props) $$invalidate(31, zDomain = $$props.zDomain);
    		if ('groupedData' in $$props) $$invalidate(32, groupedData = $$props.groupedData);
    		if ('xDomain' in $$props) $$invalidate(33, xDomain = $$props.xDomain);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, mode, yKey*/ 65569 | $$self.$$.dirty[1] & /*yMax*/ 64) {
    			yDomUpdate(data, mode, yKey, yMax);
    		}

    		if ($$self.$$.dirty[0] & /*data, xKey*/ 17) {
    			// Functions to update xDomain & zDomain
    			$$invalidate(33, xDomain = data.map(d => d[xKey]).filter(distinct));
    		}

    		if ($$self.$$.dirty[0] & /*zKey, data*/ 65) {
    			$$invalidate(31, zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null);
    		}

    		if ($$self.$$.dirty[0] & /*mode, data, yKey, zKey*/ 65633 | $$self.$$.dirty[1] & /*zDomain*/ 1) {
    			// Create a data series for each zKey (group)
    			$$invalidate(32, groupedData = mode == 'stacked'
    			? stackData(data, zDomain, yKey, zKey)
    			: groupData(data, zDomain, zKey));
    		}
    	};

    	return [
    		data,
    		height,
    		animation,
    		duration,
    		xKey,
    		yKey,
    		zKey,
    		idKey,
    		yScale,
    		yFormatTick,
    		xAxis,
    		yAxis,
    		yTicks,
    		title,
    		footer,
    		legend,
    		mode,
    		padding,
    		colors,
    		markerWidth,
    		interactive,
    		yPrefix,
    		hover,
    		hovered,
    		colorHover,
    		select,
    		selected,
    		colorSelect,
    		highlighted,
    		colorHighlight,
    		overlayFill,
    		zDomain,
    		groupedData,
    		xDomain,
    		$yDomain,
    		coords,
    		yDomain,
    		yMax,
    		yMin,
    		color,
    		spacing,
    		xPrefix,
    		xSuffix,
    		ySuffix,
    		slots,
    		hover_handler,
    		select_handler,
    		$$scope
    	];
    }

    class ColumnChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$i,
    			create_fragment$i,
    			safe_not_equal,
    			{
    				data: 0,
    				height: 1,
    				animation: 2,
    				duration: 3,
    				xKey: 4,
    				yKey: 5,
    				zKey: 6,
    				idKey: 7,
    				yScale: 8,
    				yFormatTick: 9,
    				yMax: 37,
    				yMin: 38,
    				xAxis: 10,
    				yAxis: 11,
    				yTicks: 12,
    				title: 13,
    				footer: 14,
    				legend: 15,
    				mode: 16,
    				padding: 17,
    				color: 39,
    				colors: 18,
    				markerWidth: 19,
    				spacing: 40,
    				interactive: 20,
    				xPrefix: 41,
    				xSuffix: 42,
    				yPrefix: 21,
    				ySuffix: 43,
    				hover: 22,
    				hovered: 23,
    				colorHover: 24,
    				select: 25,
    				selected: 26,
    				colorSelect: 27,
    				highlighted: 28,
    				colorHighlight: 29,
    				overlayFill: 30
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColumnChart",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<ColumnChart> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		return this.$$.ctx[0];
    	}

    	set data(data) {
    		this.$$set({ data });
    		flush();
    	}

    	get height() {
    		return this.$$.ctx[1];
    	}

    	set height(height) {
    		this.$$set({ height });
    		flush();
    	}

    	get animation() {
    		return this.$$.ctx[2];
    	}

    	set animation(animation) {
    		this.$$set({ animation });
    		flush();
    	}

    	get duration() {
    		return this.$$.ctx[3];
    	}

    	set duration(duration) {
    		this.$$set({ duration });
    		flush();
    	}

    	get xKey() {
    		return this.$$.ctx[4];
    	}

    	set xKey(xKey) {
    		this.$$set({ xKey });
    		flush();
    	}

    	get yKey() {
    		return this.$$.ctx[5];
    	}

    	set yKey(yKey) {
    		this.$$set({ yKey });
    		flush();
    	}

    	get zKey() {
    		return this.$$.ctx[6];
    	}

    	set zKey(zKey) {
    		this.$$set({ zKey });
    		flush();
    	}

    	get idKey() {
    		return this.$$.ctx[7];
    	}

    	set idKey(idKey) {
    		this.$$set({ idKey });
    		flush();
    	}

    	get yScale() {
    		return this.$$.ctx[8];
    	}

    	set yScale(yScale) {
    		this.$$set({ yScale });
    		flush();
    	}

    	get yFormatTick() {
    		return this.$$.ctx[9];
    	}

    	set yFormatTick(yFormatTick) {
    		this.$$set({ yFormatTick });
    		flush();
    	}

    	get yMax() {
    		return this.$$.ctx[37];
    	}

    	set yMax(yMax) {
    		this.$$set({ yMax });
    		flush();
    	}

    	get yMin() {
    		return this.$$.ctx[38];
    	}

    	set yMin(yMin) {
    		this.$$set({ yMin });
    		flush();
    	}

    	get xAxis() {
    		return this.$$.ctx[10];
    	}

    	set xAxis(xAxis) {
    		this.$$set({ xAxis });
    		flush();
    	}

    	get yAxis() {
    		return this.$$.ctx[11];
    	}

    	set yAxis(yAxis) {
    		this.$$set({ yAxis });
    		flush();
    	}

    	get yTicks() {
    		return this.$$.ctx[12];
    	}

    	set yTicks(yTicks) {
    		this.$$set({ yTicks });
    		flush();
    	}

    	get title() {
    		return this.$$.ctx[13];
    	}

    	set title(title) {
    		this.$$set({ title });
    		flush();
    	}

    	get footer() {
    		return this.$$.ctx[14];
    	}

    	set footer(footer) {
    		this.$$set({ footer });
    		flush();
    	}

    	get legend() {
    		return this.$$.ctx[15];
    	}

    	set legend(legend) {
    		this.$$set({ legend });
    		flush();
    	}

    	get mode() {
    		return this.$$.ctx[16];
    	}

    	set mode(mode) {
    		this.$$set({ mode });
    		flush();
    	}

    	get padding() {
    		return this.$$.ctx[17];
    	}

    	set padding(padding) {
    		this.$$set({ padding });
    		flush();
    	}

    	get color() {
    		return this.$$.ctx[39];
    	}

    	set color(color) {
    		this.$$set({ color });
    		flush();
    	}

    	get colors() {
    		return this.$$.ctx[18];
    	}

    	set colors(colors) {
    		this.$$set({ colors });
    		flush();
    	}

    	get markerWidth() {
    		return this.$$.ctx[19];
    	}

    	set markerWidth(markerWidth) {
    		this.$$set({ markerWidth });
    		flush();
    	}

    	get spacing() {
    		return this.$$.ctx[40];
    	}

    	set spacing(spacing) {
    		this.$$set({ spacing });
    		flush();
    	}

    	get interactive() {
    		return this.$$.ctx[20];
    	}

    	set interactive(interactive) {
    		this.$$set({ interactive });
    		flush();
    	}

    	get xPrefix() {
    		return this.$$.ctx[41];
    	}

    	set xPrefix(xPrefix) {
    		this.$$set({ xPrefix });
    		flush();
    	}

    	get xSuffix() {
    		return this.$$.ctx[42];
    	}

    	set xSuffix(xSuffix) {
    		this.$$set({ xSuffix });
    		flush();
    	}

    	get yPrefix() {
    		return this.$$.ctx[21];
    	}

    	set yPrefix(yPrefix) {
    		this.$$set({ yPrefix });
    		flush();
    	}

    	get ySuffix() {
    		return this.$$.ctx[43];
    	}

    	set ySuffix(ySuffix) {
    		this.$$set({ ySuffix });
    		flush();
    	}

    	get hover() {
    		return this.$$.ctx[22];
    	}

    	set hover(hover) {
    		this.$$set({ hover });
    		flush();
    	}

    	get hovered() {
    		return this.$$.ctx[23];
    	}

    	set hovered(hovered) {
    		this.$$set({ hovered });
    		flush();
    	}

    	get colorHover() {
    		return this.$$.ctx[24];
    	}

    	set colorHover(colorHover) {
    		this.$$set({ colorHover });
    		flush();
    	}

    	get select() {
    		return this.$$.ctx[25];
    	}

    	set select(select) {
    		this.$$set({ select });
    		flush();
    	}

    	get selected() {
    		return this.$$.ctx[26];
    	}

    	set selected(selected) {
    		this.$$set({ selected });
    		flush();
    	}

    	get colorSelect() {
    		return this.$$.ctx[27];
    	}

    	set colorSelect(colorSelect) {
    		this.$$set({ colorSelect });
    		flush();
    	}

    	get highlighted() {
    		return this.$$.ctx[28];
    	}

    	set highlighted(highlighted) {
    		this.$$set({ highlighted });
    		flush();
    	}

    	get colorHighlight() {
    		return this.$$.ctx[29];
    	}

    	set colorHighlight(colorHighlight) {
    		this.$$set({ colorHighlight });
    		flush();
    	}

    	get overlayFill() {
    		return this.$$.ctx[30];
    	}

    	set overlayFill(overlayFill) {
    		this.$$set({ overlayFill });
    		flush();
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Scatter.svg.svelte generated by Svelte v3.43.1 */
    const file$f = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Scatter.svg.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	child_ctx[27] = i;
    	return child_ctx;
    }

    // (20:0) {#if $coords}
    function create_if_block$9(ctx) {
    	let g;
    	let each_1_anchor;
    	let each_value_1 = /*$coords*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	let if_block = /*idKey*/ ctx[19] && (/*hovered*/ ctx[0] || /*selected*/ ctx[1] || /*highlighted*/ ctx[2][0]) && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(g, "class", "scatter-group");
    			add_location(g, file$f, 20, 0, 621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, each_1_anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xScale, $coords, $yScale, $z, $zGet, $data, $zRange*/ 2032) {
    				each_value_1 = /*$coords*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*idKey*/ ctx[19] && (/*hovered*/ ctx[0] || /*selected*/ ctx[1] || /*highlighted*/ ctx[2][0])) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$6(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(20:0) {#if $coords}",
    		ctx
    	});

    	return block;
    }

    // (22:1) {#each $coords as d, i}
    function create_each_block_1$3(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let circle_fill_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "");
    			attr_dev(circle, "cx", circle_cx_value = /*$xScale*/ ctx[5](/*d*/ ctx[25].x));
    			attr_dev(circle, "cy", circle_cy_value = /*$yScale*/ ctx[6](/*d*/ ctx[25].y));
    			attr_dev(circle, "r", circle_r_value = /*d*/ ctx[25].r);

    			attr_dev(circle, "fill", circle_fill_value = /*$z*/ ctx[7]
    			? /*$zGet*/ ctx[8](/*$data*/ ctx[9][/*i*/ ctx[27]])
    			: /*$zRange*/ ctx[10][0]);

    			add_location(circle, file$f, 22, 2, 674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xScale, $coords*/ 48 && circle_cx_value !== (circle_cx_value = /*$xScale*/ ctx[5](/*d*/ ctx[25].x))) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*$yScale, $coords*/ 80 && circle_cy_value !== (circle_cy_value = /*$yScale*/ ctx[6](/*d*/ ctx[25].y))) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*$coords*/ 16 && circle_r_value !== (circle_r_value = /*d*/ ctx[25].r)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*$z, $zGet, $data, $zRange*/ 1920 && circle_fill_value !== (circle_fill_value = /*$z*/ ctx[7]
    			? /*$zGet*/ ctx[8](/*$data*/ ctx[9][/*i*/ ctx[27]])
    			: /*$zRange*/ ctx[10][0])) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(22:1) {#each $coords as d, i}",
    		ctx
    	});

    	return block;
    }

    // (32:1) {#if idKey && (hovered || selected || highlighted[0])}
    function create_if_block_1$6(ctx) {
    	let each_1_anchor;
    	let each_value = /*$coords*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xScale, $coords, $yScale, overlayFill, $data, idKey, selected, colorSelect, highlighted, colorHighlight, hovered, colorHover, lineWidth*/ 16253567) {
    				each_value = /*$coords*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(32:1) {#if idKey && (hovered || selected || highlighted[0])}",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if [hovered, selected, ...highlighted].includes($data[i][idKey])}
    function create_if_block_2$5(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let circle_fill_value;
    	let circle_stroke_value;
    	let circle_stroke_width_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "");
    			attr_dev(circle, "cx", circle_cx_value = /*$xScale*/ ctx[5](/*d*/ ctx[25].x));
    			attr_dev(circle, "cy", circle_cy_value = /*$yScale*/ ctx[6](/*d*/ ctx[25].y));
    			attr_dev(circle, "r", circle_r_value = /*d*/ ctx[25].r);

    			attr_dev(circle, "fill", circle_fill_value = /*overlayFill*/ ctx[3] && /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*selected*/ ctx[1]
    			? /*colorSelect*/ ctx[21]
    			: /*overlayFill*/ ctx[3] & /*highlighted*/ ctx[2].includes(/*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]])
    				? /*colorHighlight*/ ctx[22]
    				: 'none');

    			attr_dev(circle, "stroke", circle_stroke_value = /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*hovered*/ ctx[0]
    			? /*colorHover*/ ctx[20]
    			: /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*selected*/ ctx[1]
    				? /*colorSelect*/ ctx[21]
    				: /*colorHighlight*/ ctx[22]);

    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*hovered*/ ctx[0] || /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*selected*/ ctx[1] || /*highlighted*/ ctx[2].includes(/*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]])
    			? /*lineWidth*/ ctx[23]
    			: 0);

    			add_location(circle, file$f, 34, 2, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xScale, $coords*/ 48 && circle_cx_value !== (circle_cx_value = /*$xScale*/ ctx[5](/*d*/ ctx[25].x))) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*$yScale, $coords*/ 80 && circle_cy_value !== (circle_cy_value = /*$yScale*/ ctx[6](/*d*/ ctx[25].y))) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*$coords*/ 16 && circle_r_value !== (circle_r_value = /*d*/ ctx[25].r)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*overlayFill, $data, selected, highlighted*/ 526 && circle_fill_value !== (circle_fill_value = /*overlayFill*/ ctx[3] && /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*selected*/ ctx[1]
    			? /*colorSelect*/ ctx[21]
    			: /*overlayFill*/ ctx[3] & /*highlighted*/ ctx[2].includes(/*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]])
    				? /*colorHighlight*/ ctx[22]
    				: 'none')) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if (dirty & /*$data, hovered, selected*/ 515 && circle_stroke_value !== (circle_stroke_value = /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*hovered*/ ctx[0]
    			? /*colorHover*/ ctx[20]
    			: /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*selected*/ ctx[1]
    				? /*colorSelect*/ ctx[21]
    				: /*colorHighlight*/ ctx[22])) {
    				attr_dev(circle, "stroke", circle_stroke_value);
    			}

    			if (dirty & /*$data, hovered, selected, highlighted*/ 519 && circle_stroke_width_value !== (circle_stroke_width_value = /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*hovered*/ ctx[0] || /*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]] == /*selected*/ ctx[1] || /*highlighted*/ ctx[2].includes(/*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]])
    			? /*lineWidth*/ ctx[23]
    			: 0)) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(34:2) {#if [hovered, selected, ...highlighted].includes($data[i][idKey])}",
    		ctx
    	});

    	return block;
    }

    // (33:1) {#each $coords as d, i}
    function create_each_block$9(ctx) {
    	let show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1], .../*highlighted*/ ctx[2]].includes(/*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hovered, selected, highlighted, $data*/ 519) show_if = [/*hovered*/ ctx[0], /*selected*/ ctx[1], .../*highlighted*/ ctx[2]].includes(/*$data*/ ctx[9][/*i*/ ctx[27]][/*idKey*/ ctx[19]]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$5(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(33:1) {#each $coords as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let if_block = /*$coords*/ ctx[4] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$coords*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $custom;
    	let $coords;
    	let $xScale;
    	let $yScale;
    	let $z;
    	let $zGet;
    	let $data;
    	let $zRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scatter_svg', slots, []);
    	const { data, z, xScale, yScale, zGet, zRange, custom } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(9, $data = value));
    	validate_store(z, 'z');
    	component_subscribe($$self, z, value => $$invalidate(7, $z = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(5, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(6, $yScale = value));
    	validate_store(zGet, 'zGet');
    	component_subscribe($$self, zGet, value => $$invalidate(8, $zGet = value));
    	validate_store(zRange, 'zRange');
    	component_subscribe($$self, zRange, value => $$invalidate(10, $zRange = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(24, $custom = value));
    	let { hovered = null } = $$props;
    	let { selected = null } = $$props;
    	let { highlighted = [] } = $$props;
    	let { overlayFill = false } = $$props;
    	let coords = $custom.coords;
    	validate_store(coords, 'coords');
    	component_subscribe($$self, coords, value => $$invalidate(4, $coords = value));
    	let idKey = $custom.idKey;
    	let colorHover = $custom.colorHover ? $custom.colorHover : 'orange';
    	let colorSelect = $custom.colorSelect ? $custom.colorSelect : 'black';

    	let colorHighlight = $custom.colorHighlight
    	? $custom.colorHighlight
    	: 'black';

    	let lineWidth = $custom.lineWidth ? $custom.lineWidth : 2;
    	const writable_props = ['hovered', 'selected', 'highlighted', 'overlayFill'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scatter_svg> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('overlayFill' in $$props) $$invalidate(3, overlayFill = $$props.overlayFill);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		data,
    		z,
    		xScale,
    		yScale,
    		zGet,
    		zRange,
    		custom,
    		hovered,
    		selected,
    		highlighted,
    		overlayFill,
    		coords,
    		idKey,
    		colorHover,
    		colorSelect,
    		colorHighlight,
    		lineWidth,
    		$custom,
    		$coords,
    		$xScale,
    		$yScale,
    		$z,
    		$zGet,
    		$data,
    		$zRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('overlayFill' in $$props) $$invalidate(3, overlayFill = $$props.overlayFill);
    		if ('coords' in $$props) $$invalidate(18, coords = $$props.coords);
    		if ('idKey' in $$props) $$invalidate(19, idKey = $$props.idKey);
    		if ('colorHover' in $$props) $$invalidate(20, colorHover = $$props.colorHover);
    		if ('colorSelect' in $$props) $$invalidate(21, colorSelect = $$props.colorSelect);
    		if ('colorHighlight' in $$props) $$invalidate(22, colorHighlight = $$props.colorHighlight);
    		if ('lineWidth' in $$props) $$invalidate(23, lineWidth = $$props.lineWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hovered,
    		selected,
    		highlighted,
    		overlayFill,
    		$coords,
    		$xScale,
    		$yScale,
    		$z,
    		$zGet,
    		$data,
    		$zRange,
    		data,
    		z,
    		xScale,
    		yScale,
    		zGet,
    		zRange,
    		custom,
    		coords,
    		idKey,
    		colorHover,
    		colorSelect,
    		colorHighlight,
    		lineWidth
    	];
    }

    class Scatter_svg extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			hovered: 0,
    			selected: 1,
    			highlighted: 2,
    			overlayFill: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scatter_svg",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get hovered() {
    		throw new Error("<Scatter_svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hovered(value) {
    		throw new Error("<Scatter_svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Scatter_svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Scatter_svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<Scatter_svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<Scatter_svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overlayFill() {
    		throw new Error("<Scatter_svg>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overlayFill(value) {
    		throw new Error("<Scatter_svg>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const epsilon$1 = 1.1102230246251565e-16;
    const splitter = 134217729;
    const resulterrbound = (3 + 8 * epsilon$1) * epsilon$1;

    // fast_expansion_sum_zeroelim routine from oritinal code
    function sum(elen, e, flen, f, h) {
        let Q, Qnew, hh, bvirt;
        let enow = e[0];
        let fnow = f[0];
        let eindex = 0;
        let findex = 0;
        if ((fnow > enow) === (fnow > -enow)) {
            Q = enow;
            enow = e[++eindex];
        } else {
            Q = fnow;
            fnow = f[++findex];
        }
        let hindex = 0;
        if (eindex < elen && findex < flen) {
            if ((fnow > enow) === (fnow > -enow)) {
                Qnew = enow + Q;
                hh = Q - (Qnew - enow);
                enow = e[++eindex];
            } else {
                Qnew = fnow + Q;
                hh = Q - (Qnew - fnow);
                fnow = f[++findex];
            }
            Q = Qnew;
            if (hh !== 0) {
                h[hindex++] = hh;
            }
            while (eindex < elen && findex < flen) {
                if ((fnow > enow) === (fnow > -enow)) {
                    Qnew = Q + enow;
                    bvirt = Qnew - Q;
                    hh = Q - (Qnew - bvirt) + (enow - bvirt);
                    enow = e[++eindex];
                } else {
                    Qnew = Q + fnow;
                    bvirt = Qnew - Q;
                    hh = Q - (Qnew - bvirt) + (fnow - bvirt);
                    fnow = f[++findex];
                }
                Q = Qnew;
                if (hh !== 0) {
                    h[hindex++] = hh;
                }
            }
        }
        while (eindex < elen) {
            Qnew = Q + enow;
            bvirt = Qnew - Q;
            hh = Q - (Qnew - bvirt) + (enow - bvirt);
            enow = e[++eindex];
            Q = Qnew;
            if (hh !== 0) {
                h[hindex++] = hh;
            }
        }
        while (findex < flen) {
            Qnew = Q + fnow;
            bvirt = Qnew - Q;
            hh = Q - (Qnew - bvirt) + (fnow - bvirt);
            fnow = f[++findex];
            Q = Qnew;
            if (hh !== 0) {
                h[hindex++] = hh;
            }
        }
        if (Q !== 0 || hindex === 0) {
            h[hindex++] = Q;
        }
        return hindex;
    }

    function estimate(elen, e) {
        let Q = e[0];
        for (let i = 1; i < elen; i++) Q += e[i];
        return Q;
    }

    function vec(n) {
        return new Float64Array(n);
    }

    const ccwerrboundA = (3 + 16 * epsilon$1) * epsilon$1;
    const ccwerrboundB = (2 + 12 * epsilon$1) * epsilon$1;
    const ccwerrboundC = (9 + 64 * epsilon$1) * epsilon$1 * epsilon$1;

    const B = vec(4);
    const C1 = vec(8);
    const C2 = vec(12);
    const D = vec(16);
    const u = vec(4);

    function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
        let acxtail, acytail, bcxtail, bcytail;
        let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

        const acx = ax - cx;
        const bcx = bx - cx;
        const acy = ay - cy;
        const bcy = by - cy;

        s1 = acx * bcy;
        c = splitter * acx;
        ahi = c - (c - acx);
        alo = acx - ahi;
        c = splitter * bcy;
        bhi = c - (c - bcy);
        blo = bcy - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acy * bcx;
        c = splitter * acy;
        ahi = c - (c - acy);
        alo = acy - ahi;
        c = splitter * bcx;
        bhi = c - (c - bcx);
        blo = bcx - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        B[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        B[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        B[2] = _j - (u3 - bvirt) + (_i - bvirt);
        B[3] = u3;

        let det = estimate(4, B);
        let errbound = ccwerrboundB * detsum;
        if (det >= errbound || -det >= errbound) {
            return det;
        }

        bvirt = ax - acx;
        acxtail = ax - (acx + bvirt) + (bvirt - cx);
        bvirt = bx - bcx;
        bcxtail = bx - (bcx + bvirt) + (bvirt - cx);
        bvirt = ay - acy;
        acytail = ay - (acy + bvirt) + (bvirt - cy);
        bvirt = by - bcy;
        bcytail = by - (bcy + bvirt) + (bvirt - cy);

        if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
            return det;
        }

        errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
        det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
        if (det >= errbound || -det >= errbound) return det;

        s1 = acxtail * bcy;
        c = splitter * acxtail;
        ahi = c - (c - acxtail);
        alo = acxtail - ahi;
        c = splitter * bcy;
        bhi = c - (c - bcy);
        blo = bcy - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acytail * bcx;
        c = splitter * acytail;
        ahi = c - (c - acytail);
        alo = acytail - ahi;
        c = splitter * bcx;
        bhi = c - (c - bcx);
        blo = bcx - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        u[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        u[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        u[2] = _j - (u3 - bvirt) + (_i - bvirt);
        u[3] = u3;
        const C1len = sum(4, B, 4, u, C1);

        s1 = acx * bcytail;
        c = splitter * acx;
        ahi = c - (c - acx);
        alo = acx - ahi;
        c = splitter * bcytail;
        bhi = c - (c - bcytail);
        blo = bcytail - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acy * bcxtail;
        c = splitter * acy;
        ahi = c - (c - acy);
        alo = acy - ahi;
        c = splitter * bcxtail;
        bhi = c - (c - bcxtail);
        blo = bcxtail - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        u[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        u[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        u[2] = _j - (u3 - bvirt) + (_i - bvirt);
        u[3] = u3;
        const C2len = sum(C1len, C1, 4, u, C2);

        s1 = acxtail * bcytail;
        c = splitter * acxtail;
        ahi = c - (c - acxtail);
        alo = acxtail - ahi;
        c = splitter * bcytail;
        bhi = c - (c - bcytail);
        blo = bcytail - bhi;
        s0 = alo * blo - (s1 - ahi * bhi - alo * bhi - ahi * blo);
        t1 = acytail * bcxtail;
        c = splitter * acytail;
        ahi = c - (c - acytail);
        alo = acytail - ahi;
        c = splitter * bcxtail;
        bhi = c - (c - bcxtail);
        blo = bcxtail - bhi;
        t0 = alo * blo - (t1 - ahi * bhi - alo * bhi - ahi * blo);
        _i = s0 - t0;
        bvirt = s0 - _i;
        u[0] = s0 - (_i + bvirt) + (bvirt - t0);
        _j = s1 + _i;
        bvirt = _j - s1;
        _0 = s1 - (_j - bvirt) + (_i - bvirt);
        _i = _0 - t1;
        bvirt = _0 - _i;
        u[1] = _0 - (_i + bvirt) + (bvirt - t1);
        u3 = _j + _i;
        bvirt = u3 - _j;
        u[2] = _j - (u3 - bvirt) + (_i - bvirt);
        u[3] = u3;
        const Dlen = sum(C2len, C2, 4, u, D);

        return D[Dlen - 1];
    }

    function orient2d(ax, ay, bx, by, cx, cy) {
        const detleft = (ay - cy) * (bx - cx);
        const detright = (ax - cx) * (by - cy);
        const det = detleft - detright;

        if (detleft === 0 || detright === 0 || (detleft > 0) !== (detright > 0)) return det;

        const detsum = Math.abs(detleft + detright);
        if (Math.abs(det) >= ccwerrboundA * detsum) return det;

        return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
    }

    const EPSILON = Math.pow(2, -52);
    const EDGE_STACK = new Uint32Array(512);

    class Delaunator {

        static from(points, getX = defaultGetX, getY = defaultGetY) {
            const n = points.length;
            const coords = new Float64Array(n * 2);

            for (let i = 0; i < n; i++) {
                const p = points[i];
                coords[2 * i] = getX(p);
                coords[2 * i + 1] = getY(p);
            }

            return new Delaunator(coords);
        }

        constructor(coords) {
            const n = coords.length >> 1;
            if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');

            this.coords = coords;

            // arrays that will store the triangulation graph
            const maxTriangles = Math.max(2 * n - 5, 0);
            this._triangles = new Uint32Array(maxTriangles * 3);
            this._halfedges = new Int32Array(maxTriangles * 3);

            // temporary arrays for tracking the edges of the advancing convex hull
            this._hashSize = Math.ceil(Math.sqrt(n));
            this._hullPrev = new Uint32Array(n); // edge to prev edge
            this._hullNext = new Uint32Array(n); // edge to next edge
            this._hullTri = new Uint32Array(n); // edge to adjacent triangle
            this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash

            // temporary arrays for sorting points
            this._ids = new Uint32Array(n);
            this._dists = new Float64Array(n);

            this.update();
        }

        update() {
            const {coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash} =  this;
            const n = coords.length >> 1;

            // populate an array of point indices; calculate input data bbox
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            for (let i = 0; i < n; i++) {
                const x = coords[2 * i];
                const y = coords[2 * i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
                this._ids[i] = i;
            }
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;

            let minDist = Infinity;
            let i0, i1, i2;

            // pick a seed point close to the center
            for (let i = 0; i < n; i++) {
                const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
                if (d < minDist) {
                    i0 = i;
                    minDist = d;
                }
            }
            const i0x = coords[2 * i0];
            const i0y = coords[2 * i0 + 1];

            minDist = Infinity;

            // find the point closest to the seed
            for (let i = 0; i < n; i++) {
                if (i === i0) continue;
                const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
                if (d < minDist && d > 0) {
                    i1 = i;
                    minDist = d;
                }
            }
            let i1x = coords[2 * i1];
            let i1y = coords[2 * i1 + 1];

            let minRadius = Infinity;

            // find the third point which forms the smallest circumcircle with the first two
            for (let i = 0; i < n; i++) {
                if (i === i0 || i === i1) continue;
                const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
                if (r < minRadius) {
                    i2 = i;
                    minRadius = r;
                }
            }
            let i2x = coords[2 * i2];
            let i2y = coords[2 * i2 + 1];

            if (minRadius === Infinity) {
                // order collinear points by dx (or dy if all x are identical)
                // and return the list as a hull
                for (let i = 0; i < n; i++) {
                    this._dists[i] = (coords[2 * i] - coords[0]) || (coords[2 * i + 1] - coords[1]);
                }
                quicksort(this._ids, this._dists, 0, n - 1);
                const hull = new Uint32Array(n);
                let j = 0;
                for (let i = 0, d0 = -Infinity; i < n; i++) {
                    const id = this._ids[i];
                    if (this._dists[id] > d0) {
                        hull[j++] = id;
                        d0 = this._dists[id];
                    }
                }
                this.hull = hull.subarray(0, j);
                this.triangles = new Uint32Array(0);
                this.halfedges = new Uint32Array(0);
                return;
            }

            // swap the order of the seed points for counter-clockwise orientation
            if (orient2d(i0x, i0y, i1x, i1y, i2x, i2y) < 0) {
                const i = i1;
                const x = i1x;
                const y = i1y;
                i1 = i2;
                i1x = i2x;
                i1y = i2y;
                i2 = i;
                i2x = x;
                i2y = y;
            }

            const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
            this._cx = center.x;
            this._cy = center.y;

            for (let i = 0; i < n; i++) {
                this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
            }

            // sort the points by distance from the seed triangle circumcenter
            quicksort(this._ids, this._dists, 0, n - 1);

            // set up the seed triangle as the starting hull
            this._hullStart = i0;
            let hullSize = 3;

            hullNext[i0] = hullPrev[i2] = i1;
            hullNext[i1] = hullPrev[i0] = i2;
            hullNext[i2] = hullPrev[i1] = i0;

            hullTri[i0] = 0;
            hullTri[i1] = 1;
            hullTri[i2] = 2;

            hullHash.fill(-1);
            hullHash[this._hashKey(i0x, i0y)] = i0;
            hullHash[this._hashKey(i1x, i1y)] = i1;
            hullHash[this._hashKey(i2x, i2y)] = i2;

            this.trianglesLen = 0;
            this._addTriangle(i0, i1, i2, -1, -1, -1);

            for (let k = 0, xp, yp; k < this._ids.length; k++) {
                const i = this._ids[k];
                const x = coords[2 * i];
                const y = coords[2 * i + 1];

                // skip near-duplicate points
                if (k > 0 && Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
                xp = x;
                yp = y;

                // skip seed triangle points
                if (i === i0 || i === i1 || i === i2) continue;

                // find a visible edge on the convex hull using edge hash
                let start = 0;
                for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
                    start = hullHash[(key + j) % this._hashSize];
                    if (start !== -1 && start !== hullNext[start]) break;
                }

                start = hullPrev[start];
                let e = start, q;
                while (q = hullNext[e], orient2d(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1]) >= 0) {
                    e = q;
                    if (e === start) {
                        e = -1;
                        break;
                    }
                }
                if (e === -1) continue; // likely a near-duplicate point; skip it

                // add the first triangle from the point
                let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);

                // recursively flip triangles from the point until they satisfy the Delaunay condition
                hullTri[i] = this._legalize(t + 2);
                hullTri[e] = t; // keep track of boundary triangles on the hull
                hullSize++;

                // walk forward through the hull, adding more triangles and flipping recursively
                let n = hullNext[e];
                while (q = hullNext[n], orient2d(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1]) < 0) {
                    t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
                    hullTri[i] = this._legalize(t + 2);
                    hullNext[n] = n; // mark as removed
                    hullSize--;
                    n = q;
                }

                // walk backward from the other side, adding more triangles and flipping
                if (e === start) {
                    while (q = hullPrev[e], orient2d(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1]) < 0) {
                        t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
                        this._legalize(t + 2);
                        hullTri[q] = t;
                        hullNext[e] = e; // mark as removed
                        hullSize--;
                        e = q;
                    }
                }

                // update the hull indices
                this._hullStart = hullPrev[i] = e;
                hullNext[e] = hullPrev[n] = i;
                hullNext[i] = n;

                // save the two new edges in the hash table
                hullHash[this._hashKey(x, y)] = i;
                hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
            }

            this.hull = new Uint32Array(hullSize);
            for (let i = 0, e = this._hullStart; i < hullSize; i++) {
                this.hull[i] = e;
                e = hullNext[e];
            }

            // trim typed triangle mesh arrays
            this.triangles = this._triangles.subarray(0, this.trianglesLen);
            this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
        }

        _hashKey(x, y) {
            return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
        }

        _legalize(a) {
            const {_triangles: triangles, _halfedges: halfedges, coords} = this;

            let i = 0;
            let ar = 0;

            // recursion eliminated with a fixed-size stack
            while (true) {
                const b = halfedges[a];

                /* if the pair of triangles doesn't satisfy the Delaunay condition
                 * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
                 * then do the same check/flip recursively for the new pair of triangles
                 *
                 *           pl                    pl
                 *          /||\                  /  \
                 *       al/ || \bl            al/    \a
                 *        /  ||  \              /      \
                 *       /  a||b  \    flip    /___ar___\
                 *     p0\   ||   /p1   =>   p0\---bl---/p1
                 *        \  ||  /              \      /
                 *       ar\ || /br             b\    /br
                 *          \||/                  \  /
                 *           pr                    pr
                 */
                const a0 = a - a % 3;
                ar = a0 + (a + 2) % 3;

                if (b === -1) { // convex hull edge
                    if (i === 0) break;
                    a = EDGE_STACK[--i];
                    continue;
                }

                const b0 = b - b % 3;
                const al = a0 + (a + 1) % 3;
                const bl = b0 + (b + 2) % 3;

                const p0 = triangles[ar];
                const pr = triangles[a];
                const pl = triangles[al];
                const p1 = triangles[bl];

                const illegal = inCircle(
                    coords[2 * p0], coords[2 * p0 + 1],
                    coords[2 * pr], coords[2 * pr + 1],
                    coords[2 * pl], coords[2 * pl + 1],
                    coords[2 * p1], coords[2 * p1 + 1]);

                if (illegal) {
                    triangles[a] = p1;
                    triangles[b] = p0;

                    const hbl = halfedges[bl];

                    // edge swapped on the other side of the hull (rare); fix the halfedge reference
                    if (hbl === -1) {
                        let e = this._hullStart;
                        do {
                            if (this._hullTri[e] === bl) {
                                this._hullTri[e] = a;
                                break;
                            }
                            e = this._hullPrev[e];
                        } while (e !== this._hullStart);
                    }
                    this._link(a, hbl);
                    this._link(b, halfedges[ar]);
                    this._link(ar, bl);

                    const br = b0 + (b + 1) % 3;

                    // don't worry about hitting the cap: it can only happen on extremely degenerate input
                    if (i < EDGE_STACK.length) {
                        EDGE_STACK[i++] = br;
                    }
                } else {
                    if (i === 0) break;
                    a = EDGE_STACK[--i];
                }
            }

            return ar;
        }

        _link(a, b) {
            this._halfedges[a] = b;
            if (b !== -1) this._halfedges[b] = a;
        }

        // add a new triangle given vertex indices and adjacent half-edge ids
        _addTriangle(i0, i1, i2, a, b, c) {
            const t = this.trianglesLen;

            this._triangles[t] = i0;
            this._triangles[t + 1] = i1;
            this._triangles[t + 2] = i2;

            this._link(t, a);
            this._link(t + 1, b);
            this._link(t + 2, c);

            this.trianglesLen += 3;

            return t;
        }
    }

    // monotonically increases with real angle, but doesn't need expensive trigonometry
    function pseudoAngle(dx, dy) {
        const p = dx / (Math.abs(dx) + Math.abs(dy));
        return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
    }

    function dist(ax, ay, bx, by) {
        const dx = ax - bx;
        const dy = ay - by;
        return dx * dx + dy * dy;
    }

    function inCircle(ax, ay, bx, by, cx, cy, px, py) {
        const dx = ax - px;
        const dy = ay - py;
        const ex = bx - px;
        const ey = by - py;
        const fx = cx - px;
        const fy = cy - py;

        const ap = dx * dx + dy * dy;
        const bp = ex * ex + ey * ey;
        const cp = fx * fx + fy * fy;

        return dx * (ey * cp - bp * fy) -
               dy * (ex * cp - bp * fx) +
               ap * (ex * fy - ey * fx) < 0;
    }

    function circumradius(ax, ay, bx, by, cx, cy) {
        const dx = bx - ax;
        const dy = by - ay;
        const ex = cx - ax;
        const ey = cy - ay;

        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        const d = 0.5 / (dx * ey - dy * ex);

        const x = (ey * bl - dy * cl) * d;
        const y = (dx * cl - ex * bl) * d;

        return x * x + y * y;
    }

    function circumcenter(ax, ay, bx, by, cx, cy) {
        const dx = bx - ax;
        const dy = by - ay;
        const ex = cx - ax;
        const ey = cy - ay;

        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        const d = 0.5 / (dx * ey - dy * ex);

        const x = ax + (ey * bl - dy * cl) * d;
        const y = ay + (dx * cl - ex * bl) * d;

        return {x, y};
    }

    function quicksort(ids, dists, left, right) {
        if (right - left <= 20) {
            for (let i = left + 1; i <= right; i++) {
                const temp = ids[i];
                const tempDist = dists[temp];
                let j = i - 1;
                while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];
                ids[j + 1] = temp;
            }
        } else {
            const median = (left + right) >> 1;
            let i = left + 1;
            let j = right;
            swap(ids, median, i);
            if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
            if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
            if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);

            const temp = ids[i];
            const tempDist = dists[temp];
            while (true) {
                do i++; while (dists[ids[i]] < tempDist);
                do j--; while (dists[ids[j]] > tempDist);
                if (j < i) break;
                swap(ids, i, j);
            }
            ids[left + 1] = ids[j];
            ids[j] = temp;

            if (right - i + 1 >= j - left) {
                quicksort(ids, dists, i, right);
                quicksort(ids, dists, left, j - 1);
            } else {
                quicksort(ids, dists, left, j - 1);
                quicksort(ids, dists, i, right);
            }
        }
    }

    function swap(arr, i, j) {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function defaultGetX(p) {
        return p[0];
    }
    function defaultGetY(p) {
        return p[1];
    }

    const epsilon = 1e-6;

    class Path {
      constructor() {
        this._x0 = this._y0 = // start of current subpath
        this._x1 = this._y1 = null; // end of current subpath
        this._ = "";
      }
      moveTo(x, y) {
        this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
      }
      closePath() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      }
      lineTo(x, y) {
        this._ += `L${this._x1 = +x},${this._y1 = +y}`;
      }
      arc(x, y, r) {
        x = +x, y = +y, r = +r;
        const x0 = x + r;
        const y0 = y;
        if (r < 0) throw new Error("negative radius");
        if (this._x1 === null) this._ += `M${x0},${y0}`;
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) this._ += "L" + x0 + "," + y0;
        if (!r) return;
        this._ += `A${r},${r},0,1,1,${x - r},${y}A${r},${r},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
      }
      rect(x, y, w, h) {
        this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${+w}v${+h}h${-w}Z`;
      }
      value() {
        return this._ || null;
      }
    }

    class Polygon {
      constructor() {
        this._ = [];
      }
      moveTo(x, y) {
        this._.push([x, y]);
      }
      closePath() {
        this._.push(this._[0].slice());
      }
      lineTo(x, y) {
        this._.push([x, y]);
      }
      value() {
        return this._.length ? this._ : null;
      }
    }

    class Voronoi$1 {
      constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
        if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
        this.delaunay = delaunay;
        this._circumcenters = new Float64Array(delaunay.points.length * 2);
        this.vectors = new Float64Array(delaunay.points.length * 2);
        this.xmax = xmax, this.xmin = xmin;
        this.ymax = ymax, this.ymin = ymin;
        this._init();
      }
      update() {
        this.delaunay.update();
        this._init();
        return this;
      }
      _init() {
        const {delaunay: {points, hull, triangles}, vectors} = this;

        // Compute circumcenters.
        const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
        for (let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2) {
          const t1 = triangles[i] * 2;
          const t2 = triangles[i + 1] * 2;
          const t3 = triangles[i + 2] * 2;
          const x1 = points[t1];
          const y1 = points[t1 + 1];
          const x2 = points[t2];
          const y2 = points[t2 + 1];
          const x3 = points[t3];
          const y3 = points[t3 + 1];

          const dx = x2 - x1;
          const dy = y2 - y1;
          const ex = x3 - x1;
          const ey = y3 - y1;
          const ab = (dx * ey - dy * ex) * 2;

          if (Math.abs(ab) < 1e-9) {
            // degenerate case (collinear diagram)
            // almost equal points (degenerate triangle)
            // the circumcenter is at the infinity, in a
            // direction that is:
            // 1. orthogonal to the halfedge.
            let a = 1e9;
            // 2. points away from the center; since the list of triangles starts
            // in the center, the first point of the first triangle
            // will be our reference
            const r = triangles[0] * 2;
            a *= Math.sign((points[r] - x1) * ey - (points[r + 1] - y1) * ex);
            x = (x1 + x3) / 2 - a * ey;
            y = (y1 + y3) / 2 + a * ex;
          } else {
            const d = 1 / ab;
            const bl = dx * dx + dy * dy;
            const cl = ex * ex + ey * ey;
            x = x1 + (ey * bl - dy * cl) * d;
            y = y1 + (dx * cl - ex * bl) * d;
          }
          circumcenters[j] = x;
          circumcenters[j + 1] = y;
        }

        // Compute exterior cell rays.
        let h = hull[hull.length - 1];
        let p0, p1 = h * 4;
        let x0, x1 = points[2 * h];
        let y0, y1 = points[2 * h + 1];
        vectors.fill(0);
        for (let i = 0; i < hull.length; ++i) {
          h = hull[i];
          p0 = p1, x0 = x1, y0 = y1;
          p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
          vectors[p0 + 2] = vectors[p1] = y0 - y1;
          vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
        }
      }
      render(context) {
        const buffer = context == null ? context = new Path : undefined;
        const {delaunay: {halfedges, inedges, hull}, circumcenters, vectors} = this;
        if (hull.length <= 1) return null;
        for (let i = 0, n = halfedges.length; i < n; ++i) {
          const j = halfedges[i];
          if (j < i) continue;
          const ti = Math.floor(i / 3) * 2;
          const tj = Math.floor(j / 3) * 2;
          const xi = circumcenters[ti];
          const yi = circumcenters[ti + 1];
          const xj = circumcenters[tj];
          const yj = circumcenters[tj + 1];
          this._renderSegment(xi, yi, xj, yj, context);
        }
        let h0, h1 = hull[hull.length - 1];
        for (let i = 0; i < hull.length; ++i) {
          h0 = h1, h1 = hull[i];
          const t = Math.floor(inedges[h1] / 3) * 2;
          const x = circumcenters[t];
          const y = circumcenters[t + 1];
          const v = h0 * 4;
          const p = this._project(x, y, vectors[v + 2], vectors[v + 3]);
          if (p) this._renderSegment(x, y, p[0], p[1], context);
        }
        return buffer && buffer.value();
      }
      renderBounds(context) {
        const buffer = context == null ? context = new Path : undefined;
        context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
        return buffer && buffer.value();
      }
      renderCell(i, context) {
        const buffer = context == null ? context = new Path : undefined;
        const points = this._clip(i);
        if (points === null || !points.length) return;
        context.moveTo(points[0], points[1]);
        let n = points.length;
        while (points[0] === points[n-2] && points[1] === points[n-1] && n > 1) n -= 2;
        for (let i = 2; i < n; i += 2) {
          if (points[i] !== points[i-2] || points[i+1] !== points[i-1])
            context.lineTo(points[i], points[i + 1]);
        }
        context.closePath();
        return buffer && buffer.value();
      }
      *cellPolygons() {
        const {delaunay: {points}} = this;
        for (let i = 0, n = points.length / 2; i < n; ++i) {
          const cell = this.cellPolygon(i);
          if (cell) cell.index = i, yield cell;
        }
      }
      cellPolygon(i) {
        const polygon = new Polygon;
        this.renderCell(i, polygon);
        return polygon.value();
      }
      _renderSegment(x0, y0, x1, y1, context) {
        let S;
        const c0 = this._regioncode(x0, y0);
        const c1 = this._regioncode(x1, y1);
        if (c0 === 0 && c1 === 0) {
          context.moveTo(x0, y0);
          context.lineTo(x1, y1);
        } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
          context.moveTo(S[0], S[1]);
          context.lineTo(S[2], S[3]);
        }
      }
      contains(i, x, y) {
        if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
        return this.delaunay._step(i, x, y) === i;
      }
      *neighbors(i) {
        const ci = this._clip(i);
        if (ci) for (const j of this.delaunay.neighbors(i)) {
          const cj = this._clip(j);
          // find the common edge
          if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
            for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
              if (ci[ai] == cj[aj]
              && ci[ai + 1] == cj[aj + 1]
              && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj]
              && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj]
              ) {
                yield j;
                break loop;
              }
            }
          }
        }
      }
      _cell(i) {
        const {circumcenters, delaunay: {inedges, halfedges, triangles}} = this;
        const e0 = inedges[i];
        if (e0 === -1) return null; // coincident point
        const points = [];
        let e = e0;
        do {
          const t = Math.floor(e / 3);
          points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
          e = e % 3 === 2 ? e - 2 : e + 1;
          if (triangles[e] !== i) break; // bad triangulation
          e = halfedges[e];
        } while (e !== e0 && e !== -1);
        return points;
      }
      _clip(i) {
        // degenerate case (1 valid point: return the box)
        if (i === 0 && this.delaunay.hull.length === 1) {
          return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        const points = this._cell(i);
        if (points === null) return null;
        const {vectors: V} = this;
        const v = i * 4;
        return V[v] || V[v + 1]
            ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3])
            : this._clipFinite(i, points);
      }
      _clipFinite(i, points) {
        const n = points.length;
        let P = null;
        let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
        let c0, c1 = this._regioncode(x1, y1);
        let e0, e1 = 0;
        for (let j = 0; j < n; j += 2) {
          x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
          c0 = c1, c1 = this._regioncode(x1, y1);
          if (c0 === 0 && c1 === 0) {
            e0 = e1, e1 = 0;
            if (P) P.push(x1, y1);
            else P = [x1, y1];
          } else {
            let S, sx0, sy0, sx1, sy1;
            if (c0 === 0) {
              if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
              [sx0, sy0, sx1, sy1] = S;
            } else {
              if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
              [sx1, sy1, sx0, sy0] = S;
              e0 = e1, e1 = this._edgecode(sx0, sy0);
              if (e0 && e1) this._edge(i, e0, e1, P, P.length);
              if (P) P.push(sx0, sy0);
              else P = [sx0, sy0];
            }
            e0 = e1, e1 = this._edgecode(sx1, sy1);
            if (e0 && e1) this._edge(i, e0, e1, P, P.length);
            if (P) P.push(sx1, sy1);
            else P = [sx1, sy1];
          }
        }
        if (P) {
          e0 = e1, e1 = this._edgecode(P[0], P[1]);
          if (e0 && e1) this._edge(i, e0, e1, P, P.length);
        } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
          return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        return P;
      }
      _clipSegment(x0, y0, x1, y1, c0, c1) {
        while (true) {
          if (c0 === 0 && c1 === 0) return [x0, y0, x1, y1];
          if (c0 & c1) return null;
          let x, y, c = c0 || c1;
          if (c & 0b1000) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
          else if (c & 0b0100) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
          else if (c & 0b0010) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
          else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
          if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
          else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
        }
      }
      _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
        let P = Array.from(points), p;
        if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
        if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
        if (P = this._clipFinite(i, P)) {
          for (let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
            c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
            if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
          }
        } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
          P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
        }
        return P;
      }
      _edge(i, e0, e1, P, j) {
        while (e0 !== e1) {
          let x, y;
          switch (e0) {
            case 0b0101: e0 = 0b0100; continue; // top-left
            case 0b0100: e0 = 0b0110, x = this.xmax, y = this.ymin; break; // top
            case 0b0110: e0 = 0b0010; continue; // top-right
            case 0b0010: e0 = 0b1010, x = this.xmax, y = this.ymax; break; // right
            case 0b1010: e0 = 0b1000; continue; // bottom-right
            case 0b1000: e0 = 0b1001, x = this.xmin, y = this.ymax; break; // bottom
            case 0b1001: e0 = 0b0001; continue; // bottom-left
            case 0b0001: e0 = 0b0101, x = this.xmin, y = this.ymin; break; // left
          }
          // Note: this implicitly checks for out of bounds: if P[j] or P[j+1] are
          // undefined, the conditional statement will be executed.
          if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
            P.splice(j, 0, x, y), j += 2;
          }
        }
        if (P.length > 4) {
          for (let i = 0; i < P.length; i+= 2) {
            const j = (i + 2) % P.length, k = (i + 4) % P.length;
            if (P[i] === P[j] && P[j] === P[k]
            || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1])
              P.splice(j, 2), i -= 2;
          }
        }
        return j;
      }
      _project(x0, y0, vx, vy) {
        let t = Infinity, c, x, y;
        if (vy < 0) { // top
          if (y0 <= this.ymin) return null;
          if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
        } else if (vy > 0) { // bottom
          if (y0 >= this.ymax) return null;
          if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
        }
        if (vx > 0) { // right
          if (x0 >= this.xmax) return null;
          if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
        } else if (vx < 0) { // left
          if (x0 <= this.xmin) return null;
          if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
        }
        return [x, y];
      }
      _edgecode(x, y) {
        return (x === this.xmin ? 0b0001
            : x === this.xmax ? 0b0010 : 0b0000)
            | (y === this.ymin ? 0b0100
            : y === this.ymax ? 0b1000 : 0b0000);
      }
      _regioncode(x, y) {
        return (x < this.xmin ? 0b0001
            : x > this.xmax ? 0b0010 : 0b0000)
            | (y < this.ymin ? 0b0100
            : y > this.ymax ? 0b1000 : 0b0000);
      }
    }

    const tau = 2 * Math.PI, pow = Math.pow;

    function pointX(p) {
      return p[0];
    }

    function pointY(p) {
      return p[1];
    }

    // A triangulation is collinear if all its triangles have a non-null area
    function collinear(d) {
      const {triangles, coords} = d;
      for (let i = 0; i < triangles.length; i += 3) {
        const a = 2 * triangles[i],
              b = 2 * triangles[i + 1],
              c = 2 * triangles[i + 2],
              cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1])
                    - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
        if (cross > 1e-10) return false;
      }
      return true;
    }

    function jitter(x, y, r) {
      return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
    }

    class Delaunay {
      static from(points, fx = pointX, fy = pointY, that) {
        return new Delaunay("length" in points
            ? flatArray(points, fx, fy, that)
            : Float64Array.from(flatIterable(points, fx, fy, that)));
      }
      constructor(points) {
        this._delaunator = new Delaunator(points);
        this.inedges = new Int32Array(points.length / 2);
        this._hullIndex = new Int32Array(points.length / 2);
        this.points = this._delaunator.coords;
        this._init();
      }
      update() {
        this._delaunator.update();
        this._init();
        return this;
      }
      _init() {
        const d = this._delaunator, points = this.points;

        // check for collinear
        if (d.hull && d.hull.length > 2 && collinear(d)) {
          this.collinear = Int32Array.from({length: points.length/2}, (_,i) => i)
            .sort((i, j) => points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]); // for exact neighbors
          const e = this.collinear[0], f = this.collinear[this.collinear.length - 1],
            bounds = [ points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1] ],
            r = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
          for (let i = 0, n = points.length / 2; i < n; ++i) {
            const p = jitter(points[2 * i], points[2 * i + 1], r);
            points[2 * i] = p[0];
            points[2 * i + 1] = p[1];
          }
          this._delaunator = new Delaunator(points);
        } else {
          delete this.collinear;
        }

        const halfedges = this.halfedges = this._delaunator.halfedges;
        const hull = this.hull = this._delaunator.hull;
        const triangles = this.triangles = this._delaunator.triangles;
        const inedges = this.inedges.fill(-1);
        const hullIndex = this._hullIndex.fill(-1);

        // Compute an index from each point to an (arbitrary) incoming halfedge
        // Used to give the first neighbor of each point; for this reason,
        // on the hull we give priority to exterior halfedges
        for (let e = 0, n = halfedges.length; e < n; ++e) {
          const p = triangles[e % 3 === 2 ? e - 2 : e + 1];
          if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
        }
        for (let i = 0, n = hull.length; i < n; ++i) {
          hullIndex[hull[i]] = i;
        }

        // degenerate case: 1 or 2 (distinct) points
        if (hull.length <= 2 && hull.length > 0) {
          this.triangles = new Int32Array(3).fill(-1);
          this.halfedges = new Int32Array(3).fill(-1);
          this.triangles[0] = hull[0];
          inedges[hull[0]] = 1;
          if (hull.length === 2) {
            inedges[hull[1]] = 0;
            this.triangles[1] = hull[1];
            this.triangles[2] = hull[1];
          }
        }
      }
      voronoi(bounds) {
        return new Voronoi$1(this, bounds);
      }
      *neighbors(i) {
        const {inedges, hull, _hullIndex, halfedges, triangles, collinear} = this;

        // degenerate case with several collinear points
        if (collinear) {
          const l = collinear.indexOf(i);
          if (l > 0) yield collinear[l - 1];
          if (l < collinear.length - 1) yield collinear[l + 1];
          return;
        }

        const e0 = inedges[i];
        if (e0 === -1) return; // coincident point
        let e = e0, p0 = -1;
        do {
          yield p0 = triangles[e];
          e = e % 3 === 2 ? e - 2 : e + 1;
          if (triangles[e] !== i) return; // bad triangulation
          e = halfedges[e];
          if (e === -1) {
            const p = hull[(_hullIndex[i] + 1) % hull.length];
            if (p !== p0) yield p;
            return;
          }
        } while (e !== e0);
      }
      find(x, y, i = 0) {
        if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
        const i0 = i;
        let c;
        while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) i = c;
        return c;
      }
      _step(i, x, y) {
        const {inedges, hull, _hullIndex, halfedges, triangles, points} = this;
        if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
        let c = i;
        let dc = pow(x - points[i * 2], 2) + pow(y - points[i * 2 + 1], 2);
        const e0 = inedges[i];
        let e = e0;
        do {
          let t = triangles[e];
          const dt = pow(x - points[t * 2], 2) + pow(y - points[t * 2 + 1], 2);
          if (dt < dc) dc = dt, c = t;
          e = e % 3 === 2 ? e - 2 : e + 1;
          if (triangles[e] !== i) break; // bad triangulation
          e = halfedges[e];
          if (e === -1) {
            e = hull[(_hullIndex[i] + 1) % hull.length];
            if (e !== t) {
              if (pow(x - points[e * 2], 2) + pow(y - points[e * 2 + 1], 2) < dc) return e;
            }
            break;
          }
        } while (e !== e0);
        return c;
      }
      render(context) {
        const buffer = context == null ? context = new Path : undefined;
        const {points, halfedges, triangles} = this;
        for (let i = 0, n = halfedges.length; i < n; ++i) {
          const j = halfedges[i];
          if (j < i) continue;
          const ti = triangles[i] * 2;
          const tj = triangles[j] * 2;
          context.moveTo(points[ti], points[ti + 1]);
          context.lineTo(points[tj], points[tj + 1]);
        }
        this.renderHull(context);
        return buffer && buffer.value();
      }
      renderPoints(context, r) {
        if (r === undefined && (!context || typeof context.moveTo !== "function")) r = context, context = null;
        r = r == undefined ? 2 : +r;
        const buffer = context == null ? context = new Path : undefined;
        const {points} = this;
        for (let i = 0, n = points.length; i < n; i += 2) {
          const x = points[i], y = points[i + 1];
          context.moveTo(x + r, y);
          context.arc(x, y, r, 0, tau);
        }
        return buffer && buffer.value();
      }
      renderHull(context) {
        const buffer = context == null ? context = new Path : undefined;
        const {hull, points} = this;
        const h = hull[0] * 2, n = hull.length;
        context.moveTo(points[h], points[h + 1]);
        for (let i = 1; i < n; ++i) {
          const h = 2 * hull[i];
          context.lineTo(points[h], points[h + 1]);
        }
        context.closePath();
        return buffer && buffer.value();
      }
      hullPolygon() {
        const polygon = new Polygon;
        this.renderHull(polygon);
        return polygon.value();
      }
      renderTriangle(i, context) {
        const buffer = context == null ? context = new Path : undefined;
        const {points, triangles} = this;
        const t0 = triangles[i *= 3] * 2;
        const t1 = triangles[i + 1] * 2;
        const t2 = triangles[i + 2] * 2;
        context.moveTo(points[t0], points[t0 + 1]);
        context.lineTo(points[t1], points[t1 + 1]);
        context.lineTo(points[t2], points[t2 + 1]);
        context.closePath();
        return buffer && buffer.value();
      }
      *trianglePolygons() {
        const {triangles} = this;
        for (let i = 0, n = triangles.length / 3; i < n; ++i) {
          yield this.trianglePolygon(i);
        }
      }
      trianglePolygon(i) {
        const polygon = new Polygon;
        this.renderTriangle(i, polygon);
        return polygon.value();
      }
    }

    function flatArray(points, fx, fy, that) {
      const n = points.length;
      const array = new Float64Array(n * 2);
      for (let i = 0; i < n; ++i) {
        const p = points[i];
        array[i * 2] = fx.call(that, p, i, points);
        array[i * 2 + 1] = fy.call(that, p, i, points);
      }
      return array;
    }

    function* flatIterable(points, fx, fy, that) {
      let i = 0;
      for (const p of points) {
        yield fx.call(that, p, i, points);
        yield fy.call(that, p, i, points);
        ++i;
      }
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/shared/Voronoi.svelte generated by Svelte v3.43.1 */
    const file$e = "node_modules/@onsvisual/svelte-charts/src/charts/shared/Voronoi.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[29] = list[i];
    	child_ctx[31] = i;
    	return child_ctx;
    }

    // (51:0) {#if voronoi}
    function create_if_block$8(ctx) {
    	let g;
    	let each_value = /*$data*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "voronoi-group");
    			add_location(g, file$e, 51, 0, 1015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*voronoi, doHover, $data, doSelect*/ 1539) {
    				each_value = /*$data*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(51:0) {#if voronoi}",
    		ctx
    	});

    	return block;
    }

    // (53:0) {#each $data as d, i}
    function create_each_block$8(ctx) {
    	let path;
    	let path_d_value;
    	let mounted;
    	let dispose;

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[21](/*i*/ ctx[31], ...args);
    	}

    	function focus_handler(...args) {
    		return /*focus_handler*/ ctx[23](/*i*/ ctx[31], ...args);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[25](/*i*/ ctx[31], ...args);
    	}

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "voronoi-cell svelte-169satm");
    			attr_dev(path, "d", path_d_value = /*voronoi*/ ctx[0].renderCell(/*i*/ ctx[31]));
    			add_location(path, file$e, 53, 1, 1064);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(path, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(path, "mouseleave", /*mouseleave_handler*/ ctx[22], false, false, false),
    					listen_dev(path, "focus", focus_handler, false, false, false),
    					listen_dev(path, "blur", /*blur_handler*/ ctx[24], false, false, false),
    					listen_dev(path, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*voronoi*/ 1 && path_d_value !== (path_d_value = /*voronoi*/ ctx[0].renderCell(/*i*/ ctx[31]))) {
    				attr_dev(path, "d", path_d_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(53:0) {#each $data as d, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let if_block_anchor;
    	let if_block = /*voronoi*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*voronoi*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let coordsArray;
    	let voronoi;
    	let $height;
    	let $width;
    	let $yScale;
    	let $xScale;
    	let $coords;
    	let $custom;
    	let $data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Voronoi', slots, []);
    	const { data, width, height, custom, xScale, yScale } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(1, $data = value));
    	validate_store(width, 'width');
    	component_subscribe($$self, width, value => $$invalidate(17, $width = value));
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(16, $height = value));
    	validate_store(custom, 'custom');
    	component_subscribe($$self, custom, value => $$invalidate(26, $custom = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(19, $xScale = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(18, $yScale = value));
    	const dispatch = createEventDispatcher();
    	let { hover = false } = $$props;
    	let { hovered = null } = $$props;
    	let { select = false } = $$props;
    	let { selected = null } = $$props;
    	let coords = $custom.coords;
    	validate_store(coords, 'coords');
    	component_subscribe($$self, coords, value => $$invalidate(20, $coords = value));
    	let idKey = $custom.idKey;

    	function doHover(e, d) {
    		if (hover) {
    			$$invalidate(11, hovered = d ? d[idKey] : null);
    			dispatch('hover', { id: hovered, data: d, event: e });
    		}
    	}

    	function doSelect(e, d) {
    		if (select) {
    			$$invalidate(12, selected = d ? d[idKey] : null);
    			dispatch('select', { id: selected, data: d, event: e });
    		}
    	}

    	const writable_props = ['hover', 'hovered', 'select', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Voronoi> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = (i, e) => doHover(e, $data[i]);
    	const mouseleave_handler = e => doHover(e, null);
    	const focus_handler = (i, e) => doHover(e, $data[i]);
    	const blur_handler = e => doHover(e, null);
    	const click_handler = (i, e) => doSelect(e, $data[i]);

    	$$self.$$set = $$props => {
    		if ('hover' in $$props) $$invalidate(13, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(11, hovered = $$props.hovered);
    		if ('select' in $$props) $$invalidate(14, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(12, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		Delaunay,
    		getContext,
    		createEventDispatcher,
    		data,
    		width,
    		height,
    		custom,
    		xScale,
    		yScale,
    		dispatch,
    		hover,
    		hovered,
    		select,
    		selected,
    		coords,
    		idKey,
    		doHover,
    		doSelect,
    		coordsArray,
    		voronoi,
    		$height,
    		$width,
    		$yScale,
    		$xScale,
    		$coords,
    		$custom,
    		$data
    	});

    	$$self.$inject_state = $$props => {
    		if ('hover' in $$props) $$invalidate(13, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(11, hovered = $$props.hovered);
    		if ('select' in $$props) $$invalidate(14, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(12, selected = $$props.selected);
    		if ('coords' in $$props) $$invalidate(8, coords = $$props.coords);
    		if ('idKey' in $$props) idKey = $$props.idKey;
    		if ('coordsArray' in $$props) $$invalidate(15, coordsArray = $$props.coordsArray);
    		if ('voronoi' in $$props) $$invalidate(0, voronoi = $$props.voronoi);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$coords, $xScale, $yScale*/ 1835008) {
    			$$invalidate(15, coordsArray = Array.isArray($coords)
    			? $coords.map(d => [$xScale(d.x), $yScale(d.y)])
    			: []);
    		}

    		if ($$self.$$.dirty[0] & /*coordsArray, $width, $height*/ 229376) {
    			$$invalidate(0, voronoi = Delaunay.from(coordsArray).voronoi([0, 0, $width, $height]));
    		}
    	};

    	return [
    		voronoi,
    		$data,
    		data,
    		width,
    		height,
    		custom,
    		xScale,
    		yScale,
    		coords,
    		doHover,
    		doSelect,
    		hovered,
    		selected,
    		hover,
    		select,
    		coordsArray,
    		$height,
    		$width,
    		$yScale,
    		$xScale,
    		$coords,
    		mouseover_handler,
    		mouseleave_handler,
    		focus_handler,
    		blur_handler,
    		click_handler
    	];
    }

    class Voronoi extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				hover: 13,
    				hovered: 11,
    				select: 14,
    				selected: 12
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Voronoi",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get hover() {
    		throw new Error("<Voronoi>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Voronoi>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hovered() {
    		throw new Error("<Voronoi>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hovered(value) {
    		throw new Error("<Voronoi>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		throw new Error("<Voronoi>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set select(value) {
    		throw new Error("<Voronoi>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Voronoi>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Voronoi>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@onsvisual/svelte-charts/src/charts/ScatterChart.svelte generated by Svelte v3.43.1 */
    const file$d = "node_modules/@onsvisual/svelte-charts/src/charts/ScatterChart.svelte";
    const get_front_slot_changes = dirty => ({});
    const get_front_slot_context = ctx => ({});
    const get_svg_slot_changes = dirty => ({});
    const get_svg_slot_context = ctx => ({});
    const get_back_slot_changes = dirty => ({});
    const get_back_slot_context = ctx => ({});
    const get_options_slot_changes = dirty => ({});
    const get_options_slot_context = ctx => ({});

    // (105:0) {#if title}
    function create_if_block_7$1(ctx) {
    	let title_1;
    	let current;

    	title_1 = new Title({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(title_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(title_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const title_1_changes = {};

    			if (dirty[0] & /*title*/ 8388608 | dirty[1] & /*$$scope*/ 536870912) {
    				title_1_changes.$$scope = { dirty, ctx };
    			}

    			title_1.$set(title_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(title_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(105:0) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (106:2) <Title>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[23]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 8388608) set_data_dev(t, /*title*/ ctx[23]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(106:2) <Title>",
    		ctx
    	});

    	return block;
    }

    // (141:3) {#if width > 80}
    function create_if_block_2$4(ctx) {
    	let setcoords;
    	let t0;
    	let t1;
    	let svg;
    	let t2;
    	let current;
    	setcoords = new SetCoords({ $$inline: true });
    	const back_slot_template = /*#slots*/ ctx[55].back;
    	const back_slot = create_slot(back_slot_template, ctx, /*$$scope*/ ctx[60], get_back_slot_context);

    	svg = new Svg({
    			props: {
    				pointerEvents: /*interactive*/ ctx[32],
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const front_slot_template = /*#slots*/ ctx[55].front;
    	const front_slot = create_slot(front_slot_template, ctx, /*$$scope*/ ctx[60], get_front_slot_context);

    	const block = {
    		c: function create() {
    			create_component(setcoords.$$.fragment);
    			t0 = space();
    			if (back_slot) back_slot.c();
    			t1 = space();
    			create_component(svg.$$.fragment);
    			t2 = space();
    			if (front_slot) front_slot.c();
    		},
    		m: function mount(target, anchor) {
    			mount_component(setcoords, target, anchor);
    			insert_dev(target, t0, anchor);

    			if (back_slot) {
    				back_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(svg, target, anchor);
    			insert_dev(target, t2, anchor);

    			if (front_slot) {
    				front_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (back_slot) {
    				if (back_slot.p && (!current || dirty[1] & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						back_slot,
    						back_slot_template,
    						ctx,
    						/*$$scope*/ ctx[60],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[60])
    						: get_slot_changes(back_slot_template, /*$$scope*/ ctx[60], dirty, get_back_slot_changes),
    						get_back_slot_context
    					);
    				}
    			}

    			const svg_changes = {};
    			if (dirty[1] & /*interactive*/ 2) svg_changes.pointerEvents = /*interactive*/ ctx[32];

    			if (dirty[0] & /*hovered, selected, labels, yTicks, yFormatTick, textColor, tickColor, tickDashed, yAxis, yKey, xTicks, xFormatTick, snapTicks, xAxis*/ 209698947 | dirty[1] & /*$$scope, select, hover, highlighted, overlayFill, yPrefix, ySuffix, xPrefix, xSuffix*/ 536876412) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);

    			if (front_slot) {
    				if (front_slot.p && (!current || dirty[1] & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						front_slot,
    						front_slot_template,
    						ctx,
    						/*$$scope*/ ctx[60],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[60])
    						: get_slot_changes(front_slot_template, /*$$scope*/ ctx[60], dirty, get_front_slot_changes),
    						get_front_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(setcoords.$$.fragment, local);
    			transition_in(back_slot, local);
    			transition_in(svg.$$.fragment, local);
    			transition_in(front_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(setcoords.$$.fragment, local);
    			transition_out(back_slot, local);
    			transition_out(svg.$$.fragment, local);
    			transition_out(front_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(setcoords, detaching);
    			if (detaching) detach_dev(t0);
    			if (back_slot) back_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t2);
    			if (front_slot) front_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(141:3) {#if width > 80}",
    		ctx
    	});

    	return block;
    }

    // (145:6) {#if xAxis}
    function create_if_block_6$1(ctx) {
    	let axisx;
    	let current;

    	axisx = new AxisX$1({
    			props: {
    				ticks: /*xTicks*/ ctx[18],
    				formatTick: /*xFormatTick*/ ctx[14],
    				snapTicks: /*snapTicks*/ ctx[27],
    				prefix: /*xPrefix*/ ctx[33],
    				suffix: /*xSuffix*/ ctx[34],
    				textColor: /*textColor*/ ctx[20],
    				tickColor: /*tickColor*/ ctx[21],
    				tickDashed: /*tickDashed*/ ctx[22]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisx_changes = {};
    			if (dirty[0] & /*xTicks*/ 262144) axisx_changes.ticks = /*xTicks*/ ctx[18];
    			if (dirty[0] & /*xFormatTick*/ 16384) axisx_changes.formatTick = /*xFormatTick*/ ctx[14];
    			if (dirty[0] & /*snapTicks*/ 134217728) axisx_changes.snapTicks = /*snapTicks*/ ctx[27];
    			if (dirty[1] & /*xPrefix*/ 4) axisx_changes.prefix = /*xPrefix*/ ctx[33];
    			if (dirty[1] & /*xSuffix*/ 8) axisx_changes.suffix = /*xSuffix*/ ctx[34];
    			if (dirty[0] & /*textColor*/ 1048576) axisx_changes.textColor = /*textColor*/ ctx[20];
    			if (dirty[0] & /*tickColor*/ 2097152) axisx_changes.tickColor = /*tickColor*/ ctx[21];
    			if (dirty[0] & /*tickDashed*/ 4194304) axisx_changes.tickDashed = /*tickDashed*/ ctx[22];
    			axisx.$set(axisx_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(145:6) {#if xAxis}",
    		ctx
    	});

    	return block;
    }

    // (148:6) {#if yAxis && yKey}
    function create_if_block_5$3(ctx) {
    	let axisy;
    	let current;

    	axisy = new AxisY$1({
    			props: {
    				ticks: /*yTicks*/ ctx[19],
    				formatTick: /*yFormatTick*/ ctx[15],
    				prefix: /*yPrefix*/ ctx[35],
    				suffix: /*ySuffix*/ ctx[36],
    				textColor: /*textColor*/ ctx[20],
    				tickColor: /*tickColor*/ ctx[21],
    				tickDashed: /*tickDashed*/ ctx[22]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(axisy.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisy, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const axisy_changes = {};
    			if (dirty[0] & /*yTicks*/ 524288) axisy_changes.ticks = /*yTicks*/ ctx[19];
    			if (dirty[0] & /*yFormatTick*/ 32768) axisy_changes.formatTick = /*yFormatTick*/ ctx[15];
    			if (dirty[1] & /*yPrefix*/ 16) axisy_changes.prefix = /*yPrefix*/ ctx[35];
    			if (dirty[1] & /*ySuffix*/ 32) axisy_changes.suffix = /*ySuffix*/ ctx[36];
    			if (dirty[0] & /*textColor*/ 1048576) axisy_changes.textColor = /*textColor*/ ctx[20];
    			if (dirty[0] & /*tickColor*/ 2097152) axisy_changes.tickColor = /*tickColor*/ ctx[21];
    			if (dirty[0] & /*tickDashed*/ 4194304) axisy_changes.tickDashed = /*tickDashed*/ ctx[22];
    			axisy.$set(axisy_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisy, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$3.name,
    		type: "if",
    		source: "(148:6) {#if yAxis && yKey}",
    		ctx
    	});

    	return block;
    }

    // (152:3) {#if select || hover}
    function create_if_block_4$3(ctx) {
    	let voronoi;
    	let updating_selected;
    	let updating_hovered;
    	let current;

    	function voronoi_selected_binding(value) {
    		/*voronoi_selected_binding*/ ctx[56](value);
    	}

    	function voronoi_hovered_binding(value) {
    		/*voronoi_hovered_binding*/ ctx[57](value);
    	}

    	let voronoi_props = {
    		select: /*select*/ ctx[39],
    		hover: /*hover*/ ctx[37],
    		highlighted: /*highlighted*/ ctx[41]
    	};

    	if (/*selected*/ ctx[1] !== void 0) {
    		voronoi_props.selected = /*selected*/ ctx[1];
    	}

    	if (/*hovered*/ ctx[0] !== void 0) {
    		voronoi_props.hovered = /*hovered*/ ctx[0];
    	}

    	voronoi = new Voronoi({ props: voronoi_props, $$inline: true });
    	binding_callbacks.push(() => bind(voronoi, 'selected', voronoi_selected_binding));
    	binding_callbacks.push(() => bind(voronoi, 'hovered', voronoi_hovered_binding));
    	voronoi.$on("hover", /*hover_handler*/ ctx[58]);
    	voronoi.$on("select", /*select_handler*/ ctx[59]);

    	const block = {
    		c: function create() {
    			create_component(voronoi.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(voronoi, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const voronoi_changes = {};
    			if (dirty[1] & /*select*/ 256) voronoi_changes.select = /*select*/ ctx[39];
    			if (dirty[1] & /*hover*/ 64) voronoi_changes.hover = /*hover*/ ctx[37];
    			if (dirty[1] & /*highlighted*/ 1024) voronoi_changes.highlighted = /*highlighted*/ ctx[41];

    			if (!updating_selected && dirty[0] & /*selected*/ 2) {
    				updating_selected = true;
    				voronoi_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			if (!updating_hovered && dirty[0] & /*hovered*/ 1) {
    				updating_hovered = true;
    				voronoi_changes.hovered = /*hovered*/ ctx[0];
    				add_flush_callback(() => updating_hovered = false);
    			}

    			voronoi.$set(voronoi_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(voronoi.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(voronoi.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(voronoi, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(152:3) {#if select || hover}",
    		ctx
    	});

    	return block;
    }

    // (155:3) {#if labels}
    function create_if_block_3$3(ctx) {
    	let labels_1;
    	let current;

    	labels_1 = new Labels({
    			props: {
    				hovered: /*hovered*/ ctx[0],
    				selected: /*selected*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(labels_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(labels_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const labels_1_changes = {};
    			if (dirty[0] & /*hovered*/ 1) labels_1_changes.hovered = /*hovered*/ ctx[0];
    			if (dirty[0] & /*selected*/ 2) labels_1_changes.selected = /*selected*/ ctx[1];
    			labels_1.$set(labels_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labels_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labels_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(labels_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(155:3) {#if labels}",
    		ctx
    	});

    	return block;
    }

    // (144:2) <Svg pointerEvents={interactive}>
    function create_default_slot_2$2(ctx) {
    	let t0;
    	let t1;
    	let scatter;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let if_block0 = /*xAxis*/ ctx[16] && create_if_block_6$1(ctx);
    	let if_block1 = /*yAxis*/ ctx[17] && /*yKey*/ ctx[7] && create_if_block_5$3(ctx);

    	scatter = new Scatter_svg({
    			props: {
    				selected: /*selected*/ ctx[1],
    				hovered: /*hovered*/ ctx[0],
    				highlighted: /*highlighted*/ ctx[41],
    				overlayFill: /*overlayFill*/ ctx[43]
    			},
    			$$inline: true
    		});

    	let if_block2 = (/*select*/ ctx[39] || /*hover*/ ctx[37]) && create_if_block_4$3(ctx);
    	let if_block3 = /*labels*/ ctx[26] && create_if_block_3$3(ctx);
    	const svg_slot_template = /*#slots*/ ctx[55].svg;
    	const svg_slot = create_slot(svg_slot_template, ctx, /*$$scope*/ ctx[60], get_svg_slot_context);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			create_component(scatter.$$.fragment);
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (svg_slot) svg_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(scatter, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t4, anchor);

    			if (svg_slot) {
    				svg_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*xAxis*/ ctx[16]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*xAxis*/ 65536) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*yAxis*/ ctx[17] && /*yKey*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*yAxis, yKey*/ 131200) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const scatter_changes = {};
    			if (dirty[0] & /*selected*/ 2) scatter_changes.selected = /*selected*/ ctx[1];
    			if (dirty[0] & /*hovered*/ 1) scatter_changes.hovered = /*hovered*/ ctx[0];
    			if (dirty[1] & /*highlighted*/ 1024) scatter_changes.highlighted = /*highlighted*/ ctx[41];
    			if (dirty[1] & /*overlayFill*/ 4096) scatter_changes.overlayFill = /*overlayFill*/ ctx[43];
    			scatter.$set(scatter_changes);

    			if (/*select*/ ctx[39] || /*hover*/ ctx[37]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[1] & /*select, hover*/ 320) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_4$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t3.parentNode, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*labels*/ ctx[26]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*labels*/ 67108864) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_3$3(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(t4.parentNode, t4);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (svg_slot) {
    				if (svg_slot.p && (!current || dirty[1] & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						svg_slot,
    						svg_slot_template,
    						ctx,
    						/*$$scope*/ ctx[60],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[60])
    						: get_slot_changes(svg_slot_template, /*$$scope*/ ctx[60], dirty, get_svg_slot_changes),
    						get_svg_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(scatter.$$.fragment, local);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(svg_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(scatter.$$.fragment, local);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(svg_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(scatter, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (svg_slot) svg_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(144:2) <Svg pointerEvents={interactive}>",
    		ctx
    	});

    	return block;
    }

    // (110:1) <LayerCake     {padding}   x={xKey}   y={yKey}     z={zKey}     r={rKey}   xScale={xScale == 'log' ? scaleSymlog() : scaleLinear()}   yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}     zScale={scaleOrdinal()}   xDomain={$xDomain}   yDomain={$yDomain}   {zDomain}   zRange={colors}     rRange={Array.isArray(r) ? r : [r, r]}   data={data}     xPadding={[buffer, buffer]}     yPadding={yKey ? [buffer, buffer] : null}     custom={{    type: 'scatter',    idKey,    labelKey,       coords,    colorSelect,    colorHover,    colorHighlight,    padding: 1,       animation,       duration     }}   let:width  >
    function create_default_slot_1$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*width*/ ctx[67] > 80 && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*width*/ ctx[67] > 80) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[2] & /*width*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(110:1) <LayerCake     {padding}   x={xKey}   y={yKey}     z={zKey}     r={rKey}   xScale={xScale == 'log' ? scaleSymlog() : scaleLinear()}   yScale={yScale == 'log' ? scaleSymlog() : scaleLinear()}     zScale={scaleOrdinal()}   xDomain={$xDomain}   yDomain={$yDomain}   {zDomain}   zRange={colors}     rRange={Array.isArray(r) ? r : [r, r]}   data={data}     xPadding={[buffer, buffer]}     yPadding={yKey ? [buffer, buffer] : null}     custom={{    type: 'scatter',    idKey,    labelKey,       coords,    colorSelect,    colorHover,    colorHighlight,    padding: 1,       animation,       duration     }}   let:width  >",
    		ctx
    	});

    	return block;
    }

    // (164:0) {#if legend && zDomain}
    function create_if_block_1$5(ctx) {
    	let legend_1;
    	let current;

    	legend_1 = new Legend$1({
    			props: {
    				domain: /*zDomain*/ ctx[44],
    				colors: /*colors*/ ctx[30],
    				markerLength: 13,
    				round: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(legend_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(legend_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const legend_1_changes = {};
    			if (dirty[1] & /*zDomain*/ 8192) legend_1_changes.domain = /*zDomain*/ ctx[44];
    			if (dirty[0] & /*colors*/ 1073741824) legend_1_changes.colors = /*colors*/ ctx[30];
    			legend_1.$set(legend_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(legend_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(legend_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(legend_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(164:0) {#if legend && zDomain}",
    		ctx
    	});

    	return block;
    }

    // (167:0) {#if footer}
    function create_if_block$7(ctx) {
    	let footer_1;
    	let current;

    	footer_1 = new Footer({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(footer_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footer_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const footer_1_changes = {};

    			if (dirty[0] & /*footer*/ 16777216 | dirty[1] & /*$$scope*/ 536870912) {
    				footer_1_changes.$$scope = { dirty, ctx };
    			}

    			footer_1.$set(footer_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footer_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(167:0) {#if footer}",
    		ctx
    	});

    	return block;
    }

    // (168:2) <Footer>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*footer*/ ctx[24]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*footer*/ 16777216) set_data_dev(t, /*footer*/ ctx[24]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(168:2) <Footer>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let t0;
    	let t1;
    	let div;
    	let layercake;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*title*/ ctx[23] && create_if_block_7$1(ctx);
    	const options_slot_template = /*#slots*/ ctx[55].options;
    	const options_slot = create_slot(options_slot_template, ctx, /*$$scope*/ ctx[60], get_options_slot_context);

    	layercake = new LayerCake({
    			props: {
    				padding: /*padding*/ ctx[28],
    				x: /*xKey*/ ctx[6],
    				y: /*yKey*/ ctx[7],
    				z: /*zKey*/ ctx[8],
    				r: /*rKey*/ ctx[9],
    				xScale: /*xScale*/ ctx[12] == 'log'
    				? symlog()
    				: linear(),
    				yScale: /*yScale*/ ctx[13] == 'log'
    				? symlog()
    				: linear(),
    				zScale: ordinal(),
    				xDomain: /*$xDomain*/ ctx[45],
    				yDomain: /*$yDomain*/ ctx[46],
    				zDomain: /*zDomain*/ ctx[44],
    				zRange: /*colors*/ ctx[30],
    				rRange: Array.isArray(/*r*/ ctx[31])
    				? /*r*/ ctx[31]
    				: [/*r*/ ctx[31], /*r*/ ctx[31]],
    				data: /*data*/ ctx[2],
    				xPadding: [/*buffer*/ ctx[29], /*buffer*/ ctx[29]],
    				yPadding: /*yKey*/ ctx[7]
    				? [/*buffer*/ ctx[29], /*buffer*/ ctx[29]]
    				: null,
    				custom: {
    					type: 'scatter',
    					idKey: /*idKey*/ ctx[10],
    					labelKey: /*labelKey*/ ctx[11],
    					coords: /*coords*/ ctx[47],
    					colorSelect: /*colorSelect*/ ctx[40],
    					colorHover: /*colorHover*/ ctx[38],
    					colorHighlight: /*colorHighlight*/ ctx[42],
    					padding: 1,
    					animation: /*animation*/ ctx[4],
    					duration: /*duration*/ ctx[5]
    				},
    				$$slots: {
    					default: [
    						create_default_slot_1$2,
    						({ width }) => ({ 67: width }),
    						({ width }) => [0, 0, width ? 32 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*legend*/ ctx[25] && /*zDomain*/ ctx[44] && create_if_block_1$5(ctx);
    	let if_block2 = /*footer*/ ctx[24] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (options_slot) options_slot.c();
    			t1 = space();
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(div, "class", "chart-container svelte-1dnlmiu");

    			set_style(div, "height", typeof /*height*/ ctx[3] == 'number'
    			? /*height*/ ctx[3] + 'px'
    			: /*height*/ ctx[3]);

    			add_location(div, file$d, 108, 0, 3472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			if (options_slot) {
    				options_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[23]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 8388608) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_7$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (options_slot) {
    				if (options_slot.p && (!current || dirty[1] & /*$$scope*/ 536870912)) {
    					update_slot_base(
    						options_slot,
    						options_slot_template,
    						ctx,
    						/*$$scope*/ ctx[60],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[60])
    						: get_slot_changes(options_slot_template, /*$$scope*/ ctx[60], dirty, get_options_slot_changes),
    						get_options_slot_context
    					);
    				}
    			}

    			const layercake_changes = {};
    			if (dirty[0] & /*padding*/ 268435456) layercake_changes.padding = /*padding*/ ctx[28];
    			if (dirty[0] & /*xKey*/ 64) layercake_changes.x = /*xKey*/ ctx[6];
    			if (dirty[0] & /*yKey*/ 128) layercake_changes.y = /*yKey*/ ctx[7];
    			if (dirty[0] & /*zKey*/ 256) layercake_changes.z = /*zKey*/ ctx[8];
    			if (dirty[0] & /*rKey*/ 512) layercake_changes.r = /*rKey*/ ctx[9];

    			if (dirty[0] & /*xScale*/ 4096) layercake_changes.xScale = /*xScale*/ ctx[12] == 'log'
    			? symlog()
    			: linear();

    			if (dirty[0] & /*yScale*/ 8192) layercake_changes.yScale = /*yScale*/ ctx[13] == 'log'
    			? symlog()
    			: linear();

    			if (dirty[1] & /*$xDomain*/ 16384) layercake_changes.xDomain = /*$xDomain*/ ctx[45];
    			if (dirty[1] & /*$yDomain*/ 32768) layercake_changes.yDomain = /*$yDomain*/ ctx[46];
    			if (dirty[1] & /*zDomain*/ 8192) layercake_changes.zDomain = /*zDomain*/ ctx[44];
    			if (dirty[0] & /*colors*/ 1073741824) layercake_changes.zRange = /*colors*/ ctx[30];

    			if (dirty[1] & /*r*/ 1) layercake_changes.rRange = Array.isArray(/*r*/ ctx[31])
    			? /*r*/ ctx[31]
    			: [/*r*/ ctx[31], /*r*/ ctx[31]];

    			if (dirty[0] & /*data*/ 4) layercake_changes.data = /*data*/ ctx[2];
    			if (dirty[0] & /*buffer*/ 536870912) layercake_changes.xPadding = [/*buffer*/ ctx[29], /*buffer*/ ctx[29]];

    			if (dirty[0] & /*yKey, buffer*/ 536871040) layercake_changes.yPadding = /*yKey*/ ctx[7]
    			? [/*buffer*/ ctx[29], /*buffer*/ ctx[29]]
    			: null;

    			if (dirty[0] & /*idKey, labelKey, animation, duration*/ 3120 | dirty[1] & /*colorSelect, colorHover, colorHighlight*/ 2688) layercake_changes.custom = {
    				type: 'scatter',
    				idKey: /*idKey*/ ctx[10],
    				labelKey: /*labelKey*/ ctx[11],
    				coords: /*coords*/ ctx[47],
    				colorSelect: /*colorSelect*/ ctx[40],
    				colorHover: /*colorHover*/ ctx[38],
    				colorHighlight: /*colorHighlight*/ ctx[42],
    				padding: 1,
    				animation: /*animation*/ ctx[4],
    				duration: /*duration*/ ctx[5]
    			};

    			if (dirty[0] & /*hovered, selected, labels, yTicks, yFormatTick, textColor, tickColor, tickDashed, yAxis, yKey, xTicks, xFormatTick, snapTicks, xAxis*/ 209698947 | dirty[1] & /*$$scope, interactive, select, hover, highlighted, overlayFill, yPrefix, ySuffix, xPrefix, xSuffix*/ 536876414 | dirty[2] & /*width*/ 32) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (!current || dirty[0] & /*height*/ 8) {
    				set_style(div, "height", typeof /*height*/ ctx[3] == 'number'
    				? /*height*/ ctx[3] + 'px'
    				: /*height*/ ctx[3]);
    			}

    			if (/*legend*/ ctx[25] && /*zDomain*/ ctx[44]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*legend*/ 33554432 | dirty[1] & /*zDomain*/ 8192) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t3.parentNode, t3);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*footer*/ ctx[24]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*footer*/ 16777216) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(options_slot, local);
    			transition_in(layercake.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(options_slot, local);
    			transition_out(layercake.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (options_slot) options_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function domGet(data, key, min, max) {
    	let vals = data.map(d => d[key]);

    	return [
    		min ? min : vals[0] ? Math.min(...vals) : -1,
    		max ? max : vals[0] ? Math.max(...vals) : 1
    	];
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let zDomain;
    	let $xDomain;
    	let $yDomain;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScatterChart', slots, ['options','back','svg','front']);
    	let { data } = $$props;
    	let { height = 250 } = $$props;
    	let { animation = true } = $$props;
    	let { duration = 800 } = $$props;
    	let { xKey = 'x' } = $$props;
    	let { yKey = null } = $$props;
    	let { zKey = null } = $$props;
    	let { rKey = null } = $$props;
    	let { idKey = xKey } = $$props;
    	let { labelKey = idKey } = $$props;
    	let { xScale = 'linear' } = $$props;
    	let { yScale = 'linear' } = $$props;
    	let { xFormatTick = d => d } = $$props;
    	let { yFormatTick = d => d } = $$props;
    	let { xMax = null } = $$props;
    	let { xMin = null } = $$props;
    	let { yMax = null } = $$props;
    	let { yMin = null } = $$props;
    	let { xAxis = true } = $$props;
    	let { yAxis = true } = $$props;
    	let { xTicks = 4 } = $$props;
    	let { yTicks = 4 } = $$props;
    	let { textColor = '#666' } = $$props;
    	let { tickColor = '#ccc' } = $$props;
    	let { tickDashed = false } = $$props;
    	let { title = null } = $$props;
    	let { footer = null } = $$props;
    	let { legend = false } = $$props;
    	let { labels = false } = $$props;
    	let { snapTicks = false } = $$props;
    	let { padding = { top: 0, bottom: 20, left: 35, right: 0 } } = $$props;
    	let { buffer = 5 } = $$props;
    	let { color = null } = $$props;

    	let { colors = color
    	? [color]
    	: [
    			'#3C388E',
    			'#DF0667',
    			'#206095',
    			'#A8BD3A',
    			'#003C57',
    			'#27A0CC',
    			'#118C7B',
    			'#F66068',
    			'#746CB1',
    			'#22D0B6',
    			'lightgrey'
    		] } = $$props;

    	let { r = 4 } = $$props;
    	let { interactive = true } = $$props;
    	let { xPrefix = "" } = $$props;
    	let { xSuffix = "" } = $$props;
    	let { yPrefix = "" } = $$props;
    	let { ySuffix = "" } = $$props;
    	let { hover = false } = $$props;
    	let { hovered = null } = $$props;
    	let { colorHover = 'orange' } = $$props;
    	let { select = false } = $$props;
    	let { selected = null } = $$props;
    	let { colorSelect = 'black' } = $$props;
    	let { highlighted = [] } = $$props;
    	let { colorHighlight = 'black' } = $$props;
    	let { overlayFill = false } = $$props;
    	const tweenOptions = { duration, easing: cubicInOut };
    	const coords = tweened(undefined, tweenOptions);
    	const distinct = (d, i, arr) => arr.indexOf(d) == i;

    	function xDomUpdate(data, key, min, max) {
    		let newDom = domGet(data, key, min, max);

    		if (newDom[0] != xDom[0] || newDom[1] != xDom[1]) {
    			xDomain.set(newDom);
    			xDom = newDom;
    		}
    	}

    	function yDomUpdate(data, key, min, max) {
    		let newDom = key ? domGet(data, key, min, max) : yDom;

    		if (newDom[0] != yDom[0] || newDom[1] != yDom[1]) {
    			yDomain.set(newDom, { duration: animation ? duration : 0 });
    			yDom = newDom;
    		}
    	}

    	let xDom = domGet(data, xKey, xMin, xMax);
    	const xDomain = tweened(xDom, tweenOptions);
    	validate_store(xDomain, 'xDomain');
    	component_subscribe($$self, xDomain, value => $$invalidate(45, $xDomain = value));
    	let yDom = domGet(data, yKey, yMin, yMax);
    	const yDomain = tweened(yDom, tweenOptions);
    	validate_store(yDomain, 'yDomain');
    	component_subscribe($$self, yDomain, value => $$invalidate(46, $yDomain = value));

    	const writable_props = [
    		'data',
    		'height',
    		'animation',
    		'duration',
    		'xKey',
    		'yKey',
    		'zKey',
    		'rKey',
    		'idKey',
    		'labelKey',
    		'xScale',
    		'yScale',
    		'xFormatTick',
    		'yFormatTick',
    		'xMax',
    		'xMin',
    		'yMax',
    		'yMin',
    		'xAxis',
    		'yAxis',
    		'xTicks',
    		'yTicks',
    		'textColor',
    		'tickColor',
    		'tickDashed',
    		'title',
    		'footer',
    		'legend',
    		'labels',
    		'snapTicks',
    		'padding',
    		'buffer',
    		'color',
    		'colors',
    		'r',
    		'interactive',
    		'xPrefix',
    		'xSuffix',
    		'yPrefix',
    		'ySuffix',
    		'hover',
    		'hovered',
    		'colorHover',
    		'select',
    		'selected',
    		'colorSelect',
    		'highlighted',
    		'colorHighlight',
    		'overlayFill'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScatterChart> was created with unknown prop '${key}'`);
    	});

    	function voronoi_selected_binding(value) {
    		selected = value;
    		$$invalidate(1, selected);
    	}

    	function voronoi_hovered_binding(value) {
    		hovered = value;
    		$$invalidate(0, hovered);
    	}

    	function hover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
    		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
    		if ('xKey' in $$props) $$invalidate(6, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(7, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(8, zKey = $$props.zKey);
    		if ('rKey' in $$props) $$invalidate(9, rKey = $$props.rKey);
    		if ('idKey' in $$props) $$invalidate(10, idKey = $$props.idKey);
    		if ('labelKey' in $$props) $$invalidate(11, labelKey = $$props.labelKey);
    		if ('xScale' in $$props) $$invalidate(12, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(13, yScale = $$props.yScale);
    		if ('xFormatTick' in $$props) $$invalidate(14, xFormatTick = $$props.xFormatTick);
    		if ('yFormatTick' in $$props) $$invalidate(15, yFormatTick = $$props.yFormatTick);
    		if ('xMax' in $$props) $$invalidate(50, xMax = $$props.xMax);
    		if ('xMin' in $$props) $$invalidate(51, xMin = $$props.xMin);
    		if ('yMax' in $$props) $$invalidate(52, yMax = $$props.yMax);
    		if ('yMin' in $$props) $$invalidate(53, yMin = $$props.yMin);
    		if ('xAxis' in $$props) $$invalidate(16, xAxis = $$props.xAxis);
    		if ('yAxis' in $$props) $$invalidate(17, yAxis = $$props.yAxis);
    		if ('xTicks' in $$props) $$invalidate(18, xTicks = $$props.xTicks);
    		if ('yTicks' in $$props) $$invalidate(19, yTicks = $$props.yTicks);
    		if ('textColor' in $$props) $$invalidate(20, textColor = $$props.textColor);
    		if ('tickColor' in $$props) $$invalidate(21, tickColor = $$props.tickColor);
    		if ('tickDashed' in $$props) $$invalidate(22, tickDashed = $$props.tickDashed);
    		if ('title' in $$props) $$invalidate(23, title = $$props.title);
    		if ('footer' in $$props) $$invalidate(24, footer = $$props.footer);
    		if ('legend' in $$props) $$invalidate(25, legend = $$props.legend);
    		if ('labels' in $$props) $$invalidate(26, labels = $$props.labels);
    		if ('snapTicks' in $$props) $$invalidate(27, snapTicks = $$props.snapTicks);
    		if ('padding' in $$props) $$invalidate(28, padding = $$props.padding);
    		if ('buffer' in $$props) $$invalidate(29, buffer = $$props.buffer);
    		if ('color' in $$props) $$invalidate(54, color = $$props.color);
    		if ('colors' in $$props) $$invalidate(30, colors = $$props.colors);
    		if ('r' in $$props) $$invalidate(31, r = $$props.r);
    		if ('interactive' in $$props) $$invalidate(32, interactive = $$props.interactive);
    		if ('xPrefix' in $$props) $$invalidate(33, xPrefix = $$props.xPrefix);
    		if ('xSuffix' in $$props) $$invalidate(34, xSuffix = $$props.xSuffix);
    		if ('yPrefix' in $$props) $$invalidate(35, yPrefix = $$props.yPrefix);
    		if ('ySuffix' in $$props) $$invalidate(36, ySuffix = $$props.ySuffix);
    		if ('hover' in $$props) $$invalidate(37, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('colorHover' in $$props) $$invalidate(38, colorHover = $$props.colorHover);
    		if ('select' in $$props) $$invalidate(39, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('colorSelect' in $$props) $$invalidate(40, colorSelect = $$props.colorSelect);
    		if ('highlighted' in $$props) $$invalidate(41, highlighted = $$props.highlighted);
    		if ('colorHighlight' in $$props) $$invalidate(42, colorHighlight = $$props.colorHighlight);
    		if ('overlayFill' in $$props) $$invalidate(43, overlayFill = $$props.overlayFill);
    		if ('$$scope' in $$props) $$invalidate(60, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		LayerCake,
    		Svg,
    		scaleOrdinal: ordinal,
    		scaleLinear: linear,
    		scaleSymlog: symlog,
    		tweened,
    		cubicInOut,
    		SetCoords,
    		Scatter: Scatter_svg,
    		Voronoi,
    		AxisX: AxisX$1,
    		AxisY: AxisY$1,
    		Legend: Legend$1,
    		Title,
    		Footer,
    		Labels,
    		data,
    		height,
    		animation,
    		duration,
    		xKey,
    		yKey,
    		zKey,
    		rKey,
    		idKey,
    		labelKey,
    		xScale,
    		yScale,
    		xFormatTick,
    		yFormatTick,
    		xMax,
    		xMin,
    		yMax,
    		yMin,
    		xAxis,
    		yAxis,
    		xTicks,
    		yTicks,
    		textColor,
    		tickColor,
    		tickDashed,
    		title,
    		footer,
    		legend,
    		labels,
    		snapTicks,
    		padding,
    		buffer,
    		color,
    		colors,
    		r,
    		interactive,
    		xPrefix,
    		xSuffix,
    		yPrefix,
    		ySuffix,
    		hover,
    		hovered,
    		colorHover,
    		select,
    		selected,
    		colorSelect,
    		highlighted,
    		colorHighlight,
    		overlayFill,
    		tweenOptions,
    		coords,
    		distinct,
    		domGet,
    		xDomUpdate,
    		yDomUpdate,
    		xDom,
    		xDomain,
    		yDom,
    		yDomain,
    		zDomain,
    		$xDomain,
    		$yDomain
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('animation' in $$props) $$invalidate(4, animation = $$props.animation);
    		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
    		if ('xKey' in $$props) $$invalidate(6, xKey = $$props.xKey);
    		if ('yKey' in $$props) $$invalidate(7, yKey = $$props.yKey);
    		if ('zKey' in $$props) $$invalidate(8, zKey = $$props.zKey);
    		if ('rKey' in $$props) $$invalidate(9, rKey = $$props.rKey);
    		if ('idKey' in $$props) $$invalidate(10, idKey = $$props.idKey);
    		if ('labelKey' in $$props) $$invalidate(11, labelKey = $$props.labelKey);
    		if ('xScale' in $$props) $$invalidate(12, xScale = $$props.xScale);
    		if ('yScale' in $$props) $$invalidate(13, yScale = $$props.yScale);
    		if ('xFormatTick' in $$props) $$invalidate(14, xFormatTick = $$props.xFormatTick);
    		if ('yFormatTick' in $$props) $$invalidate(15, yFormatTick = $$props.yFormatTick);
    		if ('xMax' in $$props) $$invalidate(50, xMax = $$props.xMax);
    		if ('xMin' in $$props) $$invalidate(51, xMin = $$props.xMin);
    		if ('yMax' in $$props) $$invalidate(52, yMax = $$props.yMax);
    		if ('yMin' in $$props) $$invalidate(53, yMin = $$props.yMin);
    		if ('xAxis' in $$props) $$invalidate(16, xAxis = $$props.xAxis);
    		if ('yAxis' in $$props) $$invalidate(17, yAxis = $$props.yAxis);
    		if ('xTicks' in $$props) $$invalidate(18, xTicks = $$props.xTicks);
    		if ('yTicks' in $$props) $$invalidate(19, yTicks = $$props.yTicks);
    		if ('textColor' in $$props) $$invalidate(20, textColor = $$props.textColor);
    		if ('tickColor' in $$props) $$invalidate(21, tickColor = $$props.tickColor);
    		if ('tickDashed' in $$props) $$invalidate(22, tickDashed = $$props.tickDashed);
    		if ('title' in $$props) $$invalidate(23, title = $$props.title);
    		if ('footer' in $$props) $$invalidate(24, footer = $$props.footer);
    		if ('legend' in $$props) $$invalidate(25, legend = $$props.legend);
    		if ('labels' in $$props) $$invalidate(26, labels = $$props.labels);
    		if ('snapTicks' in $$props) $$invalidate(27, snapTicks = $$props.snapTicks);
    		if ('padding' in $$props) $$invalidate(28, padding = $$props.padding);
    		if ('buffer' in $$props) $$invalidate(29, buffer = $$props.buffer);
    		if ('color' in $$props) $$invalidate(54, color = $$props.color);
    		if ('colors' in $$props) $$invalidate(30, colors = $$props.colors);
    		if ('r' in $$props) $$invalidate(31, r = $$props.r);
    		if ('interactive' in $$props) $$invalidate(32, interactive = $$props.interactive);
    		if ('xPrefix' in $$props) $$invalidate(33, xPrefix = $$props.xPrefix);
    		if ('xSuffix' in $$props) $$invalidate(34, xSuffix = $$props.xSuffix);
    		if ('yPrefix' in $$props) $$invalidate(35, yPrefix = $$props.yPrefix);
    		if ('ySuffix' in $$props) $$invalidate(36, ySuffix = $$props.ySuffix);
    		if ('hover' in $$props) $$invalidate(37, hover = $$props.hover);
    		if ('hovered' in $$props) $$invalidate(0, hovered = $$props.hovered);
    		if ('colorHover' in $$props) $$invalidate(38, colorHover = $$props.colorHover);
    		if ('select' in $$props) $$invalidate(39, select = $$props.select);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('colorSelect' in $$props) $$invalidate(40, colorSelect = $$props.colorSelect);
    		if ('highlighted' in $$props) $$invalidate(41, highlighted = $$props.highlighted);
    		if ('colorHighlight' in $$props) $$invalidate(42, colorHighlight = $$props.colorHighlight);
    		if ('overlayFill' in $$props) $$invalidate(43, overlayFill = $$props.overlayFill);
    		if ('xDom' in $$props) xDom = $$props.xDom;
    		if ('yDom' in $$props) yDom = $$props.yDom;
    		if ('zDomain' in $$props) $$invalidate(44, zDomain = $$props.zDomain);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*data, xKey*/ 68 | $$self.$$.dirty[1] & /*xMin, xMax*/ 1572864) {
    			xDomUpdate(data, xKey, xMin, xMax);
    		}

    		if ($$self.$$.dirty[0] & /*data, yKey*/ 132 | $$self.$$.dirty[1] & /*yMin, yMax*/ 6291456) {
    			yDomUpdate(data, yKey, yMin, yMax);
    		}

    		if ($$self.$$.dirty[0] & /*zKey, data*/ 260) {
    			$$invalidate(44, zDomain = zKey ? data.map(d => d[zKey]).filter(distinct) : null);
    		}
    	};

    	return [
    		hovered,
    		selected,
    		data,
    		height,
    		animation,
    		duration,
    		xKey,
    		yKey,
    		zKey,
    		rKey,
    		idKey,
    		labelKey,
    		xScale,
    		yScale,
    		xFormatTick,
    		yFormatTick,
    		xAxis,
    		yAxis,
    		xTicks,
    		yTicks,
    		textColor,
    		tickColor,
    		tickDashed,
    		title,
    		footer,
    		legend,
    		labels,
    		snapTicks,
    		padding,
    		buffer,
    		colors,
    		r,
    		interactive,
    		xPrefix,
    		xSuffix,
    		yPrefix,
    		ySuffix,
    		hover,
    		colorHover,
    		select,
    		colorSelect,
    		highlighted,
    		colorHighlight,
    		overlayFill,
    		zDomain,
    		$xDomain,
    		$yDomain,
    		coords,
    		xDomain,
    		yDomain,
    		xMax,
    		xMin,
    		yMax,
    		yMin,
    		color,
    		slots,
    		voronoi_selected_binding,
    		voronoi_hovered_binding,
    		hover_handler,
    		select_handler,
    		$$scope
    	];
    }

    class ScatterChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$f,
    			create_fragment$f,
    			safe_not_equal,
    			{
    				data: 2,
    				height: 3,
    				animation: 4,
    				duration: 5,
    				xKey: 6,
    				yKey: 7,
    				zKey: 8,
    				rKey: 9,
    				idKey: 10,
    				labelKey: 11,
    				xScale: 12,
    				yScale: 13,
    				xFormatTick: 14,
    				yFormatTick: 15,
    				xMax: 50,
    				xMin: 51,
    				yMax: 52,
    				yMin: 53,
    				xAxis: 16,
    				yAxis: 17,
    				xTicks: 18,
    				yTicks: 19,
    				textColor: 20,
    				tickColor: 21,
    				tickDashed: 22,
    				title: 23,
    				footer: 24,
    				legend: 25,
    				labels: 26,
    				snapTicks: 27,
    				padding: 28,
    				buffer: 29,
    				color: 54,
    				colors: 30,
    				r: 31,
    				interactive: 32,
    				xPrefix: 33,
    				xSuffix: 34,
    				yPrefix: 35,
    				ySuffix: 36,
    				hover: 37,
    				hovered: 0,
    				colorHover: 38,
    				select: 39,
    				selected: 1,
    				colorSelect: 40,
    				highlighted: 41,
    				colorHighlight: 42,
    				overlayFill: 43
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScatterChart",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !('data' in props)) {
    			console.warn("<ScatterChart> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		return this.$$.ctx[2];
    	}

    	set data(data) {
    		this.$$set({ data });
    		flush();
    	}

    	get height() {
    		return this.$$.ctx[3];
    	}

    	set height(height) {
    		this.$$set({ height });
    		flush();
    	}

    	get animation() {
    		return this.$$.ctx[4];
    	}

    	set animation(animation) {
    		this.$$set({ animation });
    		flush();
    	}

    	get duration() {
    		return this.$$.ctx[5];
    	}

    	set duration(duration) {
    		this.$$set({ duration });
    		flush();
    	}

    	get xKey() {
    		return this.$$.ctx[6];
    	}

    	set xKey(xKey) {
    		this.$$set({ xKey });
    		flush();
    	}

    	get yKey() {
    		return this.$$.ctx[7];
    	}

    	set yKey(yKey) {
    		this.$$set({ yKey });
    		flush();
    	}

    	get zKey() {
    		return this.$$.ctx[8];
    	}

    	set zKey(zKey) {
    		this.$$set({ zKey });
    		flush();
    	}

    	get rKey() {
    		return this.$$.ctx[9];
    	}

    	set rKey(rKey) {
    		this.$$set({ rKey });
    		flush();
    	}

    	get idKey() {
    		return this.$$.ctx[10];
    	}

    	set idKey(idKey) {
    		this.$$set({ idKey });
    		flush();
    	}

    	get labelKey() {
    		return this.$$.ctx[11];
    	}

    	set labelKey(labelKey) {
    		this.$$set({ labelKey });
    		flush();
    	}

    	get xScale() {
    		return this.$$.ctx[12];
    	}

    	set xScale(xScale) {
    		this.$$set({ xScale });
    		flush();
    	}

    	get yScale() {
    		return this.$$.ctx[13];
    	}

    	set yScale(yScale) {
    		this.$$set({ yScale });
    		flush();
    	}

    	get xFormatTick() {
    		return this.$$.ctx[14];
    	}

    	set xFormatTick(xFormatTick) {
    		this.$$set({ xFormatTick });
    		flush();
    	}

    	get yFormatTick() {
    		return this.$$.ctx[15];
    	}

    	set yFormatTick(yFormatTick) {
    		this.$$set({ yFormatTick });
    		flush();
    	}

    	get xMax() {
    		return this.$$.ctx[50];
    	}

    	set xMax(xMax) {
    		this.$$set({ xMax });
    		flush();
    	}

    	get xMin() {
    		return this.$$.ctx[51];
    	}

    	set xMin(xMin) {
    		this.$$set({ xMin });
    		flush();
    	}

    	get yMax() {
    		return this.$$.ctx[52];
    	}

    	set yMax(yMax) {
    		this.$$set({ yMax });
    		flush();
    	}

    	get yMin() {
    		return this.$$.ctx[53];
    	}

    	set yMin(yMin) {
    		this.$$set({ yMin });
    		flush();
    	}

    	get xAxis() {
    		return this.$$.ctx[16];
    	}

    	set xAxis(xAxis) {
    		this.$$set({ xAxis });
    		flush();
    	}

    	get yAxis() {
    		return this.$$.ctx[17];
    	}

    	set yAxis(yAxis) {
    		this.$$set({ yAxis });
    		flush();
    	}

    	get xTicks() {
    		return this.$$.ctx[18];
    	}

    	set xTicks(xTicks) {
    		this.$$set({ xTicks });
    		flush();
    	}

    	get yTicks() {
    		return this.$$.ctx[19];
    	}

    	set yTicks(yTicks) {
    		this.$$set({ yTicks });
    		flush();
    	}

    	get textColor() {
    		return this.$$.ctx[20];
    	}

    	set textColor(textColor) {
    		this.$$set({ textColor });
    		flush();
    	}

    	get tickColor() {
    		return this.$$.ctx[21];
    	}

    	set tickColor(tickColor) {
    		this.$$set({ tickColor });
    		flush();
    	}

    	get tickDashed() {
    		return this.$$.ctx[22];
    	}

    	set tickDashed(tickDashed) {
    		this.$$set({ tickDashed });
    		flush();
    	}

    	get title() {
    		return this.$$.ctx[23];
    	}

    	set title(title) {
    		this.$$set({ title });
    		flush();
    	}

    	get footer() {
    		return this.$$.ctx[24];
    	}

    	set footer(footer) {
    		this.$$set({ footer });
    		flush();
    	}

    	get legend() {
    		return this.$$.ctx[25];
    	}

    	set legend(legend) {
    		this.$$set({ legend });
    		flush();
    	}

    	get labels() {
    		return this.$$.ctx[26];
    	}

    	set labels(labels) {
    		this.$$set({ labels });
    		flush();
    	}

    	get snapTicks() {
    		return this.$$.ctx[27];
    	}

    	set snapTicks(snapTicks) {
    		this.$$set({ snapTicks });
    		flush();
    	}

    	get padding() {
    		return this.$$.ctx[28];
    	}

    	set padding(padding) {
    		this.$$set({ padding });
    		flush();
    	}

    	get buffer() {
    		return this.$$.ctx[29];
    	}

    	set buffer(buffer) {
    		this.$$set({ buffer });
    		flush();
    	}

    	get color() {
    		return this.$$.ctx[54];
    	}

    	set color(color) {
    		this.$$set({ color });
    		flush();
    	}

    	get colors() {
    		return this.$$.ctx[30];
    	}

    	set colors(colors) {
    		this.$$set({ colors });
    		flush();
    	}

    	get r() {
    		return this.$$.ctx[31];
    	}

    	set r(r) {
    		this.$$set({ r });
    		flush();
    	}

    	get interactive() {
    		return this.$$.ctx[32];
    	}

    	set interactive(interactive) {
    		this.$$set({ interactive });
    		flush();
    	}

    	get xPrefix() {
    		return this.$$.ctx[33];
    	}

    	set xPrefix(xPrefix) {
    		this.$$set({ xPrefix });
    		flush();
    	}

    	get xSuffix() {
    		return this.$$.ctx[34];
    	}

    	set xSuffix(xSuffix) {
    		this.$$set({ xSuffix });
    		flush();
    	}

    	get yPrefix() {
    		return this.$$.ctx[35];
    	}

    	set yPrefix(yPrefix) {
    		this.$$set({ yPrefix });
    		flush();
    	}

    	get ySuffix() {
    		return this.$$.ctx[36];
    	}

    	set ySuffix(ySuffix) {
    		this.$$set({ ySuffix });
    		flush();
    	}

    	get hover() {
    		return this.$$.ctx[37];
    	}

    	set hover(hover) {
    		this.$$set({ hover });
    		flush();
    	}

    	get hovered() {
    		return this.$$.ctx[0];
    	}

    	set hovered(hovered) {
    		this.$$set({ hovered });
    		flush();
    	}

    	get colorHover() {
    		return this.$$.ctx[38];
    	}

    	set colorHover(colorHover) {
    		this.$$set({ colorHover });
    		flush();
    	}

    	get select() {
    		return this.$$.ctx[39];
    	}

    	set select(select) {
    		this.$$set({ select });
    		flush();
    	}

    	get selected() {
    		return this.$$.ctx[1];
    	}

    	set selected(selected) {
    		this.$$set({ selected });
    		flush();
    	}

    	get colorSelect() {
    		return this.$$.ctx[40];
    	}

    	set colorSelect(colorSelect) {
    		this.$$set({ colorSelect });
    		flush();
    	}

    	get highlighted() {
    		return this.$$.ctx[41];
    	}

    	set highlighted(highlighted) {
    		this.$$set({ highlighted });
    		flush();
    	}

    	get colorHighlight() {
    		return this.$$.ctx[42];
    	}

    	set colorHighlight(colorHighlight) {
    		this.$$set({ colorHighlight });
    		flush();
    	}

    	get overlayFill() {
    		return this.$$.ctx[43];
    	}

    	set overlayFill(overlayFill) {
    		this.$$set({ overlayFill });
    		flush();
    	}
    }

    /* src/charts/DotPlot.svelte generated by Svelte v3.43.1 */
    const file$c = "src/charts/DotPlot.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (37:3) {#each $xGet(row) as circleX, i}
    function create_each_block_1$2(ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_fill_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", circle_cx_value = /*circleX*/ ctx[17]);
    			attr_dev(circle, "cy", circle_cy_value = /*$yGet*/ ctx[4](/*row*/ ctx[14]) + /*midHeight*/ ctx[1]);
    			attr_dev(circle, "r", /*r*/ ctx[0]);
    			attr_dev(circle, "fill", circle_fill_value = /*$zScale*/ ctx[5](/*$config*/ ctx[6].x[/*i*/ ctx[19]]));
    			attr_dev(circle, "class", "svelte-1mc14eq");
    			add_location(circle, file$c, 37, 4, 1043);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xGet, $data*/ 12 && circle_cx_value !== (circle_cx_value = /*circleX*/ ctx[17])) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty & /*$yGet, $data, midHeight*/ 22 && circle_cy_value !== (circle_cy_value = /*$yGet*/ ctx[4](/*row*/ ctx[14]) + /*midHeight*/ ctx[1])) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty & /*r*/ 1) {
    				attr_dev(circle, "r", /*r*/ ctx[0]);
    			}

    			if (dirty & /*$zScale, $config*/ 96 && circle_fill_value !== (circle_fill_value = /*$zScale*/ ctx[5](/*$config*/ ctx[6].x[/*i*/ ctx[19]]))) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(37:3) {#each $xGet(row) as circleX, i}",
    		ctx
    	});

    	return block;
    }

    // (13:1) {#each $data as row}
    function create_each_block$7(ctx) {
    	let g;
    	let defs0;
    	let linearGradient0;
    	let stop0;
    	let stop1;
    	let defs1;
    	let linearGradient1;
    	let stop2;
    	let stop3;
    	let rect;
    	let rect_x_value;
    	let rect_y_value;
    	let rect_width_value;
    	let rect_fill_value;
    	let each_value_1 = /*$xGet*/ ctx[3](/*row*/ ctx[14]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			defs0 = svg_element("defs");
    			linearGradient0 = svg_element("linearGradient");
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			defs1 = svg_element("defs");
    			linearGradient1 = svg_element("linearGradient");
    			stop2 = svg_element("stop");
    			stop3 = svg_element("stop");
    			rect = svg_element("rect");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(stop0, "offset", "5%");
    			attr_dev(stop0, "stop-color", "#3C388E10");
    			add_location(stop0, file$c, 16, 4, 388);
    			attr_dev(stop1, "offset", "95%");
    			attr_dev(stop1, "stop-color", "#3C388E80");
    			add_location(stop1, file$c, 17, 4, 437);
    			attr_dev(linearGradient0, "id", "myGradient");
    			attr_dev(linearGradient0, "gradientTransform", "rotate(0)");
    			add_location(linearGradient0, file$c, 15, 4, 321);
    			add_location(defs0, file$c, 14, 3, 310);
    			attr_dev(stop2, "offset", "5%");
    			attr_dev(stop2, "stop-color", "#3C388E80");
    			add_location(stop2, file$c, 22, 4, 599);
    			attr_dev(stop3, "offset", "95%");
    			attr_dev(stop3, "stop-color", "#3C388E10");
    			add_location(stop3, file$c, 23, 4, 648);
    			attr_dev(linearGradient1, "id", "myGradientRev");
    			attr_dev(linearGradient1, "gradientTransform", "rotate(0)");
    			add_location(linearGradient1, file$c, 21, 4, 529);
    			add_location(defs1, file$c, 20, 3, 518);
    			attr_dev(rect, "x", rect_x_value = Math.min(.../*$xGet*/ ctx[3](/*row*/ ctx[14])));
    			attr_dev(rect, "y", rect_y_value = /*$yGet*/ ctx[4](/*row*/ ctx[14]) + /*midHeight*/ ctx[1] - 7);
    			attr_dev(rect, "width", rect_width_value = Math.max(.../*$xGet*/ ctx[3](/*row*/ ctx[14])) - Math.min(.../*$xGet*/ ctx[3](/*row*/ ctx[14])));
    			attr_dev(rect, "height", "14");

    			attr_dev(rect, "fill", rect_fill_value = /*row*/ ctx[14][2021] - /*row*/ ctx[14][2011] > 0
    			? "url('#myGradient')"
    			: "url('#myGradientRev')");

    			attr_dev(rect, "opacity", "0.85");
    			add_location(rect, file$c, 27, 3, 730);
    			attr_dev(g, "class", "dot-row");
    			add_location(g, file$c, 13, 2, 287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, defs0);
    			append_dev(defs0, linearGradient0);
    			append_dev(linearGradient0, stop0);
    			append_dev(linearGradient0, stop1);
    			append_dev(g, defs1);
    			append_dev(defs1, linearGradient1);
    			append_dev(linearGradient1, stop2);
    			append_dev(linearGradient1, stop3);
    			append_dev(g, rect);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$xGet, $data*/ 12 && rect_x_value !== (rect_x_value = Math.min(.../*$xGet*/ ctx[3](/*row*/ ctx[14])))) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*$yGet, $data, midHeight*/ 22 && rect_y_value !== (rect_y_value = /*$yGet*/ ctx[4](/*row*/ ctx[14]) + /*midHeight*/ ctx[1] - 7)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*$xGet, $data*/ 12 && rect_width_value !== (rect_width_value = Math.max(.../*$xGet*/ ctx[3](/*row*/ ctx[14])) - Math.min(.../*$xGet*/ ctx[3](/*row*/ ctx[14])))) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			if (dirty & /*$data*/ 4 && rect_fill_value !== (rect_fill_value = /*row*/ ctx[14][2021] - /*row*/ ctx[14][2011] > 0
    			? "url('#myGradient')"
    			: "url('#myGradientRev')")) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (dirty & /*$xGet, $data, $yGet, midHeight, r, $zScale, $config*/ 127) {
    				each_value_1 = /*$xGet*/ ctx[3](/*row*/ ctx[14]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(13:1) {#each $data as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let g;
    	let each_value = /*$data*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "dot-plot");
    			add_location(g, file$c, 11, 0, 242);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$xGet, $data, $yGet, midHeight, r, $zScale, $config, Math*/ 127) {
    				each_value = /*$data*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let midHeight;
    	let $yScale;
    	let $data;
    	let $xGet;
    	let $yGet;
    	let $zScale;
    	let $config;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DotPlot', slots, []);
    	const { data, xGet, yGet, yScale, zScale, config } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(2, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(3, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(4, $yGet = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(13, $yScale = value));
    	validate_store(zScale, 'zScale');
    	component_subscribe($$self, zScale, value => $$invalidate(5, $zScale = value));
    	validate_store(config, 'config');
    	component_subscribe($$self, config, value => $$invalidate(6, $config = value));
    	let { r = 7 } = $$props;
    	const writable_props = ['r'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DotPlot> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('r' in $$props) $$invalidate(0, r = $$props.r);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		scaleOrdinal: ordinal,
    		data,
    		xGet,
    		yGet,
    		yScale,
    		zScale,
    		config,
    		r,
    		midHeight,
    		$yScale,
    		$data,
    		$xGet,
    		$yGet,
    		$zScale,
    		$config
    	});

    	$$self.$inject_state = $$props => {
    		if ('r' in $$props) $$invalidate(0, r = $$props.r);
    		if ('midHeight' in $$props) $$invalidate(1, midHeight = $$props.midHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$yScale*/ 8192) {
    			$$invalidate(1, midHeight = $yScale.bandwidth() / 2);
    		}
    	};

    	return [
    		r,
    		midHeight,
    		$data,
    		$xGet,
    		$yGet,
    		$zScale,
    		$config,
    		data,
    		xGet,
    		yGet,
    		yScale,
    		zScale,
    		config,
    		$yScale
    	];
    }

    class DotPlot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { r: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DotPlot",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get r() {
    		throw new Error("<DotPlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<DotPlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/DotLabels.svelte generated by Svelte v3.43.1 */
    const file$b = "src/charts/DotLabels.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (10:0) {#each $xGet(row) as circleX, i}
    function create_each_block_1$1(ctx) {
    	let div;

    	let t_value = (/*i*/ ctx[16] == 0
    	? 'least deprived'
    	: /*i*/ ctx[16] == 1 ? 'most deprived' : 'average') + "";

    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "label " + (/*i*/ ctx[16] == 2 ? 'below' : 'above') + " svelte-1cj7kw2");
    			set_style(div, "top", /*$yGet*/ ctx[3](/*row*/ ctx[11]) + /*midHeight*/ ctx[0] + "px");
    			set_style(div, "left", /*circleX*/ ctx[14] + "px");
    			add_location(div, file$b, 10, 0, 237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$yGet, $data, midHeight*/ 11) {
    				set_style(div, "top", /*$yGet*/ ctx[3](/*row*/ ctx[11]) + /*midHeight*/ ctx[0] + "px");
    			}

    			if (dirty & /*$xGet, $data*/ 6) {
    				set_style(div, "left", /*circleX*/ ctx[14] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(10:0) {#each $xGet(row) as circleX, i}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#each $data as row}
    function create_each_block$6(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*$xGet*/ ctx[2](/*row*/ ctx[11]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$yGet, $data, midHeight, $xGet*/ 15) {
    				each_value_1 = /*$xGet*/ ctx[2](/*row*/ ctx[11]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(9:0) {#each $data as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let each_1_anchor;
    	let each_value = /*$data*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$xGet, $data, $yGet, midHeight*/ 15) {
    				each_value = /*$data*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let midHeight;
    	let $yScale;
    	let $data;
    	let $xGet;
    	let $yGet;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DotLabels', slots, []);
    	const { data, xGet, yGet, yScale, zScale, config } = getContext('LayerCake');
    	validate_store(data, 'data');
    	component_subscribe($$self, data, value => $$invalidate(1, $data = value));
    	validate_store(xGet, 'xGet');
    	component_subscribe($$self, xGet, value => $$invalidate(2, $xGet = value));
    	validate_store(yGet, 'yGet');
    	component_subscribe($$self, yGet, value => $$invalidate(3, $yGet = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(8, $yScale = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DotLabels> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		data,
    		xGet,
    		yGet,
    		yScale,
    		zScale,
    		config,
    		midHeight,
    		$yScale,
    		$data,
    		$xGet,
    		$yGet
    	});

    	$$self.$inject_state = $$props => {
    		if ('midHeight' in $$props) $$invalidate(0, midHeight = $$props.midHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$yScale*/ 256) {
    			$$invalidate(0, midHeight = $yScale.bandwidth() / 2);
    		}
    	};

    	return [midHeight, $data, $xGet, $yGet, data, xGet, yGet, yScale, $yScale];
    }

    class DotLabels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DotLabels",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/charts/AxisX.svelte generated by Svelte v3.43.1 */
    const file$a = "src/charts/AxisX.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    // (45:3) {#if gridlines !== false}
    function create_if_block_2$3(ctx) {
    	let line;
    	let line_y__value;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "y1", line_y__value = /*$height*/ ctx[17] * -1);
    			attr_dev(line, "y2", /*dyTick*/ ctx[9]);
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", "0");
    			attr_dev(line, "stroke", /*lineColor*/ ctx[10]);
    			attr_dev(line, "class", "svelte-1u7vzrc");
    			toggle_class(line, "baseline", /*solid*/ ctx[12]);
    			add_location(line, file$a, 45, 4, 1094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 131072 && line_y__value !== (line_y__value = /*$height*/ ctx[17] * -1)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*dyTick*/ 512) {
    				attr_dev(line, "y2", /*dyTick*/ ctx[9]);
    			}

    			if (dirty & /*lineColor*/ 1024) {
    				attr_dev(line, "stroke", /*lineColor*/ ctx[10]);
    			}

    			if (dirty & /*solid*/ 4096) {
    				toggle_class(line, "baseline", /*solid*/ ctx[12]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(45:3) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {:else}
    function create_else_block$4(ctx) {
    	let t_value = /*formatTick*/ ctx[1](/*tick*/ ctx[27]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formatTick, tickVals*/ 32770 && t_value !== (t_value = /*formatTick*/ ctx[1](/*tick*/ ctx[27]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(57:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#if i == tickVals.length - 1}
    function create_if_block_1$4(ctx) {
    	let t0;
    	let t1_value = /*formatTick*/ ctx[1](/*tick*/ ctx[27]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(/*prefix*/ ctx[4]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 16) set_data_dev(t0, /*prefix*/ ctx[4]);
    			if (dirty & /*formatTick, tickVals*/ 32770 && t1_value !== (t1_value = /*formatTick*/ ctx[1](/*tick*/ ctx[27]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 32) set_data_dev(t2, /*suffix*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(55:4) {#if i == tickVals.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (43:1) {#each tickVals as tick, i}
    function create_each_block$5(ctx) {
    	let g;
    	let text_1;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_dx_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[0] !== false && create_if_block_2$3(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[29] == /*tickVals*/ ctx[15].length - 1) return create_if_block_1$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			text_1 = svg_element("text");
    			if_block1.c();

    			attr_dev(text_1, "x", text_1_x_value = /*xTick*/ ctx[6] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0);

    			attr_dev(text_1, "y", text_1_y_value = /*flipped*/ ctx[3]
    			? /*$height*/ ctx[17] * -1 - 6
    			: /*yTick*/ ctx[7]);

    			attr_dev(text_1, "dx", text_1_dx_value = /*textAnchor*/ ctx[21](/*i*/ ctx[29]) == 'start'
    			? /*dxTick*/ ctx[8] - 2
    			: /*textAnchor*/ ctx[21](/*i*/ ctx[29]) == 'end'
    				? /*dxTick*/ ctx[8] + 2
    				: /*dxTick*/ ctx[8]);

    			attr_dev(text_1, "dy", /*dyTick*/ ctx[9]);
    			attr_dev(text_1, "text-anchor", /*textAnchor*/ ctx[21](/*i*/ ctx[29]));
    			attr_dev(text_1, "fill", /*textColor*/ ctx[11]);
    			add_location(text_1, file$a, 47, 3, 1214);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[27] + " svelte-1u7vzrc");
    			attr_dev(g, "transform", g_transform_value = "translate(" + /*$xScale*/ ctx[14](/*tick*/ ctx[27]) + "," + /*$yRange*/ ctx[16][0] + ")");
    			add_location(g, file$a, 43, 2, 978);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, text_1);
    			if_block1.m(text_1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[0] !== false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(g, text_1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(text_1, null);
    				}
    			}

    			if (dirty & /*xTick, isBandwidth, $xScale*/ 24640 && text_1_x_value !== (text_1_x_value = /*xTick*/ ctx[6] || /*isBandwidth*/ ctx[13]
    			? /*$xScale*/ ctx[14].bandwidth() / 2
    			: 0)) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty & /*flipped, $height, yTick*/ 131208 && text_1_y_value !== (text_1_y_value = /*flipped*/ ctx[3]
    			? /*$height*/ ctx[17] * -1 - 6
    			: /*yTick*/ ctx[7])) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*dxTick*/ 256 && text_1_dx_value !== (text_1_dx_value = /*textAnchor*/ ctx[21](/*i*/ ctx[29]) == 'start'
    			? /*dxTick*/ ctx[8] - 2
    			: /*textAnchor*/ ctx[21](/*i*/ ctx[29]) == 'end'
    				? /*dxTick*/ ctx[8] + 2
    				: /*dxTick*/ ctx[8])) {
    				attr_dev(text_1, "dx", text_1_dx_value);
    			}

    			if (dirty & /*dyTick*/ 512) {
    				attr_dev(text_1, "dy", /*dyTick*/ ctx[9]);
    			}

    			if (dirty & /*textColor*/ 2048) {
    				attr_dev(text_1, "fill", /*textColor*/ ctx[11]);
    			}

    			if (dirty & /*tickVals*/ 32768 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[27] + " svelte-1u7vzrc")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xScale, tickVals, $yRange*/ 114688 && g_transform_value !== (g_transform_value = "translate(" + /*$xScale*/ ctx[14](/*tick*/ ctx[27]) + "," + /*$yRange*/ ctx[16][0] + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(43:1) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    // (63:1) {#if baseline === true}
    function create_if_block$6(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "baseline svelte-1u7vzrc");
    			attr_dev(line, "y1", /*$height*/ ctx[17]);
    			attr_dev(line, "y2", "0");
    			attr_dev(line, "x1", "0");
    			attr_dev(line, "x2", "0");
    			attr_dev(line, "stroke", /*lineColor*/ ctx[10]);
    			add_location(line, file$a, 63, 2, 1674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$height*/ 131072) {
    				attr_dev(line, "y1", /*$height*/ ctx[17]);
    			}

    			if (dirty & /*lineColor*/ 1024) {
    				attr_dev(line, "stroke", /*lineColor*/ ctx[10]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(63:1) {#if baseline === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let g;
    	let each_1_anchor;
    	let each_value = /*tickVals*/ ctx[15];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	let if_block = /*baseline*/ ctx[2] === true && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			if (if_block) if_block.c();
    			attr_dev(g, "class", "axis x-axis");
    			add_location(g, file$a, 41, 0, 923);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			append_dev(g, each_1_anchor);
    			if (if_block) if_block.m(g, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xScale, $yRange, xTick, isBandwidth, flipped, $height, yTick, textAnchor, dxTick, dyTick, textColor, suffix, formatTick, prefix, lineColor, solid, gridlines*/ 2359291) {
    				each_value = /*tickVals*/ ctx[15];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*baseline*/ ctx[2] === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					if_block.m(g, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $xScale;
    	let $yRange;
    	let $height;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisX', slots, []);
    	const { data, width, height, xScale, yScale, yRange } = getContext('LayerCake');
    	validate_store(height, 'height');
    	component_subscribe($$self, height, value => $$invalidate(17, $height = value));
    	validate_store(xScale, 'xScale');
    	component_subscribe($$self, xScale, value => $$invalidate(14, $xScale = value));
    	validate_store(yRange, 'yRange');
    	component_subscribe($$self, yRange, value => $$invalidate(16, $yRange = value));
    	let { gridlines = true } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { baseline = false } = $$props;
    	let { flipped = false } = $$props;
    	let { snapTicks = false } = $$props;
    	let { ticks = undefined } = $$props;
    	let { prefix = '' } = $$props;
    	let { suffix = '' } = $$props;
    	let { xTick = undefined } = $$props;
    	let { yTick = 15 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = 0 } = $$props;
    	let { lineColor = '#aaa' } = $$props;
    	let { textColor = '#666' } = $$props;
    	let { solid = false } = $$props;

    	function textAnchor(i) {
    		if (snapTicks === true) {
    			if (i === 0) {
    				return 'start';
    			}

    			if (i === tickVals.length - 1) {
    				return 'end';
    			}
    		}

    		return 'middle';
    	}

    	const writable_props = [
    		'gridlines',
    		'formatTick',
    		'baseline',
    		'flipped',
    		'snapTicks',
    		'ticks',
    		'prefix',
    		'suffix',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick',
    		'lineColor',
    		'textColor',
    		'solid'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisX> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(1, formatTick = $$props.formatTick);
    		if ('baseline' in $$props) $$invalidate(2, baseline = $$props.baseline);
    		if ('flipped' in $$props) $$invalidate(3, flipped = $$props.flipped);
    		if ('snapTicks' in $$props) $$invalidate(22, snapTicks = $$props.snapTicks);
    		if ('ticks' in $$props) $$invalidate(23, ticks = $$props.ticks);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(5, suffix = $$props.suffix);
    		if ('xTick' in $$props) $$invalidate(6, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(7, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(8, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(9, dyTick = $$props.dyTick);
    		if ('lineColor' in $$props) $$invalidate(10, lineColor = $$props.lineColor);
    		if ('textColor' in $$props) $$invalidate(11, textColor = $$props.textColor);
    		if ('solid' in $$props) $$invalidate(12, solid = $$props.solid);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		data,
    		width,
    		height,
    		xScale,
    		yScale,
    		yRange,
    		gridlines,
    		formatTick,
    		baseline,
    		flipped,
    		snapTicks,
    		ticks,
    		prefix,
    		suffix,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		lineColor,
    		textColor,
    		solid,
    		textAnchor,
    		tickVals,
    		isBandwidth,
    		$xScale,
    		$yRange,
    		$height
    	});

    	$$self.$inject_state = $$props => {
    		if ('gridlines' in $$props) $$invalidate(0, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(1, formatTick = $$props.formatTick);
    		if ('baseline' in $$props) $$invalidate(2, baseline = $$props.baseline);
    		if ('flipped' in $$props) $$invalidate(3, flipped = $$props.flipped);
    		if ('snapTicks' in $$props) $$invalidate(22, snapTicks = $$props.snapTicks);
    		if ('ticks' in $$props) $$invalidate(23, ticks = $$props.ticks);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(5, suffix = $$props.suffix);
    		if ('xTick' in $$props) $$invalidate(6, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(7, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(8, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(9, dyTick = $$props.dyTick);
    		if ('lineColor' in $$props) $$invalidate(10, lineColor = $$props.lineColor);
    		if ('textColor' in $$props) $$invalidate(11, textColor = $$props.textColor);
    		if ('solid' in $$props) $$invalidate(12, solid = $$props.solid);
    		if ('tickVals' in $$props) $$invalidate(15, tickVals = $$props.tickVals);
    		if ('isBandwidth' in $$props) $$invalidate(13, isBandwidth = $$props.isBandwidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$xScale*/ 16384) {
    			$$invalidate(13, isBandwidth = typeof $xScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $xScale*/ 8413184) {
    			$$invalidate(15, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth ? $xScale.domain() : $xScale.ticks(ticks));
    		}
    	};

    	return [
    		gridlines,
    		formatTick,
    		baseline,
    		flipped,
    		prefix,
    		suffix,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		lineColor,
    		textColor,
    		solid,
    		isBandwidth,
    		$xScale,
    		tickVals,
    		$yRange,
    		$height,
    		height,
    		xScale,
    		yRange,
    		textAnchor,
    		snapTicks,
    		ticks
    	];
    }

    class AxisX extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			gridlines: 0,
    			formatTick: 1,
    			baseline: 2,
    			flipped: 3,
    			snapTicks: 22,
    			ticks: 23,
    			prefix: 4,
    			suffix: 5,
    			xTick: 6,
    			yTick: 7,
    			dxTick: 8,
    			dyTick: 9,
    			lineColor: 10,
    			textColor: 11,
    			solid: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisX",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get gridlines() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseline() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseline(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flipped() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flipped(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snapTicks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snapTicks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineColor() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineColor(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get solid() {
    		throw new Error("<AxisX>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set solid(value) {
    		throw new Error("<AxisX>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/AxisY.svelte generated by Svelte v3.43.1 */
    const file$9 = "src/charts/AxisY.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (31:3) {#if gridlines !== false}
    function create_if_block_1$3(ctx) {
    	let line;
    	let line_y__value;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x2", "100%");

    			attr_dev(line, "y1", line_y__value = /*yTick*/ ctx[5] + (/*isBandwidth*/ ctx[12]
    			? /*$yScale*/ ctx[13].bandwidth() / 2
    			: 0));

    			attr_dev(line, "y2", line_y__value_1 = /*yTick*/ ctx[5] + (/*isBandwidth*/ ctx[12]
    			? /*$yScale*/ ctx[13].bandwidth() / 2
    			: 0));

    			attr_dev(line, "stroke", /*lineColor*/ ctx[9]);
    			attr_dev(line, "class", "svelte-e79qfe");
    			toggle_class(line, "baseline", /*solid*/ ctx[11]);
    			add_location(line, file$9, 31, 4, 905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTick, isBandwidth, $yScale*/ 12320 && line_y__value !== (line_y__value = /*yTick*/ ctx[5] + (/*isBandwidth*/ ctx[12]
    			? /*$yScale*/ ctx[13].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 12320 && line_y__value_1 !== (line_y__value_1 = /*yTick*/ ctx[5] + (/*isBandwidth*/ ctx[12]
    			? /*$yScale*/ ctx[13].bandwidth() / 2
    			: 0))) {
    				attr_dev(line, "y2", line_y__value_1);
    			}

    			if (dirty & /*lineColor*/ 512) {
    				attr_dev(line, "stroke", /*lineColor*/ ctx[9]);
    			}

    			if (dirty & /*solid*/ 2048) {
    				toggle_class(line, "baseline", /*solid*/ ctx[11]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(31:3) {#if gridlines !== false}",
    		ctx
    	});

    	return block;
    }

    // (50:4) {:else}
    function create_else_block$3(ctx) {
    	let t_value = /*formatTick*/ ctx[3](/*tick*/ ctx[22]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formatTick, tickVals*/ 16392 && t_value !== (t_value = /*formatTick*/ ctx[3](/*tick*/ ctx[22]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if i == tickVals.length - 1}
    function create_if_block$5(ctx) {
    	let t0;
    	let t1_value = /*formatTick*/ ctx[3](/*tick*/ ctx[22]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(/*prefix*/ ctx[0]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 1) set_data_dev(t0, /*prefix*/ ctx[0]);
    			if (dirty & /*formatTick, tickVals*/ 16392 && t1_value !== (t1_value = /*formatTick*/ ctx[3](/*tick*/ ctx[22]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 2) set_data_dev(t2, /*suffix*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(48:4) {#if i == tickVals.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (29:1) {#each tickVals as tick, i}
    function create_each_block$4(ctx) {
    	let g;
    	let text_1;
    	let text_1_y_value;
    	let text_1_dx_value;
    	let text_1_dy_value;
    	let g_class_value;
    	let g_transform_value;
    	let if_block0 = /*gridlines*/ ctx[2] !== false && create_if_block_1$3(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[24] == /*tickVals*/ ctx[14].length - 1) return create_if_block$5;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			text_1 = svg_element("text");
    			if_block1.c();
    			attr_dev(text_1, "x", /*xTick*/ ctx[4]);

    			attr_dev(text_1, "y", text_1_y_value = /*yTick*/ ctx[5] + (/*isBandwidth*/ ctx[12]
    			? /*$yScale*/ ctx[13].bandwidth() / 2
    			: 0));

    			attr_dev(text_1, "dx", text_1_dx_value = /*isBandwidth*/ ctx[12] ? 3 : /*dxTick*/ ctx[6]);
    			attr_dev(text_1, "dy", text_1_dy_value = /*isBandwidth*/ ctx[12] ? 4 : /*dyTick*/ ctx[7]);
    			attr_dev(text_1, "fill", /*textColor*/ ctx[10]);
    			set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[12] ? 'end' : /*textAnchor*/ ctx[8]);
    			add_location(text_1, file$9, 39, 3, 1137);
    			attr_dev(g, "class", g_class_value = "tick tick-" + /*tick*/ ctx[22] + " svelte-e79qfe");
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*$xRange*/ ctx[16][0] + (/*isBandwidth*/ ctx[12] ? /*$padding*/ ctx[15].left : 0)) + ", " + /*$yScale*/ ctx[13](/*tick*/ ctx[22]) + ")");
    			add_location(g, file$9, 29, 2, 754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, text_1);
    			if_block1.m(text_1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*gridlines*/ ctx[2] !== false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(g, text_1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(text_1, null);
    				}
    			}

    			if (dirty & /*xTick*/ 16) {
    				attr_dev(text_1, "x", /*xTick*/ ctx[4]);
    			}

    			if (dirty & /*yTick, isBandwidth, $yScale*/ 12320 && text_1_y_value !== (text_1_y_value = /*yTick*/ ctx[5] + (/*isBandwidth*/ ctx[12]
    			? /*$yScale*/ ctx[13].bandwidth() / 2
    			: 0))) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty & /*isBandwidth, dxTick*/ 4160 && text_1_dx_value !== (text_1_dx_value = /*isBandwidth*/ ctx[12] ? 3 : /*dxTick*/ ctx[6])) {
    				attr_dev(text_1, "dx", text_1_dx_value);
    			}

    			if (dirty & /*isBandwidth, dyTick*/ 4224 && text_1_dy_value !== (text_1_dy_value = /*isBandwidth*/ ctx[12] ? 4 : /*dyTick*/ ctx[7])) {
    				attr_dev(text_1, "dy", text_1_dy_value);
    			}

    			if (dirty & /*textColor*/ 1024) {
    				attr_dev(text_1, "fill", /*textColor*/ ctx[10]);
    			}

    			if (dirty & /*isBandwidth, textAnchor*/ 4352) {
    				set_style(text_1, "text-anchor", /*isBandwidth*/ ctx[12] ? 'end' : /*textAnchor*/ ctx[8]);
    			}

    			if (dirty & /*tickVals*/ 16384 && g_class_value !== (g_class_value = "tick tick-" + /*tick*/ ctx[22] + " svelte-e79qfe")) {
    				attr_dev(g, "class", g_class_value);
    			}

    			if (dirty & /*$xRange, isBandwidth, $padding, $yScale, tickVals*/ 126976 && g_transform_value !== (g_transform_value = "translate(" + (/*$xRange*/ ctx[16][0] + (/*isBandwidth*/ ctx[12] ? /*$padding*/ ctx[15].left : 0)) + ", " + /*$yScale*/ ctx[13](/*tick*/ ctx[22]) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(29:1) {#each tickVals as tick, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let g;
    	let g_transform_value;
    	let each_value = /*tickVals*/ ctx[14];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "class", "axis y-axis");
    			attr_dev(g, "transform", g_transform_value = "translate(" + -/*$padding*/ ctx[15].left + ", 0)");
    			add_location(g, file$9, 27, 0, 656);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tickVals, $xRange, isBandwidth, $padding, $yScale, xTick, yTick, dxTick, dyTick, textColor, textAnchor, suffix, formatTick, prefix, lineColor, solid, gridlines*/ 131071) {
    				each_value = /*tickVals*/ ctx[14];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$padding*/ 32768 && g_transform_value !== (g_transform_value = "translate(" + -/*$padding*/ ctx[15].left + ", 0)")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let isBandwidth;
    	let tickVals;
    	let $yScale;
    	let $padding;
    	let $xRange;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AxisY', slots, []);
    	const { padding, xRange, xScale, yScale } = getContext('LayerCake');
    	validate_store(padding, 'padding');
    	component_subscribe($$self, padding, value => $$invalidate(15, $padding = value));
    	validate_store(xRange, 'xRange');
    	component_subscribe($$self, xRange, value => $$invalidate(16, $xRange = value));
    	validate_store(yScale, 'yScale');
    	component_subscribe($$self, yScale, value => $$invalidate(13, $yScale = value));
    	let { ticks = 4 } = $$props;
    	let { prefix = '' } = $$props;
    	let { suffix = '' } = $$props;
    	let { gridlines = true } = $$props;
    	let { formatTick = d => d } = $$props;
    	let { xTick = 0 } = $$props;
    	let { yTick = 0 } = $$props;
    	let { dxTick = 0 } = $$props;
    	let { dyTick = -4 } = $$props;
    	let { textAnchor = 'start' } = $$props;
    	let { lineColor = '#aaa' } = $$props;
    	let { textColor = '#666' } = $$props;
    	let { solid = false } = $$props;

    	const writable_props = [
    		'ticks',
    		'prefix',
    		'suffix',
    		'gridlines',
    		'formatTick',
    		'xTick',
    		'yTick',
    		'dxTick',
    		'dyTick',
    		'textAnchor',
    		'lineColor',
    		'textColor',
    		'solid'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AxisY> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ticks' in $$props) $$invalidate(20, ticks = $$props.ticks);
    		if ('prefix' in $$props) $$invalidate(0, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(1, suffix = $$props.suffix);
    		if ('gridlines' in $$props) $$invalidate(2, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(3, formatTick = $$props.formatTick);
    		if ('xTick' in $$props) $$invalidate(4, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(5, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(6, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(7, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(8, textAnchor = $$props.textAnchor);
    		if ('lineColor' in $$props) $$invalidate(9, lineColor = $$props.lineColor);
    		if ('textColor' in $$props) $$invalidate(10, textColor = $$props.textColor);
    		if ('solid' in $$props) $$invalidate(11, solid = $$props.solid);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		padding,
    		xRange,
    		xScale,
    		yScale,
    		ticks,
    		prefix,
    		suffix,
    		gridlines,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		lineColor,
    		textColor,
    		solid,
    		isBandwidth,
    		tickVals,
    		$yScale,
    		$padding,
    		$xRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('ticks' in $$props) $$invalidate(20, ticks = $$props.ticks);
    		if ('prefix' in $$props) $$invalidate(0, prefix = $$props.prefix);
    		if ('suffix' in $$props) $$invalidate(1, suffix = $$props.suffix);
    		if ('gridlines' in $$props) $$invalidate(2, gridlines = $$props.gridlines);
    		if ('formatTick' in $$props) $$invalidate(3, formatTick = $$props.formatTick);
    		if ('xTick' in $$props) $$invalidate(4, xTick = $$props.xTick);
    		if ('yTick' in $$props) $$invalidate(5, yTick = $$props.yTick);
    		if ('dxTick' in $$props) $$invalidate(6, dxTick = $$props.dxTick);
    		if ('dyTick' in $$props) $$invalidate(7, dyTick = $$props.dyTick);
    		if ('textAnchor' in $$props) $$invalidate(8, textAnchor = $$props.textAnchor);
    		if ('lineColor' in $$props) $$invalidate(9, lineColor = $$props.lineColor);
    		if ('textColor' in $$props) $$invalidate(10, textColor = $$props.textColor);
    		if ('solid' in $$props) $$invalidate(11, solid = $$props.solid);
    		if ('isBandwidth' in $$props) $$invalidate(12, isBandwidth = $$props.isBandwidth);
    		if ('tickVals' in $$props) $$invalidate(14, tickVals = $$props.tickVals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$yScale*/ 8192) {
    			$$invalidate(12, isBandwidth = typeof $yScale.bandwidth === 'function');
    		}

    		if ($$self.$$.dirty & /*ticks, isBandwidth, $yScale*/ 1060864) {
    			$$invalidate(14, tickVals = Array.isArray(ticks)
    			? ticks
    			: isBandwidth ? $yScale.domain() : $yScale.ticks(ticks));
    		}
    	};

    	return [
    		prefix,
    		suffix,
    		gridlines,
    		formatTick,
    		xTick,
    		yTick,
    		dxTick,
    		dyTick,
    		textAnchor,
    		lineColor,
    		textColor,
    		solid,
    		isBandwidth,
    		$yScale,
    		tickVals,
    		$padding,
    		$xRange,
    		padding,
    		xRange,
    		yScale,
    		ticks
    	];
    }

    class AxisY extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			ticks: 20,
    			prefix: 0,
    			suffix: 1,
    			gridlines: 2,
    			formatTick: 3,
    			xTick: 4,
    			yTick: 5,
    			dxTick: 6,
    			dyTick: 7,
    			textAnchor: 8,
    			lineColor: 9,
    			textColor: 10,
    			solid: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AxisY",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get ticks() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridlines() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridlines(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dxTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dxTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dyTick() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dyTick(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textAnchor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textAnchor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lineColor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lineColor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get solid() {
    		throw new Error("<AxisY>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set solid(value) {
    		throw new Error("<AxisY>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/Legend.svelte generated by Svelte v3.43.1 */

    const { console: console_1$3 } = globals;
    const file$8 = "src/charts/Legend.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (16:4) {#each domain as label, i}
    function create_each_block$3(ctx) {
    	let li;
    	let div;
    	let t0;
    	let t1_value = /*label*/ ctx[8] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(div, "class", "bullet svelte-o1q0c0");
    			set_style(div, "background-color", /*colors*/ ctx[1][/*i*/ ctx[10]]);

    			set_style(div, "width", (!/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    			? /*markerWidth*/ ctx[5]
    			: /*markerLength*/ ctx[6]) + "px");

    			set_style(div, "height", (/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    			? /*markerWidth*/ ctx[5]
    			: /*markerLength*/ ctx[6]) + "px");

    			toggle_class(div, "round", /*round*/ ctx[7]);
    			add_location(div, file$8, 17, 8, 597);
    			attr_dev(li, "class", "svelte-o1q0c0");
    			add_location(li, file$8, 16, 6, 584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*colors*/ 2) {
    				set_style(div, "background-color", /*colors*/ ctx[1][/*i*/ ctx[10]]);
    			}

    			if (dirty & /*horizontal, line, comparison, markerWidth, markerLength*/ 124) {
    				set_style(div, "width", (!/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    				? /*markerWidth*/ ctx[5]
    				: /*markerLength*/ ctx[6]) + "px");
    			}

    			if (dirty & /*horizontal, line, comparison, markerWidth, markerLength*/ 124) {
    				set_style(div, "height", (/*horizontal*/ ctx[4] && (/*line*/ ctx[2] || /*comparison*/ ctx[3] && /*i*/ ctx[10] != 0)
    				? /*markerWidth*/ ctx[5]
    				: /*markerLength*/ ctx[6]) + "px");
    			}

    			if (dirty & /*round*/ 128) {
    				toggle_class(div, "round", /*round*/ ctx[7]);
    			}

    			if (dirty & /*domain*/ 1 && t1_value !== (t1_value = /*label*/ ctx[8] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(16:4) {#each domain as label, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let ul;
    	let each_value = /*domain*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "legend svelte-o1q0c0");
    			add_location(ul, file$8, 14, 2, 527);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*domain, colors, horizontal, line, comparison, markerWidth, markerLength, round*/ 255) {
    				each_value = /*domain*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Legend', slots, []);
    	let { domain = null } = $$props;
    	let { colors = null } = $$props;
    	let { line = false } = $$props;
    	let { comparison = false } = $$props;
    	let { horizontal = true } = $$props;
    	let { markerWidth = 2.5 } = $$props;
    	let { markerLength = 13 } = $$props;
    	let { round = false } = $$props;
    	console.log("DOMAIN", domain);

    	const writable_props = [
    		'domain',
    		'colors',
    		'line',
    		'comparison',
    		'horizontal',
    		'markerWidth',
    		'markerLength',
    		'round'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Legend> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('domain' in $$props) $$invalidate(0, domain = $$props.domain);
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    		if ('line' in $$props) $$invalidate(2, line = $$props.line);
    		if ('comparison' in $$props) $$invalidate(3, comparison = $$props.comparison);
    		if ('horizontal' in $$props) $$invalidate(4, horizontal = $$props.horizontal);
    		if ('markerWidth' in $$props) $$invalidate(5, markerWidth = $$props.markerWidth);
    		if ('markerLength' in $$props) $$invalidate(6, markerLength = $$props.markerLength);
    		if ('round' in $$props) $$invalidate(7, round = $$props.round);
    	};

    	$$self.$capture_state = () => ({
    		domain,
    		colors,
    		line,
    		comparison,
    		horizontal,
    		markerWidth,
    		markerLength,
    		round
    	});

    	$$self.$inject_state = $$props => {
    		if ('domain' in $$props) $$invalidate(0, domain = $$props.domain);
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    		if ('line' in $$props) $$invalidate(2, line = $$props.line);
    		if ('comparison' in $$props) $$invalidate(3, comparison = $$props.comparison);
    		if ('horizontal' in $$props) $$invalidate(4, horizontal = $$props.horizontal);
    		if ('markerWidth' in $$props) $$invalidate(5, markerWidth = $$props.markerWidth);
    		if ('markerLength' in $$props) $$invalidate(6, markerLength = $$props.markerLength);
    		if ('round' in $$props) $$invalidate(7, round = $$props.round);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [domain, colors, line, comparison, horizontal, markerWidth, markerLength, round];
    }

    class Legend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			domain: 0,
    			colors: 1,
    			line: 2,
    			comparison: 3,
    			horizontal: 4,
    			markerWidth: 5,
    			markerLength: 6,
    			round: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Legend",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get domain() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set domain(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get line() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set line(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get comparison() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set comparison(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get horizontal() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get markerWidth() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set markerWidth(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get markerLength() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set markerLength(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get round() {
    		throw new Error("<Legend>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set round(value) {
    		throw new Error("<Legend>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/DotPlotChart.svelte generated by Svelte v3.43.1 */

    const { Object: Object_1$2 } = globals;
    const file$7 = "src/charts/DotPlotChart.svelte";

    // (45:2) <Svg>
    function create_default_slot_2$1(ctx) {
    	let axisx;
    	let t0;
    	let axisy;
    	let t1;
    	let dotplot;
    	let current;
    	axisx = new AxisX({ $$inline: true });

    	axisy = new AxisY({
    			props: { gridlines: false },
    			$$inline: true
    		});

    	dotplot = new DotPlot({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(axisx.$$.fragment);
    			t0 = space();
    			create_component(axisy.$$.fragment);
    			t1 = space();
    			create_component(dotplot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(axisx, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(axisy, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(dotplot, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(axisx.$$.fragment, local);
    			transition_in(axisy.$$.fragment, local);
    			transition_in(dotplot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(axisx.$$.fragment, local);
    			transition_out(axisy.$$.fragment, local);
    			transition_out(dotplot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(axisx, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(axisy, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(dotplot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(45:2) <Svg>",
    		ctx
    	});

    	return block;
    }

    // (53:2) {#if labels}
    function create_if_block$4(ctx) {
    	let html;
    	let current;

    	html = new Html({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(html.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(html, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(html.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(html.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(html, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(53:2) {#if labels}",
    		ctx
    	});

    	return block;
    }

    // (54:2) <Html>
    function create_default_slot_1$1(ctx) {
    	let dotlabels;
    	let current;
    	dotlabels = new DotLabels({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(dotlabels.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dotlabels, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dotlabels.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dotlabels.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dotlabels, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(54:2) <Html>",
    		ctx
    	});

    	return block;
    }

    // (33:1) <LayerCake   padding={{ right: 0, bottom: 20, left: 0 }}   x={xKey}   y={yKey}   yScale={scaleBand().paddingInner([0.05]).round(true)}   yDomain={data.map(d => d[yKey])}   xPadding={[15, 0]}   zScale={scaleOrdinal()}   zDomain={xKey}   zRange={seriesColors}   data={data}  >
    function create_default_slot$1(ctx) {
    	let svg;
    	let t;
    	let if_block_anchor;
    	let current;

    	svg = new Svg({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*labels*/ ctx[2] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			create_component(svg.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(svg, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const svg_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				svg_changes.$$scope = { dirty, ctx };
    			}

    			svg.$set(svg_changes);

    			if (/*labels*/ ctx[2]) {
    				if (if_block) {
    					if (dirty & /*labels*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svg.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svg.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svg, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(33:1) <LayerCake   padding={{ right: 0, bottom: 20, left: 0 }}   x={xKey}   y={yKey}   yScale={scaleBand().paddingInner([0.05]).round(true)}   yDomain={data.map(d => d[yKey])}   xPadding={[15, 0]}   zScale={scaleOrdinal()}   zDomain={xKey}   zRange={seriesColors}   data={data}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let layercake;
    	let t;
    	let legend;
    	let current;

    	layercake = new LayerCake({
    			props: {
    				padding: { right: 0, bottom: 20, left: 0 },
    				x: /*xKey*/ ctx[3],
    				y: yKey,
    				yScale: band().paddingInner([0.05]).round(true),
    				yDomain: /*data*/ ctx[0].map(/*func*/ ctx[5]),
    				xPadding: [15, 0],
    				zScale: ordinal(),
    				zDomain: /*xKey*/ ctx[3],
    				zRange: /*seriesColors*/ ctx[4],
    				data: /*data*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	legend = new Legend({
    			props: {
    				domain: /*xKey*/ ctx[3],
    				colors: /*seriesColors*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(layercake.$$.fragment);
    			t = space();
    			create_component(legend.$$.fragment);
    			attr_dev(div, "class", "chart-container svelte-ivcd9i");
    			set_style(div, "height", /*height*/ ctx[1] + "px");
    			add_location(div, file$7, 31, 0, 767);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(layercake, div, null);
    			insert_dev(target, t, anchor);
    			mount_component(legend, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layercake_changes = {};
    			if (dirty & /*data*/ 1) layercake_changes.yDomain = /*data*/ ctx[0].map(/*func*/ ctx[5]);
    			if (dirty & /*data*/ 1) layercake_changes.data = /*data*/ ctx[0];

    			if (dirty & /*$$scope, labels*/ 68) {
    				layercake_changes.$$scope = { dirty, ctx };
    			}

    			layercake.$set(layercake_changes);

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div, "height", /*height*/ ctx[1] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layercake.$$.fragment, local);
    			transition_in(legend.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layercake.$$.fragment, local);
    			transition_out(legend.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(layercake);
    			if (detaching) detach_dev(t);
    			destroy_component(legend, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const yKey = 'label';

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DotPlotChart', slots, []);
    	let { data } = $$props;
    	let { height = 400 } = $$props;
    	let { labels = false } = $$props;
    	const xKey = Object.keys(data[0]).filter(d => d !== yKey);
    	const seriesColors = ['#DF0667', '#3C388E', '#2166ac', '#b2182b', 'grey'];

    	data.forEach(d => {
    		xKey.forEach(name => {
    			d[name] = +d[name];
    		});
    	});

    	const writable_props = ['data', 'height', 'labels'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DotPlotChart> was created with unknown prop '${key}'`);
    	});

    	const func = d => d[yKey];

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('labels' in $$props) $$invalidate(2, labels = $$props.labels);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		LayerCake,
    		Svg,
    		Html,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		DotPlot,
    		DotLabels,
    		AxisX,
    		AxisY,
    		Legend,
    		data,
    		height,
    		labels,
    		yKey,
    		xKey,
    		seriesColors
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('labels' in $$props) $$invalidate(2, labels = $$props.labels);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, height, labels, xKey, seriesColors, func];
    }

    class DotPlotChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { data: 0, height: 1, labels: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DotPlotChart",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console.warn("<DotPlotChart> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<DotPlotChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<DotPlotChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<DotPlotChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<DotPlotChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<DotPlotChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<DotPlotChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Reports.svelte generated by Svelte v3.43.1 */

    const { Object: Object_1$1, console: console_1$2, document: document_1 } = globals;
    const file$6 = "src/Reports.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[35] = list[i];
    	child_ctx[37] = i;
    	return child_ctx;
    }

    // (430:1) {#if place}
    function create_if_block$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*loaded*/ ctx[7] && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*loaded*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*loaded*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(430:1) {#if place}",
    		ctx
    	});

    	return block;
    }

    // (431:2) {#if loaded}
    function create_if_block_1$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*eng*/ ctx[3] && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*eng*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*eng*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(431:2) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (432:3) {#if eng}
    function create_if_block_2$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*rgn*/ ctx[4] && create_if_block_3$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*rgn*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*rgn*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(432:3) {#if eng}",
    		ctx
    	});

    	return block;
    }

    // (433:4) {#if rgn}
    function create_if_block_3$2(ctx) {
    	let div3;
    	let div2;
    	let h1;
    	let t0_value = /*place*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let span0;
    	let t3;
    	let div1;
    	let div0;
    	let select;
    	let updating_selected;
    	let t4;
    	let html_tag;
    	let raw_value = /*standfirst*/ ctx[11](/*place*/ ctx[2], /*topics*/ ctx[5]) + "";
    	let t5;
    	let p0;
    	let t6;
    	let span1;
    	let t8;

    	let t9_value = (/*place*/ ctx[2].gss
    	? /*place*/ ctx[2].gss.long
    	: "local authority district") + "";

    	let t9;
    	let t10;
    	let t11;
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t12;
    	let button;
    	let div4;
    	let svg;
    	let t13;
    	let t14_value = (/*more*/ ctx[6] ? 'Read less' : 'Read more') + "";
    	let t14;
    	let t15;
    	let hr;
    	let t16;
    	let h2;
    	let t18;
    	let p1;
    	let t20;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[15](value);
    	}

    	let select_props = {
    		options: /*options*/ ctx[0],
    		group: "typenm",
    		search: true
    	};

    	if (/*selected*/ ctx[1] !== void 0) {
    		select_props.selected = /*selected*/ ctx[1];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding));
    	select.$on("select", /*select_handler*/ ctx[16]);
    	let each_value = /*results*/ ctx[8](/*place*/ ctx[2], /*topics*/ ctx[5]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[37];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*more*/ ctx[6]) return create_if_block_4$2;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			span0 = element("span");
    			span0.textContent = "What's changed";
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(select.$$.fragment);
    			t4 = space();
    			html_tag = new HtmlTag();
    			t5 = space();
    			p0 = element("p");
    			t6 = text("Here are some of the ");
    			span1 = element("span");
    			span1.textContent = "most notable changes";
    			t8 = text(" from across the ");
    			t9 = text(t9_value);
    			t10 = text(".");
    			t11 = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			button = element("button");
    			div4 = element("div");
    			svg = svg_element("svg");
    			if_block.c();
    			t13 = space();
    			t14 = text(t14_value);
    			t15 = space();
    			hr = element("hr");
    			t16 = space();
    			h2 = element("h2");
    			h2.textContent = "Creating this article";
    			t18 = space();
    			p1 = element("p");
    			p1.textContent = "This article was generated using some automation. Topics are automatically chosen based on how relevant they are for each area.";
    			t20 = space();
    			div5 = element("div");
    			set_style(span0, "font-weight", "400");
    			add_location(span0, file$6, 435, 25, 11845);
    			attr_dev(h1, "class", "svelte-1eybmbe");
    			add_location(h1, file$6, 435, 7, 11827);
    			set_style(div0, "width", "640px");
    			set_style(div0, "margin", "50px auto");
    			add_location(div0, file$6, 437, 8, 11925);
    			add_location(div1, file$6, 436, 7, 11911);
    			html_tag.a = t5;
    			attr_dev(span1, "class", "back-to-top svelte-1eybmbe");
    			add_location(span1, file$6, 442, 31, 12210);
    			add_location(p0, file$6, 442, 7, 12186);
    			set_style(div2, "width", "640px");
    			set_style(div2, "margin", "0 auto");
    			add_location(div2, file$6, 434, 6, 11777);
    			attr_dev(div3, "id", "sf");
    			attr_dev(div3, "class", "svelte-1eybmbe");
    			add_location(div3, file$6, 433, 5, 11757);
    			attr_dev(svg, "height", "25");
    			attr_dev(svg, "width", "50");
    			add_location(svg, file$6, 457, 8, 12713);
    			attr_dev(div4, "class", "triangle-container svelte-1eybmbe");
    			add_location(div4, file$6, 456, 7, 12672);
    			attr_dev(button, "class", "svelte-1eybmbe");
    			add_location(button, file$6, 455, 6, 12636);
    			attr_dev(hr, "class", "svelte-1eybmbe");
    			add_location(hr, file$6, 468, 6, 13035);
    			attr_dev(h2, "id", "create");
    			add_location(h2, file$6, 469, 6, 13047);
    			add_location(p1, file$6, 470, 6, 13096);
    			set_style(div5, "height", "200px");
    			add_location(div5, file$6, 471, 6, 13237);
    			attr_dev(main, "class", "svelte-1eybmbe");
    			add_location(main, file$6, 445, 5, 12388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, span0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(select, div0, null);
    			append_dev(div2, t4);
    			html_tag.m(raw_value, div2);
    			append_dev(div2, t5);
    			append_dev(div2, p0);
    			append_dev(p0, t6);
    			append_dev(p0, span1);
    			append_dev(p0, t8);
    			append_dev(p0, t9);
    			append_dev(p0, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t12);
    			append_dev(main, button);
    			append_dev(button, div4);
    			append_dev(div4, svg);
    			if_block.m(svg, null);
    			append_dev(button, t13);
    			append_dev(button, t14);
    			append_dev(main, t15);
    			append_dev(main, hr);
    			append_dev(main, t16);
    			append_dev(main, h2);
    			append_dev(main, t18);
    			append_dev(main, p1);
    			append_dev(main, t20);
    			append_dev(main, div5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", goTop, false, false, false),
    					listen_dev(button, "click", /*readMore*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*place*/ 4) && t0_value !== (t0_value = /*place*/ ctx[2].name + "")) set_data_dev(t0, t0_value);
    			const select_changes = {};
    			if (dirty[0] & /*options*/ 1) select_changes.options = /*options*/ ctx[0];

    			if (!updating_selected && dirty[0] & /*selected*/ 2) {
    				updating_selected = true;
    				select_changes.selected = /*selected*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    			if ((!current || dirty[0] & /*place, topics*/ 36) && raw_value !== (raw_value = /*standfirst*/ ctx[11](/*place*/ ctx[2], /*topics*/ ctx[5]) + "")) html_tag.p(raw_value);

    			if ((!current || dirty[0] & /*place*/ 4) && t9_value !== (t9_value = (/*place*/ ctx[2].gss
    			? /*place*/ ctx[2].gss.long
    			: "local authority district") + "")) set_data_dev(t9, t9_value);

    			if (dirty[0] & /*chartType, results, place, topics, makeProps*/ 12580) {
    				each_value = /*results*/ ctx[8](/*place*/ ctx[2], /*topics*/ ctx[5]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, outro_and_destroy_block, create_each_block$2, t12, get_each_context$2);
    				check_outros();
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			}

    			if ((!current || dirty[0] & /*more*/ 64) && t14_value !== (t14_value = (/*more*/ ctx[6] ? 'Read less' : 'Read more') + "")) set_data_dev(t14, t14_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(select);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(433:4) {#if rgn}",
    		ctx
    	});

    	return block;
    }

    // (448:7) {#if i<10}
    function create_if_block_5$2(ctx) {
    	let html_tag;
    	let raw_value = /*res*/ ctx[35] + "";
    	let t;
    	let div;
    	let switch_instance;
    	let current;
    	const switch_instance_spread_levels = [/*makeProps*/ ctx[12](/*i*/ ctx[37])];
    	var switch_value = /*chartType*/ ctx[13](/*i*/ ctx[37]);

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t = space();
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			html_tag.a = t;
    			set_style(div, "width", "100%");
    			add_location(div, file$6, 449, 8, 12492);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*results, place, topics*/ 292) && raw_value !== (raw_value = /*res*/ ctx[35] + "")) html_tag.p(raw_value);

    			const switch_instance_changes = (dirty[0] & /*makeProps, results, place, topics*/ 4388)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*makeProps*/ ctx[12](/*i*/ ctx[37]))])
    			: {};

    			if (switch_value !== (switch_value = /*chartType*/ ctx[13](/*i*/ ctx[37]))) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(448:7) {#if i<10}",
    		ctx
    	});

    	return block;
    }

    // (447:6) {#each results(place, topics) as res, i (i)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*i*/ ctx[37] < 10 && create_if_block_5$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*i*/ ctx[37] < 10) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*results, place, topics*/ 292) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_5$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(447:6) {#each results(place, topics) as res, i (i)}",
    		ctx
    	});

    	return block;
    }

    // (461:10) {:else}
    function create_else_block$2(ctx) {
    	let polygon;

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			attr_dev(polygon, "points", "25,20 15,10 25,20 35,10");
    			attr_dev(polygon, "class", "triangle svelte-1eybmbe");
    			add_location(polygon, file$6, 461, 11, 12865);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(461:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (459:10) {#if more}
    function create_if_block_4$2(ctx) {
    	let polygon;

    	const block = {
    		c: function create() {
    			polygon = svg_element("polygon");
    			attr_dev(polygon, "points", "25,10 15,20 25,10 35,20");
    			attr_dev(polygon, "class", "triangle svelte-1eybmbe");
    			add_location(polygon, file$6, 459, 11, 12774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, polygon, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(polygon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(459:10) {#if more}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*place*/ ctx[2] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			t = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			if (!src_url_equal(script0.src, script0_src_value = "https://d3js.org/d3.v3.min.js")) attr_dev(script0, "src", script0_src_value);
    			attr_dev(script0, "charset", "utf-8");
    			add_location(script0, file$6, 424, 1, 11473);
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$6, 425, 1, 11544);
    			add_location(div, file$6, 428, 0, 11690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script0);
    			append_dev(document_1.head, script1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script1, "load", /*onRosaeNlgLoad*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*place*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*place*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function goTop() {
    	let creation = document.getElementById('create');
    	creation.scrollIntoView();
    }

    function makeChartData(place, region, england, i) {
    	let temp = [];
    	let arr = [place, region, england];

    	if (place) {
    		for (const k in { 2015: "", 2016: "", 2017: "", 2018: "" }) {
    			for (const j in arr) {
    				let top = arr[j].data[subDomains[i]['Domain']]['subdomains'][subDomains[i]['Subdomain']].total;

    				temp.push({
    					year: parseInt(k),
    					value: top[k]['value'],
    					group: arr[j].name
    				});
    			}
    		}
    	}

    	return temp;
    }

    function fbp(x) {
    	return Number.parseFloat(Number.parseFloat(0.714 * x).toPrecision(2));
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Reports', slots, []);

    	var options,
    		selected,
    		place,
    		quartiles,
    		locRankCha,
    		locRankCur,
    		eng,
    		rgncode,
    		rgn,
    		s,
    		natRankCha,
    		natRankCur,
    		topics,
    		wal,
    		found,
    		ladData,
    		props;

    	var health, expand;
    	var more = false;
    	var topics;
    	fetch("./archie.aml").then(res => res.text()).then(txt => $$invalidate(5, topics = archieml.load(txt)));
    	var puggy;
    	fetch("./puggy.pug").then(res => res.text()).then(txt => puggy = txt);
    	var stand;
    	fetch("./standf.pug").then(res => res.text()).then(txt => stand = txt);

    	const types = {
    		ew: { name: '', pl: '' },
    		wd: { name: 'Ward', pl: 'Wards' },
    		lad: { name: 'District', pl: 'Districts' },
    		rgn: { name: 'Region', pl: 'Regions' },
    		ctry: { name: 'Country', pl: 'Countries' }
    	};

    	let loaded = false;

    	const onRosaeNlgLoad = () => {
    		$$invalidate(7, loaded = true);
    	};

    	// Data load functions
    	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/laddata.csv").then(res => {
    		res.forEach(d => {
    			d.code = d[""];
    			delete d[""];
    		});

    		ladData = res;
    	});

    	// Data load functions
    	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/places_2020.csv").then(res => {
    		res.forEach(d => {
    			d.typepl = types[d.type].pl;
    			d.typenm = types[d.type].name;
    		});

    		res = res.filter(d => d['type'] == 'lad');
    		$$invalidate(0, options = res.sort((a, b) => a.name.localeCompare(b.name)));
    		let defaultLoc = options[Math.round(336 * Math.random())]['name'];
    		defaultLoc = 'Monmouthshire';

    		if ([
    			'Daventry',
    			'East Northamptonshire',
    			'South Northamptonshire',
    			'Kettering',
    			'Corby',
    			'Wellingborough',
    			'Northampton'
    		].includes.deaultLoc) {
    			options[Math.round(336 * Math.random())]['name'];
    		}

    		console.log(defaultLoc);
    		$$invalidate(1, selected = options.find(d => d.name == defaultLoc));
    		console.log(selected.code);
    		loadArea(selected.code);
    	});

    	function loadArea(code) {
    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + code + ".json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    			quartiles = null;
    			$$invalidate(2, place = json);

    			// Define the word to describe population change in standfirst
    			if (place.data.population.value.change.all > 8) {
    				expand = "expanded";
    			} else if (place.data.population.value.change.all > 3) {
    				expand = "grew";
    			} else if (place.data.population.value.change.all > 0) {
    				expand = "did not change much";
    			} else {
    				expand = "shrunk";
    			}

    			// Define the word to describe health change in standfirst
    			if (place.data.health.perc.change.good > 0) {
    				health = "improved";
    			} else if (place.data.health.perc.change.good < 0) {
    				health = "deteriorated";
    			}

    			s = place.stories.map(d => d.label.split("_"));

    			s.forEach(e => {
    				if (e.length > 4) {
    					e[3] = e[3] + "_" + e[4];
    					e.pop();
    				}
    			});

    			rgncode = place.parents[0].code;
    			locRankCha = s.map(d => parseInt(place.data[d[0]][d[1] + "_rank_local"][d[2]][d[3]]));
    			natRankCha = s.map(d => parseInt(place.data[d[0]][d[1] + "_rank"][d[2]][d[3]]));
    			locRankCur = s.map(d => parseInt(place.data[d[0]][d[1] + "_rank_local"]['2011'][d[3]]));
    			natRankCur = s.map(d => parseInt(place.data[d[0]][d[1] + "_rank"]['2011'][d[3]]));

    			fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + rgncode + ".json").then(res => res.json()).then(json => {
    				json.children = options.filter(d => d.parent == code);
    				json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    				quartiles = null;
    				$$invalidate(4, rgn = json);
    			});
    		});

    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    			quartiles = null;
    			$$invalidate(3, eng = json);
    		});

    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/W92000004.json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    			wal = json;
    		});
    	}

    	let grewSyn = {
    		1: "expanded",
    		2: "grew",
    		3: "grew",
    		4: "remained relatively stable",
    		5: "fell"
    	};

    	function iterate(obj, pname) {
    		Object.keys(obj).forEach(key => {
    			if (typeof obj[key] === 'object') {
    				iterate(obj[key], pname);
    			} else {
    				obj[key] = createText(obj[key], {
    					health,
    					health,
    					expanded: expand,
    					plcname: pname
    				});
    			}
    		});
    	}

    	function standfirst(place, topicsIn) {
    		var o = JSON.parse(JSON.stringify(topicsIn));
    		iterate(o, place.name);
    		let sf = [];
    		let changeMag = 0;

    		place.stories.forEach(e => {
    			if (sf.length < 4 & Math.abs(e['value']) > 3) {
    				sf.push(e['label'].split("_"));
    				changeMag = changeMag + Math.abs(e['value']);
    			}
    		});

    		console.log("O", o);

    		return rosaenlg_en_US.render(stand, {
    			language: 'en_UK',
    			place,
    			topics: o,
    			s,
    			sf,
    			changeMag,
    			grewSyn,
    			qui,
    			natRankCha
    		});
    	}

    	function results(place, topicsIn) {
    		var o = JSON.parse(JSON.stringify(topicsIn));
    		iterate(o, place.name);

    		function topic(i, top) {
    			let ttop;

    			if (top) {
    				ttop = top;
    			} else {
    				ttop = s[i][3];
    			}

    			return o[s[i][0]][ttop];
    		}

    		function cap(string) {
    			return string.charAt(0).toUpperCase() + string.slice(1);
    		}

    		let res = rosaenlg_en_US.render(puggy, {
    			language: 'en_UK',
    			place,
    			data: place.data,
    			cou: place.parents[0].name == "Wales" ? wal : eng,
    			// replace eng with country data (inc Wales)
    			eng,
    			rgn,
    			parent: uncap1(regionThe(place.parents[0].name)),
    			parentNT: uncap1(regionThe(place.parents[0].name, "NT")),
    			s,
    			stories: place.stories,
    			priorities: place.Priorities,
    			grewSyn,
    			locRankCha,
    			natRankCha,
    			locRankCur,
    			natRankCur,
    			hiRank: place.hiRank,
    			topic,
    			topics: o,
    			chains,
    			country: place.parents[0].name == "Wales" ? "Wales" : "England",
    			get_word,
    			figs,
    			otherEst,
    			cur,
    			cha,
    			qui,
    			cap,
    			cap,
    			otherRank,
    			ud,
    			city,
    			drop,
    			drop,
    			ord,
    			ageBandLU,
    			eq,
    			nuword,
    			sign,
    			udord,
    			near: place.nearSimilar.nearTops,
    			simi: place.similar,
    			adv,
    			uds,
    			more
    		});

    		return res.split(`<div id="esc123"></div>`);
    	}

    	onMount(() => {
    		setInterval(
    			function () {
    				d3.selectAll('div#visph').attr('style', `
			background-color: #f6f6f6; 
			color: #e1e7ea; 
			height: 240px;
			padding: 80px;
			font-size: 2.8rem;
			font-weight: 600;
			margin-bottom: 80px;`);
    			},
    			1000
    		);
    	});

    	function makeProps(i) {
    		let s = place.stories[i].label.split("_");

    		if (s.length > 4) {
    			s[3] = s[3] + "_" + s[4];
    			s.pop();
    		}

    		if (place.stories[i].type.includes('size')) {
    			if (s[0] == "population") {
    				return {
    					height: 120,
    					data: [
    						{
    							label: eng.name,
    							2011: fbp(eng.data.density.value[2001].all),
    							2021: fbp(eng.data.density.value[2011].all)
    						},
    						{
    							label: rgn.name,
    							2011: fbp(rgn.data.density.value[2001].all),
    							2021: fbp(rgn.data.density.value[2011].all)
    						},
    						{
    							label: place.name,
    							2011: fbp(place.data.density.value[2001].all),
    							2021: fbp(place.data.density.value[2011].all)
    						}
    					]
    				};
    			} else {
    				return {
    					legend: true,
    					height: 120,
    					data: [
    						{
    							label: eng.name,
    							2011: eng.data[s[0]][s[1]][2001][s[3]],
    							2021: eng.data[s[0]][s[1]][2011][s[3]]
    						},
    						{
    							label: rgn.name,
    							2011: rgn.data[s[0]][s[1]][2001][s[3]],
    							2021: rgn.data[s[0]][s[1]][2011][s[3]]
    						},
    						{
    							label: place.name,
    							2011: place.data[s[0]][s[1]][2001][s[3]],
    							2021: place.data[s[0]][s[1]][2011][s[3]]
    						}
    					]
    				};
    			}
    		} else {
    			// ScatterChart
    			var chartdata;

    			if (s[0] == "population") {
    				chartdata = ladData.filter(d => d['parent'] == place.parents[0].name & d.topic == "density_all");
    			} else {
    				chartdata = ladData.filter(d => d['parent'] == place.parents[0].name & d.topic == s[0] + "_" + s[3]);
    			}

    			// let chartd = []
    			// chartdata.forEach(d => {
    			// 	chartd.push({ year: 2011, value: d['2001'], group: d.topic })
    			// 	chartd.push({ year: 2021, value: d['2011'], group: d.topic })
    			// });
    			chartdata = chartdata.map(d => ({
    				'change': d['change'],
    				'value': parseFloat(d[2011]),
    				'unique': d['lad'],
    				'id': d['parent']
    			}));

    			chartdata.forEach((item, i) => {
    				if (item.unique == place.name) {
    					item.id = place.name;
    				} else if (item.id == place.parents[0].name) {
    					item.id = "The rest of " + uncap1(regionThe(place.parents[0].name));
    				} else {
    					item.id = "Rest of England"; // item.id = "Rest of England"
    				}
    			});

    			return props = {
    				mode: "stacked",
    				line: false,
    				legend: true,
    				data: chartdata,
    				xKey: "value",
    				yKey: null,
    				rKey: "change",
    				r: [3, 9],
    				zKey: "id"
    			}; // title: "Multi-line chart"
    		}
    	}

    	function chartType(i) {
    		let s = place.stories[i].label.split("_");

    		if (s.length > 4) {
    			s[3] = s[3] + "_" + s[4];
    			s.pop();
    		}

    		if (place.stories[i].type.includes('size')) {
    			return DotPlotChart;
    		} else {
    			// LINECHART
    			return ScatterChart;
    		}
    	}

    	// var chartdata = ladData.filter(d => (d.lad==place.name)&(d.topic == s[0]+"_"+s[3]))
    	// 		chartdata = chartdata.map(d => ({ 'id': d['parent'], 'unique': d['lad'], 'value': parseFloat(d[2011]) }))
    	// 		chartdata.forEach((item, i) => {
    	// 			if (item.unique==place.name) {
    	// 				item.id = place.name
    	// 			} else if (item.id == place.parents[0].name) {
    	// 				item.id = place.parents[0].name
    	// 				// item.id = "Rest of England"
    	// 			} else {
    	// 				item.id = "Rest of England"
    	// 			}
    	// 		})
    	// 		chartdata = chartdata.sort(function(a, b){return b['value'] - a['value']})
    	// 		console.log("CHARTDATAS", chartdata)
    	// 		return props = {
    	// 			legend: true,
    	// 			data: chartdata,
    	// 			xKey: "unique",
    	// 			yKey: "value",
    	// 			zKey: "id"
    	function readMore() {
    		$$invalidate(6, more = !more);
    		$$invalidate(8, results);
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Reports> was created with unknown prop '${key}'`);
    	});

    	function select_selected_binding(value) {
    		selected = value;
    		$$invalidate(1, selected);
    	}

    	const select_handler = () => {
    		if (selected) {
    			loadArea(selected.code);
    		}
    	};

    	$$self.$capture_state = () => ({
    		uds,
    		adv,
    		udord,
    		sign,
    		nuword,
    		eq,
    		ageBandLU,
    		ord,
    		uncap1,
    		getData,
    		regionThe,
    		drop,
    		ud,
    		otherRank,
    		otherEst,
    		qui,
    		cha,
    		cur,
    		figs,
    		get_word,
    		city,
    		chains,
    		Select,
    		load: archieml.load,
    		onMount,
    		robojournalist: createText,
    		LineChart,
    		ScatterChart,
    		ColumnChart,
    		DotPlotChart,
    		options,
    		selected,
    		place,
    		quartiles,
    		locRankCha,
    		locRankCur,
    		eng,
    		rgncode,
    		rgn,
    		s,
    		natRankCha,
    		natRankCur,
    		topics,
    		wal,
    		found,
    		ladData,
    		props,
    		health,
    		expand,
    		more,
    		puggy,
    		stand,
    		types,
    		loaded,
    		onRosaeNlgLoad,
    		loadArea,
    		grewSyn,
    		iterate,
    		standfirst,
    		results,
    		goTop,
    		makeChartData,
    		fbp,
    		makeProps,
    		chartType,
    		readMore
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(0, options = $$props.options);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('place' in $$props) $$invalidate(2, place = $$props.place);
    		if ('quartiles' in $$props) quartiles = $$props.quartiles;
    		if ('locRankCha' in $$props) locRankCha = $$props.locRankCha;
    		if ('locRankCur' in $$props) locRankCur = $$props.locRankCur;
    		if ('eng' in $$props) $$invalidate(3, eng = $$props.eng);
    		if ('rgncode' in $$props) rgncode = $$props.rgncode;
    		if ('rgn' in $$props) $$invalidate(4, rgn = $$props.rgn);
    		if ('s' in $$props) s = $$props.s;
    		if ('natRankCha' in $$props) natRankCha = $$props.natRankCha;
    		if ('natRankCur' in $$props) natRankCur = $$props.natRankCur;
    		if ('topics' in $$props) $$invalidate(5, topics = $$props.topics);
    		if ('wal' in $$props) wal = $$props.wal;
    		if ('found' in $$props) found = $$props.found;
    		if ('ladData' in $$props) ladData = $$props.ladData;
    		if ('props' in $$props) props = $$props.props;
    		if ('health' in $$props) health = $$props.health;
    		if ('expand' in $$props) expand = $$props.expand;
    		if ('more' in $$props) $$invalidate(6, more = $$props.more);
    		if ('puggy' in $$props) puggy = $$props.puggy;
    		if ('stand' in $$props) stand = $$props.stand;
    		if ('loaded' in $$props) $$invalidate(7, loaded = $$props.loaded);
    		if ('grewSyn' in $$props) grewSyn = $$props.grewSyn;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		options,
    		selected,
    		place,
    		eng,
    		rgn,
    		topics,
    		more,
    		loaded,
    		results,
    		onRosaeNlgLoad,
    		loadArea,
    		standfirst,
    		makeProps,
    		chartType,
    		readMore,
    		select_selected_binding,
    		select_handler
    	];
    }

    class Reports extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Reports",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/ui/SelectB.svelte generated by Svelte v3.43.1 */
    const file$5 = "src/ui/SelectB.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[35] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[33] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    // (225:1) {:else}
    function create_else_block_1$1(ctx) {
    	let a;
    	let span0;

    	let t0_value = (/*placeholder*/ ctx[0]
    	? /*placeholder*/ ctx[0]
    	: 'Select one') + "";

    	let t0;
    	let t1;
    	let span1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = " ";
    			attr_dev(span0, "class", "svelte-qdzmwx");
    			add_location(span0, file$5, 226, 2, 4768);
    			attr_dev(span1, "class", "button svelte-qdzmwx");
    			toggle_class(span1, "search", /*search*/ ctx[3]);
    			toggle_class(span1, "down", !/*search*/ ctx[3]);
    			add_location(span1, file$5, 227, 2, 4826);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "svelte-qdzmwx");
    			add_location(a, file$5, 225, 1, 4732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(a, t1);
    			append_dev(a, span1);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*toggle*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*placeholder*/ 1 && t0_value !== (t0_value = (/*placeholder*/ ctx[0]
    			? /*placeholder*/ ctx[0]
    			: 'Select one') + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*search*/ 8) {
    				toggle_class(span1, "search", /*search*/ ctx[3]);
    			}

    			if (dirty[0] & /*search*/ 8) {
    				toggle_class(span1, "down", !/*search*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(225:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (220:1) {#if selectedItem && !search}
    function create_if_block_4$1(ctx) {
    	let a;
    	let span0;
    	let t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let mounted;
    	let dispose;
    	let if_block = /*group*/ ctx[2] && create_if_block_5$1(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = " ";
    			attr_dev(span0, "class", "selection svelte-qdzmwx");
    			add_location(span0, file$5, 221, 2, 4547);
    			attr_dev(span1, "class", "button close svelte-qdzmwx");
    			add_location(span1, file$5, 222, 2, 4655);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "selected svelte-qdzmwx");
    			add_location(a, file$5, 220, 1, 4494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			if (if_block) if_block.m(span0, null);
    			append_dev(a, t2);
    			append_dev(a, span1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "click", /*unSelect*/ ctx[14], false, false, false),
    					listen_dev(a, "click", /*toggle*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem, label*/ 66 && t0_value !== (t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

    			if (/*group*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_5$1(ctx);
    					if_block.c();
    					if_block.m(span0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(220:1) {#if selectedItem && !search}",
    		ctx
    	});

    	return block;
    }

    // (222:48) {#if group}
    function create_if_block_5$1(ctx) {
    	let small;
    	let t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(t_value);
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$5, 221, 59, 4604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedItem, group*/ 68 && t_value !== (t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(222:48) {#if group}",
    		ctx
    	});

    	return block;
    }

    // (231:1) {#if expanded}
    function create_if_block$2(ctx) {
    	let div;
    	let input_1;
    	let t;
    	let ul;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*filter*/ ctx[4].length < 0) return create_if_block_1$1;
    		if (/*filtered*/ ctx[9][0] && /*group*/ ctx[2]) return create_if_block_2$1;
    		if (/*filtered*/ ctx[9][0]) return create_if_block_3$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input_1 = element("input");
    			t = space();
    			ul = element("ul");
    			if_block.c();
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "placeholder", "");
    			attr_dev(input_1, "autocomplete", "false");
    			attr_dev(input_1, "class", "svelte-qdzmwx");
    			add_location(input_1, file$5, 232, 2, 4978);
    			attr_dev(ul, "class", "svelte-qdzmwx");
    			add_location(ul, file$5, 233, 2, 5095);
    			attr_dev(div, "id", "dropdown");
    			set_style(div, "top", "0");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			add_location(div, file$5, 231, 1, 4925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input_1);
    			set_input_value(input_1, /*filter*/ ctx[4]);
    			/*input_1_binding*/ ctx[23](input_1);
    			append_dev(div, t);
    			append_dev(div, ul);
    			if_block.m(ul, null);
    			/*div_binding*/ ctx[30](div);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[22]),
    					listen_dev(input_1, "keyup", /*doKeyup*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filter*/ 16 && input_1.value !== /*filter*/ ctx[4]) {
    				set_input_value(input_1, /*filter*/ ctx[4]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_1_binding*/ ctx[23](null);
    			if_block.d();
    			/*div_binding*/ ctx[30](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(231:1) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (249:3) {:else}
    function create_else_block$1(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "No results";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$5, 249, 3, 5668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(249:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (243:25) 
    function create_if_block_3$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = /*filtered*/ ctx[9];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, active, select, filtered, label*/ 11010) {
    				each_value_1 = /*filtered*/ ctx[9];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(243:25) ",
    		ctx
    	});

    	return block;
    }

    // (237:34) 
    function create_if_block_2$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*filtered*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, active, select, filtered, group, label*/ 11014) {
    				each_value = /*filtered*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(237:34) ",
    		ctx
    	});

    	return block;
    }

    // (235:3) {#if filter.length < 0}
    function create_if_block_1$1(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Type a name...";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$5, 235, 3, 5130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(235:3) {#if filter.length < 0}",
    		ctx
    	});

    	return block;
    }

    // (244:3) {#each filtered as option, i}
    function create_each_block_1(ctx) {
    	let li;
    	let t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let i = /*i*/ ctx[34];
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[27](/*option*/ ctx[32]);
    	}

    	function mouseover_handler_1() {
    		return /*mouseover_handler_1*/ ctx[28](/*i*/ ctx[34]);
    	}

    	const assign_li = () => /*li_binding_1*/ ctx[29](li, i);
    	const unassign_li = () => /*li_binding_1*/ ctx[29](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$5, 244, 3, 5486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			assign_li();

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler_1, false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filtered, label*/ 514 && t0_value !== (t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);

    			if (i !== /*i*/ ctx[34]) {
    				unassign_li();
    				i = /*i*/ ctx[34];
    				assign_li();
    			}

    			if (dirty[0] & /*active*/ 256) {
    				toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_li();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(244:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    // (238:3) {#each filtered as option, i}
    function create_each_block$1(ctx) {
    	let li;
    	let t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let small;
    	let t2_value = /*option*/ ctx[32][/*group*/ ctx[2]] + "";
    	let t2;
    	let t3;
    	let i = /*i*/ ctx[34];
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[24](/*option*/ ctx[32]);
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[25](/*i*/ ctx[34]);
    	}

    	const assign_li = () => /*li_binding*/ ctx[26](li, i);
    	const unassign_li = () => /*li_binding*/ ctx[26](null, i);

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			small = element("small");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$5, 239, 20, 5373);
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$5, 238, 3, 5225);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, small);
    			append_dev(small, t2);
    			append_dev(li, t3);
    			assign_li();

    			if (!mounted) {
    				dispose = [
    					listen_dev(li, "click", click_handler, false, false, false),
    					listen_dev(li, "mouseover", mouseover_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*filtered, label*/ 514 && t0_value !== (t0_value = /*option*/ ctx[32][/*label*/ ctx[1]] + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*filtered, group*/ 516 && t2_value !== (t2_value = /*option*/ ctx[32][/*group*/ ctx[2]] + "")) set_data_dev(t2, t2_value);

    			if (i !== /*i*/ ctx[34]) {
    				unassign_li();
    				i = /*i*/ ctx[34];
    				assign_li();
    			}

    			if (dirty[0] & /*active*/ 256) {
    				toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			unassign_li();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(238:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedItem*/ ctx[6] && !/*search*/ ctx[3]) return create_if_block_4$1;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*expanded*/ ctx[7] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", "select");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			toggle_class(div, "active", /*expanded*/ ctx[7]);
    			add_location(div, file$5, 218, 0, 4397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "keydown", /*doKeydown*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			}

    			if (/*expanded*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*expanded*/ 128) {
    				toggle_class(div, "active", /*expanded*/ ctx[7]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let regex;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectB', slots, []);
    	const dispatch = createEventDispatcher();
    	let { options } = $$props;
    	let { selectedb = null } = $$props;
    	let { placeholder = "Find an area..." } = $$props;
    	let { value = "code" } = $$props;
    	let { label = "name" } = $$props;
    	let { group = null } = $$props;
    	let { search = false } = $$props;
    	let selectedPrev = selectedb;

    	let selectedItem = selectedb
    	? options.find(d => {
    			d[value] == selectedb[value];
    		})
    	: null;

    	let expanded = false;
    	let filter = '';
    	let active = null;
    	let filtered;
    	let el;
    	let input;
    	let items = [];

    	function toggle(ev) {
    		ev.stopPropagation();
    		$$invalidate(4, filter = '');
    		$$invalidate(7, expanded = !expanded);

    		sleep(10).then(() => {
    			if (input && expanded) {
    				input.focus();
    			}
    		});
    	}

    	function select(option) {
    		$$invalidate(17, selectedb = option);
    		$$invalidate(7, expanded = false);
    		dispatch('select', { selectedb: option, value: option[value] });
    	}

    	function unSelect(ev) {
    		ev.stopPropagation();
    		$$invalidate(17, selectedb = null);
    		$$invalidate(20, selectedPrev = null);
    		$$invalidate(6, selectedItem = null);
    		dispatch('select', { selectedb: null, value: null });
    	}

    	function doKeydown(ev) {
    		if (expanded && filtered[0] && Number.isInteger(active)) {
    			if (ev.keyCode === 38) {
    				$$invalidate(8, active -= active > 0 ? 1 : 0);
    				items[active].scrollIntoView({ block: 'nearest', inline: 'start' });
    			} else if (ev.keyCode === 40) {
    				$$invalidate(8, active += active < filtered.length - 1 ? 1 : 0);
    				items[active].scrollIntoView({ block: 'nearest', inline: 'end' });
    			}
    		}
    	}

    	function doKeyup(ev) {
    		if (filtered[0] && Number.isInteger(active)) {
    			if (ev.keyCode === 13) {
    				select(filtered[active]);
    			}
    		}
    	}

    	const writable_props = ['options', 'selectedb', 'placeholder', 'value', 'label', 'group', 'search'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectB> was created with unknown prop '${key}'`);
    	});

    	function input_1_input_handler() {
    		filter = this.value;
    		$$invalidate(4, filter);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(10, input);
    		});
    	}

    	const click_handler = option => select(option);
    	const mouseover_handler = i => $$invalidate(8, active = i);

    	function li_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			items[i] = $$value;
    			$$invalidate(11, items);
    		});
    	}

    	const click_handler_1 = option => select(option);
    	const mouseover_handler_1 = i => $$invalidate(8, active = i);

    	function li_binding_1($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			items[i] = $$value;
    			$$invalidate(11, items);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(5, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(18, options = $$props.options);
    		if ('selectedb' in $$props) $$invalidate(17, selectedb = $$props.selectedb);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(19, value = $$props.value);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('search' in $$props) $$invalidate(3, search = $$props.search);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		options,
    		selectedb,
    		placeholder,
    		value,
    		label,
    		group,
    		search,
    		selectedPrev,
    		selectedItem,
    		expanded,
    		filter,
    		active,
    		filtered,
    		el,
    		input,
    		items,
    		sleep,
    		toggle,
    		select,
    		unSelect,
    		doKeydown,
    		doKeyup,
    		regex
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(18, options = $$props.options);
    		if ('selectedb' in $$props) $$invalidate(17, selectedb = $$props.selectedb);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('value' in $$props) $$invalidate(19, value = $$props.value);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('search' in $$props) $$invalidate(3, search = $$props.search);
    		if ('selectedPrev' in $$props) $$invalidate(20, selectedPrev = $$props.selectedPrev);
    		if ('selectedItem' in $$props) $$invalidate(6, selectedItem = $$props.selectedItem);
    		if ('expanded' in $$props) $$invalidate(7, expanded = $$props.expanded);
    		if ('filter' in $$props) $$invalidate(4, filter = $$props.filter);
    		if ('active' in $$props) $$invalidate(8, active = $$props.active);
    		if ('filtered' in $$props) $$invalidate(9, filtered = $$props.filtered);
    		if ('el' in $$props) $$invalidate(5, el = $$props.el);
    		if ('input' in $$props) $$invalidate(10, input = $$props.input);
    		if ('items' in $$props) $$invalidate(11, items = $$props.items);
    		if ('regex' in $$props) $$invalidate(21, regex = $$props.regex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*filter*/ 16) {
    			$$invalidate(21, regex = filter ? new RegExp(filter, 'i') : null);
    		}

    		if ($$self.$$.dirty[0] & /*regex, options, label*/ 2359298) {
    			{
    				$$invalidate(9, filtered = regex
    				? options.filter(option => regex.test(option[label]))
    				: options);

    				$$invalidate(8, active = 0);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*el*/ 32) {
    			document.onclick = function (e) {
    				if (e.target !== el) {
    					$$invalidate(7, expanded = false);
    					$$invalidate(8, active = 0);
    				}
    			};
    		}

    		if ($$self.$$.dirty[0] & /*selectedPrev, selectedb, options, value*/ 1966080) {
    			if (selectedPrev != selectedb) {
    				$$invalidate(6, selectedItem = options.find(d => d[value] == selectedb[value]));
    				$$invalidate(20, selectedPrev = selectedb);
    			}
    		}
    	};

    	return [
    		placeholder,
    		label,
    		group,
    		search,
    		filter,
    		el,
    		selectedItem,
    		expanded,
    		active,
    		filtered,
    		input,
    		items,
    		toggle,
    		select,
    		unSelect,
    		doKeydown,
    		doKeyup,
    		selectedb,
    		options,
    		value,
    		selectedPrev,
    		regex,
    		input_1_input_handler,
    		input_1_binding,
    		click_handler,
    		mouseover_handler,
    		li_binding,
    		click_handler_1,
    		mouseover_handler_1,
    		li_binding_1,
    		div_binding
    	];
    }

    class SelectB extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				options: 18,
    				selectedb: 17,
    				placeholder: 0,
    				value: 19,
    				label: 1,
    				group: 2,
    				search: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectB",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[18] === undefined && !('options' in props)) {
    			console.warn("<SelectB> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedb() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedb(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get search() {
    		throw new Error("<SelectB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<SelectB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Topics.svelte generated by Svelte v3.43.1 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$4 = "src/Topics.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	child_ctx[41] = i;
    	return child_ctx;
    }

    // (393:0) {:else}
    function create_else_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			set_style(div, "padding", "50px");
    			set_style(div, "padding-left", "40%");
    			set_style(div, "font-size", "x-large");
    			add_location(div, file$4, 393, 0, 15672);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(393:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (383:0) {#if rgnLoad}
    function create_if_block_7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_8, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*placesload*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(383:0) {#if rgnLoad}",
    		ctx
    	});

    	return block;
    }

    // (390:1) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			set_style(div, "padding", "50px");
    			set_style(div, "padding-left", "40%");
    			set_style(div, "font-size", "x-large");
    			add_location(div, file$4, 390, 1, 15573);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(390:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (384:1) {#if placesload}
    function create_if_block_8(ctx) {
    	let div1;
    	let div0;
    	let select;
    	let updating_selected;
    	let current;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[17](value);
    	}

    	let select_props = {
    		options: /*topicOptions*/ ctx[12],
    		placeholder: "Search a topic",
    		value: "value",
    		label: "label",
    		search: true
    	};

    	if (/*selected*/ ctx[0] !== void 0) {
    		select_props.selected = /*selected*/ ctx[0];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding));
    	select.$on("select", /*select_handler*/ ctx[18]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(select.$$.fragment);
    			set_style(div0, "width", "640px");
    			set_style(div0, "margin", "50px auto");
    			add_location(div0, file$4, 385, 2, 15311);
    			add_location(div1, file$4, 384, 1, 15303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(select, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};

    			if (!updating_selected && dirty[0] & /*selected*/ 1) {
    				updating_selected = true;
    				select_changes.selected = /*selected*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(select);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(384:1) {#if placesload}",
    		ctx
    	});

    	return block;
    }

    // (398:1) {#if topic}
    function create_if_block$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*loaded1*/ ctx[8] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*loaded1*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*loaded1*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(398:1) {#if topic}",
    		ctx
    	});

    	return block;
    }

    // (399:2) {#if loaded1}
    function create_if_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*loaded*/ ctx[10] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*loaded*/ ctx[10]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*loaded*/ 1024) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(399:2) {#if loaded1}",
    		ctx
    	});

    	return block;
    }

    // (400:3) {#if loaded}
    function create_if_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*rgnLoad*/ ctx[5] && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*rgnLoad*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*rgnLoad*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(400:3) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (401:4) {#if rgnLoad}
    function create_if_block_3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*eng*/ ctx[4] && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*eng*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*eng*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(401:4) {#if rgnLoad}",
    		ctx
    	});

    	return block;
    }

    // (402:5) {#if eng}
    function create_if_block_4(ctx) {
    	let div0;
    	let h1;
    	let t0_value = /*selected*/ ctx[0].label + "";
    	let t0;
    	let t1;
    	let t2;
    	let main;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t3;
    	let hr;
    	let t4;
    	let h2;
    	let t6;
    	let p;
    	let t8;
    	let div1;
    	let current;
    	let if_block = /*subSel*/ ctx[2] && create_if_block_5(ctx);
    	let each_value = /*placesOb*/ ctx[11];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[41];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			main = element("main");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			hr = element("hr");
    			t4 = space();
    			h2 = element("h2");
    			h2.textContent = "Creating this article";
    			t6 = space();
    			p = element("p");
    			p.textContent = "This article was generated using some automation. Topics are automatically chosen based on how relevant they are for each area.";
    			t8 = space();
    			div1 = element("div");
    			attr_dev(h1, "class", "svelte-15qyx5z");
    			add_location(h1, file$4, 403, 7, 15904);
    			set_style(div0, "width", "640px");
    			set_style(div0, "margin", "0 auto");
    			add_location(div0, file$4, 402, 6, 15854);
    			set_style(hr, "width", "40%");
    			set_style(hr, "margin", "60px auto 30px auto");
    			add_location(hr, file$4, 422, 7, 16642);
    			attr_dev(h2, "id", "create");
    			add_location(h2, file$4, 423, 7, 16704);
    			add_location(p, file$4, 424, 7, 16754);
    			set_style(div1, "height", "200px");
    			add_location(div1, file$4, 425, 7, 16896);
    			attr_dev(main, "class", "svelte-15qyx5z");
    			add_location(main, file$4, 417, 6, 16411);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, main, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t3);
    			append_dev(main, hr);
    			append_dev(main, t4);
    			append_dev(main, h2);
    			append_dev(main, t6);
    			append_dev(main, p);
    			append_dev(main, t8);
    			append_dev(main, div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*selected*/ 1) && t0_value !== (t0_value = /*selected*/ ctx[0].label + "")) set_data_dev(t0, t0_value);

    			if (/*subSel*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*subSel*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t2.parentNode, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*results, placesOb, topics*/ 67648) {
    				each_value = /*placesOb*/ ctx[11];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, main, destroy_block, create_each_block, t3, get_each_context);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(main);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(402:5) {#if eng}",
    		ctx
    	});

    	return block;
    }

    // (406:6) {#if subSel}
    function create_if_block_5(ctx) {
    	let div1;
    	let div0;
    	let selectb;
    	let updating_selectedb;
    	let t;
    	let if_block_anchor;
    	let current;

    	function selectb_selectedb_binding(value) {
    		/*selectb_selectedb_binding*/ ctx[19](value);
    	}

    	let selectb_props = {
    		options: /*subSel*/ ctx[2],
    		placeholder: "Search a subtopic",
    		value: "value",
    		label: "label",
    		search: true
    	};

    	if (/*selectedb*/ ctx[1] !== void 0) {
    		selectb_props.selectedb = /*selectedb*/ ctx[1];
    	}

    	selectb = new SelectB({ props: selectb_props, $$inline: true });
    	binding_callbacks.push(() => bind(selectb, 'selectedb', selectb_selectedb_binding));
    	selectb.$on("select", /*select_handler_1*/ ctx[20]);
    	let if_block = /*loadedb*/ ctx[9] && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(selectb.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div0, "width", "640px");
    			set_style(div0, "margin", "50px auto");
    			add_location(div0, file$4, 407, 8, 15983);
    			add_location(div1, file$4, 406, 7, 15969);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(selectb, div0, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selectb_changes = {};
    			if (dirty[0] & /*subSel*/ 4) selectb_changes.options = /*subSel*/ ctx[2];

    			if (!updating_selectedb && dirty[0] & /*selectedb*/ 2) {
    				updating_selectedb = true;
    				selectb_changes.selectedb = /*selectedb*/ ctx[1];
    				add_flush_callback(() => updating_selectedb = false);
    			}

    			selectb.$set(selectb_changes);

    			if (/*loadedb*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(selectb);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(406:6) {#if subSel}",
    		ctx
    	});

    	return block;
    }

    // (412:7) {#if loadedb}
    function create_if_block_6(ctx) {
    	let div;
    	let h1;
    	let t_value = /*selectedb*/ ctx[1].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t = text(t_value);
    			attr_dev(h1, "class", "svelte-15qyx5z");
    			add_location(h1, file$4, 413, 9, 16338);
    			set_style(div, "width", "640px");
    			set_style(div, "margin", "0 auto");
    			add_location(div, file$4, 412, 8, 16286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selectedb*/ 2 && t_value !== (t_value = /*selectedb*/ ctx[1].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(412:7) {#if loadedb}",
    		ctx
    	});

    	return block;
    }

    // (419:7) {#each placesOb as item, i (i)}
    function create_each_block(key_1, ctx) {
    	let h2;
    	let t0_value = /*item*/ ctx[39]['place'].name + "";
    	let t0;
    	let t1;
    	let html_tag;
    	let raw_value = /*results*/ ctx[16](/*item*/ ctx[39]['place'], /*item*/ ctx[39]['region'], /*topics*/ ctx[6], /*item*/ ctx[39]['s'], /*item*/ ctx[39]['story']) + "";
    	let html_anchor;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			set_style(h2, "text-decoration", "underline");
    			add_location(h2, file$4, 419, 8, 16465);
    			html_tag.a = html_anchor;
    			this.first = h2;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*placesOb*/ 2048 && t0_value !== (t0_value = /*item*/ ctx[39]['place'].name + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*placesOb, topics*/ 2112 && raw_value !== (raw_value = /*results*/ ctx[16](/*item*/ ctx[39]['place'], /*item*/ ctx[39]['region'], /*topics*/ ctx[6], /*item*/ ctx[39]['s'], /*item*/ ctx[39]['story']) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(419:7) {#each placesOb as item, i (i)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t0;
    	let current_block_type_index;
    	let if_block0;
    	let t1;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_7, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*rgnLoad*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*topic*/ ctx[7] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			if (!src_url_equal(script0.src, script0_src_value = "https://d3js.org/d3.v3.min.js")) attr_dev(script0, "src", script0_src_value);
    			attr_dev(script0, "charset", "utf-8");
    			add_location(script0, file$4, 378, 1, 15053);
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$4, 379, 1, 15124);
    			add_location(div, file$4, 396, 0, 15763);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script0);
    			append_dev(document.head, script1);
    			insert_dev(target, t0, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block1) if_block1.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script1, "load", /*onRosaeNlgLoad*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(t1.parentNode, t1);
    			}

    			if (/*topic*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*topic*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t0);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let placesload;
    	let subSel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Topics', slots, []);

    	var wal,
    		selected,
    		selectedb,
    		quartiles,
    		locRankCha,
    		locRankCur,
    		eng,
    		rgncode,
    		rgnLoad,
    		natRankCha,
    		natRankCur,
    		topics,
    		topic;

    	var health, expand;

    	let topicOptions = [
    		{
    			"label": "Average age",
    			"value": "agemed_value_change"
    		},
    		// {"label": "Care provision", "value": "care_perc_change"},
    		{
    			"label": "Employment status",
    			"value": "economic_perc_change"
    		},
    		{
    			"label": "Ethnicity",
    			"value": "ethnicity_perc_change"
    		},
    		{
    			"label": "Health",
    			"value": "health_perc_change"
    		},
    		{
    			"label": "Hours worked",
    			"value": "hoursworked_perc_change"
    		},
    		{
    			"label": "Households with children",
    			"value": "children_perc_change"
    		},
    		{
    			"label": "Households by family",
    			"value": "household_perc_change"
    		},
    		{
    			"label": "Marital status",
    			"value": "marital_perc_change"
    		},
    		{
    			"label": "Population",
    			"value": "population_value_change"
    		},
    		{
    			"label": "Religion",
    			"value": "religion_perc_change"
    		},
    		{
    			"label": "Tenure",
    			"value": "tenure_perc_change"
    		}
    	];

    	// Switch off when timeout function and change selected to agemed when not developing
    	selected = topicOptions.find(d => d.value == "agemed_value_change");

    	// setTimeout(function() {
    	// 	loadTopic(selected.value)
    	// }, 6000);
    	console.log('topicOptions', topicOptions);

    	var subTopicOpt = {
    		'agemed_value_change': false,
    		'economic_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{ 'label': 'Employed', 'value': 'employee' },
    			{
    				'label': 'Self-employed',
    				'value': 'self-employed'
    			},
    			{ 'label': 'Student', 'value': 'student' },
    			{
    				'label': 'Unemployed',
    				'value': 'unemployed'
    			}
    		],
    		'ethnicity_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{ 'label': 'Asian', 'value': 'asian' },
    			{ 'label': 'Black', 'value': 'black' },
    			{ 'label': 'White', 'value': 'white' }
    		],
    		'health_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{ 'label': 'Good', 'value': 'good' },
    			{ 'label': 'Fair', 'value': 'fair' },
    			{ 'label': 'Bad', 'value': 'bad' }
    		],
    		'hoursworked_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{
    				'label': '1-15 hours per week',
    				'value': 'Male1-15'
    			},
    			{
    				'label': 'Over 49 hours per week',
    				'value': 'Male49plus'
    			}
    		],
    		'children_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{
    				'label': 'Households with children',
    				'value': 'Kids'
    			},
    			{
    				'label': 'Households without children',
    				'value': 'NoKids'
    			},
    			{
    				'label': 'Households with only non-dependent children',
    				'value': 'NonDepKids'
    			}
    		],
    		'household_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{
    				'label': 'Cohabiting',
    				'value': 'Cohabiting'
    			},
    			{
    				'label': 'Married couple',
    				'value': 'Married'
    			},
    			{
    				'label': 'Single parent',
    				'value': 'LoneParent'
    			},
    			{
    				'label': 'Single person',
    				'value': 'OnePerson'
    			}
    		],
    		'marital_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{ 'label': 'Married', 'value': 'Married' },
    			{
    				'label': 'Seperated',
    				'value': 'Seperated'
    			},
    			{ 'label': 'Single', 'value': 'Single' }
    		],
    		'population_value_change': false,
    		'religion_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{ 'label': 'Buddhist', 'value': 'Buddhist' },
    			{
    				'label': 'Christian',
    				'value': 'Christian'
    			},
    			{ 'label': 'Hindu', 'value': 'Hindu' },
    			{ 'label': 'Jewish', 'value': 'Jewish' },
    			{ 'label': 'Muslim', 'value': 'Muslim' },
    			{
    				'label': 'No religion',
    				'value': 'Noreligion'
    			}
    		],
    		'tenure_perc_change': [
    			{ 'label': 'All', 'value': 'all' },
    			{
    				'label': 'Homeownership',
    				'value': 'owned'
    			},
    			{
    				'label': 'Private renting',
    				'value': 'rented_private'
    			},
    			{
    				'label': 'Social renting',
    				'value': 'rented_social'
    			}
    		]
    	};

    	var regionArr = [
    		'E12000001',
    		'E12000002',
    		'E12000003',
    		'E12000004',
    		'E12000005',
    		'E12000006',
    		'E12000007',
    		'E12000008',
    		'E12000009',
    		'W92000004'
    	];

    	var regions = [];

    	fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/W92000004.json").then(res => res.json()).then(json => {
    		wal = json;
    	});

    	fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json").then(res => res.json()).then(json => {
    		$$invalidate(4, eng = json);
    		$$invalidate(8, loaded1 = true);
    	}).then(d => {
    		regionArr.forEach(thisCode => {
    			fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + thisCode + ".json").then(res => res.json()).then(json => {
    				regions.push(json);
    			});
    		});
    	}).then(d => {
    		$$invalidate(5, rgnLoad = true);
    	});

    	console.log('regions', regions);
    	var loaded1 = false;
    	var loadedb = false;
    	var places = [];

    	var codeArr = [
    		"E06000047",
    		"E06000005",
    		"E06000001",
    		"E06000002",
    		"E06000057",
    		"E06000003",
    		"E06000004",
    		"E08000037",
    		"E08000021",
    		"E08000022",
    		"E08000023",
    		"E08000024",
    		"E06000008",
    		"E06000009",
    		"E06000049",
    		"E06000050",
    		"E06000006",
    		"E06000007",
    		"E07000026",
    		"E07000027",
    		"E07000028",
    		"E07000029",
    		"E07000030",
    		"E07000031",
    		"E08000001",
    		"E08000002",
    		"E08000003",
    		"E08000004",
    		"E08000005",
    		"E08000006",
    		"E08000007",
    		"E08000008",
    		"E08000009",
    		"E08000010",
    		"E07000117",
    		"E07000118",
    		"E07000119",
    		"E07000120",
    		"E07000121",
    		"E07000122",
    		"E07000123",
    		"E07000124",
    		"E07000125",
    		"E07000126",
    		"E07000127",
    		"E07000128",
    		"E08000011",
    		"E08000012",
    		"E08000014",
    		"E08000013",
    		"E08000015",
    		"E06000011",
    		"E06000010",
    		"E06000012",
    		"E06000013",
    		"E06000014",
    		"E07000163",
    		"E07000164",
    		"E07000165",
    		"E07000166",
    		"E07000167",
    		"E07000168",
    		"E07000169",
    		"E08000016",
    		"E08000017",
    		"E08000018",
    		"E08000019",
    		"E08000032",
    		"E08000033",
    		"E08000034",
    		"E08000035",
    		"E08000036",
    		"E06000015",
    		"E06000016",
    		"E06000018",
    		"E06000017",
    		"E07000032",
    		"E07000033",
    		"E07000034",
    		"E07000035",
    		"E07000036",
    		"E07000037",
    		"E07000038",
    		"E07000039",
    		"E07000129",
    		"E07000130",
    		"E07000131",
    		"E07000132",
    		"E07000133",
    		"E07000134",
    		"E07000135",
    		"E07000136",
    		"E07000137",
    		"E07000138",
    		"E07000139",
    		"E07000140",
    		"E07000141",
    		"E07000142",
    		"E07000170",
    		"E07000171",
    		"E07000172",
    		"E07000173",
    		"E07000174",
    		"E07000175",
    		"E07000176",
    		"E06000019",
    		"E06000051",
    		"E06000021",
    		"E06000020",
    		"E07000192",
    		"E07000193",
    		"E07000194",
    		"E07000195",
    		"E07000196",
    		"E07000197",
    		"E07000198",
    		"E07000199",
    		"E07000218",
    		"E07000219",
    		"E07000220",
    		"E07000221",
    		"E07000222",
    		"E08000025",
    		"E08000026",
    		"E08000027",
    		"E08000028",
    		"E08000029",
    		"E08000030",
    		"E08000031",
    		"E07000234",
    		"E07000235",
    		"E07000236",
    		"E07000237",
    		"E07000238",
    		"E07000239",
    		"E06000055",
    		"E06000056",
    		"E06000032",
    		"E06000031",
    		"E06000033",
    		"E06000034",
    		"E07000008",
    		"E07000009",
    		"E07000010",
    		"E07000011",
    		"E07000012",
    		"E07000066",
    		"E07000067",
    		"E07000068",
    		"E07000069",
    		"E07000070",
    		"E07000071",
    		"E07000072",
    		"E07000073",
    		"E07000074",
    		"E07000075",
    		"E07000076",
    		"E07000077",
    		"E07000095",
    		"E07000096",
    		"E07000242",
    		"E07000098",
    		"E07000099",
    		"E07000240",
    		"E07000243",
    		"E07000102",
    		"E07000103",
    		"E07000241",
    		"E07000143",
    		"E07000144",
    		"E07000145",
    		"E07000146",
    		"E07000147",
    		"E07000148",
    		"E07000149",
    		"E07000200",
    		"E07000202",
    		"E07000203",
    		"E09000007",
    		"E09000012",
    		"E09000013",
    		"E09000014",
    		"E09000019",
    		"E09000020",
    		"E09000022",
    		"E09000023",
    		"E09000025",
    		"E09000028",
    		"E09000030",
    		"E09000032",
    		"E09000001",
    		"E09000033",
    		"E09000002",
    		"E09000003",
    		"E09000004",
    		"E09000005",
    		"E09000006",
    		"E09000008",
    		"E09000009",
    		"E09000010",
    		"E09000011",
    		"E09000015",
    		"E09000016",
    		"E09000017",
    		"E09000018",
    		"E09000021",
    		"E09000024",
    		"E09000026",
    		"E09000027",
    		"E09000029",
    		"E09000031",
    		"E06000036",
    		"E06000043",
    		"E06000046",
    		"E06000035",
    		"E06000042",
    		"E06000044",
    		"E06000038",
    		"E06000039",
    		"E06000045",
    		"E06000037",
    		"E06000040",
    		"E06000041",
    		"E07000061",
    		"E07000062",
    		"E07000063",
    		"E07000064",
    		"E07000065",
    		"E07000084",
    		"E07000085",
    		"E07000086",
    		"E07000087",
    		"E07000088",
    		"E07000089",
    		"E07000090",
    		"E07000091",
    		"E07000092",
    		"E07000093",
    		"E07000094",
    		"E07000105",
    		"E07000106",
    		"E07000107",
    		"E07000108",
    		"E07000109",
    		"E07000110",
    		"E07000111",
    		"E07000112",
    		"E07000113",
    		"E07000114",
    		"E07000115",
    		"E07000116",
    		"E07000177",
    		"E07000178",
    		"E07000179",
    		"E07000180",
    		"E07000181",
    		"E07000207",
    		"E07000208",
    		"E07000209",
    		"E07000210",
    		"E07000211",
    		"E07000212",
    		"E07000213",
    		"E07000214",
    		"E07000215",
    		"E07000216",
    		"E07000217",
    		"E07000223",
    		"E07000224",
    		"E07000225",
    		"E07000226",
    		"E07000227",
    		"E07000228",
    		"E07000229",
    		"E06000022",
    		"E06000023",
    		"E06000052",
    		"E06000024",
    		"E06000026",
    		"E06000025",
    		"E06000030",
    		"E06000027",
    		"E06000054",
    		"E07000040",
    		"E07000041",
    		"E07000042",
    		"E07000043",
    		"E07000044",
    		"E07000045",
    		"E07000046",
    		"E07000047",
    		"E07000078",
    		"E07000079",
    		"E07000080",
    		"E07000081",
    		"E07000082",
    		"E07000083",
    		"E07000187",
    		"E07000188",
    		"E07000189",
    		"W06000001",
    		"W06000002",
    		"W06000003",
    		"W06000004",
    		"W06000005",
    		"W06000006",
    		"W06000023",
    		"W06000008",
    		"W06000009",
    		"W06000010",
    		"W06000011",
    		"W06000012",
    		"W06000013",
    		"W06000014",
    		"W06000015",
    		"W06000016",
    		"W06000024",
    		"W06000018",
    		"W06000019",
    		"W06000020",
    		"W06000021",
    		"W06000022"
    	];

    	codeArr.forEach(thisCode => {
    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + thisCode + ".json").then(res => res.json()).then(json => {
    			places.push(json);
    		});
    	});

    	setTimeout(
    		function () {
    			$$invalidate(3, placesload = true);
    		},
    		1000
    	);

    	var topics;
    	fetch("./archie.aml").then(res => res.text()).then(txt => $$invalidate(6, topics = archieml.load(txt)));
    	var puggy;
    	fetch("./puggy.pug").then(res => res.text()).then(txt => puggy = txt);
    	var loaded = false;

    	const onRosaeNlgLoad = () => {
    		$$invalidate(10, loaded = true);
    	};

    	let grewSyn = {
    		1: "expanded",
    		2: "grew",
    		3: "grew",
    		4: "remained relatively stable",
    		5: "fell"
    	};

    	var placesOb = [];
    	var subplacesOb = [];

    	function loadSubTopic(code) {
    		if (code == "all") {
    			loadTopic(selected.value);
    		} else {
    			code = selected.value + "_" + code;
    			console.log('codesub', code);
    			subplacesOb = [];

    			for (let i = 0; i < places.length; i++) {
    				let story = places[i].stories.filter(d => d.label == code);
    				let s;

    				if (story.length > 0) {
    					s = story[0].label.split("_");

    					if (s.length > 4) {
    						s[3] = s[3] + "_" + s[4];
    						s.pop();
    					}
    				}

    				let tmpOb = {
    					'place': places[i],
    					story,
    					'region': regions.find(d => d.code == places[i].parents[0].code),
    					's': [s]
    				};

    				subplacesOb = [...subplacesOb, tmpOb];
    			}

    			for (let i = 0; i < subplacesOb.length; i++) {
    				if (subplacesOb[i]['story'].length == 0) {
    					subplacesOb.splice(i, 1);
    					i = i - 1;
    				}
    			}

    			let subplacesLow = subplacesOb.sort(function (a, b) {
    				return a['story'][0]['value'] - b['story'][0]['value'];
    			}).slice(0, 3);

    			let subplacesHigh = subplacesOb.sort(function (a, b) {
    				return b['story'][0]['value'] - a['story'][0]['value'];
    			}).slice(0, 3);

    			let subplacesMid = subplacesOb.sort(function (a, b) {
    				return Math.abs(a['story'][0]['value']) - Math.abs(b['story'][0]['value']);
    			}).slice(0, 3);

    			subplacesOb = subplacesHigh.concat(subplacesMid, subplacesLow);

    			// placesOb=placesOb.slice(0,6)
    			console.log('subplacesOb', subplacesOb);

    			$$invalidate(11, placesOb = subplacesOb);
    			$$invalidate(11, placesOb = [...new Set(placesOb)]);
    		}

    		$$invalidate(9, loadedb = true);
    	}

    	/// LOAD TOPIC
    	function loadTopic(code) {
    		console.log("code", code);
    		$$invalidate(11, placesOb = []);

    		for (let i = 0; i < places.length; i++) {
    			let story = places[i].stories.filter(d => d.label.split("_")[0] + "_" + d.label.split("_")[1] + "_" + d.label.split("_")[2] == code);
    			let s;

    			if (story.length > 0) {
    				s = story[0].label.split("_");

    				if (s.length > 4) {
    					s[3] = s[3] + "_" + s[4];
    					s.pop();
    				}
    			}

    			let tmpOb = {
    				'place': places[i],
    				story,
    				'region': regions.find(d => d.code == places[i].parents[0].code),
    				's': [s]
    			};

    			$$invalidate(11, placesOb = [...placesOb, tmpOb]);
    		}

    		for (let i = 0; i < placesOb.length; i++) {
    			if (placesOb[i]['story'].length == 0) {
    				placesOb.splice(i, 1);
    				i = i - 1;
    			}
    		}

    		let placesLow = placesOb.sort(function (a, b) {
    			return a['story'][0]['value'] - b['story'][0]['value'];
    		}).slice(0, 3);

    		let placesHigh = placesOb.sort(function (a, b) {
    			return b['story'][0]['value'] - a['story'][0]['value'];
    		}).slice(0, 3);

    		let placesMid = placesOb.sort(function (a, b) {
    			return Math.abs(a['story'][0]['value']) - Math.abs(b['story'][0]['value']);
    		}).slice(0, 3);

    		$$invalidate(11, placesOb = placesHigh.concat(placesMid, placesLow));

    		// placesOb=placesOb.slice(0,10)
    		$$invalidate(11, placesOb = [...new Set(placesOb)]);

    		console.log('places: sort ', placesOb);
    		$$invalidate(7, topic = true);
    	}

    	function iterate(obj, pname) {
    		Object.keys(obj).forEach(key => {
    			if (typeof obj[key] === 'object') {
    				iterate(obj[key], pname);
    			} else {
    				obj[key] = createText(obj[key], { health, health, plcname: pname });
    			}
    		});
    	}

    	function results(place, rgn, topicsIn, s, story) {
    		// Define the word to describe population change in standfirst
    		if (place.data.population.value.change.all > 8) {
    			expand = "expanded";
    		} else if (place.data.population.value.change.all > 3) {
    			expand = "grew";
    		} else if (place.data.population.value.change.all > 0) {
    			expand = "did not change much";
    		} else {
    			expand = "shrunk";
    		}

    		// Define the word to describe health change in standfirst
    		if (place.data.health.perc.change.good > 0) {
    			health = "improved";
    		} else if (place.data.health.perc.change.good < 0) {
    			health = "deteriorated";
    		}

    		var o = JSON.parse(JSON.stringify(topicsIn));
    		iterate(o, place.name);

    		function topic(i, top) {
    			let ttop;

    			if (top) {
    				ttop = top;
    			} else {
    				ttop = s[i][3];
    			}

    			return o[s[i][0]][ttop];
    		}

    		function cap(string) {
    			return string.charAt(0).toUpperCase() + string.slice(1);
    		}

    		return rosaenlg_en_US.render(puggy, {
    			language: 'en_UK',
    			place,
    			data: place.data,
    			cou: place.parents[0].name == "Wales" ? wal : eng,
    			eng,
    			rgn,
    			parent: uncap1(regionThe(place.parents[0].name)),
    			parentNT: uncap1(regionThe(place.parents[0].name, "NT")),
    			s,
    			stories: story,
    			priorities: place.Priorities,
    			grewSyn,
    			locRankCha,
    			natRankCha,
    			locRankCur,
    			natRankCur,
    			hiRank: place.hiRank,
    			topic,
    			topics: o,
    			chains,
    			country: "England",
    			get_word,
    			figs,
    			otherEst,
    			cur,
    			cha,
    			qui,
    			cap,
    			cap,
    			otherRank,
    			ud,
    			city,
    			drop,
    			drop,
    			ord,
    			ageBandLU,
    			nuword,
    			sign,
    			udord,
    			eq,
    			eq,
    			near: place.nearSimilar.nearTops,
    			adv,
    			uds
    		});
    	}

    	setTimeout(
    		function () {
    			setInterval(
    				function () {
    					d3.selectAll('div#visph').attr('style', `
			background-color: #f6f6f6; 
			color: #e1e7ea; 
			height: 240px;
			padding: 80px;
			font-size: 2.8rem;
			font-weight: 600;
			margin-bottom: 80px;`);
    				},
    				1000
    			);
    		},
    		2000
    	);

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Topics> was created with unknown prop '${key}'`);
    	});

    	function select_selected_binding(value) {
    		selected = value;
    		$$invalidate(0, selected);
    	}

    	const select_handler = () => {
    		if (selected) {
    			loadTopic(selected.value);
    		}
    	};

    	function selectb_selectedb_binding(value) {
    		selectedb = value;
    		$$invalidate(1, selectedb);
    	}

    	const select_handler_1 = () => {
    		if (selectedb) {
    			loadSubTopic(selectedb.value);
    		}
    	};

    	$$self.$capture_state = () => ({
    		uds,
    		adv,
    		eq,
    		udord,
    		sign,
    		nuword,
    		ageBandLU,
    		ord,
    		uncap1,
    		regionThe,
    		drop,
    		ud,
    		otherRank,
    		otherEst,
    		qui,
    		cha,
    		cur,
    		figs,
    		get_word,
    		city,
    		chains,
    		Select,
    		Selectb: SelectB,
    		load: archieml.load,
    		robojournalist: createText,
    		wal,
    		selected,
    		selectedb,
    		quartiles,
    		locRankCha,
    		locRankCur,
    		eng,
    		rgncode,
    		rgnLoad,
    		natRankCha,
    		natRankCur,
    		topics,
    		topic,
    		health,
    		expand,
    		topicOptions,
    		subTopicOpt,
    		regionArr,
    		regions,
    		loaded1,
    		loadedb,
    		places,
    		codeArr,
    		puggy,
    		loaded,
    		onRosaeNlgLoad,
    		grewSyn,
    		placesOb,
    		subplacesOb,
    		loadSubTopic,
    		loadTopic,
    		iterate,
    		results,
    		subSel,
    		placesload
    	});

    	$$self.$inject_state = $$props => {
    		if ('wal' in $$props) wal = $$props.wal;
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('selectedb' in $$props) $$invalidate(1, selectedb = $$props.selectedb);
    		if ('quartiles' in $$props) quartiles = $$props.quartiles;
    		if ('locRankCha' in $$props) locRankCha = $$props.locRankCha;
    		if ('locRankCur' in $$props) locRankCur = $$props.locRankCur;
    		if ('eng' in $$props) $$invalidate(4, eng = $$props.eng);
    		if ('rgncode' in $$props) rgncode = $$props.rgncode;
    		if ('rgnLoad' in $$props) $$invalidate(5, rgnLoad = $$props.rgnLoad);
    		if ('natRankCha' in $$props) natRankCha = $$props.natRankCha;
    		if ('natRankCur' in $$props) natRankCur = $$props.natRankCur;
    		if ('topics' in $$props) $$invalidate(6, topics = $$props.topics);
    		if ('topic' in $$props) $$invalidate(7, topic = $$props.topic);
    		if ('health' in $$props) health = $$props.health;
    		if ('expand' in $$props) expand = $$props.expand;
    		if ('topicOptions' in $$props) $$invalidate(12, topicOptions = $$props.topicOptions);
    		if ('subTopicOpt' in $$props) $$invalidate(32, subTopicOpt = $$props.subTopicOpt);
    		if ('regionArr' in $$props) regionArr = $$props.regionArr;
    		if ('regions' in $$props) regions = $$props.regions;
    		if ('loaded1' in $$props) $$invalidate(8, loaded1 = $$props.loaded1);
    		if ('loadedb' in $$props) $$invalidate(9, loadedb = $$props.loadedb);
    		if ('places' in $$props) places = $$props.places;
    		if ('codeArr' in $$props) codeArr = $$props.codeArr;
    		if ('puggy' in $$props) puggy = $$props.puggy;
    		if ('loaded' in $$props) $$invalidate(10, loaded = $$props.loaded);
    		if ('grewSyn' in $$props) grewSyn = $$props.grewSyn;
    		if ('placesOb' in $$props) $$invalidate(11, placesOb = $$props.placesOb);
    		if ('subplacesOb' in $$props) subplacesOb = $$props.subplacesOb;
    		if ('subSel' in $$props) $$invalidate(2, subSel = $$props.subSel);
    		if ('placesload' in $$props) $$invalidate(3, placesload = $$props.placesload);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*placesload*/ 8) {
    			console.log('placesload', placesload);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 1) {
    			$$invalidate(2, subSel = subTopicOpt[selected.value]);
    		}

    		if ($$self.$$.dirty[0] & /*subSel*/ 4) {
    			console.log('subTopicOpt', subSel);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 1) {
    			console.log('*****selected', selected);
    		}

    		if ($$self.$$.dirty[0] & /*selectedb*/ 2) {
    			console.log('*****selectedb', selectedb);
    		}
    	};

    	$$invalidate(3, placesload = false);

    	return [
    		selected,
    		selectedb,
    		subSel,
    		placesload,
    		eng,
    		rgnLoad,
    		topics,
    		topic,
    		loaded1,
    		loadedb,
    		loaded,
    		placesOb,
    		topicOptions,
    		onRosaeNlgLoad,
    		loadSubTopic,
    		loadTopic,
    		results,
    		select_selected_binding,
    		select_handler,
    		selectb_selectedb_binding,
    		select_handler_1
    	];
    }

    class Topics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Topics",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Words.svelte generated by Svelte v3.43.1 */

    const { console: console_1 } = globals;
    const file$3 = "src/Words.svelte";

    function create_fragment$5(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "5212");
    			attr_dev(iframe, "frameborder", "0");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://observablehq.com/embed/cc9449078bb7b9ae?cells=chart%2Csent")) attr_dev(iframe, "src", iframe_src_value);
    			add_location(iframe, file$3, 40, 0, 1437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Words', slots, []);
    	let el;
    	var selected;
    	var topics;
    	fetch("./archie.aml").then(res => res.text()).then(txt => topics = archieml.load(txt));

    	let topicOptions = [
    		{
    			"label": "Average age",
    			"value": "agemed_value_change"
    		},
    		// {"label": "Care provision", "value": "care_perc_change"},
    		{
    			"label": "Employment status",
    			"value": "economic_perc_change"
    		},
    		{
    			"label": "Ethnicity",
    			"value": "ethnicity_perc_change"
    		},
    		{
    			"label": "Health",
    			"value": "health_perc_change"
    		},
    		{
    			"label": "Hours worked",
    			"value": "hoursworked_perc_change"
    		},
    		{
    			"label": "Households with children",
    			"value": "children_perc_change"
    		},
    		{
    			"label": "Households by family",
    			"value": "household_perc_change"
    		},
    		{
    			"label": "Marital status",
    			"value": "marital_perc_change"
    		},
    		{
    			"label": "Population",
    			"value": "population_value_change"
    		},
    		{
    			"label": "Religion",
    			"value": "religion_perc_change"
    		},
    		{
    			"label": "Tenure",
    			"value": "tenure_perc_change"
    		}
    	];

    	function loadTopic(value) {
    		console.log("topics", topics[value.split("_")[0]]);
    		console.log("topics", topics);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Words> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		load: archieml.load,
    		Select,
    		el,
    		selected,
    		topics,
    		topicOptions,
    		loadTopic
    	});

    	$$self.$inject_state = $$props => {
    		if ('el' in $$props) el = $$props.el;
    		if ('selected' in $$props) selected = $$props.selected;
    		if ('topics' in $$props) topics = $$props.topics;
    		if ('topicOptions' in $$props) topicOptions = $$props.topicOptions;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Words extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Words",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/tabs/Tabs.svelte generated by Svelte v3.43.1 */
    const file$2 = "src/tabs/Tabs.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tabs");
    			add_location(div, file$2, 47, 0, 1063);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TABS = {};

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, ['default']);
    	const tabs = [];
    	const panels = [];
    	const selectedTab = writable(null);
    	const selectedPanel = writable(null);

    	setContext(TABS, {
    		registerTab: tab => {
    			tabs.push(tab);
    			selectedTab.update(current => current || tab);

    			onDestroy(() => {
    				const i = tabs.indexOf(tab);
    				tabs.splice(i, 1);

    				selectedTab.update(current => current === tab
    				? tabs[i] || tabs[tabs.length - 1]
    				: current);
    			});
    		},
    		registerPanel: panel => {
    			panels.push(panel);
    			selectedPanel.update(current => current || panel);

    			onDestroy(() => {
    				const i = panels.indexOf(panel);
    				panels.splice(i, 1);

    				selectedPanel.update(current => current === panel
    				? panels[i] || panels[panels.length - 1]
    				: current);
    			});
    		},
    		selectTab: tab => {
    			const i = tabs.indexOf(tab);
    			selectedTab.set(tab);
    			selectedPanel.set(panels[i]);
    		},
    		selectedTab,
    		selectedPanel
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TABS,
    		setContext,
    		onDestroy,
    		writable,
    		tabs,
    		panels,
    		selectedTab,
    		selectedPanel
    	});

    	return [$$scope, slots];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/tabs/TabList.svelte generated by Svelte v3.43.1 */

    const file$1 = "src/tabs/TabList.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "tab-list svelte-1qgay6m");
    			add_location(div, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabList', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TabList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabList",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/tabs/TabPanel.svelte generated by Svelte v3.43.1 */

    // (11:0) {#if $selectedPanel === panel}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(11:0) {#if $selectedPanel === panel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$selectedPanel*/ ctx[0] === /*panel*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$selectedPanel*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $selectedPanel;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TabPanel', slots, ['default']);
    	const panel = {};
    	const { registerPanel, selectedPanel } = getContext(TABS);
    	validate_store(selectedPanel, 'selectedPanel');
    	component_subscribe($$self, selectedPanel, value => $$invalidate(0, $selectedPanel = value));
    	registerPanel(panel);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TabPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		panel,
    		registerPanel,
    		selectedPanel,
    		$selectedPanel
    	});

    	return [$selectedPanel, panel, selectedPanel, $$scope, slots];
    }

    class TabPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TabPanel",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/tabs/Tab.svelte generated by Svelte v3.43.1 */
    const file = "src/tabs/Tab.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-b9uj0r");
    			toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			add_location(button, file, 26, 0, 417);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*$selectedTab, tab*/ 3) {
    				toggle_class(button, "selected", /*$selectedTab*/ ctx[0] === /*tab*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $selectedTab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	const tab = {};
    	const { registerTab, selectTab, selectedTab } = getContext(TABS);
    	validate_store(selectedTab, 'selectedTab');
    	component_subscribe($$self, selectedTab, value => $$invalidate(0, $selectedTab = value));
    	registerTab(tab);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => selectTab(tab);

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		TABS,
    		tab,
    		registerTab,
    		selectTab,
    		selectedTab,
    		$selectedTab
    	});

    	return [$selectedTab, tab, selectTab, selectedTab, $$scope, slots, click_handler];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.43.1 */

    // (12:2) <Tab>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Area Reports");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(12:2) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (13:2) <Tab>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Topic QA");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(13:2) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (14:2) <Tab>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Word Selection");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(14:2) <Tab>",
    		ctx
    	});

    	return block;
    }

    // (11:1) <TabList>
    function create_default_slot_4(ctx) {
    	let tab0;
    	let t0;
    	let tab1;
    	let t1;
    	let tab2;
    	let current;

    	tab0 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab2 = new Tab({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t0 = space();
    			create_component(tab1.$$.fragment);
    			t1 = space();
    			create_component(tab2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tab1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tab2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    			const tab2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tab2_changes.$$scope = { dirty, ctx };
    			}

    			tab2.$set(tab2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(tab2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(tab2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tab1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tab2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(11:1) <TabList>",
    		ctx
    	});

    	return block;
    }

    // (16:1) <TabPanel>
    function create_default_slot_3(ctx) {
    	let reports;
    	let current;
    	reports = new Reports({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(reports.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(reports, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(reports.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(reports.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(reports, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(16:1) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (19:1) <TabPanel>
    function create_default_slot_2(ctx) {
    	let topics;
    	let current;
    	topics = new Topics({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(topics.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topics, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topics, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(19:1) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (22:1) <TabPanel>
    function create_default_slot_1(ctx) {
    	let words;
    	let current;
    	words = new Words({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(words.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(words, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(words.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(words.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(words, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(22:1) <TabPanel>",
    		ctx
    	});

    	return block;
    }

    // (10:0) <Tabs>
    function create_default_slot(ctx) {
    	let tablist;
    	let t0;
    	let tabpanel0;
    	let t1;
    	let tabpanel1;
    	let t2;
    	let tabpanel2;
    	let current;

    	tablist = new TabList({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel0 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel1 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabpanel2 = new TabPanel({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablist.$$.fragment);
    			t0 = space();
    			create_component(tabpanel0.$$.fragment);
    			t1 = space();
    			create_component(tabpanel1.$$.fragment);
    			t2 = space();
    			create_component(tabpanel2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablist, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tabpanel0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tabpanel1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(tabpanel2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablist_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tablist_changes.$$scope = { dirty, ctx };
    			}

    			tablist.$set(tablist_changes);
    			const tabpanel0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tabpanel0_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel0.$set(tabpanel0_changes);
    			const tabpanel1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tabpanel1_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel1.$set(tabpanel1_changes);
    			const tabpanel2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tabpanel2_changes.$$scope = { dirty, ctx };
    			}

    			tabpanel2.$set(tabpanel2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablist.$$.fragment, local);
    			transition_in(tabpanel0.$$.fragment, local);
    			transition_in(tabpanel1.$$.fragment, local);
    			transition_in(tabpanel2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablist.$$.fragment, local);
    			transition_out(tabpanel0.$$.fragment, local);
    			transition_out(tabpanel1.$$.fragment, local);
    			transition_out(tabpanel2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablist, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tabpanel0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tabpanel1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tabpanel2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(10:0) <Tabs>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let warning;
    	let t;
    	let tabs;
    	let current;
    	warning = new Warning({ $$inline: true });

    	tabs = new Tabs({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warning.$$.fragment);
    			t = space();
    			create_component(tabs.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(warning, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tabs, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warning.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warning.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warning, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tabs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Warning,
    		Reports,
    		Topics,
    		Words,
    		Tabs,
    		TabList,
    		TabPanel,
    		Tab
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
