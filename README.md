# angular5to6-renderer-migration

Auto migrate Angular 5 Renderer (@angular/core) to Angular 6 Renderer2 (@angular/core)

## Rules

This repository provides the following rules:

| Rule name                         | Configuration | Description                                          |
| --------------------------------- | ------------- | ---------------------------------------------------- |
| renderer-migration                | none          | Auto migrate Renderer to Renderer2                  |

## Use rules

To use the exported rules, copy rendererMigrationRule.js to the `rulesDirectory` configuration property of `tslint.json`:

```json
{
  "rulesDirectory": [
    "tslint-extend-rules"
  ],
  "rules": {
    "renderer-migration": true
  }
}
```

To lint your project use:

```
./node_modules/.bin/tslint -c tslint.json -p tsconfig.json
```

## Known issues

The following sources must be migrated manually.

### setElementClass

```
let isAdd = ...;//Maybe true/false
Renderer.setElementClass(ele, className, isAdd);
```

after migrated

```
let isAdd = ...;//Maybe true/false
Renderer2.removeClass(ele, className, value);
```

should be migrate manually as

```
let isAdd = ...;//Maybe true/false
if (isAdd) Renderer2.addClass(ele, className);
else Renderer2.removeClass(ele, className);
```

### setElementAttribute, setElementStyle

```
Renderer.setElementAttribute(ele, attribute, value);
Renderer.setElementStyle(ele, style, value);
```

after migrated

```
Renderer2.setAttribute(ele, attribute, value);
Renderer2.setStyle(ele, style, value);
```

should be migrate manually as

```
if (value != null) Renderer2.setAttribute(ele, attribute, value);
else Renderer2.removeAttribute(ele, attribute, value);
if (value != null) Renderer2.setStyle(ele, style, value);
else Renderer2.removeStyle(ele, style, value);
```

### createElement

```
let divEle = Renderer.createElement(ele, 'div');
```

should be migrate manually as

```
let divEle = Renderer2.createElement('div');
Renderer2.appendChild(ele, divEle);
```

### Notes

* Once you run all the migrations check the diff and make sure that everything looks as expected. These fixers cover almost all cases we know of, but it's possible that some manual fixes can be required.
