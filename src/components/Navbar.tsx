'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { LuUser } from 'react-icons/lu';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useUser } from '@/context/user-context';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logoutUser } = useUser();

  const isHome = pathname === '/';
  const useSolidNav = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    handleScroll();

    return () => {
      setIsMenuOpen(false);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/ventas', label: 'Ventas' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const userLinks = [
    { label: 'Mi perfil', className: "hover:bg-accent",action: () => router.push('/usuario/perfil') },
    { label: 'Crear propiedad', className: "hover:bg-accent", action: () => router.push('/propiedades/crear') },
    { label: 'Cerrar sesión', className: "hover:bg-red", action: () => logoutUser() },
  ];

  return (
    <nav
      className={`fixed top-0 w-full transition-all duration-300 z-50 flex items-center justify-between px-6 md:px-16 ${
        useSolidNav ? 'bg-nav py-2 shadow-md' : 'bg-transparent py-6'
      }`}
    >
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={() => router.push('/')}
          className="cursor-pointer bg-transparent border-none p-0"
          aria-label="Go to home"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className={`transition-all duration-300 ${
              useSolidNav ? 'h-14' : 'h-16'
            }`}
          />
        </button>
      </div>

      {/* Menú móvil hamburguesa */}
      <div className="md:hidden">
        <button
          className="text-white text-3xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Links comunes + botón de usuario */}
      <div
        className={`absolute top-full right-0 w-full md:w-auto text-white flex flex-col md:flex-row items-end text-right gap-4 p-4 transition-all duration-300
          md:static md:items-center md:gap-4 md:p-0 md:bg-transparent
          ${
            isMenuOpen
              ? `${useSolidNav ? 'bg-nav' : 'bg-transparent'} opacity-100 visible`
              : 'opacity-0 invisible md:opacity-100 md:visible'
          }`}
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`font-semibold text-white hover:underline transition-all duration-300 flex items-center gap-2 ${
              useSolidNav ? 'text-sm' : 'text-base'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            {label}
          </Link>
        ))}

        {/* Botón con ícono de usuario */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                router.push('/login') // Redirige directo si no está logueado
                return
              }
              setShowUserMenu((prev) => !prev) // Abre/cierra el dropdown si está logueado
            }}
            className={`font-semibold text-white flex items-center gap-2 cursor-pointer hover:underline${
              useSolidNav ? 'text-sm' : 'text-base'
            }`}
          >
            <LuUser className="w-5 h-5" />
            {isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}
            {isAuthenticated ? showUserMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />: null}
          </button>

          {/* Dropdown debajo del navbar */}
          {showUserMenu && (
            <div className={`absolute mt-2 rounded-md w-48 py-2 
              ${useSolidNav ? 'bg-nav' : ''}`}>
              {isAuthenticated ? (
                userLinks.map(({ label, className, action }) => (
                  <button
                    key={label}
                    onClick={() => {
                      action();
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${className}`}
                  >
                    {label}
                  </button>
                ))
              ) : (
                <button
                  onClick={() => {
                    router.push('/login');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-gray-100"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
