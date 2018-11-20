//===========
// GEM SPRITE 
//===========

function Gem(x,y,platNum) {

    // common inherited setup logic from Entity
    this.setup(x);

    // set width of the gem
    this.width = 95;

    // set heigth of the gem
    this.height = 90;
    
    // the offset is calculated at random based on the platform (platNum passed to Gem)
    // that the gem is standin ontop of. The values are hard coded in the platform file.
    var offset; 
    if (platNum === 4) offset = util.randRange((g_images.normal3.width*2.4)/2, g_images.normal3.width*2.4);
    if (platNum === 1) offset = util.randRange((g_images.large.width*2.6)/2, g_images.large.width*2.6); 
    if (platNum === 5) offset = util.randRange((g_images.small.width*1.5)/2, g_images.small.width*1.5);
    if (platNum === 7) offset = ((g_images.long.width*1.3)/2)-10+(this.width/2);

    // set the X position of the gem
    this.x = x+offset-(this.width);                                             

    // set the y position of the gem
    this.y = y-this.height+10;        

    // is the gem exploding?
    this.isExploding = false;

    // framecounter for explosion
    this.frameCounter = 0; 

    // number of images to run through while exploding
    this.numberOfFrames = g_explosionSprite.length;

    // random gems to draw each time we call the Gem function
    this.gemToDraw = Math.floor(util.randRange(0,g_gemSprites.length));

    // the gems type for collision detection
    this.type = "Gem";
};

Gem.prototype = new Entity();

Gem.prototype.explodes = function(){
    spatialManager.unregister; 
    this.isExploding = true;
}

Gem.prototype.render = function(ctx){
    // only draw the gem/explosion while the game is still ongoing
    if (!main._isGameOver) {
        // if the gem has been hit, draw the explosion
        if (this.isExploding) { 
            // this draws the explosion
            explode.draw(ctx,this.x,this.y,this.width,this.height,g_explosionSprite,this.type);
            // this increases the framecount for the explosion animation
            explode.frames(this.type,g_explosionSprite.length);
        // if the gem has not been hit draw a gem
        } else { 
            g_gemSprites[Math.floor(this.gemToDraw)].drawAtAndEnlarge(
                ctx,this.x,this.y,this.width,this.height);
        }
    }
};

Gem.prototype.update = function(du) {
    // unregister from spatial manager
    spatialManager.unregister(this);

    // kill Gem if it falls out of the canvas
    // Gem has to die if the 'Kall' hits it.
    // and
    // If the x coords of the unicorn go further than the gem, the player has
    // failed to destroy it, and thus loses his gem combo bonus.
    if (this.x <= camera.getPos().posX - this.width) {
            this.kill();
            score.gotLastGem = false;
            score.gemCombo = 0;
            score.gemsInRow = 0;
    }

    // if the gem is done exploding then kill it
    if (explode.done(g_explosionSprite.length, this.type)) this.kill(); 

    // if is dead return to entityManager that this 
    // gem is ready to die and be removed from the game
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // if it is not exploding then reregister else we dont 
    // want it in our entityManager anymore.
    if (!this.isExploding) spatialManager.register(this);
};