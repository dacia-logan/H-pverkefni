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

Kall.prototype.KEY_W = 'W'.charCodeAt(0);
Kall.prototype.KEY_A = 'A'.charCodeAt(0);
Kall.prototype.KEY_S = 'S'.charCodeAt(0);
Kall.prototype.KEY_D = 'D'.charCodeAt(0);


Kall.prototype.update = function(du){
    
    spatialManager.unregister(this);


    if(spatialManager.isHit(this.cx, this.cy, this.width, this.height)){
        if(this.cy < spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posY
           && this.cx+this.width >= spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posX 
           && this.cx <= spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posX+spatialManager.isHit(this.cx, this.cy, this.width, this.height).getWidth())
            
           this.cy = spatialManager.isHit(this.cx, this.cy, this.width, this.height).getPos().posY-this.height;

        else this.cy =200;
    }

    if(keys[this.KEY_W]){
        this.cy-=1
    }
    if(keys[this.KEY_S]){
        this.cy+=1
    }
    if(keys[this.KEY_A]){
        this.cx-=1
    }
    if(keys[this.KEY_D]){
        this.cx+=1
    }
    spatialManager.register(this);
};



Kall.prototype.render = function(ctx){
    
    util.fillBox(ctx, this.cx, this.cy, this.width, this.height);
    
};


