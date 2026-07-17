#Step 1 Added NEW CODE USING FASTAPI 7/1/2026 LL

import os
import json


import instructor
from openai import OpenAI
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from psycopg2.errors import UniqueViolation

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from schemas import BetaSignupRequest
from database import get_connection

from models import CurriculumAIOutput
from prompts import SYSTEM_PROMPT
from database import save_curriculum_to_database

import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart




load_dotenv()

client = instructor.from_openai(OpenAI())

app = FastAPI(title="Curriculum Studio API")

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CurriculumRequest(BaseModel):
    learning_objective: str
    subject: str
    course_level: str
    duration_weeks: int
    organization_id: int = 1


@app.post("/api/beta-signup")
def join_beta_program(signup: BetaSignupRequest):
    email = str(signup.email).strip().lower()

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO beta_signup (email)
            VALUES (%s)
            RETURNING id, email, status, created_at;
            """,
            (email,)
        )

        new_signup = cursor.fetchone()
        connection.commit()

        send_beta_thank_you_email(email)

        return {
            "message": "You have successfully joined the beta program.",
            "signup": {
                "id": new_signup[0],
                "email": new_signup[1],
                "status": new_signup[2],
                "created_at": new_signup[3]
            }
        }

    except UniqueViolation:
        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=409,
            detail="This email address is already on the beta list."
        )

    except Exception as error:
        if connection:
            connection.rollback()

        print(f"Beta signup error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to join the beta program at this time."
        )

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()



def send_beta_thank_you_email(user_email: str) -> None:
    sender_email = os.getenv("EMAIL_ADDRESS")
    email_password = os.getenv("EMAIL_PASSWORD")

    if not sender_email or not email_password:
        raise ValueError("Email credentials are not configured.")

    subject = "Thank You for Joining the Curriculum Studio Beta Program"

    body = """
Hello,

Thank you for joining the Curriculum Studio beta program!

We appreciate your interest in Curriculum Studio. More information, product updates,
and details about the curriculum application will be shared with you soon.

Thank you again for being part of our beta community.

Best regards,

The Curriculum Studio Team
"""

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = user_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, email_password)
        server.send_message(message)




@app.get("/")
def home():
    return {"message": "Curriculum Studio API is running"}


def generate_curriculum(
        learning_objective: str,
        subject: str,
        course_level: str,
        duration_weeks: int
) -> CurriculumAIOutput:

    curriculum = client.chat.completions.create(
        model="gpt-4o-mini",
        response_model=CurriculumAIOutput,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": f"""
Create a structured curriculum using the following information.

Learning Objective:
{learning_objective}

Subject:
{subject}

Course Level:
{course_level}

Duration:
{duration_weeks} weeks

Requirements:
- Create modules.
- Create daily lesson plans.
- Each lesson must include classroom activities.
- Each activity must include start_time and end_time.
- Include one assessment.
- Include one grading rubric.
- Keep the curriculum beginner-friendly.
- Use language appropriate for adult learners.
"""
            }
        ]
    )

    return curriculum


def curriculum_to_markdown(curriculum: CurriculumAIOutput) -> str:
    markdown = f"""
# {curriculum.course_title}

**Subject:** {curriculum.subject}  
**Course Level:** {curriculum.course_level}  
**Duration:** {curriculum.duration_weeks} weeks  

## Course Description

{curriculum.description}

---

## Weekly Modules
"""

    for module in curriculum.modules:
        markdown += f"""

### Week {module.week_number}: {module.title}

**Learning Objective:** {module.learning_objective}
"""

        for lesson in module.lessons:
            markdown += f"""

#### Day {lesson.day_number}: {lesson.lesson_title}

**Duration:** {lesson.duration_minutes} minutes  
**Learning Objective:** {lesson.learning_objective}

**Lesson Content:**  
{lesson.lesson_content}

**Warm-Up:**  
{lesson.warm_up}

**Code Demo:**  
{lesson.code_demo}

**Guided Practice:**  
{lesson.guided_practice}

**Independent Practice:**  
{lesson.independent_practice}

**Exit Ticket:**  
{lesson.exit_ticket}

##### Activities

| Activity | Type | Start | End | Duration | Instructions |
|---|---|---|---|---:|---|
"""

            for activity in lesson.activities:
                markdown += (
                    f"| {activity.activity_title} "
                    f"| {activity.activity_type} "
                    f"| {activity.start_time} "
                    f"| {activity.end_time} "
                    f"| {activity.duration_minutes} "
                    f"| {activity.instructions} |\n"
                )

    markdown += f"""

---

## Assessment

### {curriculum.assessment.title}

**Type:** {curriculum.assessment.assessment_type}  
**Points Possible:** {curriculum.assessment.points_possible}  

**Instructions:**  
{curriculum.assessment.instructions}

### Questions

"""

    for index, question in enumerate(curriculum.assessment.questions, start=1):
        markdown += f"{index}. **Question:** {question.question}\n"
        markdown += f"   **Answer:** {question.answer}\n\n"

    markdown += f"""

---

## Rubric

### {curriculum.rubric.title}

| Category | Points | Description |
|---|---:|---|
"""

    for criterion in curriculum.rubric.criteria:
        markdown += f"| {criterion.category} | {criterion.points} | {criterion.description} |\n"

    return markdown


@app.post("/generate-curriculum")
def generate_curriculum_endpoint(request: CurriculumRequest):
    curriculum = generate_curriculum(
        learning_objective=request.learning_objective,
        subject=request.subject,
        course_level=request.course_level,
        duration_weeks=request.duration_weeks
    )

    save_curriculum_to_database(
        curriculum,
        organization_id=request.organization_id
    )

    markdown = curriculum_to_markdown(curriculum)

    return {
        "curriculum": markdown,
        "data": curriculum.model_dump()
    }




if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=10000)


