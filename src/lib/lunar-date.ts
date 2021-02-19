export interface ILunarDate {
    day: number;
    month: number;
    year: number;
    leap: number;
    jd: number;
}

export class LunarDate implements ILunarDate {
    day!: number;
    month!: number;
    year!: number;
    leap!: number;
    jd!: number;

    constructor(dd: number, mm: number, yy: number, leap: number, jd: number) {
        this.day = dd;
        this.month = mm;
        this.year = yy;
        this.leap = leap;
        this.jd = jd;
    }
}

export class BlockLunarDate {
    solarDay!: number; // 0-cn, 1-t2...
    solarDayStr!: string;
    solarDate!: number;
    solarMonth!: number;
    solarYear!: number;

    lunarDate!: number;
    lunarMonth!: number;
    lunarYear!: number;
    lunarDateStr!: string;
    lunarMonthStr!: string;
    lunarYearStr!: string;

    zodiacHour!: string;
    zodiacFristHour!: string;
    airRetention!: string;
}
