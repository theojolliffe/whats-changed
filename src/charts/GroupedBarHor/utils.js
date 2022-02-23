import { group } from 'd3-array';

// Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byrons test data generator.
// http://leebyron.com/streamgraph/
export function bumps(m) {
  const values = [];

  // Initialize with uniform random values in [0.1, 0.2).
  for (let i = 0; i < m; ++i) {
    values[i] = 0.1 + 0.1 * Math.random();
  }

  // Add five random bumps.
  for (let j = 0; j < 5; ++j) {
    const x = 1 / (0.1 + Math.random());
    const y = 2 * Math.random() - 0.5;
    const z = 10 / (0.1 + Math.random());
    for (let i = 0; i < m; i++) {
      const w = (i / m - y) * z;
      values[i] += x * Math.exp(-w * w);
    }
  }

  // Ensure all values are positive.
  for (let i = 0; i < m; ++i) {
    values[i] = Math.max(0, values[i]);
  }

  return values;
}

/**
 * Group and pivot from taller to wider (d3.stack structure)
 *   - adapted from: https://observablehq.com/@john-guerra/d3-stack-with-d3-group
 *   - see also: https://pbeshai.github.io/tidy/docs/api/pivot
 *   - see also: https://svelte.dev/repl/f41b33967fcd4df390ea2b4914761373?version=3.38.3
 */
export function pivot(data, groupKeys, stackKey, reducer = vals => vals.length) {
  const groupedMap = group(data, ...groupKeys.map(d => key => d[key]), d => d[stackKey]);

  const stackKeys = Array.from(new Set(data.map(d => d[stackKey])).values());

  return Array.from(groupedMap.entries()).map(g => {
    const obj = {};
		// TODO
    obj[groupKeys[0]] = g[0];
    for (let col of stackKeys) {
      const vals = g[1].get(col);
      obj[col] = !vals ? 0 : reducer(Array.from(vals.values()));
    }    
    return obj;
  });
}

export function getAccessor(key) {
	if (typeof key === 'function') {
		return key
	} else {
		return d => d[key]
	}
}

/**
 * Pivot longer (columns to rows)
 *  - see: https://observablehq.com/d/3ea8d446f5ba96fe
 *  - see also: https://observablehq.com/d/ac2a320cf2b0adc4 as generator
 */ 
export function pivotLonger(data, columns, name, value) {
  const keep = data.columns.filter(c => !columns.includes(c));
  return data.flatMap(d => {
    const base = keep.map(k => [k, d[k]]);
    return columns.map(column => {
      return Object.fromEntries([
        ...base,
        [name, column],
        [value, d[column]]
      ]);
    });
  });
}

/**
 * Pivot wider (rows to columns)
 *  - see: https://github.com/d3/d3-array/issues/142#issuecomment-761861983
 */
export function pivotWider(data, column, name, value) {
  return Array.from(
  	group(data, d => d[column]),
  	([columnVal, items]) => Object.fromEntries(
    	[[column, columnVal]].concat(
      	items.map(d => [d[name], d[value]])
    	)
  	)
	)
}

export function first(items) {
	return items[0]
}

export function last(items) {
	return items[items.length - 1]
}