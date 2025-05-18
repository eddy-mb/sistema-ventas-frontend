export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
      <p>© {currentYear} Ama Wara Tour. Todos los derechos reservados.</p>
    </footer>
  );
}
