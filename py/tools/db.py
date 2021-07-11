from firebase_admin import credentials, firestore, threading
import firebase_admin

class ctx:
    firebase_admin.initialize_app(credentials.Certificate("src/firebase-key.json"))
    db = firestore.client()
    def __init__(self, collection):
        # Docu
        """
        Clase que recibe como parametro la colección a la que se quiere entrar
        
        Mas información en:
        ------------------
        https://discord.com/channels/825936007449935903/849325692252061696/852408021513666583
        """
        # Code
        self.collection = self.db.collection(collection)

    def set(self, documnt, values, subcollection = None, subdocumnt = None):
        # Docu
        """
        Un método para crear documentos

        Argumentos:
        ----------
        `documnt` --> nombre del nuevo documento
        `values`  --> el valor del argumento

        Mas información en:
        ------------------
        https://discord.com/channels/825936007449935903/849325692252061696/858897254558728212
        """
        # Code
        if(subcollection != None and subdocumnt != None):
            self.collection.document(documnt).collection(subcollection).document(subdocumnt).set(values)
        else: self.collection.document(documnt).set(values)

    def get(self, documnt, camp = None, subcollection = None, subdocumnt = None): 
        # Docu
        """
        Metodo para obtener datos de una colección 
        
        Argumentos:
        ----------
        
        `documnt`       ---> el nombre del documento
        
        `camp`          ---> el campo que se quiere obtener del documento (opcional)
        
        `subcollection` ---> la subcolección del documento (opcional)
        
        `subdocumnt`    ---> el nombre del documento que hay en la subcolección (obligatorio si se especifico una subcolección)
        
        Mas información en:
        ------------------
        https://discord.com/channels/825936007449935903/849325692252061696/852408052539195422
        """
        # Code
        try:
            doc = self.collection.document(documnt)
            if(camp != None):
                if(subcollection != None): 
                    subdocument = doc.collection(subcollection).document(subdocumnt).get()
                    if(subdocument.exists):
                        return subdocument.to_dict()[f"{camp}"]
                    else: return None
                else:
                    if(doc.get().exists): 
                        return doc.get().to_dict()[f"{camp}"]
                    else: return None
            else: 
                if(subcollection != None): 
                    subdocument = doc.collection(subcollection).document(subdocumnt).get()
                    if(subdocument.exists):
                        return subdocument.to_dict()
                    else: return None
                else:
                    if(doc.get().exists): 
                        return doc.get().to_dict()
                    else: return None
        except(KeyError): return None

    def update(self, documnt, camp, value, subcollection = None, subdocumnt = None, array = False): 
        """
        Metodo para actualizar capos de un documento o subdocumento
        
        Argumentos:
        ----------
        `documnt`       --> el nombre del documento (obligatorio)
        
        `camp`          --> el nombre del valor por cambiar (obligatorio)
        
        `value`         --> el valor por cambiar (obligatorio)
        
        `subcollection` --> el nombre de la subcolección, si se quiere actualizar el documento de una subcolección indicara su nombre en este argumento (opcional)
        
        `subdocumnt`    --> el nombre del documento en la subcolección (opcional pero si se brinda una subcolección se tendrá que especificar o no funcionara)
        
        `array`         --> agregar un valor a un array, por defecto es `false` (opcional)
        
        Mas información en:
        ------------------
        https://discord.com/channels/825936007449935903/849325692252061696/852408093861609493
        """
        if(subcollection != None and subdocumnt != None): 
            if(array): 
                self.collection.document(documnt).collection(subcollection).document(subdocumnt).update({f'{camp}' : firestore.firestore.ArrayUnion([value])})
            else: self.collection.document(documnt).collection(subcollection).document(subdocumnt).update({f'{camp}' : value})
        elif(array): self.collection.document(documnt).update({f'{camp}': firestore.firestore.ArrayUnion([value])})
        else: self.collection.document(documnt).update({f'{camp}': value})

    def delete(self, documnt, camp = None, value = None, subcollection = None, subdocumnt = None, array = False): 
        # Docu
        """
        Metodo para borrar documentos, campos, subdocumentos y elementos de un array
        
        Argumentos:
        ----------
        `documnt`       --> el nombre del documento (obligatorio)
        
        `camp`          --> el nombre del valor por eliminar (opcional)
        
        `value`         --> el valor por eliminar en un array (opcional aunque obligatorio cuando array tiene el valor `true`)
        
        `subcollection` --> el nombre de la subcolección, si se quiere eliminar el documento de una subcolección indicara su nombre en este argumento (opcional)
        
        `subdocumnt`    --> el nombre del documento en la subcolección (opcional pero si se brinda una subcolección se tendrá que especificar o no funcionara)
        
        `array`         --> eliminar un valor a un array, por defecto es `false` (opcional)
        
        Mas información en:
        ------------------
        https://discord.com/channels/825936007449935903/849325692252061696/852408141517029386
        """
        # Code
        doc = self.collection.document(documnt)
        if(subcollection != None and subdocumnt != None): 
            if(array): 
                doc.collection(subcollection).document(subdocumnt).update({f'{camp}': firestore.firestore.ArrayRemove([value])})
            elif(camp != None):
                doc.collection(subcollection).document(subdocumnt).update({f'{camp}': firestore.firestore.DELETE_FIELD})
            else: doc.collection(subcollection).document(subdocumnt).delete()
        elif(array): doc.update({f'{camp}': firestore.firestore.ArrayRemove([value])})
        elif(camp != None): doc.update({f'{camp}': firestore.firestore.DELETE_FIELD})
        else: doc.delete()

    def delete_subcollection(self, documnt, subcollection, batch_size):
        docs = self.collection.document(documnt).collection(subcollection).limit(batch_size).stream()
        deleted = 0
        for doc in docs:
            doc.reference.delete()
            deleted = deleted + 1
        if deleted >= batch_size:
            return self.delete_subcollection(batch_size)

    def where(self, filter, operation, value, compound_queries = False, filter2 = None, operation2 = None, value2 = None):
        """
        Metodo para hacer consultas en la colección

        Mas información en:
        ------------------
        https://discord.com/channels/825936007449935903/849325692252061696/852408181640658944
        """
        if(compound_queries):
            return self.collection.where(f"{filter}", f"{operation}", f"{value}").where(f"{filter2}", f"{operation2}", f"{value2}").stream()
        else: return self.collection.where(f"{filter}", f"{operation}", f"{value}").stream()