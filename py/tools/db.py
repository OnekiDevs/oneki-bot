from firebase_admin import credentials, firestore, threading
import firebase_admin

class ctx:
    firebase_admin.initialize_app(credentials.Certificate("src/firebase-key.json"))
    db = firestore.client()
    def __init__(self, collection):
        self.collection = self.db.collection(collection)

    def get(self, documnt, camp = None, subcollection = None, subdocumnt = None): 
        doc = self.collection.document(documnt)
        if(camp != None):
            if(subcollection != None): 
                subdocument = doc.collection(subcollection).document(subdocumnt).get()
                if(subdocument.exists):
                    return subdocument.to_dict()[f"{camp}"]
                else: return False
            else:
                if(doc.get().exists): 
                    return doc.get().to_dict()[f"{camp}"]
                else: return False
        else: 
            if(subcollection != None): 
                subdocument = doc.collection(subcollection).document(subdocumnt).get()
                if(subdocument.exists):
                    return subdocument.to_dict()
                else: return False
            else:
                if(doc.get().exists): 
                    return doc.get().to_dict()
                else: return False

    def where(self, filter, operation, value, compound_queries = False, filter2 = None, operation2 = None, value2 = None):
        if(compound_queries):
            return self.collection.where(f"{filter}", f"{operation}", f"{value}").where(f"{filter2}", f"{operation2}", f"{value2}").stream()
        else: return self.collection.where(f"{filter}", f"{operation}", f"{value}").stream()

    def update(self, documnt, camp, value, array = False): 
        if(array): self.collection.document(documnt).update({f'{camp}': firestore.firestore.ArrayUnion(value)})
        else: self.collection.document(documnt).update({f'{camp}': value})

    def delete(self, documnt, array = False, camp = False, campo = None, value = None, subcollection = None, subdocumnt = None): 
        if(array): self.collection.document(documnt).update({f'{campo}': firestore.firestore.ArrayRemove(value)})
        elif(camp): self.collection.document(documnt).update({f'{campo}': firestore.DELETE_FIELD})
        elif(subcollection != None and subdocumnt != None): 
            if(campo != None):
                self.collection.document(documnt).collection(subcollection).document(subdocumnt).update({f'{campo}': firestore.DELETE_FIELD})
            else: self.collection.document(documnt).collection(subcollection).document(subdocumnt).delete()
        else: self.collection.document(documnt).delete()
    def detect_change(self, documnt, metode):
        a = threading.Event()
        pass