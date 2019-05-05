/* eslint-disable meteor/audit-argument-checks */

const baseUrlCiabata = 'https://batavierenrace.nl/nl/47/ciabata/data/';

Meteor.methods({
    'getEtappeInfo'(cookie) {
        if (cookie) {
            let etappes = HTTP.call("GET", baseUrlCiabata+"etappe/status", {
                headers: {
                    "COOKIE": `PHPSESSID=${cookie}`,
                }
            });
            let result = [];
            for (const [key, etappe] of Object.entries(etappes.data.etappes)) {
                result.push({ x: etappe.nummer, y: etappe.lopers })
            }
            return result
        }
    },
    'getVehicleStatus'(cookie) {
        if (cookie) {
            const enabled = [
                'Arts-1',
                'Arts-2',
                'Arts-3',
                'Arts-4',
                'Arts-5',
                'Arts-6',
                'WL-1',
                'WL-2',
                'Arts-HS',
                'CaCo',
                'RR-1',
                'RR-2',
                'RR-3',

            ]
            let result = []
            const vehicles = HTTP.call("GET", baseUrlCiabata+"voertuigen/info", {
                headers: {
                    "COOKIE": `PHPSESSID=${cookie}`,
                }
            });
            const vehicleStatus = HTTP.call("GET", baseUrlCiabata+"voertuigen/status", {
                headers: {
                    "COOKIE": `PHPSESSID=${cookie}`,
                }
            });
            for (const [id, status] of Object.entries(vehicleStatus.data.voertuigen)) {
                if (enabled.includes(vehicles.data['voertuigen'][id].abbreviation)) {
                    vehicles.data['voertuigen'][id]['status'] = status['inzetbaarheid'];
                    result.push(vehicles.data['voertuigen'][id])
                }
            }
            return result;
        }
    },
    'getWeatherData'() {
        let weather = HTTP.call("GET", "https://api.darksky.net/forecast/822156a25e4c55d421932c8d325df3bc/52.229326199999996,6.896322199999999?lang=nl&units=si");
        let result = {
            current: weather.data.currently,
            temperature: [],
            percipation: [],
            labels: [],
        }
        let l = 0;
        for (const ts of weather.data.hourly.data) {
            result.temperature.push(ts.temperature);
            result.percipation.push(ts.precipIntensity);
            result.labels.push(`+ ${l += 1}`)
        }
        return result;
    },
    'getGPData'(cookie) {
        if (cookie) {
            let result = [];
            let gpList = HTTP.call("GET", baseUrlCiabata+"gp/info", {
                headers: {
                    "COOKIE": `PHPSESSID=${cookie}`,
                }
            });

            for (const [key, entry] of Object.entries(gpList.data.pois)) {
                for (const [key, gp] of Object.entries(entry)) {
                    if (gp.time_after.planned && gp.status.value != "beveiligd" || moment().diff(moment(gp.status.time),'minutes') <= 2) {
                        result.push({
                            "type": "gp",
                            "planned": gp.time_after.planned,
                            "label": gp.name,
                            "status": gp.status.value,
                            "timestamp": gp.status.time
                        });
                    }
                }
            };

            let wpList = HTTP.call("GET", baseUrlCiabata+"wisselpunten/info", {
                headers: {
                    "COOKIE": `PHPSESSID=${cookie}`,
                }
            });

            for (const [key, entry] of Object.entries(wpList.data.pois)) {
                for (const [key, wp] of Object.entries(entry)) {
                    if ((wp.status.value != "geopend" && wp.status.value != "gesloten")  || moment().diff(moment(wp.status.time),'minutes') <= 2) {
                        result.push({
                            "type": "wp",
                            "planned": wp.opening.planned,
                            "label": "WP " + wp.nummer,
                            "status": wp.status.value,
                            "timestamp": wp.status.time
                        })
                    }
                }
            }

            return _.sortBy(result, 'planned');
        }
    }
});