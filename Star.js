function Star(descr) {
    //common inherited setup logic from Entity
    this.setup(descr);

    //set width and height
    this.width = 75;
    this.height = 70;

    var numberOfLivePlats = entityManager._platforms.length;            //the number of platforms that are not dead
    var newestPlat = entityManager._platforms[numberOfLivePlats-1];     //the platform that is newest of them all
    
    //set x position based on newest platform x-position
    this.x = newestPlat.x + newestPlat.getWidth()/2;                    //set the position of the star

    //set y position based on newest platform y-position
    var yPos = newestPlat.y - this.height+5;                              //get the y position of the platform
    this.y = yPos;                                                      //set the y position of the star
    
    //set the velosity to the same as the platfoms
    this.vx = newestPlat.vx;

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
    if (this.x <= -this.width || 
        this.frameCounter >= this.numberOfFrames) this.kill();


    //if the star is hit by 'Kall' with spatialID 2 it is cilled
    //TODO                                                                      /*
    //ætti að vera þegar hann er að dash-a en ekki þegar                         * Lagaði saptialmanagerinn þannig allt collision a stjörnu er höndlað í kall
    //hann er bara að hlaupa og hann ætti að fá auka stig hér                    */
    /*
    if (spatialManager.isHit(                                                 
        this.x, this.y, this.width, this.height)._spatialID === 2 
        /* && isDashing) 
            this.isExploding=true; 
            //todo : unregister, viljum ekki að caracterinn hoppi yfir eða geti 
            // lent á sprengingunni
    */
    //if is dead and the frames are not done 
    //change the framecounter for explosion
    if (this.isExploding && 
        this.frameCounter <= this.numberOfFrames) this.frameCounter += 0.2; 
   

    //update the velocity
    this.x-=this.vx*du;

    //re-register to spatial manager
    //if isDead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }
    //else spatialManager.register(this);

    if (!this.isExploding) spatialManager.register(this);
};