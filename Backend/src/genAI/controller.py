from langchain.chat_models import init_chat_model
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain.agents import create_agent
from dotenv import load_dotenv
import os

load_dotenv()


db = SQLDatabase.from_uri(
    "postgresql+psycopg2://postgres:Ayushsql@localhost:5433/ClassManagementSystem"
)


# STUDENT AI
def generate_student_ai_chat(body):
    llm = init_chat_model(
        model="qwen/qwen3-32b",
        model_provider="groq",
        api_key=os.getenv("GROQ_API_KEY")
    )

    system_prompt = """
    You are a STUDENT AI assistant.

    You can:
    - Help with studies
    - Answer academic questions
    - Guide about courses

    You CANNOT:
    - Access database
    - Give admin data
    """

    response = llm.invoke([
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": body.prompt}
    ])

    return {
        "status": "ok",
        "role": "student",
        "answer": response.content
    }

# ADMIN AI
def generate_admin_ai_chat(body):
    llm = init_chat_model(
        model="qwen/qwen3-32b",
        model_provider="groq",
        api_key=os.getenv("GROQ_API_KEY")
    )

    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    tools = toolkit.get_tools()

    system_prompt = """
        You are a STRICT ADMIN AI for a Class Management System.

        RULES:
        - Always use SQL tools for database queries
        - Only SELECT queries allowed
        - Never UPDATE, DELETE, DROP, INSERT
        - Always fetch real database data
        - Limit maximum 5 rows

        IMPORTANT:
        You MUST always return response in VALID JSON format.

        Response JSON format:

        {
        "status": "success",
        "module": "attendance",
        "summary": "short summary",
        "total_records": 0,
        "data": [],
        "suggestions": []
        }

        Rules for JSON:
        - summary = short explanation
        - total_records = integer
        - data = actual records list
        - suggestions = improvement tips list
        - Never return plain text
        - Never add markdown
        - Output must be valid JSON only
        """

    agent = create_agent(llm, tools, system_prompt=system_prompt)

    response = agent.invoke({
        "messages": [
            {"role": "user", "content": body.prompt}
        ]
    })

    final_answer = response["messages"][-1].content

    return {
        "status": "ok",
        "role": "admin",
        "answer": final_answer
    }