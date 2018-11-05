function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    //upphafsstaða og upphafshraði
    this.x = 200;
    this.y = 400;
    this.velX=0;
    this.velY=0;

    //hæð og breidd
    this.width=70;
    this.height= 100;
    //þyngdarafl og hoppkraftur
    this.gravity=0.12;
    this.jumpForce=-10;
    //boolean breita sem er true þegar hann er í loftinu en false annars
    this.inAir=true;
    //jumpcounter telur hoppin niður
    this.jumpCounter=2;
    //frameCounter er fyrir rammana í sprite animation
    this.framecounter=0;

    this.isThrowing=false;

    // Líf
    this.lives = 3;
    this.heartSize = 50;

};

Kall.prototype = new Entity();

Kall.prototype.KEY_THROW = ' '.charCodeAt(0);
Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0);
Kall.prototype.RESET= 'U'.charCodeAt(0);


Kall.prototype.update = function(du){

    spatialManager.unregister(this);
    if(this.inAir || this.isThrowing){
      this.framecounter+=0.15;
      if (this.framecounter>=9.1) {
        this.framecounter=9.1;
      }
    }
    else {
      this.framecounter+=0.35;
      this.framecounter%=10;
    }
    if (this.framecounter>9 && this.isThrowing) {
      entityManager.throwKnife(this.x+this.height,this.y+this.width/2);
      this.isThrowing=false;
    }


    if (eatKey(this.RESET)||this.y>g_canvas.height) {
      this.x=200;
      this.y=200;
      this.velY=0;
    }



//Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
// resets or is on the platform.
    this.handleKeys(du);
    this.applyAccel(this.gravity,du);
    if(spatialManager.isHit(this.x, this.y, this.width, this.height)){
        if(this.y+this.height-10 < spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY
           && this.x+this.width >= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX
           && this.x <= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX+spatialManager.isHit(this.x, this.y, this.width, this.height).getWidth()){

             this.y = spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY-this.height;
             this.velY=Math.floor(0);
             this.jumpCounter=2;
             this.inAir=false;
           }

        else {
                this.y =200;
                this.x =100;
        }
    }
    else {
      this.inAir=true;
    }

    if (this.y > g_canvas.height) {
      this.lives--;
        // Play a 'fail' sound when the girl hits the bottom
        // TODO
        // If the player has no lives left, then it's game over
        if (this.lives === 0) {
          main.gameOver();
          // TODO
          // Play game over sound
        }
    }

    spatialManager.register(this);
};

Kall.prototype.handleKeys = function(du){
    if (eatKey(this.KEY_THROW)) {
        this.isThrowing=true;
        this.framecounter=0;
    }
    if (eatKey(this.KEY_JUMP)) {
      if (this.jumpCounter!==0) {
        this.framecounter=0;
        this.velY=0;
        this.jumpCounter-=1;
        this.applyAccel(this.jumpForce,du);
      }
    }
};


Kall.prototype.applyAccel= function(accelY,du){
  // u=original velocity
  var oldVelY= this.velY;
  //v = u + at
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
  var aveVelY = (oldVelY + this.velY) / 2;

  // s = s + v_ave * t
  var nextY = this.y + aveVelY * du;

  this.y += aveVelY*du;
   
};

Kall.prototype.render = function(ctx){
    if (this.isThrowing) {
      g_throwSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
    else if (this.inAir) {
      g_jumpSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
    else{
      g_runSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }

    this.drawLives(ctx);
};

// Draw the hearts on the screen.
Kall.prototype.drawLives = function(ctx) {
  // Space between the hearts
  var livesOffset = 55;

  // Draw as many hearts as lives the player has left
  for (var i = 0; i < this.lives; i++) {
    g_sprites.heart.drawAtAndEnlarge(ctx, 15 + livesOffset * i, 20, this.heartSize, this.heartSize);
  }

};
