// ==UserScript==
// @name         Wayfarer IDS
// @version      0.0.5
// @description  IDS
// @namespace    https://github.com/haukka3/WayfarerExt
// @homepageURL  https://github.com/haukka3/WayfarerExt
// @match        https://wayfarer.nianticlabs.com/*
// ==/UserScript==

// Copyright 2021 Haukka3
// This file is part of the Wayfarer Addons collection.

// This script is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This script is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You can find a copy of the GNU General Public License in the root
// directory of this script's GitHub repository
// If not, see <https://www.gnu.org/licenses/>.

/* eslint-env es6 */
/* eslint no-var: "error" */

(function () {
    let jsonResponse = null;
    /**
     * Overwrite the open method of the XMLHttpRequest.prototype to intercept the server calls
     */
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url == '/api/v1/vault/manage' && method == 'GET') {

                this.addEventListener('load', setupPage, false);
            }
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    function setupPage() {
        try {
            const response = this.response;
            const json = JSON.parse(response);
            if (!json) return;
            jsonResponse = json.result;
            alert(jsonResponse.nominations.length);
            const candidate = json.result;
            appendIDS();
            if (json.captcha || !candidate || candidate.type !== 'NEW') return;

        } catch (e) {
            console.log(e);
        }
    }

    function appendIDS() {
        document.querySelectorAll('div.flex.flex-row.items-center span.font-bold').forEach((e) => {
            const ele = jsonResponse.nominations.find((j) => j.title === e.innerText)
            if (ele) {
                e.innerText = e.innerText + ' - ' + ele.id;
            }

        });
        setTimeout(appendIDS, 300);
    }

    })();
