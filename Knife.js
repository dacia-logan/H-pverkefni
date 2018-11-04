function Knife(descr){
  this.setup(descr);
  this.width=40;
  this.height=20;
}
Knife.prototype= new Entity();

Knife.prototype.rotation=0;
Knife.prototype.x=0;
Knife.prototype.y=0;
Knife.prototype.velX=2;
Knife.prototype.velY=0.2;


Knife.prototype.lifeSpan=6000/NOMINAL_UPDATE_INTERVAL;


Knife.prototype.update =function(du){
  spatialManager.unregister(this);
  if(this._isDeadNow){
    return entityManager.KILL_ME_NOW;
  }
  this.lifeSpan-=du;
  if (this.lifeSpan<0) {
    return entityManager.KILL_ME_NOW;
  }
  this.x+=this.velX*du;
  this.y+=this.velY*du;

  spatialManager.register(this);
}


Knife.prototype.render=function(ctx){
  g_sprites.Kunai.drawAtAndEnlarge(ctx,this.x,this.y,this.width,this.height);
}
