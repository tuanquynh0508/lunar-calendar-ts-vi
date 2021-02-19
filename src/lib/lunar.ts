/*
 * @author: Nguyen Nhu Tuan <tuanquynh0508@gmail.com>
 * Base on Library (c) 2004 Ho Ngoc Duc [https://www.informatik.uni-leipzig.de/~duc/].
 */

import { Util } from "./util";
import { BlockLunarDate, LunarDate } from "./lunar-date";
import { CAN, CHI, GIO_HD, PI, TIETKHI, TK19, TK20, TK21, TK22, TUAN } from "./constants";

export class Lunar {

    private readonly FIRST_DAY!: number;
    private readonly LAST_DAY!: number;
    private today!: Date;
    private readonly currentLunarDate!: LunarDate;
    private currentMonth!: number;
    private currentYear!: number;

    constructor() {
        this.FIRST_DAY = this.jdn(25, 1, 1800); // Tet am lich 1800
        this.LAST_DAY = this.jdn(31, 12, 2199);
        this.today = new Date();
        this.currentLunarDate = this.getLunarDate(this.today.getDate(), this.today.getMonth()+1, this.today.getFullYear());
        this.currentMonth = this.today.getMonth()+1;
        this.currentYear = this.today.getFullYear();
    }

    public getBlockLunarToday(): BlockLunarDate {
        return this.getBlockLunarDate(new Date());
    }

    public getBlockLunarDate(d: string|Date): BlockLunarDate {
        const blockLunarDate = new BlockLunarDate();
        if (!(d instanceof Date)) {
            d = new Date(d);
        }
        const lunarDate = this.getLunarDate(d.getDate(), d.getMonth()+1, d.getFullYear());
        const cc = this.getZodiac(lunarDate);
        // Solar
        blockLunarDate.solarDay = (lunarDate.jd + 1) % 7;
        blockLunarDate.solarDayStr = TUAN[blockLunarDate.solarDay];
        blockLunarDate.solarDate = d.getDate();
        blockLunarDate.solarMonth = d.getMonth()+1;
        blockLunarDate.solarYear = d.getFullYear()
        // Lunar
        blockLunarDate.lunarDate = lunarDate.day;
        blockLunarDate.lunarMonth = lunarDate.month;
        blockLunarDate.lunarYear = lunarDate.year;
        blockLunarDate.lunarDateStr = cc[0];
        blockLunarDate.lunarMonthStr = cc[1];
        blockLunarDate.lunarYearStr = cc[2];

        blockLunarDate.zodiacHour = this.getZodiacHour(lunarDate.jd);
        blockLunarDate.zodiacFristHour = this.getFristZodiacHour(lunarDate.jd) + ' ' + CHI[0];
        blockLunarDate.airRetention = this.getAirRetention(lunarDate.jd);

        return blockLunarDate;
    }

    public getLunarDate(dd: number, mm: number, yyyy: number): LunarDate {
        let ly: LunarDate[], jd: number;
        if (yyyy < 1800 || 2199 < yyyy) {
            return new LunarDate(0, 0, 0, 0, 0);
        }
        ly = this.getYearInfo(yyyy);
        jd = this.jdn(dd, mm, yyyy);
        if (jd < ly[0].jd) {
            ly = this.getYearInfo(yyyy - 1);
        }
        return this.findLunarDate(jd, ly);
    }

    public getMonth(mm: number, yy: number): LunarDate[] {
        let ly1, ly2, tet1, jd1, jd2, mm1, yy1, result, i;
        if (mm < 12) {
            mm1 = mm + 1;
            yy1 = yy;
        } else {
            mm1 = 1;
            yy1 = yy + 1;
        }
        jd1 = this.jdn(1, mm, yy);
        jd2 = this.jdn(1, mm1, yy1);
        ly1 = this.getYearInfo(yy);
        tet1 = ly1[0].jd;
        result = [];
        if (tet1 <= jd1) {
            for (i = jd1; i < jd2; i++) {
                result.push(this.findLunarDate(i, ly1));
            }
        } else if (jd1 < tet1 && jd2 < tet1) {
            ly1 = this.getYearInfo(yy - 1);
            for (i = jd1; i < jd2; i++) {
                result.push(this.findLunarDate(i, ly1));
            }
        } else if (jd1 < tet1 && tet1 <= jd2) {
            ly2 = this.getYearInfo(yy - 1);
            for (i = jd1; i < tet1; i++) {
                result.push(this.findLunarDate(i, ly2));
            }
            for (i = tet1; i < jd2; i++) {
                result.push(this.findLunarDate(i, ly1));
            }
        }
        return result;
    }

    public getCurrentDayName(): string {
        return this.getDayName(this.currentLunarDate);
    }

    public getDayName(lunarDate: LunarDate): string {
        if (lunarDate.day == 0) {
            return "";
        }
        const cc = this.getZodiac(lunarDate);
        return "Ngày " + cc[0] +", tháng "+cc[1] + ", năm " + cc[2];
    }

    public getYearZodiac(year: number): string {
        return CAN[(year+6) % 10] + " " + CHI[(year+8) % 12];
    }

    /*
     * Can cua gio Chinh Ty (00:00) cua ngay voi JDN nay
     */
    public getFristZodiacHour(jdn: number): string {
        return CAN[(jdn-1)*2 % 10];
    }

    public getZodiac(lunar: LunarDate): string[] {
        let dayName, monthName, yearName;
        dayName = CAN[(lunar.jd + 9) % 10] + " " + CHI[(lunar.jd+1)%12];
        monthName = CAN[(lunar.year*12+lunar.month+3) % 10] + " " + CHI[(lunar.month+1)%12];
        if (lunar.leap == 1) {
            monthName += " (nhuận)";
        }
        yearName = this.getYearZodiac(lunar.year);
        return [dayName, monthName, yearName];
    }

    public getDayString(lunar: LunarDate, solarDay: number, solarMonth: number, solarYear: number): string {
        var s;
        var dayOfWeek = TUAN[(lunar.jd + 1) % 7];
        s = dayOfWeek + " " + solarDay + "/" + solarMonth + "/" + solarYear;
        s += " -+- ";
        s = s + "Ngày " + lunar.day+" tháng "+lunar.month;
        if (lunar.leap == 1) {
            s = s + " nhuận";
        }
        return s;
    }

    public getTodayString(): string {
        let s = this.getDayString(this.currentLunarDate, this.today.getDate(), this.today.getMonth()+1, this.today.getFullYear());
        s += " năm " + this.getYearZodiac(this.currentLunarDate.year);
        return s;
    }

    public getCurrentTime(): string {
        const today: Date = new Date();
        const Std = today.getHours();
        const Min = today.getMinutes();
        const Sec = today.getSeconds();
        const s1  = ((Std < 10) ? "0" + Std : Std);
        const s2  = ((Min < 10) ? "0" + Min : Min);
        return s1 + ":" + s2;
    }

    public getZodiacHour(jd: number): string {
        const chiOfDay = (jd+1) % 12;
        const gioHD = GIO_HD[chiOfDay % 6]; // same values for Ty' (1) and Ngo. (6), for Suu and Mui etc.
        let ret = "";
        let count = 0;
        for (let i = 0; i < 12; i++) {
            if (gioHD.charAt(i) == '1') {
                ret += CHI[i];
                ret += ' ('+(i*2+23)%24+'-'+(i*2+1)%24+')';
                if (count++ < 5) ret += ', ';
                // if (count == 3) ret += '\n';
            }
        }
        return ret;
    }

    public getAirRetention(jd: number): string {
        return TIETKHI[Util.getSunLongitude(jd+1, 7.0)];
    }

    private jdn(dd: number, mm: number, yy: number): number {
        var a = Util.INT((14 - mm) / 12);
        var y = yy+4800-a;
        var m = mm+12*a-3;
        var jd = dd + Util.INT((153*m+2)/5) + 365*y + Util.INT(y/4) - Util.INT(y/100) + Util.INT(y/400) - 32045;
        return jd;
    }

    private jdn2date(jd: number): number[] {
        let Z, A, alpha, B, C, D, E, dd, mm, yyyy, F;
        Z = jd;
        if (Z < 2299161) {
            A = Z;
        } else {
            alpha = Util.INT((Z-1867216.25)/36524.25);
            A = Z + 1 + alpha - Util.INT(alpha/4);
        }
        B = A + 1524;
        C = Util.INT( (B-122.1)/365.25);
        D = Util.INT( 365.25*C );
        E = Util.INT( (B-D)/30.6001 );
        dd = Util.INT(B - D - Util.INT(30.6001*E));
        if (E < 14) {
            mm = E - 1;
        } else {
            mm = E - 13;
        }
        if (mm < 3) {
            yyyy = C - 4715;
        } else {
            yyyy = C - 4716;
        }
        return [dd, mm, yyyy];
    }

    private decodeLunarYear(yy: number, k: number): LunarDate[] {
        let monthLengths, regularMonths, offsetOfTet, leapMonth, leapMonthLength, solarNY, currentJD, j, mm;
        let ly = [];
        monthLengths = [29, 30];
        regularMonths = [];
        offsetOfTet = k >> 17;
        leapMonth = k & 0xf;
        leapMonthLength = monthLengths[k >> 16 & 0x1];
        solarNY = this.jdn(1, 1, yy);
        currentJD = solarNY+offsetOfTet;
        j = k >> 4;
        for(let i = 0; i < 12; i++) {
            regularMonths[12 - i - 1] = monthLengths[j & 0x1];
            j >>= 1;
        }
        if (leapMonth == 0) {
            for(mm = 1; mm <= 12; mm++) {
                ly.push(new LunarDate(1, mm, yy, 0, currentJD));
                currentJD += regularMonths[mm-1];
            }
        } else {
            for(mm = 1; mm <= leapMonth; mm++) {
                ly.push(new LunarDate(1, mm, yy, 0, currentJD));
                currentJD += regularMonths[mm-1];
            }
            ly.push(new LunarDate(1, leapMonth, yy, 1, currentJD));
            currentJD += leapMonthLength;
            for(mm = leapMonth+1; mm <= 12; mm++) {
                ly.push(new LunarDate(1, mm, yy, 0, currentJD));
                currentJD += regularMonths[mm-1];
            }
        }
        return ly;
    }

    private getYearInfo(yyyy: number): LunarDate[] {
        var yearCode;
        if (yyyy < 1900) {
            yearCode = TK19[yyyy - 1800];
        } else if (yyyy < 2000) {
            yearCode = TK20[yyyy - 1900];
        } else if (yyyy < 2100) {
            yearCode = TK21[yyyy - 2000];
        } else {
            yearCode = TK22[yyyy - 2100];
        }
        return this.decodeLunarYear(yyyy, yearCode);
    }

    private findLunarDate(jd: number, ly: LunarDate[]): LunarDate {
        if (jd > this.LAST_DAY || jd < this.FIRST_DAY || ly[0].jd > jd) {
            return new LunarDate(0, 0, 0, 0, jd);
        }
        let i = ly.length-1;
        while (jd < ly[i].jd) {
            i--;
        }
        let off = jd - ly[i].jd;
        return new LunarDate(ly[i].day+off, ly[i].month, ly[i].year, ly[i].leap, jd);
    }
}
