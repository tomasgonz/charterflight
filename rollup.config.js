import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';

export default {
  entry: 'src/linechart.js',
  format: 'umd',
  moduleName: "charterflight",
  plugins: [
    resolve(),
    postcss({
      plugins: [
        // cssnext(),
        // yourPostcssPlugin()
      ],
      //sourceMap: false, // default value
      //extract: false, // default value
      extensions: ['.css', '.sss'],  // default value
      // parser: sugarss
      sourcemap: true//,
      //extract: 'dist/charterflight.css'
  })
 ],
  dest: 'dist/charterflight.js', // equivalent to --output
  sourceMap: true
};
