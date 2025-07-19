/*
* Copyright 2025 Miguel Angel Luna Lobos
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
import { Bean } from "./Bean.js";

const levels = new Map();
levels.set("trace", 0);
levels.set("debug", 1);
levels.set("info", 2);
levels.set("warn", 3);
levels.set("error", 4);
levels.set("fatal", 4);

/**
 * Basic logging class.
 */
export class Logger {

    #name;
    #level;

    /**
     * 
     * @param {string} name 
     * @param {string} level 
     */
    constructor(name, level) {
        this.#name = name;
        this.#level = level;
    }

    /**
     * 
     * @param {string} msg 
     */
    #append(msg) {
        console.log(msg.trim());
    }

    /**
     * 
     * @param {string} msg 
     * @param {string} level
     * @returns {string}
     */
    #format(msg, level) {
        return `[${level.toUpperCase()}] ${new Date().toISOString()} - ${this.#name} : ${msg}`;
    }

    /**
     * 
     * @param {string} msg 
     * @param {string} level
     */
    #sendMsg(msg, level) {
        this.#append(this.#format(msg, level));
    }

    /**
     * 
     * @param {string} level 
     */
    #check(level){
        return levels.get(level) >= levels.get(this.#level);
    }

    /**
     * 
     * @param {string} msg 
     * @param {string} level 
     */
    #log(msg, level){
        if (this.#check(level)) {
            this.#sendMsg(msg, level);
        }
    }

    /**
     * Logs a message at the trace level.
     * @param {string} msg - The message to be logged.
     */
    trace(msg) {
        this.#log(msg, "trace");
    }

    /**
     * Logs a message at the debug level.
     * @param {string} msg - The message to be logged.
     */
    debug(msg){
        this.#log(msg, "debug");
    }

    /**
     * Logs a message at the info level.
     * @param {string} msg - The message to be logged.
     */
    info(msg){
        this.#log(msg, "info");
    }

    /**
     * Logs a message at the warn level.
     * @param {string} msg - The message to be logged.
     */
    warn(msg){
        this.#log(msg, "warn");
    }

    /**
     * Logs a message at the error level.
     * @param {string} msg - The message to be logged.
     */
    error(msg){
        this.#log(msg, "error");
    }

    /**
     * Logs a message at the fatal level.
     * @param {string} msg - The message to be logged.
     */
    fatal(msg){
        this.#log(msg, "fatal");
    }

    /**
     * Logs a message at the debug level when this Logger instance is created.
     * The message is of the form "ClassName created", where ClassName is the
     * name of the class that created this Logger instance.
     */
    instantiation() {
        this.debug(`${this.#name} created`);
    }
}