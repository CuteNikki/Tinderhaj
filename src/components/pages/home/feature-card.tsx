export function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className='bg-background p-6 rounded-lg text-center'>
      <div className='mb-4 flex justify-center'>{icon}</div>
      <h4 className='text-xl font-semibold mb-2 text-primary'>{title}</h4>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
