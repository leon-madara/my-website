const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

describe("mobile bottom nav acrylic treatment", () => {
  test("React mobile dock uses a translucent acrylic card", () => {
    const css = readProjectFile("app/src/shared/MobileDock.css");

    expect(css).toMatch(/--mdock-card-bg:\s*rgba\(255,\s*255,\s*255,\s*0\.42\)/);
    expect(css).toMatch(/--mdock-card-bg:\s*rgba\(18,\s*21,\s*27,\s*0\.42\)/);
    expect(css).toMatch(/backdrop-filter:\s*blur\(28px\)\s*saturate\(180%\)/);
    expect(css).toMatch(/-webkit-backdrop-filter:\s*blur\(28px\)\s*saturate\(180%\)/);
  });

  test("static mobile nav keeps the same acrylic material", () => {
    const css = readProjectFile("public/css/liquid-nav.css");

    expect(css).toMatch(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.42\)/);
    expect(css).toMatch(/background:\s*rgba\(18,\s*21,\s*27,\s*0\.42\)/);
    expect(css).toMatch(/backdrop-filter:\s*blur\(28px\)\s*saturate\(180%\)/);
    expect(css).toMatch(/-webkit-backdrop-filter:\s*blur\(28px\)\s*saturate\(180%\)/);
  });
});
