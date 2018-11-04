function Obstacle(descr, x, y, d=undefined) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.y = y || Math.floor(util.randRange(260, 520));
    this.x = x || canvas.width;                          // position of the images 
    
    this.vx = 5;                        // vel

    this.size=70;                       // Width and height of each individual parts of the platform, the widht and height of the images
    
 
    
     
};
