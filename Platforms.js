function Platform(descr, x, y) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.y = y || Math.floor(util.randRange(260, 520));
    this.x = x || canvas.width;             // position of the images

    this.vx = 5;                        // vel

    this.size=70;                       // Width and height of each individual parts of the platform


    this.isTouchingEdge=false;

    if(descr===1){
            this.midNr=5;
            this.width = 70*6;
    }

    if(descr===2){
            this.midNr=6;
            this.width = 70*7;
    }

    if(descr===3){
            this.midNr=7;
            this.width = 70*8;
        }
    
    if(descr===4){
        this.midNr = 8;
        this.width = 70*9;
    }    
 
    this.height = 70;   
        
    
     
};

Platform.prototype = new Entity();


Platform.prototype.setTouchingEdge = function(){
    this.isTouchingEdge = !this.isTouchingEdge;
};

Platform.prototype.getTouchingEdge = function(){
    return this.isTouchingEdge;
}
Platform.prototype.update = function(du){
    
    spatialManager.unregister(this);
    if(this.x <= -(this.size*(this.midNr+1))){
        this.kill()
    }
   
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }


    this.x-=this.vx*du;

    spatialManager.register(this);
    
};




Platform.prototype.drawPlat = function(ctx){

    g_sprites.leftPlat.drawAtAndEnlarge(ctx, this.x, this.y, this.size, this.size);
    for(var j = 1; j<=this.midNr-1; j++){
            g_sprites.midPlat.drawAtAndEnlarge(ctx, this.x+this.size*j, this.y, this.size, this.size);
    }
    g_sprites.rightPlat.drawAtAndEnlarge(ctx, this.x+this.size*(this.midNr), this.y, this.size, this.size);
};

Platform.prototype.render = function(ctx){

     this.drawPlat(ctx);
         
}
