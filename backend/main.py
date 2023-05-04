from enum import Enum
from typing import Annotated
from fastapi import APIRouter, FastAPI, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

load_dotenv()


def custom_generate_unique_id(route: APIRouter):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id,
    servers=[{"url": "http://127.0.0.1:8000", "description": "Local dev server"}],
)

origins = [
    "http://localhost",
    "http://localhost:1420",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
