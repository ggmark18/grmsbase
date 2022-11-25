import { format } from 'date-fns';

export function toTimeString(date:Date) : string{
    return format(date, 'yyyy/MM/dd H:mm');
}
export function toStoredString(date:Date) : string{
    return format(date, 'yyyy/MM/dd');
}
export function toDate(str:string) : Date {
    return new Date(str);
}
export function calcDays(from:Date, to:Date) {
    return (to.getTime() - from.getTime()) / 86400000;
}
export function nowFileTimeSuffix() {
    let now = new Date();
    return now.getFullYear()
        + ('0' + (now.getMonth() + 1)).slice(-2)
        + ('0' + now.getDate()).slice(-2)
        + ('0' + now.getHours()).slice(-2)
        + ('0' + now.getMinutes()).slice(-2)
        + ('0' + now.getSeconds()).slice(-2);
}
