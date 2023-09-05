#include <begin_vertex>



if(position.x > 0.5){

  //#if defined( USE_UV ) || defined( USE_ANISOTROPY )
  transformed.x -= uWidth;
 // #endif
}

if(position.y > 0.5){
  //#if defined( USE_UV ) || defined( USE_ANISOTROPY )
  transformed.y -= uHeight;
  //#endif
}
