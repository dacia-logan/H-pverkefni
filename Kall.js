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

    this.gravity=0.08;
    this.jumpForce=-8;

};

Kall.prototype = new Entity();

Kall.prototype.KEY_W = 'W'.charCodeAt(0);
Kall.prototype.KEY_A = 'A'.charCodeAt(0);
Kall.prototype.KEY_S = 'S'.charCodeAt(0);
Kall.prototype.KEY_D = 'D'.charCodeAt(0);
Kall.prototype.KEY_JUMP= 'W'.charCodeAt(0);


Kall.prototype.update = function(du){

    spatialManager.unregister(this);
    this.applyAccel(this.gravity,du);
    this.handleKeys(du);

//Check for hit entity, if its hit it checks wwhich side it is on and acts accordingly,
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

    spatialManager.register(this);
};

Kall.prototype.handleKeys = function(du){
    if(keys[this.KEY_A]){
        this.cx-=this.velX*du;
    }
    if(keys[this.KEY_D]){
        this.cx+=this.velX*du;
    }
    if (eatKey(this.KEY_JUMP)) {
      this.applyAccel(this.jumpForce,du)
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
  var nextY = this.cy + aveVelY * du;
  this.cy += aveVelY*du;
};

Kall.prototype.render = function(ctx){

    util.fillBox(ctx, this.cx, this.cy, this.width, this.height,"black");

};
