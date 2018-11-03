function Kall(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.platLeft;
    
    // Set normal drawing scale, and warp state off
    this.x = 500;
    this.y = 200;

    
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

//Check for hit entity, if its hit it checks which side it is on and acts accordingly,
// resets or is on the platform.
    if(spatialManager.isHit(this.x, this.y, this.width, this.height)){
        if(this.y+this.height/2 < spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY
           && this.x+this.width >= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX 
           && this.x <= spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posX+spatialManager.isHit(this.x, this.y, this.width, this.height).getWidth())
            
           this.y = spatialManager.isHit(this.x, this.y, this.width, this.height).getPos().posY-this.height;

        else {
                this.y =100;
                this.x =500;
        }
    }

    this.handleKeys();
    
    spatialManager.register(this);
};

Kall.prototype.handleKeys = function(){
    if(keys[this.KEY_W]){
        this.y-=2
    }
    if(keys[this.KEY_S]){
        this.y+=2
    }
    if(keys[this.KEY_A]){
        this.x-=2
    }
    if(keys[this.KEY_D]){
        this.x+=2
    }
}

Kall.prototype.render = function(ctx){
    
    util.fillBox(ctx, this.x, this.y, this.width, this.height, "Black");
    
};


