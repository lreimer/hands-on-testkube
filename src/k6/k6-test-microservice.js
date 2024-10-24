import {check, sleep, group} from "k6";
import http from "k6/http";

export let options = {
    vus: 10,
    duration: '60s',
    batchPerHost: 4,
    insecureSkipTLSVerify: true,
    thresholds: {
        'http_req_duration{kind:html}': ['avg<=250', 'p(95)<500'],
    }
};

export default function () {
    group("api", function () {
        check(http.get(`http://${__ENV.TARGET_HOSTNAME}:8080/api/ping`, {
            tags: {'kind': 'html'},
        }), {
            "status is 200": (res) => res.status === 200,
        });
    });
    sleep(1);
}
