'use strict';

let scope = {};
let bindings = {};
let temp = [];
let els;

init(scope, document.body);

function init(target, DOM) {
    els = Array.from(DOM.querySelectorAll('[bind]'));

    els.map(register)
        .forEach(add);

    if (temp.length !== 0) {
        watch();
    }
}

function register(el) {
    const property = el.getAttribute('bind');
    bindings[property] = el;
    return property;
}

function add(property) {
    if (!isDeclared) {
        return temp.push(property);
    }

    bind(property);
}

function addNewProperty(property) {
    const val = scope[property];

    temp.splice(temp.indexOf(property), 1);
    bind(property);
    updateDOM({ property, val });
}

function bind(property) {
    Object.defineProperty(scope, property, {
        enumerable: true,
        set: (val) => updateDOM({ property, val })
    })
}

function updateDOM({ property, val }) {
    const el = bindings[property];
    el.innerText = val;
}

function isDeclared(property) {
    return scope.hasOwnProperty(property);
}

function watch() {
    setInterval(() => {
        temp.filter(isDeclared)
            .forEach(addNewProperty);
    }, 200);
}
