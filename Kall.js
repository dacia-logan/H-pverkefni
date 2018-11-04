function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.platLeft;

    // Set normal drawing scale, and warp state off
    this.x = 200;
    this.y = 400;
    this.velX=0;
    this.velY=0;


    this.width=70;
    this.height= 70;

    this.gravity=0.10;
    this.jumpForce=-5;

    this.inAir=true;
    this.jumpCounter=2;

    this.framecounter=0;

};

Kall.prototype = new Entity();

Kall.prototype.KEY_W = 'W'.charCodeAt(0);
Kall.prototype.KEY_A = 'A'.charCodeAt(0);
Kall.prototype.KEY_S = 'S'.charCodeAt(0);
Kall.prototype.KEY_D = 'D'.charCodeAt(0);
Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0);
Kall.prototype.RESET= 'U'.charCodeAt(0);


Kall.prototype.update = function(du){


    //new frame of animation every 5 frams
    if(this.inAir){
      this.framecounter+=0.15;
      if (this.framecounter>=9.1) {
        this.framecounter=9.1;
      }
    }
    else {
      this.framecounter+=0.35;
      this.framecounter%=10;
    }


    if (eatKey(this.RESET)||this.y>g_canvas.height) {
      this.x=200;
      this.y=200;
      this.velY=0;
    }

    spatialManager.unregister(this);
    this.applyAccel(this.gravity,du);
    this.handleKeys(du);

//Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
// resets or is on the platform.
    this.handleKeys(du);
    this.applyAccel(0,this.gravity,du);
    if(spatialManager.isHit(this.x, this.y, this.width, this.height)){
            
        if(this.y+this.height/2 < spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY
           && this.x+this.width >= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX
           && this.x <= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX+spatialManager.isHit(this.x, this.y, this.width, this.height).getWidth()){

             this.y = spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY-this.height;
             this.velY=0;
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

    spatialManager.register(this);
};

Kall.prototype.handleKeys = function(du){
    if(keys[this.KEY_A]){
        this.x-=this.velX*du;
    }
    if(keys[this.KEY_D]){
        this.x+=this.velX*du;
    }
    if (eatKey(this.KEY_JUMP)) {
      if (this.jumpCounter!==0) {
        this.framecounter=0;
        this.velY*=0.2;
        this.jumpCounter-=1;
        this.applyAccel(this.jumpForce,du)
      }
    }
}


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
    if (this.inAir) {
      g_jumpSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }
    else{
      g_runSprite[Math.floor(this.framecounter)].drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
    }

};
