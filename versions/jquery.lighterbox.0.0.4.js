/*!
 *
 * @author Adam Henson
 * Licensed under the MIT license
 * https://github.com/adamhenson/lighterbox
 *
 */
;(function ( $, window, document, undefined ) {

  // Scope variables
  var pluginName = "lighterbox";
  var $el;
  var defaults = {
    "overlayColor" : "white",
    "overlayOpacity" : "0.95",
    "animateSpeed" : 200,
    "baseCss": {
      "width" : "auto",
      "height" : "auto",
      "max-width" : "100%",
      "max-height" : "100%",
      "position" : "fixed",
      "top" : "50%",
      "right" : "50%",
      "z-index" : "9998",
      "opacity" : "0"
    },
    "loaderCss" : {
      "width" : "30px",
      "height" : "30px",
      "display" : "block",
      "position" : "fixed",
      "left" : "50%",
      "bottom" : "50%",
      "margin-left" : "-15px",
      "z-index": "9997",
      "background": "url('https://s3-us-west-2.amazonaws.com/nycg/loader-60x60.gif') no-repeat",
      "background-size": "30px"
    },
    "closeCss" : {
      "-webkit-tap-highlight-color" : "rgba(0,0,0,0)",
      "cursor" : "pointer",
      "font-size" : "2em",
      "color" : "#000",
      "background" : "#fff",
      "padding" : "0 0.3em",
      "position" : "fixed",
      "top" : "0",
      "right" : "0",
      "z-index" : "9999",
      "opacity" : "0"
    },
    "captionCss" : {
      "width" : "100%",
      "text-align": "center",
      "background" : "#000",
      "color" : "#fff",
      "position" : "fixed",
      "bottom" : "0",
      "left" : "0",
      "z-index" : "9999",
      "opacity" : "0"
    },
    "touch" : {
      "supportTouch" : true,
      "touchStarted" : false,
      "currX" : 0,
      "currY" : 0,
      "cachedX" : 0,
      "cachedY" : 0
    }
  };

  // Construct
  function Plugin( element, options ) {

    $el = $(element);
    this.options = $.extend( {}, defaults, options);
    this.init();

  }

  // Get the pointer event
  Plugin.prototype.getPointerEvent = function( e ) {

    return e.originalEvent.targetTouches ? e.originalEvent.targetTouches[0] : e;

  };

  // If tap
  Plugin.prototype.tap = function( $el, e, callback ) {

    var that = this;

    // if we have a touch event and we're supporting touch then make sure
    // it's a tap... otherwise assuming click - proceed
    if(e.type === "touchend" && that.options.touch.supportTouch) {
      if((that.options.touch.cachedX === that.options.touch.currX) && !that.options.touch.touchStarted && (that.options.touch.cachedY === that.options.touch.currY)) callback.call();
    } else {
      callback.call();
    }

  };

  // Track touch events
  Plugin.prototype.trackTouchEvents = function() {

    var that = this;
    var $body = $("body");

    // track touchstart
    $body.on("touchstart", function(e){
      var pointer = that.getPointerEvent(e);
      // caching the current x
      that.options.touch.cachedX = that.options.touch.currX = pointer.pageX;
      // caching the current y
      that.options.touch.cachedY = that.options.touch.currY = pointer.pageY;
      // a touch event is detected
      that.options.touch.touchStarted = true;
    });

    // track touchend
    $body.on("touchend", function(e){
      // here we can consider finished the touch event
      that.options.touch.touchStarted = false;
    });

    // track touchmove
    $body.on("touchmove",function(e){
      var pointer = that.getPointerEvent(e);
      that.options.touch.currX = pointer.pageX;
      that.options.touch.currY = pointer.pageY;
    });

  };

  // Close / destroy current open lighterbox
  Plugin.prototype.destroy = function ( $el ) {

    var that = this;
    var destroyTime = that.options.animateSpeed + 100;
    for(var i = 0; i < $el.length; i++) $el[i].css("opacity", 0);
    setTimeout(function() {
      for(var i = 0; i < $el.length; i++) $el[i].remove();
    }, destroyTime);

  };

  // Re-position the image
  Plugin.prototype.reposition = function( $el, $caption ) {

    var init = function(){
      var captionHeight = ($caption.height() > 0) ? $caption.height() : 0;
      var marginTop = -((Math.floor(parseInt($el.height()) / 2)) + (captionHeight / 2));
      var marginRight = -(Math.floor(parseInt($el.width()) / 2));
      $el.css({
        "margin-top" : marginTop + "px",
        "margin-right" : marginRight + "px"
      });
    };

    return { init: init };

  };

  // Open lighterbox
  Plugin.prototype.open = function( $el, e ) {

    // Scope variables
    var that = this;
    var imageTitle = $el.find("." + pluginName + "-title").text();
    var imageDesc = $el.find("." + pluginName + "-desc").text();
    var rgb = (that.options.overlayColor == "white") ? "255, 255, 255" : "0, 0, 0";
    var overlay = document.createElement("div");
    var $overlay = $(overlay);
    var img = document.createElement("img");
    var $img = $(img);
    var loader = document.createElement("div");
    var $loader = $(loader);
    var caption = document.createElement("div");
    var $caption = $(caption);
    var close = document.createElement("div");
    var $close = $(close);
    var repositioner = false;

    // Define animation styles
    that.options.baseCss["-webkit-transition"] = "all " + that.options.animateSpeed + "ms ease-in-out";
    that.options.baseCss["-moz-transition"] = "all " + that.options.animateSpeed + "ms ease-in-out";
    that.options.baseCss["-o-transition"] = "all " + that.options.animateSpeed + "ms ease-in-out";
    that.options.baseCss.transition = "all " + that.options.animateSpeed + "ms ease-in-out";

    // Extend the image element properties
    $img.addClass(pluginName + "-img")
      .attr("src", $el.attr("href"))
      .css(that.options.baseCss)
      .appendTo("body");

    // Define css for overlay
    var overlayCss = {};
    for (var prop in that.options.baseCss) overlayCss[prop] = that.options.baseCss[prop];
    overlayCss.width = "100%";
    overlayCss.height = "100%";
    overlayCss.top = "0";
    overlayCss.left = "0";
    overlayCss["z-index"] = "9997";
    overlayCss.background = "rgb(" + rgb + ")";

    // Extend overlay element properties
    $overlay.addClass(pluginName + "-overlay")
      .css(overlayCss)
      .appendTo($("body"))
      .add($close)
      .on("click touchend", function(e){
        that.destroy([$overlay, $img, $close, $caption]);
        if(repositioner !== false) $(window).off("resize", repositioner.init);
      });

    // Extend the loader element properties
    $loader.addClass(pluginName + "-loader")
      .css(that.options.loaderCss)
      .appendTo($overlay);

    // Extend the close element properties
    if(that.options.overlayColor != "white") {
      that.options.closeCss.color = "#fff";
    }
    $close.addClass(pluginName + "-close")
      .html("x")
      .css(that.options.closeCss)
      .appendTo("body");

    // Extend the caption element properties
    if(that.options.overlayColor != "white") {
      that.options.captionCss.color = "#000";
      that.options.captionCss.background = "#fff";
    }

    // If the title is empty then we shouldn't show a caption
    if(imageTitle === "") {
      that.options.captionCss.display = 'none';
    }
    
    $caption.addClass(pluginName + "-caption")
      .html("<p class='" + pluginName + "-overlay-title'>" + imageTitle + "</p>" + "<p class='" + pluginName + "-overlay-desc'>" + imageDesc + "</p>")
      .css(that.options.captionCss)
      .appendTo("body");
    $caption.find("." + pluginName + "-overlay-title").css({"margin": "0.5em"});
    $caption.find("." + pluginName + "-overlay-desc").css({"margin": "0 0.5em 0.5em"});

    // Re-position image
    $img.load(function(){
      repositioner = new that.reposition($(this), $caption);
      repositioner.init();
      $(window).resize(repositioner.init);
      that.destroy([$loader]);
      setTimeout(function() {
        $img.css("opacity", 1);
      }, that.options.animateSpeed);
    });

    // Animate in lighterbox
    setTimeout(function() {
      $overlay.add($caption).css("opacity", that.options.overlayOpacity);
      $close.css("opacity", "0.3");
    }, 1);

  };

  // initialize
  Plugin.prototype.init = function () {

    var that = this;

    // track touch events
    if(that.options.touch.supportTouch) that.trackTouchEvents();

    // on click/ touch interaction with the dom element (most likely the <a> element)
    $el.on("click touchend", function(e){

      e.preventDefault();
      e.stopPropagation();

      var $this = $(this);

      that.tap($(this), e, function(){
        // open lighterbox
        that.open($this, e);
      });

    });

  };

  // Prevent against multiple instantiations
  $.fn[pluginName] = function ( options ) {

    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Plugin( this, options ));
      }
    });

  };

})( jQuery, window, document );