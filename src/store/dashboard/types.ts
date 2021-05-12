export interface Statistics {
    received: number;
    sent: number;
    averageTime: number;
    executionTimes: number[];
    sentDays: StatisticsDay[];
    receivedDays: StatisticsDay[];
}

export interface StatisticsDay {
    day: string;
    count: number;
}
