
const tsConfig = require('./tsconfig.json');
const tsconfigPaths = require('tsconfig-paths');

let { outDir, paths } = tsConfig.compilerOptions;

// Replacing "src" by "dist" in paths map
/*for (let key in paths) {
    paths[key] = paths[key].map((p) => p.replace("src", "dist"));
}*/

tsconfigPaths.register({
    baseUrl: outDir,
    paths: paths,
});