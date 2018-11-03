function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.platLeft;
    
    // Set normal drawing scale, and warp state off
    this.cx = 500;
    this.cy = 200;

    
    this.width=15;
    this.height= 30;

};

Kall.prototype = new Entity();

Kall.prototype.KEY_JUMP = 'W'.charCodeAt(0);



Kall.prototype.update = function(du){
    
    spatialManager.unregister(this);

    this.cy+=2;

    if(spatialManager.isHit(this.cx, this.cy, this.width, this.height)){
        if(this.cy+this.height-2 < spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posY
           && this.cx >= spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posX 
           && this.cx <= spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posX+spatialManager.isHit(this.cx, this.cy, this.width, this.height).getWidth())
            
           this.cy = spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posY-this.height;

        else this.cy =200;
    }

    if(eatKey(this.KEY_JUMP)){
        this.cy-=30
    }
    spatialManager.register(this);
};



Kall.prototype.render = function(ctx){
    
    util.fillBox(ctx, this.cx, this.cy, this.width, this.height);
    
};


