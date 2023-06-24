// the following random/filter functions are required for all scenes

// // globals used in blueNoise_rand() function
// vec4 randVec4; // samples and holds the RGBA blueNoise texture value for this pixel
// float randNumber; // the final randomly generated number (range: 0.0 to 1.0)
// float counter; // will get incremented by 1 on each call to blueNoise_rand()
// int channel; // the final selected color channel to use for blueNoise_rand() calc (range: 0 to 3, corresponds to R,G,B, or A)
// float blueNoise_rand()
// {
// 	counter++; // increment counter by 1 on every call to blueNoise_rand()
// 	// cycles through channels, if modulus is 1.0, channel will always be 0 (only samples the R color channel of the blueNoiseTexture)
// 	channel = int(mod(counter, 2.0)); // if modulus is 2.0, channel will cycle through 0,1,0,1,etc (only samples the R and G color channels of the blueNoiseTexture)
// 	// if modulus was 4.0, channel will cycle through all available channels: 0,1,2,3,0,1,2,3,etc (samples all R,G,B,and A color chanels of the blueNoiseTexture)
	
// 	randNumber = randVec4[channel]; // get value stored in previously selected channel 0:R, 1:G, 2:B, or 3:A
// 	return fract(randNumber); // we're only interested in randNumber's fractional value between 0.0 (inclusive) and 1.0 (non-inclusive)
// }

var GSeed: vec2<u32>; // global seed used in rng() function
// rng() from iq https://www.shadertoy.com/view/4tXyWN
fn rng() -> float
{
	GSeed += vec2<u32>(1);
	let q: u32  = 1103515245U * ( (seed >> 1U) ^ (seed.yx) );
	let n: u32 = 1103515245U * ( (q.x) ^ (q.y >> 3U) );
	return float(n) * (1.0 / float(0xffffffffU));
}

fn randomSphereDirection() -> vec3<f32> // useful for subsurface ray scattering
{
    let up : f32 = rng() * 2.0 - 1.0; // range: -1 to +1
	let over : f32 = sqrt( max(0.0, 1.0 - up * up) );
	let around : f32 = rng() * TWO_PI;
	return normalize(vec3(cos(around) * over, up, sin(around) * over));	
}

//the following alternative skips the creation of tangent and bi-tangent vectors T and B
fn randomCosWeightedDirectionInHemisphere(nl:vec3<f32>) -> vec3<f32> // required for all diffuse and clearCoat surfaces
{
	let z : f32 = rng() * 2.0 - 1.0;
	let phi : f32 = rng() * TWO_PI;
	let r : f32 = sqrt(1.0 - z * z);
    return normalize(nl + vec3<f32>(r * cos(phi), r * sin(phi), z));
}

fn randomDirectionInSpecularLobe(reflectionDir:vec3<f32>, roughness: f32) -> vec3<f32> // for metal and dielectric specular surfaces with roughness
{
	let z : f32 = rng() * 2.0 - 1.0;
	let phi : f32 = rng() * TWO_PI;
	let r : f32 = sqrt(1.0 - z * z);
    let cosDiffuseDir: vec3<f32> = normalize(reflectionDir + vec3<f32>(r * cos(phi), r * sin(phi), z));
	return normalize( mix(reflectionDir, cosDiffuseDir, roughness * roughness) );
}

// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60
fn tentFilter(x : f32) -> f32 // graph looks like a tent, or roof shape ( ^ ), with more samples taken as we approach the center
{
	return (x < 0.5) ? sqrt(2.0 * x) - 1.0 : 1.0 - sqrt(2.0 - (2.0 * x));
}