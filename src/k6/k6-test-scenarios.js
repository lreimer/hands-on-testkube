import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  insecureSkipTLSVerify: true,
  thresholds: {
      'http_req_duration{kind:html}': ['avg<=250', 'p(95)<500'],
      'checks{type:testkube}': ['rate>0.95'],
      'checks{type:qaware}': ['rate>0.95'],
  },
  scenarios: {
    testkube: {
      executor: 'constant-vus',
      exec: 'testkube',
      vus: 5,
      duration: '10s',
      tags: { type: 'testkube' },
    },
    qaware: {
      executor: 'per-vu-iterations',
      exec: 'qaware',
      vus: 5,
      iterations: 10,
      startTime: '5s',
      maxDuration: '1m',
      tags: { type: 'qaware' },
    },
  },
};

export function testkube() {
  check(http.get('https://kubeshop.github.io/testkube/', {
      tags: {'kind': 'html'},
  }), {
      "Testkube is OK": (res) => res.status === 200,
  });
  sleep(1);
}

export function qaware() {
  check(http.get('https://www.qaware.de/code-im-blut', {
      tags: {'kind': 'html'},
  }), {
      "QAware is OK": (res) => res.status === 200,
  });
  sleep(1);
}

