from handlers.handlers.competition import *
from handlers.handlers.teams import *
from handlers.handlers.matches import *
from handlers.handlers.sections import *
from handlers.handlers.questions import *
from handlers.handlers.summary import *
from handlers.handlers.group import *

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
    "updateSectionIndexes": handleUpdateSectionIndexes,

    "addQuestion": handleAddQuestion,
    "deleteQuestion": handleDeleteQuestion,
    "updateQuestion": handleUpdateQuestion,
    "moveQuestion": handleMoveQuestion,

    "updateSummary": handleUpdateSummary,

    "addInvite": handleAddInvite,
    "deleteInvite": handleDeleteInvite
}