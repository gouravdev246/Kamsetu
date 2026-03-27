const Footer = () => {
  const footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer className="w-full border-t border-slate-100 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-7xl mx-auto gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-headline font-black text-slate-900 text-xl">
            Kamsetu
          </div>
          <p className="font-body text-sm text-slate-500">
            © 2025 Kamsetu. The Transparent Guardian.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              className="font-body text-sm text-slate-500 hover:text-blue-600 transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
