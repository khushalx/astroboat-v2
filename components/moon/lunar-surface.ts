// Lommel-Seeliger + Lambert diffuse response approximates an airless regolith.
// The light vector, terrain normals and displaced geometry determine the terminator.
export const lunarVertexShader = `
  uniform sampler2D heightMap;
  varying vec2 surfaceUv;
  varying vec3 worldPosition;
  varying vec3 worldNormal;
  varying vec3 worldTangent;
  varying vec3 worldBitangent;
  void main() {
    surfaceUv = uv;
    vec3 n = normalize(normal);
    vec3 tangent = normalize(vec3(position.z, 0.000001, -position.x));
    vec3 bitangent = normalize(cross(n, tangent));
    float elevation = texture2D(heightMap, uv).r * (24.0 / 1737.4) - (12.0 / 1737.4);
    vec3 displaced = position + n * elevation;
    worldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;
    worldNormal = normalize(mat3(modelMatrix) * n);
    worldTangent = normalize(mat3(modelMatrix) * tangent);
    worldBitangent = normalize(mat3(modelMatrix) * bitangent);
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
  }
`;

export const lunarFragmentShader = `
  uniform sampler2D colorMap;
  uniform sampler2D normalMap;
  uniform vec3 sunDirection;
  varying vec2 surfaceUv;
  varying vec3 worldPosition;
  varying vec3 worldNormal;
  varying vec3 worldTangent;
  varying vec3 worldBitangent;
  void main() {
    vec3 terrainNormal = texture2D(normalMap, surfaceUv).xyz * 2.0 - 1.0;
    mat3 basis = mat3(normalize(worldTangent), normalize(worldBitangent), normalize(worldNormal));
    vec3 n = normalize(basis * terrainNormal);
    vec3 viewDirection = normalize(cameraPosition);
    float incidence = max(dot(n, sunDirection), 0.0);
    float emission = max(dot(n, viewDirection), 0.001);
    float visibleDay = smoothstep(-0.006, 0.006, dot(normalize(worldNormal), sunDirection));
    float scattering = 0.7 * (2.0 * incidence / max(incidence + emission, 0.001)) + 0.3 * incidence;
    vec3 albedo = texture2D(colorMap, surfaceUv).rgb;
    // A tiny neutral readability floor is artistic, not a calculated earthshine signal.
    vec3 color = albedo * (0.003 + visibleDay * scattering * 1.35);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
