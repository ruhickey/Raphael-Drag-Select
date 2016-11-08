# Raphael-Drag-Select

A Raphael.js plugin which allows the user to drag a box across the paper and select multiple nodes at once.  
The nodes are then returned to your callback function in a Raphael set.

### Sample Usage ###

    window.onload = function() {
      var paper = new Raphael("canvas");
    
      paper.dragSelect(function(set) {
      
        // Print out each node's type.
        for(var i = 0; i < set.items.length; i++) {
          console.log("set["+i+"] - " + set.items[i].type);
        }
        
      });
    
      paper.rect(10, 10, 10, 10);
    }
