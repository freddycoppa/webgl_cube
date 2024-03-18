export const vsSource = `#version 300 es

precision mediump float;

layout (location = 0) in vec3 quadVec;
layout (location = 1) in vec2 uv;
layout (location = 2) in vec3 quadPosition;
layout (location = 3) in mat3 quadOrientation;
layout (location = 6) in float color;

out vec3 rgb;
out vec2 texCoords;

uniform vec3 translation;

uniform mat3 cubeOrientation;
uniform mat4 projection;
uniform vec3 sideToBeRotated;// = vec3(0, 0, 0);
uniform mat3 sideRotation;// = mat3(1.0);

vec3 colors[12] = vec3[](  
    vec3(0, 1, 0),
	vec3(1, 1, 0),
	vec3(1, 0, 0),
	vec3(0, 0, 1),
	vec3(1, 1, 1),
	vec3(1, 0.5, 0),
    vec3(0, 0.5, 0),
	vec3(0.5, 0.5, 0),
	vec3(0.5, 0, 0),
	vec3(0, 0, 0.5),
	vec3(0.5, 0.5, 0.5),
	vec3(0.5, 0.25, 0)
);

void main() {
    mat3 sideRotations[3] = mat3[](
        mat3(1),
        mat3(1),
        sideRotation
    );

	mat3 rotateSide = mat3[3](
        mat3(1),
        mat3(1),
        sideRotation
    )[int(sign(dot(normalize(sideToBeRotated), normalize(quadPosition)))) + 1];

	vec3 oriented = quadOrientation * quadVec;
	
	vec3 transformed = cubeOrientation * rotateSide * (quadPosition + oriented) + translation;

	gl_Position = projection * vec4(transformed, 1.0); 

	rgb = colors[int(color)];
	texCoords = uv;
}
`;

export const fsSource = `#version 300 es

precision mediump float;

in vec3 rgb;
in vec2 texCoords;

out vec4 fragColor;

uniform sampler2D sampler;

void main() {
	fragColor = vec4(texture(sampler, texCoords).xyz * rgb, 1);
}
`;