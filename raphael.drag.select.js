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
            var x = bot.node.x.baseVal.value,
                y = bot.node.y.baseVal.value;
            
            if((x >= min_x) && (x <= max_x) && (y >= min_y) && (y <= max_y)) {
                set.push(bot);
            }
            
            bot = bot.next;
        }
        
        return set;
    }
    
    $.fn.dragSelect = function(func) {
        var that = this;
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
            this.path = that.path("M0,0").attr({'stroke-dasharray': '.'});
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
            that.dragOptions.dragFinish(getSetWithinBounds(that, this.start_x, this.start_y, this.end_x, this.end_y));
        };
    };
    
})(Raphael);