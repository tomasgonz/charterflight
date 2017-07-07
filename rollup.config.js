import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/linechart.js',
  format: 'umd',
  moduleName: "charterflight",
  plugins: [
   resolve()
 ],
  dest: 'dist/charterflight.js', // equivalent to --output
  sourceMap: false,
  plugins: [resolve({ jsnext: true, main: true })]
};
