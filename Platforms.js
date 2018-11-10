function Platform(descr, x, y) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.y = y || Math.floor(util.randRange(260, 520));
    this.x = x || canvas.width;             // position of the images

    this.vx = 5;                        // vel

    this.size=70;                       // Width and height of each individual parts of the platform


    this.platformPushed=false;

    if(descr===1){
            this.nrTiles=5;
            this.width = 70*6;
    }

    if(descr===2){
            this.nrTiles=6;
            this.width = 70*7;
    }

    if(descr===3){
            this.nrTiles=7;
            this.width = 70*8;
        }
    
    if(descr===4){
        this.nrTiles = 8;
        this.width = 70*9;
    }    
 
    this.height = 70;   
        
    this.type = "Platform";
     
};

Platform.prototype = new Entity();


Platform.prototype.setPlatformPushed = function(){
    this.platformPushed = !this.platformPushed;
};

Platform.prototype.getPlatformPushed = function(){
    return this.platformPushed;
};

Platform.prototype.getSpeed = function(){
    return this.vx;
}

Platform.prototype.update = function(du){
    
    spatialManager.unregister(this);

    this.x-=this.vx*du;
    if(this.x <= -(this.size*(this.nrTiles+1))){
        this.kill()
    }

    if(this._isDeadNow){
        return entityManager.KILL_ME_NOW;
    }
    else  spatialManager.register(this);

    
};


Platform.prototype._spawnPlatform = function () {
    entityManager.generatePlat(1, this.x+50, this.y-100);
};

Platform.prototype.drawPlat = function(ctx){
    //console.log(this.width);
    g_sprites.leftPlat.drawAtAndEnlarge(ctx, this.x, this.y, this.size, this.size);
    for(var j = 1; j<=this.nrTiles-1; j++){
            g_sprites.midPlat.drawAtAndEnlarge(ctx, this.x+this.size*j, this.y, this.size, this.size);
    }
    g_sprites.rightPlat.drawAtAndEnlarge(ctx, this.x+this.size*(this.nrTiles), this.y, this.size, this.size);
};

Platform.prototype.render = function(ctx){

    // Only draw the platforms if the game is not over
    if (!main._isGameOver) {
        this.drawPlat(ctx);
    }
         
}
