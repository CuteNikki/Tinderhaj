export function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className='rounded-lg bg-card p-8 text-center text-card-foreground'>
      <div className='mb-2 flex justify-center'>{icon}</div>
      <h4 className='font-semibold'>{title}</h4>
      <p className='text-pretty text-muted-foreground'>{description}</p>
    </div>
  );
}
