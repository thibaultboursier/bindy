# bindy
Databinding is simply with Bindy.

[![Build Status](https://api.travis-ci.org/thibaultboursier/bindy.svg?branch=master)](https://travis-ci.org/thibaultboursier/bindy)

## How to use it

First, create an object :
```
let target = {
  user: {
    name: 'Peter',
    city: 'Dublin'
  }
};
```

### Property binding

Bind target's properties to your HTML :
```
<div id="container">
  <span bd-bind="user.name"></span>
</div>
```
You can also use string interpolation :
```
<div id="container">
  {{ user.name }}
</div>
```

### Event binding

For event binding, you must add **bd-model** attribute.
When input's value is modified, target object is updated.
```
<div id="container">
  <input type="text" bd-model="user.city">
</div>
```

### Create a new view

```
const container = document.querySelector('#container');

const view = Bindy.bind(target, container);
```

Update target's properties and DOM will be updated.
