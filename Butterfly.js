function Butterfly(descr) {
    //common inherited setup logic from Entity
    this.setup(descr);

    //set width and height
    this.width = 20;
    this.height = 20;

    var numberOfLivePlats = entityManager._platforms.length;            //the number of platforms that are not dead
    var newestPlat = entityManager._platforms[numberOfLivePlats-1];     //the platform that is newest of them all

    //random staðsetningar for now, meðan að platformarnir eru ekki final.
    //set x position based on newest platform x-position
    this.x = util.randRange(newestPlat.getPos().posX, newestPlat.getPos().posX+newestPlat.getWidth()+150);            //set the x position of the Butterfly

    //set y position based on newest platform y-position
    this.y = util.randRange(newestPlat.getPos().posY-40, newestPlat.getPos().posY-150);;                              //set the y position of the Butterfly
    
    //set the velosity to the same as the platfoms
    this.vx = newestPlat.vx;

    //has the butterfly been caught or not?
    this.isCaught = false;

    //the name of the entity 
    this.type = "Butterfly";
};


Butterfly.prototype = new Entity();


Butterfly.prototype.render = function(ctx){
    //only draw if game is not over and the butterfly has not been caught
    if (!main._isGameOver && !this.isCaught) {
        //if the Butterfly has not been hit draw a Butterfly
        g_starSprite.drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
};

Butterfly.prototype.update = function(du) {
    
    //unregister from spatial manager
    spatialManager.unregister(this);

    //if the unicorn has caught the butterfly it shoud die
    if (this.isCaught) this._isDeadNow; 

    //kill Butterfly if it falls out of the canvas
    //allso has to die if the 'Kall' hits it.
    if (this.x <= -this.width) {
            this.kill();
    }

    //if isDead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //update the velocity
    this.x-=this.vx*du;

    //re-register to spatial manager
    if (!this.isCaught) spatialManager.register(this);
};

