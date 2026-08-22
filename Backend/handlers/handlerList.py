from handlers.handlers.competition import *
from handlers.handlers.teams import *
from handlers.handlers.matches import *
from handlers.handlers.sections import *
from handlers.handlers.questions import *

handlers = {
    "compCodeChange": handleCompCodeChange,
    "custom": handleCustom,

    "addTeam": handleAddTeam,
    "addTeams": handleAddTeams,
    "deleteTeam": handleDeleteTeam,

    "addMatch": handleAddMatch,
    "addMatches": handleAddMatches,
    "updateScore": handleUpdateScore,
    "deleteMatch": handleDeleteMatch,

    "addSection": handleAddSection,
    "deleteSection": handleDeleteSection,
    "updateSection": handleUpdateSection,

    "addQuestion": handleAddQuestion,
    "deleteQuestion": handleDeleteQuestion
}