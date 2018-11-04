/* the star sprite
* explodes when 'Kall' hits it while dashing
* else it kills 'Kall'.
* it's pos is always ontop of a platform.
* 
*
* hvað er ég búin að gera:
* preload image Star - still star image
* preload image Explosion
* teikna stjörnuna based á isExplosion eða ekki
*/
function Star(descr) {
    //common inherited setup logic from Entity
    this.setup(descr); 

    this.width = 75;
    this.height = 70;

    //set x position
    var widthOfPlat = entityManager._platforms[1].width;    //get the width of the platform
    var xPos = entityManager._platforms[1].x;               //get the starting x position of the platform
    var randPosX = util.randRange(xPos, xPos+widthOfPlat);  //get random position for the star
    this.x = randPosX-this.width;                           //set the position of the star

    //set y position
    var yPos = entityManager._platforms[1].y - this.height; //get the y position of the platform
    this.y = yPos;                                          //set the y position of the star
    
    //set the velosity to the same as the platfoms
    this.vx = entityManager._platforms[1].vx;

    //is the sprite exploding or not?
    this.isExploding = false;
 
};


Star.prototype = new Entity();

Star.prototype.render = function(ctx){
    //only draw if game is not over
    if (!main._isGameOver) {
        //if the star has not been hit draw a star
        if (!this.isExploding) {
            g_starSprite.drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
        //if the star has been hit, draw the explosion
        } else {
            g_explosionSprite[0].drawAtAndEnlarge(ctx,xPos,yPos,this.width+10,this.height+10);
        }
    }
    

};

Star.prototype.update = function(du) {
    
    //unregister from spatial manager
    spatialManager.unregister(this);

    //kill Star if it falls out of the canvas
    //allso has to die if the 'Kall' hits it.
    if (this.x <= -this.width) this.kill();

    //if isDead
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    //update the velocity
    this.x-=this.vx*du;

    //re-register to spatial manager
    spatialManager.register(this);

};