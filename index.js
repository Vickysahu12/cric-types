'use strict';

class CricError extends Error {
  constructor(message, path) {
    super(message);
    this.name = 'CricError';
    this.path = path;
  }
}

function joinPath(path, key) {
  if (path === 'value') return `${path}.${key}`;
  return `${path}[${key}]`;
}

function makePrimitive(jsType, label) {
  function validator(value, path = 'value') {
    if (typeof value !== jsType) {
      throw new CricError(
        `${path}: '${label}' (${jsType}) chahiye tha, par mila '${typeof value}'.`,
        path
      );
    }
    return value;
  }

  return wrap(validator);
}

function wrap(validateFn) {
  const self = {
    _validate: validateFn,

    parse(value) {
      return validateFn(value, 'value');
    },

    safeParse(value) {
      try {
        const result = validateFn(value, 'value');
        return { ok: true, value: result };
      } catch (err) {
        if (err instanceof CricError) {
          return { ok: false, error: err.message };
        }
        throw err;
      }
    },

    optional() {
      return wrap((value, path) => {
        if (value === undefined) return undefined;
        return validateFn(value, path);
      });
    },
  };

  return self;
}

// Primitives
const Sachin = makePrimitive('number', 'Sachin');   // runs -> number
const Virat = makePrimitive('string', 'Virat');     // name -> string
const Dhoni = makePrimitive('boolean', 'Dhoni');    // calm finisher -> boolean

// Object shape validator: Squad({ naam: Virat, runs: Sachin })
function Squad(shape) {
  function validate(value, path = 'value') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new CricError(`${path}: 'Squad' (object) chahiye tha, par mila '${typeof value}'.`, path);
    }
    const out = {};
    for (const key of Object.keys(shape)) {
      const fieldValidator = shape[key];
      const fieldPath = joinPath(path, key);
      out[key] = fieldValidator._validate(value[key], fieldPath);
    }
    return out;
  }

  return wrap(validate);
}

// Array validator: Team(Virat) -> array of strings
function Team(inner) {
  function validate(value, path = 'value') {
    if (!Array.isArray(value)) {
      throw new CricError(`${path}: 'Team' (array) chahiye tha, par mila '${typeof value}'.`, path);
    }
    return value.map((item, i) => inner._validate(item, `${path}[${i}]`));
  }

  return wrap(validate);
}

module.exports = { Sachin, Virat, Dhoni, Squad, Team, CricError };