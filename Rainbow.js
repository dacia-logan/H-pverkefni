function Rainbow(descr) {
    //common inherited setup logic from Entity
    this.setup(descr);

    //set width and height
    this.width = 80;
    this.height = 40;

    var numberOfLivePlats = entityManager._platforms.length;            //the number of platforms that are not dead
    var newestPlat = entityManager._platforms[numberOfLivePlats-1];     //the platform that is newest of them all

    //random staðsetningar for now, meðan að platformarnir eru ekki final.
    //set x position based on newest platform x-position
    this.x = util.randRange(newestPlat.getPos().posX, newestPlat.getPos().posX+newestPlat.getWidth()+150);            //set the x position of the Rainbow

    //set y position based on newest platform y-position
    this.y = util.randRange(newestPlat.getPos().posY-40, newestPlat.getPos().posY-150);;                              //set the y position of the Rainbow
    
    //set the velosity to the same as the platfoms
    this.vx = newestPlat.vx;

    //has the Rainbow been caught or not?
    this.isCaught = false;

    //combo
    this.combo = false; 

    //the name of the entity 
    this.type = "Rainbow";
};


Rainbow.prototype = new Entity();


Rainbow.prototype.render = function(ctx){
    //only draw if game is not over and the Rainbow has not been caught
    if (!main._isGameOver && !this.isCaught) {
        //if the Rainbow has not been hit draw a Rainbow
        g_rainbowSprite.drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
};

Rainbow.prototype.update = function(du) {
    //unregister from spatial manager
    spatialManager.unregister(this);

    //if the unicorn has caught the Rainbow it shoud die
    if (this.isCaught) this._isDeadNow; 

    //kill Rainbow if it falls out of the canvas
    //allso has to die if the 'Kall' hits it.
    if (this.x + this.width <= camera.getPos().posX) {
        //this.lostCombo(); 
        this.kill();
    }

    //if isDead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //update the velocity
    this.x -= this.vx * du;

    //re-register to spatial manager
    if (!this._isDeadNow) spatialManager.register(this);
};

