import {PI} from "./constants";

export class Util {
    /* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
    static INT(d: number): number {
        return Math.floor(d);
    }

    /* Compute the longitude of the sun at any time.
     * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
     * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
     */
    static SunLongitude(jdn: number): number {
        let T, T2, dr, M, L0, DL, lambda, theta, omega;
        T = (jdn - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
        T2 = T*T;
        dr = PI/180; // degree to radian
        M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
        L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
        DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
        DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
        theta = L0 + DL; // true longitude, degree
        // obtain apparent longitude by correcting for nutation and aberration
        omega = 125.04 - 1934.136 * T;
        lambda = theta - 0.00569 - 0.00478 * Math.sin(omega * dr);
        // Convert to radians
        lambda = lambda*dr;
        lambda = lambda - PI*2*(Util.INT(lambda/(PI*2))); // Normalize to (0, 2*PI)
        return lambda;
    }

    /* Compute the sun segment at start (00:00) of the day with the given integral Julian day number.
     * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
     * The function returns a number between 0 and 23.
     * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
     * After that, return 1, 2, 3 ...
     */
    static getSunLongitude(dayNumber: number, timeZone: number) {
        return Util.INT(Util.SunLongitude(dayNumber - 0.5 - timeZone/24.0) / PI * 12);
    }
}
