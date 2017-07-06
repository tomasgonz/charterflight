import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [
   resolve()
 ],
  dest: 'dist/charterflight.js', // equivalent to --output
  sourceMap: false,
  plugins: [resolve({ jsnext: true, main: true })]
};
