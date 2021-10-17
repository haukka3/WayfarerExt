// ==UserScript==
// @name         Wayfarer Translate Button
// @version      0.0.4
// @description  Add translate button to review page
// @namespace    https://github.com/haukka3/WayfarerExt
// @downloadURL  https://github.com/haukka3/WayfarerExt/raw/main/wayfarer-translate-button.user.js
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
        const clearNodes = document.querySelectorAll('.wayfarertranslate__div');
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
            if (json.captcha || !candidate || candidate.type !== 'NEW') return;

            addTranslateButton();
        } catch (e) {
            console.log(e);
        }
    }

    function getText(node) {
        function recursor(n) {
            var i, a = [];
            if (n.nodeType !== 3) {
                if (n.childNodes)
                     for (i = 0; i < n.childNodes.length; ++i)
                         a = a.concat(recursor(n.childNodes[i]));
            } else
                a.push(n.data);
            return a;
        }
        return recursor(node);
    }

    function addTranslateButton() {
        const ref =
            document.querySelectorAll('.wf-review-card__body');

        if (!ref || ref.length < 2) {
            setTimeout(function () {
                addTranslateButton();
            }, 400);
            return;
        }
        clearSetup();
        const div = document.createElement('div');
        div.classList.add('wayfarertranslate__div');

        let translateButton = document.createElement('button');
        translateButton.innerHTML = "Translate";
        translateButton.classList.add("wayfarertranslate__button");
        translateButton.onclick = function translateClick() {
            let translateNodes = document.querySelectorAll('.wf-review-card__body');
            let translateText = getText(translateNodes[1]).join("\n") + "\n\n" + getText(translateNodes[2]).join("\n");

            window.open('https://translate.google.com/?sl=auto&text=' + encodeURIComponent(translateText) + '&op=translate', 'wayfarertranslate');
        }
        div.appendChild(translateButton);
        document.querySelector('wf-logo').parentNode.parentNode.appendChild(div);

    }

    (function () {
        const css = `
            .wayfarertranslate__div {
                color: #333;
                margin-left: 2em;
                padding-top: 0.3em;
                text-align: center;
                display: block;
            }
            .wayfarertranslate__button {
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
            .dark .wayfarertranslate__button {
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