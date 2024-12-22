export function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className='rounded-lg bg-background p-6 text-center'>
      <div className='mb-4 flex justify-center'>{icon}</div>
      <h4 className='mb-2 text-xl font-semibold text-primary'>{title}</h4>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  );
}
