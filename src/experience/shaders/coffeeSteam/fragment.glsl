uniform float uTime;
uniform float uTimeFrequency;
uniform vec2 uUvFrequency;
uniform vec3 uColor;

varying vec2 vUv;

#include '../partials/perlin2d.glsl';

void main()
{
  vec2 uv=vUv*uUvFrequency;
  uv.y-=uTime*uTimeFrequency;
  
  float borderAlpha=min(vUv.x*4.,(1.-vUv.x)*4.);
  borderAlpha=borderAlpha*(1.-vUv.y);
  
  float perlin=perlin2d(uv);
  perlin*=borderAlpha;
  perlin*=.6;
  perlin=min(perlin,1.);
  
  gl_FragColor=vec4(uColor,perlin);
}