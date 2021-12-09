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

import log, { AsyncLoggerMiddleware, LoggerMiddleware, LogType, NextFunction } from '@egomobile/log';
import { MongoDatabase } from '@egomobile/mongo';
import type { IMongoLogContext, IUseMongoLoggerOptions, MongoLogCollectionProvider, MongoLogDatabaseProvider, MongoLogDocumentFactory } from './types';

/**
 * The default name of the logs collection.
 */
export const defaultMongoCollection = 'logs';

/**
 * Creates a new middleware, that logs to a mongo database collection.
 *
 * @example
 * ```
 * import log, { consoleLogger as useConsoleLogger, useFallback, useMongoLogger } from "@egomobile/mongo-log"
 *
 * // reset the logger to configure it from scratch
 * log.reset()
 *
 * // use mongo logger as first middleware and console logger as a fallback
 * log.use(
 *   useFallback(
 *     useMongoLogger(),
 *     useConsoleLogger()
 *   )
 * )
 *
 * log("foo") // default: debug
 * log.debug("foo") // debug
 * log.error("foo") // error
 * log.warn("foo") // warning
 * log.info("foo") // information
 * log.trace("foo") // trace
 * ```
 *
 * @param {IUseMongoLoggerOptions|MongoLogDatabaseProvider|null|undefined} [optionsOrDatabase] The custom options or the database to use.
 *
 * @returns {AsyncLoggerMiddleware|LoggerMiddleware} The new middleware.
 */
export function useMongoLogger(optionsOrDatabase?: IUseMongoLoggerOptions | MongoLogDatabaseProvider | null | undefined): AsyncLoggerMiddleware | LoggerMiddleware {
    // setup with defaults
    let collectionProvider: MongoLogCollectionProvider = () => defaultMongoCollection;
    let dbProvider: MongoLogDatabaseProvider = () => MongoDatabase.open();
    let createLogDocument: MongoLogDocumentFactory = ({ args, time, type }) => ({
        args, time, type
    });

    if (optionsOrDatabase) {
        if (typeof optionsOrDatabase === 'function') {
            dbProvider = optionsOrDatabase as MongoLogDatabaseProvider;
        } else if (typeof optionsOrDatabase === 'object') {
            const { collection, database, documentFactory } = optionsOrDatabase as IUseMongoLoggerOptions;

            // database connection
            if (database) {
                if (typeof database === 'function') {
                    dbProvider = database as MongoLogDatabaseProvider;
                } else {
                    dbProvider = () => database as MongoDatabase;
                }
            }

            // name of collection
            if (collection) {
                if (typeof collection === 'string') {
                    collectionProvider = () => collection as string;
                } else if (typeof collection === 'function') {
                    collectionProvider = collection as MongoLogCollectionProvider;
                } else {
                    throw new TypeError('optionsOrDatabase.collection must be of type function or string');
                }
            }

            // document factory
            if (documentFactory) {
                if (typeof documentFactory === 'function') {
                    createLogDocument = documentFactory as MongoLogDocumentFactory;
                } else {
                    throw new TypeError('optionsOrDatabase.documentFactory must be of type function');
                }
            }
        } else {
            throw new TypeError('optionsOrDatabase must be of type function or object');
        }
    }

    return (type: LogType, args: any[], done?: NextFunction) => {
        const time = new Date();

        if (!done) {
            done = () => { };
        }

        const context: IMongoLogContext = {
            args,
            time,
            type
        };

        (async () => {
            // collect all data for the collection
            const connection = await Promise.resolve(dbProvider(context));
            const collectionName = await Promise.resolve(collectionProvider(context));
            const document = await Promise.resolve(createLogDocument(context));

            await connection.withClient(async (client, db) => {
                const collection = db.collection(collectionName);

                await collection.insertOne(document);
            });
        })().then(() => {
            done!();
        }).catch(error => {
            done!(error);
        });
    };
}

// also export anything from @egomobile/log
export * from '@egomobile/log';

// make default logger instance available as
// default export
export default log;
