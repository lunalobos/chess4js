import { Logger } from "./Logger.js";
const level = "debug";
const loggers = new Map();

/**
 * Retrieves or creates a logger instance with the specified name.
 *
 * If a logger with the given name does not exist, a new Logger
 * instance is created, stored, and returned. If it exists, the
 * existing instance is returned.
 *
 * @param {string} name - The name of the logger to retrieve or create.
 * @returns {Logger} The logger instance associated with the specified name.
 */

export function getLogger(name) {
	let logger;
	if (!loggers.has(name)) {
		logger = new Logger(name, level);
		loggers.set(name, logger);
		return logger;
	} else {
		return loggers.get(name);
	}
}
