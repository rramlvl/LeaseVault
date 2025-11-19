import os
from dotenv import load_dotenv
from openai import OpenAI


# Load variables from .env file into environment
load_dotenv()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))