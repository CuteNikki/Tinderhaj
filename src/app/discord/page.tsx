'use client';

import { ArrowRight, Bot, Clock, Github, Linkedin, Menu, MessageSquare, Settings, Shield, Star, Twitter, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DiscordBotHero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
        <div className='container mx-auto flex h-16 items-center px-4 md:px-8'>
          <div className='mr-4 flex items-center gap-2'>
            <Bot className='text-primary h-6 w-6' />
            <span className='text-lg font-bold'>BotMaster</span>
          </div>
          <nav className='hidden flex-1 items-center gap-6 text-sm font-medium md:flex'>
            <Link href='#' className='hover:text-foreground/80 text-foreground/60 transition-colors'>
              Features
            </Link>
            <Link href='#' className='hover:text-foreground/80 text-foreground/60 transition-colors'>
              Testimonials
            </Link>
            <Link href='#' className='hover:text-foreground/80 text-foreground/60 transition-colors'>
              Documentation
            </Link>
            <Link href='#' className='hover:text-foreground/80 text-foreground/60 transition-colors'>
              Pricing
            </Link>
            <Link href='#' className='hover:text-foreground/80 text-foreground/60 transition-colors'>
              Blog
            </Link>
          </nav>
          <div className='ml-auto hidden items-center gap-4 md:flex'>
            <Button variant='ghost' size='sm'>
              Log in
            </Button>
            <Button size='sm'>Add to Discord</Button>
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className='ml-auto md:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[80%] sm:w-[350px]'>
              <SheetHeader>
                <SheetTitle className='mb-6 flex items-center gap-2'>
                  <Bot className='text-primary h-6 w-6' />
                  <span className='text-lg font-bold'>BotMaster</span>
                </SheetTitle>
                <nav className='flex flex-col gap-4'>
                  <Link href='#' className='text-foreground/60 hover:text-foreground/80 transition-colors' onClick={() => setIsMenuOpen(false)}>
                    Features
                  </Link>
                  <Link href='#' className='text-foreground/60 hover:text-foreground/80 transition-colors' onClick={() => setIsMenuOpen(false)}>
                    Testimonials
                  </Link>
                  <Link href='#' className='text-foreground/60 hover:text-foreground/80 transition-colors' onClick={() => setIsMenuOpen(false)}>
                    Documentation
                  </Link>
                  <Link href='#' className='text-foreground/60 hover:text-foreground/80 transition-colors' onClick={() => setIsMenuOpen(false)}>
                    Pricing
                  </Link>
                  <Link href='#' className='text-foreground/60 hover:text-foreground/80 transition-colors' onClick={() => setIsMenuOpen(false)}>
                    Blog
                  </Link>
                </nav>
              </SheetHeader>
              <SheetFooter className='mt-6 flex flex-col gap-2'>
                <Button variant='outline' className='w-full' onClick={() => setIsMenuOpen(false)}>
                  Log in
                </Button>
                <Button className='w-full' onClick={() => setIsMenuOpen(false)}>
                  Add to Discord
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className='bg-background w-full py-12 md:py-24 lg:py-32'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-4'>
              <Badge variant='secondary'>Introducing BotMaster</Badge>
              <h1 className='text-foreground text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>The ultimate Discord bot for your community</h1>
              <p className='text-muted-foreground max-w-md text-lg md:text-xl'>
                Moderate, engage, and grow your Discord server with powerful automation and customizable features.
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button size='lg'>
                  Add to Discord
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
                <Button size='lg' variant='outline'>
                  View Features
                </Button>
              </div>
              <div className='flex items-center gap-6 pt-4'>
                <div className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  <span className='text-muted-foreground text-sm'>Trusted by 10k+ servers</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Zap className='h-5 w-5' />
                  <span className='text-muted-foreground text-sm'>99.9% uptime</span>
                </div>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <div className='flex items-center gap-3'>
                    <Bot className='text-primary h-8 w-8' />
                    <div>
                      <CardTitle>BotMaster Dashboard</CardTitle>
                      <CardDescription>{"Your server's new best friend"}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-3'>
                      <Card className='p-4'>
                        <div className='flex flex-col items-center text-center'>
                          <Shield className='text-primary mb-2 h-8 w-8' />
                          <h3 className='font-medium'>Moderation</h3>
                          <p className='text-muted-foreground text-xs'>Auto-mod, warnings, bans</p>
                        </div>
                      </Card>
                      <Card className='p-4'>
                        <div className='flex flex-col items-center text-center'>
                          <Zap className='mb-2 h-8 w-8' />
                          <h3 className='font-medium'>Automation</h3>
                          <p className='text-muted-foreground text-xs'>Custom commands & workflows</p>
                        </div>
                      </Card>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <Card className='p-4'>
                        <div className='flex flex-col items-center text-center'>
                          <Clock className='mb-2 h-8 w-8' />
                          <h3 className='font-medium'>Scheduling</h3>
                          <p className='text-muted-foreground text-xs'>Events & reminders</p>
                        </div>
                      </Card>
                      <Card className='p-4'>
                        <div className='flex flex-col items-center text-center'>
                          <Settings className='mb-2 h-8 w-8' />
                          <h3 className='font-medium'>Integrations</h3>
                          <p className='text-muted-foreground text-xs'>Connect with other services</p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='border-t pt-4'>
                  <p className='text-muted-foreground text-sm'>
                    <span className='font-medium'>Quick setup:</span> Add to your server in just 2 minutes
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-muted/50 w-full py-12 md:py-24'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='mx-auto mb-12 max-w-3xl text-center'>
            <h2 className='mb-4 text-3xl font-bold tracking-tight md:text-4xl'>Powerful features for your Discord community</h2>
            <p className='text-muted-foreground text-lg'>BotMaster comes packed with everything you need to run a successful Discord server</p>
          </div>

          <Tabs defaultValue='moderation' className='mx-auto w-full max-w-4xl'>
            <TabsList className='mb-8 grid grid-cols-4'>
              <TabsTrigger value='moderation'>Moderation</TabsTrigger>
              <TabsTrigger value='engagement'>Engagement</TabsTrigger>
              <TabsTrigger value='automation'>Automation</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value='moderation' className='bg-background rounded-lg border p-6'>
              <div className='grid items-center gap-8 md:grid-cols-2'>
                <div>
                  <h3 className='mb-4 text-2xl font-bold'>Keep your server safe and friendly</h3>
                  <div className='space-y-4'>
                    <div className='flex gap-3'>
                      <Shield className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Auto-moderation</h4>
                        <p className='text-muted-foreground text-sm'>Filter spam, inappropriate content, and unwanted links automatically</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <Shield className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Warning system</h4>
                        <p className='text-muted-foreground text-sm'>Issue warnings to users with escalating consequences</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <Shield className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Raid protection</h4>
                        <p className='text-muted-foreground text-sm'>Detect and prevent server raids before they happen</p>
                      </div>
                    </div>
                  </div>
                  <Button className='mt-6'>Learn more</Button>
                </div>
                <Card>
                  <CardContent className='overflow-hidden p-0'>
                    <div className='p-6'>
                      <div className='mb-4 flex items-center gap-2'>
                        <Shield className='text-primary h-5 w-5' />
                        <h4 className='font-medium'>Auto-Mod Log</h4>
                      </div>
                      <div className='space-y-3'>
                        <div className='bg-background rounded p-3 text-sm'>
                          <p className='text-muted-foreground mb-1 text-xs'>Today at 2:45 PM</p>
                          <p>
                            <span className='font-medium'>Auto-Mod</span> removed a message containing prohibited content
                          </p>
                        </div>
                        <div className='bg-background rounded p-3 text-sm'>
                          <p className='text-muted-foreground mb-1 text-xs'>Today at 1:30 PM</p>
                          <p>
                            <span className='font-medium'>Auto-Mod</span> issued a warning to User#1234 for spam
                          </p>
                        </div>
                        <div className='bg-background rounded p-3 text-sm'>
                          <p className='text-muted-foreground mb-1 text-xs'>Today at 12:15 PM</p>
                          <p>
                            <span className='font-medium'>Auto-Mod</span> muted User#5678 for 10 minutes
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='engagement' className='bg-background rounded-lg border p-6'>
              <div className='grid items-center gap-8 md:grid-cols-2'>
                <div>
                  <h3 className='mb-4 text-2xl font-bold'>Keep your community active and engaged</h3>
                  <div className='space-y-4'>
                    <div className='flex gap-3'>
                      <MessageSquare className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Custom welcome messages</h4>
                        <p className='text-muted-foreground text-sm'>Greet new members with personalized messages</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <MessageSquare className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Interactive games</h4>
                        <p className='text-muted-foreground text-sm'>Keep members engaged with fun mini-games</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <MessageSquare className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Role management</h4>
                        <p className='text-muted-foreground text-sm'>Let users self-assign roles with reactions</p>
                      </div>
                    </div>
                  </div>
                  <Button className='mt-6'>Learn more</Button>
                </div>
                <Card>
                  <CardContent className='p-6'>
                    <div className='space-y-4'>
                      <div className='bg-muted flex items-center gap-3 rounded-lg p-3'>
                        <Users className='text-primary bg-primary/10 h-10 w-10 rounded-full p-2' />
                        <div>
                          <p className='font-medium'>New member joined!</p>
                          <p className='text-muted-foreground text-sm'>Welcome User#1234 to the server!</p>
                        </div>
                      </div>
                      <div className='rounded-lg border p-4'>
                        <h4 className='mb-2 font-medium'>Active Polls</h4>
                        <div className='space-y-2'>
                          <div className='bg-muted rounded p-2 text-sm'>
                            <p className='font-medium'>What game should we play next?</p>
                            <div className='text-muted-foreground mt-1 text-xs'>
                              <p>🎮 Minecraft: 45%</p>
                              <p>🚀 Among Us: 30%</p>
                              <p>🏆 Valorant: 25%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='automation' className='bg-background rounded-lg border p-6'>
              <div className='grid items-center gap-8 md:grid-cols-2'>
                <div>
                  <h3 className='mb-4 text-2xl font-bold'>Save time with powerful automation</h3>
                  <div className='space-y-4'>
                    <div className='flex gap-3'>
                      <Zap className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Custom commands</h4>
                        <p className='text-muted-foreground text-sm'>Create your own commands with custom responses</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <Zap className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Scheduled messages</h4>
                        <p className='text-muted-foreground text-sm'>Set up recurring announcements and reminders</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <Zap className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <div>
                        <h4 className='font-medium'>Reaction roles</h4>
                        <p className='text-muted-foreground text-sm'>Automate role assignment with reactions</p>
                      </div>
                    </div>
                  </div>
                  <Button className='mt-6'>Learn more</Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Workflows</CardTitle>
                    <CardDescription>Create custom workflows without coding</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='rounded-lg border p-3'>
                        <div className='flex items-center justify-between'>
                          <p className='font-medium'>Weekly Game Night</p>
                          <Badge>Active</Badge>
                        </div>
                        <p className='text-muted-foreground mt-1 text-xs'>Posts announcement every Friday at 5 PM</p>
                      </div>
                      <div className='rounded-lg border p-3'>
                        <div className='flex items-center justify-between'>
                          <p className='font-medium'>New Member Welcome</p>
                          <Badge>Active</Badge>
                        </div>
                        <p className='text-muted-foreground mt-1 text-xs'>Sends welcome DM and assigns Newcomer role</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value='analytics' className='bg-background rounded-lg border p-6'>
              <div className='grid items-center gap-8 md:grid-cols-2'>
                <div>
                  <h3 className='mb-4 text-2xl font-bold'>Understand your community with analytics</h3>
                  <div className='space-y-4'>
                    <div className='flex gap-3'>
                      <svg className='text-primary mt-0.5 h-5 w-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M21 21H3V3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        <path d='M21 9L15 3L9 9L3 15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                      <div>
                        <h4 className='font-medium'>Activity tracking</h4>
                        <p className='text-muted-foreground text-sm'>Monitor server activity and engagement</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <svg className='text-primary mt-0.5 h-5 w-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M21 21H3V3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        <path d='M21 9L15 3L9 9L3 15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                      <div>
                        <h4 className='font-medium'>Member insights</h4>
                        <p className='text-muted-foreground text-sm'>Track growth and member retention</p>
                      </div>
                    </div>
                    <div className='flex gap-3'>
                      <svg className='text-primary mt-0.5 h-5 w-5 shrink-0' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M21 21H3V3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                        <path d='M21 9L15 3L9 9L3 15' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                      </svg>
                      <div>
                        <h4 className='font-medium'>Command usage</h4>
                        <p className='text-muted-foreground text-sm'>See which features are most popular</p>
                      </div>
                    </div>
                  </div>
                  <Button className='mt-6'>Learn more</Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Server Analytics</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <Card className='p-4'>
                          <p className='text-muted-foreground text-sm'>New Members</p>
                          <p className='text-2xl font-bold'>+124</p>
                          <p className='text-xs text-green-500'>↑ 12% from last month</p>
                        </Card>
                        <Card className='p-4'>
                          <p className='text-muted-foreground text-sm'>Active Users</p>
                          <p className='text-2xl font-bold'>432</p>
                          <p className='text-xs text-green-500'>↑ 8% from last month</p>
                        </Card>
                      </div>
                      <div className='bg-muted flex h-32 items-end justify-between rounded-lg p-2'>
                        <div className='bg-primary h-[20%] w-8 rounded-t'></div>
                        <div className='bg-primary h-[40%] w-8 rounded-t'></div>
                        <div className='bg-primary h-[30%] w-8 rounded-t'></div>
                        <div className='bg-primary h-[60%] w-8 rounded-t'></div>
                        <div className='bg-primary h-[80%] w-8 rounded-t'></div>
                        <div className='bg-primary h-[50%] w-8 rounded-t'></div>
                        <div className='bg-primary h-[70%] w-8 rounded-t'></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className='bg-background w-full border-t py-12 md:py-24'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='mx-auto mb-12 max-w-3xl text-center'>
            <h2 className='mb-4 text-3xl font-bold tracking-tight md:text-4xl'>Trusted by Discord communities worldwide</h2>
            <p className='text-muted-foreground text-lg'>Join thousands of servers already using BotMaster to enhance their Discord experience</p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
            <Card className='relative overflow-hidden'>
              <div className='absolute top-4 right-4'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='fill-primary text-primary h-4 w-4' />
                  ))}
                </div>
              </div>
              <CardContent className='pt-12 pb-8'>
                <p className='text-muted-foreground mb-6 italic'>
                  {
                    '"BotMaster has completely transformed how we manage our gaming community. The moderation tools alone have saved us countless hours of work."'
                  }
                </p>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarFallback>GS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>GameSquad</p>
                    <p className='text-muted-foreground text-sm'>5,000+ members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden'>
              <div className='absolute top-4 right-4'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='fill-primary text-primary h-4 w-4' />
                  ))}
                </div>
              </div>
              <CardContent className='pt-12 pb-8'>
                <p className='text-muted-foreground mb-6 italic'>
                  {
                    '"The custom commands and automation workflows have made our server so much more interactive. Our members love the polls and game night reminders!"'
                  }
                </p>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>TechConnect</p>
                    <p className='text-muted-foreground text-sm'>12,000+ members</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='relative overflow-hidden'>
              <div className='absolute top-4 right-4'>
                <div className='flex'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='fill-primary text-primary h-4 w-4' />
                  ))}
                </div>
              </div>
              <CardContent className='pt-12 pb-8'>
                <p className='text-muted-foreground mb-6 italic'>
                  {
                    '"As a community manager, the analytics have been invaluable. I can now make data-driven decisions about our events and content based on what our members engage with most."'
                  }
                </p>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>ArtistCollective</p>
                    <p className='text-muted-foreground text-sm'>8,000+ members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-2 gap-8 border-y py-8 md:grid-cols-4'>
            <div className='text-center'>
              <p className='text-primary text-3xl font-bold md:text-4xl'>10k+</p>
              <p className='text-muted-foreground mt-1 text-sm'>Servers</p>
            </div>
            <div className='text-center'>
              <p className='text-primary text-3xl font-bold md:text-4xl'>2M+</p>
              <p className='text-muted-foreground mt-1 text-sm'>Users</p>
            </div>
            <div className='text-center'>
              <p className='text-primary text-3xl font-bold md:text-4xl'>50M+</p>
              <p className='text-muted-foreground mt-1 text-sm'>Commands Used</p>
            </div>
            <div className='text-center'>
              <p className='text-primary text-3xl font-bold md:text-4xl'>99.9%</p>
              <p className='text-muted-foreground mt-1 text-sm'>Uptime</p>
            </div>
          </div>

          <div className='mt-12 text-center'>
            <h3 className='mb-6 text-2xl font-bold'>Ready to transform your Discord server?</h3>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button size='lg'>
                Add to Discord
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
              <Button size='lg' variant='outline'>
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className='bg-muted w-full py-12 md:py-16'>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Bot className='text-primary h-6 w-6' />
                <span className='text-lg font-bold'>BotMaster</span>
              </div>
              <p className='text-muted-foreground text-sm'>The ultimate Discord bot for community management, moderation, and engagement.</p>
              <div className='flex space-x-4'>
                <Link href='#' className='text-muted-foreground hover:text-primary'>
                  <Twitter className='h-5 w-5' />
                  <span className='sr-only'>Twitter</span>
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-primary'>
                  <Github className='h-5 w-5' />
                  <span className='sr-only'>GitHub</span>
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-primary'>
                  <Linkedin className='h-5 w-5' />
                  <span className='sr-only'>LinkedIn</span>
                </Link>
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='font-medium'>Product</h3>
              <nav className='flex flex-col space-y-2 text-sm'>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Features
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Pricing
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Documentation
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Changelog
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Integrations
                </Link>
              </nav>
            </div>

            <div className='space-y-4'>
              <h3 className='font-medium'>Resources</h3>
              <nav className='flex flex-col space-y-2 text-sm'>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Blog
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Community
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Support
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Status
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Discord Server
                </Link>
              </nav>
            </div>

            <div className='space-y-4'>
              <h3 className='font-medium'>Company</h3>
              <nav className='flex flex-col space-y-2 text-sm'>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  About
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Careers
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Privacy Policy
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Terms of Service
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground'>
                  Contact
                </Link>
              </nav>
            </div>
          </div>

          <div className='border-t pt-8'>
            <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
              <p className='text-muted-foreground text-sm'>© 2025 BotMaster. All rights reserved.</p>
              <div className='flex items-center gap-4'>
                <Link href='#' className='text-muted-foreground hover:text-foreground text-sm'>
                  Privacy
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground text-sm'>
                  Terms
                </Link>
                <Link href='#' className='text-muted-foreground hover:text-foreground text-sm'>
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
