import got from 'got';

export class DiscordWorker {
  private WebhookUrl: URL;

  constructor(WebhookUrl: URL) {
    if (WebhookUrl.toString().endsWith('/')) {
      WebhookUrl = new URL(WebhookUrl.toString().slice(0, -1));
    }
    this.WebhookUrl = WebhookUrl;
  }

  async sendStartMessage() {
    await got(
      'https://discord.com/api/webhooks/1132637823242088540/RWoaOu7Gj3D01DXUdBhjMJOdP2CSQIq5xBZanZ70TpKSNgWV6pUb3ktUEDNU0QYBYYlg',
      {
        method: 'POST',
        json: {
          content: '**The server has started!**',
        },
      },
    ).catch((err) => {
      console.error(err);
    });
  }

  async sendUpMessage(name: string) {
    await got(
      'https://discord.com/api/webhooks/1132637823242088540/RWoaOu7Gj3D01DXUdBhjMJOdP2CSQIq5xBZanZ70TpKSNgWV6pUb3ktUEDNU0QYBYYlg',
      {
        method: 'POST',
        json: {
          content: `<:success:1096737763052757052> **${name} is up.**`,
        },
      },
    );
  }

  async sendDownMessage(name: string, message: string) {
    await got(
      'https://discord.com/api/webhooks/1132637823242088540/RWoaOu7Gj3D01DXUdBhjMJOdP2CSQIq5xBZanZ70TpKSNgWV6pUb3ktUEDNU0QYBYYlg',
      {
        method: 'POST',
        json: {
          content: `<:fail:1096739199488626819> **${name} went down <t:${Math.floor(
            new Date().getTime() / 1000,
          )}:R>!**\n${message}`,
        },
      },
    );
  }
}
