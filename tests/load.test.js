// import { check, sleep } from 'k6';
// import http from 'k6/http';

// export let options = {
//   vus: 30,
//   duration: '20s',
// };

// let token;

// export function setup() {
//   const loginRes = http.post(
//     'http://10.10.20.24:5550/api/v1/auth/login',
//     JSON.stringify({
//       identifier: 'torupassenger@yopmail.com',
//       password: 'Test@123',
//       fcmToken:
//         'fwR26dl7QfaWafhppBewdH:APA91bHPX5QpDYbYIzZPpdKDlGdYkfboSCKkX-ASB7TMwaodV5jv2FdXXJMfwSMBs9c-rN8VJFm3Her3feReByRKNk0q_6L7M1iGW3NTRSJjnDgmqofFAjQ',
//     }),
//     {
//       headers: { 'Content-Type': 'application/json' },
//     },
//   );
//   check(loginRes, {
//     'login success': r => r.status === 200,
//   });

//   const token = loginRes.json('data.accessToken');

//   if (!token) {
//     throw new Error('Token not found in login response');
//   }

//   return token;
// }

// export default function (token) {
//   const res = http.get('http://10.10.20.24:5550/api/v1/user/get-short-info', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   check(res, {
//     'status is 200': r => r.status === 200,
//   });

//   sleep(1);
// }

// import http from 'k6/http';
// import { sleep } from 'k6';

// export const options = {
//   vus: 1000, // 1000 জন ভার্চুয়াল ইউজার
//   duration: '30s', // ৩০ সেকেন্ড ধরে টেস্ট চলবে
// };

// export default function () {
//   http.get('https://malamal.com.bd'); // এই লিঙ্কে রিকোয়েস্ট পাঠাবে
//   sleep(1); // প্রতি রিকোয়েস্টের মাঝে ১ সেকেন্ড বিরতি
// }

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    homepage: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 100 },
        { duration: '1m', target: 500 },
        { duration: '1m', target: 1000 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
  },
  discardResponseBodies: true,
};

export default function () {
  const res = http.get(__ENV.BASE_URL || 'https://malamal.com.bd', {
    tags: { page: 'home' },
    timeout: '10s',
  });

  check(res, {
    'home status is 200': response => response.status === 200,
  });

  sleep(1);
}
