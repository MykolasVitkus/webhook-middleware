/* eslint-disable no-redeclare */
/*jshint evil:true*/
/*global module, require, define*/

(function (root, factory) {
    'use strict';

    // AMD
    if (typeof define === 'function' && define.amd) {
        define('jsonpathObjectTransform', ['JSONPath'], function (jsonPath) {
            return (root.jsonpathObjectTransform = factory(jsonPath));
        });
    }

    // Node
    else if (typeof exports === 'object') {
        module.exports = factory(require('JSONPath'));
    }

    // Browser global
    else {
        root.jsonpathObjectTransform = factory(root.jsonPath);
    }
})(this, function (jsonPath) {
    'use strict';

    /**
     * Step through data object and apply path transforms.
     *
     * @param {object} data
     * @param {object} path
     * @param {object} result
     * @param {string} key
     */
    function walk(data, path, result, key) {
        var fn;
        // console.log(type(path));

        switch (type(path)) {
            case 'string':
                fn = seekSingle;
                break;

            case 'array':
                fn = seekArray;
                break;

            case 'object':
                fn = seekObject;
                break;
        }

        if (fn) {
            fn(data, path, result, key);
        }
    }

    /**
     * Determine type of object.
     *
     * @param {object} obj
     * @returns {string}
     */
    function type(obj) {
        return Array.isArray(obj) ? 'array' : typeof obj;
    }

    /**
     * Get single property from data object.
     *
     * @param {object} data
     * @param {string} pathStr
     * @param {object} result
     * @param {string} key
     */
    function seekSingle(data, pathStr, result, key) {
        if (pathStr.indexOf('$') < 0) {
            result[key] = pathStr;
        } else {
            if (!(pathStr.indexOf('`') < 0)) {
                var temp = [];
                var parts = pathStr.split(/[``]/);
                if (parts.length == 0) {
                    result[key] = pathStr;
                } else {
                    parts.forEach((part, index) => {
                        if (part.indexOf('$') < 0) {
                            temp[index] = part;
                        } else {
                            var temp2 = jsonPath.eval(data, part) || [];
                            temp[index] = temp2.length ? temp2[0] : part;
                        }
                    });
                    result[key] = temp.join('');
                }
            } else {
                var seek = jsonPath.eval(data, pathStr) || [];
                result[key] = seek.length ? seek[0] : pathStr;
            }
        }
    }

    /**
     * Get array of properties from data object.
     *
     * @param {object} data
     * @param {array} pathArr
     * @param {object} result
     * @param {string} key
     */
    function seekArray(data, pathArr, result, key) {
        var tempResult = [];
        result[key] = pathArr.forEach(function (_prop, index) {
            walk(data, pathArr[index], tempResult, index);
        });
        result[key] = tempResult;
    }

    /**
     * Get object property from data object.
     *
     * @param {object} data
     * @param {object} pathObj
     * @param {object} result
     * @param {string} key
     */
    function seekObject(data, pathObj, result, key) {
        if (typeof key !== 'undefined') {
            result = result[key] = {};
        }

        Object.keys(pathObj).forEach(function (name) {
            walk(data, pathObj[name], result, name);
        });
    }

    /**
     * @module jsonpath-object-transform
     * @param {object} data
     * @param {object} path
     * @returns {object}
     */
    return function (data, path) {
        var result = {};

        walk(data, path, result);

        return result;
    };
});
