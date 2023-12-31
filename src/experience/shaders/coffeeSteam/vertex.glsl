uniform float uTime;

varying vec2 vUv;

#include '../partials/perlin2d.glsl';

void main()
{
  vec3 newPosition=position;
  vec2 displacementUv=uv;
  displacementUv*=5.;
  displacementUv.y-=uTime*.0002;
  
  float displacementStrength=pow(uv.y*3.,2.);
  float perlin=perlin2d(displacementUv)*displacementStrength;
  
  newPosition.y+=perlin*.1;
  
  vec4 modelPosition=modelMatrix*vec4(newPosition,1.);
  vec4 viewPosition=viewMatrix*modelPosition;
  vec4 projectionPosition=projectionMatrix*viewPosition;
  gl_Position=projectionPosition;
  
  vUv=uv;
}