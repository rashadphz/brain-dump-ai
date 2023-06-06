from abc import ABC, abstractmethod
from uuid import uuid4
from fastapi import UploadFile

from langchain.chains import RetrievalQAWithSourcesChain
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.schema import Document
import pinecone


def ingest_note(markdown: str, note_id: str, note_title: str) -> str:
    embeddings = OpenAIEmbeddings(
        client=None,
        model="text-embedding-ada-002",
    )
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=50,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )

    metadatas = [
        {
            "source": note_id,
            "title": note_title,
        }
    ] * len(markdown)

    splitted_documents = text_splitter.create_documents(
        texts=[markdown],
        metadatas=metadatas,
    )
    Pinecone.from_documents(
        documents=splitted_documents,
        embedding=embeddings,
        index_name="langchain",
        namespace="rashad-notes",
    )
    return note_id


def smart_search_notes(query: str) -> list[str]:
    embeddings = OpenAIEmbeddings(
        client=None,
        model="text-embedding-ada-002",
    )
    vectorstore = Pinecone.from_existing_index(
        index_name="langchain", embedding=embeddings, namespace="rashad-notes"
    )
    results = vectorstore.similarity_search(
        query=query,
        k=2,
    )
    sources = [result.metadata["source"] for result in results]
    # remove non-strings
    sources = [source for source in sources if isinstance(source, str)]
    return sources


class ChatQuery:
    def __init__(self) -> None:
        self.embeddings = OpenAIEmbeddings(
            client=None,
            model="text-embedding-ada-002",
        )
        self.llm = ChatOpenAI(client=None, model_name="gpt-3.5-turbo", temperature=0)
        self.vectorstore = Pinecone.from_existing_index(
            index_name="langchain", embedding=self.embeddings, namespace="rashad-notes"
        )
        self.qa = RetrievalQAWithSourcesChain.from_llm(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(),
        )

    def ask(self, query: str) -> str:
        result = self.qa(
            {
                "question": query,
            },
            return_only_outputs=True,
        )
        print(result)
        return result["answer"]
