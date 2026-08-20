from handlers.handlers.competition import *
from handlers.handlers.teams import *
from handlers.handlers.matches import *
from handlers.handlers.prescout import *

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
    "deleteSection": handleDeleteSection
}