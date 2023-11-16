// 贴图
uniform sampler2D uBakedDayTexture;
uniform sampler2D uBakedNightTexture;
uniform sampler2D uBakedNeutralTexture;
uniform sampler2D uLightMapTexture;

// 插值系数
uniform float uNightMix;
uniform float uNeutralMix;

// tv光照颜色、强度
uniform vec3 uLightTvColor;
uniform float uLightTvStrength;

// desk光照颜色、强度
uniform vec3 uLightDeskColor;
uniform float uLightDeskStrength;

// pc光照颜色、强度
uniform vec3 uLightPcColor;
uniform float uLightPcStrength;

// 模型uv坐标
varying vec2 vUV;

#pragma glslify:perlin2d=require('../partials/perlin2d.glsl')

// blending 取自glsl-blend库
float blendLighten(float base,float blend){
  return max(blend,base);
}

vec3 blendLighten(vec3 base,vec3 blend){
  return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));
}

vec3 blendLighten(vec3 base,vec3 blend,float opacity){
  return(blendLighten(base,blend)*opacity+base*(1.-opacity));
}

// 片元着色器
void main()
{
  vec3 bakedDayColor=texture2D(uBakedDayTexture,vUV).rgb;
  vec3 bakedNightColor=texture2D(uBakedNightTexture,vUV).rgb;
  vec3 bakedNeutralColor=texture2D(uBakedNeutralTexture,vUV).rgb;
  vec3 lightMapColor=texture2D(uLightMapTexture,vUV).rgb;
  
  vec3 bakedColor=mix(mix(bakedDayColor,bakedNightColor,uNightMix),bakedNeutralColor,uNeutralMix);
  
  // 添加tv光照
  float lightTvStrength=lightMapColor.r*uLightTvStrength;
  bakedColor=blendLighten(bakedColor,uLightTvColor,lightTvStrength);
  
  float lightPcStrength=lightMapColor.b*uLightPcStrength;
  bakedColor=blendLighten(bakedColor,uLightPcColor,lightPcStrength);
  
  float lightDeskStrength=lightMapColor.g*uLightDeskStrength;
  bakedColor=blendLighten(bakedColor,uLightDeskColor,lightDeskStrength);
  
  gl_FragColor=vec4(bakedColor,1.);
}