function Shine(x,y,platNum) {
    // common inherited setup logic from Entity
    this.setup(x);

    // set width and height
    this.width = 150;
    this.height = 150;

    // set the position of the gem
    this.x = x;

    // set the y position of the gem
    this.y = y - this.height;

    // has the Shine been caught or not?
    this.isCaught = false;

    // combo
    this.combo = false; 

    // framecounter for explosion
    this.frameCounter = 0; 

    // number of images to run through while exploding
    this.numberOfFrames = g_shineSprite.length;

    // the amount of pixels we want to move the shine up and down
    this.dist = 20; 

    // the frames we are goint to spend on each distance
    this.moveCounter = this.dist;

    // are we movint up or down?
    this.up = true; 
    this.down = false;   

    // the name of the entity 
    this.type = "Shine";
};


Shine.prototype = new Entity();


Shine.prototype.render = function(ctx){
    //only draw if game is not over and the Shine has not been caught
    if (!main._isGameOver && !this.isCaught) {
        //if the Shine has not been hit draw a Shine
        g_shineSprite[Math.floor(this.frameCounter)].drawAtAndEnlarge(
            ctx,this.x,this.y,this.width,this.height);
    }
};

Shine.prototype.update = function(du) {
    //unregister from spatial manager
    spatialManager.unregister(this);

    //if the unicorn has caught the Shine it should die
    if (this.isCaught) this._isDeadNow;

    //kill Shine if it falls out of the canvas
    //allso has to die if the 'Kall' hits it.
    if (this.x <= camera.getPos().posX - this.width) {
        //this.lostCombo(); 
        this.kill();
        score.gotLastShine = false;
    }

    // this controlls how fast we change frames on the shine
    if (this.frameCounter < this.numberOfFrames-1) this.frameCounter += 0.05;
    else this.frameCounter = 0; 

    // this controlls the movement of the shine
    if (this.up === true && this.moveCounter >= 0) {
        this.moveCounter -= 0.5; 
        this.y++;
    } else {
        this.up = false; 
        this.down = true; 
    }

    if (this.down === true && this.moveCounter <= this.dist) {
        this.moveCounter += 0.5;
        this.y--;
    } else {
        this.down = false; 
        this.up = true; 
    }


    //if isDead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //re-register to spatial manager
    if (!this._isDeadNow) spatialManager.register(this);
};

