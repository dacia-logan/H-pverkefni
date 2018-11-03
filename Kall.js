function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.platLeft;

    // Set normal drawing scale, and warp state off
    this.cx = 500;
    this.cy = 200;
    this.velX=1;
    this.velY=1;


    this.width=15;
    this.height= 30;

    this.gravity=0.15;
    this.jumpForce=-5;

};

Kall.prototype = new Entity();

Kall.prototype.KEY_W = 'W'.charCodeAt(0);
Kall.prototype.KEY_A = 'A'.charCodeAt(0);
Kall.prototype.KEY_S = 'S'.charCodeAt(0);
Kall.prototype.KEY_D = 'D'.charCodeAt(0);
Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0);


Kall.prototype.update = function(du){

    spatialManager.unregister(this);

//Check for hit entity, if its hit it checks which side it is on and acts accordingly,
// resets or is on the platform.
    if(spatialManager.isHit(this.cx, this.cy, this.width, this.height)){
        if(this.cy+this.height/2 < spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posY
           && this.cx+this.width >= spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posX
           && this.cx <= spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posX+spatialManager.isHit(this.cx, this.cy, this.width, this.height).getWidth())

           this.cy = spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posY-this.height;

        else {
                this.cy =100;
                this.cx =500;
        }
    }
    this.applyAccel(0,this.gravity,du);
    this.handleKeys(du);

    spatialManager.register(this);
};

Kall.prototype.handleKeys = function(du){
    if(keys[this.KEY_A]){
        this.cx-=this.velX*du;
    }
    if(keys[this.KEY_D]){
        this.cx+=this.velX*du;
    }
    if (keys[this.KEY_JUMP]) {
      this.applyAccel(0,this.jumpForce,du)
    }
}


Kall.prototype.applyAccel= function(accelX,accelY,du){
  // u=original velocity
  var oldVelX= this.velX;
  var oldVelY= this.velY;
  //v = u + at
  this.velX += accelX * du;
  this.velY += accelY * du;

  // v_ave = (u + v) / 2
  var aveVelX = (oldVelX + this.velX) / 2;
  var aveVelY = (oldVelY + this.velY) / 2;

  // s = s + v_ave * t
  var nextX = this.cx + aveVelX * du;
  var nextY = this.cy + aveVelY * du;

  this.cx += aveVelX*du;
  this.cy += aveVelY*du;
};

Kall.prototype.render = function(ctx){

    util.fillBox(ctx, this.cx, this.cy, this.width, this.height,"black");

};
