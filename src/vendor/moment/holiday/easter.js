import moment from 'moment';

const easter = function (y) {
  const c = Math.floor(y / 100);
  const n = y - 19 * Math.floor(y / 19);
  const k = Math.floor((c - 17) / 25);
  let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
  i -= 30 * Math.floor((i / 30));
  i -= Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
  let j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
  j -= 7 * Math.floor(j / 7);
  const l = i - j;
  const m = 3 + Math.floor((l + 40) / 44);
  const d = l + 28 - 31 * Math.floor(m / 4);
  return moment([y, (m - 1), d]);
};

moment.modifyHolidays.extendParser((m, date) => {
  if (~date.indexOf('easter')) {
    const dates = date.split('|');
    const ds = [];

    for (let i = 0; i < dates.length; i++) {
      if (dates[i].substring(0, 6) === 'easter') {
        const e = easter(m.year());

        if (dates[i].charAt(6) === '-') {
          e.subtract(dates[i].substring(7), 'days');
        }
        if (dates[i].charAt(6) === '+') {
          e.add(dates[i].substring(7), 'days');
        }

        if (dates.length === 1) {
          return e;
        }
        ds.push(e.format('M/D'));
      } else {
        ds.push(dates[i]);
      }
    }

    if (ds.length) {
      return ds.join('|');
    }
  }
});
