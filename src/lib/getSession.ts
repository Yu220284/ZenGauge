import { SESSIONS } from './data';

export function getSession(id: string) {
  return SESSIONS.find(session => session.id === id);
}