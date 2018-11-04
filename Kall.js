function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.platLeft;

    // Set normal drawing scale, and warp state off
    this.x = 500;
    this.y = 200;
    this.velX=0;
    this.velY=0;


    this.width=15;
    this.height= 30;

    this.gravity=0.12;
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
    this.handleKeys(du);
    this.applyAccel(0,this.gravity,du);
    if(spatialManager.isHit(this.x, this.y, this.width, this.height)){
            
        if(this.y+this.height/2 < spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY
           && this.x+this.width >= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX
           && this.x <= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX+spatialManager.isHit(this.x, this.y, this.width, this.height).getWidth()){

             this.y = spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY-this.height;
             this.velY=0;
           }

        else {
                this.y =100;
                this.x =500;
        }
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
  var nextY = this.y + aveVelY * du;

  this.y += aveVelY*du;
};

Kall.prototype.render = function(ctx){

    util.fillBox(ctx, this.x, this.y, this.width, this.height,"black");

};
