import Datastore from "nestdb";

export const db = new Datastore({ filename: "project.db", autoload: true });
