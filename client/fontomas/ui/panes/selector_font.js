/*global window, nodeca, jQuery, Handlebars, Backbone, $, _*/

"use strict";

module.exports = Backbone.View.extend({
  tagName:    "li",


  initialize: function () {
    var self = this;

    this.$el.attr("id", "font-id-" + this.model.id);

    this.model.on("change",   this.render,  this);
    this.model.on("destroy",  this.remove,  this);

    // activate selectable plugin
    this.$el.selectable({
      filter: 'li.glyph:visible',
      distance: 5,
      stop: function () {
        var $els = self.$('.glyph.ui-selected');

        // prevent from double-triggering event,
        // otherwise click event will be fired as well
        if (1 === $els.length) {
          return;
        }

        $els.each(function () {
          $(this).data('model').toggle('selected');
        });
      }
    });
  },

  render: function () {
    var $info;

    this.$el.html(nodeca.client.fontomas.render('font-item', {
      id:         this.model.id,
      fontname:   this.model.get("font").fullname,
      css_class:  "font-embedded-" + this.model.get("id")
    }));

    // render info html
    $info = $(nodeca.client.fontomas.render('selector:font-info', this.model.toJSON()));

    // assign modal window popup handler
    this.$('.font-info').click(function () {
      $info.appendTo(window.document.body).modal();
      // prevent default browser behavior - jump to the top
      return false;
    });

    // process each glyph
    this.model.eachGlyph(function (glyph) {
      var view = new nodeca.client.fontomas.ui.panes.selector_glyph({model: glyph});
      this.$(".font-glyphs").append(view.render().el);
    }, this);

    return this;
  },


  remove: function () {
    this.$el.remove();
    this.trigger("remove", this.model);
  }
});
