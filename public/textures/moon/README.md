# Lunar surface assets

Credit: NASA's Scientific Visualization Studio; LRO / LROC / LOLA.
CGI Moon Kit, visualization by Ernie Wright:
https://svs.gsfc.nasa.gov/4720/

Source files:
- Color: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_4k.tif
- Elevation: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_16_uint.tif

The 2019 color mosaic is centered on zero longitude. It is aesthetically
adjusted, not radiometrically calibrated; polar gaps include lower-resolution
LOLA albedo. NASA documents the mosaic construction and original LROC sources
on the CGI Moon Kit page. No NASA logo or endorsement is implied.

Generated locally with scripts/prepare-moon-assets.mjs:
- color-{1024,2048,4096}.webp: sRGB color, quality 84.
- height-{1024,2048}.webp: lossless 8-bit height encoded across -12 to +12 km
  relative to a 1737.4 km radius. NASA source values are unsigned half-meters
  above 1727400 m. They are converted to physical elevation before encoding.
  Quantization is approximately 94 m; displacement is not exaggerated.
- normal-{1024,2048}.webp: linear-data tangent-space normals derived from the
  higher-precision elevation, accounting for longitude spacing by latitude.
  Compressed at quality 90; these are visual normals, not scientific products.
- reference.webp: locally projected, north-up near-side surface reference.
  It is explicitly labeled as a reference, not the selected date's phase.

Runtime uses 1K color/height/normals first (about 363 KiB), then upgrades to
2K relief/normals plus 4K desktop or 2K smaller-screen color. Desktop texture
transfers total about 2.5 MiB plus a 149 KiB reference; no TIFF or GLB is served.
Data-saver mode retains the 1K set. Texture data is local, with no NASA request
made by the browser. See docs/moon-observatory.md for the scientific model.

NASA's packaged models were evaluated:
https://svs.gsfc.nasa.gov/14959/
The small flat model is about 13 MB and the small topographic model about
78 MB. A displaced mesh from the same documented map sources is more
appropriate for this laptop/mobile reader.
