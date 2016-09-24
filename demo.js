window.onload = function() {
    var paper = new Raphael("canvas");
    
    paper.dragSelect(function(set) {
        for(var i = 0; i < set.items.length; i++) {
            console.log("set["+i+"] - " + set.items[i].type);
        }
    });
    
    paper.rect(10, 10, 10, 10);
}