let _db: FirebaseFirestore.Firestore;

export class Firestore {
  static initialize(instance: FirebaseFirestore.Firestore) {
    _db = instance;
  }

  static get db(): FirebaseFirestore.Firestore {
    //error handling; null check
    return _db;
  }
}

