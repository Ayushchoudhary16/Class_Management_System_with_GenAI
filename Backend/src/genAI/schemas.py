from pydantic import BaseModel

class GenAISchema(BaseModel):
    prompt: str