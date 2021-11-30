// This file is part of the @egomobile/mongo-log distribution.
// Copyright (c) Next.e.GO Mobile SE, Aachen, Germany (https://e-go-mobile.com/)
//
// @egomobile/mongo-log is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation, version 3.
//
// @egomobile/mongo-log is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import { LogType } from '@egomobile/log';
import type { MongoDatabase } from '@egomobile/mongo';


/**
 * The log context.
 */
export interface IMongoLogContext {
    /**
     * The arguments of the log.
     */
    args: any[];
    /**
     * The timestamp.
     */
    time: Date;
    /**
     * The log type.
     */
    type: LogType;
}

/**
 * Options for 'useMongoLogger()' function.
 */
export interface IUseMongoLoggerOptions {
    /**
     * The name of the custom collection ot use or the function, that provides it.
     */
    collection?: string | MongoLogCollectionProvider;
    /**
     * The custom database connection to use or the function, that provides it.
     */
    database?: MongoDatabase | MongoLogDatabaseProvider | null | undefined;
    /**
     * A custom function, that creates the document for the Mongo collection.
     */
    documentFactory?: MongoLogDocumentFactory | null | undefined;
}

/**
 * Provides the name of the log collection.
 *
 * @param {IMongoLogContext} context The log context.
 *
 * @returns {string|PromiseLike<string>} The name or the promise with it.
 */
export type MongoLogCollectionProvider = (context: IMongoLogContext) => string | PromiseLike<string>;

/**
 * A function, that provides the database connection.
 *
 * @param {IMongoLogContext} context The log context.
 *
 * @returns {MongoDatabase|PromiseLike<MongoDatabase>} The database connection or the promise with it.
 */
export type MongoLogDatabaseProvider = (context: IMongoLogContext) => MongoDatabase | PromiseLike<MongoDatabase>;

/**
 * A function, that creates the Mongo document for the log message / context.
 *
 * @param {IMongoLogContext} context The log context.
 *
 * @returns {any} The document or the promise with it.
 */
export type MongoLogDocumentFactory = (context: IMongoLogContext) => any;
