function Platform(descr, cy) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.cy = cy;



    this.cx = canvas.width;             // position of the images 
    this.vx = 4;                        // vel

    this.size=70;                       // Width and height of each individual parts of the platform
    
    
    this.isTouchingEdge=false;
    
    if(descr===1){
            this.midNr=6;  
            this.width = 70*7;
    }
   
    if(descr===2){
            this.midNr=7;  
            this.width = 70*8;
    }

    if(descr===3){
            this.midNr=8;  
            this.width = 70*9;           
        }
 
    this.height = 70;   
        
     
};

Platform.prototype = new Entity();


Platform.prototype.getX = function(){
    return this.cx;
};

Platform.prototype.getLength = function(){
    return this.midNr*this.size;
};

Platform.prototype.setTouchingEdge = function(){
    this.isTouchingEdge = !this.isTouchingEdge;
};

Platform.prototype.getTouchingEdge = function(){
    return this.isTouchingEdge;
}
Platform.prototype.update = function(du){
   
    if(this.cx <= -(this.size*(this.midNr+1))){
        this.kill()
    }
    spatialManager.unregister(this);
    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }

    
    this.cx-=this.vx*du;

    spatialManager.register(this);
     
};

Platform.prototype.drawPlat = function(ctx){
    

    g_sprites.leftPlat.drawAtAndEnlarge(ctx, this.cx, this.cy, this.size, this.size); 
    for(var j = 1; j<=this.midNr-1; j++){
            g_sprites.midPlat.drawAtAndEnlarge(ctx, this.cx+this.size*j, this.cy, this.size, this.size); 
    }
    g_sprites.rightPlat.drawAtAndEnlarge(ctx, this.cx+this.size*(this.midNr), this.cy, this.size, this.size); 
};

Platform.prototype.render = function(ctx){

    this.drawPlat(ctx);
}
  
  
  
