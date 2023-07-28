import typia from 'typia';
import { BetterUptimeResponse } from '../../@types/betteruptime';

export const parseStatus = (input: string) =>
  typia.assertParse<BetterUptimeResponse>(input);
