//=============
// SHINE SPRITE
//=============

function Shine(x,y,platNum) {
    // Common inherited setup logic from Entity.
    this.setup(x);

    // Set width and height.
    this.width = 150;
    this.height = 150;

    // Set the X and Y positions of the gem.
    this.x = x;
    this.y = y - this.height;

    // Has the shine been caught or not?
    this.isCaught = false;

    // Framecounter for explosion.
    this.frameCounter = 0;

    // Number of images to run through while exploding.
    this.numberOfFrames = g_shineSprite.length;

    // The amount of pixels we want to move the shine up and down.
    this.dist = 20;

    // The frames we are going to spend on each distance.
    this.moveCounter = this.dist;

    // Are we moving up or down?
    this.up = true;
    this.down = false;

    // The name of the entity.
    this.type = "Shine";
    // Buffer for combo counters
    this.buffer = 150;    
};

Shine.prototype = new Entity();

Shine.prototype.render = function(ctx){
    // Only draw if game is not over and the shine has not been caught.
    if (!main._isGameOver && !this.isCaught) {
        // If the Shine has not been hit, draw a shine.
        g_shineSprite[Math.floor(this.frameCounter)].drawAtAndEnlarge(
            ctx,this.x,this.y,this.width,this.height);
    }
};

Shine.prototype.update = function(du) {
    // Unregister from spatial manager.
    spatialManager.unregister(this);

    // If the unicorn has caught the shine it should die.
    if (this.isCaught) this._isDeadNow;

    // Kill Shine if it falls out of the canvas.
    // Shine has to die if the 'Kall' hits it.
    // and
    // If the shine goes out of the canvas, the player has failed
    //      to collect it, and thus loses his shine combo bonus.
    if (this.x <= camera.getPos().posX - this.width-this.buffer) {
        this.kill();
        score.gotLastShine = false;
        score.shineCombo = 0;
        score.shineInRow = 0;
    }

    // This controls how fast we change frames on the shine.
    if (this.frameCounter < this.numberOfFrames-1) this.frameCounter += 0.05;
    else this.frameCounter = 0;

    // This controls the movement of the shine..
    if (this.up === true && this.moveCounter >= 0) {
        this.moveCounter -= 0.5;
        this.y++;
    } else {
        this.up = false;
        this.down = true;
    }

    // ..and this also.
    if (this.down === true && this.moveCounter <= this.dist) {
        this.moveCounter += 0.5;
        this.y--;
    } else {
        this.down = false;
        this.up = true;
    }

    // If the shine is dead, return to entityManager that it
    //      should remove it from the game.
    if (this._isDeadNow) {
        return entityManager.KILL_ME_NOW;
    }

    // Re-register to spatial manager if shine has not died.
    if (!this._isDeadNow) spatialManager.register(this);
};
