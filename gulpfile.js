const path = require("path");
const gulp = require("gulp");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const screeps = require("gulp-screeps");
const tslint = require("gulp-tslint");
const del = require("del");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const args = require("yargs").argv;

const tsProject = ts.createProject("tsconfig.json");
if (args.minify) { // uglify doesn't support es6 syntax.
    tsProject.options.target = "es5";
}
const destPath = path.join(process.env.LOCALAPPDATA, "/Screeps/scripts/screeps.com/default");
const destSrc = path.join(destPath, "/**/*");
let upload = false;

const cleanFn = () => {
    return del(destSrc, {
        force: true
    });
};

const moveFn = () => {
    let stream = tsProject.src().pipe(tsProject()).js.pipe(rename((path) => {
        const parts = path.dirname.match(/[^/\\]+/g);
        let name = "";
        for (const part of parts) {
            if (!~part.indexOf(".")) {
                name += `${part}_`;
            }
        }
        path.basename = name + path.basename;
        path.dirname = "";
    })).pipe(replace(/require\(\"([a-z1-9]+\/)*/g, (match) => {
        return match.replace(/\//g, "_").replace("._", "");
    })).pipe(replace(/(.+require\(\"lodash\"\).+)/g, () => {
        return ""; // Remove lodash require statements, since it's global by default.
    })).pipe(replace(/lodash\_\d+/g, () => {
        return "_" //  Replace generated lodash aliases with global object name.
    })).pipe(replace(/Object\.defineProperty\(exports\, \"__esModule\", \{ value\: true \}\)\;/g, () => {
        return ""; // Replace unnecesary es6 module emit.
    })); 
    
    if (args.minify) {
        stream = stream.pipe(uglify()).on("error", console.log);
    }
    stream.pipe(gulp.dest(destPath));
    if (upload) {
        stream.pipe(screeps({
            token: "42286d10-b736-4d4f-ab60-d4def2b0e739",
            branch: "default",
            ptr: false
        }));
    }
    return stream;
};

const compileFn = () => {
    gulp.src([
        path.join(__dirname, "./node_modules/screeps-profiler/screeps-profiler.js")
    ]).pipe(gulp.dest(destPath));
    return del(path.join(destPath, "/interfaces_*"), {
        force: true
    });
};

const watchFn = () => {
    upload = !!args.upload;
    gulp.watch("src/**/*.ts", ["compile"]);
};

const tslintFn = () => {
    return gulp.src(["**/*.ts", "!**/*.d.ts", "!node_modules/**"])
        .pipe(tslint({
        formatter: "prose"
        }))
        .pipe(tslint.report({
        summarizeFailureOutput: true
    }));
};

const compile = gulp.series(cleanFn, moveFn, compileFn);
const watch = gulp.series(watchFn, compile);

module.exports = { compile, watch };