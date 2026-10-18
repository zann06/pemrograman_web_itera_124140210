/**
 * Navbar - navigasi utama aplikasi.
 *
 * Reusable: menerima daftar tautan sebagai prop sehingga tidak terikat pada
 * struktur rute tertentu. Memakai `NavLink` dari React Router supaya React
 * yang menandai tautan aktif secara otomatis lewat class `aktif`.
 */

import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

function Navbar({ tautan }) {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo" aria-hidden="true">
            B
          </span>
          <span className="navbar-judul">
            Manajemen<span className="navbar-judul-tebal">Buku</span>
          </span>
        </Link>

        {/* NavLink otomatis menambah className "aktif" pada rute yang sedang dibuka */}
        <nav className="navbar-nav" aria-label="Navigasi utama">
          {tautan.map((t) => (
            <NavLink
              key={t.ke}
              to={t.ke}
              end={t.akhir}
              // className sebagai fungsi menerima status rute dari React
              // Router, jadi penanda aktif bisa memakai class kita sendiri.
              className={({ isActive }) => `navbar-tautan${isActive ? ' aktif' : ''}`}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  tautan: PropTypes.arrayOf(
    PropTypes.shape({
      ke: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      akhir: PropTypes.bool,
    }),
  ).isRequired,
};

export default Navbar;