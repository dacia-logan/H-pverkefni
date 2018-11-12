function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    //upphafsstaða og upphafshraði
    this.x = 200;
    this.y = 200;
    this.velX=1;
    this.velY=0;

    //hæð og breidd
    this.width=70;
    this.height=100;
    //þyngdarafl og hoppkraftur
    this.gravity=0.22;
    this.jumpForce=-8;
    //boolean breita sem er true þegar hann er í loftinu en false annars
    this.inAir=true;
    //jumpcounter telur hoppin niður
    this.jumpCounter=2;
    //frameCounter er fyrir rammana í sprite animation
    this.framecounter=0;

    this.isThrowing=false;

    //should explode when colliding with left edge of platform
    //and when colliding with star entity
    this.isExploding = false;

    //dashing, extra speed
    this.isDashing = false;
    //number of frames we want to be dashing
    this.dashCounter = 20;

    // Líf
    this.lives = 3;
    this.heartSize = 50;

    // Score
    this.score = 0;
    this.scoreSpeed = 2.5

    this.type =  "Kall";

};

Kall.prototype = new Entity();


Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0);
Kall.prototype.KEY_DASH= 'D'.charCodeAt(0); //fast speed forward, dashing
Kall.prototype.RESET= 'U'.charCodeAt(0);

Kall.prototype.update = function(du){

    spatialManager.unregister(this);

    //set the xVel of the unicorn based on if
    //it is dashing or not
    this.setSpeed(du);

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
    


// Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
// resets or is on the platform.
    this.handleKeys(du);
    this.applyAccel(0,this.gravity,du);
    this.collidesWith(du);
    

     //check if out of canvas
    if (this.y > g_canvas.height) {
      this.loseLife();
    }

    //Check for death
    if(this._isDeadNow){
      return entityManager.KILL_ME_NOW
    }
    //else register
    else
      spatialManager.register(this);
    //check if out of canvas
    if (this.y > g_canvas.height) {
      this.loseLife();
    }

    // Update the score
    this.score += Math.floor(this.scoreSpeed);
};


/**
 * handles speed of unicorn when the unicorn is dashing
 * and not dashing.
 */
Kall.prototype.setSpeed = function(du) {

  if (this.isDashing && this.dashCounter !== 0)
  { //is the unicorn dashing and is the dashcounter not zero?
    this.dashCounter--;         //dash for only 15 frames
    this.applyAccel(1,0,du) ;   //set velocity to more speed
    this.jumpCounter=1;         //unicorn can jump once after it has dashed
    this.velY=0;                // no vertical velocity while dashing

  } else
  {//unicorn is not dashing anymore move as usual
    this.isDashing = false;     //not dashing
    this.velX=1;                //set velocity to normal speed
    this.dashCounter = 15;      //reset the dashCounter to 15 again
  }

};

Kall.prototype.collidesWith = function(du){
    //console.log(spatialManager.isHit(this.x, this.y, this.width, this.height).length != 0);

    if(spatialManager.isHit(this.x, this.y, this.width, this.height).length != 0){

      var ent = spatialManager.isHit(this.x, this.y, this.width, this.height);
      //console.log(ent);
      for(i=0 ; i < ent.length; i++){
        if(ent[i].getType() === "Star"){
          //collision with the star
          this.starCollide(ent[i]);
        } else if (ent[i].getType() === "Platform"){
          //collision with the platform
          this.platformCollide(ent[i]);
        }
      }
    } else {
      this.inAir=true;
    }
};


Kall.prototype.starCollide = function(star){
  /* if(this.isCharging){
        entity.kill();
  }
  */
    //if we land on top of the star we want to walk on it
    if(this.y+this.height <
          star.getPos().posY + star.getWidth()/2){
      this.inAir = false;
      this.y = star.getPos().posY - this.height;
    }
    //if we dash into the star the star explodes
    else if (this.isDashing) {
      star.explodes();
    //else the unicorn loses a life
    } else  {
      this.loseLife();
    }
};



Kall.prototype.platformCollide = function(entity){
    //where are we colliding with platform?
    var posX = entity.getPos().posX+10;
    var posY = entity.getPos().posY*1.035;
    var eWidth = entity.getWidth()-25;
    var eHeight = entity.getHeight()*0.6;
    //LEFT EDGE - character should explode and lose a life
    if (this.x+this.width < posX + 30) /*&&
        this.x+this.width-5 < entity.getPos().posX)*/
    {
      //this.isExploding = true;
      while (Math.floor(this.x+this.width)> posX) {
        this.x--;
      }
      //this.x -=5
      this.loseLife();
      return;
    }

    //TOP EDGE - character should run on platform
    if (this.y+this.height <
        posY + eWidth/2)
    {
        //make sure to drag it out of the ground if it
        //went to far on the last frame
        while(Math.floor(this.y+this.height) > posY)
        {
          this.y--;
        }
        this.y = posY-this.height;
        this.velY=0;
        this.jumpCounter=2;
        this.inAir=false;
    }

    //BOTTOM EDGE - character should stop rising and start falling
    if (this.y >
        posY+ eWidth/2)
    {
        //make sure to drag it out of the ground if it
        //went to far on the last frame
        while(Math.floor(this.y) < entity.y+eHeight)
        {
          this.y++;
        }
        // TODO ÞEGAR AÐ DASH ER KOMIÐ ÞARF AÐ SKODÐA ÞETTA BETUR
        // ERFITT AÐ EIGA VIÐ BOTNINN NÚNA.
    }
};

Kall.prototype.loseLife = function(){
      //----\\
     // TODO \\
    //--------\\
    /*
    *Gera reset function sem resettar mappið ofl.
    */
    this.lives--;

    if (this.lives === 0) {
        this.kill();
        main.gameOver();
      // TODO
      // Play game over sound
    }

    else {
      this.y =200;
      this.x =500;
      this.velY=0;
    }

};


Kall.prototype.handleKeys = function(du){

    if (eatKey(this.KEY_JUMP)) {
      if (this.jumpCounter!==0) {
        this.framecounter=0;
        this.velY=0;
        this.jumpCounter-=1;
        this.inAir=true;
        this.applyAccel(0,this.jumpForce, du);
      }
    }
    if (eatKey(this.RESET)||this.y>g_canvas.height) {
      this.x=200;
      this.y=200;
      this.velY=0;
    }
    if (eatKey(this.KEY_DASH)) {
      this.isDashing = true;      //more speed access
    }
};


Kall.prototype.applyAccel= function(accelX,accelY,du){
  // u=original velocity
 
  var oldVelY= this.velY;
  var oldVelX= this.velX;
  //v = u + at
 
  this.velY += accelY * du;
  this.velX += accelX * du;
  // v_ave = (u + v) / 2
 
  var aveVelY = (oldVelY + this.velY) / 2;
  var aveVelX = (oldVelX + this.velX) / 2;
  // s = s + v_ave * t

  this.y += aveVelY*du;
  this.x += aveVelX*du;
};

Kall.prototype.render = function(ctx){
    
    if (this.inAir) {
      g_jumpSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
    /*
    TODO LÁTA ÞETTA VIRKA
    else if (this.isExploding) {
      g_explosionSprite[Math.floor(this.frameCounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
    */
    else{
      g_runSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
    this.drawLives(ctx);
    this.drawScore(ctx);
};


Kall.prototype.getNextY = function(accelY,du){
  // u=original velocity
  var oldVelY= this.velY;
  //v = u + at
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
  var aveVelY = (oldVelY + this.velY) / 2;

  // s = s + v_ave * t
  var nextY = this.y + aveVelY * du;

  return nextY;
};


// Draw the hearts on the screen.
Kall.prototype.drawLives = function(ctx) {
  // Space between the hearts
  var livesOffset = 55;

  // Draw as many hearts as lives the player has left
  for (var i = 0; i < this.lives; i++) {
    g_sprites.heart.drawAtAndEnlarge(ctx, camera.getPos().posX+15 + livesOffset * i,camera.getPos().posY+20, this.heartSize, this.heartSize);
  }

};

Kall.prototype.drawScore = function(ctx) {
  
  ctx.font = "bold 40px Consolas";
  ctx.textAlign = "center";

  // Color of the score
  ctx.fillStyle = "white";
  
  // Color of the shadow
  ctx.shadowColor = '#1c5e66';
  ctx.shadowBlur = 40

  // Draw the score
  ctx.fillText(this.score, g_canvas.width / 2 + camera.getPos().posX - 20,
                            70 + camera.getPos().posY);

  ctx.fill();

  // Make sure the shadow is only applied to the score
  ctx.shadowBlur = 0;
};
