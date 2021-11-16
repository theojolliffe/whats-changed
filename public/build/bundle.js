
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    async function getData(url) {
      let response = await fetch(url);
      let string = await response.text();
    	let data = await csvParse(string, autoType);
      return data;
    }

    let array = ['South East', 'South West', 'East', 'West Midlands', 'East Midlands', 'North East', 'North West', 'Yorkshire and The Humber'];
    let regionThe = place => !array.includes(place) ? place : 'The ' + place;

    function uncap1(string) {
        if (string.slice(0, 3)=="The") {
            return string.charAt(0).toLowerCase() + string.slice(1);
        } else { return string }
    }

    /* src/ui/Select.svelte generated by Svelte v3.43.1 */
    const file$2 = "src/ui/Select.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[35] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[32] = list[i];
    	child_ctx[33] = list;
    	child_ctx[34] = i;
    	return child_ctx;
    }

    // (225:1) {:else}
    function create_else_block_1(ctx) {
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
    			add_location(span0, file$2, 226, 2, 4757);
    			attr_dev(span1, "class", "button svelte-qdzmwx");
    			toggle_class(span1, "search", /*search*/ ctx[3]);
    			toggle_class(span1, "down", !/*search*/ ctx[3]);
    			add_location(span1, file$2, 227, 2, 4815);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "svelte-qdzmwx");
    			add_location(a, file$2, 225, 1, 4721);
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
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(225:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (220:1) {#if selectedItem && !search}
    function create_if_block_4(ctx) {
    	let a;
    	let span0;
    	let t0_value = /*selectedItem*/ ctx[6][/*label*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let t2;
    	let span1;
    	let mounted;
    	let dispose;
    	let if_block = /*group*/ ctx[2] && create_if_block_5(ctx);

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
    			add_location(span0, file$2, 221, 2, 4536);
    			attr_dev(span1, "class", "button close svelte-qdzmwx");
    			add_location(span1, file$2, 222, 2, 4644);
    			attr_dev(a, "id", "toggle");
    			attr_dev(a, "class", "selected svelte-qdzmwx");
    			add_location(a, file$2, 220, 1, 4483);
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
    					if_block = create_if_block_5(ctx);
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(220:1) {#if selectedItem && !search}",
    		ctx
    	});

    	return block;
    }

    // (222:48) {#if group}
    function create_if_block_5(ctx) {
    	let small;
    	let t_value = /*selectedItem*/ ctx[6][/*group*/ ctx[2]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(t_value);
    			attr_dev(small, "class", "svelte-qdzmwx");
    			add_location(small, file$2, 221, 59, 4593);
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
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(222:48) {#if group}",
    		ctx
    	});

    	return block;
    }

    // (231:1) {#if expanded}
    function create_if_block$1(ctx) {
    	let div;
    	let input_1;
    	let t;
    	let ul;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*filter*/ ctx[4].length < 3) return create_if_block_1$1;
    		if (/*filtered*/ ctx[9][0] && /*group*/ ctx[2]) return create_if_block_2$1;
    		if (/*filtered*/ ctx[9][0]) return create_if_block_3$1;
    		return create_else_block;
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
    			add_location(input_1, file$2, 232, 2, 4967);
    			attr_dev(ul, "class", "svelte-qdzmwx");
    			add_location(ul, file$2, 233, 2, 5084);
    			attr_dev(div, "id", "dropdown");
    			set_style(div, "top", "0");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			add_location(div, file$2, 231, 1, 4914);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(231:1) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    // (249:3) {:else}
    function create_else_block(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "No results";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$2, 249, 3, 5657);
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
    		id: create_else_block.name,
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
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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

    // (235:3) {#if filter.length < 3}
    function create_if_block_1$1(ctx) {
    	let li;

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Type a name...";
    			attr_dev(li, "class", "svelte-qdzmwx");
    			add_location(li, file$2, 235, 3, 5119);
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
    		source: "(235:3) {#if filter.length < 3}",
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
    			add_location(li, file$2, 244, 3, 5475);
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
    function create_each_block(ctx) {
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
    			add_location(small, file$2, 239, 20, 5362);
    			attr_dev(li, "class", "svelte-qdzmwx");
    			toggle_class(li, "highlight", /*active*/ ctx[8] == /*i*/ ctx[34]);
    			add_location(li, file$2, 238, 3, 5214);
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(238:3) {#each filtered as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedItem*/ ctx[6] && !/*search*/ ctx[3]) return create_if_block_4;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*expanded*/ ctx[7] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", "select");
    			attr_dev(div, "class", "svelte-qdzmwx");
    			toggle_class(div, "active", /*expanded*/ ctx[7]);
    			add_location(div, file$2, 218, 0, 4386);
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
    					if_block1 = create_if_block$1(ctx);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function sleep(ms) {
    	return new Promise(resolve => setTimeout(resolve, ms));
    }

    function instance$2($$self, $$props, $$invalidate) {
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

    		sleep(10).then(() => {
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
    			instance$2,
    			create_fragment$2,
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
    			id: create_fragment$2.name
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

    /* src/ui/Warning.svelte generated by Svelte v3.43.1 */

    const file$1 = "src/ui/Warning.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let strong;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			strong = element("strong");
    			strong.textContent = "Warning!";
    			t1 = text(" This is a prototype. Data likely to contain inaccuracies.");
    			add_location(strong, file$1, 1, 2, 24);
    			attr_dev(div, "class", "warning svelte-srzfvi");
    			add_location(div, file$1, 0, 0, 0);
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
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
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Warning",
    			options,
    			id: create_fragment$1.name
    		});
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

    const ordinal = i => {
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
    				stack[stack.length - 1] = ordinal(Number(stack[stack.length - 1]));
    			} else if (token === '~ord\'') {
    				let result = ordinal(Number(stack.pop()));
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

    /* src/App.svelte generated by Svelte v3.43.1 */

    const { Object: Object_1, console: console_1, document: document_1 } = globals;
    const file = "src/App.svelte";

    // (361:1) {#if place}
    function create_if_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*loaded*/ ctx[5] && create_if_block_1(ctx);

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
    			if (/*loaded*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*loaded*/ 32) {
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(361:1) {#if place}",
    		ctx
    	});

    	return block;
    }

    // (362:2) {#if loaded}
    function create_if_block_1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*eng*/ ctx[3] && create_if_block_2(ctx);

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
    		source: "(362:2) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    // (363:3) {#if eng}
    function create_if_block_2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*rgn*/ ctx[4] && create_if_block_3(ctx);

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
    		source: "(363:3) {#if eng}",
    		ctx
    	});

    	return block;
    }

    // (364:4) {#if rgn}
    function create_if_block_3(ctx) {
    	let div3;
    	let div2;
    	let h1;
    	let t0_value = /*place*/ ctx[2].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let div0;
    	let select;
    	let updating_selected;
    	let t3;
    	let html_tag;
    	let raw0_value = /*standfirst*/ ctx[8](/*place*/ ctx[2]) + "";
    	let t4;
    	let p0;
    	let t5;
    	let span;
    	let t7;
    	let t8_value = /*place*/ ctx[2].gss + "";
    	let t8;
    	let t9;
    	let t10;
    	let main;
    	let html_tag_1;
    	let raw1_value = /*results*/ ctx[9](/*place*/ ctx[2]) + "";
    	let t11;
    	let hr;
    	let t12;
    	let h2;
    	let t14;
    	let p1;
    	let t16;
    	let p2;
    	let t18;
    	let p3;
    	let t20;
    	let p4;
    	let t22;
    	let div4;
    	let current;
    	let mounted;
    	let dispose;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[10](value);
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
    	select.$on("select", /*select_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(": What's changed");
    			t2 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(select.$$.fragment);
    			t3 = space();
    			html_tag = new HtmlTag();
    			t4 = space();
    			p0 = element("p");
    			t5 = text("Here are some of the ");
    			span = element("span");
    			span.textContent = "most notable changes";
    			t7 = text(" from across the ");
    			t8 = text(t8_value);
    			t9 = text(".");
    			t10 = space();
    			main = element("main");
    			html_tag_1 = new HtmlTag();
    			t11 = space();
    			hr = element("hr");
    			t12 = space();
    			h2 = element("h2");
    			h2.textContent = "Creating this article";
    			t14 = space();
    			p1 = element("p");
    			p1.textContent = "This article has been generated using a semi-automated system for story selection and data-to-text templating.";
    			t16 = space();
    			p2 = element("p");
    			p2.textContent = "The system relies upon a computer programme to decide which topics are relevant to specific areas and describe the data in words.";
    			t18 = space();
    			p3 = element("p");
    			p3.textContent = "For each local authority district, the variables that have changed the most since 2011 are selected automatically. Variables that have experienced a considerably larger or smaller change than the regional or national averages are also selected.";
    			t20 = space();
    			p4 = element("p");
    			p4.textContent = "The decisions made by the computer programme were coded by staff in the ONS Digital Publishing team in advance of the release of Census 2021 data.";
    			t22 = space();
    			div4 = element("div");
    			attr_dev(h1, "class", "svelte-zz8eih");
    			add_location(h1, file, 366, 7, 10188);
    			set_style(div0, "width", "640px");
    			set_style(div0, "margin", "50px auto");
    			add_location(div0, file, 368, 8, 10247);
    			add_location(div1, file, 367, 7, 10233);
    			html_tag.a = t4;
    			attr_dev(span, "class", "back-to-top svelte-zz8eih");
    			add_location(span, file, 373, 31, 10524);
    			add_location(p0, file, 373, 7, 10500);
    			set_style(div2, "width", "640px");
    			set_style(div2, "margin", "0 auto");
    			add_location(div2, file, 365, 6, 10138);
    			attr_dev(div3, "id", "sf");
    			attr_dev(div3, "class", "svelte-zz8eih");
    			add_location(div3, file, 364, 5, 10118);
    			html_tag_1.a = t11;
    			set_style(hr, "width", "40%");
    			set_style(hr, "margin", "60px auto 30px auto");
    			add_location(hr, file, 379, 6, 10701);
    			attr_dev(h2, "id", "create");
    			add_location(h2, file, 380, 6, 10762);
    			add_location(p1, file, 381, 6, 10811);
    			add_location(p2, file, 382, 6, 10935);
    			add_location(p3, file, 383, 6, 11078);
    			add_location(p4, file, 384, 6, 11336);
    			set_style(div4, "height", "200px");
    			add_location(div4, file, 385, 6, 11496);
    			attr_dev(main, "class", "svelte-zz8eih");
    			add_location(main, file, 376, 5, 10658);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(select, div0, null);
    			append_dev(div2, t3);
    			html_tag.m(raw0_value, div2);
    			append_dev(div2, t4);
    			append_dev(div2, p0);
    			append_dev(p0, t5);
    			append_dev(p0, span);
    			append_dev(p0, t7);
    			append_dev(p0, t8);
    			append_dev(p0, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, main, anchor);
    			html_tag_1.m(raw1_value, main);
    			append_dev(main, t11);
    			append_dev(main, hr);
    			append_dev(main, t12);
    			append_dev(main, h2);
    			append_dev(main, t14);
    			append_dev(main, p1);
    			append_dev(main, t16);
    			append_dev(main, p2);
    			append_dev(main, t18);
    			append_dev(main, p3);
    			append_dev(main, t20);
    			append_dev(main, p4);
    			append_dev(main, t22);
    			append_dev(main, div4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", goTop, false, false, false);
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
    			if ((!current || dirty[0] & /*place*/ 4) && raw0_value !== (raw0_value = /*standfirst*/ ctx[8](/*place*/ ctx[2]) + "")) html_tag.p(raw0_value);
    			if ((!current || dirty[0] & /*place*/ 4) && t8_value !== (t8_value = /*place*/ ctx[2].gss + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty[0] & /*place*/ 4) && raw1_value !== (raw1_value = /*results*/ ctx[9](/*place*/ ctx[2]) + "")) html_tag_1.p(raw1_value);
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
    			if (detaching) detach_dev(div3);
    			destroy_component(select);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(364:4) {#if rgn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let script0;
    	let script0_src_value;
    	let script1;
    	let script1_src_value;
    	let t0;
    	let warning;
    	let t1;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	warning = new Warning({ $$inline: true });
    	let if_block = /*place*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			script0 = element("script");
    			script1 = element("script");
    			t0 = space();
    			create_component(warning.$$.fragment);
    			t1 = space();
    			div = element("div");
    			if (if_block) if_block.c();
    			if (!src_url_equal(script0.src, script0_src_value = "https://d3js.org/d3.v3.min.js")) attr_dev(script0, "src", script0_src_value);
    			attr_dev(script0, "charset", "utf-8");
    			add_location(script0, file, 355, 1, 9824);
    			if (!src_url_equal(script1.src, script1_src_value = "https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file, 356, 1, 9895);
    			add_location(div, file, 359, 0, 10051);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, script0);
    			append_dev(document_1.head, script1);
    			insert_dev(target, t0, anchor);
    			mount_component(warning, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(script1, "load", /*onRosaeNlgLoad*/ ctx[6], false, false, false);
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
    					if_block = create_if_block(ctx);
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
    			transition_in(warning.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warning.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(script0);
    			detach_dev(script1);
    			if (detaching) detach_dev(t0);
    			destroy_component(warning, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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

    function figs(x) {
    	let sigfig = Number.parseFloat(Number.parseFloat(x).toPrecision(2));
    	let text;

    	if (x - sigfig < -x / 100) {
    		text = "under ";
    	}

    	if (x - sigfig < -x / 200) {
    		if (Math.round(Math.random()) == 1) {
    			text = "almost ";
    		} else {
    			text = "just under ";
    		}
    	} else if (x - sigfig > x / 100) {
    		text = " just over ";
    	} else if (x - sigfig > x / 200) {
    		text = "just over ";
    	} else {
    		text = "about ";
    	}

    	return [text, sigfig];
    }

    function qui(n) {
    	return Math.ceil(5 * n / 331);
    }

    function ud(n, w1, w2) {
    	if (n < 0) {
    		return w2;
    	} else {
    		return w1;
    	}
    }

    function goTop() {
    	let creation = document.getElementById('create');
    	creation.scrollIntoView();
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let defaultLoc = 'Manchester'; // Basingstoke and Deane
    	var topics;
    	fetch("./archie.aml").then(res => res.text()).then(txt => topics = archieml.load(txt));
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
    		natRankCur;

    	let loaded = false;

    	const onRosaeNlgLoad = () => {
    		$$invalidate(5, loaded = true);
    	};

    	// Data load functions
    	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/places_2020.csv").then(res => {
    		res.forEach(d => {
    			d.typepl = types[d.type].pl;
    			d.typenm = types[d.type].name;
    		});

    		res = res.filter(d => d['type'] == 'lad');
    		$$invalidate(0, options = res.sort((a, b) => a.name.localeCompare(b.name)));
    		$$invalidate(1, selected = options.find(d => d.name == defaultLoc));
    		loadArea(selected.code);
    	});

    	function loadArea(code) {
    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + code + ".json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    			quartiles = null;
    			$$invalidate(2, place = json);
    			s = place.stories.map(d => d.label.split("_"));

    			s.forEach(e => {
    				if (e.length > 4) {
    					e[3] = e[3] + "_" + e[4];
    					e.pop();
    				}
    			});

    			console.log('s', s);
    			rgncode = place.parents[0].code;
    			console.log("Place", place);
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
    	}

    	let grewSyn = {
    		1: "ballooned",
    		2: "grew",
    		3: "remained relatively stable",
    		4: "shrunk",
    		5: "fell sharply"
    	};

    	let num_word = {
    		'one': 1,
    		'quarter of a million': 250000,
    		'half a million': 500000,
    		'three quarters of a million': 750000
    	};

    	let frac_word = {
    		'one in two': 0.5,
    		'one in three': 0.333,
    		'one in four': 0.25,
    		'one in five': 0.2,
    		'one in six': 0.167,
    		'one in seven': 0.143,
    		'one in eight': 0.125,
    		'one in nine': 0.111,
    		'1 in 10': 0.1,
    		'1 in 11': 0.09,
    		'1 in 12': 0.083,
    		'1 in 13': 0.077,
    		'1 in 14': 0.071,
    		'1 in 15': 0.067,
    		'1 in 16': 0.063,
    		'1 in 17': 0.059,
    		'1 in 18': 0.056,
    		'1 in 19': 0.053,
    		'1 in 20': 0.05,
    		'2 in 10': 0.2,
    		'3 in 10': 0.3,
    		'4 in 10': 0.4,
    		'6 in 10': 0.6,
    		'7 in 10': 0.7,
    		'8 in 10': 0.8,
    		'9 in 10': 0.9,
    		'all': 1.0
    	};

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
    			if (Math.abs(num - dict[label]) < lowest) {
    				lowest = Math.abs(num - dict[label]);
    				lowest_label = label;

    				if (num - dict[label] == 0) {
    					OverUnder = "about";
    				} else if (num - dict[label] > 0) {
    					OverUnder = "just over";
    				} else if (num - dict[label] < 0) {
    					OverUnder = "just under";
    				}
    			}
    		}

    		return [OverUnder, lowest_label];
    	}

    	let chains = {
    		'good': ['bad', 'fair'],
    		'bad': ['good', 'fair'],
    		'white': ['black', 'asian'],
    		'rented_private': ['rented_social', 'owned'],
    		'inactive': ['employee', 'unemployed', 'self-employed'],
    		'self-employed': ['employee', 'unemployed', 'inactive'],
    		'employee': ['inactive', 'unemployed', 'self-employed'],
    		'unemployed': ['employee', 'inactive', 'self-employed'],
    		'car_van': ['bus', 'train_metro', 'foot', 'home'],
    		'bus': ['car_van', 'train_metro', 'foot', 'home'],
    		'train_metro': ['bus', 'car_van', 'foot', 'home'],
    		'foot': ['bus', 'train_metro', 'car_van', 'home'],
    		'home': ['bus', 'train_metro', 'foot', 'car_van'],
    		'OnePerson': ['Married', 'LoneParent', 'Cohabiting'],
    		'Christian': ['Muslim', 'Noreligion'],
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
    		'Male49plus': ['Male1-15']
    	};

    	function cur(i, type) {
    		if (type == "rl") {
    			type = "_rank_local";
    		} else if (type == "r") {
    			type = "_rank";
    		} else {
    			type = "";
    		}

    		return place.data[s[i][0]][s[i][1] + type][2011][s[i][3]];
    	}

    	function cha(i, type) {
    		if (type == "rl") {
    			type = "_rank_local";
    		} else if (type == "r") {
    			type = "_rank";
    		} else {
    			type = "";
    		}

    		return place.data[s[i][0]][s[i][1] + type]['change'][s[i][3]];
    	}

    	function otherEst(i, hiLo, type) {
    		if (typeof hiLo === "number" & hiLo < 0) {
    			hiLo = "highest";
    		} else if (typeof hiLo === "number") {
    			hiLo = "lowest";
    		}

    		let optAr = Object.assign({}, place.data[s[i][0]][s[i][1] + '_rank_local'][type]);
    		let l = new Set(chains[s[i][3]]);

    		for (let prop of Object.keys(optAr)) {
    			if (!l.has(prop)) {
    				delete optAr[prop];
    			}
    		}

    		let optArKey;

    		if (Object.keys(optAr).length > 1) {
    			if (hiLo == 'lowest') {
    				for (let [k, v] of Object.entries(optAr)) {
    					if (v > 0) {
    						delete optAr[k];
    					}
    				}

    				optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] > optAr[b] ? a : b);
    			}

    			if (hiLo == 'highest') {
    				for (let [k, v] of Object.entries(optAr)) {
    					if (v < 0) {
    						delete optAr[k];
    					}
    				}

    				optArKey = Object.keys(optAr).reduce((a, b) => optAr[a] < optAr[b] ? a : b);
    			}
    		} else {
    			optArKey = Object.keys(optAr);
    		}

    		return optArKey;
    	}

    	function otherRank(i, t) {
    		return place.data[s[i][0]][s[i][1] + '_rank_local']['change'][otherEst(i, cha(i, "rl"), 'change')];
    	}

    	var city;

    	if (parent == "London") {
    		city = "city";
    	} else {
    		city = "region";
    	}

    	function standfirst(place) {
    		let sf = [];
    		let changeMag = 0;

    		place.stories.forEach(e => {
    			if (sf.length < 4 & Math.abs(e['value']) > 4) {
    				sf.push(e['label'].split("_"));
    				changeMag = changeMag + Math.abs(e['value']);
    			}
    		});

    		return rosaenlg_en_US.render(stand, {
    			language: 'en_UK',
    			place,
    			topics,
    			s,
    			sf,
    			grewSyn,
    			qui,
    			natRankCha
    		});
    	}

    	function results(place) {
    		const iterate = obj => {
    			Object.keys(obj).forEach(key => {
    				if (typeof obj[key] === 'object') {
    					iterate(obj[key]);
    				} else {
    					obj[key] = createText(obj[key], { plcname: place.name });
    				} // console.log(`key: ${key}, value: ${obj[key]}`)
    			});
    		};

    		iterate(topics);
    		console.log('topics', topics);

    		function topic(i, top) {
    			let ttop;

    			if (top) {
    				ttop = top;
    			} else {
    				ttop = s[i][3];
    			}

    			return topics[s[i][0]][ttop];
    		}

    		function cap(string) {
    			return string.charAt(0).toUpperCase() + string.slice(1);
    		}

    		return rosaenlg_en_US.render(puggy, {
    			language: 'en_UK',
    			place,
    			data: place.data,
    			eng,
    			rgn,
    			parent: uncap1(regionThe(place.parents[0].name)),
    			s,
    			priorities: place.Priorities,
    			grewSyn,
    			locRankCha,
    			natRankCha,
    			locRankCur,
    			natRankCur,
    			hiRank: place.hiRank,
    			topic,
    			topics,
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
    			city
    		});
    	}

    	onMount(() => {
    		setTimeout(
    			function () {
    				d3.selectAll('div#visph').attr('style', `
			background-color: #f6f6f6; 
			color: #e1e7ea; 
			height: 240px;
			padding: 80px;
			font-size: 3rem;
			font-weight: 600;
			margin-bottom: 80px;`);
    			},
    			1000
    		);
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
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
    		getData,
    		uncap1,
    		regionThe,
    		Select,
    		Warning,
    		load: archieml.load,
    		onMount,
    		robojournalist: createText,
    		defaultLoc,
    		topics,
    		puggy,
    		stand,
    		types,
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
    		loaded,
    		onRosaeNlgLoad,
    		loadArea,
    		grewSyn,
    		num_word,
    		frac_word,
    		get_word,
    		figs,
    		chains,
    		cur,
    		cha,
    		qui,
    		otherEst,
    		otherRank,
    		ud,
    		city,
    		standfirst,
    		results,
    		goTop
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultLoc' in $$props) defaultLoc = $$props.defaultLoc;
    		if ('topics' in $$props) topics = $$props.topics;
    		if ('puggy' in $$props) puggy = $$props.puggy;
    		if ('stand' in $$props) stand = $$props.stand;
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
    		if ('loaded' in $$props) $$invalidate(5, loaded = $$props.loaded);
    		if ('grewSyn' in $$props) grewSyn = $$props.grewSyn;
    		if ('num_word' in $$props) num_word = $$props.num_word;
    		if ('frac_word' in $$props) frac_word = $$props.frac_word;
    		if ('chains' in $$props) chains = $$props.chains;
    		if ('city' in $$props) city = $$props.city;
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
    		loaded,
    		onRosaeNlgLoad,
    		loadArea,
    		standfirst,
    		results,
    		select_selected_binding,
    		select_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

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
