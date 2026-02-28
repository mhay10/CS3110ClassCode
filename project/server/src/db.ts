import Datastore from "nedb";

export const db = new Datastore({ filename: "../project.db", autoload: true });

export function createTournament(db: Datastore): void {}

export function getTournaments(db: Datastore): void {}

export function updateTournament(db: Datastore): void {}
