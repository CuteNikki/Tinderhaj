'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BarChart, Bell, Bot, ChevronDown, LogOut, MessageSquare, Plus, Save, Settings, ShieldAlert, Trash2, Users, X, Zap } from 'lucide-react';
import * as React from 'react';

// Types for our welcome message
interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface Embed {
  id: string;
  title: string;
  description: string;
  color: string;
  fields: EmbedField[];
}

interface WelcomeMessage {
  content: string;
  embeds: Embed[];
}

// Sample guilds data
const guilds = [
  { id: '1', name: 'Gaming Community', icon: 'GC' },
  { id: '2', name: 'Tech Support', icon: 'TS' },
  { id: '3', name: 'Art Collective', icon: 'AC' },
  { id: '4', name: 'Study Group', icon: 'SG' },
  { id: '5', name: 'Movie Club', icon: 'MC' },
];

// Sample user data
const user = {
  displayName: 'Jane Smith',
  username: 'janesmith#1234',
  avatar: '/placeholder-user.jpg',
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [selectedGuild, setSelectedGuild] = React.useState(guilds[0]);
  const [welcomeMessage, setWelcomeMessage] = React.useState<WelcomeMessage>({
    content: "Welcome to the server, {user}! We're glad to have you here.",
    embeds: [
      {
        id: '1',
        title: 'Getting Started',
        description: 'Check out our rules and introduction channels to get started!',
        color: '#5865F2',
        fields: [
          {
            name: 'Rules',
            value: 'Please read our rules in #rules',
            inline: true,
          },
          {
            name: 'Introduction',
            value: 'Introduce yourself in #introductions',
            inline: true,
          },
        ],
      },
    ],
  });

  // Function to add a new embed
  const addEmbed = () => {
    const newEmbed: Embed = {
      id: Date.now().toString(),
      title: '',
      description: '',
      color: '#5865F2',
      fields: [],
    };
    setWelcomeMessage({
      ...welcomeMessage,
      embeds: [...welcomeMessage.embeds, newEmbed],
    });
  };

  // Function to remove an embed
  const removeEmbed = (id: string) => {
    setWelcomeMessage({
      ...welcomeMessage,
      embeds: welcomeMessage.embeds.filter((embed) => embed.id !== id),
    });
  };

  // Function to update an embed
  const updateEmbed = (id: string, updatedEmbed: Partial<Embed>) => {
    setWelcomeMessage({
      ...welcomeMessage,
      embeds: welcomeMessage.embeds.map((embed) => (embed.id === id ? { ...embed, ...updatedEmbed } : embed)),
    });
  };

  // Function to add a field to an embed
  const addField = (embedId: string) => {
    const newField: EmbedField = {
      name: '',
      value: '',
      inline: true,
    };

    setWelcomeMessage({
      ...welcomeMessage,
      embeds: welcomeMessage.embeds.map((embed) => (embed.id === embedId ? { ...embed, fields: [...embed.fields, newField] } : embed)),
    });
  };

  // Function to remove a field from an embed
  const removeField = (embedId: string, fieldIndex: number) => {
    setWelcomeMessage({
      ...welcomeMessage,
      embeds: welcomeMessage.embeds.map((embed) =>
        embed.id === embedId
          ? {
              ...embed,
              fields: embed.fields.filter((_, index) => index !== fieldIndex),
            }
          : embed,
      ),
    });
  };

  // Function to update a field in an embed
  const updateField = (embedId: string, fieldIndex: number, updatedField: Partial<EmbedField>) => {
    setWelcomeMessage({
      ...welcomeMessage,
      embeds: welcomeMessage.embeds.map((embed) =>
        embed.id === embedId
          ? {
              ...embed,
              fields: embed.fields.map((field, index) => (index === fieldIndex ? { ...field, ...updatedField } : field)),
            }
          : embed,
      ),
    });
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Submitting welcome message:', welcomeMessage);
    // Show success message or handle errors
  };

  return (
    <div className='bg-background flex h-screen'>
      {/* Sidebar */}
      <div className={cn('bg-muted/40 flex flex-col border-r transition-all duration-300', sidebarOpen ? 'w-64' : 'w-20')}>
        {/* Guild Selector */}
        <div className='border-b p-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className={cn('w-full justify-start gap-2 px-2', !sidebarOpen && 'justify-center px-0')}>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback>{selectedGuild.icon}</AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className='flex flex-1 flex-col items-start text-left'>
                    <span className='text-sm font-medium'>{selectedGuild.name}</span>
                    <span className='text-muted-foreground text-xs'>Manage server</span>
                  </div>
                )}
                {sidebarOpen && <ChevronDown className='h-4 w-4 opacity-50' />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-56'>
              {guilds.map((guild) => (
                <DropdownMenuItem key={guild.id} onClick={() => setSelectedGuild(guild)} className='gap-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarFallback className='text-xs'>{guild.icon}</AvatarFallback>
                  </Avatar>
                  <span>{guild.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sidebar Toggle */}
        <div className='space-y-2 p-2'>
          <Button variant='ghost' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ChevronDown className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-90')} />
            <span className='sr-only'>Toggle sidebar</span>
            {sidebarOpen && <span>Toggle Sidebar</span>}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className='flex-1'>
          <div className='space-y-2 p-2'>
            {sidebarOpen && (
              <div className='px-2 py-1'>
                <h3 className='text-muted-foreground mb-2 text-xs font-medium'>Server Management</h3>
              </div>
            )}

            <Button variant='ghost' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')}>
              <ShieldAlert className='mr-2 h-4 w-4' />
              {sidebarOpen && <span>Moderation</span>}
            </Button>

            <Button variant='secondary' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')}>
              <Bell className='mr-2 h-4 w-4' />
              {sidebarOpen && <span>Welcome Messages</span>}
            </Button>

            <Button variant='ghost' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')}>
              <Zap className='mr-2 h-4 w-4' />
              {sidebarOpen && <span>Auto Roles</span>}
            </Button>

            <Button variant='ghost' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')}>
              <MessageSquare className='mr-2 h-4 w-4' />
              {sidebarOpen && <span>Custom Commands</span>}
            </Button>

            {sidebarOpen && <Separator className='my-4' />}

            {sidebarOpen && (
              <div className='px-2 py-1'>
                <h3 className='text-muted-foreground mb-2 text-xs font-medium'>Insights</h3>
              </div>
            )}

            <Button variant='ghost' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')}>
              <BarChart className='mr-2 h-4 w-4' />
              {sidebarOpen && <span>Analytics</span>}
            </Button>

            <Button variant='ghost' className={cn('w-full justify-start', !sidebarOpen && 'justify-center px-0')}>
              <Users className='mr-2 h-4 w-4' />
              {sidebarOpen && <span>Member Activity</span>}
            </Button>
          </div>
        </ScrollArea>

        {/* User Menu */}
        <div className='border-t p-4'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className={cn('w-full justify-start gap-2 px-2', !sidebarOpen && 'justify-center px-0')}>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className='flex flex-1 flex-col items-start text-left'>
                    <span className='text-sm font-medium'>{user.displayName}</span>
                    <span className='text-muted-foreground text-xs'>{user.username}</span>
                  </div>
                )}
                {sidebarOpen && <ChevronDown className='h-4 w-4 opacity-50' />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm leading-none font-medium'>{user.displayName}</p>
                  <p className='text-muted-foreground text-xs leading-none'>{user.username}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className='mr-2 h-4 w-4' />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-background flex items-center gap-8 border-b px-6 py-2.5'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-semibold'>Welcome Messages</h1>
            </div>
            <p className='text-muted-foreground text-sm'>Configure welcome messages for new members</p>
          </div>
          <div className='flex items-center gap-2'>
            <Switch id='enabled' defaultChecked />
            <Label htmlFor='enabled'>Enabled</Label>
          </div>
        </header>

        {/* Content */}
        <div className='flex-1 overflow-auto p-6'>
          <form onSubmit={handleSubmit}>
            <div className='space-y-6'>
              {/* Editor and Preview */}
              <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Editor */}
                <div className='space-y-6'>
                  {/* Message Content */}
                  <div>
                    <Label htmlFor='message-content' className='mb-2 block'>
                      Message Content
                    </Label>
                    <Textarea
                      id='message-content'
                      placeholder='Enter your welcome message here...'
                      className='min-h-[100px]'
                      value={welcomeMessage.content}
                      onChange={(e) =>
                        setWelcomeMessage({
                          ...welcomeMessage,
                          content: e.target.value,
                        })
                      }
                    />
                    <p className='text-muted-foreground mt-2 text-xs'>You can use {'{user}'} to mention the new member</p>
                  </div>

                  {/* Embeds */}
                  <div>
                    <div className='mb-4 flex items-center justify-between'>
                      <h3 className='text-lg font-medium'>Embeds</h3>
                      <Button type='button' variant='outline' size='sm' onClick={addEmbed} disabled={welcomeMessage.embeds.length >= 10}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Embed
                      </Button>
                    </div>

                    {welcomeMessage.embeds.length === 0 ? (
                      <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center'>
                        <MessageSquare className='text-muted-foreground mb-4 h-12 w-12' />
                        <h3 className='text-lg font-medium'>No embeds added</h3>
                        <p className='text-muted-foreground mt-2 mb-4 max-w-md text-sm'>
                          Embeds make your welcome message more engaging. Add an embed to include additional information.
                        </p>
                        <Button type='button' onClick={addEmbed}>
                          <Plus className='mr-2 h-4 w-4' />
                          Add Embed
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-6'>
                        {welcomeMessage.embeds.map((embed, embedIndex) => (
                          <Card key={embed.id} className='relative overflow-hidden'>
                            <div className='absolute top-0 left-0 h-full w-1' style={{ backgroundColor: embed.color }} />
                            <CardHeader className='pb-2'>
                              <div className='flex items-center justify-between'>
                                Embed {embedIndex + 1} of {welcomeMessage.embeds.length}
                                <Button type='button' variant='ghost' size='icon' onClick={() => removeEmbed(embed.id)}>
                                  <Trash2 className='h-4 w-4' />
                                  <span className='sr-only'>Remove embed</span>
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                              <div className='grid gap-4'>
                                <div className='grid grid-cols-[1fr_120px] gap-4'>
                                  <div>
                                    <Label htmlFor={`embed-title-${embed.id}`}>Title</Label>
                                    <Input
                                      id={`embed-title-${embed.id}`}
                                      placeholder='Embed title'
                                      value={embed.title}
                                      onChange={(e) => updateEmbed(embed.id, { title: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`embed-color-${embed.id}`}>Color</Label>
                                    <div className='flex items-center gap-2'>
                                      <div className='h-9 w-9 rounded border' style={{ backgroundColor: embed.color }} />
                                      <Input
                                        id={`embed-color-${embed.id}`}
                                        type='text'
                                        value={embed.color}
                                        onChange={(e) => updateEmbed(embed.id, { color: e.target.value })}
                                        className='font-mono'
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor={`embed-description-${embed.id}`}>Description</Label>
                                  <Textarea
                                    id={`embed-description-${embed.id}`}
                                    placeholder='Embed description'
                                    value={embed.description}
                                    onChange={(e) => updateEmbed(embed.id, { description: e.target.value })}
                                  />
                                </div>

                                {/* Fields */}
                                <div>
                                  <Collapsible className='w-full'>
                                    <div className='flex items-center justify-between'>
                                      <CollapsibleTrigger asChild>
                                        <Button variant='ghost' size='sm' className='gap-1 px-2'>
                                          <ChevronDown className='h-4 w-4' />
                                          <span>Fields ({embed.fields.length})</span>
                                        </Button>
                                      </CollapsibleTrigger>
                                      <Button type='button' variant='outline' size='sm' onClick={() => addField(embed.id)} disabled={embed.fields.length >= 25}>
                                        <Plus className='mr-2 h-4 w-4' />
                                        Add Field
                                      </Button>
                                    </div>

                                    <CollapsibleContent className='mt-2 space-y-3'>
                                      {embed.fields.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className='grid gap-3 rounded-md border p-3'>
                                          <div className='flex items-center justify-between'>
                                            <Label className='text-xs'>Field {fieldIndex + 1}</Label>
                                            <Button
                                              type='button'
                                              variant='ghost'
                                              size='icon'
                                              className='h-6 w-6'
                                              onClick={() => removeField(embed.id, fieldIndex)}
                                            >
                                              <X className='h-3 w-3' />
                                              <span className='sr-only'>Remove field</span>
                                            </Button>
                                          </div>

                                          <div className='grid grid-cols-[1fr_auto] gap-3'>
                                            <div>
                                              <Label htmlFor={`field-name-${embed.id}-${fieldIndex}`} className='text-xs'>
                                                Name
                                              </Label>
                                              <Input
                                                id={`field-name-${embed.id}-${fieldIndex}`}
                                                placeholder='Field name'
                                                value={field.name}
                                                onChange={(e) => updateField(embed.id, fieldIndex, { name: e.target.value })}
                                                className='h-8'
                                              />
                                            </div>
                                            <div className='flex items-end'>
                                              <div className='flex items-center gap-2'>
                                                <Switch
                                                  id={`field-inline-${embed.id}-${fieldIndex}`}
                                                  checked={field.inline}
                                                  onCheckedChange={(checked) => updateField(embed.id, fieldIndex, { inline: checked })}
                                                />
                                                <Label htmlFor={`field-inline-${embed.id}-${fieldIndex}`} className='text-xs'>
                                                  Inline
                                                </Label>
                                              </div>
                                            </div>
                                          </div>

                                          <div>
                                            <Label htmlFor={`field-value-${embed.id}-${fieldIndex}`} className='text-xs'>
                                              Value
                                            </Label>
                                            <Input
                                              id={`field-value-${embed.id}-${fieldIndex}`}
                                              placeholder='Field value'
                                              value={field.value}
                                              onChange={(e) => updateField(embed.id, fieldIndex, { value: e.target.value })}
                                              className='h-8'
                                            />
                                          </div>
                                        </div>
                                      ))}

                                      {embed.fields.length === 0 && (
                                        <div className='flex flex-col items-center justify-center rounded-md border border-dashed py-6 text-center'>
                                          <p className='text-muted-foreground mb-2 text-sm'>No fields added yet</p>
                                          <Button type='button' variant='outline' size='sm' onClick={() => addField(embed.id)}>
                                            <Plus className='mr-2 h-4 w-4' />
                                            Add Field
                                          </Button>
                                        </div>
                                      )}
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className='lg:sticky lg:top-6'>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-medium'>Preview</h3>
                    <p className='text-muted-foreground text-sm'>This is how your welcome message will appear to new members</p>
                  </div>

                  <Card className='mt-4'>
                    <CardContent className='p-4'>
                      <div className='flex items-start gap-3'>
                        <div className='bg-primary/10 text-primary flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full'>
                          <Bot className='h-5 w-5' />
                        </div>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-primary font-semibold'>BotMaster</span>
                            <span className='text-muted-foreground text-xs'>BOT</span>
                          </div>
                          <p className='text-sm'>{welcomeMessage.content.replace('{user}', '@NewMember')}</p>

                          {welcomeMessage.embeds.map((embed) => (
                            <div key={embed.id} className='relative mt-2 overflow-hidden rounded-md border'>
                              <div className='absolute top-0 left-0 h-full w-1' style={{ backgroundColor: embed.color }} />
                              <div className='space-y-2 p-3 pl-4'>
                                {embed.title && <p className='font-semibold'>{embed.title}</p>}
                                {embed.description && <p className='text-sm'>{embed.description}</p>}

                                {embed.fields.length > 0 && (
                                  <div className='grid grid-cols-2 gap-2 pt-2'>
                                    {embed.fields.map((field, i) => (
                                      <div key={i} className={cn('space-y-1', !field.inline && 'col-span-2')}>
                                        {field.name && <p className='text-xs font-semibold'>{field.name}</p>}
                                        {field.value && <p className='text-xs'>{field.value}</p>}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Submit Button */}
              <div className='flex justify-end'>
                <Button type='submit'>
                  <Save className='mr-2 h-4 w-4' />
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
