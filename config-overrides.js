const webpack = require("webpack");

const {
  override,
  fixBabelImports,
  useBabelRc,
  addWebpackResolve,
  addWebpackPlugin,
} = require("customize-cra");

const LESS_OPTIONS = {
  javascriptEnabled: true,
  modifyVars: {
    "@primary-color": "#261BC9",
    "disabled-color": "#595959",
  },
};

// customize-cra 의 addLessLoader 는 postcss-loader 4 API(options.plugins)를 쓰기 때문에
// CRA 5(postcss-loader 6)에서 ValidationError 로 죽는다.
// 그래서 CRA 가 이미 만들어 둔 sass 규칙을 복제해 sass-loader 만 less-loader 로 바꿔 끼운다.
// 이렇게 하면 css-loader / postcss-loader 설정을 CRA 버전에 맞게 그대로 물려받는다.
const addLessRule = () => (config) => {
  const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf));
  if (!oneOfRule) throw new Error("config-overrides: oneOf 규칙을 찾을 수 없습니다.");

  const { oneOf } = oneOfRule;
  const sassRule = oneOf.find(
    (rule) =>
      rule.test &&
      String(rule.test).includes("scss") &&
      !String(rule.test).includes("module")
  );
  if (!sassRule) throw new Error("config-overrides: sass 규칙을 찾을 수 없습니다.");

  const use = sassRule.use
    // resolve-url-loader 는 sass 전용이므로 less 파이프라인에서는 제외한다.
    .filter((entry) => {
      const loader = typeof entry === "string" ? entry : entry.loader;
      return !(loader && loader.includes("resolve-url-loader"));
    })
    .map((entry) => {
      const loader = typeof entry === "string" ? entry : entry.loader;
      if (loader && loader.includes("sass-loader")) {
        return {
          loader: require.resolve("less-loader"),
          options: { sourceMap: true, lessOptions: LESS_OPTIONS },
        };
      }
      return entry;
    });

  const lessRule = {
    ...sassRule,
    test: /\.less$/,
    exclude: /\.module\.less$/,
    use,
  };

  // 마지막 catch-all(asset/resource) 규칙보다 앞에 넣어야 less 가 잡힌다.
  oneOf.splice(oneOf.length - 1, 0, lessRule);
  return config;
};

// web3 의 배포본(web3.min.js)이 원본 .ts 를 가리키는 소스맵을 담고 있어
// source-map-loader 가 파일마다 경고를 낸다(빌드 144건). 기능 영향은 없다.
const ignoreSourceMapWarnings = () => (config) => {
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    /Failed to parse source map/,
  ];
  return config;
};

// @wagmi/core 의 Tempo Wallet 커넥터(사용하지 않음)가 옵셔널 피어인 "accounts"
// 패키지를 동적 import() 한다. Turbopack 전용 매직 코멘트(turbopackOptional)로
// 표시돼 있어 webpack 은 이를 인식하지 못하고 빌드 실패로 처리한다.
// 실제로 호출되지 않는 경로이므로 이 모듈만 빈 모듈로 대체한다.
const ignoreOptionalTempoWalletDep = () => (config) => {
  config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^accounts$/ }));
  return config;
};

module.exports = override(
  useBabelRc(),
  ignoreSourceMapWarnings(),
  ignoreOptionalTempoWalletDep(),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessRule(),
  // webpack 5 는 Node 코어 모듈을 자동 폴리필하지 않는다.
  // web3 1.x 가 crypto/stream/http 등을 사용하므로 명시적으로 지정한다.
  addWebpackResolve({
    fallback: {
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify"),
      url: require.resolve("url"),
      zlib: require.resolve("browserify-zlib"),
    },
  }),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      // "process/browser"(확장자 없는 bare specifier)로 주입하면, 이를 참조하는
      // 모듈이 strict ESM(예: @reown/appkit-wallet)일 때 웹팩이 ESM 스펙대로
      // 확장자 필수 해석을 적용해 실패한다. require.resolve 로 얻은 절대경로를
      // 쓰면 확장자가 이미 포함돼 있어 문제가 없다.
      process: require.resolve("process/browser"),
    })
  )
);
