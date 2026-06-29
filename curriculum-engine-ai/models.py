from pydantic import BaseModel, Field
from typing import List


class ActivityAI(BaseModel):
    activity_title: str
    activity_type: str
    start_time: str = Field(description="Example: 9:00 AM")
    end_time: str = Field(description="Example: 9:20 AM")
    instructions: str
    duration_minutes: int


class LessonPlanAI(BaseModel):
    lesson_title: str
    day_number: int
    duration_minutes: int
    learning_objective: str
    lesson_content: str
    warm_up: str
    code_demo: str
    guided_practice: str
    independent_practice: str
    exit_ticket: str
    activities: List[ActivityAI]


class ModuleAI(BaseModel):
    title: str
    week_number: int
    learning_objective: str
    lessons: List[LessonPlanAI]


class AssessmentQuestionAI(BaseModel):
    question: str
    answer: str


class AssessmentAI(BaseModel):
    title: str
    assessment_type: str
    instructions: str
    points_possible: int
    questions: List[AssessmentQuestionAI]


class RubricCriterionAI(BaseModel):
    category: str
    points: int
    description: str


class RubricAI(BaseModel):
    title: str
    criteria: List[RubricCriterionAI]


class CurriculumAIOutput(BaseModel):
    course_title: str
    subject: str
    course_level: str
    duration_weeks: int
    description: str
    modules: List[ModuleAI]
    assessment: AssessmentAI
    rubric: RubricAI
