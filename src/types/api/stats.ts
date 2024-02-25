interface Stat {
  coins: number,
  rewards: number,
  users: number
}

export interface DayStat extends Stat {
  date: string,
}

export interface WeekStat extends Stat {
  date: {
    first_week_day: string,
    last_week_day: string,
  },
}