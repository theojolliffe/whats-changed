
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    var string = `
// mixin standfirst1
//     | #[+value(place.name)]'s 
//     | #[+value(topic[s[0][0]+"_"+s[0][3]].subject)]
//     | #[+value(grewSyn[Math.ceil((5*locRank[0])/336)])]
//     | in the 10 years following the 2011 Census.

// mixin standfirst2
//     | Here are some of Amber Valley’s most notable changes.

// Population passes half a million
mixin subheadVal(i)
    | #[+value(topic[s[i][0]+"_"+s[i][3]].subject)] 
    if (get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[0]<1)
        | nears 
    else
        | passes
    | #[+value(get_word(data[s[i][0]][s[i][1]]['2011'][s[i][3]], "num")[1])]


mixin tenYears
  synz {mode:'sequence'}
    syn
      | Between the last two censuses
    syn
      | In the decade to 2021
    syn
      | In the 10 years leading up to 2021
    syn
      | In the decade leading up to the last census
    syn
      | In the 10 years leading up to the last census


// In the decade to 2021, the population of Manchester rose by over 28% from 391,221 to 503,127, giving it the greatest headcount of any local authority area in the North West of England.
mixin sent1Val(i)
    | #[+tenYears], 
    | the #[+value(topic[s[i][0]+"_"+s[i][3]].subject)] 
    | of #[+value(place.name)] 
    | rose 
    | #[+value(figs(place.stories[i].value)[0])]
    | #[+value((figs(place.stories[i].value)[1])/100, {'FORMAT': '0[.]0%'})] 
    | from #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[0])]
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[1])]
    | to #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]])[0])]
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]])[1])],
    | giving it the 
    if (data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]]>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local'][2011][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | greatest 
    | #[+value(topic[s[i][0]+"_"+s[i][3]].synonym)] 
    | of any local authority area in #[+value(parent)].

// The addition of over 100,000 people means Manchester's population is also the fastest-growing in the North West and the second-fastest-growing across England. Only Tower Hamlets in London, with an increase of almost 30%, has a faster-growing population.
mixin sent2Val(i)
    | The 
    if (data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]]<0)
        | loss
    else
        | addition
    | of 
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]], "num")[0])] 
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][s[i][3]]-data[s[i][0]][s[i][1]][2001][s[i][3]], "num")[1])]
    | people 
    | means
    | #[+value(place.name)]'s 
    | population 
    | is also the
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]])>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | fastest-growing 
    | in the #[+value(parent)] 
    | and the 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]])>1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank']['change'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    | fastest-growing 
    | across 
    | #[+value(country)]. 
    | Only 
    | #[+value(Object.keys(data[s[i][0]][s[i][1]+'_rank']['top_bottom'][s[i][3]][1]))] 
    | in London 
    | , with an increase of almost 
    | #[+value((figs(Object.values(data[s[i][0]][s[i][1]+'_rank']['top_bottom'][s[i][3]][1]))[1])/100, {'FORMAT': '0[.]0%'})]
    | , has a 
    | faster-growing 
    | population.

// For each football pitch-sized piece of land (about 7,140 square metres), Manchester is now home to, on average, about 31 people, compared to 24 in 2011.
mixin density
    | For each football pitch sized piece of land (about #[+value(7140)] square metres), #[+value(place.name)] is now home to, on average, about 
    | #[+value(figs(0.714*data.density.value[2011].all)[1])] 
    | people, compared to 
    | #[+value(figs(0.714*data.density.value[2001].all)[1])] in 2011.

// Between 2011 and 2021, Manchester overtook Wiltshire and Liverpool to become England's eighth-most populated local authority.
mixin sent4Val(i)
    | Between 2011 and 2021, #[+value(place.name)] 
    | overtook 
    | #[+value(data[s[i][0]][s[i][1]+'_rank'].overtake[s[i][3]][0])] 
    | and 
    | #[+value(data[s[i][0]][s[i][1]+'_rank'].overtake[s[i][3]][1])] 
    | to become #[+value(country)]'s
    | #[+value(data.population.value_rank[2011].all, {'ORDINAL_TEXTUAL':true})]
    | most 
    | populated 
    | local authority.

// Increasing ethnic diversity
mixin subheadIncreasing(i)
    | Increasing ethnic diversity

// Health improves
mixin subheadMore(i)
    | More private renters

// Health improves
mixin subheadPerc(i)
    | Health improves

mixin percOfRes(place)
    synz {mode:'sequence'}
        syn
            | the percentage of #[+value(place.name)] residents
        syn
            | the percentage of people living in #[+value(place.name)] 

// In the 10 years leading up to the last census, the percentage of Manchester residents describing their health as good increased from just over 66% to about 80%.
mixin sent1Perc(i)
    if (i==1)
        | Census 2021 data also shows a shift in the local population's well-being.
    else
        | #[+tenYears], 
    | #[+percOfRes(place)]
    | #[+value(topic[s[i][0]+"_"+s[i][3]].clausal_modifier)] 
    if (cha(i)<0)
        | decreased
    else
        | increased 
    | from 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
    | to 
    | #[+value(figs(cur(i))[0])]
    | #[+value((figs(cur(i))[1])/100, {'FORMAT': '0[.]0%'})]
    | .

// About one in eight (13%) described their health as fair, compared with just over 23% in 2011. The percentage reporting bad health decreased from just under 13% to just over 7%.
mixin sent2Perc(i)
    | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[0])]
    | #[+value(get_word((data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])/100, 'frac')[1])]
    | (#[+value((figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][0]])[1])/100, {'FORMAT': '0[.]0%'})])  
    | #[+value(topic[s[i][0]+"_"+chains[s[i][3]][0]].verb_past)]
    | in 2021, 
    | compared with 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][0]])[1])/100, {'FORMAT': '0[.]0%'})]
    | in 2011. 
    | The percentage 
    | #[+value(topic[s[i][0]+"_"+chains[s[i][3]][1]].clausal_modifier)] 
    if (data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]]>data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]])
        | decreased 
    else
        | increased
    | from 
    | #[+value(figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2001][chains[s[i][3]][1]])[1])/100, {'FORMAT': '0[.]0%'})]
    | to 
    | #[+value(figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]])[0])]
    | #[+value((figs(data[s[i][0]][s[i][1]][2011][chains[s[i][3]][1]])[1])/100, {'FORMAT': '0[.]0%'})]
    | .

mixin inRegion
    synz {mode:'sequence'}
        syn 
            | in any other local authority district across
        syn
            | anywhere else in

// The percentage of healthy residents is increasing faster here than in any other local authority district across England.
mixin sent3Perc(i)
    | The percentage of 
    | #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)] 
    | is 
    if (Math.abs(cha(i, "rl"))==1)
        if (cha(i, "rl")<0)
            | decreasing
        else
            | increasing 
        | faster here than #[+inRegion]
        if (cha(i, "r")==1) 
            | #[+value(country)]
            | .
            if (Math.abs(cur(i, "r"))<11)
                | #[+nowHasCou(i)]
            else
                | #[+considImprov(i)]
        else
            | #[+value(parent)]
            if ((Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['change'][otherEst(i, cha(i, "rl"), 'change')])==1)&(!hasSaid('OtherChange')))
                | , while the percentage of 
                | #[+value(topic[s[i][0]+"_"+otherEst(i, cha(i, "rl"), 'change')].adj_noun)] is
                if (data[s[i][0]][s[i][1]+'_rank_local']['change'][otherEst(i, cha(i, "rl"), 'change')]<0)
                    | falling
                else 
                    | growing 
                | faster than anywhere in the region.
                p #[+nowHasReg(i)] 
                recordSaid('OtherChange')
            else
                | .
                if (Math.abs(cur(i, "rl"))<6)
                    | As a result, #[+nowHasReg(i)]
                    p #[+nextHighest]
                else
                    | #[+considImprov(i)]

mixin nextHighest
    | The North West’s next highest proportion of private renters can be found in Blackpool (26.1%), while 18.8% in nearby Salford rent privately.

// As a result, this area now has the country's highest proportion of private renters and the lowest proportion of homeowners.
mixin nowHasCou(i)
    | As a result, this area now has the country's 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank']['2011'][s[i][3]])!=1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank']['2011'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    if (data[s[i][0]][s[i][1]+'_rank']['2011'][s[i][3]]<0)
        | lowest
    else
        | highest 
    | proportion of 
    | #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)]
    | and the lowest proportion of homeowners
    | .

// As a result, this area now has the region’s highest proportion of private renters and the lowest proportion of homeowners.
mixin nowHasReg(i)
    | this area now has the region’s 
    if (Math.abs(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]])!=1)
        | #[+value(data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]], {'ORDINAL_TEXTUAL':true})]
    if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][s[i][3]]<0)
        | lowest proportion of #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(i, 'highest', '2011')]==1)
            | and the 
            | highest proportion of 
            | #[+value(topic[s[i][0]+"_"+otherEst(i, 'highest', '2011')].adj_noun)]
    else
        | highest proportion of #[+value(topic[s[i][0]+"_"+s[i][3]].adj_noun)]
        if (data[s[i][0]][s[i][1]+'_rank_local']['2011'][otherEst(i, 'lowest', '2011')]==-1)
            | and the 
            | lowest proportion of
            | #[+value(topic[s[i][0]+"_"+otherEst(i, 'lowest', '2011')].adj_noun)]
    | .

// The considerable improvement has brought health in Manchester close to the national average (about 81% in England described their health as good in 2021).
mixin considImprov(i)
    if (data[s[i][0]][s[i][1]+'_rank_local']['change'][s[i][3]]==1)
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]<(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]-2))
            | But despite the considerable improvement, 
            | #[+value(place.name)] 
            | remains 
            | less healthy than 
        else if (data[s[i][0]][s[i][1]][2011][s[i][3]]>(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]+2))
            | As a result, #[+value(place.name)] 
            | has become more healthy than
        else
            | The considerable improvement has brought health in 
            | #[+value(place.name)] close to 
        | the national average
        | (#[+value(figs(eng.data[s[i][0]][s[i][1]][2011][s[i][3]])[0])]
        | #[+value((figs(eng.data[s[i][0]][s[i][1]][2011][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
        | in #[+value(country)] described their health as good in 2021).
    else
        if (data[s[i][0]][s[i][1]][2011][s[i][3]]<(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]-2))
            | But despite the considerable improvement, 
            | #[+value(place.name)] 
            | remains 
            | less healthy than 
        else if (data[s[i][0]][s[i][1]][2011][s[i][3]]>(eng.data[s[i][0]][s[i][1]][2011][s[i][3]]+2))
            | As a result, #[+value(place.name)] 
            | has become more healthy than   
        else
            | The considerable improvement has brought health in 
            | #[+value(place.name)] close to 
        | the regional average
        | (#[+value(figs(rgn.data[s[i][0]][s[i][1]][2011][s[i][3]])[0])]
        | #[+value((figs(rgn.data[s[i][0]][s[i][1]][2011][s[i][3]])[1])/100, {'FORMAT': '0[.]0%'})]
        | in #[+value(parent)] described their health as good in 2021).

mixin healthExplain
    | These data are people’s own opinions in describing their overall health. They may be inconsistent with other measures of health, such as NHS records.

mixin para(i)
    if (s[i][1] == 'value')
        h2 #[+subheadVal(i)]
        if (i==1)
            p #[+startPara2] 
        p #[+sent1Val(i)]
        p #[+sent2Val(i)]
        if (s[i][0]=='population')
            p #[+density]
        p #[+sent4Val(i)]

    if (s[i][1] == 'perc')
        if (s[i][0] == 'ethnicity')
            h2 #[+subheadIncreasing(i)]
        else if (s[i][0] == 'tenure')
            h2 #[+subheadMore(i)]
        else
            h2 #[+subheadPerc(i)]
        p #[+sent1Perc(i)]
        p #[+sent2Perc(i)]
        p #[+sent3Perc(i)]
        if (s[i][0]=='health')
            p #[+healthExplain]


// p
//     | #[+standfirst1]
// p
//     | #[+standfirst2]
p Standfirst placeholder
| #[+para(0)]
| #[+para(1)]
| #[+para(2)]
| #[+para(3)]
`;

    var population_all = {
    	id: 2,
    	theme: "average age",
    	subject: "population",
    	topic: "population",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "populated",
    	synonym: "headcount",
    	verb: {
    		positive: "grow",
    		negative: "shrink"
    	},
    	noun: {
    		positive: "grow",
    		negative: "shrink"
    	},
    	alternative: "density",
    	clausal_modifier: "resident population"
    };
    var density_all = {
    	id: 2,
    	theme: "average age",
    	topic: "population density",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "density",
    	synonym: "population density",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "population",
    	clausal_modifier: "people per hectare"
    };
    var agemed_all = {
    	id: 2,
    	theme: "average age",
    	subject: "average age",
    	topic: "age",
    	topicMed: "average age",
    	topicMed2: "average age",
    	adjective: "old",
    	synonym: "average age",
    	verb: {
    		positive: "shift",
    		negative: "shift"
    	},
    	noun: {
    		positive: "shift",
    		negative: "shift"
    	},
    	alternative: "age10yr",
    	clausal_modifier: "average age"
    };
    var health_good = {
    	id: 1,
    	theme: "well-being",
    	subject: "health",
    	topic: "health",
    	topicMed: "in good health",
    	topicMed2: "in good health",
    	adjective: "healthy",
    	synonym: "healthy residents",
    	verb: {
    		positive: "improve",
    		negative: "deteriorate"
    	},
    	noun: {
    		positive: "improvement",
    		negative: "deteriorate"
    	},
    	alternative: "health_bad",
    	desc: "described",
    	clausal_modifier: "that describe their health as good",
    	verb_past: "said their health was good",
    	adj_noun: "healthy residents"
    };
    var health_fair = {
    	id: 1,
    	subject: "health",
    	theme: "well-being",
    	topic: "health",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "healthy",
    	synonym: "healthy",
    	verb: {
    		positive: "deteriorate",
    		negative: "improve"
    	},
    	noun: {
    		positive: "deteriorate",
    		negative: "improve"
    	},
    	alternative: "health_good",
    	desc: "described",
    	clausal_modifier: "that describe their health as fair",
    	verb_past: "said their health was fair",
    	adj_noun: "fairly healthy residents"
    };
    var health_bad = {
    	id: 1,
    	theme: "well-being",
    	topic: "health",
    	topicMed: "in poor health",
    	topicMed2: "in poor health",
    	adjective: "healthy",
    	synonym: "healthy",
    	verb: {
    		positive: "deteriorate",
    		negative: "improve"
    	},
    	noun: {
    		positive: "shift",
    		negative: "shift"
    	},
    	alternative: "health_good",
    	desc: "described",
    	clausal_modifier: "that describe their health as bad",
    	verb_past: "said their health was bad",
    	adj_noun: "unhealthy residents"
    };
    var travel_car_van = {
    	id: 1,
    	theme: "commute",
    	topic: "car commuting",
    	topicMed: "commuting by car",
    	topicMed2: "commute by car",
    	adjective: "car-reliant",
    	synonym: "driving",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "travel_foot",
    	desc: "said",
    	clausal_modifier: "travelling to work by car or van"
    };
    var travel_foot = {
    	id: 1,
    	theme: "commuting method",
    	topic: "walk to work",
    	topicMed: "commuting by foot",
    	topicMed2: "walk to work",
    	adjective: "pedestrian",
    	synonym: "walkers",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "travel_car_van",
    	desc: "said",
    	clausal_modifier: "travelling to work by foot"
    };
    var travel_home = {
    	id: 1,
    	theme: "commuting method",
    	topic: "work from home",
    	topicMed: "working from home",
    	topicMed2: "work from home",
    	adjective: "homeworking",
    	synonym: "homeworkers",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "travel_car_van",
    	desc: "said",
    	clausal_modifier: "primarily working from home"
    };
    var travel_train_metro = {
    	id: 1,
    	theme: "commuting method",
    	topic: "train commuting",
    	topicMed: "commuting by train",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "train-travelling",
    	synonym: "passengers",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "travel_car_van",
    	desc: "said",
    	clausal_modifier: "travelling to work by train or metro"
    };
    var travel_bicycle = {
    	id: 1,
    	theme: "commuting method",
    	topic: "bike commuting",
    	topicMed: "commuting by bicycle",
    	topicMed2: "commuting by bicycle",
    	adjective: "cyclist",
    	synonym: "cyclists",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "travel_car_van",
    	desc: "said",
    	clausal_modifier: "travelling to work by bicycle"
    };
    var age10yr_70plus = {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    };
    var ethnicity_asian = {
    	id: 1,
    	subject: "ethnic makeup",
    	theme: "average age",
    	topic: "proportion of Asian residents",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "proportion of Asian residents",
    	synonym: "proportion of Asian residents",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "ethnicity_white",
    	desc: "said",
    	clausal_modifier: "from one of the Asian ethnic groups",
    	verb_past: "said they were from an Asian ethnic group",
    	adj_noun: "residents from an Asian ethnic group"
    };
    var ethnicity_black = {
    	id: 1,
    	subject: "ethnic makeup",
    	theme: "average age",
    	topic: "proportion of Black residents",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "proportion of Black residents",
    	synonym: "proportion of Black residents",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "ethnicity_white",
    	desc: "said",
    	clausal_modifier: "from one of the Black ethnic groups",
    	verb_past: "said they were from a Black ethnic group",
    	adj_noun: "residents from a Black ethnic group"
    };
    var ethnicity_white = {
    	id: 1,
    	subject: "ethnic makeup",
    	theme: "average age",
    	topic: "proportion of White residents",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "proportion of White residents",
    	synonym: "proportion of White residents",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "ethnicity_black",
    	desc: "said",
    	clausal_modifier: "from one of the White ethnic groups",
    	verb_past: "said they were from a White ethnic group",
    	adj_noun: "residents from a White ethnic group"
    };
    var ethnicity_mixed = {
    	id: 1,
    	subject: "ethnic makeup",
    	theme: "average age",
    	topic: "proportion of Mixed residents",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "proportion of Mixed residents",
    	synonym: "proportion of Mixed residents",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "ethnicity_white",
    	desc: "said",
    	clausal_modifier: "proportion of Mixed residents"
    };
    var economic_employee = {
    	id: 1,
    	theme: "average age",
    	topic: "rate of employment",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "employed",
    	synonym: "employment",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "economic_unemployed",
    	desc: "said",
    	clausal_modifier: "proportion of employed residents"
    };
    var economic_inactive = {
    	id: 1,
    	theme: "average age",
    	topic: "economic inactivity",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "economically inactive",
    	synonym: "rate of economic inactivity",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "economic_employee",
    	desc: "said",
    	clausal_modifier: "proportion of economically inactive residents"
    };
    var economic_unemployed = {
    	id: 1,
    	theme: "average age",
    	topic: "rate of unemployment",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "unemployed",
    	synonym: "unemployment",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "economic_employee",
    	desc: "said",
    	clausal_modifier: "proportion of unemployed residents"
    };
    var economic_student = {
    	id: 1,
    	theme: "average age",
    	topic: "students",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "student",
    	synonym: "proportion of students",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "economic_employee",
    	desc: "said",
    	clausal_modifier: "proportion of residents who are students"
    };
    var tenure_rented_private = {
    	clausal_modifier: "that rent privately",
    	verb_past: "said they rent privately",
    	adj_noun: "private renters"
    };
    var tenure_rented_social = {
    	clausal_modifier: "that live in social housing",
    	verb_past: "said they live in social housing",
    	adj_noun: "people living in social housing"
    };
    var tenure_owned = {
    	clausal_modifier: "that own their home",
    	verb_past: "said they own their home",
    	adj_noun: "homeowners"
    };
    var tenure_rented_owned = {
    };
    var topic = {
    	population_all: population_all,
    	density_all: density_all,
    	agemed_all: agemed_all,
    	health_good: health_good,
    	health_fair: health_fair,
    	health_bad: health_bad,
    	travel_car_van: travel_car_van,
    	travel_foot: travel_foot,
    	travel_home: travel_home,
    	travel_train_metro: travel_train_metro,
    	travel_bicycle: travel_bicycle,
    	"age10yr_0-9": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	"age10yr_10-19": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	"age10yr_20-29": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	"age10yr_30-39": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	"age10yr_40-49": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	"age10yr_50-59": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	"age10yr_60-69": {
    	id: 1,
    	theme: "average age",
    	topic: "age",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "age",
    	synonym: "10 year",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "agemed",
    	desc: "said",
    	clausal_modifier: "age profile"
    },
    	age10yr_70plus: age10yr_70plus,
    	ethnicity_asian: ethnicity_asian,
    	ethnicity_black: ethnicity_black,
    	ethnicity_white: ethnicity_white,
    	ethnicity_mixed: ethnicity_mixed,
    	"economic_self-employed": {
    	id: 1,
    	theme: "average age",
    	topic: "self-employment",
    	topicMed: "XXXXXXXXXXX",
    	topicMed2: "XXXXXXXXXXX",
    	adjective: "self-employed",
    	synonym: "rate of self-employment",
    	verb: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	noun: {
    		positive: "increase",
    		negative: "decrease"
    	},
    	alternative: "economic_employee",
    	desc: "said",
    	clausal_modifier: "proportion of self-employed residents"
    },
    	economic_employee: economic_employee,
    	economic_inactive: economic_inactive,
    	economic_unemployed: economic_unemployed,
    	economic_student: economic_student,
    	tenure_rented_private: tenure_rented_private,
    	tenure_rented_social: tenure_rented_social,
    	tenure_owned: tenure_owned,
    	tenure_rented_owned: tenure_rented_owned
    };

    /* src/App.svelte generated by Svelte v3.43.1 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    // (225:0) {#if place}
    function create_if_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*load*/ ctx[3] && create_if_block_1(ctx);

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
    			if (/*load*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(225:0) {#if place}",
    		ctx
    	});

    	return block;
    }

    // (226:1) {#if load}
    function create_if_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*eng*/ ctx[1] && create_if_block_2(ctx);

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
    			if (/*eng*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(226:1) {#if load}",
    		ctx
    	});

    	return block;
    }

    // (227:2) {#if eng}
    function create_if_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = /*rgn*/ ctx[2] && create_if_block_3(ctx);

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
    			if (/*rgn*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(227:2) {#if eng}",
    		ctx
    	});

    	return block;
    }

    // (228:3) {#if rgn}
    function create_if_block_3(ctx) {
    	let main;
    	let h1;
    	let t0_value = /*place*/ ctx[0].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let html_tag;
    	let raw_value = /*results*/ ctx[5](/*place*/ ctx[0]) + "";

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = text(": What's changed");
    			t2 = space();
    			html_tag = new HtmlTag();
    			attr_dev(h1, "class", "svelte-4puh3d");
    			add_location(h1, file, 229, 5, 6390);
    			html_tag.a = null;
    			attr_dev(main, "class", "svelte-4puh3d");
    			add_location(main, file, 228, 4, 6378);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(main, t2);
    			html_tag.m(raw_value, main);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*place*/ 1 && t0_value !== (t0_value = /*place*/ ctx[0].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*place*/ 1 && raw_value !== (raw_value = /*results*/ ctx[5](/*place*/ ctx[0]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(228:3) {#if rgn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let script;
    	let script_src_value;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*place*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			script = element("script");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (!src_url_equal(script.src, script_src_value = "https://unpkg.com/rosaenlg@3.0.1/dist/rollup/rosaenlg_tiny_en_US_3.0.1_comp.js")) attr_dev(script, "src", script_src_value);
    			add_location(script, file, 221, 1, 6177);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, script);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(script, "load", /*onRosaeNlgLoad*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*place*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
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
    			detach_dev(script);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    		text = "over ";
    	} else if (x - sigfig > x / 200) {
    		text = "just over ";
    	} else {
    		text = "about ";
    	}

    	return [text, sigfig];
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let defaultLoc = 'Manchester';

    	const types = {
    		ew: { name: '', pl: '' },
    		wd: { name: 'Ward', pl: 'Wards' },
    		lad: { name: 'District', pl: 'Districts' },
    		rgn: { name: 'Region', pl: 'Regions' },
    		ctry: { name: 'Country', pl: 'Countries' }
    	};

    	var options, selected, place, quartiles, eng, rgncode, rgn;
    	let load = false;

    	const onRosaeNlgLoad = () => {
    		$$invalidate(3, load = true);
    	};

    	// Data load functions
    	getData("https://raw.githubusercontent.com/theojolliffe/census-data/main/csv/lists/places_2020.csv").then(res => {
    		res.forEach(d => {
    			d.typepl = types[d.type].pl;
    			d.typenm = types[d.type].name;
    		});

    		options = res.sort((a, b) => a.name.localeCompare(b.name));
    		selected = options.find(d => d.name == defaultLoc);
    		loadArea(selected.code);
    	});

    	function loadArea(code) {
    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + code + ".json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    			quartiles = null;
    			$$invalidate(0, place = json);
    			rgncode = place.parents[0].code;
    			console.log("Place", place);

    			fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/" + rgncode + ".json").then(res => res.json()).then(json => {
    				json.children = options.filter(d => d.parent == code);
    				json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    				quartiles = null;
    				$$invalidate(2, rgn = json);
    			});
    		});

    		fetch("https://raw.githubusercontent.com/theojolliffe/census-data/main/json/place/E92000001.json").then(res => res.json()).then(json => {
    			json.children = options.filter(d => d.parent == code);
    			json.siblings = options.filter(d => d.parent == json['parents'][0]['code']);
    			quartiles = null;
    			$$invalidate(1, eng = json);
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
    		'white': ['black', 'asian'],
    		'rented_private': ['rented_social', 'owned']
    	};

    	function results(place) {
    		var s = place.stories.map(d => d.label.split("_"));

    		s.forEach(e => {
    			if (e.length > 4) {
    				e[3] = e[3] + "_" + e[4];
    				e.pop();
    			}
    		});

    		console.log('s', s);

    		function otherEst(i, hiLo, type) {
    			if (typeof hiLo === "number" & hiLo < 0) {
    				hiLo = "highest";
    			} else if (typeof hiLo === "number") {
    				hiLo = "lowest";
    			}

    			console.log("I", i);
    			console.log('typaaae', type);
    			console.log('typeee', place.data[s[i][0]][s[i][1] + '_rank_local']);
    			console.log("type", place.data[s[i][0]][s[i][1] + '_rank_local'][type]);
    			let optAr = Object.assign({}, place.data[s[i][0]][s[i][1] + '_rank_local'][type]);
    			console.log('optarrrr', optAr);
    			let l = new Set(chains[s[i][3]]);

    			for (let prop of Object.keys(optAr)) {
    				if (!l.has(prop)) {
    					delete optAr[prop];
    				}
    			}

    			let optArKey;

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

    			console.log("optArKey", optArKey);
    			return optArKey;
    		}

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

    		let locRank = s.map(d => parseInt(place.data[d[0]][d[1] + "_rank_local"][d[2]][d[3]]));

    		return rosaenlg_en_US.render(string, {
    			language: 'en_UK',
    			place,
    			data: place.data,
    			eng,
    			rgn,
    			parent: uncap1(regionThe(place.parents[0].name)),
    			s,
    			priorities: place.Priorities,
    			grewSyn,
    			locRank,
    			topic,
    			chains,
    			country: "England",
    			get_word,
    			figs,
    			otherEst,
    			cur,
    			cha
    		});
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getData,
    		uncap1,
    		regionThe,
    		string,
    		topic,
    		defaultLoc,
    		types,
    		options,
    		selected,
    		place,
    		quartiles,
    		eng,
    		rgncode,
    		rgn,
    		load,
    		onRosaeNlgLoad,
    		loadArea,
    		grewSyn,
    		num_word,
    		frac_word,
    		get_word,
    		figs,
    		chains,
    		results
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultLoc' in $$props) defaultLoc = $$props.defaultLoc;
    		if ('options' in $$props) options = $$props.options;
    		if ('selected' in $$props) selected = $$props.selected;
    		if ('place' in $$props) $$invalidate(0, place = $$props.place);
    		if ('quartiles' in $$props) quartiles = $$props.quartiles;
    		if ('eng' in $$props) $$invalidate(1, eng = $$props.eng);
    		if ('rgncode' in $$props) rgncode = $$props.rgncode;
    		if ('rgn' in $$props) $$invalidate(2, rgn = $$props.rgn);
    		if ('load' in $$props) $$invalidate(3, load = $$props.load);
    		if ('grewSyn' in $$props) grewSyn = $$props.grewSyn;
    		if ('num_word' in $$props) num_word = $$props.num_word;
    		if ('frac_word' in $$props) frac_word = $$props.frac_word;
    		if ('chains' in $$props) chains = $$props.chains;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [place, eng, rgn, load, onRosaeNlgLoad, results];
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
