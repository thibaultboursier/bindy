const {
    JSDOM
} = require('jsdom');

export const template = `
        <div id="container">
            <p bd-text="user.password" id="userPassword"></p>
            <input type="text" bd-model="user.city" id="userCity">
            <p id="userName">{{ user.name }}</p>
        </div>
    `;
export const window = new JSDOM(template).window;
export const DOM = window.document.querySelector('#container');
export const target = {
    user: {
        name: 'john',
        password: '6GD72GH',
        city: 'dublin'
    }
};
export const propertyBinding = {
    DOM,
    keypath: 'user.password',
    node: DOM.querySelector('#userPassword'),
    target,
    type: 'property'
};
export const eventBinding = {
    DOM,
    keypath: 'user.city',
    node: DOM.querySelector('#userCity'),
    target,
    type: 'event'
};