// This plugin allows the user to drag a box across the Raphael paper
// The event then passes the nodes within the box back to a callback function
// The nodes are returned in a Raphael set once the mouse is let go
(function($) {

    // Creates an SVG type path
    // (0, 0) -> (10, 10)
    // M0,0L10,0L10,10L0,10Z
    function getRectPath(x1, y1, x2, y2) {
        return "M"+x1+","+y1+"L"+x2+","+y1+"L"+x2+","+y2+"L"+x1+","+y2+"Z";
    }

    // Gets each node within the bounding box
    // The nodes are within the box ONLY if their center is
    function getSetWithinBounds(paper, x1, y1, x2, y2) {
        // Get the min and max, so we can create a box
        var min_x = (x1 < x2) ? x1 : x2,
            max_x = (x1 > x2) ? x1 : x2,
            min_y = (y1 < y2) ? y1 : y2,
            max_y = (y1 > y2) ? y1 : y2;

        // Bot == bottom node
        var bot = paper.bottom,
            set = paper.set();

        // Go through each node on the paper
        while(bot) {
          // (x, y) are the center of the nodes
          var x = bot.attr("x") + (bot.attr("width") / 2),
            y = bot.attr("y") + (bot.attr("height") / 2);

          // If the node has been transformed
          // This allows us to get the currect (x, y) positions
          if (bot.matrix) {
            x += bot.matrix.e;
            y += bot.matrix.f;
          }

          // If the node is within the box, push into the set
          if((x >= min_x) && (x <= max_x) && (y >= min_y) && (y <= max_y)) {
            set.push(bot);
          }

          // Get the next node
          bot = bot.next;
        }

        // Return the set
        return set;
    }

    // The function that sets up all the events needed
    $.fn.dragSelect = function(func, opts) {
        var self = this;
		// Set up the options
		opts = opts || {};
		opts['stroke-dasharray'] = opts['stroke-dasharray'] || '.';
		opts.stroke = opts.stroke || '#000';

        // opts must be an object - {}
        if (typeof opts !== 'object') {
			throw Error("dragSelect options must be in an Object");
        }

        // Only attach dragSelect once
        if(this.dragCanvas) return;
        this.dragCanvas = this.canvas;
        this.dragCanvas.dragging = false;
        this.dragOptions = {
            dragFinish: func || function() {}
        };

        // Attach the drag event onmousedown
        this.dragCanvas.onmousedown = function(e) {
            // The plugin doesn't pick up ommouseup events outside the canvas
            // This allows us to come back into the canvas and finish the job
            if (this.dragging) return;
            this.dragging = true;
            this.start_x = e.layerX;
            this.start_y = e.layerY;
            this.path && this.path.remove();
            this.path = self.path("M0,0").attr({
                'stroke-dasharray': opts['stroke-dasharray'],
                'stroke': opts.stroke
            });
        };

        // Create a box starting at (start_x, start_y)
        // These are created during the onmousedown event
        // The (x, y) that are passed are received from onmousemove
        this.dragCanvas.updatePath = function(x, y) {
            var path = getRectPath(this.start_x, this.start_y, x, y);
            this.path.attr({path: path});
        };

        // Get the current (x, y) and update the onscreen box
        this.dragCanvas.onmousemove = function(e) {
            // Don't do work if we're not dragging
            // TODO: Maybe create this event onmousedown
            // TODO: Maybe remove this event onmouseup
            // This would stop this function running for no reason
            if(!this.dragging) return;
            var x = e.layerX,
                y = e.layerY;
            this.updatePath(x, y);
        };

        // Get the nodes inside the box
        // Return them in a set to the callback function
        this.dragCanvas.onmouseup = function(e) {
            // The plugin doesn't pick up ommouseup events outside the canvas
            // This allows us to come back into the canvas and finish the job
            this.dragging = false;
            this.end_x = e.layerX;
            this.end_y = e.layerY;
            this.path.remove();
            self.dragOptions.dragFinish(getSetWithinBounds(self, this.start_x, this.start_y, this.end_x, this.end_y));
        };
    };

    // De-Initialise the plugin
    // This may be useful if there is a button
    // that can toggle the behavior
    $.fn.undragSelect = function() {
        var self = this;
        if (!this.dragCanvas) return;
	this.dragCanvas.onmousedown = null;
        this.dragCanvas.onmouseup = null;
        this.dragCanvas = null;
    };

})(Raphael);
