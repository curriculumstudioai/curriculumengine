import json
import instructor

from openai import OpenAI
from dotenv import load_dotenv

from models import CurriculumAIOutput
from prompts import SYSTEM_PROMPT
from database import save_curriculum_to_database

load_dotenv()

client = instructor.from_openai(OpenAI())


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


if __name__ == "__main__":
    curriculum = generate_curriculum(
        learning_objective="Students will explain what programming is and write simple Python print statements.",
        subject="Python",
        course_level="beginner",
        duration_weeks=2
    )

    print(json.dumps(curriculum.model_dump(), indent=4))

    save_curriculum_to_database(curriculum, organization_id=1)
