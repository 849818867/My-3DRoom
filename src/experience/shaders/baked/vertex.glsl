varying vec2 vUV;

void main()
{
  gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);
  vUV=uv;
}