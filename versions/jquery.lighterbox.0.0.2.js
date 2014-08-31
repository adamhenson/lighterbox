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
      "position" : "fixed",
      "left" : "50%",
      "bottom" : "50%",
      "margin-left" : "-15px",
      "z-index": "9997",
      "background": "url('https://s3-us-west-2.amazonaws.com/nycg/loader-60x60.gif') no-repeat",
      "background-size": "30px"
    },
    "closeCss" : {
      "font-size" : "2em",
      "color" : "#000",
      "position" : "fixed",
      "top" : "0.5em",
      "right" : "0.5em",
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
    }
  };

  // Construct
  function Plugin( element, options ) {

    $el = $(element);
    this.options = $.extend( {}, defaults, options);
    this.init();

  }

  // Destroy / close dom elements
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

  // initialize
  Plugin.prototype.init = function () {

    var that = this;

    // on click/ touch interaction with the dom element (most likely the <a> element)
    $el.on("click touchend", function(e){
      e.preventDefault();

      // Scope variables
      var $this = $(this);
      var imageTitle = $this.find("." + pluginName + "-title").text();
      var imageDesc = $this.find("." + pluginName + "-desc").text();
      var rgb = (that.options.overlayColor == "white") ? "255, 255, 255" : "0, 0, 0";
      var overlay = document.createElement("div");
      var $overlay = $(overlay);
      var img = document.createElement("img");
      var $img = $(img);
      var loader = document.createElement("div");
      var $loader = $(loader);
      var caption = document.createElement("div");
      var $caption = $(caption);
      var close = document.createElement("a");
      var $close = $(close);
      var repositioner = false;

      // Define animation styles
      that.options.baseCss["-webkit-transition"] = "all " + that.options.animateSpeed + "ms ease-in-out";
      that.options.baseCss["-moz-transition"] = "all " + that.options.animateSpeed + "ms ease-in-out";
      that.options.baseCss["-o-transition"] = "all " + that.options.animateSpeed + "ms ease-in-out";
      that.options.baseCss.transition = "all " + that.options.animateSpeed + "ms ease-in-out";

      // Extend the image element properties
      $img.addClass(pluginName + "-img")
        .attr("src", $this.attr("href"))
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
          e.preventDefault();
          e.stopPropagation();
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
        .attr("href", "#")
        .html("x")
        .css(that.options.closeCss)
        .appendTo("body");

      // Extend the caption element properties
      if(that.options.overlayColor != "white") {
        that.options.captionCss.color = "#000";
        that.options.captionCss.background = "#fff";
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
        $overlay.add($close).add($caption).css("opacity", that.options.overlayOpacity);
      }, 1);

    });

  };

  // prevent against multiple instantiations
  $.fn[pluginName] = function ( options ) {

    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin( this, options ));
      }
    });

  };

})( jQuery, window, document );