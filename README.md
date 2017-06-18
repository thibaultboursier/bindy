# bindy
Databinding is simply with Bindy.

## How to use it

Create an object :
```
let target = {
  name: 'Peter'
};
```

Bind target's properties to your HTML :
```
<div id="container">
  <span bind="name"></span>
</div>
```

Work with Bindy :
```
const container = document.querySelector('#container');

Bindy.bind(target, container);
```

Update target's properties and DOM will be updated.
