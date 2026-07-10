import os
import json
import psycopg2

from dotenv import load_dotenv
from models import CurriculumAIOutput

load_dotenv()

def get_connection():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return psycopg2.connect(database_url)

    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )



def save_curriculum_to_database(curriculum: CurriculumAIOutput, organization_id: int = 1):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO courses
            (
                organization_id,
                title,
                subject,
                course_level,
                duration_weeks,
                description
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
            """,
            (
                organization_id,
                curriculum.course_title,
                curriculum.subject,
                curriculum.course_level,
                curriculum.duration_weeks,
                curriculum.description
            )
        )

        course_id = cursor.fetchone()[0]

        for module in curriculum.modules:
            cursor.execute(
                """
                INSERT INTO modules
                (
                    course_id,
                    title,
                    week_number,
                    learning_objective
                )
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    course_id,
                    module.title,
                    module.week_number,
                    module.learning_objective
                )
            )

            module_id = cursor.fetchone()[0]

            for lesson in module.lessons:
                ai_components = {
                    "warm_up": lesson.warm_up,
                    "code_demo": lesson.code_demo,
                    "guided_practice": lesson.guided_practice,
                    "independent_practice": lesson.independent_practice,
                    "exit_ticket": lesson.exit_ticket,
                    "activities_with_timestamps": [
                        activity.model_dump() for activity in lesson.activities
                    ]
                }

                cursor.execute(
                    """
                    INSERT INTO lesson_plans
                    (
                        module_id,
                        lesson_title,
                        day_number,
                        duration_minutes,
                        learning_objective,
                        lesson_content,
                        ai_components
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb)
                    RETURNING id;
                    """,
                    (
                        module_id,
                        lesson.lesson_title,
                        lesson.day_number,
                        lesson.duration_minutes,
                        lesson.learning_objective,
                        lesson.lesson_content,
                        json.dumps(ai_components)
                    )
                )

                lesson_plan_id = cursor.fetchone()[0]

                for activity in lesson.activities:
                    cursor.execute(
                        """
                        INSERT INTO activities
                        (
                            lesson_plan_id,
                            activity_title,
                            activity_type,
                            instructions,
                            duration_minutes
                        )
                        VALUES (%s, %s, %s, %s, %s);
                        """,
                        (
                            lesson_plan_id,
                            activity.activity_title,
                            activity.activity_type,
                            activity.instructions,
                            activity.duration_minutes
                        )
                    )

        assessment = curriculum.assessment

        ai_generated_questions = {
            "questions": [
                question.model_dump() for question in assessment.questions
            ]
        }

        cursor.execute(
            """
            INSERT INTO assessments
            (
                course_id,
                title,
                assessment_type,
                instructions,
                points_possible,
                ai_generated_questions
            )
            VALUES (%s, %s, %s, %s, %s, %s::jsonb)
            RETURNING id;
            """,
            (
                course_id,
                assessment.title,
                assessment.assessment_type,
                assessment.instructions,
                assessment.points_possible,
                json.dumps(ai_generated_questions)
            )
        )

        assessment_id = cursor.fetchone()[0]

        rubric = curriculum.rubric

        criteria_json = {
            "criteria": [
                criterion.model_dump() for criterion in rubric.criteria
            ]
        }

        cursor.execute(
            """
            INSERT INTO rubrics
            (
                assessment_id,
                title,
                criteria
            )
            VALUES (%s, %s, %s::jsonb);
            """,
            (
                assessment_id,
                rubric.title,
                json.dumps(criteria_json)
            )
        )

        conn.commit()
        print("AI-generated curriculum saved successfully.")

    except Exception as error:
        conn.rollback()
        print("Database error:")
        print(error)

    finally:
        cursor.close()
        conn.close()
