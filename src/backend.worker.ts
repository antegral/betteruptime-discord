import { BetterUptimeResponse, Pagination, Server } from 'betteruptime';
import got from 'got';
import { TypeGuardError, assertParse } from 'typia';
import { parseStatus } from './generated/check';

export class UptimeServiceWorker {
  private ApiUrl: URL;
  private ApiKey: string;

  constructor(ApiUrl: URL, ApiKey: string) {
    if (ApiUrl.toString().endsWith('/')) {
      ApiUrl = new URL(ApiUrl.toString().slice(0, -1));
    }
    this.ApiUrl = ApiUrl;
    this.ApiKey = ApiKey;
  }

  async getServerStatus(): Promise<Server[] | Error> {
    let CurrentApiUrl = this.ApiUrl.toString().concat('/monitors');
    let Data: Server[] = [];

    do {
      const resp = await got(CurrentApiUrl, {
        headers: {
          Authorization: `Bearer ${this.ApiKey}`,
        },
      })
        .then((res) => {
          return res.body;
        })
        .catch((err) => {
          return new Error(err);
        });
      if (resp instanceof Error) {
        return resp;
      }
      const now = parseStatus(resp);
      now.data.forEach((server) => {
        Data.push(server);
      });

      if (now.pagination.next === null) break;
      CurrentApiUrl = now.pagination.next;
    } while (true);

    return Data;
  }

  async getHeartbeatStatus(): Promise<BetterUptimeResponse | Error> {
    const resp = await got(this.ApiUrl.toString().concat('/monitors'), {
      headers: {
        Authorization: `Bearer ${this.ApiKey}`,
      },
    })
      .then((res) => {
        return res.body;
      })
      .catch((err) => {
        return new Error(err);
      });
    if (resp instanceof Error) {
      return resp;
    }

    return parseStatus(resp);
  }
}
