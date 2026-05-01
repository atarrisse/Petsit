const fs = require("node:fs");
const path = require("node:path");

function slugify(input) {
  const base = String(input ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const slug = base
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

  return slug || "dog";
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("isArray", (value) => Array.isArray(value));
  eleventyConfig.addPassthroughCopy({ styles: "styles" });

  const rawPrefix = process.env.ELEVENTY_PATH_PREFIX;
  const pathPrefix =
    rawPrefix && rawPrefix !== "/"
      ? `/${String(rawPrefix).replace(/^\/+|\/+$/g, "")}/`
      : "/";

  eleventyConfig.addCollection("dogs", function () {
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) return [];

    const files = fs
      .readdirSync(dataDir, { withFileTypes: true })
      .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".json"))
      .map((d) => d.name);

    const dogs = [];

    for (const filename of files) {
      const fullPath = path.join(dataDir, filename);
      const raw = fs.readFileSync(fullPath, "utf8");

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        throw new Error(`Invalid JSON in data/${filename}: ${e.message}`);
      }

      const nameFromFile = path.basename(filename, path.extname(filename));
      const name = parsed?.name || nameFromFile;
      const slug = slugify(parsed?.slug || name);

      dogs.push({
        ...parsed,
        name,
        slug,
        url: `/dogs/${slug}/`,
        _sourceFile: filename
      });
    }

    dogs.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return dogs;
  });

  return {
    pathPrefix,
    dir: {
      input: "templates",
      includes: "partials",
      data: "../data",
      output: "_site"
    }
  };
};

