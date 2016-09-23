window.onload = function() {

  var paper = new Raphael("canvas");
  var Options = {
    dragFinish: function(set) {
      console.log("Drag Finished");
    }
  };

  function getRectPath(x1, y1, x2, y2) {
    return "M"+x1+","+y1+"L"+x2+","+y1+"L"+x2+","+y2+"L"+x1+","+y2+"Z";
  }

  var Module = {
    init: function(paper) {
      var canvas = paper.canvas;
      canvas.dragging = false;

      canvas.updatePath = function(x, y) {
        var path = getRectPath(this.start_x, this.start_y, x, y);
        this.path.attr({path: path});
      };

      canvas.onmousedown = function(e) {
        this.dragging = true;
        this.start_x = e.layerX;
        this.start_y = e.layerY;
        this.path && this.path.remove();
        this.path = paper.path("M0,0").attr({'stroke-dasharray': '.'});
      };

      canvas.onmousemove = function(e) {
        if(!this.dragging) return;
        var x = e.layerX,
            y = e.layerY;
        this.updatePath(x, y);
      };

      canvas.onmouseup = function(e) {
        this.dragging = false;
        this.end_x = e.layerX;
        this.end_y = e.layerY;
        this.path.remove();
        Options.dragFinish();
      };
    },
    dragFinish: function(func) {
      Options.dragFinish = func;
    }
  };

  Module.init(paper);
  Module.dragFinish(function(set) {
    console.log("Set Received");
  });

};
