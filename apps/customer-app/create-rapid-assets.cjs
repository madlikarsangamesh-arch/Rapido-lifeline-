const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "assets");
fs.mkdirSync(dir, { recursive: true });

const green = "#0B7D43";

function logoSvg(size, background = "none", foreground = "#FFFFFF") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="80" fill="${background}"/>
    <path fill="${foreground}" d="M196 65h120v131h131v120H316v131H196V316H65V196h131z"/>
    <path d="M90 256h100l32-58 57 120 43-75 25 13h75"
      fill="none" stroke="${green}" stroke-width="22"
      stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

async function main() {
  await sharp(Buffer.from(logoSvg(1024, green)))
    .png().toFile(path.join(dir, "icon.png"));

  await sharp(Buffer.from(logoSvg(1024, "none", "#FFFFFF")))
    .png().toFile(path.join(dir, "adaptive-icon.png"));

  await sharp(Buffer.from(logoSvg(64, green)))
    .png().toFile(path.join(dir, "favicon.png"));

  const splash = `<svg xmlns="http://www.w3.org/2000/svg" width="1284" height="2778">
    <rect width="1284" height="2778" fill="${green}"/>
    <g transform="translate(432 900)">
      <path fill="#FFFFFF" d="M196 65h120v131h131v120H316v131H196V316H65V196h131z"/>
      <path d="M90 256h100l32-58 57 120 43-75 25 13h75"
        fill="none" stroke="${green}" stroke-width="22"
        stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="642" y="1430" text-anchor="middle"
      font-family="Arial" font-size="82" font-weight="bold"
      fill="white">Rapid Lifeline</text>
    <text x="642" y="1505" text-anchor="middle"
      font-family="Arial" font-size="34" fill="#E5F5EB">
      Emergency care, connected.
    </text>
  </svg>`;

  await sharp(Buffer.from(splash))
    .png().toFile(path.join(dir, "splash.png"));

  console.log("SUCCESS: All four assets generated.");
  console.log(fs.readdirSync(dir).join("\n"));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
