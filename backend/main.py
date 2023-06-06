from enum import Enum
import openai
import os
import pinecone
from typing import Annotated, Union
from fastapi import FastAPI, File, Query, UploadFile
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from llm import ChatQuery, ingest_note
from fastapi.routing import APIRoute

load_dotenv()


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
    servers=[{"url": "http://127.0.0.1:8000", "description": "Local dev server"}],
)

origins = [
    "http://localhost:3000",
    "http://localhost:1420",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")
model_name = "text-embedding-ada-002"

index_name = "langchain"
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV")  # type: ignore
)


class PredictionSizeEnum(str, Enum):
    word = "word"
    sentence = "sentence"
    multiline = "multiline"

    def to_tokens(self):
        if self == PredictionSizeEnum.word:
            return 2
        elif self == PredictionSizeEnum.sentence:
            return 10
        elif self == PredictionSizeEnum.multiline:
            return 100


class PredictionIn(BaseModel):
    text: Annotated[str, Query(..., min_length=3, max_length=10000)]
    predictionSize: PredictionSizeEnum


class PredictionOut(BaseModel):
    prediction: Annotated[str, Query(...)]


@app.post("/prediction/", response_model=PredictionOut, tags=["prediction"])
async def make_prediction(completionRequest: PredictionIn):
    from langchain.schema import SystemMessage, HumanMessage
    from langchain.chat_models import ChatOpenAI

    chat = ChatOpenAI(
        client=None,
        max_tokens=completionRequest.predictionSize.to_tokens(),
    )
    messages = [
        SystemMessage(
            content="I want you to act as a text completer. I will give you markdown text, you will simply output the markdown text that is most likely to follow."
        ),
        HumanMessage(content=completionRequest.text),
    ]

    result = chat(messages)
    content = result.content
    return PredictionOut(prediction=content)


class SourceInfo(BaseModel):
    source_id: str
    num_bytes: int
    filename: str
    display_name: str


class UploadOutSchema(BaseModel):
    type: str
    sourceInfo: SourceInfo


class NoteSchema(BaseModel):
    note_id: str
    title: str
    markdown: str


@app.post("/upload-note/", tags=["upload"], response_model=UploadOutSchema)
def upload_note(note: NoteSchema):
    source_id = ingest_note(note.markdown, note.note_id, note.title)
    return UploadOutSchema(
        type="ok",
        sourceInfo=SourceInfo(
            source_id=source_id,
            num_bytes=len(note.markdown),
            filename=note.title,
            display_name=note.title,
        ),
    )


class ChatMessageSchema(BaseModel):
    id: str
    author: str
    message: str
    timestamp: str


class ChatInSchema(BaseModel):
    history: list[ChatMessageSchema]


@app.post("/chat/", tags=["chat"])
def send_chat_message(chat_in: ChatInSchema):
    history = chat_in.history
    query_obj = ChatQuery()
    message = history[-1].message
    result = query_obj.ask(message)
    return result


@app.get("/smart-search/", tags=["smart-search"])
def smart_search(query: str) -> list[str]:
    from llm import smart_search_notes

    docs = smart_search_notes(query)
    print(docs)
    return docs


async def main():
    return {"message": "Hello World"}
