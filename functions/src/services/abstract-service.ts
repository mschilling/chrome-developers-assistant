export abstract class CoreService {
  db: FirebaseFirestore.Firestore;

  constructor(db) {
    this.db = db;
  }

  wrapAll<T>(snapshot: FirebaseFirestore.QuerySnapshot): T[] {
    const docs: T[] = [];
    for (const doc of snapshot.docs) {
      docs.push(<T>doc.data());
    }
    return docs;
  }
}
