from abc import ABC, abstractmethod, abstractproperty

from google.cloud.firestore_v1.collection import CollectionReference 
from google.cloud.firestore_v1.document import DocumentReference
from firebase_admin import credentials, firestore
import firebase_admin

from tools import env
from json import loads


firebase_admin.initialize_app(credentials.Certificate(loads(env.TOKEN_DB)))



class _DataBase(ABC):
	def __init__(self, **kwargs):
		self._db = firestore.client()

		collection = kwargs["collection"]
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

	def __str__(self):
		return self.id

	@abstractproperty
	def id(self): ...
	@abstractmethod
	def set(self): ...
	@abstractmethod
	def delete(self): ...



class Collection(_DataBase):
	def __init__(self, **kwargs):
		super().__init__(
			collection = kwargs["collection"], 
			document = kwargs.get("document"),
			subcollection = kwargs.get("subcollection")
		)


	def __str__(self):
		return super().__str__()


	@property
	def id(self):
		if self._subcollection is not None:
			return self._subcollection.id

		return self._collection.id


	def documents(self, limit = None):
		if self._subcollection is not None: 
			for doc in self._subcollection.list_documents(limit):
				yield Document(
					collection = self._collection.id, 
					document = self._document.id, 
					subcollection = self._subcollection.id, 
					subdocument = doc.id
				)

		else: 
			for doc in self._collection.list_documents(limit):
				yield Document(collection = self._collection.id, document = doc.id)


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


	def where(self, filter, operation, value):
		if self._subcollection is not None: 
			for document in self._subcollection.where(str(filter), str(operation), value).stream():
				yield Document(
					collection = self._collection.id, 
					document = self._document.id,  
					subcollection = self._subcollection.id, 
					subdocument = document.id
				)

		else:
			for doc in self._collection.where(str(filter), str(operation), value).stream():
				yield Document(collection = self._collection.id, document = doc.id)



class Document(_DataBase):
	def __init__(self, **kwargs):
		subcollection = kwargs.get("subcollection")

		super().__init__(
			collection = kwargs["collection"], 
			document = kwargs["document"],
			subcollection = subcollection
		)

		if subcollection is not None:
			self._subdocument = self._subcollection.document(kwargs["subdocument"])

		else: self._subdocument = None


	def __str__(self) -> str:
		return super().__str__()


	@property
	def id(self): 
		if self._subdocument is not None: 
			return self._subdocument.id

		return self._document.id


	@property
	def exists(self):
		if self._subdocument is not None:
			return self._subdocument.get().exists

		return self._document.get().exists


	@property
	def content(self) -> dict: 
		if self._subdocument is not None:
			doc = self._subdocument.get()

		else: 
			doc = self._document.get()

		if doc.exists:
			return doc.to_dict()

		return None


	def subcollections(self, limit = None):
		for subcollection in self._document.collections(limit):
			yield Collection(
				collection = self._collection.id, 
				document = self._document.id, 
				subcollection = subcollection.id
			)


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


	def delete(self, camp = None, value = None, array = False):
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