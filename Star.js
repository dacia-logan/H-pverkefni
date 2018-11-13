function Star(x,y) {
    //common inherited setup logic from Entity
    this.setup(x);

    //set width and height
    this.width = 75;
    this.height = 70;
    
    //set x position based on newest platform x-position
    this.x = x;                  //set the position of the star

    //set y position based on newest platform y-position
                         //get the y position of the platform
    this.y = y;                                                      //set the y position of the star
    
    //set the velosity to the same as the platfoms


    //is the sprite exploding or not?
    this.isExploding = false;

    //framecounter for explosion
    this.frameCounter = 0; 

    //number of images to run through are 0-11
    this.numberOfFrames = 11;

    //the stars type for collision detection
    this.type = "Star";
};


Star.prototype = new Entity();

Star.prototype.explodes = function(){
    spatialManager.unregister; 
    this.isExploding=true;
}

Star.prototype.render = function(ctx){
    //only draw if game is not over
    if (!main._isGameOver) {
        //if the star has not been hit draw a star
        if (!this.isExploding) {
            g_starSprite.drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
        //if the star has been hit, draw the explosion
        } else {
            g_explosionSprite[Math.floor(this.frameCounter)].drawAtAndEnlarge(
                ctx,this.x,this.y,this.width,this.height);
        }
    }
};

Star.prototype.update = function(du) {
    
    //unregister from spatial manager
    spatialManager.unregister(this);

    //kill Star if it falls out of the canvas
    //allso has to die if the 'Kall' hits it.
    if (this.x <= camera.getPos().posX - this.width || 
        this.frameCounter >= this.numberOfFrames) this.kill();

    //if is dead and the frames are not done 
    //change the framecounter for explosion
    if (this.isExploding && 
        this.frameCounter <= this.numberOfFrames) this.frameCounter += 0.2; 
   

    //re-register to spatial manager
    //if isDead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //if it is not exploding then reregister else we dont 
    //want it in our entityManager anymore.
    if (!this.isExploding) spatialManager.register(this);
};