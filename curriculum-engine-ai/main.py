#Step 1 Added NEW CODE USING FASTAPI 7/1/2026 LL

import os
import json

import instructor
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import CurriculumAIOutput
from prompts import SYSTEM_PROMPT
from database import save_curriculum_to_database


load_dotenv()

client = instructor.from_openai(OpenAI())

app = FastAPI(title="Curriculum Studio API")

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

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






#ORIGINAL CODE THAT WORKS WELL MODIFIED 7/1/2026 LL
# import json
# import instructor
#
# from openai import OpenAI
# from dotenv import load_dotenv
#
# from models import CurriculumAIOutput
# from prompts import SYSTEM_PROMPT
# from database import save_curriculum_to_database
#
#
# # from fastapi import FastAPI
#
# load_dotenv()
#
# client = instructor.from_openai(OpenAI())
#
#
#
# def generate_curriculum(
#         learning_objective: str,
#         subject: str,
#         course_level: str,
#         duration_weeks: int
# ) -> CurriculumAIOutput:
#
#     curriculum = client.chat.completions.create(
#         model="gpt-4o-mini",
#         response_model=CurriculumAIOutput,
#         messages=[
#             {
#                 "role": "system",
#                 "content": SYSTEM_PROMPT
#             },
#             {
#                 "role": "user",
#                 "content": f"""
# Create a structured curriculum using the following information.
#
# Learning Objective:
# {learning_objective}
#
# Subject:
# {subject}
#
# Course Level:
# {course_level}
#
# Duration:
# {duration_weeks} weeks
#
# Requirements:
# - Create modules.
# - Create daily lesson plans.
# - Each lesson must include classroom activities.
# - Each activity must include start_time and end_time.
# - Include one assessment.
# - Include one grading rubric.
# - Keep the curriculum beginner-friendly.
# - Use language appropriate for adult learners.
# """
#             }
#         ]
#     )
#
#     return curriculum
#
#
# if __name__ == "__main__":
#     curriculum = generate_curriculum(
#         learning_objective="Students will explain what programming is and write simple Python print statements.",
#         subject="Python",
#         course_level="beginner",
#         duration_weeks=2
#     )
#
#     print(json.dumps(curriculum.model_dump(), indent=4))
#
#     save_curriculum_to_database(curriculum, organization_id=1)
