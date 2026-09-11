import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++)
    c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function makePng(width, height, pixelAt) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelAt(x, y);
      const p = y * stride + 1 + x * 4;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
      raw[p + 3] = a;
    }
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function makePalettePng(width, height, palette, pixelAt) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 3; // color type: indexed
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // PLTE: palette entries (R,G,B × count), padded to multiple of 3
  const plteData = Buffer.alloc(256 * 3);
  for (let i = 0; i < palette.length && i < 256; i++) {
    plteData[i * 3] = palette[i][0];
    plteData[i * 3 + 1] = palette[i][1];
    plteData[i * 3 + 2] = palette[i][2];
  }

  // Raw image data: 1 byte per pixel (index)
  const stride = width + 1;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < width; x++) {
      raw[y * stride + 1 + x] = pixelAt(x, y);
    }
  }

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("PLTE", plteData),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function make16bitPng(width, height, pixelAt) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 16; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 8 + 1;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelAt(x, y);
      const p = y * stride + 1 + x * 8;
      raw.writeUInt16BE(r, p);
      raw.writeUInt16BE(g, p + 2);
      raw.writeUInt16BE(b, p + 4);
      raw.writeUInt16BE(a, p + 6);
    }
  }

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function makeCorruptPng() {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(4, 0);
  ihdr.writeUInt32BE(4, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 4 * 3 + 1;
  const raw = Buffer.alloc(4 * stride);
  for (let y = 0; y < 4; y++) {
    raw[y * stride] = 0;
    for (let x = 0; x < 4; x++) {
      const p = y * stride + 1 + x * 3;
      raw[p] = 255;
      raw[p + 1] = 0;
      raw[p + 2] = 0;
    }
  }

  const idat = chunk("IDAT", deflateSync(raw));
  // Corrupt CRC: flip a byte in the CRC field
  idat[idat.length - 1] ^= 0xff;

  return Buffer.concat([sig, chunk("IHDR", ihdr), idat, chunk("IEND", Buffer.alloc(0))]);
}

function makeTruncatedPng() {
  return Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]);
}

const outDir = join(__dirname);

// 1. PNG 1×1
writeFileSync(join(outDir, "1x1.png"), makePng(1, 1, () => [255, 0, 0, 255]));

// 2. PNG 1×1 fully transparent
writeFileSync(
  join(outDir, "1x1-transparent.png"),
  makePng(1, 1, () => [0, 0, 0, 0]),
);

// 3. Large 1024×1024 checkerboard (≈1 megapixel RGBA)
writeFileSync(
  join(outDir, "1024x1024-checker.png"),
  makePng(1024, 1024, (x, y) =>
    x % 2 === y % 2 ? [255, 0, 0, 255] : [255, 255, 255, 255],
  ),
);

// 4. 1920×1080 gradient (≈2 megapixels, tests larger displays)
writeFileSync(
  join(outDir, "1920x1080-gradient.png"),
  makePng(1920, 1080, (x, y) => [
    Math.floor((x / 1920) * 255),
    Math.floor((y / 1080) * 255),
    128,
    255,
  ]),
);

// 5. Transparency checkerboard (black/white with alpha pattern)
writeFileSync(
  join(outDir, "alpha-checkerboard.png"),
  makePng(64, 64, (x, y) => {
    const alpha = (x + y) % 3 === 0 ? 0 : 255;
    const base = (x % 2 === y % 2) ? 0 : 255;
    return [base, base, base, alpha];
  }),
);

// 6. Palette / indexed-color PNG (4 colors: red, green, blue, white)
const palette = [
  [255, 0, 0],
  [0, 255, 0],
  [0, 0, 255],
  [255, 255, 255],
];
writeFileSync(
  join(outDir, "palette-4colors.png"),
  makePalettePng(32, 32, palette, (x, y) => {
    const idx = (Math.floor(x / 8) + Math.floor(y / 8)) % palette.length;
    return idx;
  }),
);

// 7. Palette with many colors (256-color full palette)
const fullPalette = Array.from({ length: 256 }, (_, i) => [
  i,
  (i * 3) % 256,
  (i * 7) % 256,
]);
writeFileSync(
  join(outDir, "palette-256.png"),
  makePalettePng(64, 64, fullPalette, (x, y) => (x + y * 64) % 256),
);

// 8. 16-bit RGBA PNG (subtle gradient to test high bit depth)
writeFileSync(
  join(outDir, "16bit-subtle.png"),
  make16bitPng(32, 32, (x, y) => [
    Math.floor((x / 32) * 65535),
    Math.floor((y / 32) * 65535),
    32768,
    65535,
  ]),
);

// 9. Corrupt PNG (bad CRC in IDAT)
writeFileSync(join(outDir, "corrupt-bad-crc.png"), makeCorruptPng());

// 10. Truncated PNG (only header, no data)
writeFileSync(join(outDir, "truncated.png"), makeTruncatedPng());

// 11. Non-PNG file disguised as PNG
writeFileSync(
  join(outDir, "fake-png.txt"),
  Buffer.from("this is definitely not a png file"),
);

// 12. All-black fully opaque
writeFileSync(
  join(outDir, "all-black-opaque.png"),
  makePng(64, 64, () => [0, 0, 0, 255]),
);

// 13. All-white fully opaque
writeFileSync(
  join(outDir, "all-white-opaque.png"),
  makePng(64, 64, () => [255, 255, 255, 255]),
);

// 14. All-transparent
writeFileSync(
  join(outDir, "all-transparent.png"),
  makePng(64, 64, () => [0, 0, 0, 0]),
);

// 15. Semi-transparent gradient (alpha 0→255 across width)
writeFileSync(
  join(outDir, "alpha-gradient.png"),
  makePng(128, 64, (x, y) => [
    0,
    100,
    255,
    Math.floor((x / 128) * 255),
  ]),
);

// 16. Noise pattern (random-ish pixels)
writeFileSync(
  join(outDir, "noise-pattern.png"),
  makePng(100, 100, (x, y) => {
    const v = ((x * 7919 + y * 104729) % 256);
    return [v, (v * 3) % 256, (v * 7) % 256, 255];
  }),
);

// 17. Minimal size: 2×2 with extreme colors
writeFileSync(
  join(outDir, "2x2-extreme.png"),
  makePng(2, 2, (x, y) => {
    if (x === 0 && y === 0) return [0, 0, 0, 255];
    if (x === 1 && y === 0) return [255, 255, 255, 255];
    if (x === 0 && y === 1) return [255, 0, 0, 128];
    return [0, 0, 255, 0];
  }),
);

// 18. Long strip (1×4000) — tests scroll / vertical tools
writeFileSync(
  join(outDir, "1x4000-strip.png"),
  makePng(1, 4000, (x, y) => [y % 256, (y * 2) % 256, (y * 3) % 256, 255]),
);

// 19. Wide strip (4000×1) — tests horizontal handling
writeFileSync(
  join(outDir, "4000x1-strip.png"),
  makePng(4000, 1, (x, y) => [x % 256, (x * 2) % 256, (x * 3) % 256, 255]),
);

// 20. PNG with very high alpha variance (sparse transparency)
writeFileSync(
  join(outDir, "sparse-alpha.png"),
  makePng(100, 100, (x, y) => {
    const sparse = ((x * 31 + y * 17) % 100) < 10;
    return [sparse ? 0 : 100, sparse ? 0 : 200, 255, sparse ? 0 : 255];
  }),
);

console.log("Generated 20 edge case PNG files in:", outDir);
