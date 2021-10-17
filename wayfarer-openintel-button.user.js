// ==UserScript==
// @name         Wayfarer Open Intel
// @version      0.0.1
// @description  Add open Intel button to page
// @namespace    https://github.com/haukka3/WayfarerExt
// @downloadURL  https://github.com/haukka3/WayfarerExt/raw/main/wayfarer-openintel-button.user.js
// @homepageURL  https://github.com/haukka3/WayfarerExt
// @match        https://wayfarer.nianticlabs.com/*
// ==/UserScript==

// Copyright 2021 Haukka3

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
    /**
     * Overwrite the open method of the XMLHttpRequest.prototype to intercept the server calls
     */
    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url) {
            if (url == '/api/v1/vault/review' && method == 'GET') {
                this.addEventListener('load', setupPage, false);
            }
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    function clearSetup() {
        const clearNodes = document.querySelectorAll('.wayfareropenintel__div');
        for (let i = 0; i < clearNodes.length; i++) {
            clearNodes[i].parentNode.removeChild(clearNodes[i]);
        }
    }

    function setupPage() {

        const ref = document.querySelector('wf-logo');
        if (!ref) {
            setTimeout(setupPage, 200);
            return;
        }

        try {
            const response = this.response;
            const json = JSON.parse(response);
            if (!json) return;
            const candidate = json.result;
            if (json.captcha || !candidate) return;

            addOpenIntelButton(candidate);
        } catch (e) {
            console.log(e);
        }
    }

    function addOpenIntelButton(candidate) {
        const ref =
            document.querySelectorAll('.wf-review-card__body');

        if (!ref || ref.length < 2) {
            setTimeout(
                addOpenIntelButton.bind(this, candidate)
            , 400);
            return;
        }
        clearSetup();
        const div = document.createElement('div');
        div.classList.add('wayfareropenintel__div');

        let openIntelButton = document.createElement('button');
        openIntelButton.innerHTML = "Open Intel";
        openIntelButton.classList.add("wayfareropenintel__button");
        openIntelButton.onclick = function() { window.open('https://intel.ingress.com/intel?ll=' + candidate.lat + ',' + candidate.lng + '&z=18','wayfareropenintel') };

        div.appendChild(openIntelButton);
        document.querySelector('wf-logo').parentNode.parentNode.appendChild(div);

    }

    (function () {
        const css = `
            .wayfareropenintel__div {
                color: #333;
                margin-left: 2em;
                padding-top: 0.3em;
                text-align: center;
                display: block;
            }
            .wayfareropenintel__button {
                background-color: #e5e5e5;
                border: none;
                color: #ff4713;
                padding: 4px 10px;
                margin: 1px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
            }
            .dark .wayfareropenintel__button {
                background-color: #404040;
                color: #20B8E3;
            }
			`;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.querySelector('head').appendChild(style);
    })();
})();