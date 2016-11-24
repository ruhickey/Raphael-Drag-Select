(function($) {
    
    function getRectPath(x1, y1, x2, y2) {
        return "M"+x1+","+y1+"L"+x2+","+y1+"L"+x2+","+y2+"L"+x1+","+y2+"Z";
    }
    
    function getSetWithinBounds(paper, x1, y1, x2, y2) {
        var min_x = (x1 < x2) ? x1 : x2,
            max_x = (x1 > x2) ? x1 : x2,
            min_y = (y1 < y2) ? y1 : y2,
            max_y = (y1 > y2) ? y1 : y2;
        
        var bot = paper.bottom,
            set = paper.set();
        
        while(bot) {
            var x = bot.attr("x") + bot.attr("width"),
                y = bot.attr("y") + bot.attr("height");
           
            if (bot.matrix) {
                x += bot.matrix.e;
                y += bot.matrix.f;
            }

            if((x >= min_x) && (x <= max_x) && (y >= min_y) && (y <= max_y)) {
                set.push(bot);
            }
            
            bot = bot.next;
        }
        
        return set;
    }
    
    $.fn.dragSelect = function(func, opts) {
        var self = this;
		opts = opts || {};

        if (typeof opts !== 'object') {
			throw Error("dragSelect options must be in an Object");
        }

        if(this.dragCanvas) return;
        this.dragCanvas = this.canvas;
        this.dragCanvas.dragging = false;
        this.dragOptions = {
            dragFinish: func || function() {}
        };
        
        this.dragCanvas.onmousedown = function(e) {
            if(this.dragging) return;
            this.dragging = true;
            this.start_x = e.layerX;
            this.start_y = e.layerY;
            this.path && this.path.remove();
            this.path = self.path("M0,0").attr({
                'stroke-dasharray': opts['stroke-dasharray'] || '.',
                'stroke': opts.stroke || '#000'
            });
        };
        
        this.dragCanvas.updatePath = function(x, y) {
            var path = getRectPath(this.start_x, this.start_y, x, y);
            this.path.attr({path: path});
        };
        
        this.dragCanvas.onmousemove = function(e) {
            if(!this.dragging) return;
            var x = e.layerX,
                y = e.layerY;
            this.updatePath(x, y);
        };
        
        this.dragCanvas.onmouseup = function(e) {
            this.dragging = false;
            this.end_x = e.layerX;
            this.end_y = e.layerY;
            this.path.remove();
            self.dragOptions.dragFinish(getSetWithinBounds(self, this.start_x, this.start_y, this.end_x, this.end_y));
        };
    };

    $.fn.undragSelect = function() {
        var self = this;
        if (!this.dragCanvas) return;
	this.dragCanvas.onmousedown = null;
        this.dragCanvas.onmouseup = null;
        this.dragCanvas = null;
    };

    
})(Raphael);
