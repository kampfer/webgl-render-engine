#include "./chunks/colorHead.frag"

uniform vec3 diffuse;
varying vec3 vNormal;

#ifdef USE_MAP

    uniform sampler2D map;
    varying vec2 vUv;

    vec4 sRGBToLinear( in vec4 value ) {
        return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
    }

    vec4 LinearTosRGB( in vec4 value ) {
        return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
    }

#endif

void main() {

    vec4 diffuseColor = vec4(diffuse, 1);

    #include "./chunks/colorMain.frag"

    #ifdef USE_MAP

        vec4 texelColor = texture2D(map, vec2(0, 0));
        texelColor = sRGBToLinear(texelColor);

        // diffuseColor *= texelColor;

    #endif

    // vec4 lightColor = vec4(1, 1, 1, 1);
    // vec3 lightDirection = normalize(vec3(0.5, 3, 4));
    // vec4 ambientColor = vec4(0.2, 0.2, 0.2, 1);

    // vec3 normal = normalize(vNormal);

    // float fDot = max(dot(lightDirection, normal), 0.0);
    // vec4 ambient = ambientColor * diffuseColor;
    // gl_FragColor = vec4((lightColor * diffuseColor * fDot).xyz + ambient.xyz, diffuseColor.a);

    #ifdef USE_MAP
        // gl_FragColor = vec4(LinearTosRGB(texelColor).rgb, 1);
        // gl_FragColor = vec4(texelColor.rgb, 1);
        gl_FragColor = vec4(texelColor.x / 255.0, 0, 0, 1);
    #elif
        gl_FragColor = texelColor;
    #endif

}