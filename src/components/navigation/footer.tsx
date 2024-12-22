export function Footer() {
  return (
    <footer className='bg-primary text-primary-foreground py-8'>
      <div className='container mx-auto px-4 text-center'>
        <p>&copy; {new Date().getFullYear()} Tinderhaj. All rights reserved.</p>
        <p className='mt-2'>Blåhaj is a trademark of IKEA. Tinderhaj is not affiliated with IKEA.</p>
      </div>
    </footer>
  );
}
