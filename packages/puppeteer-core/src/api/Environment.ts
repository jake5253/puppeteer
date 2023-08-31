import {CDPSession} from '../common/Connection.js';

import {Realm} from './Realm.js';

/**
 * @internal
 */
export interface Environment {
  get client(): CDPSession;
  mainRealm(): Realm;
}
