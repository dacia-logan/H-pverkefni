function Platform(descr, cy) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.cy = cy;



    this.cx = canvas.width;             // position of the images 
    this.vx = 4;                        // vel

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
  
  
  
  /*
  //ctx.drawImage(g_images.tile,this.vx, 50);
    
   
  if(this.vr>=10){      
    g_map.drawMap(ctx,this.vx);
}
else if(this.vr>=4) {             
    g_map.drawMap2(ctx,this.vx);  
}
else {
    g_map.drawMap3(ctx,this.vx);
}
    

//ctx.fillRect(ctx.canvas.width-Math.abs(this.vx), 50, ctx.canvas.width, 50);

//ctx.drawImage(g_images.tile,this.vx+(ctx.canvas.width), 50, g_images.tile.width,g_images.tile.height);


if (this.vx < -ctx.canvas.width || this.vx===500) {
    his.vx = 0;
}

this.vx -= 2;
class Map {

    constructor(){
    this.sSisze=16;
    this.scaled_size=32;
    this.cols= 25;
    this.rows=3;
    this.aMap=[
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3
 
      
    ];
    

    }
    drawMap2(ctx,vx){

        for(var i = 0; i<this.cols; i++){
            
            for(var j = 0; j<this.rows;j++){

                var value = this.aMap[j*this.cols+i];
                var tile_x = i*this.scaled_size;
                var tile_y = j*this.scaled_size;
                
                
               // ctx.drawImage(g_images.tile, value*this.sSisze, 0,this.sSisze,this.sSisze,tile_x, tile_y+504,this.scaled_size,this.scaled_size);
                ctx.drawImage(g_images.tile, value*this.sSisze, 0,this.sSisze,this.sSisze,vx+tile_x+1000, tile_y+504,this.scaled_size,this.scaled_size);
            }
        } 
        
    }
    drawMap3(ctx,vx){

        for(var i = 0; i<this.cols; i++){
            
            for(var j = 0; j<this.rows;j++){

                var value = this.aMap[j*this.cols+i];
                var tile_x = i*this.scaled_size;
                var tile_y = j*this.scaled_size;
     
               // ctx.drawImage(g_images.tile, value*this.sSisze, 0,this.sSisze,this.sSisze,tile_x, tile_y+504,this.scaled_size,this.scaled_size);
                ctx.drawImage(g_images.tile, value*this.sSisze, 0,this.sSisze,this.sSisze,vx+tile_x+1000, tile_y+304,this.scaled_size,this.scaled_size);
            }
        } 
        
    }   
    drawMap(ctx,vx){

        for(var i = 0; i<this.cols; i++){
            
            for(var j = 0; j<this.rows;j++){

                var value = this.aMap[j*this.cols+i];
                var tile_x = i*this.scaled_size;
                var tile_y = j*this.scaled_size;
                
               // ctx.drawImage(g_images.tile, value*this.sSisze, 0,this.sSisze,this.sSisze,tile_x, tile_y+504,this.scaled_size,this.scaled_size);
                ctx.drawImage(g_images.tile, 48, 0,this.sSisze,this.sSisze,vx+tile_x+1000, tile_y+504,this.scaled_size,this.scaled_size);
            }
        } 
        
    }     
}

var g_map = new Map();
*/