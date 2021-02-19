import "jasmine";
import { Lunar, LunarDate } from "../lib";

describe("Unit test Lic Am", () => {
    let lunar: Lunar;

    beforeEach(function () {
        lunar = new Lunar();
    });

    it("Test Tan suu - 2021", () => {
        expect(lunar.getYearZodiac(2021)).toBe('Tân Sửu');
    });

    it("Test ngay am lich 2021-02-19", () => {
        const d: LunarDate = lunar.getLunarDate(19,2,2021);
        expect(d).toEqual(new LunarDate(8, 1, 2021, 0, 2459265));
    });

    it("Test full ngay am lich 2021-02-19", () => {
        const d: LunarDate = lunar.getLunarDate(19,2,2021);
        expect(lunar.getDayName(d)).toBe('Ngày Mậu Tuất, tháng Canh Dần, năm Tân Sửu');
        // console.log(lunar.getBlockLunarToday());
        // console.log(lunar.getTodayString());
        // console.log(lunar.getZodiacHour(d.jd));
        // console.log(lunar.getAirRetention(d.jd));
        // console.log(lunar.getCurrentTime());
    });
});
