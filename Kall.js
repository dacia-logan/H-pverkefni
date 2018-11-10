function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    //upphafsstaða og upphafshraði
    this.x = 200;
    this.y = 200;
    this.velX=0;
    this.velY=0;

    //hæð og breidd
    this.width=70;
    this.height=100;
    //þyngdarafl og hoppkraftur
    this.gravity=0.12;
    this.jumpForce=-5;
    //boolean breita sem er true þegar hann er í loftinu en false annars
    this.inAir=true;
    //jumpcounter telur hoppin niður
    this.jumpCounter=2;
    //frameCounter er fyrir rammana í sprite animation
    this.framecounter=0;

    this.isCharging=true;
    this.isThrowing=false;

    // Líf
    this.lives = 3;
    this.heartSize = 50;

    this.type =  "Kall";

};

Kall.prototype = new Entity();


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


//Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
// resets or is on the platform.
    this.handleKeys(du);
    this.collidesWith(du);
    this.applyAccel(this.gravity,du);

    //check if out of canvas
    if (this.y > g_canvas.height) {
      this.loseLife();
    }  

    spatialManager.register(this);
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


Kall.prototype.collidesWith = function(du){

  if(spatialManager.isHit(this.x, this.y, this.width, this.height).length != 0){

    var ent = spatialManager.isHit(this.x, this.y, this.width, this.height);
    console.log(ent);
    for(i=0 ; i < ent.length; i++){
    
      if(ent[i].getType() === "Star"){
        
        this.starCollide(ent[i]);
        if(!this.isCharging){
          this.loseLife();
        }
      }

      if(ent[i].getType() === "Platform"){
        
        this.platformCollide(ent[i],du);
      }
    }
  }
  
  else {
    this.inAir=true;
  }

};


Kall.prototype.starCollide = function(star){
  /* if(this.isCharging){
        entity.kill();
  }
  */ 
        star.explodes();

  
};


Kall.prototype.platformCollide = function(entity,du){
  
  if(this.y < entity.getPos().posY  && this.getNextY(this.gravity,du) > entity.getPos().posY )
  { 
    this.y = entity.getPos().posY-this.height;
    this.velY=0;
    this.jumpCounter=2;
    this.inAir=false;
  }

    if(this.y+this.height-10 < entity.getPos().posY                      // Cheching if character is on top of platform
        && this.x+this.width >= entity.getPos().posX
        && this.x <= entity.getPos().posX + entity.getWidth())
    {
    
      this.y = entity.getPos().posY-this.height;
      this.velY=0;
      this.jumpCounter=2;
      this.inAir=false;
      
    }
    //TODO\\
//------------\\
/*
*Tjekka hvort hann lendir undir platform eða a vinstri hliðinni (mun aldrei lenda á hægri)
*/
   else if(this.x+this.width >= entity.getPos().posX) 
    {

      this.x -=5;
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
      this.x =100;
      this.velY=0;
    }
       // Play a 'fail' sound when the girl hits the bottom
       // TODO
       // If the player has no lives left, then it's game over

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
        this.inAir=true;
        this.applyAccel(this.jumpForce,du);
      }
    }
    if (eatKey(this.RESET)||this.y>g_canvas.height) {
      this.x=200;
      this.y=200;
      this.velY=0;
    }
    
};

Kall.prototype.applyAccel = function(accelY, du){
  // u=original velocity
 
  var oldVelY= this.velY;
  //v = u + at
 
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
 
  var aveVelY = (oldVelY + this.velY) / 2;

  // s = s + v_ave * tvar nextY = this.y + aveVelY * du;
  
  var nextY = this.y + aveVelY * du;

  this.y += aveVelY*du;
};

Kall.prototype.getNextX = function(accelY,du){
  // u=original velocity
  var oldVelX= this.velX;
  //v = u + at
  this.velX += accelX * du;

  // v_ave = (u + v) / 2
  var aveVelX = (oldVelX + this.velX) / 2;

  // s = s + v_ave * t
  var nextX = this.x + aveVelX * du;

  return nextX;
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
    g_sprites.heart.drawAtAndEnlarge(ctx, 15 + livesOffset * i, 20, this.heartSize, this.heartSize);
  }

};
