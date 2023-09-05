#include <common>

uniform float uWidth;
uniform float uHeight;
uniform float uDepth;

uniform float uTime;



mat2 get2dRotateMatrix(float _angle)
{
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
}
