//===========
// GEM SPRITE
//===========

function Gem(x,y,platNum) {

    // Common inherited setup logic from Entity.
    this.setup(x);

    // Set width and height of the gem.
    this.width = 95;
    this.height = 90;

    // The offset is calculated at random, based on the platform (platNum passed to Gem) that
    //      the gem is standing on top of. The values are hard coded in the platform file.
    var offset;
    if (platNum === 4) offset = util.randRange((g_images.normal3.width*2.4)/2, g_images.normal3.width*2.4);
    if (platNum === 1) offset = util.randRange((g_images.large.width*2.6)/2, g_images.large.width*2.6);
    if (platNum === 5) offset = util.randRange((g_images.small.width*1.5)/2, g_images.small.width*1.5);
    if (platNum === 7) offset = ((g_images.long.width*1.3)/2)-10+(this.width/2);

    // Set the X and Y positions of the gem.
    this.x = x+offset-(this.width);
    this.y = y-this.height+10;

    // Is the gem exploding?
    this.isExploding = false;

    // Framecounter for explosion.
    this.frameCounter = 0;

    // Number of images to run through while exploding.
    this.numberOfFrames = g_explosionSprite.length;

    // Random gems to draw each time we call the Gem function.
    this.gemToDraw = Math.floor(util.randRange(0,g_gemSprites.length));

    // The gems' type for collision detection.
    this.type = "Gem";
    // Buffer for combo counters
    this.buffer = 150;
};

Gem.prototype = new Entity();

Gem.prototype.explodes = function () {
    spatialManager.unregister;
    this.isExploding = true;
}

Gem.prototype.render = function (ctx) {
    // Only draw the gem/explosion while the game is still going on.
    if (!main._isGameOver) {
        // If the gem has been hit, draw the explosion.
        if (this.isExploding) {
            // Draw the explosion.
            explode.draw(ctx,this.x,this.y,this.width,this.height,g_explosionSprite,this.type);
            // Increase the framecount for the explosion animation.
            explode.frames(this.type,g_explosionSprite.length);
        // If the gem has not been hit, draw a gem.
        } else {
            g_gemSprites[Math.floor(this.gemToDraw)].drawAtAndEnlarge(
                ctx,this.x,this.y,this.width,this.height);
        }
    }
};

Gem.prototype.update = function(du) {
    // Unregister from spatial manager.
    spatialManager.unregister(this);

    // Kill Gem if it falls out of the canvas.
    // Gem has to die if the 'Kall' hits it.
    // and
    // If the x coords of the unicorn go further than the gem, the player has
    //      failed to destroy it, and thus loses his gem combo bonus.
    if (this.x <= camera.getPos().posX - this.width-this.buffer) {
        this.kill();
        score.gotLastGem = false;
        score.gemCombo = 0;
        score.gemsInRow = 0;
    }

    // If the gem is done exploding then kill it.
    if (explode.done(g_explosionSprite.length, this.type)) this.kill();

    // If it is dead return to entityManager that this gem is ready
    //      to die and to be removed from the game.
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // If it is not exploding then re-register, else we dont
    //      want it in our entityManager anymore.
    if (!this.isExploding) spatialManager.register(this);
};
