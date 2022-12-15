#include <begin_vertex>
float angle = (position.y + uTime) * 0.7;

mat2 rotateMatrix = get2dRotateMatrix(angle);
transformed.xz = rotateMatrix * transformed.xz;

