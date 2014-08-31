#lighterbox

> A lighterweight lightbox gallery module. A simple plugin supporting modern browsers only to minimize configuration and hacky code. Customizable.

## Installation

Download **lighterbox** and reference it after jQuery.

```javascript
<script src="/js/libs/jquery/jquery.lighterbox.js"></script>
```

Or load via synchronous or asynchronous module definition.

## Usage

### HTML
```html
<a href="https://s3.amazonaws.com/hensonism-art/paul-gauguin/gaugin3.jpg" class="lighterbox">
	<img src="https://s3.amazonaws.com/hensonism-art/paul-gauguin/thumbs/gaugin3.jpg" />
	<h2 class="lighterbox-title">Painting by Paul Gaugin</h2>
	<p class="lighterbox-desc">Oil on Canvas</div>
</a>
```
### JavaScript
```javascript
$(".lighterbox").lighterbox({ overlayColor : "white" });
});
```

## Options
- overlayColor : {string} Any valid css value.
- overlayOpacity : {string or integer} Any valid css value.
- animateSpeed : {string or integer} Any valid css value.