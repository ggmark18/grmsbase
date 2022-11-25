import { Test, TestingModule } from '@nestjs/testing';
import { toStoredString, toTimeString, toDate, calcDays } from './date';

describe('datetool', () => {
    describe('toStoredString', () => {
        test('OK', async () => {
            let date = new Date(2000,1,1);
            await expect(toStoredString(date)).toBe('2000/02/01');
        });
    });
    describe('toDate', () => {
        test('OK', async () => {
            let date = new Date(2000,1,1);
            await expect(toDate('2000/02/01').getTime()).toBe(date.getTime());
        });
    });
    describe('calcDays', () => {
        test('OK', async () => {
            let fdate = new Date(1999,10,1);
            let tdate = new Date(2000,9,31);
            await expect(calcDays(fdate, tdate)).toBe(365);
        });
    });
    describe('toTimeString', () => {
        test('OK', async () => {
            let date = new Date(2000,1,1,5,3);
            await expect(toTimeString(date)).toBe('2000/02/01 5:03');
        });
    });
});
