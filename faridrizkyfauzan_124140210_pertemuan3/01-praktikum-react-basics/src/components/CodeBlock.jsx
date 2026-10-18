/**
 * CodeBlock - menampilkan potongan kode contoh.
 *
 * `children` ditulis sebagai teks biasa (bukan JSX) supaya bisa memuat
 * karakter `<`, `{`, `}` tanpa perlu escaping.
 */

import PropTypes from 'prop-types';

function CodeBlock({ bahasa = 'jsx', children }) {
  return (
    <div className="code">
      <div className="code-bahasa">{bahasa}</div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

CodeBlock.propTypes = {
  bahasa: PropTypes.string,
  children: PropTypes.string.isRequired,
};

export default CodeBlock;