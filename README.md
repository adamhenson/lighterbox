#lighterbox

A lighterweight lightbox gallery module. A simple plugin supporting modern mobile and desktop browsers to minimize configuration and hacky code. Customizable.

> NOTE (from Adam): I no longer contribute to this plugin, but I'm happy to review and manage PRs.

## Usage

Download **lighterbox** and reference it after jQuery.

```javascript
<script src="path/to/your/jquery.lighterbox.js"></script>
```

Or load via synchronous or asynchronous module definition.

> All basic styling is set in the JS, however it would be easy to override using the class selectors.

### HTML
```html
<a href="https://s3.amazonaws.com/hensonism-art/paul-gauguin/gaugin3.jpg" class="lighterbox">
	<img src="https://s3.amazonaws.com/hensonism-art/paul-gauguin/thumbs/gaugin3.jpg" />
	<h2 class="lighterbox-title">Painting by Paul Gaugin</h2>
	<span class="lighterbox-desc">Oil on Canvas</span>
</a>
```
### JavaScript
```javascript
$(".lighterbox").lighterbox({ overlayColor : "white" });
```

## Options
- `overlayColor` : {`string`} "white" or "black" options set the theme. Default is white.
- `overlayOpacity` : {`string` or `integer`} Any valid css value.
- `animateSpeed` : {`string` or `integer`} Any valid css value.