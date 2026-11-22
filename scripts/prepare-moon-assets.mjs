import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

// Download the two documented NASA TIFFs separately; never run this in a web request.
const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/prepare-moon-assets.mjs /path/to/source-directory");
const out = path.resolve("public/textures/moon");
await mkdir(out, { recursive: true });
const color = path.join(source, "color.tif");
const height = path.join(source, "height.tif");
for (const width of [1024, 2048, 4096]) {
  await sharp(color).resize(width).webp({ quality: 84, effort: 6 }).toFile(path.join(out, `color-${width}.webp`));
}

for (const width of [1024, 2048]) {
  // NASA unsigned values are half-meters above 1727400 m, not normalized color.
  const { data, info } = await sharp(height).resize(width).toColourspace("grey16").raw({ depth: "ushort" }).toBuffer({ resolveWithObject: true });
  const elevation = new Float32Array(info.width * info.height);
  const displacement = Buffer.alloc(elevation.length);
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < elevation.length; i++) {
    const raw = data.readUInt16LE(i * 2);
    elevation[i] = raw * 0.5 - 10000;
    min = Math.min(min, elevation[i]); max = Math.max(max, elevation[i]);
    displacement[i] = Math.round(Math.max(0, Math.min(1, (elevation[i] + 12000) / 24000)) * 255);
  }
  if (max < 1000 || min > -1000 || max > 15000 || min < -15000) throw new Error("Unexpected LOLA height range; do not publish scaled color as elevation.");
  await sharp(displacement, { raw: { width, height: info.height, channels: 1 } }).webp({ lossless: true, effort: 6 }).toFile(path.join(out, `height-${width}.webp`));
  const normals = Buffer.alloc(elevation.length * 3);
  const sample = (x, y) => elevation[Math.max(0, Math.min(info.height - 1, y)) * width + (x + width) % width];
  const radius = 1737400;
  for (let y = 0; y < info.height; y++) {
    const lat = Math.PI * (0.5 - (y + 0.5) / info.height);
    for (let x = 0; x < width; x++) {
      const east = (sample(x + 1, y) - sample(x - 1, y)) / (2 * radius * Math.max(0.05, Math.cos(lat)) * 2 * Math.PI / width);
      const north = (sample(x, y - 1) - sample(x, y + 1)) / (2 * radius * Math.PI / info.height);
      const length = Math.hypot(east, north, 1);
      const offset = (y * width + x) * 3;
      normals[offset] = Math.round(127.5 * (1 - east / length));
      normals[offset + 1] = Math.round(127.5 * (1 - north / length));
      normals[offset + 2] = Math.round(127.5 * (1 + 1 / length));
    }
  }
  await sharp(normals, { raw: { width, height: info.height, channels: 3 } }).webp({ quality: 90, effort: 6 }).toFile(path.join(out, `normal-${width}.webp`));
  console.log(`LOLA ${width}: ${Math.round(min)} to ${Math.round(max)} m relative to 1737.4 km`);
}

// Orthographic, north-up NASA-textured reference; no claim of a current phase.
const { data: pixels, info } = await sharp(color).resize(2048).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const size = 1000, poster = Buffer.alloc(size * size * 4);
for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
  const nx = (x + 0.5 - size / 2) / (size * 0.475);
  const ny = (size / 2 - y - 0.5) / (size * 0.475);
  const r2 = nx * nx + ny * ny;
  if (r2 >= 1) continue;
  const nz = Math.sqrt(1 - r2);
  const u = 0.5 + Math.atan2(nx, nz) / (2 * Math.PI);
  const v = 0.5 - Math.asin(ny) / Math.PI;
  const from = (Math.min(info.height - 1, Math.floor(v * info.height)) * info.width + Math.floor(u * info.width)) * info.channels;
  const to = (y * size + x) * 4;
  const shade = 0.74 + 0.26 * Math.sqrt(nz);
  for (let c = 0; c < 3; c++) poster[to + c] = Math.min(255, pixels[from + c] * shade * 1.2);
  poster[to + 3] = 255;
}
await sharp(poster, { raw: { width: size, height: size, channels: 4 } }).webp({ quality: 88 }).toFile(path.join(out, "reference.webp"));
for (const name of ["color-1024.webp", "color-2048.webp", "color-4096.webp", "height-1024.webp", "height-2048.webp", "normal-1024.webp", "normal-2048.webp", "reference.webp"]) {
  console.log(name, Math.round((await stat(path.join(out, name))).size / 1024) + " KiB");
}
