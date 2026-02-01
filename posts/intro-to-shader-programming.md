# Introduction to Shader Programming

Shaders are small programs that run on the GPU, enabling stunning visual effects and high-performance graphics. Let's explore how to create your first shaders using GLSL.

## What Are Shaders?

Shaders are programs that run in parallel on your graphics card (GPU) to process vertices and pixels. They're essential for:

- 3D rendering
- Visual effects
- Image processing
- Procedural generation

## The Graphics Pipeline

Understanding the rendering pipeline is crucial:

1. **Vertex Shader**: Processes each vertex (position, transformation)
2. **Rasterization**: Converts geometry to pixels
3. **Fragment Shader**: Colors each pixel
4. **Output**: Final image on screen

## Your First Vertex Shader

The vertex shader processes each vertex of your geometry:

```glsl
// Vertex Shader
#version 330 core

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 texCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 FragPos;
out vec3 Normal;
out vec2 TexCoord;

void main() {
    // Transform vertex position to clip space
    gl_Position = projection * view * model * vec4(position, 1.0);
    
    // Pass data to fragment shader
    FragPos = vec3(model * vec4(position, 1.0));
    Normal = mat3(transpose(inverse(model))) * normal;
    TexCoord = texCoord;
}
```

## Your First Fragment Shader

The fragment shader determines the color of each pixel:

```glsl
// Fragment Shader
#version 330 core

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoord;

uniform vec3 lightPos;
uniform vec3 viewPos;
uniform vec3 lightColor;
uniform vec3 objectColor;

out vec4 FragColor;

void main() {
    // Ambient lighting
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;
    
    // Diffuse lighting
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
    
    // Specular lighting
    float specularStrength = 0.5;
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
    vec3 specular = specularStrength * spec * lightColor;
    
    // Combine results
    vec3 result = (ambient + diffuse + specular) * objectColor;
    FragColor = vec4(result, 1.0);
}
```

## Creating a Wavy Effect

Let's create an animated wavy surface:

```glsl
// Animated Vertex Shader
#version 330 core

layout(location = 0) in vec3 position;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform float time;

out vec3 FragPos;

void main() {
    vec3 pos = position;
    
    // Create wave effect
    float wave = sin(pos.x * 5.0 + time) * 0.1;
    wave += cos(pos.z * 5.0 + time * 1.5) * 0.1;
    pos.y += wave;
    
    FragPos = pos;
    gl_Position = projection * view * model * vec4(pos, 1.0);
}
```

## Procedural Textures

Generate textures purely through math:

```glsl
// Procedural Checkerboard
#version 330 core

in vec2 TexCoord;
out vec4 FragColor;

void main() {
    // Create checkerboard pattern
    vec2 pos = floor(TexCoord * 10.0);
    float pattern = mod(pos.x + pos.y, 2.0);
    
    vec3 color = vec3(pattern);
    FragColor = vec4(color, 1.0);
}
```

## Ray Marching: Advanced Technique

Ray marching creates complex 3D scenes entirely in the fragment shader:

```glsl
#version 330 core

in vec2 TexCoord;
out vec4 FragColor;

uniform float time;
uniform vec2 resolution;

// Signed distance function for a sphere
float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

// Scene definition
float map(vec3 p) {
    return sdSphere(p, 1.0);
}

// Calculate normal
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

void main() {
    // Setup ray
    vec2 uv = (TexCoord * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec3 ro = vec3(0.0, 0.0, 3.0); // Ray origin
    vec3 rd = normalize(vec3(uv, -1.0)); // Ray direction
    
    // Ray marching
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if (d < 0.001) break;
        t += d;
        
        if (t > 100.0) break;
    }
    
    // Shading
    vec3 color = vec3(0.0);
    if (t < 100.0) {
        vec3 p = ro + rd * t;
        vec3 normal = calcNormal(p);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        color = vec3(diff);
    }
    
    FragColor = vec4(color, 1.0);
}
```

## GLSL Built-in Functions

Essential functions for shader programming:

```glsl
// Math
sin(), cos(), tan()
pow(x, y)
sqrt(x)
abs(x)
min(x, y), max(x, y)
clamp(x, min, max)

// Interpolation
mix(a, b, t)         // Linear interpolation
smoothstep(e0, e1, x) // Smooth interpolation

// Vector operations
length(v)
normalize(v)
dot(v1, v2)
cross(v1, v2)
reflect(I, N)
refract(I, N, eta)
```

## Performance Tips

1. **Minimize texture lookups**: They're expensive
2. **Use built-in functions**: They're optimized
3. **Avoid branching**: GPUs don't like if/else
4. **Precalculate**: Move calculations to CPU when possible
5. **Use lower precision**: `mediump` or `lowp` when appropriate

## Debugging Shaders

Debugging is tricky since you can't use print statements:

```glsl
// Visualize a value
FragColor = vec4(vec3(someValue), 1.0);

// Visualize normals
FragColor = vec4(normal * 0.5 + 0.5, 1.0);

// Checkerboard to verify UVs
float pattern = mod(floor(TexCoord.x * 10.0) + floor(TexCoord.y * 10.0), 2.0);
FragColor = vec4(vec3(pattern), 1.0);
```

## Resources for Learning More

- [The Book of Shaders](https://thebookofshaders.com/) - Interactive tutorial
- [Shadertoy](https://www.shadertoy.com/) - Share and explore shaders
- [Learn OpenGL](https://learnopengl.com/) - Comprehensive guide

## Conclusion

Shader programming opens up a world of creative possibilities. Start with simple effects, understand the fundamentals, and gradually build up to complex techniques. The GPU's parallel processing power enables real-time effects that would be impossible on the CPU.

Happy shader coding! 🎨
