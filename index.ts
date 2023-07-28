import { DiscordWorker } from './src/discord.worker';
import { UptimeServiceWorker } from './src/backend.worker';

(async () => {
  const Service = new UptimeServiceWorker(
    new URL('https://uptime.betterstack.com/api/v2'),
    process.env.BETTERUPTIME_API_KEY as string,
  );

  const Discord = new DiscordWorker(
    new URL(
      'https://discord.com/api/webhooks/1132637823242088540/RWoaOu7Gj3D01DXUdBhjMJOdP2CSQIq5xBZanZ70TpKSNgWV6pUb3ktUEDNU0QYBYYlg',
    ),
  );

  forceCheckServer(Service, Discord);
})();

async function forceCheckServer(
  UptimeWorker: UptimeServiceWorker,
  DiscordWorker: DiscordWorker,
) {
  await UptimeWorker.getServerStatus().then((res) => {
    if (res instanceof Error) {
      throw res;
    }

    res.forEach(async (server) => {
      let LastChecked: string;
      if (server.attributes.last_checked_at === null) {
        LastChecked = Math.floor(new Date().getTime() / 1000).toString();
      } else {
        LastChecked = (
          new Date(server.attributes.last_checked_at).getTime() / 1000
        ).toString();
      }

      switch (server.attributes.status) {
        case 'up':
          await DiscordWorker.sendUpMessage(
            server.attributes.pronounceable_name,
          );
          break;
        case 'down':
          await DiscordWorker.sendDownMessage(
            server.attributes.pronounceable_name,
            `* Check every ${server.attributes.check_frequency} seconds.\n* Last check: <t:${LastChecked}>`,
          );
          break;
        case 'down':
          await DiscordWorker.sendDownMessage(
            server.attributes.pronounceable_name,
            `* Check every ${server.attributes.check_frequency} seconds.\n* Last check: <t:${LastChecked}>`,
          );
          break;
        default:
          break;
      }
    });

    console.dir(res);
  });
}
