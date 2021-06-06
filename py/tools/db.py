from firebase_admin import credentials, firestore
import firebase_admin

class ctx:
    firebase_admin.initialize_app(credentials.Certificate("src/firebase-key.json"))
    db = firestore.client()
    def __init__(self, collection):
        self.collection = self.db.collection(collection)

    def get(self, documnt, name = None): 
        doc = self.collection.document(documnt).get()
        if(doc.exists): 
            if(name != None):
                return doc.to_dict()[f"{name}"]
            else: return doc.to_dict()
        else: return False

    def where(self, filter, operation, value, compound_queries = False, filter2 = None, operation2 = None, value2 = None):
        if(compound_queries):
            return self.collection.where(f"{filter}", f"{operation}", f"{value}").where(f"{filter2}", f"{operation2}", f"{value2}").stream()
        else: return self.collection.where(f"{filter}", f"{operation}", f"{value}").stream()

    def update(self, documnt, name, value, array = False): 
        if(array): self.collection.document(documnt).update({f'{name}': firestore.firestore.ArrayUnion(value)})
        else: self.collection.document(documnt).update({f'{name}': value})

    def delete(self, array = False, camp = False, documnt = None, name = None, value = None): 
        if(array): self.collection.document(documnt).update({f'{name}': firestore.firestore.ArrayRemove(value)})
        elif(camp): self.collection.document(documnt).update({f'{name}': firestore.DELETE_FIELD})
        else: self.collection.document(documnt).delete()