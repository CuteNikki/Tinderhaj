import type { ClientEvents, RestEvents } from 'discord.js';

import type { ExtendedClient } from 'classes/base/client';

/** Something to do on a gateway event, or with `rest`, on an event from the REST manager. */
export class Event<T extends keyof ClientEvents | keyof RestEvents> {
  constructor(
    public options: {
      name: T;
      rest?: boolean;
      once?: boolean;
      execute: (
        client: ExtendedClient,
        ...args: T extends keyof ClientEvents ? ClientEvents[T] : T extends keyof RestEvents ? RestEvents[T] : never
      ) => unknown;
    },
  ) {}
}
