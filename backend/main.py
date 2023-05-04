from enum import Enum
from typing import Annotated, Optional
from fastapi import FastAPI, Query
from pydantic import BaseModel

from dotenv import load_dotenv

load_dotenv()

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


class CompletionSizeEnum(str, Enum):
    word = "word"
    sentence = "sentence"
    multiline = "multiline"

    def to_tokens(self):
        if self == CompletionSizeEnum.word:
            return 2
        elif self == CompletionSizeEnum.sentence:
            return 10
        elif self == CompletionSizeEnum.multiline:
            return 100


class CompletionIn(BaseModel):
    text: Annotated[str, Query(..., min_length=3, max_length=1000)]
    completionSize: CompletionSizeEnum


class CompletionOut(BaseModel):
    completion: str = None


@app.post("/completions", response_model=CompletionOut)
async def completions(completionRequest: CompletionIn):
    from langchain.schema import SystemMessage, HumanMessage
    from langchain.chat_models import ChatOpenAI

    chat = ChatOpenAI(
        max_tokens=completionRequest.completionSize.to_tokens(),
    )
    messages = [
        SystemMessage(
            content="You are a text predictor. The user will provide text and you will predict what they might want to say next. Only provide the text."
        ),
        HumanMessage(content=completionRequest.text),
    ]

    result = chat(messages)
    content = result.content
    return CompletionOut(completion=content)
