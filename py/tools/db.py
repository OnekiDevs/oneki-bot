from abc import ABC, abstractmethod, abstractproperty

from google.cloud.firestore_v1.collection import CollectionReference 
from google.cloud.firestore_v1.document import DocumentReference
from firebase_admin import credentials, firestore
import firebase_admin

firebase_admin.initialize_app(credentials.Certificate("src/firebase-key.json"))

class _DataBase(ABC):
	def __init__(self, **kwargs):
		self._db = firestore.client()

		collection = kwargs.pop("collection")
		document = kwargs.get("document")
		subcollection = kwargs.get("subcollection")

		self._collection: CollectionReference = self._db.collection(collection)

		# Se proporciono un documento ?
		if document is not None:
			self._document: DocumentReference = self._collection.document(document)
		else: self._document = None

		# Se proporciono una subcoleccion ?
		if (subcollection is not None):
			self._subcollection: CollectionReference = self._document.collection(subcollection)
		else: self._subcollection = None

	@abstractproperty
	def id(self): ...
	@abstractmethod
	def set(self): ...
	@abstractmethod
	def delete(self): ...




class Collection(_DataBase):
	def __init__(self, **kwargs):
		super().__init__(
			collection = kwargs.pop("collection"), 
			document = kwargs.get("document"),
			subcollection = kwargs.get("subcollection")
		)


	@property
	def id(self):
		if self._subcollection is not None:
			return self._subcollection.id
		return self._collection.id


	def documents(self, limit = None) -> tuple:
		_list = []
		if self._subcollection is not None: 
			for doc in self._subcollection.list_documents(limit):
				_list.append(Document(
					collection = self._collection.id, 
					document = self._document.id, 
					subcollection = self._subcollection.id, 
					subdocument = doc.id
				))
		else: 
			for doc in self._collection.list_documents():
				_list.append(Document(collection = self._collection.id, document = doc.id))
		return tuple(_list)


	def document(self, document): 
		if self._subcollection is not None:
			return Document(
				collection = self._collection.id,
				document = self._document.id,
				subcollection = self._subcollection.id, 
				subdocument = document
			)
		else: 
			return Document(collection = self._collection.id, document = document)


	def set(self, id: str, **kwargs): 
		if self._subcollection is not None: 
			self._subcollection.add(kwargs, id)
		else: 
			self._collection.add(kwargs, id)


	def delete(self):
		if self._subcollection is not None:
			for document in self._subcollection.list_documents():
				document.delete()
		else: 
			for document in self._collection.list_documents():
				for subcollection in document.collections():
					for doc in subcollection.list_documents():
						doc.delete()
				document.delete()
		# for doc in self._collection.stream():
		# 	document = Document(self._collection.id, doc.id)
		# 	for _doc in document.subcollections():
				
		# 		_doc.delete()


	def where(self, filter, operation, value):
		_list = []
		if self._subcollection is not None: 
			for document in self._subcollection.where(str(filter), str(operation), value).stream():
				print(document)
				_list.append(Document(
					collection = self._collection.id, 
					document = self._document.id,  
					subcollection = self._subcollection.id, 
					subdocument = document.id
				))
		else:
			for doc in self._collection.where(str(filter), str(operation), value).stream():
				_list.append(Document(collection = self._collection.id, document = doc.id))
		return _list




class Document(_DataBase):
	def __init__(self, **kwargs):
		subcollection = kwargs.get("subcollection")

		super().__init__(
			collection = kwargs.pop("collection"), 
			document = kwargs.pop("document"),
			subcollection = subcollection
		)

		if subcollection is not None:
			self._subdocument = self._subcollection.document(kwargs.pop("subdocument"))
		else: self._subdocument = None


	@property
	def id(self): 
		if self._subdocument is not None: 
			return self._subdocument.id
		return self._document.id


	@property
	def exists(self):
		if self._subdocument is not None:
			return self._subdocument.get().exists
		else: return self._document.get().exists


	@property
	def content(self) -> dict: 
		if self._subdocument is not None:
			doc = self._subdocument.get()
		else: doc = self._document.get()

		if doc.exists:
			return doc.to_dict()
		else: return None


	def subcollections(self, limit = None) -> tuple:
		_list = []
		for subcollection in self._document.collections(limit):
			_list.append(Collection(
				collection = self._collection.id, 
				document = self._document.id, 
				subcollection = subcollection.id
			))
		return tuple(_list)


	def set(self, **kwargs): 
		if self._subdocument is not None: 
			self._subdocument.set(kwargs)
		else: 
			self._document.set(kwargs)


	def update(self, camp, value, array = False):
		if self._subdocument is not None:
			if array: 
				self._subdocument.update({f'{camp}' : firestore.firestore.ArrayUnion([value])})
			else: self._subdocument.update({f'{camp}' : value})
		else:
			if array: 
				self._document.update({f'{camp}': firestore.firestore.ArrayUnion([value])})
			else: self._document.update({f'{camp}': value})


	def delete(self, camp = None, array = False, value = None):
		if self._subdocument is not None: 
			if camp is not None:
				if array: 
					self._subdocument.update({f"{camp}" : firestore.firestore.ArrayRemove([value])})
				else: 
					self._subdocument.update({f"{camp}" : firestore.firestore.DELETE_FIELD})
			else: self._subdocument.delete()
		else: 
			if camp is not None: 
				if array:
					self._document.update({f'{camp}': firestore.firestore.ArrayRemove([value])})
				else:
					self._document.update({f'{camp}': firestore.firestore.DELETE_FIELD})
			else: self._document.delete()




# def get(collection, document = None, subcollection = None, subdocument = None) -> Document or Collection: 
# 	if subcollection is not None:
# 		if subdocument is not None:
# 			return Document(
# 				collection = collection, 
# 				document = document, 
# 				subcollection = subcollection, 
# 				subdocument = subdocument
# 			)
# 		else: 
# 			return Collection(collection = collection, document = document, subcollection = subcollection)
# 	else: 
# 		if document is not None:
# 			return Document(collection = collection, document = document)
# 		else: return Collection(collection = collection)



# Clase por eliminar
class ctx:
	#firebase_admin.initialize_app(credentials.Certificate("src/firebase-key.json"))
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

	def get_subcollection(self, documnt, subcollection, batch_size):
		docs = self.collection.document(documnt).collection(subcollection).limit(batch_size).stream()
		lista = []
		for doc in docs:
			lista.append(doc.id)
		return lista

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