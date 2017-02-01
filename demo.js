// Run the script when the screen loads
window.onload = function() {
  // Create our paper
  var paper = new Raphael("canvas", "100%", "100%");

  // Create our boxes options
  // These are Raphael Path options
  var options = {
    "stroke-dasharray": "100 20 0 20",
    "stroke": "#F00"
  };

  // Initialise the Plugin with a callback function
  paper.dragSelect(function(set) {
    if (set.length == 0) {
      console.log("No nodes found.");
    } else {
      for(var i = 0; i < set.items.length; i++) {
        console.log("set["+i+"] - " + set.items[i].type);
      }
    }
  }, options);

  // Create a node on screen
  paper.rect(10, 10, 100, 100);
}
